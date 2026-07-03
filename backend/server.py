from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import json
import re
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ============ Models ============

class Attack(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    name: str
    year: int
    date_disclosed: str
    sector: str
    attack_type: str
    severity: str
    cve: str = "N/A"
    image: str
    summary_tr: str
    summary_en: str
    narrative_tr: str
    narrative_en: str
    timeline: List[Dict[str, Any]] = []
    kill_chain: List[Dict[str, Any]] = []
    iocs: List[Dict[str, Any]] = []
    lessons_tr: List[str] = []
    lessons_en: List[str] = []
    stats: Dict[str, Any] = {}
    curated: bool = True
    approved: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class SubmissionCreate(BaseModel):
    name: str
    year: int
    sector: str
    attack_type: str
    summary: str
    narrative: str
    submitter_name: str
    submitter_email: Optional[str] = ""


class Submission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    year: int
    sector: str
    attack_type: str
    summary: str
    narrative: str
    submitter_name: str
    submitter_email: Optional[str] = ""
    status: str = "pending"  # pending | approved | rejected
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class AIAnalyzeRequest(BaseModel):
    query: str
    language: str = "tr"  # tr | en


# ============ Seed data ============

@app.on_event("startup")
async def seed_attacks():
    from seed_data import ATTACKS
    for a in ATTACKS:
        existing = await db.attacks.find_one({"slug": a["slug"]})
        if existing:
            continue
        att = Attack(**a)
        await db.attacks.insert_one(att.model_dump())
    # Create indices
    await db.attacks.create_index("slug", unique=True)


# ============ Routes ============

@api_router.get("/")
async def root():
    return {"message": "Threat Chronicles API online"}


def _clean(doc):
    doc.pop("_id", None)
    return doc


@api_router.get("/attacks")
async def list_attacks(year: Optional[int] = None, sector: Optional[str] = None, q: Optional[str] = None):
    query: Dict[str, Any] = {"approved": True}
    if year:
        query["year"] = year
    if sector:
        query["sector"] = sector
    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"summary_tr": {"$regex": q, "$options": "i"}},
            {"summary_en": {"$regex": q, "$options": "i"}},
        ]
    docs = await db.attacks.find(query).sort("year", -1).to_list(500)
    return [_clean(d) for d in docs]


@api_router.get("/attacks/{slug}")
async def get_attack(slug: str):
    doc = await db.attacks.find_one({"slug": slug})
    if not doc:
        raise HTTPException(404, "Attack not found")
    return _clean(doc)


@api_router.get("/stats")
async def get_stats():
    total = await db.attacks.count_documents({"approved": True})
    docs = await db.attacks.find({"approved": True}).to_list(1000)
    total_cost = sum(int(d.get("stats", {}).get("estimated_cost_usd", 0) or 0) for d in docs)
    sectors: Dict[str, int] = {}
    years_map: Dict[int, int] = {}
    for d in docs:
        s = d.get("sector", "Other")
        sectors[s] = sectors.get(s, 0) + 1
        y = d.get("year", 0)
        years_map[y] = years_map.get(y, 0) + 1
    submissions = await db.submissions.count_documents({})
    return {
        "total_attacks": total,
        "total_cost_usd": total_cost,
        "sectors": sectors,
        "years": years_map,
        "submissions": submissions,
    }


@api_router.post("/submissions")
async def create_submission(payload: SubmissionCreate):
    sub = Submission(**payload.model_dump())
    await db.submissions.insert_one(sub.model_dump())
    return {"id": sub.id, "status": sub.status}


@api_router.get("/submissions")
async def list_submissions(status: Optional[str] = "approved"):
    query = {} if status == "all" else {"status": status}
    docs = await db.submissions.find(query).sort("created_at", -1).to_list(200)
    return [_clean(d) for d in docs]


# ============ AI Analyze (Claude Sonnet 4.5) ============

@api_router.post("/ai/analyze")
async def ai_analyze(req: AIAnalyzeRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(500, "AI backend not configured")

    from emergentintegrations.llm.chat import LlmChat, UserMessage

    lang_label = "Türkçe" if req.language == "tr" else "English"
    system_message = f"""You are ThreatChronicler, an expert cybersecurity historian and incident analyst.
Given a user query about a real-world cyber attack, produce a strictly valid JSON object (no markdown, no code fences) with this schema:
{{
  "name": string,
  "year": integer,
  "sector": string,
  "attack_type": string,
  "severity": one of "Critical"|"High"|"Medium"|"Low",
  "summary": short one-sentence summary,
  "narrative": 4-6 sentence dramatic storytelling narrative in {lang_label},
  "timeline": array of 5-8 objects with keys date (YYYY-MM-DD or YYYY-MM), phase, actor (attacker|defender|researcher|public), title, description (all in {lang_label}),
  "kill_chain": array of exactly 7 objects with keys phase (Reconnaissance|Weaponization|Delivery|Exploitation|Installation|C2|Actions) and activity (in {lang_label}),
  "iocs": array of 2-4 objects with keys type, value, description,
  "lessons": array of 3 short strings in {lang_label}
}}
Only output the raw JSON. If the attack is unknown or fictional, still produce a plausible reconstructed analysis but set "severity" to reflect uncertainty and mention it briefly in narrative."""

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"analyze-{uuid.uuid4()}",
        system_message=system_message,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    msg = UserMessage(text=f"Analyze this cyber attack: {req.query}")

    try:
        response = await chat.send_message(msg)
    except Exception as e:
        logging.exception("LLM error")
        raise HTTPException(502, f"AI service error: {str(e)[:200]}")

    text = response if isinstance(response, str) else str(response)
    # Strip potential code fences
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip(), flags=re.MULTILINE)
    # Find first { ... last }
    m = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if m:
        cleaned = m.group(0)
    try:
        data = json.loads(cleaned)
    except Exception:
        return {"raw": text, "error": "Could not parse AI response as JSON"}

    # Cache result
    await db.ai_analyses.insert_one({
        "id": str(uuid.uuid4()),
        "query": req.query,
        "language": req.language,
        "result": data,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return data


# ============ App wiring ============

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

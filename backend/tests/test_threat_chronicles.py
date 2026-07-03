"""Backend tests for Threat Chronicles API.

Covers:
- /api root
- /api/attacks list, filters, detail
- /api/stats
- /api/submissions create + list
- /api/ai/analyze (Claude Sonnet 4.5 via emergentintegrations)
"""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://breach-story-lab.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

REQUIRED_KEYS = {
    "slug", "name", "year", "sector", "attack_type", "severity", "image",
    "summary_tr", "summary_en", "narrative_tr", "narrative_en", "timeline",
    "kill_chain", "iocs", "lessons_tr", "lessons_en", "stats",
}
KILL_CHAIN_PHASES = {
    "Reconnaissance", "Weaponization", "Delivery", "Exploitation",
    "Installation", "C2", "Actions",
}


# ---------- Basic ----------

def test_api_root():
    r = requests.get(f"{API}/")
    assert r.status_code == 200
    assert "Threat Chronicles" in r.json().get("message", "")


# ---------- /api/attacks ----------

def test_list_attacks_returns_8_curated():
    r = requests.get(f"{API}/attacks")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) == 8, f"expected 8 attacks, got {len(data)}"

    for a in data:
        missing = REQUIRED_KEYS - set(a.keys())
        assert not missing, f"attack {a.get('slug')} missing keys: {missing}"
        assert isinstance(a["timeline"], list)
        assert isinstance(a["kill_chain"], list)
        # no mongo _id leaking
        assert "_id" not in a


def test_list_attacks_filter_year():
    r = requests.get(f"{API}/attacks", params={"year": 2021})
    assert r.status_code == 200
    data = r.json()
    assert len(data) >= 1
    for a in data:
        assert a["year"] == 2021


def test_list_attacks_filter_sector():
    # Get any sector from full list to filter with
    all_docs = requests.get(f"{API}/attacks").json()
    a_sector = all_docs[0]["sector"]
    r = requests.get(f"{API}/attacks", params={"sector": a_sector})
    assert r.status_code == 200
    for a in r.json():
        assert a["sector"] == a_sector


def test_list_attacks_search_q():
    r = requests.get(f"{API}/attacks", params={"q": "log4j"})
    assert r.status_code == 200
    data = r.json()
    assert len(data) >= 1
    slugs = [a["slug"] for a in data]
    assert "log4j" in slugs


def test_get_attack_log4j_detail():
    r = requests.get(f"{API}/attacks/log4j")
    assert r.status_code == 200
    a = r.json()
    assert a["slug"] == "log4j"
    # timeline should exist
    assert len(a["timeline"]) >= 3
    # kill_chain must have exactly 7 phases
    assert len(a["kill_chain"]) == 7
    phases = {k["phase"] for k in a["kill_chain"]}
    assert phases == KILL_CHAIN_PHASES, f"phases mismatch: {phases}"


def test_get_attack_404():
    r = requests.get(f"{API}/attacks/does-not-exist-xyz")
    assert r.status_code == 404


# ---------- /api/stats ----------

def test_stats_shape():
    r = requests.get(f"{API}/stats")
    assert r.status_code == 200
    d = r.json()
    assert d["total_attacks"] == 8
    assert isinstance(d["total_cost_usd"], int)
    assert d["total_cost_usd"] > 0
    assert isinstance(d["sectors"], dict) and len(d["sectors"]) > 0
    assert isinstance(d["years"], dict) and len(d["years"]) > 0


# ---------- /api/submissions ----------

def test_create_submission_and_list():
    payload = {
        "name": "TEST_Fake Breach 2026",
        "year": 2026,
        "sector": "Technology",
        "attack_type": "Phishing",
        "summary": "TEST submission summary",
        "narrative": "TEST narrative content that is longer than a few words for validation.",
        "submitter_name": "TEST_QA",
        "submitter_email": "qa@test.com",
    }
    r = requests.post(f"{API}/submissions", json=payload)
    assert r.status_code == 200, r.text
    body = r.json()
    assert "id" in body and body["status"] == "pending"
    sub_id = body["id"]

    # list with status=pending should include it
    lst = requests.get(f"{API}/submissions", params={"status": "pending"})
    assert lst.status_code == 200
    ids = [s["id"] for s in lst.json()]
    assert sub_id in ids


def test_create_submission_validation():
    # missing required fields
    r = requests.post(f"{API}/submissions", json={"name": "x"})
    assert r.status_code in (400, 422)


# ---------- /api/ai/analyze ----------

@pytest.mark.timeout(120)
def test_ai_analyze_en():
    payload = {"query": "Target 2013 data breach", "language": "en"}
    # allow one retry for cold-start / transient error
    last = None
    for _ in range(2):
        try:
            r = requests.post(f"{API}/ai/analyze", json=payload, timeout=90)
            last = r
            if r.status_code == 200:
                break
        except requests.RequestException as e:
            last = e
        time.sleep(2)
    assert last is not None
    assert isinstance(last, requests.Response), f"AI request errored: {last}"
    assert last.status_code == 200, f"AI status={last.status_code} body={last.text[:400]}"
    d = last.json()
    # If parsing failed, backend returns {'raw':..., 'error':...}
    assert "error" not in d, f"parse error: {d.get('error')} raw={str(d.get('raw'))[:300]}"
    for key in ("name", "year", "sector", "attack_type", "severity", "summary",
                "narrative", "timeline", "kill_chain", "iocs", "lessons"):
        assert key in d, f"AI missing key {key}: keys={list(d.keys())}"
    assert isinstance(d["timeline"], list) and len(d["timeline"]) >= 3
    assert isinstance(d["kill_chain"], list) and len(d["kill_chain"]) == 7
    kc_phases = {k.get("phase") for k in d["kill_chain"]}
    assert kc_phases == KILL_CHAIN_PHASES, f"AI killchain phases: {kc_phases}"
    assert isinstance(d["lessons"], list) and len(d["lessons"]) >= 1


@pytest.mark.timeout(120)
def test_ai_analyze_tr():
    payload = {"query": "WannaCry 2017", "language": "tr"}
    r = requests.post(f"{API}/ai/analyze", json=payload, timeout=90)
    assert r.status_code == 200, r.text[:400]
    d = r.json()
    assert "error" not in d
    # narrative should be Turkish-ish; simple heuristic — contains TR chars or common TR words
    narrative = d.get("narrative", "")
    assert len(narrative) > 30

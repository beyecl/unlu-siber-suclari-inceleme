import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TR } from '../i18n';
import { fetchAttack } from '../api';
import Timeline from '../components/Timeline';
import KillChain from '../components/KillChain';
import AttackFlow from '../components/AttackFlow';
import { ChevronLeft, Skull } from 'lucide-react';

export default function AttackDetail() {
  const { slug } = useParams();
  const { lang } = useApp();
  const [a, setA] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetchAttack(slug).then(setA).catch((e) => setErr(e.message));
  }, [slug]);

  if (err) return <div className="pt-32 text-center mono text-attack" data-testid="attack-error">{err}</div>;
  if (!a) return <div className="pt-32 text-center mono text-white/40" data-testid="attack-loading">Loading…</div>;

  const summary = lang === 'tr' ? a.summary_tr : a.summary_en;
  const narrative = lang === 'tr' ? a.narrative_tr : a.narrative_en;
  const lessons = lang === 'tr' ? a.lessons_tr : a.lessons_en;

  return (
    <div className="pb-24" data-testid={`attack-detail-${a.slug}`}>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end pb-20 pt-32">
        <img src={a.image} className="absolute inset-0 w-full h-full object-cover opacity-40" alt={a.name} />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/50 to-obsidian" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <Link to="/attacks" className="mono text-[11px] tracking-[0.25em] text-white/50 hover:text-white flex items-center gap-1 mb-6 uppercase">
            <ChevronLeft className="w-4 h-4" /> {TR.all_attacks[lang]}
          </Link>
          <div className="mono text-[11px] tracking-[0.3em] text-attack mb-4 flex items-center gap-2">
            <Skull className="w-4 h-4" />
            CASE FILE // {a.year} // {a.severity.toUpperCase()}
          </div>
          <h1 className="text-5xl sm:text-7xl font-light tracking-tighter mb-6">{a.name}</h1>
          <p className="text-xl text-white/80 max-w-3xl leading-relaxed">{summary}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 mt-10 border border-white/10">
            <Meta label="YEAR" value={a.year} />
            <Meta label="SECTOR" value={a.sector} />
            <Meta label="TYPE" value={a.attack_type} />
            <Meta label="CVE" value={a.cve} borderless />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-24">
        {/* Narrative */}
        <section>
          <div className="mono text-[11px] tracking-[0.3em] text-attack mb-4">// 01 · {TR.narrative[lang].toUpperCase()}</div>
          <p className="text-lg leading-relaxed text-white/85 max-w-4xl whitespace-pre-line" data-testid="attack-narrative">
            {narrative}
          </p>
        </section>

        {/* Attack Flow */}
        <section>
          <div className="mono text-[11px] tracking-[0.3em] text-attack mb-4">// 02 · ATTACK FLOW</div>
          <AttackFlow attackerLabel={a.kill_chain[0]?.phase ? 'THREAT ACTOR' : 'ATTACKER'} victimLabel={a.sector.toUpperCase()} middle={a.attack_type.toUpperCase()} />
        </section>

        {/* Timeline */}
        <section>
          <div className="mono text-[11px] tracking-[0.3em] text-attack mb-4">// 03 · {TR.timeline[lang].toUpperCase()}</div>
          <Timeline events={a.timeline || []} />
        </section>

        {/* Kill Chain */}
        <section>
          <div className="mono text-[11px] tracking-[0.3em] text-attack mb-4">// 04 · {TR.killchain[lang].toUpperCase()}</div>
          <KillChain chain={a.kill_chain || []} />
        </section>

        {/* IOCs */}
        {a.iocs?.length > 0 && (
          <section>
            <div className="mono text-[11px] tracking-[0.3em] text-attack mb-4">// 05 · {TR.iocs[lang].toUpperCase()}</div>
            <div className="border border-white/10 bg-surface divide-y divide-white/5">
              {a.iocs.map((ioc, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-4 p-4 mono text-xs" data-testid={`ioc-${idx}`}>
                  <span className="text-attack col-span-1">{ioc.type}</span>
                  <span className="text-white col-span-1 break-all">{ioc.value}</span>
                  <span className="text-white/50 col-span-2">{ioc.description}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lessons */}
        {lessons?.length > 0 && (
          <section>
            <div className="mono text-[11px] tracking-[0.3em] text-attack mb-4">// 06 · {TR.lessons[lang].toUpperCase()}</div>
            <ul className="space-y-4 max-w-3xl">
              {lessons.map((l, idx) => (
                <li key={idx} className="flex gap-4 border-l-2 border-attack/40 pl-5 py-2" data-testid={`lesson-${idx}`}>
                  <span className="mono text-attack text-sm">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="text-white/85 text-base leading-relaxed">{l}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

function Meta({ label, value, borderless }) {
  return (
    <div className={`p-4 ${!borderless ? 'md:border-r border-white/10' : ''}`}>
      <div className="mono text-[9px] tracking-[0.3em] text-white/40 uppercase mb-1">{label}</div>
      <div className="mono text-sm text-white">{value}</div>
    </div>
  );
}

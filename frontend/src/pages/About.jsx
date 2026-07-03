import React from 'react';
import { useApp } from '../context/AppContext';
import { TR } from '../i18n';

export default function About() {
  const { lang } = useApp();
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 lg:px-8" data-testid="about-page">
      <div className="mono text-[11px] tracking-[0.3em] text-attack mb-3">// META</div>
      <h1 className="text-5xl sm:text-6xl font-light tracking-tight mb-8">{TR.about_title[lang]}</h1>
      <p className="text-lg text-white/75 leading-relaxed max-w-3xl mb-10">{TR.about_body[lang]}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10">
        <Cell num="01" label="STORYTELLING" desc={lang === 'tr' ? 'Edebi dilde belgesel anlatım.' : 'Documentary-grade literary narration.'} />
        <Cell num="02" label="TIMELINE" desc={lang === 'tr' ? 'Dakika dakika kronoloji.' : 'Minute-by-minute chronology.'} />
        <Cell num="03" label="KILL CHAIN" desc={lang === 'tr' ? 'Lockheed Martin 7-fazlı çerçeve.' : 'Lockheed Martin 7-phase framework.'} borderless />
      </div>
    </div>
  );
}

function Cell({ num, label, desc, borderless }) {
  return (
    <div className={`p-6 ${!borderless ? 'md:border-r border-white/10' : ''}`}>
      <div className="mono text-[10px] tracking-[0.25em] text-attack mb-2">// {num}</div>
      <div className="mono text-sm tracking-[0.15em] text-white mb-3 uppercase">{label}</div>
      <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
    </div>
  );
}

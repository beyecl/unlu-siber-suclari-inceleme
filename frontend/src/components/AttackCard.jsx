import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TR } from '../i18n';
import { ArrowUpRight } from 'lucide-react';

export default function AttackCard({ attack, index = 0 }) {
  const { lang } = useApp();
  const summary = lang === 'tr' ? attack.summary_tr : attack.summary_en;
  return (
    <Link
      to={`/attacks/${attack.slug}`}
      data-testid={`attack-card-${attack.slug}`}
      className="group relative block border border-white/10 bg-surface hover:border-attack/60 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={attack.image} alt={attack.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        <div className="absolute top-3 left-3 mono text-[10px] tracking-[0.25em] px-2 py-1 bg-obsidian/80 border border-white/10">
          {String(index + 1).padStart(2, '0')} / {attack.year}
        </div>
        <div className="absolute top-3 right-3 mono text-[10px] tracking-[0.25em] px-2 py-1 bg-attack/90 text-obsidian font-medium">
          {attack.severity.toUpperCase()}
        </div>
      </div>
      <div className="p-5">
        <div className="mono text-[10px] tracking-[0.25em] text-white/40 mb-2">
          {attack.sector} · {attack.attack_type}
        </div>
        <h3 className="text-xl font-medium tracking-tight mb-2 group-hover:text-attack transition-colors">{attack.name}</h3>
        <p className="text-sm text-white/60 leading-relaxed line-clamp-3">{summary}</p>
        <div className="mt-4 flex items-center gap-1.5 mono text-[10px] tracking-[0.25em] text-white/50 group-hover:text-white">
          {TR.view_case[lang]}
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}

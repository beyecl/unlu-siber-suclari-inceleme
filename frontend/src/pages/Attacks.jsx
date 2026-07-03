import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { TR } from '../i18n';
import { fetchAttacks } from '../api';
import AttackCard from '../components/AttackCard';
import { Search } from 'lucide-react';

export default function Attacks() {
  const { lang } = useApp();
  const [all, setAll] = useState([]);
  const [q, setQ] = useState('');
  const [year, setYear] = useState('');
  const [sector, setSector] = useState('');

  useEffect(() => {
    fetchAttacks().then(setAll).catch(() => {});
  }, []);

  const years = useMemo(() => [...new Set(all.map((a) => a.year))].sort((a, b) => b - a), [all]);
  const sectors = useMemo(() => [...new Set(all.map((a) => a.sector))].sort(), [all]);

  const filtered = all.filter((a) => {
    const summary = (lang === 'tr' ? a.summary_tr : a.summary_en) || '';
    const matchQ = !q || a.name.toLowerCase().includes(q.toLowerCase()) || summary.toLowerCase().includes(q.toLowerCase());
    const matchY = !year || a.year === parseInt(year);
    const matchS = !sector || a.sector === sector;
    return matchQ && matchY && matchS;
  });

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 lg:px-8">
      <div className="mono text-[11px] tracking-[0.3em] text-attack mb-3">// ARCHIVE</div>
      <h1 className="text-5xl sm:text-6xl font-light tracking-tight mb-12">{TR.all_attacks[lang]}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-10 border border-white/10">
        <div className="md:col-span-2 flex items-center gap-2 px-4 py-3 border-r border-white/10">
          <Search className="w-4 h-4 text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={TR.search_ph[lang]}
            className="mono bg-transparent text-sm w-full text-white placeholder:text-white/30 focus:outline-none"
            data-testid="attacks-search"
          />
        </div>
        <select value={year} onChange={(e) => setYear(e.target.value)} className="mono text-xs bg-transparent border-r border-white/10 px-4 py-3 text-white focus:outline-none" data-testid="filter-year">
          <option value="" className="bg-obsidian">{TR.filter_year[lang]}: ALL</option>
          {years.map((y) => <option key={y} value={y} className="bg-obsidian">{y}</option>)}
        </select>
        <select value={sector} onChange={(e) => setSector(e.target.value)} className="mono text-xs bg-transparent px-4 py-3 text-white focus:outline-none" data-testid="filter-sector">
          <option value="" className="bg-obsidian">{TR.filter_sector[lang]}: ALL</option>
          {sectors.map((s) => <option key={s} value={s} className="bg-obsidian">{s}</option>)}
        </select>
      </div>

      <div className="mono text-[10px] tracking-[0.25em] text-white/40 mb-6 uppercase" data-testid="results-count">
        {filtered.length} / {all.length} cases
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((a, i) => <AttackCard key={a.slug} attack={a} index={i} />)}
      </div>
    </div>
  );
}

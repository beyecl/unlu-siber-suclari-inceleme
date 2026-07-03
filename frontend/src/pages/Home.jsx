import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { TR } from '../i18n';
import { fetchAttacks, fetchStats } from '../api';
import AttackCard from '../components/AttackCard';
import { ArrowRight, Sparkles, Terminal, Activity, Network } from 'lucide-react';

const heroImg = 'https://images.unsplash.com/photo-1542903660-eedba2cda473?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwzfHxjeWJlcnNlY3VyaXR5JTIwZGF0YSUyMGJyZWFjaCUyMGFic3RyYWN0fGVufDB8fHx8MTc4MzEwOTMyMXww&ixlib=rb-4.1.0&q=85';

function formatCost(usd) {
  if (!usd) return '—';
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(1)}B`;
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(1)}M`;
  return `$${usd}`;
}

export default function Home() {
  const { lang, setAiOpen } = useApp();
  const [attacks, setAttacks] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAttacks().then(setAttacks).catch(() => {});
    fetchStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[100vh] flex items-end pb-24 overflow-hidden" data-testid="hero-section">
        <img src={heroImg} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/60 to-obsidian" />
        <div className="absolute inset-0 scanlines opacity-30" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
            <div className="mono text-[11px] tracking-[0.35em] text-attack mb-6 flex items-center gap-2" data-testid="hero-kicker">
              <span className="w-8 h-px bg-attack" />
              {TR.hero_kicker[lang]}
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight mb-8" data-testid="hero-title">
              {TR.hero_title[lang]}
            </h1>
            <p className="text-lg text-white/70 max-w-2xl leading-relaxed mb-10">{TR.hero_sub[lang]}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/attacks" data-testid="hero-cta-archive" className="mono text-[11px] tracking-[0.25em] uppercase bg-attack text-obsidian hover:bg-white px-6 py-4 flex items-center gap-2 font-medium transition-colors">
                {TR.hero_cta[lang]} <ArrowRight className="w-4 h-4" />
              </Link>
              <button onClick={() => setAiOpen(true)} data-testid="hero-cta-ai" className="mono text-[11px] tracking-[0.25em] uppercase border border-white/30 hover:border-white text-white px-6 py-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> {TR.hero_cta2[lang]}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10">
            <StatCell icon={<Terminal className="w-4 h-4" />} label={TR.stat_attacks[lang]} value={String(stats.total_attacks).padStart(2, '0')} />
            <StatCell icon={<Activity className="w-4 h-4" />} label={TR.stat_cost[lang]} value={formatCost(stats.total_cost_usd)} />
            <StatCell icon={<Network className="w-4 h-4" />} label={TR.stat_sectors[lang]} value={String(Object.keys(stats.sectors).length).padStart(2, '0')} borderless />
          </div>
        </section>
      )}

      {/* Featured attacks */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="mono text-[11px] tracking-[0.3em] text-attack mb-3">// 001 / ARCHIVE</div>
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight">{TR.featured[lang]}</h2>
          </div>
          <Link to="/attacks" className="mono text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-white flex items-center gap-1">
            {TR.all_attacks[lang]} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attacks.slice(0, 6).map((a, i) => (
            <AttackCard key={a.slug} attack={a} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCell({ icon, label, value, borderless }) {
  return (
    <div className={`p-8 ${!borderless ? 'md:border-r border-white/10' : ''}`}>
      <div className="mono text-[10px] tracking-[0.25em] text-white/50 uppercase flex items-center gap-2 mb-3">{icon}{label}</div>
      <div className="text-5xl font-light tracking-tight mono">{value}</div>
    </div>
  );
}

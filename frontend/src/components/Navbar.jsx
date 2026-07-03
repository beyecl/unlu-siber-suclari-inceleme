import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TR } from '../i18n';
import { Sparkles, Languages, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const { lang, toggleLang, setAiOpen } = useApp();
  const tt = (k) => TR[k][lang];

  const linkCls = ({ isActive }) =>
    `mono text-[11px] tracking-[0.25em] uppercase transition-colors ${
      isActive ? 'text-attack' : 'text-white/60 hover:text-white'
    }`;

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" data-testid="brand-link">
          <ShieldAlert className="w-5 h-5 text-attack group-hover:animate-pulse-red" />
          <span className="mono text-sm tracking-[0.3em] font-medium">{TR.brand[lang]}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={linkCls} data-testid="nav-home">{tt('nav_home')}</NavLink>
          <NavLink to="/attacks" className={linkCls} data-testid="nav-attacks">{tt('nav_attacks')}</NavLink>
          <NavLink to="/submit" className={linkCls} data-testid="nav-submit">{tt('nav_submit')}</NavLink>
          <NavLink to="/about" className={linkCls} data-testid="nav-about">{tt('nav_about')}</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="mono text-[11px] tracking-[0.2em] text-white/70 hover:text-white flex items-center gap-1.5 border border-white/10 px-3 py-1.5 hover:border-white/40 transition-colors"
            data-testid="lang-switch-button"
          >
            <Languages className="w-3.5 h-3.5" />
            {lang.toUpperCase()}
          </button>
          <button
            onClick={() => setAiOpen(true)}
            className="mono text-[11px] tracking-[0.2em] text-obsidian bg-attack hover:bg-white transition-colors flex items-center gap-1.5 px-3 py-1.5 font-medium"
            data-testid="ai-trigger-button"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI
          </button>
        </div>
      </div>
    </header>
  );
}

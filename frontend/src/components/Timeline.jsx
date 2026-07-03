import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { TR } from '../i18n';

const actorColor = {
  attacker: 'text-attack border-attack/40',
  defender: 'text-defense border-defense/40',
  researcher: 'text-warning border-warning/40',
  public: 'text-white/70 border-white/20',
  developer: 'text-white/70 border-white/20',
};

export default function Timeline({ events = [] }) {
  const { lang } = useApp();
  return (
    <div className="relative pl-8" data-testid="attack-timeline">
      <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-attack via-white/20 to-defense" />
      {events.map((e, idx) => {
        const title = lang === 'tr' ? e.title_tr : e.title_en;
        const desc = lang === 'tr' ? e.description_tr : e.description_en;
        const ac = actorColor[e.actor] || 'text-white/70 border-white/20';
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="relative pb-10"
            data-testid={`timeline-event-${idx}`}
          >
            <div className={`absolute -left-[26px] top-1.5 w-3 h-3 rounded-full timeline-dot ${e.actor === 'defender' ? 'bg-defense' : e.actor === 'researcher' ? 'bg-warning' : 'bg-attack'}`} />
            <div className="flex flex-wrap items-baseline gap-3 mb-1">
              <span className="mono text-[11px] tracking-[0.15em] text-white/60">{e.date}</span>
              <span className={`mono text-[9px] tracking-[0.25em] px-1.5 py-0.5 border ${ac} uppercase`}>
                {TR.actor_labels[e.actor]?.[lang] || e.actor?.toUpperCase()}
              </span>
              <span className="mono text-[9px] tracking-[0.25em] text-white/40 uppercase">// {e.phase}</span>
            </div>
            <h4 className="text-lg font-medium tracking-tight text-white mb-1">{title}</h4>
            <p className="text-sm text-white/60 leading-relaxed max-w-2xl">{desc}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

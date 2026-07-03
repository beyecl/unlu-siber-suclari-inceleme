import React from 'react';
import { useApp } from '../context/AppContext';
import { TR } from '../i18n';
import { motion } from 'framer-motion';

const PHASES = ['Reconnaissance', 'Weaponization', 'Delivery', 'Exploitation', 'Installation', 'C2', 'Actions'];

export default function KillChain({ chain = [] }) {
  const { lang } = useApp();
  const byPhase = Object.fromEntries(chain.map((c) => [c.phase, c]));

  return (
    <div className="relative border border-white/10 bg-surface p-6" data-testid="kill-chain">
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <div className="tracing-beam w-1/3" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-0 relative">
        {PHASES.map((p, i) => {
          const activity = byPhase[p];
          const activityText = activity ? (lang === 'tr' ? activity.activity_tr : activity.activity_en) : '—';
          return (
            <motion.div
              key={p}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative p-4 border border-white/5 md:border-r-0 md:last:border-r md:border-b-0"
              data-testid={`killchain-phase-${p.toLowerCase()}`}
            >
              <div className="mono text-[9px] tracking-[0.3em] text-attack mb-1 uppercase">{String(i + 1).padStart(2, '0')}</div>
              <div className="mono text-[10px] tracking-[0.2em] text-white uppercase mb-3">{TR.phases[p]?.[lang] || p}</div>
              <p className="text-xs text-white/60 leading-relaxed">{activityText}</p>
              {i < PHASES.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-px bg-attack/40" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

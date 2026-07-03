import React from 'react';
import { motion } from 'framer-motion';

// Simple attacker → infrastructure → victim flow diagram
export default function AttackFlow({ attackerLabel = 'ATTACKER', victimLabel = 'VICTIM', middle = 'INFRASTRUCTURE' }) {
  return (
    <div className="border border-white/10 bg-surface p-6" data-testid="attack-flow">
      <div className="grid grid-cols-3 items-center gap-4">
        <Node color="attack" label={attackerLabel} icon="⌘" />
        <div className="relative h-12">
          <svg viewBox="0 0 200 40" className="w-full h-full" preserveAspectRatio="none">
            <motion.line
              x1="0" y1="20" x2="200" y2="20"
              stroke="#FF3B30" strokeWidth="1" strokeDasharray="4 4"
              initial={{ strokeDashoffset: 100 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <circle cx="100" cy="20" r="4" fill="#FF3B30" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center mono text-[9px] tracking-[0.3em] text-white/50 uppercase pointer-events-none">
            <span className="bg-surface px-2">{middle}</span>
          </div>
        </div>
        <Node color="defense" label={victimLabel} icon="◈" />
      </div>
    </div>
  );
}

function Node({ color, label, icon }) {
  const ring = color === 'attack' ? 'border-attack text-attack' : 'border-defense text-defense';
  return (
    <div className={`border ${ring} p-3 text-center bg-obsidian`}>
      <div className="mono text-2xl mb-1">{icon}</div>
      <div className="mono text-[10px] tracking-[0.25em] uppercase">{label}</div>
    </div>
  );
}

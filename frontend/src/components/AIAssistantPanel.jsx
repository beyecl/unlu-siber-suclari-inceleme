import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { useApp } from '../context/AppContext';
import { TR } from '../i18n';
import { aiAnalyze } from '../api';
import { Loader2, Sparkles, X } from 'lucide-react';
import Timeline from './Timeline';
import KillChain from './KillChain';

export default function AIAssistantPanel() {
  const { aiOpen, setAiOpen, lang } = useApp();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await aiAnalyze({ query, language: lang });
      if (data.error) setError(data.error);
      else setResult(data);
    } catch (e) {
      setError(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  // Adapt AI JSON into timeline & kill chain component shapes
  const timelineEvents = (result?.timeline || []).map((e) => ({
    date: e.date, phase: e.phase, actor: e.actor,
    title_tr: e.title, title_en: e.title, description_tr: e.description, description_en: e.description,
  }));
  const killChain = (result?.kill_chain || []).map((k) => ({
    phase: k.phase, activity_tr: k.activity, activity_en: k.activity,
  }));

  return (
    <Sheet open={aiOpen} onOpenChange={setAiOpen}>
      <SheetContent side="right" className="glass border-white/10 bg-obsidian/95 backdrop-blur-xl w-full sm:max-w-2xl overflow-y-auto p-0 text-white">
        <SheetHeader className="p-6 border-b border-white/10 sticky top-0 bg-obsidian/95 backdrop-blur-xl z-10">
          <SheetTitle className="flex items-center gap-2 text-white font-medium tracking-tight">
            <Sparkles className="w-4 h-4 text-attack" />
            {TR.ai_title[lang]}
          </SheetTitle>
          <p className="mono text-[10px] tracking-[0.25em] text-white/50 uppercase mt-2">
            Powered by Claude Sonnet 4.5
          </p>
        </SheetHeader>

        <div className="p-6 space-y-6">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder={TR.ai_placeholder[lang]}
              className="mono flex-1 bg-surface border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-attack focus:outline-none"
              data-testid="ai-input"
            />
            <button
              onClick={submit}
              disabled={loading}
              className="mono text-[11px] tracking-[0.2em] uppercase px-4 py-3 bg-attack hover:bg-white hover:text-obsidian text-obsidian font-medium disabled:opacity-50 flex items-center gap-2"
              data-testid="ai-submit-button"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? TR.ai_loading[lang] : TR.ai_button[lang]}
            </button>
          </div>

          {error && (
            <div className="mono text-xs text-attack border border-attack/40 p-3 bg-attack/5" data-testid="ai-error">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-6" data-testid="ai-result">
              <div className="border border-white/10 bg-surface p-5">
                <div className="mono text-[10px] tracking-[0.25em] text-white/50 uppercase mb-2">
                  {result.year} · {result.sector} · {result.severity}
                </div>
                <h3 className="text-2xl font-medium tracking-tight mb-2">{result.name}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{result.narrative}</p>
              </div>
              <div>
                <div className="mono text-[10px] tracking-[0.25em] text-attack mb-3 uppercase">{TR.timeline[lang]}</div>
                <Timeline events={timelineEvents} />
              </div>
              <div>
                <div className="mono text-[10px] tracking-[0.25em] text-attack mb-3 uppercase">{TR.killchain[lang]}</div>
                <KillChain chain={killChain} />
              </div>
              {result.iocs?.length > 0 && (
                <div>
                  <div className="mono text-[10px] tracking-[0.25em] text-attack mb-3 uppercase">{TR.iocs[lang]}</div>
                  <div className="border border-white/10 bg-surface divide-y divide-white/5">
                    {result.iocs.map((i, idx) => (
                      <div key={idx} className="p-3 mono text-xs">
                        <span className="text-attack">{i.type}:</span> <span className="text-white">{i.value}</span>
                        <div className="text-white/50 mt-1">{i.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {result.lessons?.length > 0 && (
                <div>
                  <div className="mono text-[10px] tracking-[0.25em] text-attack mb-3 uppercase">{TR.lessons[lang]}</div>
                  <ul className="space-y-2">
                    {result.lessons.map((l, idx) => (
                      <li key={idx} className="text-sm text-white/70 flex gap-3 border-l-2 border-attack/40 pl-3">
                        <span className="mono text-attack text-xs">{String(idx + 1).padStart(2, '0')}</span>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

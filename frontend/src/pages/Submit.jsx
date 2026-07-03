import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TR } from '../i18n';
import { submitContribution } from '../api';
import { toast, Toaster } from 'sonner';

export default function Submit() {
  const { lang } = useApp();
  const [form, setForm] = useState({
    name: '', year: new Date().getFullYear(), sector: '', attack_type: '',
    summary: '', narrative: '', submitter_name: '', submitter_email: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const setF = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContribution({ ...form, year: parseInt(form.year) });
      toast.success(TR.submitted_ok[lang]);
      setForm({ name: '', year: new Date().getFullYear(), sector: '', attack_type: '', summary: '', narrative: '', submitter_name: '', submitter_email: '' });
    } catch (err) {
      toast.error(err.response?.data?.detail || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "mono bg-surface border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-attack focus:outline-none w-full";

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 lg:px-8">
      <Toaster theme="dark" position="top-center" />
      <div className="mono text-[11px] tracking-[0.3em] text-attack mb-3">// CONTRIBUTE</div>
      <h1 className="text-5xl sm:text-6xl font-light tracking-tight mb-4">{TR.submit_title[lang]}</h1>
      <p className="text-white/60 max-w-2xl mb-12">{TR.submit_sub[lang]}</p>

      <form onSubmit={onSubmit} className="space-y-4" data-testid="submit-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required placeholder={TR.form_name[lang]} value={form.name} onChange={setF('name')} className={inputCls} data-testid="form-name" />
          <input required type="number" placeholder={TR.form_year[lang]} value={form.year} onChange={setF('year')} className={inputCls} data-testid="form-year" />
          <input required placeholder={TR.form_sector[lang]} value={form.sector} onChange={setF('sector')} className={inputCls} data-testid="form-sector" />
          <input required placeholder={TR.form_type[lang]} value={form.attack_type} onChange={setF('attack_type')} className={inputCls} data-testid="form-type" />
        </div>
        <input required placeholder={TR.form_summary[lang]} value={form.summary} onChange={setF('summary')} className={inputCls} data-testid="form-summary" />
        <textarea required rows={7} placeholder={TR.form_narrative[lang]} value={form.narrative} onChange={setF('narrative')} className={inputCls} data-testid="form-narrative" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required placeholder={TR.form_submitter[lang]} value={form.submitter_name} onChange={setF('submitter_name')} className={inputCls} data-testid="form-submitter" />
          <input type="email" placeholder={TR.form_email[lang]} value={form.submitter_email} onChange={setF('submitter_email')} className={inputCls} data-testid="form-email" />
        </div>
        <button
          disabled={submitting}
          className="mono text-[11px] tracking-[0.25em] uppercase bg-attack hover:bg-white text-obsidian px-8 py-4 font-medium disabled:opacity-50"
          type="submit"
          data-testid="form-submit"
        >
          {submitting ? '...' : TR.form_submit[lang]}
        </button>
      </form>
    </div>
  );
}

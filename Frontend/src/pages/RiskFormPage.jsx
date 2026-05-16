import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRiskById, createRisk, updateRisk } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';

const SEVERITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const PROBABILITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH'];
const CATEGORIES = ['Infrastructure', 'Cybersecurity', 'Financial', 'Operational', 'Compliance', 'Strategic'];
const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'MITIGATED', 'CLOSED'];

const SEVERITY_COLORS = {
  LOW: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', text: '#34d399', activeBg: '#10b981' },
  MEDIUM: { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.4)', text: '#c084fc', activeBg: '#a855f7' },
  HIGH: { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)', text: '#fb923c', activeBg: '#f97316' },
  CRITICAL: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', text: '#f87171', activeBg: '#ef4444' },
};

const STATUS_COLORS = {
  OPEN: { bg: 'rgba(6,182,212,0.15)', border: 'rgba(6,182,212,0.4)', text: '#22d3ee', activeBg: '#06b6d4' },
  IN_PROGRESS: { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)', text: '#fb923c', activeBg: '#f97316' },
  MITIGATED: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', text: '#34d399', activeBg: '#10b981' },
  CLOSED: { bg: 'rgba(100,116,139,0.15)', border: 'rgba(100,116,139,0.4)', text: '#94a3b8', activeBg: '#64748b' },
};

const CATEGORY_ICONS = {
  Infrastructure: '🏗️', Cybersecurity: '🛡️', Financial: '💰',
  Operational: '⚙️', Compliance: '📋', Strategic: '🎯',
};

/* ─── tiny section header ─── */
const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-5">
    <div style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)', width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
      {subtitle && <p className="text-2xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const RiskFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Infrastructure', riskScore: 5,
    impact: 'MEDIUM', likelihood: 'MEDIUM', mitigationPlan: '', status: 'OPEN', projectedCost: 50000,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => { if (isEditing) fetchRisk(); }, [id]);

  const fetchRisk = async () => {
    try {
      const data = await getRiskById(id);
      setFormData({
        title: data.title || '', description: data.description || '', category: data.category || 'Infrastructure',
        riskScore: data.riskScore || 5, impact: data.impact || 'MEDIUM', likelihood: data.likelihood || 'MEDIUM',
        mitigationPlan: data.mitigationPlan || '', status: data.status || 'OPEN', projectedCost: data.projectedCost || 50000,
      });
    } catch { setError(true); } finally { setLoading(false); }
  };

  const validate = () => {
    const e = {};
    if (!formData.title.trim()) e.title = 'Title is required';
    if (!formData.description.trim()) e.description = 'Description is required';
    if (!formData.category) e.category = 'Category is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (isEditing) {
        await updateRisk(id, formData);
        toast.success('Risk updated successfully');
        navigate(`/risks/${id}`);
      } else {
        const newRisk = await createRisk(formData);
        toast.success('Risk created successfully');
        navigate(`/risks/${newRisk.id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save risk');
    } finally { setSubmitting(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const getScoreColor = (s) => { if (s >= 8) return '#ef4444'; if (s >= 6) return '#f97316'; if (s >= 4) return '#a855f7'; return '#10b981'; };
  const getScoreLabel = (s) => { if (s >= 8) return 'CRITICAL'; if (s >= 6) return 'HIGH'; if (s >= 4) return 'MEDIUM'; return 'LOW'; };

  const formatCost = (val) => {
    if (!val) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
  };

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;
  if (error) return <EmptyState title="Risk not found" message="Unable to load the requested risk" />;

  const scoreColor = getScoreColor(formData.riskScore);
  const scorePercent = (formData.riskScore / 10) * 100;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="opacity-0 animate-fade-in-up">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-3 transition-colors group">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><polyline points="15 18 9 12 15 6" /></svg>
          <span className="section-title">Back to Scenarios</span>
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">{isEditing ? 'Edit Risk Scenario' : 'Create New Scenario'}</h1>
            <p className="text-sm text-slate-400 mt-1">{isEditing ? 'Modify scenario parameters and update the risk assessment' : 'Define a new risk scenario with detailed parameters'}</p>
          </div>
          {isEditing && (
            <span className="text-2xs text-slate-500 font-mono bg-[#050a15] px-3 py-1.5 rounded-lg border border-white/5">ID #{id}</span>
          )}
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Form ── */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Card 1: Core Details */}
            <div className="card p-6 opacity-0 animate-fade-in-up stagger-1">
              <SectionHeader
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050a15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
                title="Core Details"
                subtitle="Scenario identification and classification"
              />
              {/* Title */}
              <div className="mb-4">
                <label className="label">Scenario Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Regional Data Sync Failure" className="input" />
                {errors.title && <p className="text-[#f87171] text-xs mt-1.5 flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{errors.title}</p>}
              </div>

              {/* Category + Cost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Risk Category</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">{CATEGORY_ICONS[formData.category]}</span>
                    <select name="category" value={formData.category} onChange={handleChange} className="input pl-9" style={{ appearance: 'none' }}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
                <div>
                  <label className="label">Projected Cost (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₹</span>
                    <input type="number" name="projectedCost" value={formData.projectedCost} onChange={handleChange} className="input pl-7" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="label">Core Description</label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} placeholder="Detail the technical parameters and potential impact vectors..." className="input resize-y" />
                {errors.description && <p className="text-[#f87171] text-xs mt-1.5 flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{errors.description}</p>}
              </div>
            </div>

            {/* Card 2: Risk Assessment */}
            <div className="card p-6 opacity-0 animate-fade-in-up stagger-2">
              <SectionHeader
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050a15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
                title="Risk Assessment"
                subtitle="Evaluate severity, probability, and overall risk score"
              />

              {/* Risk Score Slider */}
              <div className="rounded-xl p-5 mb-5" style={{ background: `linear-gradient(135deg, ${scoreColor}10, ${scoreColor}05)`, border: `1px solid ${scoreColor}30` }}>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-300">Risk Score</label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold" style={{ color: scoreColor }}>{formData.riskScore}</span>
                    <span className="text-xs text-slate-500">/10</span>
                    <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ml-1" style={{ background: `${scoreColor}25`, color: scoreColor }}>{getScoreLabel(formData.riskScore)}</span>
                  </div>
                </div>
                <input
                  type="range" min="1" max="10" step="0.5"
                  value={formData.riskScore}
                  onChange={(e) => setFormData(p => ({ ...p, riskScore: parseFloat(e.target.value) }))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, ${scoreColor} 0%, ${scoreColor} ${scorePercent}%, #162d47 ${scorePercent}%, #162d47 100%)` }}
                />
                <div className="flex justify-between text-2xs text-slate-500 mt-2 px-0.5">
                  <span>1 — Low</span><span>4 — Medium</span><span>6 — High</span><span>8 — Critical</span>
                </div>
              </div>

              {/* Severity */}
              <div className="mb-5">
                <label className="label">Severity Level</label>
                <div className="grid grid-cols-4 gap-2 mt-1.5">
                  {SEVERITY_LEVELS.map(level => {
                    const active = formData.impact === level;
                    const c = SEVERITY_COLORS[level];
                    return (
                      <button key={level} type="button" onClick={() => setFormData(p => ({ ...p, impact: level }))}
                        className="py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200"
                        style={{
                          background: active ? c.activeBg : c.bg,
                          border: `1.5px solid ${active ? c.activeBg : c.border}`,
                          color: active ? '#050a15' : c.text,
                          boxShadow: active ? `0 4px 16px ${c.activeBg}40` : 'none',
                          transform: active ? 'scale(1.02)' : 'scale(1)',
                        }}>
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Probability */}
              <div>
                <label className="label">Probability Index</label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {PROBABILITY_LEVELS.map(level => {
                    const active = formData.likelihood === level;
                    const c = SEVERITY_COLORS[level];
                    return (
                      <button key={level} type="button" onClick={() => setFormData(p => ({ ...p, likelihood: level }))}
                        className="py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200"
                        style={{
                          background: active ? c.activeBg : c.bg,
                          border: `1.5px solid ${active ? c.activeBg : c.border}`,
                          color: active ? '#050a15' : c.text,
                          boxShadow: active ? `0 4px 16px ${c.activeBg}40` : 'none',
                          transform: active ? 'scale(1.02)' : 'scale(1)',
                        }}>
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Card 3: Status + Mitigation (conditionally show status for edit) */}
            <div className="card p-6 opacity-0 animate-fade-in-up stagger-3">
              <SectionHeader
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050a15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                title="Mitigation & Status"
                subtitle="Response plan and current lifecycle stage"
              />

              {/* Status (edit only) */}
              {isEditing && (
                <div className="mb-5">
                  <label className="label">Current Status</label>
                  <div className="grid grid-cols-4 gap-2 mt-1.5">
                    {STATUS_OPTIONS.map(s => {
                      const active = formData.status === s;
                      const c = STATUS_COLORS[s];
                      return (
                        <button key={s} type="button" onClick={() => setFormData(p => ({ ...p, status: s }))}
                          className="py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200"
                          style={{
                            background: active ? c.activeBg : c.bg,
                            border: `1.5px solid ${active ? c.activeBg : c.border}`,
                            color: active ? '#fff' : c.text,
                            boxShadow: active ? `0 4px 16px ${c.activeBg}40` : 'none',
                            transform: active ? 'scale(1.02)' : 'scale(1)',
                          }}>
                          {s.replace('_', ' ')}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mitigation Plan */}
              <div>
                <label className="label">Mitigation Plan</label>
                <textarea name="mitigationPlan" rows="4" value={formData.mitigationPlan} onChange={handleChange} placeholder="Describe the proposed mitigation strategy, remediation steps, responsible team, timeline, and success criteria..." className="input resize-y" />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 opacity-0 animate-fade-in-up stagger-4">
              <button type="button" onClick={() => navigate(-1)} className="btn-outline flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Discard
              </button>
              <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 px-8">
                {submitting ? (
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeDasharray="31.4" strokeDashoffset="10"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                )}
                {submitting ? 'Saving...' : isEditing ? 'Update Scenario' : 'Create Scenario'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="lg:col-span-1 space-y-5">
          {/* Live Preview Card */}
          <div className="card p-5 opacity-0 animate-fade-in-up stagger-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Live Preview</h3>
            </div>

            {/* Score Gauge */}
            <div className="flex items-center justify-center mb-4">
              <div className="relative" style={{ width: 120, height: 120 }}>
                <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#162d47" strokeWidth="8" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor} strokeWidth="8"
                    strokeDasharray={`${scorePercent * 3.14} 314`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.4s ease, stroke 0.4s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold" style={{ color: scoreColor }}>{formData.riskScore}</span>
                  <span className="text-2xs text-slate-500 font-semibold uppercase">{getScoreLabel(formData.riskScore)}</span>
                </div>
              </div>
            </div>

            {/* Preview Stats */}
            <div className="space-y-3">
              {[
                { label: 'Category', value: formData.category, icon: CATEGORY_ICONS[formData.category] },
                { label: 'Severity', value: formData.impact, color: SEVERITY_COLORS[formData.impact]?.text },
                { label: 'Probability', value: formData.likelihood, color: SEVERITY_COLORS[formData.likelihood]?.text },
                { label: 'Projected Cost', value: formatCost(formData.projectedCost) },
                ...(isEditing ? [{ label: 'Status', value: formData.status?.replace('_', ' '), color: STATUS_COLORS[formData.status]?.text }] : []),
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-2xs text-slate-500 uppercase tracking-wider font-semibold">{item.label}</span>
                  <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: item.color || '#f8fafc' }}>
                    {item.icon && <span>{item.icon}</span>}
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines Card */}
          <div className="card p-5 opacity-0 animate-fade-in-up stagger-3">
            <div className="flex items-center gap-2 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">System Guidelines</h3>
            </div>
            <ul className="space-y-3">
              {[
                'Define simulations with specific technical scope and verifiable data points.',
                'Cost projections should include both direct operational loss and MTTR estimates.',
                'Risk scores from 7.0+ are flagged as critical and trigger automated alerts.',
                'Mitigation plans should include timeline, responsible team, and success criteria.',
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)' }} />
                  <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskFormPage;
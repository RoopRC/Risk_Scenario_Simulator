import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRiskById, deleteRisk } from '../services/api';
import AIPanel from '../components/risks/AIPanel';
import AIInsights from '../components/risks/AIInsights';
import StatusBadge from '../components/risks/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { formatDateTime, formatRiskScore } from '../utils/formatters';
import toast from 'react-hot-toast';

const CATEGORY_ICONS = {
  Infrastructure: '🏗️', Cybersecurity: '🛡️', Financial: '💰',
  Operational: '⚙️', Compliance: '📋', Strategic: '🎯',
};

const SEVERITY_COLORS = {
  LOW: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
  MEDIUM: { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)', text: '#c084fc' },
  HIGH: { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.3)', text: '#fb923c' },
  CRITICAL: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#f87171' },
};

const RiskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => { fetchRisk(); }, [id]);

  const fetchRisk = async () => {
    try { setRisk(await getRiskById(id)); }
    catch { setError(true); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try { await deleteRisk(id); toast.success('Risk deleted'); navigate('/risks'); }
    catch { toast.error('Failed to delete risk'); }
  };

  const getScoreColor = (s) => { if (s >= 8) return '#ef4444'; if (s >= 6) return '#f97316'; if (s >= 4) return '#a855f7'; return '#10b981'; };
  const getScoreLabel = (s) => { if (s >= 8) return 'CRITICAL'; if (s >= 6) return 'HIGH'; if (s >= 4) return 'MEDIUM'; return 'LOW'; };

  const formatCost = (val) => {
    if (!val) return 'N/A';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${(val / 1000).toFixed(0)}K`;
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (error || !risk) return <EmptyState title="Risk not found" message="The requested risk scenario does not exist" />;

  const scoreColor = getScoreColor(risk.riskScore);
  const scorePercent = (risk.riskScore / 10) * 100;
  const impactColor = SEVERITY_COLORS[risk.impact] || SEVERITY_COLORS.MEDIUM;
  const likelihoodColor = SEVERITY_COLORS[risk.likelihood] || SEVERITY_COLORS.MEDIUM;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Header ── */}
      <div className="opacity-0 animate-fade-in-up">
        <button onClick={() => navigate('/risks')} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-3 transition-colors group">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><polyline points="15 18 9 12 15 6" /></svg>
          <span className="section-title">Back to Scenarios</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{CATEGORY_ICONS[risk.category] || '📊'}</span>
              <h1 className="text-2xl font-bold text-white">{risk.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={risk.status} />
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${scoreColor}20`, color: scoreColor, border: `1px solid ${scoreColor}30` }}>
                Score: {formatRiskScore(risk.riskScore)}
              </span>
              <span className="text-2xs text-slate-500 font-mono bg-[#050a15] px-2.5 py-1 rounded-lg border border-white/5">ID #{risk.id}</span>
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button onClick={() => navigate(`/risks/${id}/edit`)} className="btn-outline flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)} className="btn-outline flex items-center gap-2" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#f87171' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Delete
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={handleDelete} className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all" style={{ background: '#ef4444', color: '#fff' }}>Confirm</button>
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all text-slate-400 hover:text-white">Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="space-y-5">

          {/* Hero Score + Cost Card */}
          <div className="rounded-xl overflow-hidden opacity-0 animate-fade-in-up stagger-1" style={{ border: `1px solid ${scoreColor}25` }}>
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${scoreColor}, #06b6d4)` }} />
            <div className="p-6" style={{ background: `linear-gradient(135deg, ${scoreColor}08, ${scoreColor}03)` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative" style={{ width: 90, height: 90 }}>
                    <svg width="90" height="90" viewBox="0 0 90 90" className="-rotate-90">
                      <circle cx="45" cy="45" r="36" fill="none" stroke="#162d47" strokeWidth="7" />
                      <circle cx="45" cy="45" r="36" fill="none" stroke={scoreColor} strokeWidth="7"
                        strokeDasharray={`${scorePercent * 2.26} 226`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 0.5s ease' }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold" style={{ color: scoreColor }}>{risk.riskScore}</span>
                      <span className="text-2xs text-slate-500">/10</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Risk Assessment</p>
                    <p className="text-lg font-bold text-white">Score {formatRiskScore(risk.riskScore)}</p>
                    <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: `${scoreColor}20`, color: scoreColor }}>
                      {getScoreLabel(risk.riskScore)} Risk
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Projected Exposure</p>
                  <p className="text-2xl font-bold text-white">{formatCost(risk.projectedCost)}</p>
                  <p className="text-2xs text-slate-500 mt-1">{risk.projectedCost ? `₹${Number(risk.projectedCost).toLocaleString('en-IN')}` : ''}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description + Parameters Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Description Card */}
            <div className="card overflow-hidden opacity-0 animate-fade-in-up stagger-2">
              <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4)' }} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#050a15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Scenario Description</h3>
                </div>
                <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{risk.description}</p>
                {risk.mitigationPlan && (
                  <div className="mt-5 pt-5 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Mitigation Plan</h4>
                    </div>
                    <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{risk.mitigationPlan}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Risk Parameters Card */}
            <div className="card overflow-hidden opacity-0 animate-fade-in-up stagger-3">
              <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #a855f7, #06b6d4)' }} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#050a15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Risk Parameters</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="rounded-xl p-4" style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-2xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Category</p>
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      <span>{CATEGORY_ICONS[risk.category] || '📊'}</span>{risk.category}
                    </p>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-2xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Impact</p>
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: impactColor.bg, border: `1px solid ${impactColor.border}`, color: impactColor.text }}>{risk.impact || 'N/A'}</span>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-2xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Likelihood</p>
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: likelihoodColor.bg, border: `1px solid ${likelihoodColor.border}`, color: likelihoodColor.text }}>{risk.likelihood || 'N/A'}</span>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-2xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Status</p>
                    <StatusBadge status={risk.status} />
                  </div>
                  <div className="rounded-xl p-4" style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-2xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Created</p>
                    <p className="text-xs font-semibold text-white">{formatDateTime(risk.createdAt)}</p>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-2xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Last Updated</p>
                    <p className="text-xs font-semibold text-white">{formatDateTime(risk.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI-Powered Risk Intelligence */}
          <AIInsights riskId={risk.id} />

          {/* AI Risk Advisor + Chatbot */}
          <div className="opacity-0 animate-fade-in-up stagger-4">
            <AIPanel riskId={risk.id} riskTitle={risk.title} />
          </div>
      </div>
    </div>
  );
};

export default RiskDetail;
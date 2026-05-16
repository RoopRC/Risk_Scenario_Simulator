import React, { useState, useEffect } from 'react';
import { getAIInsights } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const SEV = {
  CRITICAL: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', text: '#f87171' },
  HIGH: { bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)', text: '#fb923c' },
  MODERATE: { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.25)', text: '#c084fc' },
  MEDIUM: { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.25)', text: '#facc15' },
  LOW: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', text: '#34d399' },
};

const AIInsights = ({ riskId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('impact');

  useEffect(() => { if (riskId) load(); }, [riskId]);

  const load = async () => {
    setLoading(true);
    try { setData(await getAIInsights(riskId)); }
    catch { toast.error('Failed to load AI insights'); }
    finally { setLoading(false); }
  };

  const fmt = (v) => {
    if (!v) return 'N/A';
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
    return `₹${(v / 1000).toFixed(0)}K`;
  };

  if (loading) return (
    <div className="card overflow-hidden">
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #a855f7, #06b6d4, #10b981)' }} />
      <div className="p-10 flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-xs text-slate-400 font-semibold">AI Engine Analyzing Risk...</p>
      </div>
    </div>
  );

  if (!data) return null;

  const { impactAnalysis: ia, solutions, summary, meta } = data;
  const sc = SEV[ia?.severityLevel] || SEV.MODERATE;
  const pct = ia?.severityPercent || 0;

  return (
    <div className="card overflow-hidden opacity-0 animate-fade-in-up stagger-4" style={{ border: '1px solid rgba(168,85,247,0.12)' }}>
      {/* Gradient accent */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #a855f7, #ec4899, #06b6d4, #10b981)' }} />

      <div className="p-6">
        {/* ─── Header Row ─── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(168,85,247,0.25)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93" /><path d="M8.24 9.93A4 4 0 0 1 12 2" />
                <path d="M5 11a2 2 0 0 0 0 4" /><path d="M19 11a2 2 0 0 1 0 4" />
                <path d="M12 18v4" /><path d="M8 22h8" /><circle cx="12" cy="13" r="3" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">AI-Powered Risk Intelligence</h3>
              <p className="text-2xs text-slate-500">{meta?.data_points_analyzed || 0} data points • {meta?.model_used} • {((meta?.confidence || 0) * 100).toFixed(0)}% confidence</p>
            </div>
          </div>
          <span className="text-2xs font-bold px-2.5 py-1 rounded-full" style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>
            {ia?.severityLevel} THREAT
          </span>
        </div>

        {/* ─── Alert Banner ─── */}
        <div className="rounded-lg p-3.5 mb-5 flex items-start gap-2.5" style={{ background: sc.bg, border: `1px solid ${sc.border}` }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={sc.text} strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: sc.text }}>{summary?.recommendation}</p>
        </div>

        {/* ─── Tab Switcher ─── */}
        <div className="flex gap-1 p-1 rounded-lg mb-5" style={{ background: '#0a0e1a' }}>
          {['impact', 'solutions'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all"
              style={{
                background: tab === t ? 'rgba(168,85,247,0.15)' : 'transparent',
                color: tab === t ? '#c084fc' : '#475569',
                border: tab === t ? '1px solid rgba(168,85,247,0.25)' : '1px solid transparent',
              }}>
              {t === 'impact' ? '⚡ Impact Analysis' : '🛡️ Solutions'}
            </button>
          ))}
        </div>

        {/* ═══════ IMPACT TAB ═══════ */}
        {tab === 'impact' && (
          <div className="space-y-5">
            {/* Top row: Gauge + Metrics + Impact Bars */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left: Gauge + Key Numbers */}
              <div className="rounded-xl p-5" style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-2xs text-slate-500 font-semibold uppercase tracking-wider mb-4">Threat Severity</p>
                <div className="flex items-center gap-5 mb-4">
                  <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                    <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="36" cy="36" r="28" fill="none" stroke="#162d47" strokeWidth="5" />
                      <circle cx="36" cy="36" r="28" fill="none" stroke={sc.text} strokeWidth="5"
                        strokeDasharray={`${pct * 1.76} 176`} strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 4px ${sc.text}40)` }} />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="text-base font-bold" style={{ color: sc.text }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    {[
                      { label: 'Exposure', value: fmt(summary?.estimatedAnnualLoss), color: '#f87171' },
                      { label: 'Mitigation', value: fmt(summary?.costOfMitigation), color: '#34d399' },
                      { label: 'ROI', value: summary?.roi, color: '#22d3ee' },
                      { label: 'Escalation', value: ia?.timeline?.escalationWindow, color: '#fb923c' },
                    ].map((m, i) => (
                      <div key={i} className="rounded-lg px-3 py-2" style={{ background: '#050a15', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <p className="text-2xs text-slate-600 uppercase tracking-wider" style={{ fontSize: '9px' }}>{m.label}</p>
                        <p className="text-xs font-bold" style={{ color: m.color }}>{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Timeline strip */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
                  {[
                    { l: 'Immediate', v: ia?.timeline?.immediateRisk, c: '#f87171' },
                    { l: 'Escalation', v: ia?.timeline?.escalationWindow, c: '#fb923c' },
                    { l: 'Full Impact', v: ia?.timeline?.fullImpactRealization, c: '#c084fc' },
                  ].map((t, i) => (
                    <div key={i} className="text-center">
                      <p className="text-2xs text-slate-600 uppercase tracking-wider mb-0.5" style={{ fontSize: '9px' }}>{t.l}</p>
                      <p className="text-2xs font-bold" style={{ color: t.c }}>{t.v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Impact Distribution */}
              <div className="rounded-xl p-5" style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-2xs text-slate-500 font-semibold uppercase tracking-wider mb-4">Impact Distribution</p>
                <div className="space-y-3">
                  {ia?.affectedAreas?.map((a, i) => {
                    const barColor = a.impact >= 70 ? 'linear-gradient(90deg, #ef4444, #f97316)' : a.impact >= 50 ? 'linear-gradient(90deg, #f97316, #eab308)' : 'linear-gradient(90deg, #10b981, #06b6d4)';
                    const txtColor = a.impact >= 70 ? '#f87171' : a.impact >= 50 ? '#fb923c' : '#34d399';
                    return (
                      <div key={i}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-xs text-slate-300">{a.name}</span>
                          <span className="text-xs font-bold" style={{ color: txtColor }}>{a.impact}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#162d47' }}>
                          <div className="h-full rounded-full" style={{ width: `${a.impact}%`, background: barColor, transition: 'width 1s ease-out' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Business Consequences */}
            <div>
              <p className="text-2xs text-slate-500 font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Business Consequences
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ia?.consequences?.map((c, i) => {
                  const cs = SEV[c.severity] || SEV.MEDIUM;
                  return (
                    <div key={i} className="rounded-lg p-4" style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white">{c.area}</span>
                        <span className="text-2xs font-bold px-2 py-0.5 rounded-full" style={{ background: cs.bg, border: `1px solid ${cs.border}`, color: cs.text, fontSize: '9px' }}>{c.severity}</span>
                      </div>
                      <p className="text-2xs text-slate-500 leading-relaxed">{c.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════ SOLUTIONS TAB ═══════ */}
        {tab === 'solutions' && (
          <div className="space-y-5">
            <div className="space-y-3">
              {solutions?.map((s, i) => {
                const efCol = s.effort === 'HIGH' ? '#f87171' : s.effort === 'MEDIUM' ? '#fb923c' : '#34d399';
                return (
                  <div key={i} className="rounded-lg p-4 flex gap-4" style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="flex-shrink-0 w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                      {s.priority}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-white mb-1">{s.title}</h5>
                      <p className="text-2xs text-slate-500 leading-relaxed mb-2.5">{s.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-2xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${efCol}15`, border: `1px solid ${efCol}25`, color: efCol, fontSize: '9px' }}>{s.effort} EFFORT</span>
                        <span className="text-2xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#22d3ee', fontSize: '9px' }}>⏱ {s.timeframe}</span>
                        <span className="text-2xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', fontSize: '9px' }}>↓{s.estimatedCostReduction}% cost</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ROI Summary */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
              {[
                { label: 'Current Exposure', value: fmt(summary?.estimatedAnnualLoss), color: '#f87171' },
                { label: 'Mitigation Cost', value: fmt(summary?.costOfMitigation), color: '#fb923c' },
                { label: 'Return on Investment', value: summary?.roi, color: '#34d399' },
              ].map((m, i) => (
                <div key={i} className="rounded-lg p-3 text-center" style={{ background: i === 2 ? 'rgba(16,185,129,0.06)' : '#0a0e1a', border: `1px solid ${i === 2 ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)'}` }}>
                  <p className="text-2xs text-slate-600 uppercase tracking-wider mb-1" style={{ fontSize: '9px' }}>{m.label}</p>
                  <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;

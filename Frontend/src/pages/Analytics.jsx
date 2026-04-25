import React, { useState, useEffect } from 'react';
import { getStats, exportCSV } from '../services/api';
import { RiskRadarChart, RiskTrendLineChart, MonthlyBarChart, StatusPieChart } from '../components/dashboard/Charts';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';

const PERIOD_OPTIONS = [
  { value: '1w', label: '1W' }, { value: '1m', label: '1M' }, { value: '3m', label: '3M' },
  { value: '6m', label: '6M' }, { value: '1y', label: '1Y' }, { value: 'all', label: 'All' },
];

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('6m');

  useEffect(() => { fetchStats(); }, [period]);

  const fetchStats = async () => {
    try { setStats(await getStats()); }
    catch { toast.error('Failed to load analytics data'); }
    finally { setLoading(false); }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await exportCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `risks_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported');
    } catch { toast.error('Failed to export CSV'); }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!stats) return <EmptyState title="No analytics data" message="Unable to load analytics" />;

  const formatCurrency = (v) => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : `$${(v/1000).toFixed(0)}K`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 opacity-0 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Risk Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Detailed intelligence projections and operational health metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="btn-outline flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-card">
            {PERIOD_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setPeriod(opt.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${period === opt.value ? 'bg-navy-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Projected Risk Value', value: formatCurrency(stats.totalExposure || 0), sub: <span className="text-xs text-emerald-400 font-medium">↑ 14.2% Optimisation</span> },
          { label: 'Avg Risk Score', value: `${stats.avgRiskScore || 0}/10`, sub: <span className="text-xs text-slate-500">Across {stats.totalRisks || 0} scenarios</span> },
          { label: 'Open Mitigation Tasks', value: stats.openRisks || 0, sub: <span className="text-xs text-rose-400 font-medium">⚠ {stats.criticalRisks || 0} Critical Priority</span> },
        ].map((card, i) => (
          <div key={i} className={`stat-card bg-gradient-to-br from-[#222831] to-[#393E46] text-[#DFD0B8] border-[#393E46] opacity-0 animate-fade-in-up stagger-${i+1}`}>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">{card.label}</p>
            <p className="text-3xl font-bold">{card.value}</p>
            <div className="mt-2">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5 opacity-0 animate-fade-in-up stagger-4">
          <div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 rounded-full bg-[#948979]"></span><h3 className="section-title">Category Distribution</h3></div>
          <p className="text-xs text-gray-400 mb-3">Risk scenarios by category</p>
          {stats.statusBreakdown ? <StatusPieChart data={stats.statusBreakdown} /> : <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No data</div>}
        </div>
        <div className="card p-5 opacity-0 animate-fade-in-up stagger-5">
          <div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 rounded-full bg-[#948979]"></span><h3 className="section-title">Risk Trend Projection</h3></div>
          <p className="text-xs text-gray-400 mb-3">Scenario volume over time</p>
          <RiskTrendLineChart />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-5 opacity-0 animate-fade-in-up stagger-6">
          <div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 rounded-full bg-[#948979]"></span><h3 className="section-title">Monthly Risk Volume</h3></div>
          <p className="text-xs text-gray-400 mb-3">New scenarios registered per month</p>
          <MonthlyBarChart />
        </div>
        <div className="card p-5 opacity-0 animate-fade-in-up stagger-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-4">Strategic Insights</h3>
          <div className="space-y-3">
            <div className="bg-rose-50 rounded-lg p-3 border border-rose-100">
              <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">Cybersecurity Focus</p>
              <p className="text-xs text-gray-600 leading-relaxed">Critical vulnerabilities detected in infrastructure. Prioritize patching cycles.</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Efficiency Gain</p>
              <p className="text-xs text-gray-600 leading-relaxed">Automated risk scoring reduced assessment time by 40% this quarter.</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Compliance Alert</p>
              <p className="text-xs text-gray-600 leading-relaxed">3 regulatory deadlines approaching in the next 60 days. Review compliance backlog.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStats, getRisks } from '../services/api';
import KPICard from '../components/dashboard/KPICard';
import { TrendLineChart, StatusPieChart } from '../components/dashboard/Charts';
import RiskHeatMap from '../components/dashboard/RiskHeatMap';
import RiskComparison from '../components/dashboard/RiskComparison';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const [statsData, risksData] = await Promise.all([
        getStats(),
        getRisks({ page: 0, size: 100 })
      ]);
      setStats(statsData);
      setRisks(risksData.content || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center py-20"><LoadingSpinner size="lg" /></div>;
  if (error || !stats) return <EmptyState title="Unable to load dashboard" message="Please try again later" />;

  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
  };

  const kpis = [
    { title: 'Total Scenarios', value: stats.totalRisks || 0, icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>), color: 'blue', trend: { positive: true, value: 12 } },
    { title: 'Active Risks', value: stats.openRisks || 0, icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>), color: 'green', trend: { positive: false, value: 8 } },
    { title: 'Critical Alerts', value: stats.criticalRisks || 0, icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>), color: 'red', trend: { positive: false, value: 5 } },
    { title: 'Total Exposure', value: formatCurrency(stats.totalExposure || 0), icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>), color: 'purple', trend: { positive: false, value: 18 } },
  ];

  const trendData = stats.monthlyTrend || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 opacity-0 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-200 mt-1">Real-time insights and monitoring for risk scenarios across all sectors.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/reports')} className="btn-outline">Download Report</button>
          <button onClick={() => navigate('/risks/new')} className="btn-primary">New Scenario</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className={`opacity-0 animate-fade-in-up stagger-${idx + 1}`}>
            <KPICard {...kpi} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-5 opacity-0 animate-fade-in-up stagger-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              <h3 className="section-title">Risk Evolution Trend</h3>
            </div>
          </div>
          {trendData.length > 0 ? (
            <TrendLineChart data={trendData} />
          ) : (
            <div className="flex items-center justify-center h-52 text-slate-400 text-sm">
              <p>No trend data available.</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-5 opacity-0 animate-fade-in-up stagger-6">
            <h3 className="section-title mb-3">Risk Distribution</h3>
            {stats.statusBreakdown && stats.statusBreakdown.length > 0 ? (
              <StatusPieChart data={stats.statusBreakdown} />
            ) : (
              <div className="h-32 flex items-center justify-center text-slate-400 text-sm">No distribution data</div>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#162d47] to-[#1e3a5f] rounded-xl p-5 relative overflow-hidden shadow-lg opacity-0 animate-fade-in-up stagger-6" style={{ border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div className="absolute top-3 right-3 opacity-[0.06]">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="#ffffff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-white">Neural Advisor</h3>
            <p className="text-xs text-slate-200 leading-relaxed mb-4">
              AI analysis suggests {stats.criticalRisks || 0} critical scenarios require immediate attention. Avg risk score: {stats.avgRiskScore || 'N/A'}/10.
            </p>
            <button onClick={() => navigate('/risks')} className="w-full bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:shadow-lg transition-all active:scale-[0.97]">
              View All Scenarios
            </button>
          </div>
        </div>
      </div>

      {/* Risk Heat Map and Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="opacity-0 animate-fade-in-up stagger-7">
          <RiskHeatMap risks={risks} />
        </div>
        <div className="opacity-0 animate-fade-in-up stagger-7">
          <RiskComparison risks={risks} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
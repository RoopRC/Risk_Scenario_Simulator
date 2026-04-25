import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRiskById, deleteRisk } from '../services/api';
import AIPanel from '../components/risks/AIPanel';
import StatusBadge from '../components/risks/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { formatDateTime, formatRiskScore } from '../utils/formatters';
import toast from 'react-hot-toast';

const RiskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => { fetchRisk(); }, [id]);

  const fetchRisk = async () => {
    try { setRisk(await getRiskById(id)); }
    catch { setError(true); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this risk scenario?')) {
      try { await deleteRisk(id); toast.success('Risk deleted'); navigate('/risks'); }
      catch { toast.error('Failed to delete risk'); }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-[#E05A4A]';
    if (score >= 6) return 'text-[#E8B84A]';
    if (score >= 4) return 'text-[#948979]';
    return 'text-[#5CB87A]';
  };

  const getScoreBg = (score) => {
    if (score >= 8) return 'bg-[#E05A4A]/10 border-[#E05A4A]/20';
    if (score >= 6) return 'bg-[#E8B84A]/10 border-[#E8B84A]/20';
    if (score >= 4) return 'bg-[#948979]/10 border-[#948979]/20';
    return 'bg-[#5CB87A]/10 border-[#5CB87A]/20';
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (error || !risk) return <EmptyState title="Risk not found" message="The requested risk scenario does not exist" />;

  const formatCost = (val) => {
    if (!val) return 'N/A';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${(val / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="opacity-0 animate-fade-in-up">
        <button onClick={() => navigate('/risks')} className="flex items-center gap-2 text-sm text-[#6B8A9C] hover:text-[#DFD0B8] mb-3 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          <span className="section-title">Back to Scenarios</span>
        </button>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#DFD0B8]">{risk.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <StatusBadge status={risk.status} />
              <span className={`text-sm font-bold ${getScoreColor(risk.riskScore)}`}>Score: {formatRiskScore(risk.riskScore)}</span>
              <span className="text-xs text-[#6B8A9C]">ID: #{risk.id}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate(`/risks/${id}/edit`)} className="btn-outline">Edit Scenario</button>
            <button onClick={handleDelete} className="btn-danger">Delete</button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Risk Score Card */}
          <div className={`rounded-xl p-5 border ${getScoreBg(risk.riskScore)} opacity-0 animate-fade-in-up stagger-1`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xs text-[#6B8A9C] font-semibold uppercase tracking-wider mb-1">Risk Assessment Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(risk.riskScore)}`}>{risk.riskScore}/10</p>
              </div>
              <div className="text-right">
                <p className="text-2xs text-[#6B8A9C] font-semibold uppercase tracking-wider mb-1">Projected Exposure</p>
                <p className="text-2xl font-bold text-[#DFD0B8]">{formatCost(risk.projectedCost)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card p-6 opacity-0 animate-fade-in-up stagger-2">
            <h3 className="section-title mb-3">Description</h3>
            <p className="text-sm text-[#A3B8C2] whitespace-pre-wrap leading-relaxed">{risk.description}</p>
          </div>

          {/* Risk Parameters */}
          <div className="card p-6 opacity-0 animate-fade-in-up stagger-3">
            <h3 className="section-title mb-4">Risk Parameters</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Category', value: risk.category },
                { label: 'Impact', value: risk.impact || 'N/A' },
                { label: 'Likelihood', value: risk.likelihood || 'N/A' },
                { label: 'Created', value: formatDateTime(risk.createdAt) },
                { label: 'Last Updated', value: formatDateTime(risk.updatedAt) },
                { label: 'Status', value: risk.status?.replace('_', ' ') || 'N/A' },
              ].map((item, i) => (
                <div key={i} className="bg-[#1B3040] rounded-lg p-3">
                  <p className="text-2xs text-[#6B8A9C] font-semibold uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-[#DFD0B8]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mitigation Plan */}
          {risk.mitigationPlan && (
            <div className="card p-6 opacity-0 animate-fade-in-up stagger-4">
              <h3 className="section-title mb-3">Mitigation Plan</h3>
              <p className="text-sm text-[#A3B8C2] whitespace-pre-wrap leading-relaxed">{risk.mitigationPlan}</p>
            </div>
          )}
        </div>

        {/* AI Panel */}
        <div className="lg:col-span-1 opacity-0 animate-fade-in-up stagger-3">
          <AIPanel riskId={risk.id} riskTitle={risk.title} />
        </div>
      </div>
    </div>
  );
};

export default RiskDetail;
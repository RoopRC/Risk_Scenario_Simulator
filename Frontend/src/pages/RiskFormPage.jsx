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

  const getScoreColor = (score) => {
    if (score >= 8) return '#ef4444';
    if (score >= 6) return '#f97316';
    if (score >= 4) return '#a855f7';
    return '#10b981';
  };

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;
  if (error) return <EmptyState title="Risk not found" message="Unable to load the requested risk" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="opacity-0 animate-fade-in-up">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-200 hover:text-white mb-2 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          <span className="section-title">Scenario Builder</span>
        </button>
        <h1 className="text-2xl font-bold text-white">{isEditing ? 'Edit Scenario' : 'Create New Scenario'}</h1>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="card p-6 space-y-6 opacity-0 animate-fade-in-up stagger-1">
              {/* Title */}
              <div>
                <label className="label">Scenario Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Regional Data Sync Failure" className="input" />
                {errors.title && <p className="text-[#E05A4A] text-xs mt-1">{errors.title}</p>}
              </div>

              {/* Category + Cost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Risk Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="input">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
                </div>
                <div>
                  <label className="label">Projected Cost (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm">₹</span>
                    <input type="number" name="projectedCost" value={formData.projectedCost} onChange={handleChange} className="input pl-7" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="label">Core Description</label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} placeholder="Detail the technical parameters and potential impact vectors..." className="input resize-y" />
                {errors.description && <p className="text-[#E05A4A] text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Risk Score Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Risk Score</label>
                  <span className="text-lg font-bold" style={{ color: getScoreColor(formData.riskScore) }}>{formData.riskScore}/10</span>
                </div>
                <input
                  type="range" min="1" max="10" step="0.5"
                  value={formData.riskScore}
                  onChange={(e) => setFormData(p => ({ ...p, riskScore: parseFloat(e.target.value) }))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${getScoreColor(formData.riskScore)} 0%, ${getScoreColor(formData.riskScore)} ${(formData.riskScore / 10) * 100}%, #162d47 ${(formData.riskScore / 10) * 100}%, #162d47 100%)`,
                  }}
                />
                <div className="flex justify-between text-2xs text-slate-300 mt-1">
                  <span>Low Risk</span><span>Medium</span><span>High Risk</span><span>Critical</span>
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="label">Severity Level</label>
                <div className="flex gap-2 mt-1">
                  {SEVERITY_LEVELS.map(level => (
                    <button key={level} type="button" onClick={() => setFormData(p => ({ ...p, impact: level }))}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${formData.impact === level ? 'bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-white' : 'bg-[#162d47] text-slate-400 hover:bg-[#1e3a5f] hover:text-white'}`}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Probability */}
              <div>
                <label className="label">Probability Index</label>
                <div className="flex gap-2 mt-1">
                  {PROBABILITY_LEVELS.map(level => (
                    <button key={level} type="button" onClick={() => setFormData(p => ({ ...p, likelihood: level }))}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${formData.likelihood === level ? 'bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-white' : 'bg-[#162d47] text-slate-400 hover:bg-[#1e3a5f] hover:text-white'}`}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              {isEditing && (
                <div>
                  <label className="label">Status</label>
                  <div className="flex gap-2 mt-1">
                    {STATUS_OPTIONS.map(s => (
                      <button key={s} type="button" onClick={() => setFormData(p => ({ ...p, status: s }))}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${formData.status === s ? 'bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-white' : 'bg-[#162d47] text-slate-400 hover:bg-[#1e3a5f] hover:text-white'}`}>
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mitigation Plan */}
              <div>
                <label className="label">Mitigation Plan</label>
                <textarea name="mitigationPlan" rows="3" value={formData.mitigationPlan} onChange={handleChange} placeholder="Describe the proposed mitigation strategy and remediation steps..." className="input resize-y" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 mt-6 opacity-0 animate-fade-in-up stagger-2">
              <button type="button" onClick={() => navigate(-1)} className="text-sm text-slate-200 hover:text-white font-medium uppercase tracking-wider transition-colors">Discard Changes</button>
              <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 px-8">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                {submitting ? 'Saving...' : 'Confirm & Register'}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 opacity-0 animate-fade-in-up stagger-3">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">System Guidelines</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span><p className="text-xs text-slate-400 leading-relaxed">Define simulations with specific technical scope and verifiable data points.</p></li>
              <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span><p className="text-xs text-slate-400 leading-relaxed">Cost projections should include both direct operational loss and MTTR estimates.</p></li>
              <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span><p className="text-xs text-slate-400 leading-relaxed">Risk scores from 7.0+ are flagged as critical and trigger automated alerts.</p></li>
              <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span><p className="text-xs text-slate-400 leading-relaxed">Mitigation plans should include timeline, responsible team, and success criteria.</p></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskFormPage;
import React, { useState } from 'react';

const RiskComparison = ({ risks = [] }) => {
  const [selectedRisks, setSelectedRisks] = useState([]);
  const [showSelector, setShowSelector] = useState(true);

  const handleSelectRisk = (riskId) => {
    if (selectedRisks.includes(riskId)) {
      setSelectedRisks(selectedRisks.filter(id => id !== riskId));
    } else if (selectedRisks.length < 4) {
      setSelectedRisks([...selectedRisks, riskId]);
    }
  };

  const handleClear = () => {
    setSelectedRisks([]);
  };

  const comparisonRisks = risks.filter(r => selectedRisks.includes(r.id));

  const getRiskColor = (score) => {
    if (score >= 8.5) return 'text-red-400';
    if (score >= 7) return 'text-orange-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (comparisonRisks.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Risk Comparison</h3>
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
          >
            {showSelector ? 'Hide' : 'Show'} Selector
          </button>
        </div>

        {showSelector && (
          <div>
            <p className="text-slate-300 mb-4">Select up to 4 risks to compare</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {risks.slice(0, 10).map(risk => (
                <label
                  key={risk.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedRisks.includes(risk.id)
                      ? 'bg-emerald-500/15 border border-emerald-500/30'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRisks.includes(risk.id)}
                    onChange={() => handleSelectRisk(risk.id)}
                    disabled={selectedRisks.length >= 4 && !selectedRisks.includes(risk.id)}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{risk.title}</p>
                    <p className="text-xs text-slate-400">{risk.category}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Risk Comparison ({comparisonRisks.length})</h3>
        <button
          onClick={handleClear}
          className="text-red-400 hover:text-red-300 text-sm font-medium"
        >
          Clear
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-white/10">
              <th className="text-left py-3 px-2 font-semibold text-white">Attribute</th>
              {comparisonRisks.map((risk) => (
                <th key={risk.id} className="text-center py-3 px-2 font-semibold text-white max-w-xs">
                  <div className="truncate">{risk.title.substring(0, 20)}...</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-2 font-medium text-white">Risk Score</td>
              {comparisonRisks.map(risk => (
                <td key={risk.id} className="text-center py-3 px-2">
                  <span className={`font-bold text-lg ${getRiskColor(risk.riskScore)}`}>
                    {risk.riskScore.toFixed(1)}
                  </span>
                </td>
              ))}
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-2 font-medium text-white">Status</td>
              {comparisonRisks.map(risk => (
                <td key={risk.id} className="text-center py-3 px-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    risk.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                    risk.status === 'OPEN' ? 'bg-yellow-500/20 text-yellow-400' :
                    risk.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
                    risk.status === 'MITIGATED' ? 'bg-green-500/20 text-green-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {risk.status}
                  </span>
                </td>
              ))}
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-2 font-medium text-white">Impact</td>
              {comparisonRisks.map(risk => (
                <td key={risk.id} className="text-center py-3 px-2">
                  <span className="font-medium text-slate-200">{risk.impact}</span>
                </td>
              ))}
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-2 font-medium text-white">Likelihood</td>
              {comparisonRisks.map(risk => (
                <td key={risk.id} className="text-center py-3 px-2">
                  <span className="font-medium text-slate-200">{risk.likelihood}</span>
                </td>
              ))}
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-2 font-medium text-white">Category</td>
              {comparisonRisks.map(risk => (
                <td key={risk.id} className="text-center py-3 px-2">
                  <span className="text-slate-300">{risk.category}</span>
                </td>
              ))}
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-2 font-medium text-white">Projected Cost</td>
              {comparisonRisks.map(risk => (
                <td key={risk.id} className="text-center py-3 px-2">
                  <span className="font-medium text-emerald-400">
                    ₹{(risk.projectedCost / 100000).toFixed(1)}L
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        {comparisonRisks.map(risk => (
          <button
            key={risk.id}
            onClick={() => handleSelectRisk(risk.id)}
            className="px-3 py-1 bg-white/10 text-slate-200 rounded-full text-sm hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            {risk.title.substring(0, 15)}...
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RiskComparison;

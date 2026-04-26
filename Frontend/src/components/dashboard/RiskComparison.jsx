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
    if (score >= 8.5) return 'text-red-600';
    if (score >= 7) return 'text-orange-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (comparisonRisks.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Risk Comparison</h3>
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showSelector ? 'Hide' : 'Show'} Selector
          </button>
        </div>

        {showSelector && (
          <div>
            <p className="text-slate-200 mb-4">Select up to 4 risks to compare</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {risks.slice(0, 10).map(risk => (
                <label key={risk.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRisks.includes(risk.id)}
                    onChange={() => handleSelectRisk(risk.id)}
                    disabled={selectedRisks.length >= 4 && !selectedRisks.includes(risk.id)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{risk.title}</p>
                    <p className="text-xs text-slate-200">{risk.category}</p>
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
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Clear
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="text-left py-3 px-2 font-semibold text-white">Attribute</th>
              {comparisonRisks.map((risk) => (
                <th key={risk.id} className="text-center py-3 px-2 font-semibold text-white max-w-xs">
                  <div className="truncate">{risk.title.substring(0, 20)}...</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 px-2 font-medium text-white">Risk Score</td>
              {comparisonRisks.map(risk => (
                <td key={risk.id} className="text-center py-3 px-2">
                  <span className={`font-bold text-lg ${getRiskColor(risk.riskScore)}`}>
                    {risk.riskScore.toFixed(1)}
                  </span>
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 px-2 font-medium text-white">Status</td>
              {comparisonRisks.map(risk => (
                <td key={risk.id} className="text-center py-3 px-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    risk.status === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                    risk.status === 'OPEN' ? 'bg-yellow-100 text-yellow-700' :
                    risk.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                    risk.status === 'MITIGATED' ? 'bg-green-100 text-green-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {risk.status}
                  </span>
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 px-2 font-medium text-slate-900">Impact</td>
              {comparisonRisks.map(risk => (
                <td key={risk.id} className="text-center py-3 px-2">
                  <span className="font-medium text-slate-700">{risk.impact}</span>
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 px-2 font-medium text-slate-900">Likelihood</td>
              {comparisonRisks.map(risk => (
                <td key={risk.id} className="text-center py-3 px-2">
                  <span className="font-medium text-slate-700">{risk.likelihood}</span>
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 px-2 font-medium text-slate-900">Category</td>
              {comparisonRisks.map(risk => (
                <td key={risk.id} className="text-center py-3 px-2">
                  <span className="text-slate-600">{risk.category}</span>
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 px-2 font-medium text-slate-900">Projected Cost</td>
              {comparisonRisks.map(risk => (
                <td key={risk.id} className="text-center py-3 px-2">
                  <span className="font-medium text-slate-900">
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
            className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm hover:bg-slate-300 transition-colors flex items-center gap-2"
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

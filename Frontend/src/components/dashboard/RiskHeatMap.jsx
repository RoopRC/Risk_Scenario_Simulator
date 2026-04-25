import React from 'react';

const RiskHeatMap = ({ risks = [] }) => {
  // Impact levels: LOW (0), MEDIUM (1), HIGH (2), CRITICAL (3)
  // Likelihood levels: LOW (0), MEDIUM (1), HIGH (2)
  
  const impactMap = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 };
  const likelihoodMap = { LOW: 0, MEDIUM: 1, HIGH: 2 };
  
  // Create 4x3 matrix (4 impact levels, 3 likelihood levels)
  const matrix = Array(3).fill(null).map(() => Array(4).fill([]));
  
  risks.forEach(risk => {
    const impactIdx = impactMap[risk.impact] || 0;
    const likelihoodIdx = likelihoodMap[risk.likelihood] || 0;
    matrix[likelihoodIdx][impactIdx] = [
      ...matrix[likelihoodIdx][impactIdx],
      risk
    ];
  });

  const getHeatColor = (count, impact, likelihood) => {
    if (count === 0) return 'bg-slate-50 border-slate-200';
    const score = (impact + 1) * (likelihood + 1) * count;
    if (score >= 20) return 'bg-red-100 border-red-400 hover:bg-red-200';
    if (score >= 12) return 'bg-orange-100 border-orange-400 hover:bg-orange-200';
    if (score >= 6) return 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200';
    return 'bg-green-100 border-green-400 hover:bg-green-200';
  };

  const impacts = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const likelihoods = ['LOW', 'MEDIUM', 'HIGH'];

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Risk Heat Map</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-sm font-semibold text-slate-600 text-center w-24 pb-4">Likelihood</th>
              {impacts.map(impact => (
                <th key={impact} className="text-sm font-semibold text-slate-600 text-center pb-4 px-2">
                  {impact}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {likelihoods.map((likelihood, likelihoodIdx) => (
              <tr key={likelihood}>
                <td className="text-sm font-medium text-slate-700 text-center pb-2">
                  {likelihood}
                </td>
                {impacts.map((impact, impactIdx) => {
                  const cellRisks = matrix[likelihoodIdx][impactIdx];
                  const count = cellRisks.length;
                  return (
                    <td
                      key={`${likelihood}-${impact}`}
                      className={`border-2 p-3 text-center cursor-pointer transition-all hover:shadow-md ${getHeatColor(
                        count,
                        impactIdx,
                        likelihoodIdx
                      )}`}
                      title={count > 0 ? cellRisks.map(r => r.title).join('\n') : 'No risks'}
                    >
                      {count > 0 && (
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-bold text-lg text-slate-900">{count}</span>
                          <div className="text-xs text-slate-600 max-h-12 overflow-y-auto">
                            {cellRisks.slice(0, 2).map((risk, idx) => (
                              <div key={idx} className="truncate">{risk.title.substring(0, 15)}...</div>
                            ))}
                            {cellRisks.length > 2 && <div className="text-slate-500">+{cellRisks.length - 2}</div>}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-400 rounded"></div>
          <span className="text-slate-600">Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-400 rounded"></div>
          <span className="text-slate-600">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-100 border border-orange-400 rounded"></div>
          <span className="text-slate-600">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-400 rounded"></div>
          <span className="text-slate-600">Critical</span>
        </div>
      </div>
    </div>
  );
};

export default RiskHeatMap;

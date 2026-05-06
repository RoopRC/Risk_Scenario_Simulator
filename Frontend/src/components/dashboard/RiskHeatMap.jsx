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
    if (count === 0) return 'bg-[#162d47] border-[#1e3a5f]';
    const score = (impact + 1) * (likelihood + 1) * count;
    if (score >= 20) return 'bg-[#ef4444]/20 border-[#ef4444]/50 hover:bg-[#ef4444]/30';
    if (score >= 12) return 'bg-[#f97316]/20 border-[#f97316]/50 hover:bg-[#f97316]/30';
    if (score >= 6) return 'bg-[#a855f7]/20 border-[#a855f7]/50 hover:bg-[#a855f7]/30';
    return 'bg-[#10b981]/20 border-[#10b981]/50 hover:bg-[#10b981]/30';
  };

  const impacts = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const likelihoods = ['LOW', 'MEDIUM', 'HIGH'];

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Risk Heat Map</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-sm font-semibold text-slate-300 text-center w-24 pb-4">Likelihood</th>
              {impacts.map(impact => (
                <th key={impact} className="text-sm font-semibold text-slate-300 text-center pb-4 px-2">
                  {impact}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {likelihoods.map((likelihood, likelihoodIdx) => (
              <tr key={likelihood}>
                <td className="text-sm font-medium text-slate-300 text-center pb-2">
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
                          <span className="font-bold text-lg text-white">{count}</span>
                          <div className="text-xs text-slate-300 max-h-12 overflow-y-auto">
                            {cellRisks.slice(0, 2).map((risk, idx) => (
                              <div key={idx} className="truncate">{risk.title.substring(0, 15)}...</div>
                            ))}
                            {cellRisks.length > 2 && <div className="text-slate-400">+{cellRisks.length - 2}</div>}
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
          <div className="w-4 h-4 rounded" style={{ background: 'rgba(16, 185, 129, 0.5)', border: '1px solid #10b981' }}></div>
          <span className="text-slate-300">Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'rgba(168, 85, 247, 0.5)', border: '1px solid #a855f7' }}></div>
          <span className="text-slate-300">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'rgba(249, 115, 22, 0.5)', border: '1px solid #f97316' }}></div>
          <span className="text-slate-300">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'rgba(239, 68, 68, 0.5)', border: '1px solid #ef4444' }}></div>
          <span className="text-slate-300">Critical</span>
        </div>
      </div>
    </div>
  );
};

export default RiskHeatMap;

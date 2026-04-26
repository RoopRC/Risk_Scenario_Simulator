import React from 'react';

const LoadingSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="card p-5 animate-pulse">
      <div className="h-8 bg-slate-500/20 rounded-lg mb-5 w-1/3"></div>
      <div className="space-y-3">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            {[...Array(columns)].map((_, j) => (
              <div key={j} className="flex-1 h-5 bg-slate-500/20 rounded-md"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
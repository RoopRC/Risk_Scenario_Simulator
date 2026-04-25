import React from 'react';

const StatisticsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  color = 'blue',
  onClick,
  loading = false
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  const trendClasses = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-slate-600 bg-slate-50',
  };

  return (
    <div
      onClick={onClick}
      className={`card p-6 ${onClick ? 'cursor-pointer hover-lift' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]} border`}>
          {loading ? (
            <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            icon
          )}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${trendClasses[trend.type]}`}>
            {trend.type === 'positive' && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="23 6 13.46 15.46 8 9.92 1 17" />
                <polyline points="23 6 23 16 13 16" />
              </svg>
            )}
            {trend.type === 'negative' && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="23 18 13.46 8.54 8 14.08 1 7" />
                <polyline points="23 18 23 8 13 8" />
              </svg>
            )}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>

      <div className="mb-2">
        <p className="text-slate-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500">{subtitle}</p>
      )}
    </div>
  );
};

export default StatisticsCard;

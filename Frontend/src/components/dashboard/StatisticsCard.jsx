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
    blue: 'bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/20',
    red: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20',
    green: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20',
    orange: 'bg-[#f97316]/10 text-[#f97316] border-[#f97316]/20',
    purple: 'bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/20',
  };

  const trendClasses = {
    positive: 'text-[#10b981] bg-[#10b981]/10',
    negative: 'text-[#ef4444] bg-[#ef4444]/10',
    neutral: 'text-slate-400 bg-slate-400/10',
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
        <p className="text-slate-200 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>

      {subtitle && (
        <p className="text-xs text-slate-400">{subtitle}</p>
      )}
    </div>
  );
};

export default StatisticsCard;

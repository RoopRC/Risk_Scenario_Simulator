import React from 'react';

const KPICard = ({ title, value, icon, color, trend }) => {
  const iconColors = {
    blue: { bg: 'bg-[#06b6d4]/10', text: 'text-[#06b6d4]', ring: 'ring-[#06b6d4]/15' },
    green: { bg: 'bg-[#10b981]/10', text: 'text-[#10b981]', ring: 'ring-[#10b981]/15' },
    red: { bg: 'bg-[#ef4444]/10', text: 'text-[#ef4444]', ring: 'ring-[#ef4444]/15' },
    yellow: { bg: 'bg-[#a855f7]/10', text: 'text-[#a855f7]', ring: 'ring-[#a855f7]/15' },
    purple: { bg: 'bg-[#a855f7]/10', text: 'text-[#a855f7]', ring: 'ring-[#a855f7]/15' },
  };

  const colorSet = iconColors[color] || iconColors.blue;
  const trendColor = trend?.positive ? 'text-[#10b981] bg-[#10b981]/10' : 'text-[#ef4444] bg-[#ef4444]/10';

  return (
    <div className="stat-card group cursor-default">
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        style={{ background: color === 'blue' ? '#06b6d4' : color === 'green' ? '#10b981' : color === 'red' ? '#ef4444' : color === 'purple' ? '#a855f7' : '#a855f7' }}
      />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${colorSet.bg} ring-1 ${colorSet.ring} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
          <span className={`${colorSet.text}`}>{icon}</span>
        </div>
        {trend && (
          <span className={`badge ${trendColor}`}>
            {trend.positive ? '↑' : '↓'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="section-title mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
};

export default KPICard;
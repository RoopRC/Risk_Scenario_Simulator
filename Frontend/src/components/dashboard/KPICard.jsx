import React from 'react';

const KPICard = ({ title, value, icon, color, trend }) => {
  const iconColors = {
    blue: { bg: 'bg-[#393E46]/10', text: 'text-[#393E46]', ring: 'ring-[#393E46]/15' },
    green: { bg: 'bg-[#6B8F71]/10', text: 'text-[#6B8F71]', ring: 'ring-[#6B8F71]/15' },
    red: { bg: 'bg-[#C44536]/10', text: 'text-[#C44536]', ring: 'ring-[#C44536]/15' },
    yellow: { bg: 'bg-[#D4A843]/10', text: 'text-[#D4A843]', ring: 'ring-[#D4A843]/15' },
    purple: { bg: 'bg-[#948979]/10', text: 'text-[#948979]', ring: 'ring-[#948979]/15' },
  };

  const colorSet = iconColors[color] || iconColors.blue;
  const trendColor = trend?.positive ? 'text-[#6B8F71] bg-[#6B8F71]/10' : 'text-[#C44536] bg-[#C44536]/10';

  return (
    <div className="stat-card group cursor-default">
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        style={{ background: color === 'blue' ? '#393E46' : color === 'green' ? '#6B8F71' : color === 'red' ? '#C44536' : color === 'purple' ? '#948979' : '#D4A843' }}
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
      <p className="text-2xl font-bold text-[#222831]">{value}</p>
    </div>
  );
};

export default KPICard;
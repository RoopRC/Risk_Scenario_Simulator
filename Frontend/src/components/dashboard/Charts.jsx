import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const COLORS = ['#a855f7', '#3b82f6', '#fbbf24', '#10b981', '#06b6d4', '#ef4444', '#ec4899', '#14b8a6'];

const chartTooltipStyle = {
  contentStyle: {
    background: '#222831',
    border: '1px solid #393E46',
    borderRadius: '8px',
    color: '#DFD0B8',
    fontSize: '12px',
    padding: '8px 12px',
  },
  itemStyle: { color: '#DFD0B8' },
  labelStyle: { color: '#948979' },
};

export const CategoryBarChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barSize={32}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <Tooltip {...chartTooltipStyle} />
        <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const StatusPieChart = ({ data }) => {
  const renderLabel = ({ name, percent, cx, cy, midAngle, outerRadius, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#e2e8f0"
        fontSize={12}
        fontWeight={500}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {name}: {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={75}
          innerRadius={38}
          fill="#948979"
          dataKey="value"
          strokeWidth={2}
          stroke="rgba(255,255,255,0.1)"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip {...chartTooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const TrendLineChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <Tooltip {...chartTooltipStyle} />
        <Area type="monotone" dataKey="risks" stroke="#10b981" strokeWidth={2.5} fill="url(#trendGradient)" dot={{ r: 3, fill: '#10b981', stroke: '#10b981' }} activeDot={{ r: 5, fill: '#34d399', stroke: '#fff', strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const RiskRadarChart = ({ data }) => {
  const defaultData = data || [
    { subject: 'Availability', A: 80, fullMark: 100 },
    { subject: 'Integrity', A: 65, fullMark: 100 },
    { subject: 'Confidentiality', A: 75, fullMark: 100 },
    { subject: 'Risk Detect', A: 85, fullMark: 100 },
    { subject: 'Low Latency', A: 70, fullMark: 100 },
  ];
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={defaultData}>
        <PolarGrid stroke="#d1c3ab" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#393E46' }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#948979' }} />
        <Radar name="Risk Score" dataKey="A" stroke="#222831" fill="#948979" fillOpacity={0.25} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export const RiskTrendLineChart = ({ data }) => {
  const defaultData = data || [
    { month: 'Jul', blue: 3.2, red: 5.5 },
    { month: 'Aug', blue: 4.8, red: 7.2 },
    { month: 'Sep', blue: 5.5, red: 13.5 },
    { month: 'Oct', blue: 6.2, red: 8.5 },
    { month: 'Nov', blue: 5.8, red: 7.8 },
    { month: 'Dec', blue: 6.5, red: 7.2 },
    { month: 'Jan', blue: 7.0, red: 7.5 },
  ];
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={defaultData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#d1c3ab" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#948979' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#948979' }} />
        <Tooltip {...chartTooltipStyle} />
        <Line type="monotone" dataKey="blue" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4, fill: '#06b6d4' }} name="Score A" />
        <Line type="monotone" dataKey="red" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} name="Score B" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const MonthlyBarChart = ({ data }) => {
  const defaultData = data || [
    { month: 'Jan', value: 30 },
    { month: 'Feb', value: 25 },
    { month: 'Mar', value: 38 },
    { month: 'Apr', value: 22 },
    { month: 'May', value: 35 },
    { month: 'Jun', value: 28 },
    { month: 'Jul', value: 42 },
  ];
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={defaultData} barSize={28}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <Tooltip {...chartTooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.06)' }} />
        <Bar dataKey="value" fill="url(#barGradient)" radius={[4, 4, 0, 0]} activeBar={{ fill: '#0d9488', opacity: 0.9 }} />
      </BarChart>
    </ResponsiveContainer>
  );
};
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const COLORS = ['#10b981', '#06b6d4', '#a855f7', '#ef4444', '#f59e0b', '#ec4899', '#3b82f6', '#14b8a6'];

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
        <CartesianGrid strokeDasharray="3 3" stroke="#d1c3ab" vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#948979' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#948979' }} />
        <Tooltip {...chartTooltipStyle} />
        <Bar dataKey="count" fill="#222831" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const StatusPieChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          innerRadius={40}
          fill="#948979"
          dataKey="value"
          strokeWidth={2}
          stroke="#EDE4D3"
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
            <stop offset="5%" stopColor="#948979" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#948979" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#d1c3ab" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#948979' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#948979' }} />
        <Tooltip {...chartTooltipStyle} />
        <Area type="monotone" dataKey="risks" stroke="#222831" strokeWidth={2} fill="url(#trendGradient)" />
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
        <CartesianGrid strokeDasharray="3 3" stroke="#d1c3ab" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#948979' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#948979' }} />
        <Tooltip {...chartTooltipStyle} />
        <Bar dataKey="value" fill="#393E46" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
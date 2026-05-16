import React from 'react';

const statusConfig = {
  OPEN: { bg: 'rgba(6,182,212,0.15)', border: 'rgba(6,182,212,0.3)', text: '#22d3ee', dot: '#06b6d4', label: 'Open' },
  IN_PROGRESS: { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.3)', text: '#fb923c', dot: '#f97316', label: 'In Progress' },
  MITIGATED: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#34d399', dot: '#10b981', label: 'Mitigated' },
  CLOSED: { bg: 'rgba(100,116,139,0.15)', border: 'rgba(100,116,139,0.3)', text: '#94a3b8', dot: '#64748b', label: 'Closed' },
  CRITICAL: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#f87171', dot: '#ef4444', label: 'Critical' },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.OPEN;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-2xs font-bold uppercase tracking-wider"
      style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: config.dot }} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
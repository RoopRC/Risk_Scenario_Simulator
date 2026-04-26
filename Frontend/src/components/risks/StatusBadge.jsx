import React from 'react';

const statusConfig = {
  OPEN: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', label: 'Open' },
  IN_PROGRESS: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400', label: 'In Progress' },
  MITIGATED: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400', label: 'Mitigated' },
  CLOSED: { bg: 'bg-slate-400/10', text: 'text-slate-400', dot: 'bg-slate-400', label: 'Closed' },
  CRITICAL: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-400', label: 'Critical' },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.OPEN;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
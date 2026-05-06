import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatDate } from '../../utils/formatters';

const RiskTable = ({ risks, onSort, sortField, sortDirection, onDelete }) => {
  const navigate = useNavigate();

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-rose-400 font-bold';
    if (score >= 6) return 'text-amber-400 font-semibold';
    if (score >= 4) return 'text-blue-400 font-semibold';
    return 'text-emerald-400 font-semibold';
  };

  const getScoreBg = (score) => {
    if (score >= 8) return 'bg-rose-500/15';
    if (score >= 6) return 'bg-amber-500/15';
    if (score >= 4) return 'bg-blue-500/15';
    return 'bg-emerald-500/15';
  };

  const handleSort = (field) => {
    const dir = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(field, dir);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="ml-1 text-slate-400">↕</span>;
    return <span className="ml-1 text-accent">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'riskScore', label: 'Score' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map(col => (
              <th key={col.key} onClick={() => handleSort(col.key)}
                className="px-5 py-3 text-left text-2xs font-bold uppercase tracking-wider text-slate-300 cursor-pointer hover:text-white transition-colors select-none">
                {col.label}<SortIcon field={col.key} />
              </th>
            ))}
            <th className="px-5 py-3 text-left text-2xs font-bold uppercase tracking-wider text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {risks.map((risk, idx) => (
            <tr key={risk.id}
              className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
              style={{ animationDelay: `${idx * 30}ms` }}>
              <td className="px-5 py-3.5 text-sm text-slate-200 font-mono">#{risk.id}</td>
              <td className="px-5 py-3.5">
                <button onClick={() => navigate(`/risks/${risk.id}`)}
                  className="text-sm font-medium text-slate-200 hover:text-emerald-400 transition-colors text-left">
                  {risk.title}
                </button>
              </td>
              <td className="px-5 py-3.5">
                <span className="text-xs font-medium text-slate-300 bg-slate-500/20 px-2.5 py-1 rounded-md">{risk.category}</span>
              </td>
              <td className="px-5 py-3.5">
                <span className={`text-sm px-2 py-0.5 rounded ${getScoreColor(risk.riskScore)} ${getScoreBg(risk.riskScore)}`}>
                  {risk.riskScore}/10
                </span>
              </td>
              <td className="px-5 py-3.5"><StatusBadge status={risk.status} /></td>
              <td className="px-5 py-3.5 text-sm text-slate-200">{formatDate(risk.createdAt)}</td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => navigate(`/risks/${risk.id}`)} className="p-1.5 text-slate-300 hover:text-accent rounded-md hover:bg-accent/10 transition-all" title="View">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button onClick={() => navigate(`/risks/${risk.id}/edit`)} className="p-1.5 text-slate-300 hover:text-accent rounded-md hover:bg-accent/10 transition-all" title="Edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => onDelete(risk.id)} className="p-1.5 text-slate-300 hover:text-danger rounded-md hover:bg-danger/10 transition-all" title="Delete">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiskTable;
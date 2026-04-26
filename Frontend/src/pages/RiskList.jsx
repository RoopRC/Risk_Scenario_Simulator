import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getRisks, deleteRisk, exportCSV } from '../services/api';
import RiskTable from '../components/risks/RiskTable';
import AdvancedFilters from '../components/risks/AdvancedFilters';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import useDebounce from '../hooks/useDebounce';
import toast from 'react-hot-toast';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'MITIGATED', 'CLOSED', 'CRITICAL'];
const CATEGORIES = ['Infrastructure', 'Cybersecurity', 'Financial', 'Operational', 'Compliance', 'Strategic'];

const RiskList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0 });
  const [sort, setSort] = useState({ field: 'id', direction: 'asc' });
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const debouncedSearch = useDebounce(searchText, 300);

  const fetchRisks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page, size: pagination.size,
        sort: `${sort.field},${sort.direction}`,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      const data = await getRisks(params);
      setRisks(data.content || []);
      setPagination(p => ({
        ...p,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.error('Failed to fetch risks:', error);
      toast.error('Failed to load risks');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, sort, debouncedSearch, statusFilter, categoryFilter]);

  useEffect(() => { fetchRisks(); }, [fetchRisks]);

  useEffect(() => {
    const p = {};
    if (debouncedSearch) p.search = debouncedSearch;
    if (statusFilter) p.status = statusFilter;
    if (categoryFilter) p.category = categoryFilter;
    setSearchParams(p);
  }, [debouncedSearch, statusFilter, categoryFilter, setSearchParams]);

  const handleSort = (field, direction) => {
    setSort({ field, direction });
    setPagination(p => ({ ...p, page: 0 }));
  };

  const handlePageChange = (newPage) => setPagination(p => ({ ...p, page: newPage }));

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this risk?')) {
      try {
        await deleteRisk(id);
        toast.success('Risk deleted successfully');
        fetchRisks();
      } catch { toast.error('Failed to delete risk'); }
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await exportCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `risks_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch { toast.error('Failed to export CSV'); }
  };

  const handleAdvancedFiltersChange = (filters) => {
    if (filters.searchTerm) setSearchText(filters.searchTerm);
    if (filters.status) setStatusFilter(filters.status);
    if (filters.category) setCategoryFilter(filters.category);
    setPagination(p => ({ ...p, page: 0 }));
  };

  const clearFilters = () => {
    setSearchText('');
    setStatusFilter('');
    setCategoryFilter('');
    setPagination(p => ({ ...p, page: 0 }));
  };

  const hasActiveFilters = debouncedSearch || statusFilter || categoryFilter;

  if (loading && risks.length === 0) return <LoadingSkeleton rows={8} columns={7} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 opacity-0 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-white">Risk Scenarios</h1>
          <p className="text-sm text-slate-200 mt-1">{pagination.totalElements} total entries found in repository.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportCSV} className="btn-outline flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export CSV
          </button>
          <button onClick={() => navigate('/risks/new')} className="btn-primary flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Scenario
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card p-4 opacity-0 animate-fade-in-up stagger-1">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value); setPagination(p => ({ ...p, page: 0 })); }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#162d47] border-0 rounded-lg text-sm text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 0 })); }}
            className="px-3 py-2.5 bg-[#162d47] border-0 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 transition-all cursor-pointer min-w-[140px]"
          >
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPagination(p => ({ ...p, page: 0 })); }}
            className="px-3 py-2.5 bg-[#162d47] border-0 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 transition-all cursor-pointer min-w-[150px]"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Advanced Filters */}
          <button
            onClick={() => setShowAdvancedFilters(true)}
            className="px-3 py-2.5 bg-[#10b981]/10 hover:bg-[#10b981]/20 border border-[#10b981]/20 rounded-lg text-sm text-emerald-400 font-medium transition-all flex items-center gap-1 whitespace-nowrap"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
            </svg>
            Advanced
          </button>

          {/* Clear */}
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs font-semibold text-slate-400 hover:text-red-400 uppercase tracking-wider whitespace-nowrap transition-colors">
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {risks.length === 0 && !loading ? (
        <div className="card py-16 opacity-0 animate-fade-in-up stagger-2">
          <EmptyState title="No Records Found" message="Your repository is currently empty. Start by creating your first risk scenario simulation." actionText="Create New Scenario" onAction={() => navigate('/risks/new')} />
        </div>
      ) : (
        <div className="card overflow-hidden opacity-0 animate-fade-in-up stagger-2">
          <RiskTable risks={risks} onSort={handleSort} sortField={sort.field} sortDirection={sort.direction} onDelete={handleDelete} />
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between opacity-0 animate-fade-in-up stagger-3">
          <span className="text-sm text-slate-400">
            Showing {pagination.page * pagination.size + 1}–{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements}
          </span>
          <div className="flex gap-2">
            <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 0}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-[#6B8A9C] hover:text-[#DFD0B8] hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => (
              <button key={i} onClick={() => handlePageChange(i)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${pagination.page === i ? 'bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-white' : 'border border-white/10 text-slate-300 hover:border-white/20 hover:text-white'}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page + 1 >= pagination.totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-[#6B8A9C] hover:text-[#DFD0B8] hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Advanced Filters Modal */}
      {showAdvancedFilters && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2A4858] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <AdvancedFilters
              onFiltersChange={handleAdvancedFiltersChange}
              onClose={() => setShowAdvancedFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskList;
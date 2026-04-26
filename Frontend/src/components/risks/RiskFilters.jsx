import React, { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';

const RiskFilters = ({ filters, onFilterChange }) => {
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    onFilterChange({ ...filters, search: debouncedSearch });
  }, [debouncedSearch]);

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="label">Search</label>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="label">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value || null)}
            className="input"
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="MITIGATED">Mitigated</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div>
          <label className="label">Category</label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value || null)}
            className="input"
          >
            <option value="">All Categories</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Financial">Financial</option>
            <option value="Operational">Operational</option>
            <option value="Compliance">Compliance</option>
          </select>
        </div>

        <div>
          <label className="label">Min Risk Score</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={filters.minScore || ''}
            onChange={(e) => handleChange('minScore', e.target.value ? Number(e.target.value) : null)}
            className="input"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => {
            setLocalSearch('');
            onFilterChange({ search: '', status: null, category: null, minScore: null });
          }}
          className="text-sm text-slate-200 hover:text-emerald-400"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default RiskFilters;
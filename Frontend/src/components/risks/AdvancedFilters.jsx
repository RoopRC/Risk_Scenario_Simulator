import React, { useState } from 'react';

const AdvancedFilters = ({ onFiltersChange, onClose }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    category: '',
    minRiskScore: 0,
    maxRiskScore: 10,
    impact: '',
    likelihood: '',
    dateFrom: '',
    dateTo: '',
  });

  const statuses = ['OPEN', 'IN_PROGRESS', 'MITIGATED', 'CLOSED', 'CRITICAL'];
  const categories = ['Infrastructure', 'Cybersecurity', 'Financial', 'Operational', 'Compliance', 'Strategic'];
  const impacts = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const likelihoods = ['LOW', 'MEDIUM', 'HIGH'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      searchTerm: '',
      status: '',
      category: '',
      minRiskScore: 0,
      maxRiskScore: 10,
      impact: '',
      likelihood: '',
      dateFrom: '',
      dateTo: '',
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
        <button
          onClick={onClose}
          className="text-slate-300 hover:text-slate-400"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Search Term */}
      <div>
        <label className="label">Search Term</label>
        <input
          type="text"
          name="searchTerm"
          placeholder="Search by title or keywords..."
          value={filters.searchTerm}
          onChange={handleChange}
          className="input w-full"
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="label">Status</label>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="input w-full"
        >
          <option value="">All Statuses</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div>
        <label className="label">Category</label>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="input w-full"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Impact & Likelihood */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Impact</label>
          <select
            name="impact"
            value={filters.impact}
            onChange={handleChange}
            className="input w-full"
          >
            <option value="">All</option>
            {impacts.map(imp => (
              <option key={imp} value={imp}>{imp}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Likelihood</label>
          <select
            name="likelihood"
            value={filters.likelihood}
            onChange={handleChange}
            className="input w-full"
          >
            <option value="">All</option>
            {likelihoods.map(like => (
              <option key={like} value={like}>{like}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Risk Score Range */}
      <div>
        <label className="label">Risk Score: {filters.minRiskScore.toFixed(1)} - {filters.maxRiskScore.toFixed(1)}</label>
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="range"
              name="minRiskScore"
              min="0"
              max="10"
              step="0.5"
              value={filters.minRiskScore}
              onChange={handleChange}
              className="w-full"
            />
            <span className="text-xs text-slate-400">Min</span>
          </div>
          <div className="flex-1">
            <input
              type="range"
              name="maxRiskScore"
              min="0"
              max="10"
              step="0.5"
              value={filters.maxRiskScore}
              onChange={handleChange}
              className="w-full"
            />
            <span className="text-xs text-slate-400">Max</span>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Date From</label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleChange}
            className="input w-full"
          />
        </div>
        <div>
          <label className="label">Date To</label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleChange}
            className="input w-full"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <button onClick={handleReset} className="btn-outline flex-1">
          Reset All
        </button>
        <button onClick={onClose} className="btn-primary flex-1">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilters;

import React, { useState } from 'react';

const RiskForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    category: '',
    riskScore: 5,
    impact: '',
    likelihood: '',
    mitigationPlan: '',
    status: 'OPEN',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.riskScore < 0 || formData.riskScore > 10) newErrors.riskScore = 'Risk score must be between 0 and 10';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="label">Title *</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} className="input" />
        {errors.title && <p className="text-danger text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="label">Description *</label>
        <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="input" />
        {errors.description && <p className="text-danger text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Category *</label>
          <select name="category" value={formData.category} onChange={handleChange} className="input">
            <option value="">Select Category</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Financial">Financial</option>
            <option value="Operational">Operational</option>
            <option value="Compliance">Compliance</option>
            <option value="Strategic">Strategic</option>
          </select>
          {errors.category && <p className="text-danger text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="label">Risk Score (0-10) *</label>
          <input type="number" name="riskScore" step="0.1" value={formData.riskScore} onChange={handleChange} className="input" />
          {errors.riskScore && <p className="text-danger text-sm mt-1">{errors.riskScore}</p>}
        </div>

        <div>
          <label className="label">Impact</label>
          <select name="impact" value={formData.impact} onChange={handleChange} className="input">
            <option value="">Select Impact</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="label">Likelihood</label>
          <select name="likelihood" value={formData.likelihood} onChange={handleChange} className="input">
            <option value="">Select Likelihood</option>
            <option value="Rare">Rare</option>
            <option value="Unlikely">Unlikely</option>
            <option value="Possible">Possible</option>
            <option value="Likely">Likely</option>
            <option value="Almost Certain">Almost Certain</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="label">Mitigation Plan</label>
          <textarea name="mitigationPlan" rows="3" value={formData.mitigationPlan} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="label">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="input">
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="MITIGATED">Mitigated</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={() => window.history.back()} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Saving...' : 'Save Risk'}
        </button>
      </div>
    </form>
  );
};

export default RiskForm;
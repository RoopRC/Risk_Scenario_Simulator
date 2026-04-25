// Form validation utilities
export const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Invalid email address';
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    return value.length < min ? `Minimum ${min} characters required` : null;
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    return value.length > max ? `Maximum ${max} characters allowed` : null;
  },

  pattern: (pattern, message) => (value) => {
    if (!value) return null;
    return pattern.test(value) ? null : message;
  },

  number: (value) => {
    if (!value && value !== 0) return null;
    return !isNaN(value) && value !== '' ? null : 'Must be a number';
  },

  min: (min) => (value) => {
    if (value === '' || value === null || value === undefined) return null;
    return Number(value) >= min ? null : `Minimum value is ${min}`;
  },

  max: (max) => (value) => {
    if (value === '' || value === null || value === undefined) return null;
    return Number(value) <= max ? null : `Maximum value is ${max}`;
  },

  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Invalid URL';
    }
  },

  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(value.replace(/\s/g, '')) ? null : 'Invalid phone number';
  },

  match: (matchValue) => (value) => {
    return value === matchValue ? null : 'Values do not match';
  },
};

export const validateForm = (formData, schema) => {
  const errors = {};

  Object.keys(schema).forEach(field => {
    const fieldValue = formData[field];
    const fieldValidators = schema[field];

    if (!Array.isArray(fieldValidators)) {
      return;
    }

    for (const validator of fieldValidators) {
      const error = validator(fieldValue);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return errors;
};

export const sanitizeInput = (input) => {
  return typeof input === 'string' ? input.trim() : input;
};

export const formatCurrency = (value) => {
  const num = Number(value);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
};

export const formatRiskScore = (score) => {
  const num = Number(score);
  if (num >= 8.5) return { color: 'text-red-600', bg: 'bg-red-50', label: 'Critical' };
  if (num >= 7) return { color: 'text-orange-600', bg: 'bg-orange-50', label: 'High' };
  if (num >= 5) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Medium' };
  return { color: 'text-green-600', bg: 'bg-green-50', label: 'Low' };
};

export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

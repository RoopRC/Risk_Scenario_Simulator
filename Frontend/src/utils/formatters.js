import { format, parseISO } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'dd MMM yyyy');
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'dd MMM yyyy HH:mm');
  } catch {
    return dateString;
  }
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatRiskScore = (score) => {
  const num = Number(score);
  if (isNaN(num)) return 'N/A';
  return `${num.toFixed(1)}/10`;
};
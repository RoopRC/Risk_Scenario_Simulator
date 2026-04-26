import React from 'react';

const EmptyState = ({ title, message, actionText, onAction }) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-slate-500/20 flex items-center justify-center mx-auto mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title || 'No data found'}</h3>
      <p className="text-sm text-slate-400 max-w-xs mx-auto mb-6">{message || 'Try adjusting your filters or create a new record.'}</p>
      {onAction && actionText && (
        <button onClick={onAction} className="btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
import React from 'react';

const Badge = ({ 
  label, 
  variant = 'default',
  size = 'md',
  icon,
  removable = false,
  onRemove
}) => {
  const variantClasses = {
    default: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    primary: 'bg-[#06b6d4]/20 text-[#06b6d4] border-[#06b6d4]/30',
    success: 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30',
    danger: 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30',
    warning: 'bg-[#f97316]/20 text-[#f97316] border-[#f97316]/30',
    info: 'bg-[#06b6d4]/20 text-[#06b6d4] border-[#06b6d4]/30',
    premium: 'bg-[#a855f7]/20 text-[#a855f7] border-[#a855f7]/30',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div className={`
      inline-flex items-center gap-2 rounded-full border font-medium transition-all
      ${variantClasses[variant]} ${sizeClasses[size]}
      ${removable ? 'pr-1' : ''}
    `}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {removable && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 ml-1 hover:opacity-70 transition-opacity"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      )}
    </div>
  );
};

// Status Badge specific to Risks
export const StatusBadgeEnhanced = ({ status }) => {
  const statusConfig = {
    OPEN: { label: 'Open', variant: 'warning' },
    IN_PROGRESS: { label: 'In Progress', variant: 'info' },
    MITIGATED: { label: 'Mitigated', variant: 'success' },
    CLOSED: { label: 'Closed', variant: 'default' },
    CRITICAL: { label: 'Critical', variant: 'danger' },
  };

  const config = statusConfig[status] || { label: status, variant: 'default' };

  return <Badge label={config.label} variant={config.variant} size="sm" />;
};

// Impact Badge
export const ImpactBadge = ({ impact }) => {
  const impactConfig = {
    LOW: { label: 'Low', variant: 'success' },
    MEDIUM: { label: 'Medium', variant: 'warning' },
    HIGH: { label: 'High', variant: 'danger' },
    CRITICAL: { label: 'Critical', variant: 'danger' },
  };

  const config = impactConfig[impact] || { label: impact, variant: 'default' };

  return <Badge label={config.label} variant={config.variant} size="sm" />;
};

// Likelihood Badge
export const LikelihoodBadge = ({ likelihood }) => {
  const config = {
    LOW: { label: 'Low', variant: 'success' },
    MEDIUM: { label: 'Medium', variant: 'warning' },
    HIGH: { label: 'High', variant: 'danger' },
  };

  const badgeConfig = config[likelihood] || { label: likelihood, variant: 'default' };

  return <Badge label={badgeConfig.label} variant={badgeConfig.variant} size="sm" />;
};

export default Badge;

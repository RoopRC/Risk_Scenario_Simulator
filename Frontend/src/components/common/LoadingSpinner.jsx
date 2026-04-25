import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-[3px]',
    lg: 'w-10 h-10 border-[3px]',
  };

  const borderColor = color === 'white' ? 'border-white/20' : 'border-gray-200';
  const topColor = color === 'white' ? '#fff' : '#1B8EF2';

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} ${borderColor} rounded-full animate-spin`}
        style={{ borderTopColor: topColor }}
      />
    </div>
  );
};

export default LoadingSpinner;
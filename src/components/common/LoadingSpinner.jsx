import React from 'react';

const LoadingSpinner = ({ fullScreen = false, size = 'md', color = 'primary' }) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  // Color classes
  const colorClasses = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-400',
    accent: 'border-accent-400',
    neutral: 'border-neutral-400',
  };

  // Choose classes based on props
  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = colorClasses[color] || colorClasses.primary;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        <div className={`${spinnerSize} border-t-transparent border-solid rounded-full animate-spin ${spinnerColor}`}></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`${spinnerSize} border-t-transparent border-solid rounded-full animate-spin ${spinnerColor}`}></div>
    </div>
  );
};

export default LoadingSpinner;

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'gray';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'primary',
  className = '',
  text
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const variantClasses = {
    primary: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  const spinnerClasses = `animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (text) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className={spinnerClasses}></div>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    );
  }

  return <div className={spinnerClasses}></div>;
};

export default LoadingSpinner; 
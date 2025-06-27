import React from 'react';

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-info-circle';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'text-green-400',
          title: 'text-green-800',
          message: 'text-green-700'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-400',
          title: 'text-red-800',
          message: 'text-red-700'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-400',
          title: 'text-yellow-800',
          message: 'text-yellow-700'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-400',
          title: 'text-blue-800',
          message: 'text-blue-700'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-400',
          title: 'text-blue-800',
          message: 'text-blue-700'
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${colors.bg} border ${colors.border} rounded-lg shadow-lg`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <i className={`${getIcon()} ${colors.icon} text-lg`} aria-hidden="true"></i>
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${colors.title}`}>
              {title}
            </h3>
            <div className={`mt-2 text-sm ${colors.message}`}>
              <p>{message}</p>
            </div>
          </div>
          {onClose && (
            <div className="ml-auto pl-3">
              <button
                onClick={onClose}
                className={`inline-flex ${colors.icon} hover:${colors.icon.replace('text-', 'text-').replace('-400', '-500')} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${colors.bg.replace('bg-', '')} focus:ring-${colors.icon.replace('text-', '')}`}
              >
                <i className="fas fa-times text-sm" aria-hidden="true"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert; 
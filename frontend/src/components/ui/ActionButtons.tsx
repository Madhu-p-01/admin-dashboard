import React from 'react';
import { Icon } from './Icon';

interface ActionButtonProps {
  iconName: string;
  onClick: () => void;
  tooltip?: string;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  disabled?: boolean;
}

interface ActionButtonsProps {
  actions: ActionButtonProps[];
  className?: string;
}

export function ActionButton({ 
  iconName, 
  onClick, 
  tooltip, 
  variant = 'default',
  disabled = false 
}: ActionButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'text-red-400 hover:text-red-600';
      case 'warning':
        return 'text-yellow-400 hover:text-yellow-600';
      case 'success':
        return 'text-green-400 hover:text-green-600';
      default:
        return 'text-gray-400 hover:text-gray-600';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`
        p-1 
        transition-colors 
        ${disabled ? 'opacity-50 cursor-not-allowed' : getVariantStyles()}
      `}
    >
      <Icon name={iconName} size={16} className={getVariantStyles()} />
    </button>
  );
}

export function ActionButtons({ actions, className = '' }: ActionButtonsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {actions.map((action, index) => (
        <ActionButton key={index} {...action} />
      ))}
    </div>
  );
}

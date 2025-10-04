import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  customColor?: string;
}

export function StatusBadge({ status, variant = 'default', customColor }: StatusBadgeProps) {
  const getVariantStyles = () => {
    if (customColor) {
      return {
        backgroundColor: `${customColor}20`,
        color: customColor,
      };
    }

    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'danger':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const styles = customColor 
    ? { backgroundColor: `${customColor}20`, color: customColor }
    : {};

  return (
    <span 
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${!customColor ? getVariantStyles() : ''}`}
      style={styles}
    >
      {status}
    </span>
  );
}

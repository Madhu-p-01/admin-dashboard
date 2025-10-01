import React from 'react';
import { Icon } from './Icon';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SearchBar({ 
  placeholder = "Search...", 
  value, 
  onChange,
  onFocus,
  onBlur,
  size = 'md',
  className = ''
}: SearchBarProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'pl-8 pr-3 py-1 text-sm';
      case 'lg':
        return 'pl-12 pr-4 py-3 text-lg';
      default:
        return 'pl-10 pr-4 py-2 text-sm';
    }
  };

  const getIconPosition = () => {
    switch (size) {
      case 'sm':
        return 'left-2';
      case 'lg':
        return 'left-4';
      default:
        return 'left-3';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 14;
      case 'lg':
        return 20;
      default:
        return 16;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${getIconPosition()}`}>
        <Icon name="search" size={getIconSize()} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`
          ${getSizeClasses()}
          border 
          border-gray-200 
          rounded-lg 
          bg-gray-50 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500 
          focus:border-transparent 
          transition-all
          w-full
        `}
      />
    </div>
  );
}

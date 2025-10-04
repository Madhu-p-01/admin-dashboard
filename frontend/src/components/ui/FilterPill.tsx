import React from 'react';

interface FilterPillProps {
  label: string;
  onRemove: () => void;
  variant?: 'default' | 'blue' | 'green' | 'yellow';
}

export function FilterPill({ label, onRemove, variant = 'default' }: FilterPillProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getVariantStyles()}`}>
      <span>{label}</span>
      <button 
        onClick={onRemove}
        className="text-current hover:text-gray-600 font-bold text-lg leading-none"
        aria-label={`Remove ${label} filter`}
      >
        ×
      </button>
    </div>
  );
}

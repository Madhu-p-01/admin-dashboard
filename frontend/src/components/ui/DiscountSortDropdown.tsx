import React, { useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface SortOption {
  id: string;
  label: string;
  field: string;
  direction: 'asc' | 'desc';
}

interface DiscountSortDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  options: SortOption[];
  currentSort: { field: string; direction: 'asc' | 'desc' } | null;
  onSortChange: (sort: { field: string; direction: 'asc' | 'desc' }) => void;
  className?: string;
}

export function DiscountSortDropdown({
  isOpen,
  onClose,
  options,
  currentSort,
  onSortChange,
  className
}: DiscountSortDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSortSelect = (option: SortOption) => {
    onSortChange({ field: option.field, direction: option.direction });
    // Don't close - let user see the selection
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[500px] flex flex-col",
        className
      )}
    >
      <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-900">Sort by</h3>
        <button
          onClick={onClose}
          className="text-xs text-gray-500 hover:text-gray-700"
          title="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="py-2 overflow-y-auto flex-1">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSortSelect(option)}
            className={cn(
              "w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between transition-colors",
              currentSort?.field === option.field && currentSort?.direction === option.direction
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700"
            )}
          >
            <span>{option.label}</span>
            {currentSort?.field === option.field && currentSort?.direction === option.direction && (
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

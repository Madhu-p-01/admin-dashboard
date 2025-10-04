import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

interface DiscountFilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterGroup[];
  appliedFilters: Record<string, string[]>;
  onApplyFilters: (filters: Record<string, string[]>) => void;
  className?: string;
}

export function DiscountFilterDropdown({
  isOpen,
  onClose,
  filters,
  appliedFilters,
  onApplyFilters,
  className
}: DiscountFilterDropdownProps) {
  const [tempFilters, setTempFilters] = useState<Record<string, string[]>>(appliedFilters);
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

  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    setTempFilters(prev => {
      const groupFilters = prev[groupId] || [];
      if (checked) {
        return {
          ...prev,
          [groupId]: [...groupFilters, optionId]
        };
      } else {
        return {
          ...prev,
          [groupId]: groupFilters.filter(id => id !== optionId)
        };
      }
    });
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  const handleClear = () => {
    setTempFilters({});
  };

  const getTotalAppliedFilters = () => {
    return Object.values(tempFilters).flat().length;
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50",
        className
      )}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
          <button
            onClick={handleClear}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filters.map((group) => (
          <div key={group.id} className="p-4 border-b border-gray-100 last:border-b-0">
            <h4 className="text-sm font-medium text-gray-900 mb-3">{group.label}</h4>
            <div className="space-y-2">
              {group.options.map((option) => (
                <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(tempFilters[group.id] || []).includes(option.id)}
                    onChange={(e) => handleFilterChange(group.id, option.id, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                  {option.count !== undefined && (
                    <span className="text-xs text-gray-500">({option.count})</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {getTotalAppliedFilters()} filter{getTotalAppliedFilters() !== 1 ? 's' : ''} selected
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

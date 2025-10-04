import React from 'react';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastListProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'bottom-right';
  maxVisible?: number;
}

// Professional subtle toast list – limited, dismissible, accessible
export const ToastList: React.FC<ToastListProps> = ({ toasts, onDismiss, position = 'bottom-right', maxVisible = 3 }) => {
  if (!toasts.length) return null;

  const posClasses = position === 'bottom-right'
    ? 'fixed bottom-4 right-4'
    : 'fixed top-4 right-4';

  const visible = toasts.slice(0, maxVisible);

  return (
    <div className={`${posClasses} z-50 flex flex-col gap-3 w-80`} role="region" aria-label="Notifications">
      {visible.map(t => {
        const color = t.type === 'success'
          ? 'border-green-200 bg-white'
          : t.type === 'error'
            ? 'border-red-200 bg-white'
            : 'border-gray-200 bg-white';
        const accent = t.type === 'success'
          ? 'bg-green-500'
          : t.type === 'error'
            ? 'bg-red-500'
            : 'bg-blue-500';
        return (
            <div
              key={t.id}
              className={`relative border ${color} rounded-lg shadow-sm px-4 py-3 text-sm text-gray-700 flex items-start gap-3 group`}
              role="status"
              aria-live="polite"
            >
              <span className={`w-1 self-stretch rounded-full ${accent}`} aria-hidden="true" />
              <div className="flex-1 pr-6 leading-relaxed">
                {t.message}
              </div>
              <button
                onClick={() => onDismiss(t.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 rounded p-1"
                aria-label="Dismiss notification"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
        );
      })}
    </div>
  );
};

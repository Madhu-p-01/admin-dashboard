import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface User {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: User | null;
  onSend: (message: string) => void;
}

export function MessagingModal({ 
  isOpen, 
  onClose, 
  recipient, 
  onSend 
}: MessagingModalProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && recipient) {
      onSend(message.trim());
      setMessage('');
      onClose();
    }
  };

  const handleCancel = () => {
    setMessage('');
    onClose();
  };

  if (!isOpen || !recipient) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-25 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          {/* Recipient Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: recipient.color }}
          >
            {recipient.initials}
          </div>
          
          {/* Recipient Info */}
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{recipient.name}</div>
            <div className="text-xs text-gray-500">{recipient.role}</div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message Input */}
        <div className="p-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className={cn(
              "px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors",
              message.trim() 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-gray-300 cursor-not-allowed"
            )}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

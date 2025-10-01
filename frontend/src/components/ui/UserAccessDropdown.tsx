import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface User {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  isOnline?: boolean;
}

interface UserAccessDropdownProps {
  users: User[];
  isOpen: boolean;
  onClose: () => void;
  onMessageUser: (userId: string) => void;
  onUserMenu: (userId: string) => void;
}

export function UserAccessDropdown({ 
  users, 
  isOpen, 
  onClose, 
  onMessageUser, 
  onUserMenu 
}: UserAccessDropdownProps) {
  if (!isOpen) return null;

  const visibleUsers = users.slice(0, 8);
  const remainingCount = users.length - visibleUsers.length;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Dropdown */}
      <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* User List */}
        <div className="max-h-96 overflow-y-auto">
          {visibleUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white relative"
                  style={{ backgroundColor: user.color }}
                >
                  {user.initials}
                  {user.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Message Button */}
                <button
                  onClick={() => onMessageUser(user.id)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Send message"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>

                {/* View Report */}
                <button className="text-xs text-blue-600 hover:text-blue-700">
                  View report
                </button>

                {/* Menu Button */}
                <button
                  onClick={() => onUserMenu(user.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show More */}
        {remainingCount > 0 && (
          <div className="p-4 border-t border-gray-100">
            <button className="text-sm text-blue-600 hover:text-blue-700">
              {remainingCount} more
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="absolute top-4 right-4">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#3b82f6"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${25 * 1.256} ${100 * 1.256}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-700">25%</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

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
      <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* User List */}
        <div className="max-h-96 overflow-y-auto">
          {visibleUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1">
                {/* Avatar with online status */}
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.initials}
                  </div>
                  {/* Online status indicator */}
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white",
                    user.isOnline ? "bg-green-500" : "bg-red-500"
                  )} />
                </div>
                
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {/* Message Button */}
                <button
                  onClick={() => onMessageUser(user.id)}
                  className="text-gray-900 hover:text-blue-600 transition-colors"
                  title="Send message"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>

                {/* Menu Button */}
                <button
                  onClick={() => onUserMenu(user.id)}
                  className="text-gray-900 hover:text-gray-600 transition-colors"
                  title="More options"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show More */}
        {remainingCount > 0 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              {remainingCount} more
            </button>
          </div>
        )}
      </div>
    </>
  );
}

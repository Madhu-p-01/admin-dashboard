import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { UserAccessDropdown } from "./UserAccessDropdown";
import { MessagingModal } from "./MessagingModal";
import { AccessGrantingForm } from "./AccessGrantingForm";

interface User {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  isOnline?: boolean;
}

interface TopBarProps {
  title: string;
  searchPlaceholder?: string;
  users?: User[];
  onSearch?: (value: string) => void;
  onNotificationClick?: () => void;
  className?: string;
}

export function TopBar({
  title,
  searchPlaceholder = "Search...",
  users = [],
  onSearch,
  onNotificationClick,
  className,
}: TopBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Default users if none provided
  const defaultUsers: User[] = [
    { id: '1', name: 'Sarah Johnson', role: 'Super Admin', initials: 'SJ', color: '#3b82f6', isOnline: true },
    { id: '2', name: 'Michael Chen', role: 'Editor', initials: 'MC', color: '#ef4444', isOnline: false },
    { id: '3', name: 'Emily Davis', role: 'Moderator', initials: 'ED', color: '#10b981', isOnline: true },
    { id: '4', name: 'James Wilson', role: 'Super Admin', initials: 'JW', color: '#8b5cf6', isOnline: true },
    { id: '5', name: 'Lisa Anderson', role: 'Editor', initials: 'LA', color: '#f59e0b', isOnline: false },
    { id: '6', name: 'David Brown', role: 'Moderator', initials: 'DB', color: '#06b6d4', isOnline: true },
    { id: '7', name: 'Jessica Miller', role: 'Editor', initials: 'JM', color: '#ec4899', isOnline: false },
    { id: '8', name: 'Robert Taylor', role: 'Moderator', initials: 'RT', color: '#14b8a6', isOnline: true },
    { id: '9', name: 'Amanda White', role: 'Super Admin', initials: 'AW', color: '#6366f1', isOnline: true },
    { id: '10', name: 'Christopher Lee', role: 'Editor', initials: 'CL', color: '#f97316', isOnline: false },
    { id: '11', name: 'Rachel Green', role: 'Moderator', initials: 'RG', color: '#84cc16', isOnline: true },
    { id: '12', name: 'Daniel Martinez', role: 'Editor', initials: 'DM', color: '#a855f7', isOnline: true },
    { id: '13', name: 'Olivia Harris', role: 'Super Admin', initials: 'OH', color: '#0ea5e9', isOnline: false },
    { id: '14', name: 'Matthew Clark', role: 'Moderator', initials: 'MC', color: '#22c55e', isOnline: true },
  ];

  const allUsers = users.length > 0 ? users : defaultUsers;

  const handleMessageUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsDropdownOpen(false);
      setIsMessagingOpen(true);
    }
  };

  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message, "to:", selectedUser?.name);
    // Handle message sending logic here
  };

  const handleAddUser = (userData: any) => {
    console.log("Adding new user:", userData);
    // Handle user addition logic here
  };

  const displayedUsers = allUsers.slice(0, 3);
  return (
    <div className="px-6 pt-6">
      <div
        className={cn(
          "bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-1.5 flex items-center justify-between",
          className
        )}
      >
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

      {/* Right Section */}
      <div className="flex items-center gap-3 relative">
        {/* Combined User Avatars and Add Button Container */}
        <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
          {/* User Avatars Section */}
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="flex items-center">
              {displayedUsers.map((user, index) => (
                <div
                  key={user.id}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white cursor-pointer",
                    index > 0 && "-ml-3"
                  )}
                  style={{ backgroundColor: user.color }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {user.initials}
                </div>
              ))}
            </div>

            {/* Dropdown Arrow */}
            <button 
              title="User actions"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-300"></div>

          {/* Add User Button Section */}
          <button 
            title="Add User"
            className="px-4 py-2 flex items-center justify-center text-black hover:bg-gray-50 transition-colors"
            onClick={() => setIsFormOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* User Access Dropdown - Positioned outside container */}
        <UserAccessDropdown
          users={allUsers}
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
          onMessageUser={handleMessageUser}
          onUserMenu={(userId) => console.log('User menu:', userId)}
        />

        {/* Notification Bell */}
        <button
          onClick={onNotificationClick}
          title="Notifications"
          className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>

      {/* Messaging Modal */}
      <MessagingModal
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
        recipient={selectedUser}
        onSend={handleSendMessage}
      />

      {/* Access Granting Form */}
      <AccessGrantingForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddUser}
      />
      </div>
    </div>
  );
}

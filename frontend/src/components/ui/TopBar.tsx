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

  const handleMessageUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
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

  const displayedUsers = users.slice(0, 3);
  return (
    <div
      className={cn(
        "bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between",
        className
      )}
    >
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        {/* User Avatars */}
        <div className="flex items-center relative">
          {displayedUsers.map((user, index) => (
            <div
              key={user.id}
              className={cn(
                "w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white cursor-pointer",
                index > 0 && "-ml-2"
              )}
              style={{ backgroundColor: user.color }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {user.initials}
            </div>
          ))}

          {/* Add User Button */}
          <div 
            className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 ml-2 cursor-pointer hover:border-gray-400"
            onClick={() => setIsFormOpen(true)}
          >
            <span className="text-lg">+</span>
          </div>

          {/* User Access Dropdown */}
          <UserAccessDropdown
            users={users}
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            onMessageUser={handleMessageUser}
            onUserMenu={(userId) => console.log('User menu:', userId)}
          />
        </div>

        {/* Notification Bell */}
        <button
          onClick={onNotificationClick}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="text-lg">🔔</span>
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
  );
}

import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { UserAccessDropdown } from "./UserAccessDropdown";
import { MessagingModal } from "./MessagingModal";
import { AccessGrantingForm } from "./AccessGrantingForm";
import { Plus, Bell, ChevronDown } from "lucide-react";

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
        "bg-white border border-gray-200 px-6 py-2 flex items-center justify-between rounded-xl shadow-sm mx-2 sm:mx-4 lg:mx-6 mt-2 sm:mt-4 lg:mt-6",
        className
      )}
    >
      {/* Title */}
      <h1 
        className="text-black"
        style={{
          fontFamily: 'Inter',
          fontWeight: 500, // Medium
          fontSize: '25px',
          lineHeight: '20px',
          letterSpacing: '0%',
          textAlign: 'left',
          verticalAlign: 'middle'
        }}
      >
        {title}
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-3">
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

          {/* Chevron Down */}
          <ChevronDown 
            className="w-4 h-4 text-gray-400 ml-1 cursor-pointer" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />

          {/* User Access Dropdown */}
          <UserAccessDropdown
            users={users}
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            onMessageUser={handleMessageUser}
            onUserMenu={(userId) => console.log('User menu:', userId)}
          />
        </div>

        {/* Plus Button */}
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={onNotificationClick}
          className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Bell className="w-4 h-4 text-gray-600" />
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

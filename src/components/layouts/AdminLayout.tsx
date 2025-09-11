"use client";

import React, { useState } from "react";
import { AdminLayoutProps } from "@/types";
import { cn } from "@/utils";
import { Sidebar } from "../navigation/Sidebar";
import { TopBar } from "../navigation/TopBar";

export function AdminLayout({
  children,
  navigation,
  user,
  branding,
  theme,
  onLogout,
  onUserMenuClick,
  sidebarCollapsed: controlledCollapsed,
  onSidebarToggle,
  className,
}: AdminLayoutProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  
  const handleSidebarToggle = () => {
    if (onSidebarToggle) {
      onSidebarToggle();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Sidebar */}
      <Sidebar
        navigation={navigation}
        branding={branding}
        collapsed={isCollapsed}
        onToggle={handleSidebarToggle}
        theme={theme}
      />
      
      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* Top Bar */}
        <TopBar
          user={user}
          onLogout={onLogout}
          onUserMenuClick={onUserMenuClick}
          onSidebarToggle={handleSidebarToggle}
          sidebarCollapsed={isCollapsed}
          branding={branding}
          theme={theme}
        />
        
        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { NavigationItem, NavigationGroup, BrandingConfig, AdminTheme } from "@/types";
import { cn, getInitials } from "@/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  navigation: NavigationItem[] | NavigationGroup[];
  branding?: BrandingConfig;
  collapsed: boolean;
  onToggle: () => void;
  theme?: Partial<AdminTheme>;
}

export function Sidebar({
  navigation,
  branding,
  collapsed,
  onToggle,
  theme,
}: SidebarProps) {
  const isNavigationGroups = (nav: NavigationItem[] | NavigationGroup[]): nav is NavigationGroup[] => {
    return nav.length > 0 && 'items' in nav[0];
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const Icon = typeof item.icon === 'string' ? null : item.icon;
    const hasChildren = item.children && item.children.length > 0;
    
    return (
      <div key={item.href} className="space-y-1">
        <a
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            item.isActive && "bg-primary text-primary-foreground",
            item.disabled && "opacity-50 cursor-not-allowed",
            level > 0 && "ml-6",
            collapsed && level === 0 && "justify-center px-2"
          )}
        >
          {Icon && (
            <Icon className={cn("h-4 w-4 flex-shrink-0")} />
          )}
          {typeof item.icon === 'string' && (
            <div className={cn(
              "h-4 w-4 flex-shrink-0 rounded bg-primary/10 flex items-center justify-center text-xs font-medium",
              item.isActive && "bg-primary-foreground/20"
            )}>
              {item.icon}
            </div>
          )}
          {!collapsed && (
            <>
              <span className="flex-1 truncate">{item.title}</span>
              {item.badge && (
                <span className={cn(
                  "px-2 py-0.5 text-xs font-medium rounded-full",
                  "bg-primary/10 text-primary",
                  item.isActive && "bg-primary-foreground/20 text-primary-foreground"
                )}>
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              )}
            </>
          )}
        </a>
        
        {hasChildren && !collapsed && (
          <div className="space-y-1">
            {item.children!.map((child) => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderNavigationGroup = (group: NavigationGroup) => {
    return (
      <div key={group.title || 'default'} className="space-y-2">
        {group.title && !collapsed && (
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {group.title}
          </h3>
        )}
        <div className="space-y-1">
          {group.items.map((item) => renderNavigationItem(item))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-full bg-card border-r border-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {!collapsed && branding && (
          <div className="flex items-center gap-3">
            {branding.logo ? (
              <img
                src={branding.logo}
                alt={branding.title}
                className="h-8 w-8 rounded"
              />
            ) : (
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                {getInitials(branding.title)}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {branding.title}
              </span>
              {branding.subtitle && (
                <span className="text-xs text-muted-foreground">
                  {branding.subtitle}
                </span>
              )}
            </div>
          </div>
        )}
        
        {collapsed && branding && (
          <div className="flex items-center justify-center w-full">
            {branding.logo ? (
              <img
                src={branding.logo}
                alt={branding.title}
                className="h-8 w-8 rounded"
              />
            ) : (
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                {getInitials(branding.title)}
              </div>
            )}
          </div>
        )}
        
        <button
          onClick={onToggle}
          className={cn(
            "p-1.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {isNavigationGroups(navigation) ? (
          navigation.map((group) => renderNavigationGroup(group))
        ) : (
          <div className="space-y-1">
            {navigation.map((item) => renderNavigationItem(item))}
          </div>
        )}
      </div>
    </div>
  );
}

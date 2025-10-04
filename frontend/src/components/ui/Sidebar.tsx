import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Icon } from "./Icon";

interface SubItem {
  title: string;
  href: string;
  isActive?: boolean;
}

interface SecondaryAction {
  icon: string;
  tooltip: string;
  onClick?: () => void;
  href?: string;
}

interface NavigationItem {
  title: string;
  href: string;
  icon: () => React.ReactElement;
  isActive?: boolean;
  subItems?: SubItem[];
  badge?: string | number;
  secondaryActions?: SecondaryAction[];
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
  collapsible?: boolean;
  isCollapsed?: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface SidebarProps {
  navigation: NavigationItem[];
  sections?: NavigationSection[];
  user: User;
  branding: {
    title: string;
    subtitle?: string;
    logo?: string;
  };
  onLogout?: () => void;
  className?: string;
}

export function Sidebar({
  navigation,
  user,
  branding,
  onLogout,
  className,
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  return (
    <div
      className={cn(
        "w-64 bg-slate-800 text-white p-6 flex flex-col min-h-screen",
        className
      )}
    >
      {/* Branding */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold italic">{branding.title}</h1>
        {branding.subtitle && (
          <p className="text-sm text-slate-400">{branding.subtitle}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <div className="space-y-2">
          {navigation.map((item) => {
            const ItemIcon = item.icon;
            const isExpanded = expandedItems.includes(item.href);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.href} className="group">
                {/* Main Navigation Item */}
                <div className="flex items-center">
                  {hasSubItems ? (
                    // Navigation link with dropdown toggle for items with subitems
                    <div className="flex items-center flex-1">
                      <Link
                        to={item.href}
                        onClick={() => toggleExpanded(item.href)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 relative group-hover:bg-slate-700",
                          item.isActive
                            ? "bg-slate-700 text-white shadow-sm"
                            : "text-slate-300 hover:text-white"
                        )}
                      >
                        <ItemIcon />
                        <span className="truncate">{item.title}</span>

                        {/* Badge */}
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">
                            {item.badge}
                          </span>
                        )}
                      </Link>

                      {/* Dropdown Icon - Always visible for items with subitems */}
                      <Icon
                        name="chevron-right"
                        size={16}
                        className={cn(
                          "transition-transform text-slate-400 mr-3",
                          isExpanded && "rotate-90"
                        )}
                      />
                    </div>
                  ) : (
                    // Regular navigation link for items without subitems
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 relative group-hover:bg-slate-700",
                        item.isActive
                          ? "bg-slate-700 text-white shadow-sm"
                          : "text-slate-300 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <ItemIcon />
                        <span className="truncate">{item.title}</span>

                        {/* Badge */}
                        {item.badge && (
                          <span className="ml-auto px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  )}

                  {/* Secondary Actions */}
                  {item.secondaryActions && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.secondaryActions.map((action, index) =>
                        action.href ? (
                          <Link
                            key={index}
                            to={action.href}
                            className="p-1.5 text-slate-400 hover:text-white transition-colors rounded"
                            title={action.tooltip}
                          >
                            <Icon name={action.icon} size={16} />
                          </Link>
                        ) : (
                          <button
                            key={index}
                            onClick={action.onClick}
                            className="p-1.5 text-slate-400 hover:text-white transition-colors rounded"
                            title={action.tooltip}
                          >
                            <Icon name={action.icon} size={16} />
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Sub Navigation Items - Don't collapse when clicking subitems */}
                {hasSubItems && isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems!.map((subItem) => (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-lg transition-colors",
                          subItem.isActive
                            ? "bg-slate-600 text-white"
                            : "text-slate-400 hover:text-white hover:bg-slate-700"
                        )}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-700 pt-4 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-sm font-bold">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full"
              />
            ) : (
              user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user.name}</div>
            <div className="text-xs text-slate-400 truncate">{user.email}</div>
          </div>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="mt-3 w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

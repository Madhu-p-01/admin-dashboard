import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

// Navigation Types
export interface NavigationItem {
  title: string;
  href: string;
  icon?: LucideIcon | string;
  badge?: string | number;
  children?: NavigationItem[];
  isActive?: boolean;
  disabled?: boolean;
}

export interface NavigationGroup {
  title?: string;
  items: NavigationItem[];
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  permissions?: string[];
}

// Theme Types
export interface AdminTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    muted: string;
    accent: string;
    destructive: string;
    border: string;
    sidebar: string;
    topbar: string;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  typography: Record<string, string>;
}

// Branding Types
export interface BrandingConfig {
  logo?: string;
  logoUrl?: string;
  title: string;
  subtitle?: string;
  favicon?: string;
  colors?: Partial<AdminTheme["colors"]>;
}

// Layout Types
export interface AdminLayoutProps {
  children: ReactNode;
  navigation: NavigationItem[] | NavigationGroup[];
  user: User;
  branding?: BrandingConfig;
  theme?: Partial<AdminTheme>;
  onLogout?: () => void;
  onUserMenuClick?: (action: string) => void;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  className?: string;
}

// Data Table Types
export interface ColumnDef<T = any> {
  key: keyof T | string;
  title: string;
  width?: string | number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface ActionButton<T = any> {
  label: string;
  icon?: LucideIcon;
  onClick: (row: T) => void;
  variant?: "default" | "destructive" | "outline" | "secondary";
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "dateRange" | "number";
  options?: { label: string; value: any }[];
  placeholder?: string;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  onPageChange: (page: number, pageSize: number) => void;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  actions?: ActionButton<T>[];
  bulkActions?: ActionButton<T[]>[];
  filters?: FilterConfig[];
  pagination?: PaginationConfig;
  selection?: {
    enabled: boolean;
    selectedRows: T[];
    onSelectionChange: (rows: T[]) => void;
    getRowId: (row: T) => string | number;
  };
  onRowClick?: (row: T, index: number) => void;
  emptyState?: ReactNode;
  className?: string;
}

// Stats Card Types
export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
    period?: string;
  };
  icon?: LucideIcon;
  description?: string;
  trend?: {
    data: number[];
    color?: string;
  };
  loading?: boolean;
  className?: string;
}

// Chart Types
export interface ChartData {
  [key: string]: any;
}

export interface ChartConfig {
  type: "line" | "bar" | "area" | "pie" | "doughnut";
  data: ChartData[];
  xKey?: string;
  yKey?: string | string[];
  colors?: string[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "date"
    | "file";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { label: string; value: any }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | undefined;
  };
  description?: string;
  className?: string;
}

export interface FormBuilderProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  loading?: boolean;
  submitLabel?: string;
  resetLabel?: string;
  showReset?: boolean;
  className?: string;
  defaultValues?: Record<string, any>;
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

// Notification Types
export interface NotificationConfig {
  position:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  duration?: number;
  maxNotifications?: number;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

// Permission Types
export interface Permission {
  resource: string;
  action: "create" | "read" | "update" | "delete" | "manage";
}

export interface PermissionCheck {
  user: User;
  permission: Permission;
}

// Export all types
export type { ReactNode, LucideIcon };

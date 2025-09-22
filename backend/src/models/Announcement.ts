export interface Announcement {
  announcement_id: string;
  message: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
  start_date: string;
  end_date?: string;
  display_on: string[];
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAnnouncementRequest {
  message: string;
  type?: AnnouncementType;
  status?: AnnouncementStatus;
  startDate?: string;
  endDate?: string;
  displayOn?: string[];
  priority?: number;
}

export interface UpdateAnnouncementRequest {
  message?: string;
  type?: AnnouncementType;
  status?: AnnouncementStatus;
  startDate?: string;
  endDate?: string;
  displayOn?: string[];
  priority?: number;
}

export interface AnnouncementQueryParams {
  type?: AnnouncementType;
  status?: AnnouncementStatus;
  displayOn?: string;
  active?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

export interface BulkAnnouncementPriorityUpdate {
  announcementId: string;
  priority: number;
}

export type AnnouncementType = 'info' | 'warning' | 'success' | 'error' | 'promo';
export type AnnouncementStatus = 'active' | 'inactive' | 'scheduled';


export interface AnnouncementResponse extends ApiResponse<Announcement> {}
export interface AnnouncementsResponse extends ApiResponse<PaginatedResponse<Announcement>> {}


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const ANNOUNCEMENT_COLUMNS = [
  'announcement_id',
  'message',
  'type',
  'status',
  'start_date',
  'end_date',
  'display_on',
  'priority',
  'created_at',
  'updated_at'
].join(',');
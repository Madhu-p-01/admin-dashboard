import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import {
  AnnouncementStatus,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
  AnnouncementQueryParams,
  BulkAnnouncementPriorityUpdate
} from '../models/Announcement';

export class AnnouncementController {
  
  // Create a new announcement
  static async createAnnouncement(req: Request, res: Response): Promise<void> {
    try {
      const {
        message,
        type = 'info',
        status = 'active',
        startDate,
        endDate,
        displayOn = ['homepage', 'checkout'],
        priority = 1
      }: CreateAnnouncementRequest = req.body;

      const announcement_id = uuidv4();
      const now = new Date().toISOString();

      const announcementData = {
        announcement_id,
        message,
        type,
        status,
        start_date: startDate ? new Date(startDate).toISOString() : now,
        end_date: endDate ? new Date(endDate).toISOString() : null,
        display_on: displayOn,
        priority,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('announcements')
        .insert([announcementData])
        .select('*')
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to create announcement',
          error: error.message
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Announcement created successfully',
        data: data
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // Get all announcements
  static async getAnnouncements(req: Request, res: Response): Promise<void> {
    try {
      const {
        type,
        status,
        displayOn,
        active,
        page = 1,
        limit = 20,
        search
      }: AnnouncementQueryParams = req.query as any;

      let query = supabase.from('announcements').select('*', { count: 'exact' });

      if (type) {
        query = query.eq('type', type);
      }

      if (status) {
        query = query.eq('status', status);
      }

      if (displayOn) {
        query = query.contains('display_on', [displayOn]);
      }

      if (active !== undefined && active) {
        const now = new Date().toISOString();
        query = query.eq('status', 'active')
                     .lte('start_date', now)
                     .or(`end_date.is.null,end_date.gte.${now}`);
      }

      if (search) {
        query = query.ilike('message', `%${search}%`);
      }

      query = query.order('priority', { ascending: false })
                   .order('created_at', { ascending: false });


      const pageNum = parseInt(String(page), 10);
      const limitNum = parseInt(String(limit), 10);
      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum - 1;

      query = query.range(from, to);
      const { data, error, count } = await query;

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch announcements',
          error: error.message
        });
        return;
      }

      const totalPages = Math.ceil((count || 0) / limitNum);
      res.json({
        success: true,
        message: 'Announcements fetched successfully',
        data: {
          data: data || [],
          meta: {
            page: pageNum,
            limit: limitNum,
            total: count || 0,
            totalPages
          }
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // Get a single announcement
  static async getAnnouncement(req: Request, res: Response): Promise<void> {
    try {
      const announcement_id = req.params.id;

      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('announcement_id', announcement_id)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch announcement',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Announcement not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Announcement fetched successfully',
        data: data
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // Update an announcement
  static async updateAnnouncement(req: Request, res: Response): Promise<void> {
    try {
      const announcement_id = req.params.id;
      const updates: UpdateAnnouncementRequest = req.body;

      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (updates.startDate !== undefined) {
        updateData.start_date = new Date(updates.startDate).toISOString();
        delete updateData.startDate;
      }

      if (updates.endDate !== undefined) {
        updateData.end_date = updates.endDate ? new Date(updates.endDate).toISOString() : null;
        delete updateData.endDate;
      }

      if (updates.displayOn !== undefined) {
        updateData.display_on = updates.displayOn;
        delete updateData.displayOn;
      }

      const { data, error } = await supabase
        .from('announcements')
        .update(updateData)
        .eq('announcement_id', announcement_id)
        .select('*')
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update announcement',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Announcement not found'
        });
        return;
      }
      res.json({
        success: true,
        message: 'Announcement updated successfully',
        data: data
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // Delete an announcement
  static async deleteAnnouncement(req: Request, res: Response): Promise<void> {
    try {
      const announcement_id = req.params.id;

      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('announcement_id', announcement_id);

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to delete announcement',
          error: error.message
        });
        return;
      }
      res.json({
        success: true,
        message: 'Announcement deleted successfully'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // Get active announcements  (for frontend use)
  static async getActiveAnnouncements(req: Request, res: Response): Promise<void> {
    try {
      const { displayOn = 'homepage' } = req.query;
      const now = new Date().toISOString();

      let query = supabase
        .from('announcements')
        .select('*')
        .eq('status', 'active')
        .lte('start_date', now)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .contains('display_on', [displayOn]);

      query = query.order('priority', { ascending: false })
                   .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch active announcements',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Active announcements fetched successfully',
        data: data || []
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // Update announcement status (activate/deactivate)
  static async updateAnnouncementStatus(req: Request, res: Response): Promise<void> {
    try {
      const announcement_id = req.params.id;
      const { status }: { status: AnnouncementStatus } = req.body;

      const { data, error } = await supabase
        .from('announcements')
        .update({ 
          status,
          updated_at: new Date().toISOString() 
        })
        .eq('announcement_id', announcement_id)
        .select('*')
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update announcement status',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Announcement not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Announcement status updated successfully',
        data: data
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // Get upcoming scheduled announcements
  static async getScheduledAnnouncements(req: Request, res: Response): Promise<void> {
    try {
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('status', 'scheduled')
        .gt('start_date', now)
        .order('start_date', { ascending: true });

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch scheduled announcements',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Scheduled announcements fetched successfully',
        data: data || []
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // Bulk update announcement priorities
  static async updateAnnouncementPriorities(req: Request, res: Response): Promise<void> {
    try {
      const { updates }: { updates: BulkAnnouncementPriorityUpdate[] } = req.body;
      const errors: any[] = [];
      const successful: string[] = [];

      for (const update of updates) {
        const { announcementId, priority } = update;
        
        const { error } = await supabase
          .from('announcements')
          .update({ 
            priority,
            updated_at: new Date().toISOString() 
          })
          .eq('announcement_id', announcementId);

        if (error) {
          errors.push({ announcementId, error: error.message });
        } else {
          successful.push(announcementId);
        }
      }

      if (errors.length > 0) {
        res.status(207).json({
          success: false,
          message: `Bulk update completed with ${errors.length} errors`,
          data: {
            successful,
            errors
          }
        });
        return;
      }

      res.json({
        success: true,
        message: 'Announcement priorities updated successfully',
        data: {
          successful
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }
}
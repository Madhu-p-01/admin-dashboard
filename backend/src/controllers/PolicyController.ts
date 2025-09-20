import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import {
  CreatePolicyRequest,
  UpdatePolicyRequest,
  PolicyQueryParams
} from '../models/Policy';

export class PolicyController {
  
  // Create a new policy
  static async createPolicy(req: Request, res: Response): Promise<void> {
    try {
      const {
        title,
        content,
        policyType,
        status = 'published',
        version = '1.0',
        effectiveDate
      }: CreatePolicyRequest = req.body;

      const policy_id = uuidv4();
      const now = new Date().toISOString();

      const policyData = {
        policy_id,
        title,
        content,
        policy_type: policyType || null,
        status,
        version,
        effective_date: effectiveDate ? new Date(effectiveDate).toISOString() : now,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('policies')
        .insert([policyData])
        .select('*')
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to create policy',
          error: error.message
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Policy created successfully',
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

  // Get all policies
  static async getPolicies(req: Request, res: Response): Promise<void> {
    try {
      const {
        policyType,
        status,
        page = 1,
        limit = 20,
        search
      }: PolicyQueryParams = req.query as any;

      let query = supabase.from('policies').select('*', { count: 'exact' });

      if (policyType) {
        query = query.eq('policy_type', policyType);
      }

      if (status) {
        query = query.eq('status', status);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
      }

      query = query.order('effective_date', { ascending: false })
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
          message: 'Failed to fetch policies',
          error: error.message
        });
        return;
      }

      const totalPages = Math.ceil((count || 0) / limitNum);

      res.json({
        success: true,
        message: 'Policies fetched successfully',
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

  // Get a single policy by ID
  static async getPolicy(req: Request, res: Response): Promise<void> {
    try {
      const policy_id = req.params.id;

      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('policy_id', policy_id)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch policy',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Policy not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Policy fetched successfully',
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

  // Get policy by type (for frontend use)
  static async getPolicyByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;

      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('policy_type', type)
        .eq('status', 'published')
        .order('effective_date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch policy',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Policy not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Policy fetched successfully',
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

  // Update a policy
  static async updatePolicy(req: Request, res: Response): Promise<void> {
    try {
      const policy_id = req.params.id;
      const updates: UpdatePolicyRequest = req.body;
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (updates.policyType !== undefined) {
        updateData.policy_type = updates.policyType;
        delete updateData.policyType;
      }

      if (updates.effectiveDate !== undefined) {
        updateData.effective_date = new Date(updates.effectiveDate).toISOString();
        delete updateData.effectiveDate;
      }

      const { data, error } = await supabase
        .from('policies')
        .update(updateData)
        .eq('policy_id', policy_id)
        .select('*')
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update policy',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Policy not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Policy updated successfully',
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

  // Delete a policy
  static async deletePolicy(req: Request, res: Response): Promise<void> {
    try {
      const policy_id = req.params.id;

      const { error } = await supabase
        .from('policies')
        .delete()
        .eq('policy_id', policy_id);

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to delete policy',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Policy deleted successfully'
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

  // Get all published policies for frontend
  static async getPublishedPolicies(req: Request, res: Response): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('policy_id, title, policy_type, version, effective_date, created_at, updated_at')
        .eq('status', 'published')
        .order('effective_date', { ascending: false });

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch published policies',
          error: error.message
        });
        return;
      }

      const groupedPolicies = (data || []).reduce((groups: any, policy) => {
        const type = policy.policy_type || 'other';
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push(policy);
        return groups;
      }, {});

      res.json({
        success: true,
        message: 'Published policies fetched successfully',
        data: groupedPolicies
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

  // Create new version of a policy
  static async createPolicyVersion(req: Request, res: Response): Promise<void> {
    try {
      const policy_id = req.params.id;
      const {
        title,
        content,
        version,
        effectiveDate
      }: { title?: string; content?: string; version?: string; effectiveDate?: string } = req.body;

      const { data: currentPolicy, error: fetchError } = await supabase
        .from('policies')
        .select('*')
        .eq('policy_id', policy_id)
        .single();

      if (fetchError || !currentPolicy) {
        res.status(404).json({
          success: false,
          message: 'Original policy not found'
        });
        return;
      }
      await supabase
        .from('policies')
        .update({ status: 'archived', updated_at: new Date().toISOString() })
        .eq('policy_id', policy_id);

      const new_policy_id = uuidv4();
      const now = new Date().toISOString();

      const newPolicyData = {
        policy_id: new_policy_id,
        title: title || currentPolicy.title,
        content: content || currentPolicy.content,
        policy_type: currentPolicy.policy_type,
        status: 'published',
        version: version || `${parseFloat(currentPolicy.version) + 0.1}`,
        effective_date: effectiveDate ? new Date(effectiveDate).toISOString() : now,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('policies')
        .insert([newPolicyData])
        .select('*')
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to create policy version',
          error: error.message
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Policy version created successfully',
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
}
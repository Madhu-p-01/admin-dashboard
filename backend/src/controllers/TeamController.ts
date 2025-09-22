import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import { 
  TeamMember, 
  Role, 
  AuditLog, 
  TeamMemberCreateRequest, 
  TeamMemberUpdateRequest,
  RoleCreateRequest,
  RoleUpdateRequest,
  TeamMemberQuery,
  AuditLogQuery,
  AVAILABLE_PERMISSIONS,
  DEFAULT_ROLES
} from '../models/Team';

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export class TeamController {
  // 1. Invite/Add Team Member
  static async createTeamMember(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, email, role, permissions }: TeamMemberCreateRequest = req.body;
      const currentUser = req.user;

      // Check if user already exists
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('email', email)
        .single();

      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: 'Team member with this email already exists'
        });
      }

      // Create team member
      const { data: newMember, error } = await supabase
        .from('team_members')
        .insert({
          name,
          email,
          role,
          permissions,
          status: 'active',
          created_by: currentUser?.id,
          joined_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Log the action
      await TeamController.logAuditAction(
        currentUser?.id || '',
        currentUser?.name || 'System',
        'Created team member',
        'team_member',
        newMember.id,
        { name, email, role }
      );

      return res.status(201).json({
        success: true,
        message: 'Team member invited successfully',
        data: {
          memberId: newMember.id,
          name: newMember.name,
          email: newMember.email,
          role: newMember.role
        }
      });
    } catch (error) {
      console.error('Error creating team member:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create team member',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // 2. Get All Team Members
  static async getTeamMembers(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        status,
        role,
        search,
        page = 1,
        limit = 20,
        sort = 'joinedAt',
        order = 'desc'
      }: TeamMemberQuery = req.query as any;

      let query = supabase
        .from('team_members')
        .select('*')
        .order(sort === 'joinedAt' ? 'joined_at' : sort === 'lastLogin' ? 'last_login' : sort || 'joined_at', { ascending: order === 'asc' });

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }
      if (role) {
        query = query.eq('role', role);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data: members, error, count } = await query;

      if (error) {
        throw error;
      }

      return res.json({
        success: true,
        message: 'Team members fetched successfully',
        data: {
          data: members || [],
          meta: {
            page: Number(page),
            limit: Number(limit),
            total: count || 0,
            totalPages: Math.ceil((count || 0) / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('Error fetching team members:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch team members',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // 3. Get Single Team Member
  static async getTeamMember(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const { data: member, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({
            success: false,
            message: 'Team member not found'
          });
        }
        throw error;
      }

      return res.json({
        success: true,
        message: 'Team member fetched successfully',
        data: member
      });
    } catch (error) {
      console.error('Error fetching team member:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch team member',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // 4. Update Team Member Info
  static async updateTeamMember(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData: TeamMemberUpdateRequest = req.body;
      const currentUser = req.user;

      // Check if member exists
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single();

      if (!existingMember) {
        return res.status(404).json({
          success: false,
          message: 'Team member not found'
        });
      }

      // Update member
      const { data: updatedMember, error } = await supabase
        .from('team_members')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Log the action
      await TeamController.logAuditAction(
        currentUser?.id || '',
        currentUser?.name || 'System',
        'Updated team member',
        'team_member',
        id,
        updateData
      );

      return res.json({
        success: true,
        message: 'Team member updated successfully',
        data: updatedMember
      });
    } catch (error) {
      console.error('Error updating team member:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update team member',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // 5. Suspend/Deactivate Member
  static async updateMemberStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const currentUser = req.user;

      const { data: updatedMember, error } = await supabase
        .from('team_members')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({
            success: false,
            message: 'Team member not found'
          });
        }
        throw error;
      }

      // Log the action
      await TeamController.logAuditAction(
        currentUser?.id || '',
        currentUser?.name || 'System',
        `Changed member status to ${status}`,
        'team_member',
        id,
        { status }
      );

      return res.json({
        success: true,
        message: `Team member ${status} successfully`,
        data: updatedMember
      });
    } catch (error) {
      console.error('Error updating member status:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update member status',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // 6. Delete Member (Remove Access)
  static async deleteTeamMember(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      // Check if member exists
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single();

      if (!existingMember) {
        return res.status(404).json({
          success: false,
          message: 'Team member not found'
        });
      }

      // Delete member
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Log the action
      await TeamController.logAuditAction(
        currentUser?.id || '',
        currentUser?.name || 'System',
        'Deleted team member',
        'team_member',
        id,
        { name: existingMember.name, email: existingMember.email }
      );

      return res.json({
        success: true,
        message: 'Team member removed successfully'
      });
    } catch (error) {
      console.error('Error deleting team member:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete team member',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // 7. Roles Management - Create Role
  static async createRole(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, description, permissions }: RoleCreateRequest = req.body;
      const currentUser = req.user;

      // Check if role already exists
      const { data: existingRole } = await supabase
        .from('roles')
        .select('id')
        .eq('name', name)
        .single();

      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: 'Role with this name already exists'
        });
      }

      // Create role
      const { data: newRole, error } = await supabase
        .from('roles')
        .insert({
          name,
          description,
          permissions,
          is_system: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Log the action
      await TeamController.logAuditAction(
        currentUser?.id || '',
        currentUser?.name || 'System',
        'Created role',
        'role',
        newRole.id,
        { name, permissions }
      );

      return res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data: newRole
      });
    } catch (error) {
      console.error('Error creating role:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create role',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // 8. Get All Roles
  static async getRoles(req: AuthenticatedRequest, res: Response) {
    try {
      const { data: roles, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      return res.json({
        success: true,
        message: 'Roles fetched successfully',
        data: roles || []
      });
    } catch (error) {
      console.error('Error fetching roles:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch roles',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // 9. Update Role
  static async updateRole(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData: RoleUpdateRequest = req.body;
      const currentUser = req.user;

      // Check if role exists and is not system role
      const { data: existingRole } = await supabase
        .from('roles')
        .select('*')
        .eq('id', id)
        .single();

      if (!existingRole) {
        return res.status(404).json({
          success: false,
          message: 'Role not found'
        });
      }

      if (existingRole.is_system) {
        return res.status(400).json({
          success: false,
          message: 'Cannot modify system roles'
        });
      }

      // Update role
      const { data: updatedRole, error } = await supabase
        .from('roles')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Log the action
      await TeamController.logAuditAction(
        currentUser?.id || '',
        currentUser?.name || 'System',
        'Updated role',
        'role',
        id,
        updateData
      );

      return res.json({
        success: true,
        message: 'Role updated successfully',
        data: updatedRole
      });
    } catch (error) {
      console.error('Error updating role:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update role',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // 10. Delete Role
  static async deleteRole(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      // Check if role exists and is not system role
      const { data: existingRole } = await supabase
        .from('roles')
        .select('*')
        .eq('id', id)
        .single();

      if (!existingRole) {
        return res.status(404).json({
          success: false,
          message: 'Role not found'
        });
      }

      if (existingRole.is_system) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete system roles'
        });
      }

      // Check if any team members are using this role
      const { data: membersUsingRole } = await supabase
        .from('team_members')
        .select('id')
        .eq('role', existingRole.name)
        .limit(1);

      if (membersUsingRole && membersUsingRole.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete role that is currently assigned to team members'
        });
      }

      // Delete role
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Log the action
      await TeamController.logAuditAction(
        currentUser?.id || '',
        currentUser?.name || 'System',
        'Deleted role',
        'role',
        id,
        { name: existingRole.name }
      );

      return res.json({
        success: true,
        message: 'Role deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting role:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete role',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // 11. Get Available Permissions
  static async getPermissions(req: AuthenticatedRequest, res: Response) {
    try {
      return res.json({
        success: true,
        message: 'Permissions fetched successfully',
        data: AVAILABLE_PERMISSIONS
      });
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch permissions',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // 12. Get Audit Logs
  static async getAuditLogs(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        from,
        to,
        userId,
        action,
        resource,
        page = 1,
        limit = 50
      }: AuditLogQuery = req.query as any;

      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      // Apply filters
      if (from) {
        query = query.gte('timestamp', from);
      }
      if (to) {
        query = query.lte('timestamp', to);
      }
      if (userId) {
        query = query.eq('user_id', userId);
      }
      if (action) {
        query = query.ilike('action', `%${action}%`);
      }
      if (resource) {
        query = query.eq('resource', resource);
      }

      // Apply pagination
      const fromIndex = (page - 1) * limit;
      const toIndex = fromIndex + limit - 1;
      query = query.range(fromIndex, toIndex);

      const { data: logs, error, count } = await query;

      if (error) {
        throw error;
      }

      return res.json({
        success: true,
        message: 'Audit logs fetched successfully',
        data: {
          data: logs || [],
          meta: {
            page: Number(page),
            limit: Number(limit),
            total: count || 0,
            totalPages: Math.ceil((count || 0) / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch audit logs',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // 13. Get Single Role
  static async getRole(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const { data: role, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return res.status(404).json({
          success: false,
          message: 'Role not found'
        });
      }

      return res.json({
        success: true,
        message: 'Role fetched successfully',
        data: role
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch role',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // 14. Export Team Data
  static async exportTeamData(req: AuthenticatedRequest, res: Response) {
    try {
      const { format = 'csv' } = req.query;

      const { data: members, error } = await supabase
        .from('team_members')
        .select('*')
        .order('joined_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (format === 'csv') {
        // Generate CSV
        const csvHeader = 'ID,Name,Email,Role,Status,Joined At,Last Login\n';
        const csvData = members?.map(member => 
          `${member.id},${member.name},${member.email},${member.role},${member.status},${member.joined_at},${member.last_login || 'Never'}`
        ).join('\n') || '';

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=team-members.csv');
        return res.send(csvHeader + csvData);
      } else {
        // Return JSON
        return res.json({
          success: true,
          message: 'Team data exported successfully',
          data: members || []
        });
      }
    } catch (error) {
      console.error('Error exporting team data:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to export team data',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Helper method to log audit actions
  private static async logAuditAction(
    userId: string,
    userName: string,
    action: string,
    resource: string,
    resourceId?: string,
    details?: Record<string, any>
  ) {
    try {
      await supabase
        .from('audit_logs')
        .insert({
          user_id: userId,
          user_name: userName,
          action,
          resource,
          resource_id: resourceId,
          details,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error logging audit action:', error);
      // Don't throw error for audit logging failures
    }
  }

  // 15. Export Team Members (alias for exportTeamData)
  static async exportTeamMembers(req: AuthenticatedRequest, res: Response) {
    return TeamController.exportTeamData(req, res);
  }

  // 16. Get Team Statistics
  static async getTeamStats(req: AuthenticatedRequest, res: Response) {
    try {
      // Get total members
      const { count: totalMembers } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true });

      // Get active members
      const { count: activeMembers } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get inactive members
      const { count: inactiveMembers } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'inactive');

      // Get suspended members
      const { count: suspendedMembers } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'suspended');

      // Get roles count
      const { count: rolesCount } = await supabase
        .from('roles')
        .select('*', { count: 'exact', head: true });

      // Get recent activity
      const { data: recentLogs } = await supabase
        .from('audit_logs')
        .select('timestamp')
        .order('timestamp', { ascending: false })
        .limit(1);

      // Get role distribution
      const { data: roleDistribution } = await supabase
        .from('team_members')
        .select('role')
        .eq('status', 'active');

      const roleStats = roleDistribution?.reduce((acc: any, member: any) => {
        acc[member.role] = (acc[member.role] || 0) + 1;
        return acc;
      }, {}) || {};

      const roleDistributionArray = Object.entries(roleStats).map(([role, count]) => ({
        role,
        count
      }));

      return res.json({
        success: true,
        message: 'Team statistics fetched successfully',
        data: {
          totalMembers: totalMembers || 0,
          activeMembers: activeMembers || 0,
          inactiveMembers: inactiveMembers || 0,
          suspendedMembers: suspendedMembers || 0,
          rolesCount: rolesCount || 0,
          recentActivity: {
            lastLogin: recentLogs?.[0]?.timestamp || null,
            recentJoins: 0, // This would need additional logic
            recentActions: 0 // This would need additional logic
          },
          roleDistribution: roleDistributionArray
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch team statistics',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // 17. Initialize Default Roles
  static async initializeDefaultRoles(req: AuthenticatedRequest, res: Response) {
    try {
      const currentUser = req.user;

      // Check if roles already exist
      const { data: existingRoles } = await supabase
        .from('roles')
        .select('name');

      const existingRoleNames = existingRoles?.map(r => r.name) || [];

      const rolesToCreate = Object.entries(DEFAULT_ROLES)
        .filter(([key, role]) => !existingRoleNames.includes(role.name))
        .map(([key, role]) => ({
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          is_system: true
        }));

      if (rolesToCreate.length === 0) {
        return res.json({
          success: true,
          message: 'Default roles already exist',
          data: {
            rolesCreated: 0,
            roles: existingRoleNames
          }
        });
      }

      const { data: newRoles, error } = await supabase
        .from('roles')
        .insert(rolesToCreate)
        .select();

      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Failed to create default roles',
          error: error.message
        });
      }

      // Log the action
      await supabase
        .from('audit_logs')
        .insert({
          user_id: currentUser?.id,
          user_name: currentUser?.email || 'System',
          action: 'Initialized default roles',
          resource: 'roles',
          details: { roles_created: newRoles?.length || 0 }
        });

      return res.json({
        success: true,
        message: 'Default roles initialized successfully',
        data: {
          rolesCreated: newRoles?.length || 0,
          roles: newRoles?.map(r => r.name) || []
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to initialize default roles',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}

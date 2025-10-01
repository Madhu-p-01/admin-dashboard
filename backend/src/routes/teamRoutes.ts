import express from 'express';
import { body, param, query } from 'express-validator';
import { supabaseAdminAuth } from '../middleware/supabaseAuthMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { TeamController } from '../controllers/TeamController';

const router = express.Router();

// 1. Invite/Add Team Member
router.post(
  '/members',
  supabaseAdminAuth,
  [
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role').isString().trim().notEmpty().withMessage('Role is required'),
    body('permissions').isArray().withMessage('Permissions must be an array'),
    body('permissions.*').isString().withMessage('Each permission must be a string'),
  ],
  validateRequest,
  TeamController.createTeamMember
);

// 2. Get All Team Members
router.get(
  '/members',
  supabaseAdminAuth,
  [
    query('status').optional().isIn(['active', 'inactive', 'suspended']),
    query('role').optional().isString().trim(),
    query('search').optional().isString().trim(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sort').optional().isIn(['name', 'email', 'joinedAt', 'lastLogin']),
    query('order').optional().isIn(['asc', 'desc']),
  ],
  validateRequest,
  TeamController.getTeamMembers
);

// 3. Get Single Team Member
router.get(
  '/members/:id',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid team member ID is required'),
  ],
  validateRequest,
  TeamController.getTeamMember
);

// 4. Update Team Member Info
router.put(
  '/members/:id',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid team member ID is required'),
    body('name').optional().isString().trim().notEmpty(),
    body('role').optional().isString().trim().notEmpty(),
    body('permissions').optional().isArray(),
    body('permissions.*').optional().isString(),
  ],
  validateRequest,
  TeamController.updateTeamMember
);

// 5. Suspend/Deactivate Member
router.put(
  '/members/:id/status',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid team member ID is required'),
    body('status').isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status'),
  ],
  validateRequest,
  TeamController.updateMemberStatus
);

// 6. Delete Member (Remove Access)
router.delete(
  '/members/:id',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid team member ID is required'),
  ],
  validateRequest,
  TeamController.deleteTeamMember
);

// 7. Roles Management

// Create Role
router.post(
  '/roles',
  supabaseAdminAuth,
  [
    body('name').isString().trim().notEmpty().withMessage('Role name is required'),
    body('description').optional().isString().trim(),
    body('permissions').isArray().withMessage('Permissions must be an array'),
    body('permissions.*').isString().withMessage('Each permission must be a string'),
  ],
  validateRequest,
  TeamController.createRole
);

// Get All Roles
router.get(
  '/roles',
  supabaseAdminAuth,
  TeamController.getRoles
);

// Get Single Role
router.get(
  '/roles/:id',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid role ID is required'),
  ],
  validateRequest,
  TeamController.getRole
);

// Update Role
router.put(
  '/roles/:id',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid role ID is required'),
    body('name').optional().isString().trim().notEmpty(),
    body('description').optional().isString().trim(),
    body('permissions').optional().isArray(),
    body('permissions.*').optional().isString(),
  ],
  validateRequest,
  TeamController.updateRole
);

// Delete Role
router.delete(
  '/roles/:id',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid role ID is required'),
  ],
  validateRequest,
  TeamController.deleteRole
);

// 8. Permissions Reference (For UI Control)
router.get(
  '/permissions',
  supabaseAdminAuth,
  TeamController.getPermissions
);

// 9. Audit Logs (Track Admin Actions)
router.get(
  '/audit-logs',
  supabaseAdminAuth,
  [
    query('from').optional().isISO8601().withMessage('Invalid from date format'),
    query('to').optional().isISO8601().withMessage('Invalid to date format'),
    query('userId').optional().isUUID().withMessage('Invalid user ID'),
    query('action').optional().isString().trim(),
    query('resource').optional().isString().trim(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validateRequest,
  TeamController.getAuditLogs
);

// 10. Export Team Data
router.get(
  '/members/export',
  supabaseAdminAuth,
  [
    query('format').isIn(['csv', 'excel']).withMessage('Format must be csv or excel'),
    query('status').optional().isIn(['active', 'inactive', 'suspended']),
    query('role').optional().isString().trim(),
  ],
  validateRequest,
  TeamController.exportTeamMembers
);

// 11. Get Team Statistics
router.get(
  '/stats',
  supabaseAdminAuth,
  TeamController.getTeamStats
);

// 12. Initialize Default Roles (One-time setup)
router.post(
  '/initialize-roles',
  supabaseAdminAuth,
  TeamController.initializeDefaultRoles
);

export default router;

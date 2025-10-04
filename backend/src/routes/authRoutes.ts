import express from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { verifyJWT } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { strictRateLimiter } from '../middleware/rateLimiting';

const router = express.Router();

// Apply strict rate limiting to auth routes
router.use(strictRateLimiter(5, 300000)); // 5 attempts per 5 minutes

/**
 * POST /login - Admin login
 */
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
  ],
  validateRequest,
  AuthController.login
);

/**
 * GET /profile - Get current user profile
 */
router.get(
  '/profile',
  verifyJWT,
  AuthController.getProfile
);

/**
 * POST /refresh - Refresh JWT token
 */
router.post(
  '/refresh',
  verifyJWT,
  AuthController.refreshToken
);

/**
 * POST /logout - Logout (client-side token removal)
 */
router.post(
  '/logout',
  verifyJWT,
  AuthController.logout
);

/**
 * PUT /change-password - Change password
 */
router.put(
  '/change-password',
  verifyJWT,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
  ],
  validateRequest,
  AuthController.changePassword
);

export default router;





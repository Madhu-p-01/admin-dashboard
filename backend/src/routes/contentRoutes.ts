import express from 'express';
import { body, param, query } from 'express-validator';
import { supabaseAdminAuth } from '../middleware/supabaseAuthMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { BannerController } from '../controllers/BannerController';
import { CMSPageController } from '../controllers/CMSPageController';
import { BlogController } from '../controllers/BlogController';
import { FAQController } from '../controllers/FAQController';
import { PolicyController } from '../controllers/PolicyController';
import { AnnouncementController } from '../controllers/AnnouncementController';
import { MediaController } from '../controllers/MediaController';

const router = express.Router();

// Create Banner
router.post(
  '/banners',
  supabaseAdminAuth,
  [
    body('title').isString().trim().notEmpty().withMessage('Title is required'),
    body('imageUrl').isString().trim().notEmpty().withMessage('Image URL is required'),
    body('link').optional().isString().trim(),
    body('position').isIn(['homepage_top', 'homepage_middle', 'homepage_bottom', 'category_top', 'category_sidebar', 'product_detail']),
    body('status').optional().isIn(['active', 'inactive', 'draft']),
    body('startDate').optional().isISO8601(),
    body('endDate').optional().isISO8601(),
    body('displayOrder').optional().isInt({ min: 0 }),
  ],
  validateRequest,
  BannerController.createBanner
);

// Get All Banners
router.get(
  '/banners',
  supabaseAdminAuth,
  [
    query('status').optional().isIn(['active', 'inactive', 'draft']),
    query('position').optional().isIn(['homepage_top', 'homepage_middle', 'homepage_bottom', 'category_top', 'category_sidebar', 'product_detail']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validateRequest,
  BannerController.getBanners
);

// Get Active Banners (for frontend)
router.get(
  '/banners/active',
  [
    query('position').optional().isString(),
  ],
  validateRequest,
  BannerController.getActiveBanners
);

// Get Single Banner
router.get(
  '/banners/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid banner ID is required')],
  validateRequest,
  BannerController.getBanner
);

// Update Banner
router.put(
  '/banners/:id',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid banner ID is required'),
    body('title').isString().trim().notEmpty(),
    body('imageUrl').optional().isString().trim().notEmpty(),
    body('link').optional().isString().trim(),
    body('position').optional().isIn(['homepage_top', 'homepage_middle', 'homepage_bottom', 'category_top', 'category_sidebar', 'product_detail']),
    body('status').optional().isIn(['active', 'inactive', 'draft']),
    body('startDate').optional().isISO8601(),
    body('endDate').optional().isISO8601(),
    body('displayOrder').optional().isInt({ min: 0 }),
  ],
  validateRequest,
  BannerController.updateBanner
);

// Delete Banner
router.delete(
  '/banners/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid banner ID is required')],
  validateRequest,
  BannerController.deleteBanner
);

// Create Page
router.post(
  '/pages',
  supabaseAdminAuth,
  [
    body('title').isString().trim().notEmpty().withMessage('Title is required'),
    body('slug').isString().trim(),
    body('content').isString().trim().notEmpty().withMessage('Content is required'),
    body('metaTitle').optional().isString().trim(),
    body('metaDescription').optional().isString().trim(),
    body('status').optional().isIn(['published', 'draft', 'archived']),
  ],
  validateRequest,
  CMSPageController.createPage
);

// Get All Pages
router.get(
  '/pages',
  supabaseAdminAuth,
  [
    query('status').optional().isIn(['published', 'draft', 'archived']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString().trim(),
  ],
  validateRequest,
  CMSPageController.getPages
);

// Get Published Pages (for frontend)
router.get(
  '/pages/published',
  CMSPageController.getPublishedPages
);

// Get Page by Slug (for frontend)
router.get(
  '/pages/slug/:slug',
  [param('slug').isString().trim().notEmpty()],
  validateRequest,
  CMSPageController.getPageBySlug
);

// Get Single Page
router.get(
  '/pages/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid page ID is required')],
  validateRequest,
  CMSPageController.getPage
);

// Update Page
router.put(
  '/pages/:id',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid page ID is required'),
    body('title').isString().trim().notEmpty(),
    body('slug').optional().isString().trim(),
    body('content').optional().isString().trim().notEmpty(),
    body('metaTitle').optional().isString().trim(),
    body('metaDescription').optional().isString().trim(),
    body('status').optional().isIn(['published', 'draft', 'archived']),
  ],
  validateRequest,
  CMSPageController.updatePage
);

// Delete Page
router.delete(
  '/pages/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid page ID is required')],
  validateRequest,
  CMSPageController.deletePage
);

// Create Blog Post
router.post(
  '/blogs',
  supabaseAdminAuth,
  [
    body('title').isString().trim().notEmpty().withMessage('Title is required'),
    body('slug').optional().isString().trim(),
    body('content').isString().trim().notEmpty().withMessage('Content is required'),
    body('excerpt').optional().isString().trim(),
    body('featuredImage').optional().isString().trim(),
    body('author').optional().isString().trim(),
    body('tags').optional().isArray(),
    body('metaTitle').optional().isString().trim(),
    body('metaDescription').optional().isString().trim(),
    body('status').optional().isIn(['published', 'draft', 'archived']),
    body('isFeatured').optional().isBoolean(),
    body('publishedAt').optional().isISO8601(),
  ],
  validateRequest,
  BlogController.createBlogPost
);

// Get All Blog Posts
router.get(
  '/blogs',
  supabaseAdminAuth,
  [
    query('status').optional().isIn(['published', 'draft', 'archived']),
    query('featured').optional().isBoolean(),
    query('author').optional().isString().trim(),
    query('tags').optional().isString().trim(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString().trim(),
    query('sort').optional().isIn(['latest', 'oldest', 'featured']),
  ],
  validateRequest,
  BlogController.getBlogPosts
);

// Get Published Blog Posts (for frontend)
router.get(
  '/blogs/published',
  [
    query('featured').optional().isBoolean(),
    query('tags').optional().isString().trim(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validateRequest,
  BlogController.getPublishedBlogPosts
);

// Get Blog Tags
router.get(
  '/blogs/tags',
  BlogController.getBlogTags
);

// Get Blog Post by Slug (for frontend)
router.get(
  '/blogs/slug/:slug',
  [param('slug').isString().trim().notEmpty()],
  validateRequest,
  BlogController.getBlogPostBySlug
);

// Get Single Blog Post
router.get(
  '/blogs/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid blog post ID is required')],
  validateRequest,
  BlogController.getBlogPost
);

// Update Blog Post
router.put(
  '/blogs/:id',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid blog post ID is required'),
    body('title').isString().trim().notEmpty(),
    body('slug').optional().isString().trim(),
    body('content').optional().isString().trim().notEmpty(),
    body('excerpt').optional().isString().trim(),
    body('featuredImage').optional().isString().trim(),
    body('author').optional().isString().trim(),
    body('tags').optional().isArray(),
    body('metaTitle').optional().isString().trim(),
    body('metaDescription').optional().isString().trim(),
    body('status').optional().isIn(['published', 'draft', 'archived']),
    body('isFeatured').optional().isBoolean(),
    body('publishedAt').optional().isISO8601(),
  ],
  validateRequest,
  BlogController.updateBlogPost
);

// Delete Blog Post
router.delete(
  '/blogs/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid blog post ID is required')],
  validateRequest,
  BlogController.deleteBlogPost
);

// Create FAQ
router.post(
  '/faqs',
  supabaseAdminAuth,
  [
    body('question').isString().trim().notEmpty().withMessage('Question is required'),
    body('answer').isString().trim().notEmpty().withMessage('Answer is required'),
    body('category').optional().isString().trim(),
    body('status').optional().isIn(['active', 'inactive']),
    body('displayOrder').optional().isInt({ min: 0 }),
  ],
  validateRequest,
  FAQController.createFAQ
);

// Get All FAQs
router.get(
  '/faqs',
  supabaseAdminAuth,
  [
    query('status').optional().isIn(['active', 'inactive']),
    query('category').optional().isString().trim(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString().trim(),
  ],
  validateRequest,
  FAQController.getFAQs
);

// Get Active FAQs (for frontend)
router.get(
  '/faqs/active',
  [
    query('category').optional().isString().trim(),
  ],
  validateRequest,
  FAQController.getActiveFAQs
);

// Get FAQ Categories
router.get(
  '/faqs/categories',
  FAQController.getFAQCategories
);

// Update Display Order
router.post(
  '/faqs/display-order',
  supabaseAdminAuth,
  [
    body('updates').isArray({ min: 1 }).withMessage('Updates array is required'),
    body('updates.*.faqId').isUUID().withMessage('Valid FAQ ID is required'),
    body('updates.*.displayOrder').isInt({ min: 0 }).withMessage('Display order must be non-negative'),
  ],
  validateRequest,
  FAQController.updateDisplayOrder
);

// Get Single FAQ
router.get(
  '/faqs/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid FAQ ID is required')],
  validateRequest,
  FAQController.getFAQ
);

// Update FAQ
router.put(
  '/faqs/:id',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid FAQ ID is required'),
    body('question').isString().trim().notEmpty(),
    body('answer').isString().trim().notEmpty(),
    body('category').optional().isString().trim(),
    body('status').optional().isIn(['active', 'inactive']),
    body('displayOrder').optional().isInt({ min: 0 }),
  ],
  validateRequest,
  FAQController.updateFAQ
);

// Delete FAQ
router.delete(
  '/faqs/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid FAQ ID is required')],
  validateRequest,
  FAQController.deleteFAQ
);


// Create Policy
router.post(
  '/policies',
  supabaseAdminAuth,
  [
    body('title').isString().trim().notEmpty().withMessage('Title is required'),
    body('content').isString().trim().notEmpty().withMessage('Content is required'),
    body('policyType').optional().isIn(['return', 'privacy', 'shipping', 'terms', 'refund', 'other']),
    body('status').optional().isIn(['published', 'draft', 'archived']),
    body('version').optional().isString().trim(),
    body('effectiveDate').optional().isISO8601(),
  ],
  validateRequest,
  PolicyController.createPolicy
);

// Get All Policies
router.get(
  '/policies',
  supabaseAdminAuth,
  [
    query('policyType').optional().isIn(['return', 'privacy', 'shipping', 'terms', 'refund', 'other']),
    query('status').optional().isIn(['published', 'draft', 'archived']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString().trim(),
  ],
  validateRequest,
  PolicyController.getPolicies
);

// Get Published Policies (for frontend)
router.get(
  '/policies/published',
  PolicyController.getPublishedPolicies
);

// Get Policy by Type (for frontend)
router.get(
  '/policies/type/:type',
  [param('type').isIn(['return', 'privacy', 'shipping', 'terms', 'refund', 'other'])],
  validateRequest,
  PolicyController.getPolicyByType
);

// Get Single Policy
router.get(
  '/policies/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid policy ID is required')],
  validateRequest,
  PolicyController.getPolicy
);

// Update Policy
router.put(
  '/policies/:id',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid policy ID is required'),
    body('title').isString().trim().notEmpty(),
    body('content').optional().isString().trim().notEmpty(),
    body('policyType').optional().isIn(['return', 'privacy', 'shipping', 'terms', 'refund', 'other']),
    body('status').optional().isIn(['published', 'draft', 'archived']),
    body('version').optional().isString().trim(),
    body('effectiveDate').optional().isISO8601(),
  ],
  validateRequest,
  PolicyController.updatePolicy
);

// Create Policy Version
router.post(
  '/policies/:id/version',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid policy ID is required'),
    body('title').optional().isString().trim(),
    body('content').optional().isString().trim(),
    body('version').optional().isString().trim(),
    body('effectiveDate').optional().isISO8601(),
  ],
  validateRequest,
  PolicyController.createPolicyVersion
);

// Delete Policy
router.delete(
  '/policies/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid policy ID is required')],
  validateRequest,
  PolicyController.deletePolicy
);


// Create Announcement
router.post(
  '/announcements',
  supabaseAdminAuth,
  [
    body('message').isString().trim().notEmpty().withMessage('Message is required'),
    body('type').optional().isIn(['info', 'warning', 'success', 'error', 'promo']),
    body('status').optional().isIn(['active', 'inactive', 'scheduled']),
    body('startDate').optional().isISO8601(),
    body('endDate').optional().isISO8601(),
    body('displayOn').optional().isArray(),
    body('priority').optional().isInt({ min: 1, max: 10 }),
  ],
  validateRequest,
  AnnouncementController.createAnnouncement
);

// Get All Announcements
router.get(
  '/announcements',
  supabaseAdminAuth,
  [
    query('type').optional().isIn(['info', 'warning', 'success', 'error', 'promo']),
    query('status').optional().isIn(['active', 'inactive', 'scheduled']),
    query('displayOn').optional().isString(),
    query('active').optional().isBoolean(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString().trim(),
  ],
  validateRequest,
  AnnouncementController.getAnnouncements
);

// Get Active Announcements (for frontend)
router.get(
  '/announcements/active',
  [
    query('displayOn').optional().isString(),
  ],
  validateRequest,
  AnnouncementController.getActiveAnnouncements
);

// Get Scheduled Announcements
router.get(
  '/announcements/scheduled',
  supabaseAdminAuth,
  AnnouncementController.getScheduledAnnouncements
);

// Update Announcement Priorities
router.post(
  '/announcements/priorities',
  supabaseAdminAuth,
  [
    body('updates').isArray({ min: 1 }).withMessage('Updates array is required'),
    body('updates.*.announcementId').isUUID().withMessage('Valid announcement ID is required'),
    body('updates.*.priority').isInt({ min: 1, max: 10 }).withMessage('Priority must be between 1-10'),
  ],
  validateRequest,
  AnnouncementController.updateAnnouncementPriorities
);

// Get Single Announcement
router.get(
  '/announcements/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid announcement ID is required')],
  validateRequest,
  AnnouncementController.getAnnouncement
);

// Update Announcement
router.put(
  '/announcements/:id',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid announcement ID is required'),
    body('message').isString().trim().notEmpty(),
    body('type').optional().isIn(['info', 'warning', 'success', 'error', 'promo']),
    body('status').optional().isIn(['active', 'inactive', 'scheduled']),
    body('startDate').optional().isISO8601(),
    body('endDate').optional().isISO8601(),
    body('displayOn').optional().isArray(),
    body('priority').optional().isInt({ min: 1, max: 10 }),
  ],
  validateRequest,
  AnnouncementController.updateAnnouncement
);

// Update Announcement Status
router.put(
  '/announcements/:id/status',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid announcement ID is required'),
    body('status').isIn(['active', 'inactive', 'scheduled']).withMessage('Invalid status value'),
  ],
  validateRequest,
  AnnouncementController.updateAnnouncementStatus
);

// Delete Announcement
router.delete(
  '/announcements/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid announcement ID is required')],
  validateRequest,
  AnnouncementController.deleteAnnouncement
);


// Upload Media
router.post(
  '/media',
  supabaseAdminAuth,
  [
    body('fileName').isString().trim().notEmpty().withMessage('File name is required'),
    body('originalFilename').optional().isString().trim(),
    body('url').isURL().withMessage('Valid URL is required'),
    body('fileType').isString().trim().notEmpty().withMessage('File type is required')
      .isIn(['image', 'video', 'audio', 'document', 'archive', 'other'])
      .withMessage('File type must be one of: image, video, audio, document, archive, other'),
    body('fileSize').optional().isInt({ min: 0 }),
    body('mimeType').optional().isString().trim(),
    body('altText').optional().isString().trim(),
    body('description').optional().isString().trim(),
    body('uploadedBy').optional().isUUID(),
  ],
  validateRequest,
  MediaController.uploadMedia
);

// Get All Media
router.get(
  '/media',
  supabaseAdminAuth,
  [
    query('fileType').optional().isString().trim(),
    query('uploadedBy').optional().isUUID(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString().trim(),
    query('sort').optional().isIn(['latest', 'oldest', 'name', 'size']),
  ],
  validateRequest,
  MediaController.getMediaFiles
);

// Get Media by Type
router.get(
  '/media/type/:type',
  supabaseAdminAuth,
  [
    param('type').isString().trim().notEmpty(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validateRequest,
  MediaController.getMediaByType
);

// Get Media Statistics
router.get(
  '/media/stats',
  supabaseAdminAuth,
  MediaController.getMediaStats
);

// Search Media
router.get(
  '/media/search',
  supabaseAdminAuth,
  [
    query('query').isString().trim().notEmpty().withMessage('Search query is required'),
    query('fileType').optional().isString().trim(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validateRequest,
  MediaController.searchMedia
);

// Bulk Delete Media
router.delete(
  '/media/bulk',
  supabaseAdminAuth,
  [
    body('mediaIds').isArray({ min: 1 }).withMessage('Media IDs array is required'),
    body('mediaIds.*').isUUID().withMessage('Valid media ID is required'),
  ],
  validateRequest,
  MediaController.bulkDeleteMedia
);

// Get Single Media
router.get(
  '/media/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid media ID is required')],
  validateRequest,
  MediaController.getMediaFile
);

// Update Media
router.put(
  '/media/:id',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid media ID is required'),
    body('fileName').optional().isString().trim(),
    body('altText').optional().isString().trim(),
    body('description').optional().isString().trim(),
  ],
  validateRequest,
  MediaController.updateMediaFile
);

// Delete Media
router.delete(
  '/media/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid media ID is required')],
  validateRequest,
  MediaController.deleteMediaFile
);

export default router;




// Content Management Routes Summary

/*

BANNER ROUTES:
POST   http://localhost:4000/api/v1/admin/content/banners
GET    http://localhost:4000/api/v1/admin/content/banners
GET    http://localhost:4000/api/v1/admin/content/banners/active
GET    http://localhost:4000/api/v1/admin/content/banners/:id
PUT    http://localhost:4000/api/v1/admin/content/banners/:id
DELETE http://localhost:4000/api/v1/admin/content/banners/:id

CMS PAGE ROUTES:
POST   http://localhost:4000/api/v1/admin/content/pages
GET    http://localhost:4000/api/v1/admin/content/pages
GET    http://localhost:4000/api/v1/admin/content/pages/published
GET    http://localhost:4000/api/v1/admin/content/pages/slug/:slug
GET    http://localhost:4000/api/v1/admin/content/pages/:id
PUT    http://localhost:4000/api/v1/admin/content/pages/:id
DELETE http://localhost:4000/api/v1/admin/content/pages/:id

BLOG ROUTES:
POST   http://localhost:4000/api/v1/admin/content/blogs
GET    http://localhost:4000/api/v1/admin/content/blogs
GET    http://localhost:4000/api/v1/admin/content/blogs/published
GET    http://localhost:4000/api/v1/admin/content/blogs/tags
GET    http://localhost:4000/api/v1/admin/content/blogs/slug/:slug
GET    http://localhost:4000/api/v1/admin/content/blogs/:id
PUT    http://localhost:4000/api/v1/admin/content/blogs/:id
DELETE http://localhost:4000/api/v1/admin/content/blogs/:id

FAQ ROUTES:
POST   http://localhost:4000/api/v1/admin/content/faqs
GET    http://localhost:4000/api/v1/admin/content/faqs
GET    http://localhost:4000/api/v1/admin/content/faqs/active
GET    http://localhost:4000/api/v1/admin/content/faqs/categories
POST   http://localhost:4000/api/v1/admin/content/faqs/display-order
GET    http://localhost:4000/api/v1/admin/content/faqs/:id
PUT    http://localhost:4000/api/v1/admin/content/faqs/:id
DELETE http://localhost:4000/api/v1/admin/content/faqs/:id

POLICY ROUTES:
POST   http://localhost:4000/api/v1/admin/content/policies
GET    http://localhost:4000/api/v1/admin/content/policies
GET    http://localhost:4000/api/v1/admin/content/policies/published
GET    http://localhost:4000/api/v1/admin/content/policies/type/:type
POST   http://localhost:4000/api/v1/admin/content/policies/:id/version
GET    http://localhost:4000/api/v1/admin/content/policies/:id
PUT    http://localhost:4000/api/v1/admin/content/policies/:id
DELETE http://localhost:4000/api/v1/admin/content/policies/:id

ANNOUNCEMENT ROUTES:
POST   http://localhost:4000/api/v1/admin/content/announcements
GET    http://localhost:4000/api/v1/admin/content/announcements
GET    http://localhost:4000/api/v1/admin/content/announcements/active
GET    http://localhost:4000/api/v1/admin/content/announcements/scheduled
POST   http://localhost:4000/api/v1/admin/content/announcements/priorities
GET    http://localhost:4000/api/v1/admin/content/announcements/:id
PUT    http://localhost:4000/api/v1/admin/content/announcements/:id
PUT    http://localhost:4000/api/v1/admin/content/announcements/:id/status
DELETE http://localhost:4000/api/v1/admin/content/announcements/:id

MEDIA ROUTES:
POST   http://localhost:4000/api/v1/admin/content/media
GET    http://localhost:4000/api/v1/admin/content/media
GET    http://localhost:4000/api/v1/admin/content/media/type/:type
GET    http://localhost:4000/api/v1/admin/content/media/stats
GET    http://localhost:4000/api/v1/admin/content/media/search
DELETE http://localhost:4000/api/v1/admin/content/media/bulk
GET    http://localhost:4000/api/v1/admin/content/media/:id
PUT    http://localhost:4000/api/v1/admin/content/media/:id
DELETE http://localhost:4000/api/v1/admin/content/media/:id

Example URLs:
http://localhost:4000/api/v1/admin/content/banners?status=active&position=homepage_top
http://localhost:4000/api/v1/admin/content/pages?status=published&page=1&limit=20
http://localhost:4000/api/v1/admin/content/blogs?status=published&featured=true&sort=latest
*/
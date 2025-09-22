import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateBlogPostRequest,
  UpdateBlogPostRequest,
  BlogQueryParams
} from '../models/BlogPost';

export class BlogController {
  
  // Create a new blog post
  static async createBlogPost(req: Request, res: Response): Promise<void> {
    try {
      const {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        author = 'Admin',
        tags = [],
        metaTitle,
        metaDescription,
        status = 'published',
        isFeatured = false,
        publishedAt
      }: CreateBlogPostRequest = req.body;

      const postSlug = slug || title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const post_id = uuidv4();
      const now = new Date().toISOString();

      const blogData = {
        post_id,
        title,
        slug: postSlug,
        content,
        excerpt: excerpt || null,
        featured_image: featuredImage || null,
        author,
        tags,
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt || null,
        status,
        is_featured: isFeatured,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : (status === 'published' ? now : null),
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([blogData])
        .select('*')
        .single();

      if (error) {
        if (error.code === '23505') { 
          res.status(400).json({
            success: false,
            message: 'A blog post with this slug already exists',
            error: error.message
          });
          return;
        }
        
        res.status(500).json({
          success: false,
          message: 'Failed to create blog post',
          error: error.message
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Blog post created successfully',
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

  // Get all blog posts
  static async getBlogPosts(req: Request, res: Response): Promise<void> {
    try {
      const {
        status,
        featured,
        author,
        tags,
        page = 1,
        limit = 20,
        search,
        sort = 'latest'
      }: BlogQueryParams = req.query as any;

      let query = supabase.from('blog_posts').select('*', { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }

      if (featured !== undefined) {
        query = query.eq('is_featured', featured);
      }

      if (author) {
        query = query.eq('author', author);
      }

      if (tags) {
        const tagArray = tags.split(',').map(tag => tag.trim());
        query = query.overlaps('tags', tagArray);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
      }

      switch (sort) {
        case 'latest':
          query = query.order('published_at', { ascending: false, nullsFirst: false })
                       .order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('published_at', { ascending: true, nullsFirst: true })
                       .order('created_at', { ascending: true });
          break;
        case 'featured':
          query = query.order('is_featured', { ascending: false })
                       .order('published_at', { ascending: false, nullsFirst: false });
          break;
        default:
          query = query.order('published_at', { ascending: false, nullsFirst: false });
      }

      const pageNum = parseInt(String(page), 10);
      const limitNum = parseInt(String(limit), 10);
      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch blog posts',
          error: error.message
        });
        return;
      }

      const totalPages = Math.ceil((count || 0) / limitNum);

      res.json({
        success: true,
        message: 'Blog posts fetched successfully',
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

  // Get a single blog post by ID
  static async getBlogPost(req: Request, res: Response): Promise<void> {
    try {
      const post_id = req.params.id;

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('post_id', post_id)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch blog post',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Blog post fetched successfully',
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

  // Get a blog post by slug (for frontend use)
  static async getBlogPostBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch blog post',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Blog post fetched successfully',
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

  // Update a blog post
  static async updateBlogPost(req: Request, res: Response): Promise<void> {
    try {
      const post_id = req.params.id;
      const updates: UpdateBlogPostRequest = req.body;

      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (updates.featuredImage !== undefined) {
        updateData.featured_image = updates.featuredImage;
        delete updateData.featuredImage;
      }

      if (updates.metaTitle !== undefined) {
        updateData.meta_title = updates.metaTitle;
        delete updateData.metaTitle;
      }

      if (updates.metaDescription !== undefined) {
        updateData.meta_description = updates.metaDescription;
        delete updateData.metaDescription;
      }

      if (updates.isFeatured !== undefined) {
        updateData.is_featured = updates.isFeatured;
        delete updateData.isFeatured;
      }

      if (updates.publishedAt !== undefined) {
        updateData.published_at = updates.publishedAt ? new Date(updates.publishedAt).toISOString() : null;
        delete updateData.publishedAt;
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('post_id', post_id)
        .select('*')
        .single();

      if (error) {
        if (error.code === '23505') {
          res.status(400).json({
            success: false,
            message: 'A blog post with this slug already exists',
            error: error.message
          });
          return;
        }
        
        res.status(500).json({
          success: false,
          message: 'Failed to update blog post',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Blog post updated successfully',
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

  // Delete a blog post
  static async deleteBlogPost(req: Request, res: Response): Promise<void> {
    try {
      const post_id = req.params.id;

      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('post_id', post_id);

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to delete blog post',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Blog post deleted successfully'
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

  // Get published blog posts for frontend
  static async getPublishedBlogPosts(req: Request, res: Response): Promise<void> {
    try {
      const { featured, tags, limit = 10, page = 1 } = req.query;

      let query = supabase
        .from('blog_posts')
        .select('post_id, title, slug, excerpt, featured_image, author, tags, published_at, created_at')
        .eq('status', 'published')
        .not('published_at', 'is', null);

      if (featured !== undefined) {
        query = query.eq('is_featured', featured);
      }

      if (tags) {
        const tagArray = (tags as string).split(',').map(tag => tag.trim());
        query = query.overlaps('tags', tagArray);
      }

      query = query.order('published_at', { ascending: false });

      const pageNum = parseInt(String(page), 10);
      const limitNum = parseInt(String(limit), 10);
      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum - 1;

      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch published blog posts',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Published blog posts fetched successfully',
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

  // Get all unique tags
  static async getBlogTags(req: Request, res: Response): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('tags')
        .eq('status', 'published');

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch blog tags',
          error: error.message
        });
        return;
      }
      
      const allTags = (data || []).flatMap(post => post.tags || []);
      const uniqueTags = [...new Set(allTags)].sort();

      res.json({
        success: true,
        message: 'Blog tags fetched successfully',
        data: uniqueTags
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
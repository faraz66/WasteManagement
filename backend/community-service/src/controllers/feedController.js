const FeedAlgorithm = require('../services/feedAlgorithm');
const db = require('../config/database');
const { io } = require('../../server');

const feedAlgorithm = new FeedAlgorithm();

/**
 * Feed Controller - Handles all community feed operations
 */
class FeedController {
  
  /**
   * Get personalized feed for authenticated user
   */
  async getPersonalizedFeed(req, res) {
    try {
      const userId = req.user.id;
      const { 
        limit = 20, 
        offset = 0, 
        category, 
        location, 
        type = 'all' 
      } = req.query;

      let posts;

      switch (type) {
        case 'following':
          posts = await this.getFollowingFeedData(userId, limit, offset);
          break;
        case 'local':
          posts = await this.getLocalFeedData(userId, limit, offset);
          break;
        case 'trending':
          posts = await this.getTrendingFeedData(userId, limit, offset);
          break;
        default:
          posts = await feedAlgorithm.generatePersonalizedFeed(userId, limit, offset);
      }

      // Apply additional filters if specified
      if (category) {
        posts = posts.filter(post => post.category === category);
      }

      // Record feed view for analytics
      await this.recordFeedView(userId, posts.map(p => p.id));

      res.json({
        success: true,
        data: {
          posts,
          pagination: {
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: posts.length === parseInt(limit)
          },
          metadata: {
            feedType: type,
            generatedAt: new Date().toISOString(),
            totalPosts: posts.length
          }
        }
      });

    } catch (error) {
      console.error('Get personalized feed error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate personalized feed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get trending posts based on engagement metrics
   */
  async getTrendingPosts(req, res) {
    try {
      const userId = req.user.id;
      const { 
        timeframe = 'day', 
        category, 
        limit = 20 
      } = req.query;

      const timeframeHours = {
        hour: 1,
        day: 24,
        week: 168,
        month: 720
      };

      const hours = timeframeHours[timeframe] || 24;

      let query = `
        SELECT 
          cp.*,
          u.username as author_name,
          u.user_type as author_type,
          -- Calculate trending score
          (
            (cp.likes_count * 3) + 
            (cp.comments_count * 5) + 
            (cp.shares_count * 7) +
            (cp.views_count * 0.1)
          ) / EXTRACT(EPOCH FROM (NOW() - cp.created_at)) * 3600 as trending_score
        FROM community_posts cp
        JOIN users u ON cp.user_id = u.id
        WHERE 
          cp.status = 'published'
          AND cp.created_at > NOW() - INTERVAL '${hours} hours'
          AND cp.user_id != $1
      `;

      const params = [userId];

      if (category) {
        query += ` AND cp.category = $${params.length + 1}`;
        params.push(category);
      }

      query += `
        ORDER BY trending_score DESC, cp.created_at DESC
        LIMIT $${params.length + 1}
      `;
      params.push(limit);

      const result = await db.query(query, params);

      res.json({
        success: true,
        data: {
          posts: result.rows,
          metadata: {
            timeframe,
            category: category || 'all',
            generatedAt: new Date().toISOString()
          }
        }
      });

    } catch (error) {
      console.error('Get trending posts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get trending posts',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get local feed based on user's location
   */
  async getLocalFeed(req, res) {
    try {
      const userId = req.user.id;
      const { radius = 50, limit = 20, offset = 0 } = req.query;

      // Get user's location
      const userLocationQuery = `
        SELECT location_lat, location_lng, city, country 
        FROM user_preferences 
        WHERE user_id = $1
      `;
      const userLocation = await db.query(userLocationQuery, [userId]);

      if (!userLocation.rows[0]?.location_lat) {
        return res.status(400).json({
          success: false,
          message: 'User location not set. Please update your location preferences.'
        });
      }

      const { location_lat, location_lng, city, country } = userLocation.rows[0];

      // Get posts within radius
      const query = `
        SELECT 
          cp.*,
          u.username as author_name,
          u.user_type as author_type,
          -- Calculate distance
          (
            6371 * acos(
              cos(radians($2)) * cos(radians(cp.location_lat)) *
              cos(radians(cp.location_lng) - radians($3)) +
              sin(radians($2)) * sin(radians(cp.location_lat))
            )
          ) as distance_km
        FROM community_posts cp
        JOIN users u ON cp.user_id = u.id
        WHERE 
          cp.status = 'published'
          AND cp.user_id != $1
          AND (
            -- Posts with exact location within radius
            (
              cp.location_lat IS NOT NULL 
              AND cp.location_lng IS NOT NULL
              AND (
                6371 * acos(
                  cos(radians($2)) * cos(radians(cp.location_lat)) *
                  cos(radians(cp.location_lng) - radians($3)) +
                  sin(radians($2)) * sin(radians(cp.location_lat))
                )
              ) <= $4
            )
            -- Or posts from same city/country
            OR (
              cp.location_name ILIKE $5
              OR cp.location_name ILIKE $6
            )
          )
        ORDER BY 
          CASE WHEN cp.is_local_event THEN 0 ELSE 1 END,
          distance_km ASC,
          cp.created_at DESC
        LIMIT $7 OFFSET $8
      `;

      const result = await db.query(query, [
        userId, location_lat, location_lng, radius,
        `%${city}%`, `%${country}%`,
        limit, offset
      ]);

      res.json({
        success: true,
        data: {
          posts: result.rows,
          pagination: {
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: result.rows.length === parseInt(limit)
          },
          metadata: {
            userLocation: { city, country },
            radius: parseInt(radius),
            generatedAt: new Date().toISOString()
          }
        }
      });

    } catch (error) {
      console.error('Get local feed error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get local feed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get posts from users that the current user follows
   */
  async getFollowingFeed(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 20, offset = 0 } = req.query;

      const query = `
        SELECT 
          cp.*,
          u.username as author_name,
          u.user_type as author_type,
          true as from_following
        FROM community_posts cp
        JOIN users u ON cp.user_id = u.id
        JOIN user_follows uf ON cp.user_id = uf.following_id
        WHERE 
          cp.status = 'published'
          AND uf.follower_id = $1
        ORDER BY cp.created_at DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await db.query(query, [userId, limit, offset]);

      res.json({
        success: true,
        data: {
          posts: result.rows,
          pagination: {
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: result.rows.length === parseInt(limit)
          },
          metadata: {
            feedType: 'following',
            generatedAt: new Date().toISOString()
          }
        }
      });

    } catch (error) {
      console.error('Get following feed error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get following feed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Record feed interaction for algorithm learning
   */
  async recordFeedInteraction(req, res) {
    try {
      const userId = req.user.id;
      const { postId, interactionType, timeSpent, scrollPosition } = req.body;

      // Insert interaction record
      const query = `
        INSERT INTO user_feed_interactions 
        (user_id, post_id, interaction_type, time_spent, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (user_id, post_id, interaction_type) 
        DO UPDATE SET 
          time_spent = EXCLUDED.time_spent,
          created_at = EXCLUDED.created_at
      `;

      await db.query(query, [userId, postId, interactionType, timeSpent || null]);

      // Update post view count if it's a view interaction
      if (interactionType === 'view') {
        await db.query(
          'UPDATE community_posts SET views_count = views_count + 1 WHERE id = $1',
          [postId]
        );
      }

      // Emit real-time interaction update
      if (io) {
        io.emit('feed_interaction', {
          userId,
          postId,
          interactionType,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        message: 'Interaction recorded successfully'
      });

    } catch (error) {
      console.error('Record feed interaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to record interaction',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get feed analytics for user
   */
  async getFeedAnalytics(req, res) {
    try {
      const userId = req.user.id;
      const { timeframe = 'month' } = req.query;

      const timeframeDays = {
        week: 7,
        month: 30,
        quarter: 90,
        year: 365
      };

      const days = timeframeDays[timeframe] || 30;

      // Get interaction analytics
      const analyticsQuery = `
        SELECT 
          interaction_type,
          COUNT(*) as count,
          AVG(time_spent) as avg_time_spent
        FROM user_feed_interactions
        WHERE user_id = $1 
        AND created_at > NOW() - INTERVAL '${days} days'
        GROUP BY interaction_type
        ORDER BY count DESC
      `;

      const categoryQuery = `
        SELECT 
          cp.category,
          COUNT(ufi.*) as interactions,
          COUNT(DISTINCT cp.id) as unique_posts
        FROM user_feed_interactions ufi
        JOIN community_posts cp ON ufi.post_id = cp.id
        WHERE ufi.user_id = $1 
        AND ufi.created_at > NOW() - INTERVAL '${days} days'
        GROUP BY cp.category
        ORDER BY interactions DESC
        LIMIT 10
      `;

      const [analyticsResult, categoryResult] = await Promise.all([
        db.query(analyticsQuery, [userId]),
        db.query(categoryQuery, [userId])
      ]);

      res.json({
        success: true,
        data: {
          timeframe,
          interactions: analyticsResult.rows,
          topCategories: categoryResult.rows,
          generatedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Get feed analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get feed analytics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Update user feed preferences
   */
  async updateFeedPreferences(req, res) {
    try {
      const userId = req.user.id;
      const {
        interests,
        preferredContentTypes,
        notificationPreferences,
        privacySettings,
        location
      } = req.body;

      const updates = [];
      const values = [userId];
      let paramCount = 1;

      if (interests) {
        updates.push(`interests = $${++paramCount}`);
        values.push(JSON.stringify(interests));
      }

      if (preferredContentTypes) {
        updates.push(`preferred_content_types = $${++paramCount}`);
        values.push(JSON.stringify(preferredContentTypes));
      }

      if (notificationPreferences) {
        updates.push(`notification_preferences = $${++paramCount}`);
        values.push(JSON.stringify(notificationPreferences));
      }

      if (privacySettings) {
        updates.push(`privacy_settings = $${++paramCount}`);
        values.push(JSON.stringify(privacySettings));
      }

      if (location) {
        if (location.lat) {
          updates.push(`location_lat = $${++paramCount}`);
          values.push(location.lat);
        }
        if (location.lng) {
          updates.push(`location_lng = $${++paramCount}`);
          values.push(location.lng);
        }
        if (location.city) {
          updates.push(`city = $${++paramCount}`);
          values.push(location.city);
        }
        if (location.country) {
          updates.push(`country = $${++paramCount}`);
          values.push(location.country);
        }
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid preferences provided for update'
        });
      }

      updates.push(`updated_at = NOW()`);

      const query = `
        UPDATE user_preferences 
        SET ${updates.join(', ')}
        WHERE user_id = $1
        RETURNING *
      `;

      const result = await db.query(query, values);

      if (result.rows.length === 0) {
        // Create preferences if they don't exist
        const createQuery = `
          INSERT INTO user_preferences (
            user_id, interests, preferred_content_types, 
            notification_preferences, privacy_settings,
            location_lat, location_lng, city, country
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *
        `;

        const createResult = await db.query(createQuery, [
          userId,
          JSON.stringify(interests || []),
          JSON.stringify(preferredContentTypes || []),
          JSON.stringify(notificationPreferences || {}),
          JSON.stringify(privacySettings || {}),
          location?.lat || null,
          location?.lng || null,
          location?.city || null,
          location?.country || null
        ]);

        return res.json({
          success: true,
          message: 'Feed preferences created successfully',
          data: createResult.rows[0]
        });
      }

      res.json({
        success: true,
        message: 'Feed preferences updated successfully',
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Update feed preferences error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update feed preferences',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get personalized recommendations
   */
  async getRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const { type = 'content', limit = 10 } = req.query;

      let recommendations = [];

      switch (type) {
        case 'users':
          recommendations = await this.getUserRecommendations(userId, limit);
          break;
        case 'groups':
          recommendations = await this.getGroupRecommendations(userId, limit);
          break;
        case 'challenges':
          recommendations = await this.getChallengeRecommendations(userId, limit);
          break;
        default:
          recommendations = await this.getContentRecommendations(userId, limit);
      }

      res.json({
        success: true,
        data: {
          type,
          recommendations,
          generatedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Get recommendations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get recommendations',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Search feed content
   */
  async searchFeed(req, res) {
    try {
      const userId = req.user.id;
      const { 
        q, 
        category, 
        location, 
        sortBy = 'relevance', 
        limit = 20, 
        offset = 0 
      } = req.query;

      let query = `
        SELECT 
          cp.*,
          u.username as author_name,
          u.user_type as author_type,
          -- Simple relevance scoring
          (
            CASE WHEN cp.title ILIKE $2 THEN 3 ELSE 0 END +
            CASE WHEN cp.content ILIKE $2 THEN 2 ELSE 0 END +
            CASE WHEN cp.tags::text ILIKE $2 THEN 1 ELSE 0 END
          ) as relevance_score
        FROM community_posts cp
        JOIN users u ON cp.user_id = u.id
        WHERE 
          cp.status = 'published'
          AND cp.user_id != $1
          AND (
            cp.title ILIKE $2 
            OR cp.content ILIKE $2 
            OR cp.tags::text ILIKE $2
          )
      `;

      const params = [userId, `%${q}%`];

      if (category) {
        query += ` AND cp.category = $${params.length + 1}`;
        params.push(category);
      }

      if (location) {
        query += ` AND cp.location_name ILIKE $${params.length + 1}`;
        params.push(`%${location}%`);
      }

      // Add sorting
      switch (sortBy) {
        case 'recent':
          query += ' ORDER BY cp.created_at DESC';
          break;
        case 'popular':
          query += ' ORDER BY (cp.likes_count + cp.comments_count + cp.shares_count) DESC';
          break;
        default:
          query += ' ORDER BY relevance_score DESC, cp.created_at DESC';
      }

      query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await db.query(query, params);

      res.json({
        success: true,
        data: {
          posts: result.rows,
          query: q,
          filters: { category, location, sortBy },
          pagination: {
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: result.rows.length === parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Search feed error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search feed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get category-specific feed
   */
  async getCategoryFeed(req, res) {
    try {
      const userId = req.user.id;
      const { category } = req.params;
      const { limit = 20, offset = 0, sortBy = 'recent' } = req.query;

      let orderClause;
      switch (sortBy) {
        case 'popular':
          orderClause = 'ORDER BY (cp.likes_count + cp.comments_count + cp.shares_count) DESC';
          break;
        case 'trending':
          orderClause = `ORDER BY (
            (cp.likes_count * 3) + (cp.comments_count * 5) + (cp.shares_count * 7)
          ) / EXTRACT(EPOCH FROM (NOW() - cp.created_at)) * 3600 DESC`;
          break;
        default:
          orderClause = 'ORDER BY cp.created_at DESC';
      }

      const query = `
        SELECT 
          cp.*,
          u.username as author_name,
          u.user_type as author_type
        FROM community_posts cp
        JOIN users u ON cp.user_id = u.id
        WHERE 
          cp.status = 'published'
          AND cp.category = $1
          AND cp.user_id != $2
        ${orderClause}
        LIMIT $3 OFFSET $4
      `;

      const result = await db.query(query, [category, userId, limit, offset]);

      res.json({
        success: true,
        data: {
          posts: result.rows,
          category,
          sortBy,
          pagination: {
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: result.rows.length === parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Get category feed error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get category feed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Helper methods
  async recordFeedView(userId, postIds) {
    if (postIds.length === 0) return;

    const query = `
      INSERT INTO user_feed_interactions (user_id, post_id, interaction_type)
      SELECT $1, unnest($2::int[]), 'feed_view'
      ON CONFLICT DO NOTHING
    `;

    await db.query(query, [userId, postIds]);
  }

  async getUserRecommendations(userId, limit) {
    // Implementation for user recommendations based on similar interests
    const query = `
      SELECT DISTINCT u.id, u.username, u.user_type,
        COUNT(DISTINCT cp.id) as post_count
      FROM users u
      JOIN community_posts cp ON u.id = cp.user_id
      JOIN user_preferences up1 ON u.id = up1.user_id
      JOIN user_preferences up2 ON up2.user_id = $1
      WHERE u.id != $1
        AND up1.interests ?| (SELECT array_agg(value::text) FROM json_array_elements_text(up2.interests))
        AND NOT EXISTS (
          SELECT 1 FROM user_follows uf 
          WHERE uf.follower_id = $1 AND uf.following_id = u.id
        )
      GROUP BY u.id, u.username, u.user_type
      ORDER BY post_count DESC
      LIMIT $2
    `;

    const result = await db.query(query, [userId, limit]);
    return result.rows;
  }

  async getGroupRecommendations(userId, limit) {
    // Implementation for group recommendations
    const query = `
      SELECT cg.*, COUNT(gm.user_id) as member_count
      FROM community_groups cg
      LEFT JOIN group_memberships gm ON cg.id = gm.group_id
      WHERE NOT EXISTS (
        SELECT 1 FROM group_memberships gm2 
        WHERE gm2.group_id = cg.id AND gm2.user_id = $1
      )
      GROUP BY cg.id
      ORDER BY member_count DESC, cg.created_at DESC
      LIMIT $2
    `;

    const result = await db.query(query, [userId, limit]);
    return result.rows;
  }

  async getChallengeRecommendations(userId, limit) {
    // Implementation for challenge recommendations
    const query = `
      SELECT sc.*
      FROM sustainability_challenges sc
      WHERE sc.is_active = true
        AND sc.end_date > NOW()
        AND NOT EXISTS (
          SELECT 1 FROM user_challenge_participation ucp 
          WHERE ucp.challenge_id = sc.id AND ucp.user_id = $1
        )
      ORDER BY sc.participant_count DESC, sc.start_date ASC
      LIMIT $2
    `;

    const result = await db.query(query, [userId, limit]);
    return result.rows;
  }

  async getContentRecommendations(userId, limit) {
    // Use the feed algorithm for content recommendations
    return await feedAlgorithm.generatePersonalizedFeed(userId, limit, 0);
  }
}

module.exports = new FeedController();

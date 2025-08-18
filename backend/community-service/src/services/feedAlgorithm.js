const db = require('../config/database');

/**
 * EcoWaste Community Feed Algorithm
 * Sophisticated recommendation engine for personalized sustainability content
 */
class FeedAlgorithm {
  constructor() {
    this.weights = {
      location: 0.25,      // Local content priority
      interests: 0.30,     // User interest matching
      engagement: 0.20,    // Historical engagement patterns
      recency: 0.15,       // Time-based relevance
      social: 0.10         // Following and social connections
    };
  }

  /**
   * Generate personalized feed for a user
   * @param {number} userId - User ID
   * @param {number} limit - Number of posts to return
   * @param {number} offset - Pagination offset
   * @returns {Array} Scored and ranked posts
   */
  async generatePersonalizedFeed(userId, limit = 20, offset = 0) {
    try {
      // Get user preferences and profile
      const userProfile = await this.getUserProfile(userId);
      
      // Get candidate posts (last 7 days for performance)
      const candidatePosts = await this.getCandidatePosts(userId);
      
      // Score each post based on multiple factors
      const scoredPosts = await Promise.all(
        candidatePosts.map(post => this.scorePost(post, userProfile))
      );
      
      // Sort by score and apply diversity filters
      const rankedPosts = this.applyDiversityFilters(
        scoredPosts.sort((a, b) => b.score - a.score)
      );
      
      // Apply pagination
      const paginatedPosts = rankedPosts.slice(offset, offset + limit);
      
      // Record feed generation for learning
      await this.recordFeedGeneration(userId, paginatedPosts.map(p => p.id));
      
      return paginatedPosts;
    } catch (error) {
      console.error('Feed generation error:', error);
      // Fallback to simple chronological feed
      return this.getFallbackFeed(userId, limit, offset);
    }
  }

  /**
   * Get user profile with preferences and behavior patterns
   */
  async getUserProfile(userId) {
    const query = `
      SELECT 
        up.*,
        u.username,
        u.created_at as user_since,
        COALESCE(
          (SELECT json_agg(interaction_type) 
           FROM user_feed_interactions ufi 
           WHERE ufi.user_id = up.user_id 
           AND ufi.created_at > NOW() - INTERVAL '30 days'
          ), '[]'::json
        ) as recent_interactions,
        COALESCE(
          (SELECT json_agg(DISTINCT category) 
           FROM community_posts cp 
           JOIN post_interactions pi ON cp.id = pi.post_id 
           WHERE pi.user_id = up.user_id 
           AND pi.interaction_type IN ('like', 'comment', 'share')
           AND pi.created_at > NOW() - INTERVAL '30 days'
          ), '[]'::json
        ) as engaged_categories
      FROM user_preferences up
      JOIN users u ON up.user_id = u.id
      WHERE up.user_id = $1
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows[0] || this.getDefaultUserProfile(userId);
  }

  /**
   * Get candidate posts for scoring
   */
  async getCandidatePosts(userId, dayLimit = 7) {
    const query = `
      SELECT 
        cp.*,
        u.username as author_name,
        u.user_type as author_type,
        COALESCE(cp.likes_count, 0) as likes_count,
        COALESCE(cp.comments_count, 0) as comments_count,
        COALESCE(cp.shares_count, 0) as shares_count,
        COALESCE(cp.views_count, 0) as views_count,
        -- Check if user already interacted
        CASE WHEN pi.id IS NOT NULL THEN true ELSE false END as user_interacted,
        -- Calculate engagement rate
        CASE 
          WHEN cp.views_count > 0 
          THEN (cp.likes_count + cp.comments_count + cp.shares_count)::float / cp.views_count 
          ELSE 0 
        END as engagement_rate
      FROM community_posts cp
      JOIN users u ON cp.user_id = u.id
      LEFT JOIN post_interactions pi ON cp.id = pi.post_id AND pi.user_id = $1
      WHERE 
        cp.status = 'published'
        AND cp.created_at > NOW() - INTERVAL '${dayLimit} days'
        AND cp.user_id != $1  -- Exclude user's own posts
        AND pi.id IS NULL     -- Exclude already interacted posts
      ORDER BY cp.created_at DESC
      LIMIT 500
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  /**
   * Score individual post based on user preferences
   */
  async scorePost(post, userProfile) {
    let score = 0;
    const factors = {};

    // 1. Location Score (25%)
    factors.location = this.calculateLocationScore(post, userProfile);
    score += factors.location * this.weights.location;

    // 2. Interest Score (30%)
    factors.interests = this.calculateInterestScore(post, userProfile);
    score += factors.interests * this.weights.interests;

    // 3. Engagement Score (20%)
    factors.engagement = this.calculateEngagementScore(post, userProfile);
    score += factors.engagement * this.weights.engagement;

    // 4. Recency Score (15%)
    factors.recency = this.calculateRecencyScore(post);
    score += factors.recency * this.weights.recency;

    // 5. Social Score (10%)
    factors.social = await this.calculateSocialScore(post, userProfile);
    score += factors.social * this.weights.social;

    // Apply quality multipliers
    score = this.applyQualityMultipliers(score, post);

    return {
      ...post,
      score: Math.round(score * 100) / 100,
      scoring_factors: factors
    };
  }

  /**
   * Calculate location-based relevance score
   */
  calculateLocationScore(post, userProfile) {
    if (!userProfile.location_lat || !post.location_lat) {
      return post.location_name && userProfile.city && 
             post.location_name.toLowerCase().includes(userProfile.city.toLowerCase()) ? 0.7 : 0.3;
    }

    // Calculate distance using Haversine formula
    const distance = this.calculateDistance(
      userProfile.location_lat, userProfile.location_lng,
      post.location_lat, post.location_lng
    );

    // Score based on distance (higher score for closer content)
    if (distance <= 5) return 1.0;      // Within 5km
    if (distance <= 25) return 0.8;     // Within 25km
    if (distance <= 100) return 0.6;    // Within 100km
    if (distance <= 500) return 0.4;    // Within 500km
    return 0.2;                         // Beyond 500km
  }

  /**
   * Calculate interest-based relevance score
   */
  calculateInterestScore(post, userProfile) {
    const userInterests = userProfile.interests || [];
    const userEngagedCategories = userProfile.engaged_categories || [];
    const postCategory = post.category;
    const postTags = post.tags || [];

    let score = 0;

    // Direct interest match
    if (userInterests.includes(postCategory)) {
      score += 0.8;
    }

    // Historical engagement category match
    if (userEngagedCategories.includes(postCategory)) {
      score += 0.6;
    }

    // Tag matching
    const tagMatches = postTags.filter(tag => 
      userInterests.some(interest => 
        interest.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(interest.toLowerCase())
      )
    ).length;
    
    score += (tagMatches / Math.max(postTags.length, 1)) * 0.4;

    // Content type preference
    const preferredTypes = userProfile.preferred_content_types || [];
    if (preferredTypes.includes(post.post_type)) {
      score += 0.3;
    }

    // Sustainability level matching
    if (post.difficulty_level && userProfile.sustainability_level) {
      const levelMatch = this.matchSustainabilityLevel(
        post.difficulty_level, 
        userProfile.sustainability_level
      );
      score += levelMatch * 0.2;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Calculate engagement-based score
   */
  calculateEngagementScore(post, userProfile) {
    const baseEngagement = post.engagement_rate || 0;
    const totalInteractions = post.likes_count + post.comments_count + post.shares_count;
    
    // Normalize engagement metrics
    let score = Math.min(baseEngagement * 2, 0.6); // Cap at 0.6
    
    // Add bonus for high interaction count
    if (totalInteractions > 50) score += 0.3;
    else if (totalInteractions > 20) score += 0.2;
    else if (totalInteractions > 5) score += 0.1;
    
    // Verified content bonus
    if (post.is_verified) score += 0.2;
    if (post.is_featured) score += 0.1;
    
    // Author credibility (expert users)
    if (post.author_type === 'expert') score += 0.15;
    
    return Math.min(score, 1.0);
  }

  /**
   * Calculate time-based relevance score
   */
  calculateRecencyScore(post) {
    const now = new Date();
    const postDate = new Date(post.created_at);
    const hoursOld = (now - postDate) / (1000 * 60 * 60);
    
    // Event posts get different scoring
    if (post.is_local_event && post.event_date) {
      const eventDate = new Date(post.event_date);
      const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);
      
      // Upcoming events (within 7 days) get high scores
      if (hoursUntilEvent > 0 && hoursUntilEvent <= 168) {
        return 1.0 - (hoursUntilEvent / 168) * 0.3; // 0.7 to 1.0
      }
    }
    
    // Regular posts - decay over time
    if (hoursOld <= 2) return 1.0;      // Very fresh
    if (hoursOld <= 12) return 0.9;     // Fresh
    if (hoursOld <= 24) return 0.8;     // Recent
    if (hoursOld <= 72) return 0.6;     // Somewhat recent
    if (hoursOld <= 168) return 0.4;    // This week
    return 0.2;                         // Older content
  }

  /**
   * Calculate social connection score
   */
  async calculateSocialScore(post, userProfile) {
    // Check if user follows the post author
    const followQuery = `
      SELECT 1 FROM user_follows 
      WHERE follower_id = $1 AND following_id = $2
    `;
    
    const followResult = await db.query(followQuery, [userProfile.user_id, post.user_id]);
    
    if (followResult.rows.length > 0) {
      return 1.0; // High score for followed users
    }
    
    // Check mutual connections or interactions
    const mutualQuery = `
      SELECT COUNT(*) as mutual_count
      FROM user_follows uf1
      JOIN user_follows uf2 ON uf1.following_id = uf2.following_id
      WHERE uf1.follower_id = $1 AND uf2.follower_id = $2
    `;
    
    const mutualResult = await db.query(mutualQuery, [userProfile.user_id, post.user_id]);
    const mutualCount = parseInt(mutualResult.rows[0]?.mutual_count || 0);
    
    // Score based on mutual connections
    return Math.min(mutualCount * 0.1, 0.5);
  }

  /**
   * Apply quality multipliers and penalties
   */
  applyQualityMultipliers(score, post) {
    // Length penalty for very short content
    if (post.content && post.content.length < 50) {
      score *= 0.8;
    }
    
    // Media bonus
    if (post.media_urls && post.media_urls.length > 0) {
      score *= 1.1;
    }
    
    // Environmental impact bonus
    if (post.environmental_impact && Object.keys(post.environmental_impact).length > 0) {
      score *= 1.15;
    }
    
    // Time estimate bonus (actionable content)
    if (post.estimated_time) {
      score *= 1.05;
    }
    
    return score;
  }

  /**
   * Apply diversity filters to prevent echo chambers
   */
  applyDiversityFilters(rankedPosts) {
    const diversePosts = [];
    const categoryCount = {};
    const authorCount = {};
    
    for (const post of rankedPosts) {
      const category = post.category || 'general';
      const authorId = post.user_id;
      
      // Limit posts per category (max 3 in top 10)
      if (diversePosts.length < 10) {
        if ((categoryCount[category] || 0) >= 3) continue;
      }
      
      // Limit posts per author (max 2 in top 20)
      if ((authorCount[authorId] || 0) >= 2) continue;
      
      diversePosts.push(post);
      categoryCount[category] = (categoryCount[category] || 0) + 1;
      authorCount[authorId] = (authorCount[authorId] || 0) + 1;
    }
    
    return diversePosts;
  }

  /**
   * Helper methods
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRad(degree) {
    return degree * (Math.PI / 180);
  }

  matchSustainabilityLevel(postLevel, userLevel) {
    const levels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    const postLevelNum = levels[postLevel] || 2;
    const userLevelNum = levels[userLevel] || 2;
    
    // Perfect match
    if (postLevelNum === userLevelNum) return 1.0;
    
    // One level difference
    if (Math.abs(postLevelNum - userLevelNum) === 1) return 0.7;
    
    // Two levels difference
    if (Math.abs(postLevelNum - userLevelNum) === 2) return 0.4;
    
    // More than two levels
    return 0.1;
  }

  async recordFeedGeneration(userId, postIds) {
    const query = `
      INSERT INTO user_feed_interactions (user_id, post_id, interaction_type)
      SELECT $1, unnest($2::int[]), 'feed_view'
      ON CONFLICT DO NOTHING
    `;
    
    await db.query(query, [userId, postIds]);
  }

  getDefaultUserProfile(userId) {
    return {
      user_id: userId,
      interests: ['recycling', 'sustainability'],
      sustainability_level: 'beginner',
      preferred_content_types: ['tips', 'projects'],
      recent_interactions: [],
      engaged_categories: []
    };
  }

  async getFallbackFeed(userId, limit, offset) {
    const query = `
      SELECT cp.*, u.username as author_name
      FROM community_posts cp
      JOIN users u ON cp.user_id = u.id
      WHERE cp.status = 'published' AND cp.user_id != $1
      ORDER BY cp.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await db.query(query, [userId, limit, offset]);
    return result.rows.map(post => ({ ...post, score: 0.5 }));
  }
}

module.exports = FeedAlgorithm;

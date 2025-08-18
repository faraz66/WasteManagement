-- EcoWaste Community Feed Database Schema
-- Comprehensive social platform for sustainability community

-- User Preferences and Profile Extensions
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    city VARCHAR(100),
    country VARCHAR(100),
    interests JSONB DEFAULT '[]'::jsonb, -- ["recycling", "composting", "upcycling", "renewable_energy"]
    sustainability_level VARCHAR(20) DEFAULT 'beginner', -- beginner, intermediate, advanced, expert
    preferred_content_types JSONB DEFAULT '["tips", "projects", "news", "events"]'::jsonb,
    notification_preferences JSONB DEFAULT '{
        "feed_updates": true,
        "comments": true,
        "likes": true,
        "mentions": true,
        "local_events": true,
        "weekly_digest": true
    }'::jsonb,
    privacy_settings JSONB DEFAULT '{
        "profile_visibility": "public",
        "location_sharing": "city_only",
        "activity_visibility": "public"
    }'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Community Posts
CREATE TABLE community_posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    post_type VARCHAR(50) DEFAULT 'general', -- tip, project, question, event, news, achievement
    category VARCHAR(100), -- recycling, composting, energy, transportation, etc.
    tags JSONB DEFAULT '[]'::jsonb,
    media_urls JSONB DEFAULT '[]'::jsonb, -- array of image/video URLs
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_name VARCHAR(255),
    is_local_event BOOLEAN DEFAULT FALSE,
    event_date TIMESTAMP,
    difficulty_level VARCHAR(20), -- easy, medium, hard
    estimated_time VARCHAR(50), -- "30 minutes", "2 hours", "1 week"
    environmental_impact JSONB DEFAULT '{}'::jsonb, -- {"co2_saved": "5kg", "waste_reduced": "2kg"}
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE, -- for expert content
    status VARCHAR(20) DEFAULT 'published', -- draft, published, archived, reported
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Post Interactions (Likes, Saves, etc.)
CREATE TABLE post_interactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    interaction_type VARCHAR(20) NOT NULL, -- like, save, share, report
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
    UNIQUE(user_id, post_id, interaction_type)
);

-- Comments System
CREATE TABLE post_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    parent_comment_id INTEGER, -- for nested replies
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    is_expert_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'published', -- published, hidden, reported
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES post_comments(id) ON DELETE CASCADE
);

-- User Following System
CREATE TABLE user_follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL,
    following_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(follower_id, following_id)
);

-- Community Groups/Topics
CREATE TABLE community_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    location_based BOOLEAN DEFAULT FALSE,
    city VARCHAR(100),
    country VARCHAR(100),
    member_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    is_official BOOLEAN DEFAULT FALSE, -- official EcoWaste groups
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Group Memberships
CREATE TABLE group_memberships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    role VARCHAR(20) DEFAULT 'member', -- member, moderator, admin
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES community_groups(id) ON DELETE CASCADE,
    UNIQUE(user_id, group_id)
);

-- Feed Algorithm Data
CREATE TABLE user_feed_interactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    interaction_type VARCHAR(20), -- view, click, like, comment, share, skip
    time_spent INTEGER, -- seconds spent viewing
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE
);

-- Achievements and Badges
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    achievement_type VARCHAR(100) NOT NULL, -- first_post, eco_warrior, local_hero, etc.
    achievement_data JSONB DEFAULT '{}'::jsonb,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sustainability Challenges
CREATE TABLE sustainability_challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    challenge_type VARCHAR(50), -- weekly, monthly, seasonal
    category VARCHAR(100),
    start_date DATE,
    end_date DATE,
    reward_points INTEGER DEFAULT 0,
    participant_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Challenge Participation
CREATE TABLE user_challenge_participation (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    challenge_id INTEGER NOT NULL,
    progress JSONB DEFAULT '{}'::jsonb,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    points_earned INTEGER DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES sustainability_challenges(id) ON DELETE CASCADE,
    UNIQUE(user_id, challenge_id)
);

-- Indexes for Performance
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_location ON user_preferences(location_lat, location_lng);
CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_posts_category ON community_posts(category);
CREATE INDEX idx_community_posts_location ON community_posts(location_lat, location_lng);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_post_interactions_user_id ON post_interactions(user_id);
CREATE INDEX idx_post_interactions_post_id ON post_interactions(post_id);
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);
CREATE INDEX idx_feed_interactions_user_id ON user_feed_interactions(user_id);
CREATE INDEX idx_feed_interactions_created_at ON user_feed_interactions(created_at DESC);

-- Sample Data for Development
INSERT INTO sustainability_challenges (title, description, challenge_type, category, start_date, end_date, reward_points) VALUES
('Zero Waste Week', 'Reduce your household waste to zero for one week', 'weekly', 'waste_reduction', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 100),
('Plastic-Free Month', 'Eliminate single-use plastics from your daily routine', 'monthly', 'plastic_reduction', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 250),
('Local Food Challenge', 'Source all your food from within 50 miles for 2 weeks', 'seasonal', 'local_food', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days', 150);

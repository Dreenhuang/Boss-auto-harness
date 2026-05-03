-- Vibe PM Database Schema
-- Supabase PostgreSQL Migration

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) UNIQUE,
  nickname VARCHAR(50) DEFAULT '学习者',
  avatar TEXT DEFAULT '',
  level VARCHAR(20) DEFAULT '新手',
  cards_learned INTEGER DEFAULT 0,
  learning_hours INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  preferences JSONB DEFAULT '{"interests":[],"experience":"零基础","goals":[],"timeSlot":"","notificationEnabled":true}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Posts (cards) table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(50) DEFAULT 'VibePM官方',
  avatar TEXT DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=vibepm',
  likes INTEGER DEFAULT 0,
  image TEXT DEFAULT '',
  height VARCHAR(10) DEFAULT '220px',
  category VARCHAR(20) DEFAULT '概念',
  type VARCHAR(20) DEFAULT 'concept',
  content TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 4. Learning paths table
CREATE TABLE IF NOT EXISTS learning_paths (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  difficulty VARCHAR(20) DEFAULT 'beginner',
  total_steps INTEGER DEFAULT 0,
  estimated_hours INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Learning steps table
CREATE TABLE IF NOT EXISTS learning_steps (
  id SERIAL PRIMARY KEY,
  path_id INTEGER REFERENCES learning_paths(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  step_type VARCHAR(20) DEFAULT 'card',
  content_id INTEGER,
  duration INTEGER DEFAULT 10,
  is_completed BOOLEAN DEFAULT FALSE,
  locked BOOLEAN DEFAULT FALSE
);

-- 6. User paths (enrollment + progress)
CREATE TABLE IF NOT EXISTS user_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  path_id INTEGER REFERENCES learning_paths(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'not_started',
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, path_id)
);

-- 7. Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'system',
  sender_name VARCHAR(50) DEFAULT '系统通知',
  sender_avatar TEXT DEFAULT '',
  sender_bg_color VARCHAR(10) DEFAULT '#F0F0F0',
  content TEXT NOT NULL,
  unread BOOLEAN DEFAULT TRUE,
  target_id INTEGER,
  action_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Verification codes table
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Recent views table
CREATE TABLE IF NOT EXISTS recent_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 10. Generated images table
CREATE TABLE IF NOT EXISTS generated_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  prompt TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  tech_name VARCHAR(50) DEFAULT '',
  card_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Image quota table
CREATE TABLE IF NOT EXISTS image_quota (
  date DATE PRIMARY KEY,
  count INTEGER DEFAULT 0
);

-- 12. Hot searches table
CREATE TABLE IF NOT EXISTS hot_searches (
  id SERIAL PRIMARY KEY,
  keyword VARCHAR(100) NOT NULL UNIQUE,
  count INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Search history table
CREATE TABLE IF NOT EXISTS search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  keyword VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_post_id ON favorites(post_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(user_id, unread);
CREATE INDEX IF NOT EXISTS idx_recent_views_user ON recent_views(user_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id, created_at DESC);

-- RPC function for incrementing likes
CREATE OR REPLACE FUNCTION increment_likes(post_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
  new_likes INTEGER;
BEGIN
  UPDATE posts SET likes = likes + 1, updated_at = NOW() WHERE id = post_id RETURNING likes INTO new_likes;
  RETURN new_likes;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

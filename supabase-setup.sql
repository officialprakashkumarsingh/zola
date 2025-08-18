-- AhamAI Database Setup for Supabase
-- Run these commands in your Supabase SQL Editor

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  profile_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  message_count INTEGER DEFAULT 0,
  daily_message_count INTEGER DEFAULT 0,
  daily_reset TIMESTAMPTZ,
  daily_pro_usage INTEGER DEFAULT 0,
  daily_pro_reset TIMESTAMPTZ,
  anonymous BOOLEAN DEFAULT FALSE,
  premium BOOLEAN DEFAULT FALSE,
  favorite_models JSONB DEFAULT '["gpt-4.1-nano"]'::JSONB,
  system_prompt TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  model TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- 3. Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  message_group_id UUID,
  model TEXT,
  attachments JSONB
);

-- 4. Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Chats policies
CREATE POLICY "Users can view own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can create own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON chats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON chats
  FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages from own chats" ON messages
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND (chats.user_id = auth.uid() OR chats.is_public = TRUE))
  );

CREATE POLICY "Users can create messages in own chats" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND chats.user_id = auth.uid())
  );

-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- 6. Updated at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON chats TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON messages TO authenticated;
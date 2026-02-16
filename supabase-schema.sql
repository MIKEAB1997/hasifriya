-- Run this in Supabase SQL Editor to set up the database

-- Presentations table
CREATE TABLE presentations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL DEFAULT '',
  drive_url TEXT NOT NULL DEFAULT '',
  is_new BOOLEAN DEFAULT false,
  added_at TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default categories
INSERT INTO categories (name) VALUES
  ('אסטרטגיה ותכנון'),
  ('טכנולוגיה ו-AI'),
  ('מיומנויות רכות'),
  ('ניתוח נתונים'),
  ('תרבות ארגונית'),
  ('שיווק ומכירות'),
  ('פיננסים וכלכלה');

-- Enable Row Level Security
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow read access for everyone (anon key)
CREATE POLICY "Allow read presentations" ON presentations FOR SELECT USING (true);
CREATE POLICY "Allow read categories" ON categories FOR SELECT USING (true);

-- Allow insert/update/delete for everyone (since auth is handled in the app)
CREATE POLICY "Allow insert presentations" ON presentations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update presentations" ON presentations FOR UPDATE USING (true);
CREATE POLICY "Allow delete presentations" ON presentations FOR DELETE USING (true);
CREATE POLICY "Allow insert categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete categories" ON categories FOR DELETE USING (true);

-- 00001_initial_schema.sql
-- Initial Supabase Schema for Maagaron (Portal)

-- Create custom types for ENUMS
CREATE TYPE severity_level AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE content_type AS ENUM ('article', 'incident', 'video');

-- 1. Presentations Table
CREATE TABLE public.presentations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    thumbnail_url TEXT,
    drive_url TEXT,
    is_new BOOLEAN DEFAULT false,
    author TEXT,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Cyber Cases (אירועי אמת)
CREATE TABLE public.cyber_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year TEXT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    hook TEXT,
    summary TEXT NOT NULL,
    impact TEXT,
    lesson TEXT,
    employee_lesson TEXT,
    severity severity_level DEFAULT 'medium',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Knowledge Articles (עדכונים וחדשות)
CREATE TABLE public.knowledge_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT,
    category TEXT NOT NULL,
    source TEXT,
    url TEXT UNIQUE,
    topic_id TEXT,
    topic_label TEXT,
    content_type content_type DEFAULT 'article',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cyber_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;

-- Set up basic access policies (Public Read, Authenticated Write)
CREATE POLICY "Allow public read-only access for presentations" ON public.presentations FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for cyber cases" ON public.cyber_cases FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for knowledge articles" ON public.knowledge_articles FOR SELECT USING (true);

-- (Optional) If you have an admin user, define full access for authenticated users later
CREATE POLICY "Allow auth operations presentations" ON public.presentations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth operations cyber cases" ON public.cyber_cases FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth operations knowledge articles" ON public.knowledge_articles FOR ALL USING (auth.role() = 'authenticated');

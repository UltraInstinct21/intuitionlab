-- =========================================================================
-- IntuitionLab Supabase Database Schema
-- Run this script in your Supabase Project -> SQL Editor
-- =========================================================================

-- 1. Create Topics Table
CREATE TABLE IF NOT EXISTS topics (
    id TEXT PRIMARY KEY,
    index INTEGER NOT NULL,
    title TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    problems JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Problems Table
CREATE TABLE IF NOT EXISTS problems (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    topic_folder TEXT NOT NULL,
    topic_title TEXT NOT NULL,
    topic_index INTEGER NOT NULL,
    number INTEGER,
    title TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    leetcode_url TEXT,
    tags TEXT[] DEFAULT '{}',
    expected_complexities JSONB,
    intuition TEXT,
    approach_overview TEXT,
    problem_statement TEXT,
    examples JSONB DEFAULT '[]'::jsonb,
    constraints TEXT[] DEFAULT '{}',
    approaches JSONB DEFAULT '[]'::jsonb,
    key_insight TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_problems_topic_folder ON problems(topic_folder);
CREATE INDEX IF NOT EXISTS idx_problems_slug ON problems(slug);
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_number ON problems(number);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;

-- 5. Add Policies for Public Read Access
DROP POLICY IF EXISTS "Allow public read on topics" ON topics;
CREATE POLICY "Allow public read on topics" ON topics
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on problems" ON problems;
CREATE POLICY "Allow public read on problems" ON problems
    FOR SELECT USING (true);

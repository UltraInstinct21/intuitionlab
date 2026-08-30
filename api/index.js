const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Check if Supabase is configured
const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
let supabase = null;
if (hasSupabase) {
  try {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  } catch (e) {
    console.error('Supabase init failed:', e.message);
  }
}

// Load local JSON data
let localProblems = [];
let localTopics = [];

try {
  localProblems = require('../src/data/problems.json');
  localTopics = require('../src/data/topics.json');
} catch (e) {
  try {
    const problemsFile = path.join(__dirname, '..', 'src', 'data', 'problems.json');
    const topicsFile = path.join(__dirname, '..', 'src', 'data', 'topics.json');
    if (fs.existsSync(problemsFile)) {
      localProblems = JSON.parse(fs.readFileSync(problemsFile, 'utf8'));
    }
    if (fs.existsSync(topicsFile)) {
      localTopics = JSON.parse(fs.readFileSync(topicsFile, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading JSON data in serverless API:', err.message);
  }
}

// --- API Endpoints ---

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'IntuitionLab Serverless API',
    totalTopics: localTopics.length,
    totalProblems: localProblems.length,
    supabaseConnected: hasSupabase,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'IntuitionLab Serverless API',
    totalTopics: localTopics.length,
    totalProblems: localProblems.length,
    supabaseConnected: hasSupabase
  });
});

// Statistics overview
app.get('/api/stats', (req, res) => {
  const easyCount = localProblems.filter(p => p.difficulty?.toLowerCase() === 'easy').length;
  const mediumCount = localProblems.filter(p => p.difficulty?.toLowerCase() === 'medium').length;
  const hardCount = localProblems.filter(p => p.difficulty?.toLowerCase() === 'hard').length;

  res.json({
    totalProblems: localProblems.length,
    totalTopics: localTopics.length,
    difficultyBreakdown: { easy: easyCount, medium: mediumCount, hard: hardCount },
    topics: localTopics.map(t => ({ id: t.id, title: t.title, count: t.count }))
  });
});

// Get all topics
app.get('/api/topics', async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from('topics').select('*').order('index', { ascending: true });
    if (!error && data && data.length > 0) return res.json(data);
  }
  res.json(localTopics);
});

// Get problems with search, difficulty, and topic filtering
app.get('/api/problems', async (req, res) => {
  const { topic, difficulty, search, tag } = req.query;
  let results = localProblems;

  if (topic) {
    results = results.filter(p => p.topicFolder === topic || p.topicTitle.toLowerCase() === topic.toLowerCase());
  }
  if (difficulty && difficulty.toLowerCase() !== 'all') {
    results = results.filter(p => p.difficulty?.toLowerCase() === difficulty.toLowerCase());
  }
  if (tag) {
    results = results.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase().trim();
    results = results.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.number && String(p.number) === q) ||
      (p.problemStatement && p.problemStatement.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
      (p.intuition && p.intuition.toLowerCase().includes(q))
    );
  }
  res.json(results);
});

// Get a random problem
app.get('/api/random', (req, res) => {
  if (localProblems.length === 0) return res.status(404).json({ error: 'No problems found' });
  const randomProblem = localProblems[Math.floor(Math.random() * localProblems.length)];
  res.json(randomProblem);
});

// Get a single problem by ID, slug, or problem number
app.get('/api/problems/:identifier(*)', async (req, res) => {
  const identifier = req.params.identifier;
  let problem = localProblems.find(p => p.id === identifier);
  if (!problem) problem = localProblems.find(p => p.slug === identifier);
  if (!problem && !isNaN(Number(identifier))) problem = localProblems.find(p => p.number === Number(identifier));

  if (problem) return res.json(problem);

  if (supabase) {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .or(`slug.eq.${identifier},id.eq.${identifier}`)
      .single();
    if (!error && data) return res.json(data);
  }
  res.status(404).json({ error: `Problem not found for identifier: ${identifier}` });
});

module.exports = app;

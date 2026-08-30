const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json());

// Check if Supabase is configured
const hasSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (hasSupabase) {
  const { createClient } = require('@supabase/supabase-js');
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  console.log('✅ Connected to Supabase');
} else {
  console.log('⚠️  No Supabase config found — serving local JSON data');
}

// Load local JSON data (always, as fallback)
const dataPath = path.join(__dirname, '..', '..', 'src', 'data');
let localProblems = [];
let localTopics = [];
try {
  localProblems = JSON.parse(fs.readFileSync(path.join(dataPath, 'problems.json'), 'utf8'));
  localTopics = JSON.parse(fs.readFileSync(path.join(dataPath, 'topics.json'), 'utf8'));
  console.log(`📚 Loaded ${localTopics.length} topics, ${localProblems.length} problems locally`);
} catch (e) {
  console.error('Failed to load local data:', e.message);
}

// --- Routes ---

app.get('/api/topics', async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from('topics').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }
  res.json(localTopics);
});

app.get('/api/problems', async (req, res) => {
  const { topic } = req.query;

  if (supabase) {
    let query = supabase.from('problems').select('*');
    if (topic) query = query.eq('topic_folder', topic);
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  let result = localProblems;
  if (topic) result = result.filter((p) => p.topicFolder === topic);
  res.json(result);
});

app.get('/api/problems/:slug', async (req, res) => {
  const { slug } = req.params;

  if (supabase) {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) return res.status(404).json({ error: 'Problem not found' });
    return res.json(data);
  }

  const problem = localProblems.find((p) => p.slug === slug);
  if (!problem) return res.status(404).json({ error: 'Problem not found' });
  res.json(problem);
});

app.get('/health', (req, res) => res.json({ status: 'ok', supabase: hasSupabase }));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
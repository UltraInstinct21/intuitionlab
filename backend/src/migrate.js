require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const problemsPath = path.join(__dirname, '..', '..', 'src', 'data', 'problems.json');
const topicsPath = path.join(__dirname, '..', '..', 'src', 'data', 'topics.json');

async function run() {
  const problems = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));
  const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

  // Insert topics
  const topicMap = new Map();
  for (const t of topics) {
    const { data, error } = await supabase
      .from('topics')
      .insert({ slug: t.slug, title: t.title, description: t.description ?? null })
      .select();
    if (error) throw error;
    topicMap.set(t.slug, data[0].id);
  }
  console.log(`Inserted ${topics.length} topics`);

  // Insert problems
  const toInsert = problems.map(p => ({
    topic_id: topicMap.get(p.topicFolder),
    slug: p.slug,
    title: p.title,
    difficulty: p.difficulty,
    statement: p.problemStatement,
    examples: p.examples,
    constraints: p.constraints ?? null,
    solution: p.solution ?? null,
    leetcode_url: p.leetcodeUrl,
    tags: p.tags,
    expected_complexities: p.expectedComplexities,
    intuition: p.intuition,
    approach_overview: p.approachOverview,
    problem_statement: p.problemStatement
  }));

  for (let i = 0; i < toInsert.length; i += 500) {
    const batch = toInsert.slice(i, i + 500);
    const { error } = await supabase.from('problems').insert(batch);
    if (error) throw error;
    console.log(`Inserted ${Math.min(i + 500, toInsert.length)}/${toInsert.length} problems`);
  }

  console.log('Migration completed');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
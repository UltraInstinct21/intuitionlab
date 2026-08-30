require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env');
  console.log('Provide your Supabase credentials in backend/.env to run migrations.');
  process.exit(0);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const problemsPath = path.join(__dirname, '..', '..', 'src', 'data', 'problems.json');
const topicsPath = path.join(__dirname, '..', '..', 'src', 'data', 'topics.json');

async function run() {
  const problems = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));
  const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

  console.log(`Starting migration: ${topics.length} topics, ${problems.length} problems...`);

  // Insert topics
  for (const t of topics) {
    const { error } = await supabase
      .from('topics')
      .upsert({
        id: t.id,
        index: t.index,
        title: t.title,
        count: t.count,
        problems: t.problems
      });
    if (error) console.warn(`Topic upsert warning for ${t.id}:`, error.message);
  }
  console.log(`✅ Upserted ${topics.length} topics`);

  // Insert problems in batches of 50
  for (let i = 0; i < problems.length; i += 50) {
    const batch = problems.slice(i, i + 50).map(p => ({
      id: p.id,
      slug: p.slug,
      topic_folder: p.topicFolder,
      topic_title: p.topicTitle,
      topic_index: p.topicIndex,
      number: p.number,
      title: p.title,
      difficulty: p.difficulty,
      leetcode_url: p.leetcodeUrl,
      tags: p.tags,
      expected_complexities: p.expectedComplexities,
      intuition: p.intuition,
      approach_overview: p.approachOverview,
      problem_statement: p.problemStatement,
      examples: p.examples,
      constraints: p.constraints,
      approaches: p.approaches,
      key_insight: p.keyInsight
    }));

    const { error } = await supabase.from('problems').upsert(batch);
    if (error) console.warn(`Problem batch upsert warning (index ${i}):`, error.message);
    else console.log(`✅ Upserted problems ${i + 1} - ${Math.min(i + 50, problems.length)}`);
  }

  console.log('🎉 Migration completed successfully!');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
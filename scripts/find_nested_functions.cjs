const fs = require('fs');
const path = require('path');
const baseDir = path.resolve(__dirname, '../SDE_Sheet_Solutions');

const topics = fs.readdirSync(baseDir).filter(f => {
  const p = path.join(baseDir, f);
  return fs.statSync(p).isDirectory() && fs.readdirSync(p).filter(file => file.endsWith('.md')).length > 0;
});

const cppNested = [];
const pyNested = [];

topics.forEach(t => {
  const dir = path.join(baseDir, t);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  files.forEach(f => {
    const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
    
    // Check for C++ lambdas / function<
    if (raw.includes('function<') || raw.includes('[&](') || raw.includes('[&] (') || raw.includes('auto dfs =') || raw.includes('auto helper =') || raw.includes('auto backtrack =')) {
      cppNested.push(`${t}/${f}`);
    }

    // Check for Python nested defs
    const pyBlocks = raw.match(/```(?:python|py)\s*([\s\S]*?)```/gi) || [];
    pyBlocks.forEach(block => {
      const lines = block.split('\n');
      let insideDef = false;
      let outerIndent = 0;
      for (let line of lines) {
        const match = line.match(/^(\s*)def\s+([a-zA-Z0-9_]+)\s*\(/);
        if (match) {
          const indent = match[1].length;
          if (insideDef && indent > outerIndent) {
            pyNested.push({ file: `${t}/${f}`, func: match[2] });
            break;
          } else {
            insideDef = true;
            outerIndent = indent;
          }
        }
      }
    });
  });
});

console.log('C++ files with nested lambdas/functions:', cppNested.length);
console.log('Python files with nested helper functions:', pyNested.length);

console.log('\nAll C++ files with nested lambdas:');
cppNested.forEach(f => console.log('  -', f));

console.log('\nPython files with nested def:');
pyNested.forEach(p => console.log(`  - ${p.file} (func: ${p.func})`));

const fs = require('fs');
const path = require('path');

const problems = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/problems.json'), 'utf-8'));

console.log('Total problems:', problems.length);

const emptyCodeEntries = [];

problems.forEach(p => {
  p.approaches.forEach((a, idx) => {
    const hasPy = a.pythonCode && a.pythonCode.trim().length > 0;
    const hasCpp = a.cppCode && a.cppCode.trim().length > 0;
    if (!hasPy || !hasCpp) {
      emptyCodeEntries.push({
        problemId: p.id,
        problemTitle: p.title,
        approachIndex: idx,
        approachName: a.name,
        hasPy,
        hasCpp,
        totalApproaches: p.approaches.length
      });
    }
  });
});

console.log(`Found ${emptyCodeEntries.length} approach tabs with missing code:`);
emptyCodeEntries.forEach(e => {
  console.log(`- Problem "${e.problemTitle}" (${e.problemId}): Approach #${e.approachIndex + 1} "${e.approachName}" (Py: ${e.hasPy}, Cpp: ${e.hasCpp}) [Total approaches: ${e.totalApproaches}]`);
});

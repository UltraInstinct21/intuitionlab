const fs = require('fs');
const path = require('path');
const baseDir = path.resolve(__dirname, '../SDE_Sheet_Solutions');

const topics = fs.readdirSync(baseDir).filter(f => {
  const p = path.join(baseDir, f);
  return fs.statSync(p).isDirectory() && fs.readdirSync(p).filter(file => file.endsWith('.md')).length > 0;
});

const report = [];

topics.forEach(t => {
  const dir = path.join(baseDir, t);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  files.forEach(f => {
    const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
    
    // Look for python and cpp code blocks
    const pyMatches = raw.match(/```(?:python|py)\s*([\s\S]*?)```/gi) || [];
    const cppMatches = raw.match(/```(?:cpp|c\+\+|c)\s*([\s\S]*?)```/gi) || [];
    const allCodeBlocks = raw.match(/```[\s\S]*?```/g) || [];

    report.push({
      file: `${t}/${f}`,
      pythonBlocks: pyMatches.length,
      cppBlocks: cppMatches.length,
      totalCodeBlocks: allCodeBlocks.length,
      hasPython: pyMatches.length > 0,
      hasCpp: cppMatches.length > 0
    });
  });
});

console.log('Total files checked:', report.length);
const missingPy = report.filter(r => !r.hasPython);
const missingCpp = report.filter(r => !r.hasCpp);

console.log('Files with NO Python block:', missingPy.length);
console.log('Files with NO C++ block:', missingCpp.length);

if (missingPy.length > 0) {
  console.log('Sample missing Py:', missingPy.slice(0, 10));
}
if (missingCpp.length > 0) {
  console.log('Sample missing Cpp:', missingCpp.slice(0, 10));
}

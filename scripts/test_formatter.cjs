const fs = require('fs');
const path = require('path');

function formatPythonCode(code) {
  if (!code || !code.trim()) return code;
  let clean = code.trim();

  // If already has class Solution, return as is
  if (/^class\s+Solution\b/m.test(clean)) {
    return clean;
  }

  // Extract leading comments / Node definitions (e.g., # Definition for a binary tree node...)
  const lines = clean.split('\n');
  const preLines = [];
  const bodyLines = [];
  let inClassOrDef = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!inClassOrDef && (line.trim().startsWith('#') || line.trim().startsWith('"""') || line.trim().startsWith("'''") || line.trim() === '')) {
      preLines.push(line);
    } else {
      inClassOrDef = true;
      bodyLines.push(line);
    }
  }

  // Check if bodyLines contains top-level function definitions (def func_name(...):)
  let formattedBody = [];
  for (let j = 0; j < bodyLines.length; j++) {
    const line = bodyLines[j];
    const defMatch = line.match(/^def\s+([a-zA-Z0-9_]+)\s*\((.*?)\)(.*):/);
    if (defMatch) {
      const funcName = defMatch[1];
      const params = defMatch[2].trim();
      const returnType = defMatch[3];

      let newParams;
      if (params === '') {
        newParams = 'self';
      } else if (!params.startsWith('self')) {
        newParams = `self, ${params}`;
      } else {
        newParams = params;
      }

      formattedBody.push(`    def ${funcName}(${newParams})${returnType}:`);
    } else {
      formattedBody.push(line ? `    ${line}` : '');
    }
  }

  const preStr = preLines.length > 0 ? preLines.join('\n') + '\n\n' : '';
  return `${preStr}class Solution:\n${formattedBody.join('\n')}`;
}

function formatCppCode(code) {
  if (!code || !code.trim()) return code;
  let clean = code.trim();

  // If already has class Solution, return as is
  if (/class\s+Solution\b/m.test(clean)) {
    return clean;
  }

  const lines = clean.split('\n');
  const preLines = [];
  const bodyLines = [];
  let inStructOrComment = false;
  let structBraceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!inStructOrComment && (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed === '')) {
      preLines.push(line);
    } else if (trimmed.startsWith('struct ') || trimmed.startsWith('class Node') || trimmed.startsWith('class TreeNode')) {
      inStructOrComment = true;
      preLines.push(line);
      structBraceCount += (line.match(/\{/g) || []).length;
      structBraceCount -= (line.match(/\}/g) || []).length;
    } else if (inStructOrComment) {
      preLines.push(line);
      structBraceCount += (line.match(/\{/g) || []).length;
      structBraceCount -= (line.match(/\}/g) || []).length;
      if (structBraceCount <= 0 && trimmed.includes(';')) {
        inStructOrComment = false;
      }
    } else {
      bodyLines.push(line);
    }
  }

  // Indent body lines inside class Solution { public: ... };
  const indentedBody = bodyLines.map(l => (l ? `    ${l}` : '')).join('\n');
  const preStr = preLines.length > 0 ? preLines.join('\n') + '\n\n' : '';

  return `${preStr}class Solution {\npublic:\n${indentedBody}\n};`;
}

// Test on samples
const samplePy = `def findMissingAndRepeating(arr):
    n = len(arr)
    S = sum(arr)
    S2 = sum(x * x for x in arr)
    return [S, S2]`;

const sampleCpp = `pair<int, int> findMissingAndRepeating(vector<int>& arr) {
    int n = arr.size();
    long long S = 0;
    return {1, 2};
}`;

console.log('--- Formatted Python ---');
console.log(formatPythonCode(samplePy));
console.log('\n--- Formatted C++ ---');
console.log(formatCppCode(sampleCpp));

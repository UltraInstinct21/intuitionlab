const fs = require('fs');
const path = require('path');
const { specificRefactors, unnestHelperFunctions } = require('./refactor_nested_solutions.cjs');

const baseDir = path.resolve(__dirname, '../SDE_Sheet_Solutions');
const outputDir = path.resolve(__dirname, '../src/data');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function cleanMarkdown(text) {
  if (!text) return '';
  return text.trim();
}

function formatTopicName(folderName) {
  return folderName
    .replace(/^\d+_/, '')
    .replace(/^BT_/, 'Binary_Trees_')
    .replace(/^DP_/, 'Dynamic_Programming_')
    .replace(/^DP$/, 'Dynamic_Programming')
    .replace(/Part_IV/gi, 'Part 4')
    .replace(/Part_III/gi, 'Part 3')
    .replace(/Part_II/gi, 'Part 2')
    .replace(/Part IV/gi, 'Part 4')
    .replace(/Part III/gi, 'Part 3')
    .replace(/Part II/gi, 'Part 2')
    .replace(/_/g, ' ');
}

function formatPythonCode(code) {
  if (!code || !code.trim()) return code;
  let clean = code.trim();

  // If already has class Solution / Trie / LRUCache / etc., check unnesting
  if (/^class\s+(?:Solution|Trie|LRUCache|LFUCache|MinStack|BSTIterator|MedianFinder|KthLargest|WordDictionary|SnapshotArray|MapSum)\b/m.test(clean)) {
    return unnestHelperFunctions(clean, 'python');
  }

  // Extract leading comments or Node definitions
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
  const result = `${preStr}class Solution:\n${formattedBody.join('\n')}`;
  return unnestHelperFunctions(result, 'python');
}

function formatCppCode(code) {
  if (!code || !code.trim()) return code;
  let clean = code.trim();

  // If already has class Solution / Trie / LRUCache / etc., return as is
  if (/(?:class|struct)\s+(?:Solution|Trie|LRUCache|LFUCache|MinStack|BSTIterator|MedianFinder|KthLargest|WordDictionary|SnapshotArray|MapSum)\b/m.test(clean)) {
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
    } else if (trimmed.startsWith('struct ') || trimmed.startsWith('class Node') || trimmed.startsWith('class TreeNode') || trimmed.startsWith('class ListNode')) {
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

function parseMarkdownFile(filePath, topicFolder, topicIndex) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath, '.md');
  const relativeKey = `${topicFolder}/${filename}.md`;
  
  // Extract Title and Number
  const titleMatch = raw.match(/^#\s+(?:(\d+)\.\s+)?([^\r\n]+)/m);
  const problemNumber = titleMatch && titleMatch[1] ? parseInt(titleMatch[1], 10) : null;
  const problemTitle = titleMatch && titleMatch[2] ? titleMatch[2].trim() : filename.replace(/^\d+-/, '').replace(/-/g, ' ');

  // Extract Metadata
  const diffMatch = raw.match(/\*\*Difficulty:\*\*\s*([A-Za-z]+)/i);
  let difficulty = diffMatch ? diffMatch[1].trim() : 'Medium';
  if (['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
    difficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
  }

  const leetcodeMatch = raw.match(/\[(?:LeetCode|LC|\d+)\]\((https?:\/\/[^\s\)]+)\)/i);
  const genericUrlMatch = raw.match(/\((https?:\/\/[^\s\)]+)\)/);
  const leetcodeUrl = leetcodeMatch 
    ? leetcodeMatch[1] 
    : genericUrlMatch 
    ? genericUrlMatch[1] 
    : `https://leetcode.com/problemset/all/?search=${encodeURIComponent(problemTitle)}`;

  // Extract Topic Tags
  const topicTagsMatch = raw.match(/## Topic Tags\s*([\s\S]*?)(?=---\s*|##|$)/i);
  let tags = [];
  if (topicTagsMatch) {
    const tagMatches = topicTagsMatch[1].match(/`([^`]+)`/g);
    if (tagMatches) {
      tags = tagMatches.map(t => t.replace(/`/g, '').trim());
    }
  }

  // Extract Problem Statement
  const statementMatch = raw.match(/## Problem Statement\s*([\s\S]*?)(?=---\s*|## Examples|## Constraints|## Topic Tags|$)/i);
  const problemStatement = statementMatch ? cleanMarkdown(statementMatch[1]) : '';

  // Extract Examples
  const examplesMatch = raw.match(/## Examples\s*([\s\S]*?)(?=---\s*|## Constraints|## Topic Tags|## Expected|$)/i);
  const examples = [];
  if (examplesMatch) {
    const rawExamples = examplesMatch[1];
    const exBlocks = rawExamples.split(/\*\*Example\s*\d*:?\*\*/i).filter(b => b.trim().length > 0);
    for (const block of exBlocks) {
      const inputMatch = block.match(/Input:\s*([^\r\n]+(?:\r?\n(?!Output:)[^\r\n]+)*)/i);
      const outputMatch = block.match(/Output:\s*([^\r\n]+(?:\r?\n(?!Explanation:)[^\r\n]+)*)/i);
      const explMatch = block.match(/Explanation:\s*([^\r\n]+(?:\r?\n[^\r\n]+)*)/i);
      
      let input = inputMatch ? inputMatch[1].trim().replace(/^```|```$/g, '').trim() : '';
      let output = outputMatch ? outputMatch[1].trim().replace(/^```|```$/g, '').trim() : '';
      let explanation = explMatch ? explMatch[1].trim().replace(/^```|```$/g, '').trim() : '';

      if (!input && !output) {
        const codeBlock = block.match(/```([\s\S]*?)```/);
        if (codeBlock) {
          const lines = codeBlock[1].trim().split('\n');
          const inLine = lines.find(l => l.startsWith('Input:'));
          const outLine = lines.find(l => l.startsWith('Output:'));
          const expLine = lines.find(l => l.startsWith('Explanation:'));
          if (inLine) input = inLine.replace('Input:', '').trim();
          if (outLine) output = outLine.replace('Output:', '').trim();
          if (expLine) explanation = expLine.replace('Explanation:', '').trim();
        }
      }

      examples.push({
        input: input || 'See description for sample test case',
        output: output || '',
        explanation: explanation || undefined,
        raw: cleanMarkdown(block)
      });
    }
  }

  // Extract Constraints
  const constraintsMatch = raw.match(/## Constraints\s*([\s\S]*?)(?=---\s*|## Topic Tags|## Expected|## Intuition|$)/i);
  const constraints = [];
  if (constraintsMatch) {
    const lines = constraintsMatch[1].split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        constraints.push(trimmed.replace(/^[-*]\s*/, '').replace(/`/g, ''));
      }
    }
  }

  // Extract Expected Complexities
  const expCompMatch = raw.match(/## Expected Complexities\s*([\s\S]*?)(?=---\s*|## Intuition|## Approach|$)/i);
  let expectedTime = '';
  let expectedSpace = '';
  if (expCompMatch) {
    const timeM = expCompMatch[1].match(/\*\*Time\*\*\s*\|\s*([^\|\r\n]+)/i);
    const spaceM = expCompMatch[1].match(/\*\*Space\*\*\s*\|\s*([^\|\r\n]+)/i);
    if (timeM) expectedTime = timeM[1].trim();
    if (spaceM) expectedSpace = spaceM[1].trim();
  }

  // Extract Intuition
  const intuitionMatch = raw.match(/## Intuition\s*([\s\S]*?)(?=---\s*|## Approach|## Brute Force|## Better|## Optimal|## Step|$)/i);
  const intuition = intuitionMatch ? cleanMarkdown(intuitionMatch[1]) : '';

  // Extract High Level Approach Steps
  const mainApproachMatch = raw.match(/## Approach(?:\s*\([^\)]+\))?\s*([\s\S]*?)(?=---\s*|## Brute Force|## Better|## Optimal|## Step|## Key Insight|$)/i);
  let approachOverview = mainApproachMatch ? cleanMarkdown(mainApproachMatch[1]) : '';

  // Extract Key Insight
  const keyInsightMatch = raw.match(/## Key Insight\s*([\s\S]*?)$/i);
  let keyInsight = '';
  if (keyInsightMatch) {
    keyInsight = cleanMarkdown(keyInsightMatch[1].replace(/^>\s*/gm, '').replace(/---\s*$/g, ''));
  }

  // Extract Specific Approach Sections
  const approachSections = [];
  const H2Regex = /^##\s+([^\r\n]+)/gm;
  const h2Headers = [];
  let h2Match;
  while ((h2Match = H2Regex.exec(raw)) !== null) {
    h2Headers.push({
      title: h2Match[1].trim(),
      index: h2Match.index,
      length: h2Match[0].length
    });
  }

  for (let i = 0; i < h2Headers.length; i++) {
    const current = h2Headers[i];
    const headerTitle = current.title;
    
    const isExcluded = [
      'problem statement', 'examples', 'constraints', 'topic tags', 
      'expected complexities', 'intuition', 'key insight'
    ].includes(headerTitle.toLowerCase());

    if (isExcluded) continue;

    const startIdx = current.index + current.length;
    const endIdx = (i + 1 < h2Headers.length) ? h2Headers[i + 1].index : raw.length;
    const sectionContent = raw.slice(startIdx, endIdx);

    // Extract Python code
    const pyMatch = sectionContent.match(/```(?:python|py)\s*([\s\S]*?)```/i);
    let pythonCode = pyMatch ? pyMatch[1].trim() : '';

    // Extract C++ code
    const cppMatch = sectionContent.match(/```(?:cpp|c\+\+|c)\s*([\s\S]*?)```/i);
    let cppCode = cppMatch ? cppMatch[1].trim() : '';

    // If specific clean refactor exists for this file
    if (specificRefactors[relativeKey]) {
      if (pythonCode) pythonCode = specificRefactors[relativeKey].python || pythonCode;
      if (cppCode) cppCode = specificRefactors[relativeKey].cpp || cppCode;
    }

    // Extract description from ### Approach or from the top of section
    const descMatch = sectionContent.match(/### Approach\s*([\s\S]*?)(?=### Code|### Complexity|```|$)/i);
    let description = descMatch ? cleanMarkdown(descMatch[1]) : '';
    if (!description) {
      const topText = sectionContent.split(/###|```/)[0];
      description = cleanMarkdown(topText);
    }

    // If this section has NO code at all:
    if (!pythonCode && !cppCode) {
      if (description && !approachOverview.includes(description)) {
        approachOverview = approachOverview ? `${approachOverview}\n\n**${headerTitle}:** ${description}` : `**${headerTitle}:** ${description}`;
      }
      continue;
    }

    // Extract Complexity
    const compMatch = sectionContent.match(/### Complexity\s*([\s\S]*?)(?=---|##|$)/i);
    let timeComp = '';
    let spaceComp = '';
    if (compMatch) {
      const t = compMatch[1].match(/\*\*Time:\*\*\s*([^\r\n]+)/i);
      const s = compMatch[1].match(/\*\*Space:\*\*\s*([^\r\n]+)/i);
      if (t) timeComp = t[1].trim();
      if (s) spaceComp = s[1].trim();
    }

    approachSections.push({
      name: headerTitle,
      description,
      pythonCode: formatPythonCode(pythonCode),
      cppCode: formatCppCode(cppCode),
      timeComplexity: timeComp || expectedTime || 'O(N)',
      spaceComplexity: spaceComp || expectedSpace || 'O(1)'
    });
  }

  // Fallback if no approaches were found from H2s
  if (approachSections.length === 0) {
    const pyMatch = raw.match(/```(?:python|py)\s*([\s\S]*?)```/i);
    const cppMatch = raw.match(/```(?:cpp|c\+\+|c)\s*([\s\S]*?)```/i);
    let pyCode = pyMatch ? pyMatch[1].trim() : '';
    let cCode = cppMatch ? cppMatch[1].trim() : '';

    if (specificRefactors[relativeKey]) {
      if (pyCode) pyCode = specificRefactors[relativeKey].python || pyCode;
      if (cCode) cCode = specificRefactors[relativeKey].cpp || cCode;
    }

    approachSections.push({
      name: 'Optimal Solution',
      description: approachOverview || intuition || 'Standard optimal algorithm for this problem.',
      pythonCode: formatPythonCode(pyCode),
      cppCode: formatCppCode(cCode),
      timeComplexity: expectedTime || 'O(N)',
      spaceComplexity: expectedSpace || 'O(1)'
    });
  }

  // Ensure every approach has both pythonCode and cppCode
  const allPyCodes = raw.match(/```(?:python|py)\s*([\s\S]*?)```/gi) || [];
  const allCppCodes = raw.match(/```(?:cpp|c\+\+|c)\s*([\s\S]*?)```/gi) || [];
  let defaultPy = allPyCodes.length > 0 ? allPyCodes[allPyCodes.length - 1].replace(/^```(?:python|py)\s*/i, '').replace(/```$/, '').trim() : '';
  let defaultCpp = allCppCodes.length > 0 ? allCppCodes[allCppCodes.length - 1].replace(/^```(?:cpp|c\+\+|c)\s*/i, '').replace(/```$/, '').trim() : '';

  if (specificRefactors[relativeKey]) {
    defaultPy = specificRefactors[relativeKey].python || defaultPy;
    defaultCpp = specificRefactors[relativeKey].cpp || defaultCpp;
  }

  approachSections.forEach(app => {
    if (!app.pythonCode && defaultPy) app.pythonCode = formatPythonCode(defaultPy);
    if (!app.cppCode && defaultCpp) app.cppCode = formatCppCode(defaultCpp);
  });

  const topicFriendlyName = formatTopicName(topicFolder);

  return {
    id: `${topicFolder}/${filename}`,
    slug: filename,
    topicFolder,
    topicTitle: topicFriendlyName,
    topicIndex,
    number: problemNumber,
    title: problemTitle,
    difficulty,
    leetcodeUrl,
    tags: tags.length > 0 ? tags : [topicFriendlyName],
    expectedComplexities: {
      time: expectedTime || 'O(N)',
      space: expectedSpace || 'O(1)'
    },
    intuition,
    approachOverview,
    problemStatement,
    examples,
    constraints,
    approaches: approachSections,
    keyInsight: keyInsight || intuition
  };
}

function buildDataset() {
  const topics = fs.readdirSync(baseDir).filter(f => {
    const p = path.join(baseDir, f);
    if (!fs.statSync(p).isDirectory()) return false;
    const files = fs.readdirSync(p).filter(file => file.endsWith('.md'));
    return files.length > 0;
  }).sort((a, b) => {
    const numA = parseInt(a.split('_')[0], 10) || 0;
    const numB = parseInt(b.split('_')[0], 10) || 0;
    return numA - numB;
  });

  const allProblems = [];
  const topicList = [];

  topics.forEach((topicFolder, idx) => {
    const topicPath = path.join(baseDir, topicFolder);
    const files = fs.readdirSync(topicPath).filter(f => f.endsWith('.md')).sort();

    const topicProblems = [];
    files.forEach(file => {
      try {
        const parsed = parseMarkdownFile(path.join(topicPath, file), topicFolder, idx + 1);
        allProblems.push(parsed);
        topicProblems.push({
          id: parsed.id,
          slug: parsed.slug,
          number: parsed.number,
          title: parsed.title,
          difficulty: parsed.difficulty,
          tags: parsed.tags
        });
      } catch (err) {
        console.error(`Error parsing ${file}:`, err);
      }
    });

    const friendlyName = formatTopicName(topicFolder);

    topicList.push({
      id: topicFolder,
      index: idx + 1,
      title: friendlyName,
      count: topicProblems.length,
      problems: topicProblems
    });
  });

  console.log(`Successfully parsed ${allProblems.length} problems across ${topicList.length} topics.`);

  fs.writeFileSync(
    path.join(outputDir, 'problems.json'),
    JSON.stringify(allProblems, null, 2),
    'utf-8'
  );

  fs.writeFileSync(
    path.join(outputDir, 'topics.json'),
    JSON.stringify(topicList, null, 2),
    'utf-8'
  );

  console.log('Saved problems.json and topics.json to src/data!');
}

buildDataset();

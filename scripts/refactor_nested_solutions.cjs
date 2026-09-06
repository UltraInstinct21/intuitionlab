const fs = require('fs');
const path = require('path');
const baseDir = path.resolve(__dirname, '../SDE_Sheet_Solutions');

// Also automated transformer for nested defs & lambda helpers in any solution
function unnestHelperFunctions(code, language) {
  if (!code) return code;

  if (language === 'python') {
    // If code has a nested def helper / dfs / solve inside outer func
    // e.g.
    // def outer(self, ...):
    //     def helper(...):
    //         ...
    //     helper(...)
    // Extract `def helper` into a sibling class member `def helper(self, ...):`
    const lines = code.split('\n');
    let hasNestedDef = false;
    let outerDefIndex = -1;
    let nestedDefs = [];
    let currentNested = null;
    let newOuterLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const outerMatch = line.match(/^(\s{4})def\s+([a-zA-Z0-9_]+)\s*\((.*)\)(.*):/);
      const nestedMatch = line.match(/^(\s{8})def\s+([a-zA-Z0-9_]+)\s*\((.*)\)(.*):/);

      if (outerMatch) {
        outerDefIndex = i;
        newOuterLines.push(line);
      } else if (nestedMatch && outerDefIndex !== -1) {
        hasNestedDef = true;
        currentNested = {
          name: nestedMatch[2],
          params: nestedMatch[3].trim(),
          returnType: nestedMatch[4],
          lines: []
        };
        nestedDefs.push(currentNested);
      } else if (currentNested) {
        // If still inside nested function (indent >= 12 or empty)
        if (/^\s{12}/.test(line) || line.trim() === '') {
          // De-indent by 4 spaces
          const deindented = line.startsWith('    ') ? line.slice(4) : line;
          currentNested.lines.push(deindented);
        } else {
          currentNested = null;
          // In outer body, replace calls to helper(...) with self.helper(...)
          newOuterLines.push(line);
        }
      } else {
        newOuterLines.push(line);
      }
    }

    if (!hasNestedDef || nestedDefs.length === 0) {
      return code;
    }

    // Build unnested methods
    const memberMethods = [];
    nestedDefs.forEach(nd => {
      let params = nd.params;
      if (!params.startsWith('self')) {
        params = params ? `self, ${params}` : 'self';
      }
      let body = nd.lines.join('\n');
      // Replace recursive calls to nd.name(...) with self.nd.name(...)
      const recursiveRegex = new RegExp(`\\b${nd.name}\\s*\\(`, 'g');
      body = body.replace(recursiveRegex, `self.${nd.name}(`);

      memberMethods.push(`    def ${nd.name}(${params})${nd.returnType}:\n${body}`);
    });

    // Replace calls in outer body to helper(...) with self.helper(...)
    let outerCode = newOuterLines.join('\n');
    nestedDefs.forEach(nd => {
      const callRegex = new RegExp(`(?<!def\\s+)\\b${nd.name}\\s*\\(`, 'g');
      outerCode = outerCode.replace(callRegex, `self.${nd.name}(`);
    });

    const linesAll = outerCode.split('\n');
    const classIdx = linesAll.findIndex(l => l.trim().startsWith('class '));
    if (classIdx !== -1) {
      const beforeClass = linesAll.slice(0, classIdx + 1);
      const afterClass = linesAll.slice(classIdx + 1);
      return `${beforeClass.join('\n')}\n${memberMethods.join('\n\n')}\n\n${afterClass.join('\n')}`;
    }

    return `${memberMethods.join('\n\n')}\n\n${outerCode}`;
  }

  if (language === 'cpp') {
    // If code has function<...> lambda closure, check if it's in specificRefactors or return clean class structure
    return code;
  }

  return code;
}

module.exports = { unnestHelperFunctions };
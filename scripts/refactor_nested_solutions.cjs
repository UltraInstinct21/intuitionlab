const fs = require('fs');
const path = require('path');
const baseDir = path.resolve(__dirname, '../SDE_Sheet_Solutions');

// Map of file paths to clean class-based implementations for both Python and C++
const specificRefactors = {
  // 09_Recursion
  '09_Recursion/01-subset-sums.md': {
    python: `class Solution:
    def solve(self, idx: int, currentSum: int, arr: list[int], result: list[int]) -> None:
        if idx == len(arr):
            result.append(currentSum)
            return
        self.solve(idx + 1, currentSum + arr[idx], arr, result)  # pick
        self.solve(idx + 1, currentSum, arr, result)              # not pick

    def subsetSums(self, arr: list[int]) -> list[int]:
        result = []
        self.solve(0, 0, arr, result)
        result.sort()
        return result`,
    cpp: `class Solution {
private:
    void solve(int idx, int currentSum, vector<int>& arr, vector<int>& result) {
        if (idx == arr.size()) {
            result.push_back(currentSum);
            return;
        }
        solve(idx + 1, currentSum + arr[idx], arr, result);  // pick
        solve(idx + 1, currentSum, arr, result);              // not pick
    }

public:
    vector<int> subsetSums(vector<int>& arr) {
        vector<int> result;
        solve(0, 0, arr, result);
        sort(result.begin(), result.end());
        return result;
    }
};`
  },

  '09_Recursion/02-subsets-ii.md': {
    python: `class Solution:
    def backtrack(self, start: int, nums: list[int], current: list[int], result: list[list[int]]) -> None:
        result.append(list(current))
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue
            current.append(nums[i])
            self.backtrack(i + 1, nums, current, result)
            current.pop()

    def subsetsWithDup(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        result = []
        self.backtrack(0, nums, [], result)
        return result`,
    cpp: `class Solution {
private:
    void backtrack(int start, vector<int>& nums, vector<int>& current, vector<vector<int>>& result) {
        result.push_back(current);
        for (int i = start; i < nums.size(); i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;
            current.push_back(nums[i]);
            backtrack(i + 1, nums, current, result);
            current.pop_back();
        }
    }

public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> result;
        vector<int> current;
        backtrack(0, nums, current, result);
        return result;
    }
};`
  },

  '09_Recursion/03-combination-sum.md': {
    python: `class Solution:
    def backtrack(self, idx: int, target: int, candidates: list[int], current: list[int], result: list[list[int]]) -> None:
        if target == 0:
            result.append(list(current))
            return
        if idx == len(candidates) or target < 0:
            return

        # Pick candidate
        if candidates[idx] <= target:
            current.append(candidates[idx])
            self.backtrack(idx, target - candidates[idx], candidates, current, result)
            current.pop()

        # Skip candidate
        self.backtrack(idx + 1, target, candidates, current, result)

    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        result = []
        self.backtrack(0, target, candidates, [], result)
        return result`,
    cpp: `class Solution {
private:
    void backtrack(int idx, int target, vector<int>& candidates, vector<int>& current, vector<vector<int>>& result) {
        if (target == 0) {
            result.push_back(current);
            return;
        }
        if (idx == candidates.size() || target < 0) return;

        if (candidates[idx] <= target) {
            current.push_back(candidates[idx]);
            backtrack(idx, target - candidates[idx], candidates, current, result);
            current.pop_back();
        }

        backtrack(idx + 1, target, candidates, current, result);
    }

public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> current;
        backtrack(0, target, candidates, current, result);
        return result;
    }
};`
  },

  '09_Recursion/04-combination-sum-ii.md': {
    python: `class Solution:
    def backtrack(self, start: int, target: int, candidates: list[int], current: list[int], result: list[list[int]]) -> None:
        if target == 0:
            result.append(list(current))
            return

        for i in range(start, len(candidates)):
            if i > start and candidates[i] == candidates[i - 1]:
                continue
            if candidates[i] > target:
                break
            current.append(candidates[i])
            self.backtrack(i + 1, target - candidates[i], candidates, current, result)
            current.pop()

    def combinationSum2(self, candidates: list[int], target: int) -> list[list[int]]:
        candidates.sort()
        result = []
        self.backtrack(0, target, candidates, [], result)
        return result`,
    cpp: `class Solution {
private:
    void backtrack(int start, int target, vector<int>& candidates, vector<int>& current, vector<vector<int>>& result) {
        if (target == 0) {
            result.push_back(current);
            return;
        }

        for (int i = start; i < candidates.size(); i++) {
            if (i > start && candidates[i] == candidates[i - 1]) continue;
            if (candidates[i] > target) break;
            current.push_back(candidates[i]);
            backtrack(i + 1, target - candidates[i], candidates, current, result);
            current.pop_back();
        }
    }

public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        vector<vector<int>> result;
        vector<int> current;
        backtrack(0, target, candidates, current, result);
        return result;
    }
};`
  },

  '09_Recursion/05-palindrome-partitioning.md': {
    python: `class Solution:
    def isPalindrome(self, s: str, start: int, end: int) -> bool:
        while start < end:
            if s[start] != s[end]:
                return False
            start += 1
            end -= 1
        return True

    def backtrack(self, start: int, s: str, current: list[str], result: list[list[str]]) -> None:
        if start == len(s):
            result.append(list(current))
            return

        for end in range(start, len(s)):
            if self.isPalindrome(s, start, end):
                current.append(s[start:end + 1])
                self.backtrack(end + 1, s, current, result)
                current.pop()

    def partition(self, s: str) -> list[list[str]]:
        result = []
        self.backtrack(0, s, [], result)
        return result`,
    cpp: `class Solution {
private:
    bool isPalindrome(const string& s, int start, int end) {
        while (start < end) {
            if (s[start] != s[end]) return false;
            start++;
            end--;
        }
        return true;
    }

    void backtrack(int start, const string& s, vector<string>& current, vector<vector<string>>& result) {
        if (start == s.length()) {
            result.push_back(current);
            return;
        }

        for (int end = start; end < s.length(); end++) {
            if (isPalindrome(s, start, end)) {
                current.push_back(s.substr(start, end - start + 1));
                backtrack(end + 1, s, current, result);
                current.pop_back();
            }
        }
    }

public:
    vector<vector<string>> partition(string s) {
        vector<vector<string>> result;
        vector<string> current;
        backtrack(0, s, current, result);
        return result;
    }
};`
  },

  '10_Recursion_and_Backtracking/02-n-queen.md': {
    python: `class Solution:
    def isSafe(self, row: int, col: int, board: list[str], n: int) -> bool:
        r, c = row, col
        while r >= 0 and c >= 0:
            if board[r][c] == 'Q': return False
            r -= 1
            c -= 1

        r, c = row, col
        while c >= 0:
            if board[r][c] == 'Q': return False
            c -= 1

        r, c = row, col
        while r < n and c >= 0:
            if board[r][c] == 'Q': return False
            r += 1
            c -= 1

        return True

    def backtrack(self, col: int, board: list[str], result: list[list[str]], n: int) -> None:
        if col == n:
            result.append(list(board))
            return

        for row in range(n):
            if self.isSafe(row, col, board, n):
                row_list = list(board[row])
                row_list[col] = 'Q'
                board[row] = "".join(row_list)
                self.backtrack(col + 1, board, result, n)
                row_list[col] = '.'
                board[row] = "".join(row_list)

    def solveNQueens(self, n: int) -> list[list[str]]:
        result = []
        board = ["." * n for _ in range(n)]
        self.backtrack(0, board, result, n)
        return result`,
    cpp: `class Solution {
private:
    bool isSafe(int row, int col, vector<string>& board, int n) {
        int r = row, c = col;
        while (r >= 0 && c >= 0) {
            if (board[r][c] == 'Q') return false;
            r--; c--;
        }

        r = row; c = col;
        while (c >= 0) {
            if (board[r][c] == 'Q') return false;
            c--;
        }

        r = row; c = col;
        while (r < n && c >= 0) {
            if (board[r][c] == 'Q') return false;
            r++; c--;
        }

        return true;
    }

    void backtrack(int col, vector<string>& board, vector<vector<string>>& result, int n) {
        if (col == n) {
            result.push_back(board);
            return;
        }

        for (int row = 0; row < n; row++) {
            if (isSafe(row, col, board, n)) {
                board[row][col] = 'Q';
                backtrack(col + 1, board, result, n);
                board[row][col] = '.';
            }
        }
    }

public:
    vector<vector<string>> solveNQueens(int n) {
        vector<vector<string>> result;
        vector<string> board(n, string(n, '.'));
        backtrack(0, board, result, n);
        return result;
    }
};`
  },

  '10_Recursion_and_Backtracking/03-sudoku-solver.md': {
    python: `class Solution:
    def isValid(self, board: list[list[str]], row: int, col: int, c: str) -> bool:
        for i in range(9):
            if board[i][col] == c: return False
            if board[row][i] == c: return False
            if board[3 * (row // 3) + i // 3][3 * (col // 3) + i % 3] == c: return False
        return True

    def solve(self, board: list[list[str]]) -> bool:
        for i in range(9):
            for j in range(9):
                if board[i][j] == '.':
                    for c in '123456789':
                        if self.isValid(board, i, j, c):
                            board[i][j] = c
                            if self.solve(board):
                                return True
                            board[i][j] = '.'
                    return False
        return True

    def solveSudoku(self, board: list[list[str]]) -> None:
        self.solve(board)`,
    cpp: `class Solution {
private:
    bool isValid(vector<vector<char>>& board, int row, int col, char c) {
        for (int i = 0; i < 9; i++) {
            if (board[i][col] == c) return false;
            if (board[row][i] == c) return false;
            if (board[3 * (row / 3) + i / 3][3 * (col / 3) + i % 3] == c) return false;
        }
        return true;
    }

    bool solve(vector<vector<char>>& board) {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] == '.') {
                    for (char c = '1'; c <= '9'; c++) {
                        if (isValid(board, i, j, c)) {
                            board[i][j] = c;
                            if (solve(board)) return true;
                            board[i][j] = '.';
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

public:
    void solveSudoku(vector<vector<char>>& board) {
        solve(board);
    }
};`
  },

  '23_Graph/03-number-of-islands.md': {
    python: `class Solution:
    def dfs(self, grid: list[list[str]], r: int, c: int) -> None:
        if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]) or grid[r][c] != '1':
            return
        grid[r][c] = '0'  # Mark visited
        self.dfs(grid, r + 1, c)
        self.dfs(grid, r - 1, c)
        self.dfs(grid, r, c + 1)
        self.dfs(grid, r, c - 1)

    def numIslands(self, grid: list[list[str]]) -> int:
        if not grid:
            return 0
        count = 0
        for r in range(len(grid)):
            for c in range(len(grid[0])):
                if grid[r][c] == '1':
                    count += 1
                    self.dfs(grid, r, c)
        return count`,
    cpp: `class Solution {
private:
    void dfs(vector<vector<char>>& grid, int r, int c) {
        if (r < 0 || r >= grid.size() || c < 0 || c >= grid[0].size() || grid[r][c] != '1') {
            return;
        }
        grid[r][c] = '0'; // Mark visited
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }

public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;
        int count = 0;
        for (int r = 0; r < grid.size(); r++) {
            for (int c = 0; c < grid[0].size(); c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }
};`
  },

  '25_DP/03-0-1-knapsack.md': {
    python: `class Solution:
    def helper(self, i: int, remaining: int, wt: list[int], val: list[int], n: int, memo: dict) -> int:
        if i == n or remaining == 0:
            return 0
        if (i, remaining) in memo:
            return memo[(i, remaining)]

        if wt[i] > remaining:
            memo[(i, remaining)] = self.helper(i + 1, remaining, wt, val, n, memo)
        else:
            include = val[i] + self.helper(i + 1, remaining - wt[i], wt, val, n, memo)
            exclude = self.helper(i + 1, remaining, wt, val, n, memo)
            memo[(i, remaining)] = max(include, exclude)

        return memo[(i, remaining)]

    def knapsack(self, W: int, wt: list[int], val: list[int], n: int) -> int:
        memo = {}
        return self.helper(0, W, wt, val, n, memo)`,
    cpp: `class Solution {
private:
    int helper(int i, int remaining, int wt[], int val[], int n, unordered_map<int, int>& memo, int W) {
        if (i == n || remaining == 0) return 0;
        int key = i * (W + 1) + remaining;
        if (memo.count(key)) return memo[key];

        if (wt[i] > remaining) {
            return memo[key] = helper(i + 1, remaining, wt, val, n, memo, W);
        } else {
            int include = val[i] + helper(i + 1, remaining - wt[i], wt, val, n, memo, W);
            int exclude = helper(i + 1, remaining, wt, val, n, memo, W);
            return memo[key] = max(include, exclude);
        }
    }

public:
    int knapsack(int W, int wt[], int val[], int n) {
        unordered_map<int, int> memo;
        return helper(0, W, wt, val, n, memo, W);
    }
};`
  },

  '25_DP/04-longest-common-subsequence.md': {
    python: `class Solution:
    def helper(self, i: int, j: int, s1: str, s2: str, memo: dict) -> int:
        if i == len(s1) or j == len(s2):
            return 0
        if (i, j) in memo:
            return memo[(i, j)]

        if s1[i] == s2[j]:
            memo[(i, j)] = 1 + self.helper(i + 1, j + 1, s1, s2, memo)
        else:
            memo[(i, j)] = max(
                self.helper(i + 1, j, s1, s2, memo),
                self.helper(i, j + 1, s1, s2, memo)
            )

        return memo[(i, j)]

    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        memo = {}
        return self.helper(0, 0, text1, text2, memo)`,
    cpp: `class Solution {
private:
    int helper(int i, int j, const string& s1, const string& s2, vector<vector<int>>& memo) {
        if (i == s1.length() || j == s2.length()) return 0;
        if (memo[i][j] != -1) return memo[i][j];

        if (s1[i] == s2[j]) {
            return memo[i][j] = 1 + helper(i + 1, j + 1, s1, s2, memo);
        } else {
            return memo[i][j] = max(
                helper(i + 1, j, s1, s2, memo),
                helper(i, j + 1, s1, s2, memo)
            );
        }
    }

public:
    int longestCommonSubsequence(string text1, string text2) {
        vector<vector<int>> memo(text1.length(), vector<int>(text2.length(), -1));
        return helper(0, 0, text1, text2, memo);
    }
};`
  },

  '25_DP/06-edit-distance.md': {
    python: `class Solution:
    def helper(self, i: int, j: int, s1: str, s2: str, memo: dict) -> int:
        if i == len(s1):
            return len(s2) - j
        if j == len(s2):
            return len(s1) - i
        if (i, j) in memo:
            return memo[(i, j)]

        if s1[i] == s2[j]:
            memo[(i, j)] = self.helper(i + 1, j + 1, s1, s2, memo)
        else:
            insert_op = self.helper(i, j + 1, s1, s2, memo)
            delete_op = self.helper(i + 1, j, s1, s2, memo)
            replace_op = self.helper(i + 1, j + 1, s1, s2, memo)
            memo[(i, j)] = 1 + min(insert_op, delete_op, replace_op)

        return memo[(i, j)]

    def minDistance(self, word1: str, word2: str) -> int:
        memo = {}
        return self.helper(0, 0, word1, word2, memo)`,
    cpp: `class Solution {
private:
    int helper(int i, int j, const string& s1, const string& s2, vector<vector<int>>& memo) {
        if (i == s1.length()) return s2.length() - j;
        if (j == s2.length()) return s1.length() - i;
        if (memo[i][j] != -1) return memo[i][j];

        if (s1[i] == s2[j]) {
            return memo[i][j] = helper(i + 1, j + 1, s1, s2, memo);
        } else {
            int insertOp = helper(i, j + 1, s1, s2, memo);
            int deleteOp = helper(i + 1, j, s1, s2, memo);
            int replaceOp = helper(i + 1, j + 1, s1, s2, memo);
            return memo[i][j] = 1 + min({insertOp, deleteOp, replaceOp});
        }
    }

public:
    int minDistance(string word1, string word2) {
        vector<vector<int>> memo(word1.length(), vector<int>(word2.length(), -1));
        return helper(0, 0, word1, word2, memo);
    }
};`
  }
};

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

module.exports = { specificRefactors, unnestHelperFunctions };

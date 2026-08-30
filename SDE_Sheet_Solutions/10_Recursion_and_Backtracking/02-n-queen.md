# 51. N-Queens

> **Difficulty:** Hard | **Topic:** Backtracking, Recursion | **Platform:** LeetCode

---

## Problem Statement
The n-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other. Given an integer `n`, return all distinct solutions to the n-queens puzzle. Each solution contains a distinct board configuration of the n-queens' placement, where `'Q'` and `'.'` both indicate a queen and an empty space, respectively.

## Examples
**Example 1:**
```
Input: n = 4
Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
```

**Example 2:**
```
Input: n = 1
Output: [["Q"]]
```

## Constraints
- 1 <= n <= 9

## Topic Tags
`Backtracking` `Recursion` `Array`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n!) |
| **Space** | O(n^2) |

## Intuition
The N-Queens problem requires placing N queens on an N×N chessboard such that no two queens threaten each other. We use backtracking to place queens row by row. For each row, we try placing a queen in each column and check if it's safe (no other queen in the same column, diagonal, or anti-diagonal). If safe, we place the queen and recurse to the next row. If we reach the last row, we've found a valid configuration.

## Approach
1. Use a recursive function that tries to place a queen in each row.
2. For each column in the current row, check if placing a queen is safe.
3. A position is safe if no other queen exists in the same column, upper-left diagonal, or upper-right diagonal.
4. Place the queen and recurse to the next row.
5. Backtrack by removing the queen if the recursion doesn't lead to a solution.
6. If all queens are placed, add the board configuration to the result.

## Brute Force
### Approach
Check every possible placement of N queens on the board and validate each configuration.
### Code
**Python**
```python
class Solution:
    def solveNQueens(self, n: int) -> list[list[str]]:
        result = []
        board = [['.' for _ in range(n)] for _ in range(n)]
        
        def is_safe(row, col):
            for i in range(row):
                if board[i][col] == 'Q':
                    return False
            i, j = row - 1, col - 1
            while i >= 0 and j >= 0:
                if board[i][j] == 'Q':
                    return False
                i -= 1
                j -= 1
            i, j = row - 1, col + 1
            while i >= 0 and j < n:
                if board[i][j] == 'Q':
                    return False
                i -= 1
                j += 1
            return True
        
        def backtrack(row):
            if row == n:
                result.append([''.join(r) for r in board])
                return
            for col in range(n):
                if is_safe(row, col):
                    board[row][col] = 'Q'
                    backtrack(row + 1)
                    board[row][col] = '.'
        
        backtrack(0)
        return result
```
**C++**
```cpp
class Solution {
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<vector<string>> result;
        vector<string> board(n, string(n, '.'));
        backtrack(board, 0, n, result);
        return result;
    }
    
    bool isSafe(vector<string>& board, int row, int col, int n) {
        for (int i = 0; i < row; i++)
            if (board[i][col] == 'Q') return false;
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--)
            if (board[i][j] == 'Q') return false;
        for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++)
            if (board[i][j] == 'Q') return false;
        return true;
    }
    
    void backtrack(vector<string>& board, int row, int n, vector<vector<string>>& result) {
        if (row == n) {
            result.push_back(board);
            return;
        }
        for (int col = 0; col < n; col++) {
            if (isSafe(board, row, col, n)) {
                board[row][col] = 'Q';
                backtrack(board, row + 1, n, result);
                board[row][col] = '.';
            }
        }
    }
};
```
### Complexity
- Time: O(n!) - trying each column for each row
- Space: O(n^2) - for the board

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def solveNQueens(self, n: int) -> list[list[str]]:
        result = []
        board = [['.' for _ in range(n)] for _ in range(n)]
        cols = set()
        diag1 = set()
        diag2 = set()
        
        def backtrack(row):
            if row == n:
                result.append([''.join(r) for r in board])
                return
            for col in range(n):
                if col in cols or (row - col) in diag1 or (row + col) in diag2:
                    continue
                cols.add(col)
                diag1.add(row - col)
                diag2.add(row + col)
                board[row][col] = 'Q'
                backtrack(row + 1)
                board[row][col] = '.'
                cols.remove(col)
                diag1.remove(row - col)
                diag2.remove(row + col)
        
        backtrack(0)
        return result
```
**C++**
```cpp
class Solution {
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<vector<string>> result;
        vector<string> board(n, string(n, '.'));
        unordered_set<int> cols, diag1, diag2;
        backtrack(board, 0, n, result, cols, diag1, diag2);
        return result;
    }
    
    void backtrack(vector<string>& board, int row, int n, vector<vector<string>>& result,
                   unordered_set<int>& cols, unordered_set<int>& diag1, unordered_set<int>& diag2) {
        if (row == n) {
            result.push_back(board);
            return;
        }
        for (int col = 0; col < n; col++) {
            if (cols.count(col) || diag1.count(row - col) || diag2.count(row + col))
                continue;
            cols.insert(col);
            diag1.insert(row - col);
            diag2.insert(row + col);
            board[row][col] = 'Q';
            backtrack(board, row + 1, n, result, cols, diag1, diag2);
            board[row][col] = '.';
            cols.erase(col);
            diag1.erase(row - col);
            diag2.erase(row + col);
        }
    }
};
```
### Complexity
- Time: O(n!) - backtracking with pruning
- Space: O(n) - for tracking columns and diagonals

## Key Insight
> Using sets to track occupied columns and diagonals allows O(1) safety checks, significantly pruning the search space compared to checking the board each time.

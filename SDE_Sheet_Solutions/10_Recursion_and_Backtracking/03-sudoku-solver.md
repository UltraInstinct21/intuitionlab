# 37. Sudoku Solver

> **Difficulty:** Hard | **Topic:** Backtracking, Recursion | **Platform:** LeetCode

---

## Problem Statement
Write a program to solve a Sudoku puzzle by filling the empty cells. A sudoku solution must satisfy all of the following rules: Each of the digits 1-9 must occur exactly once in each row, each column, and each of the nine 3x3 sub-boxes of the grid. The '.' character indicates empty cells.

## Examples
**Example 1:**
```
Input: board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]
Output: [["5","3","4","6","7","8","9","1","2"],["6","7","2","1","9","5","3","4","8"],["1","9","8","3","4","2","5","6","7"],["8","5","9","7","6","1","4","2","3"],["4","2","6","8","5","3","7","9","1"],["7","1","3","9","2","4","8","5","6"],["9","6","1","5","3","7","2","8","4"],["2","8","7","4","1","9","6","3","5"],["3","4","5","2","8","6","1","7","9"]]
```

## Constraints
- board.length == 9
- board[i].length == 9
- board[i][j] is a digit or '.'
- The input board is guaranteed to have a single unique solution.

## Topic Tags
`Backtracking` `Array` `Matrix`

## Expected Complexities
| | |
|---|---|
| **Time** | O(9^(m)) where m is number of empty cells |
| **Space** | O(m) - recursion stack |

## Intuition
We use backtracking to fill empty cells one by one. For each empty cell, we try digits 1-9 and check if the placement is valid according to Sudoku rules. If valid, we place the digit and recurse to the next empty cell. If no digit works, we backtrack and try the next option for the previous cell.

## Approach
1. Find the next empty cell (marked with '.').
2. If no empty cell is found, the puzzle is solved.
3. For each digit from '1' to '9', check if it's safe to place at the current position.
4. A digit is safe if it doesn't exist in the same row, column, or 3x3 sub-box.
5. Place the digit and recurse to solve the rest.
6. If the recursion returns false, remove the digit and try the next one.
7. If all digits are tried and none work, return false to trigger backtracking.

## Brute Force
### Approach
Try all possible digits for each empty cell and validate the board after each placement.
### Code
**Python**
```python
class Solution:
    def solveSudoku(self, board: list[list[str]]) -> None:
        def is_valid(board, row, col, num):
            for i in range(9):
                if board[row][i] == num:
                    return False
                if board[i][col] == num:
                    return False
            start_row, start_col = 3 * (row // 3), 3 * (col // 3)
            for i in range(3):
                for j in range(3):
                    if board[start_row + i][start_col + j] == num:
                        return False
            return True
        
        def solve(board):
            for i in range(9):
                for j in range(9):
                    if board[i][j] == '.':
                        for num in '123456789':
                            if is_valid(board, i, j, num):
                                board[i][j] = num
                                if solve(board):
                                    return True
                                board[i][j] = '.'
                        return False
            return True
        
        solve(board)
```
**C++**
```cpp
class Solution {
public:
    void solveSudoku(vector<vector<char>>& board) {
        solve(board);
    }
    
    bool solve(vector<vector<char>>& board) {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] == '.') {
                    for (char num = '1'; num <= '9'; num++) {
                        if (isValid(board, i, j, num)) {
                            board[i][j] = num;
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
    
    bool isValid(vector<vector<char>>& board, int row, int col, char num) {
        for (int i = 0; i < 9; i++) {
            if (board[row][i] == num) return false;
            if (board[i][col] == num) return false;
        }
        int startRow = 3 * (row / 3), startCol = 3 * (col / 3);
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++)
                if (board[startRow + i][startCol + j] == num) return false;
        return true;
    }
};
```
### Complexity
- Time: O(9^m) - m empty cells, each can have 9 options
- Space: O(m) - recursion depth

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def solveSudoku(self, board: list[list[str]]) -> None:
        rows = [set() for _ in range(9)]
        cols = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]
        empty = []
        
        for i in range(9):
            for j in range(9):
                if board[i][j] != '.':
                    num = board[i][j]
                    rows[i].add(num)
                    cols[j].add(num)
                    boxes[3 * (i // 3) + j // 3].add(num)
                else:
                    empty.append((i, j))
        
        def backtrack(idx):
            if idx == len(empty):
                return True
            row, col = empty[idx]
            box = 3 * (row // 3) + col // 3
            for num in '123456789':
                if num in rows[row] or num in cols[col] or num in boxes[box]:
                    continue
                board[row][col] = num
                rows[row].add(num)
                cols[col].add(num)
                boxes[box].add(num)
                if backtrack(idx + 1):
                    return True
                board[row][col] = '.'
                rows[row].remove(num)
                cols[col].remove(num)
                boxes[box].remove(num)
            return False
        
        backtrack(0)
```
**C++**
```cpp
class Solution {
public:
    void solveSudoku(vector<vector<char>>& board) {
        vector<unordered_set<char>> rows(9), cols(9), boxes(9);
        vector<pair<int,int>> empty;
        
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] != '.') {
                    char num = board[i][j];
                    rows[i].insert(num);
                    cols[j].insert(num);
                    boxes[3 * (i / 3) + j / 3].insert(num);
                } else {
                    empty.push_back({i, j});
                }
            }
        }
        
        function<bool(int)> backtrack = [&](int idx) -> bool {
            if (idx == empty.size()) return true;
            auto [row, col] = empty[idx];
            int box = 3 * (row / 3) + col / 3;
            for (char num = '1'; num <= '9'; num++) {
                if (rows[row].count(num) || cols[col].count(num) || boxes[box].count(num))
                    continue;
                board[row][col] = num;
                rows[row].insert(num);
                cols[col].insert(num);
                boxes[box].insert(num);
                if (backtrack(idx + 1)) return true;
                board[row][col] = '.';
                rows[row].erase(num);
                cols[col].erase(num);
                boxes[box].erase(num);
            }
            return false;
        };
        
        backtrack(0);
    }
};
```
### Complexity
- Time: O(9^m) - backtracking with constraint propagation
- Space: O(m + 27) - for tracking sets and empty cells list

## Key Insight
> Pre-computing which digits are already used in each row, column, and box allows O(1) validity checks, avoiding repeated scanning of the board during backtracking.

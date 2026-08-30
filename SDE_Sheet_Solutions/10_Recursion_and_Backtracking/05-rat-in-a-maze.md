# Rat in a Maze

> **Difficulty:** Hard | **Topic:** Backtracking, Recursion | **Platform:** GeeksforGeeks

---

## Problem Statement
Given an N x N maze where some cells are blocked (0) and some are open (1), find all possible paths from the top-left corner to the bottom-right corner. The rat can move in four directions: Up (U), Down (D), Left (L), Right (R). The rat cannot visit the same cell more than once in a path.

## Examples
**Example 1:**
```
Input: maze = [[1,0,0,0],[1,1,0,1],[0,1,0,0],[1,1,1,1]]
Output: ["DRDRRD"]
```

**Example 2:**
```
Input: maze = [[1,1],[1,1]]
Output: ["DR", "RD"]
```

## Constraints
- 1 <= N <= 10
- maze[i][j] is either 0 or 1
- maze[0][0] = 1 and maze[N-1][N-1] = 1

## Topic Tags
`Backtracking` `Matrix` `Recursion`

## Expected Complexities
| | |
|---|---|
| **Time** | O(4^(N*N)) |
| **Space** | O(N*N) - recursion stack and visited matrix |

## Intuition
The rat needs to find all paths from source to destination in a maze. We use backtracking to explore all possible moves from each cell. At each cell, we try moving in all four directions (Down, Left, Right, Up) if the move is valid (within bounds, not blocked, and not visited). We mark cells as visited to avoid cycles and unmark them during backtracking.

## Approach
1. Create a visited matrix to track which cells have been visited.
2. Define directions: Down, Left, Right, Up with their corresponding characters.
3. Start from (0,0) and recursively try all four directions.
4. For each direction, check if the new position is valid (within bounds, not blocked, not visited).
5. If valid, mark the cell as visited and recurse with the updated path.
6. If we reach the destination (N-1, N-1), add the path to the result.
7. Backtrack by unmarking the cell.

## Brute Force
### Approach
Explore all possible paths using DFS and collect valid paths to the destination.
### Code
**Python**
```python
class Solution:
    def findPath(self, maze, n):
        if maze[0][0] == 0 or maze[n-1][n-1] == 0:
            return []
        
        result = []
        visited = [[False for _ in range(n)] for _ in range(n)]
        directions = [('D', 1, 0), ('L', 0, -1), ('R', 0, 1), ('U', -1, 0)]
        
        def solve(row, col, path):
            if row == n - 1 and col == n - 1:
                result.append(path)
                return
            visited[row][col] = True
            for d, dr, dc in directions:
                new_row, new_col = row + dr, col + dc
                if (0 <= new_row < n and 0 <= new_col < n and 
                    maze[new_row][new_col] == 1 and not visited[new_row][new_col]):
                    solve(new_row, new_col, path + d)
            visited[row][col] = False
        
        solve(0, 0, "")
        return sorted(result)
```
**C++**
```cpp
class Solution {
public:
    vector<string> findPath(vector<vector<int>>& maze, int n) {
        if (maze[0][0] == 0 || maze[n-1][n-1] == 0)
            return {};
        
        vector<string> result;
        vector<vector<bool>> visited(n, vector<bool>(n, false));
        vector<pair<char, pair<int,int>>> directions = {
            {'D', {1, 0}}, {'L', {0, -1}}, {'R', {0, 1}}, {'U', {-1, 0}}
        };
        
        function<void(int, int, string)> solve = [&](int row, int col, string path) {
            if (row == n - 1 && col == n - 1) {
                result.push_back(path);
                return;
            }
            visited[row][col] = true;
            for (auto& [d, dir] : directions) {
                int new_row = row + dir.first;
                int new_col = col + dir.second;
                if (new_row >= 0 && new_row < n && new_col >= 0 && new_col < n &&
                    maze[new_row][new_col] == 1 && !visited[new_row][new_col]) {
                    solve(new_row, new_col, path + d);
                }
            }
            visited[row][col] = false;
        };
        
        solve(0, 0, "");
        return result;
    }
};
```
### Complexity
- Time: O(4^(N*N)) - exploring all possible paths
- Space: O(N*N) - for visited matrix and recursion stack

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def findPath(self, maze, n):
        if maze[0][0] == 0 or maze[n-1][n-1] == 0:
            return []
        
        result = []
        visited = [[False for _ in range(n)] for _ in range(n)]
        
        def solve(row, col, path):
            if row == n - 1 and col == n - 1:
                result.append(path)
                return
            visited[row][col] = True
            
            if row + 1 < n and maze[row + 1][col] == 1 and not visited[row + 1][col]:
                solve(row + 1, col, path + 'D')
            if col - 1 >= 0 and maze[row][col - 1] == 1 and not visited[row][col - 1]:
                solve(row, col - 1, path + 'L')
            if col + 1 < n and maze[row][col + 1] == 1 and not visited[row][col + 1]:
                solve(row, col + 1, path + 'R')
            if row - 1 >= 0 and maze[row - 1][col] == 1 and not visited[row - 1][col]:
                solve(row - 1, col, path + 'U')
            
            visited[row][col] = False
        
        solve(0, 0, "")
        return sorted(result)
```
**C++**
```cpp
class Solution {
public:
    vector<string> findPath(vector<vector<int>>& maze, int n) {
        if (maze[0][0] == 0 || maze[n-1][n-1] == 0)
            return {};
        
        vector<string> result;
        vector<vector<bool>> visited(n, vector<bool>(n, false));
        
        function<void(int, int, string)> solve = [&](int row, int col, string path) {
            if (row == n - 1 && col == n - 1) {
                result.push_back(path);
                return;
            }
            visited[row][col] = true;
            
            if (row + 1 < n && maze[row + 1][col] == 1 && !visited[row + 1][col])
                solve(row + 1, col, path + 'D');
            if (col - 1 >= 0 && maze[row][col - 1] == 1 && !visited[row][col - 1])
                solve(row, col - 1, path + 'L');
            if (col + 1 < n && maze[row][col + 1] == 1 && !visited[row][col + 1])
                solve(row, col + 1, path + 'R');
            if (row - 1 >= 0 && maze[row - 1][col] == 1 && !visited[row - 1][col])
                solve(row - 1, col, path + 'U');
            
            visited[row][col] = false;
        };
        
        solve(0, 0, "");
        return result;
    }
};
```
### Complexity
- Time: O(4^(N*N)) - backtracking with visited check
- Space: O(N*N) - for visited matrix

## Key Insight
> Marking cells as visited before recursing and unmarking after backtracking prevents revisiting cells, ensuring each path is valid and avoiding infinite loops.

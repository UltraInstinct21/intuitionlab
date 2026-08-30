# 1091. Shortest Path in a Binary Matrix

> **Difficulty:** Hard | **Topic:** Graph, BFS, Matrix | **Platform:** LeetCode

---

## Problem Statement
Given an `n x n` binary matrix `grid`, return the length of the shortest clear path in the matrix. If there is no clear path, return `-1`.

A clear path is a path from the top-left cell `(0, 0)` to the bottom-right cell `(n - 1, n - 1)` such that:
- All the visited cells of the path are `0`.
- All the adjacent cells of the path are 8-directionally connected (i.e., they differ by at most one cell in either row or column).
- The path does not include any diagonal.

The length of a clear path is the number of visited cells of this path.

## Examples
**Example 1:**
```
Input: grid = [[0,1],[1,0]]
Output: 2
Explanation: (0,0) -> (1,1) is a valid path of length 2.
```

**Example 2:**
```
Input: grid = [[0,0,0],[1,1,0],[1,1,0]]
Output: 4
```

## Constraints
- `n == grid.length`
- `n == grid[i].length`
- `1 <= n <= 100`
- `grid[i][j] is 0 or 1`

## Topic Tags
`BFS` `Matrix` `Graph` `Shortest-Path`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n^2) |
| **Space** | O(n^2) |

## Intuition
Since we want the shortest path in an unweighted grid, BFS is the natural choice. BFS explores all cells at distance `d` before moving to distance `d+1`, so the first time we reach the bottom-right cell, we have found the shortest path. We explore in 8 directions from each cell, and we mark visited cells to avoid revisiting.

## Approach
1. Check if the start or end cell is blocked (value 1). If so, return -1.
2. Use BFS starting from `(0, 0)` with distance 1.
3. For each cell, try all 8 directions. If a neighbor is valid (within bounds, value 0, not visited), add it to the queue with distance + 1.
4. If we reach `(n-1, n-1)`, return the distance.
5. If BFS completes without reaching the target, return -1.

## Brute Force
### Approach
Use DFS to explore all possible paths and track the minimum length. Very slow due to exponential paths.
### Code
**Python**
```python
class Solution:
    def shortestPathBinaryMatrix(self, grid):
        n = len(grid)
        if grid[0][0] == 1 or grid[n-1][n-1] == 1:
            return -1

        directions = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
        visited = set()

        def dfs(r, c):
            if r == n - 1 and c == n - 1:
                return 1
            visited.add((r, c))
            best = float('inf')
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0 and (nr, nc) not in visited:
                    result = dfs(nr, nc)
                    best = min(best, result + 1)
            visited.remove((r, c))
            return best

        result = dfs(0, 0)
        return result if result != float('inf') else -1
```
**C++**
```cpp
class Solution {
public:
    int n;
    int dirs[8][2] = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};

    int dfs(vector<vector<int>>& grid, int r, int c, vector<vector<bool>>& visited) {
        if (r == n-1 && c == n-1) return 1;
        visited[r][c] = true;
        int best = INT_MAX;
        for (auto& [dr, dc] : dirs) {
            int nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0 && !visited[nr][nc]) {
                int res = dfs(grid, nr, nc, visited);
                if (res != INT_MAX) best = min(best, res + 1);
            }
        }
        visited[r][c] = false;
        return best;
    }

    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        n = grid.size();
        if (grid[0][0] == 1 || grid[n-1][n-1] == 1) return -1;
        vector<vector<bool>> visited(n, vector<bool>(n, false));
        int result = dfs(grid, 0, 0, visited);
        return result == INT_MAX ? -1 : result;
    }
};
```
### Complexity
- **Time:** O(8^(n^2)) — exponential, exploring all paths
- **Space:** O(n^2) — recursion stack + visited set

## Optimized Solution
### Code
**Python**
```python
from collections import deque

class Solution:
    def shortestPathBinaryMatrix(self, grid):
        n = len(grid)
        if grid[0][0] == 1 or grid[n-1][n-1] == 1:
            return -1

        directions = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
        queue = deque([(0, 0, 1)])
        visited = {(0, 0)}

        while queue:
            r, c, dist = queue.popleft()
            if r == n - 1 and c == n - 1:
                return dist

            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0 and (nr, nc) not in visited:
                    visited.add((nr, nc))
                    queue.append((nr, nc, dist + 1))

        return -1
```
**C++**
```cpp
class Solution {
public:
    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        int n = grid.size();
        if (grid[0][0] == 1 || grid[n-1][n-1] == 1) return -1;

        int dirs[8][2] = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
        queue<tuple<int,int,int>> q;
        q.push({0, 0, 1});
        vector<vector<bool>> visited(n, vector<bool>(n, false));
        visited[0][0] = true;

        while (!q.empty()) {
            auto [r, c, dist] = q.front();
            q.pop();
            if (r == n-1 && c == n-1) return dist;

            for (auto& [dr, dc] : dirs) {
                int nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0 && !visited[nr][nc]) {
                    visited[nr][nc] = true;
                    q.push({nr, nc, dist + 1});
                }
            }
        }
        return -1;
    }
};
```
### Complexity
- **Time:** O(n^2) — each cell visited at most once
- **Space:** O(n^2) — queue + visited set

## Key Insight
> BFS guarantees the shortest path in an unweighted grid. The moment we dequeue the target cell, we have the answer — no need to continue. Marking cells as visited when enqueued (not dequeued) avoids redundant processing.

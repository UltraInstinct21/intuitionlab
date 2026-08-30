# Rotten Oranges

> **Difficulty:** Medium | **Topic:** BFS, Queue, Matrix | **Platform:** LeetCode 994

---

## Problem Statement
You are given an m x n grid where each cell can have one of three values: 0 (empty), 1 (fresh orange), or 2 (rotten orange). Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.

## Examples
**Example 1:**
```
Input: grid = [[2,1,1],[1,1,0],[0,1,1]]
Output: 4
```

**Example 2:**
```
Input: grid = [[2,1,1],[0,1,1],[1,0,1]]
Output: -1
```

## Constraints
- m == grid.length
- n == grid[0].length
- 1 ≤ m, n ≤ 10
- grid[i][j] is 0, 1, or 2

## Topic Tags
`BFS` `Queue` `Matrix`

## Expected Complexities
| | |
|---|---|
| **Time** | O(M × N) |
| **Space** | O(M × N) |

## Intuition
This is a multi-source BFS problem. All initially rotten oranges start BFS simultaneously, and each level of BFS represents one minute. The answer is the maximum BFS level reached.

## Approach
1. Initialize a queue with all initially rotten oranges.
2. Perform BFS: for each orange in the queue, rot all adjacent fresh oranges.
3. Track the time (BFS level).
4. After BFS, check if any fresh oranges remain.

## Brute Force
### Approach
Simulate minute by minute, scanning the entire grid each time.

### Code
**Python**
```python
def orangesRotting(grid):
    from collections import deque
    m, n = len(grid), len(grid[0])
    minutes = 0
    while True:
        changed = False
        new_grid = [row[:] for row in grid]
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 2:
                    for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
                        ni, nj = i + dx, j + dy
                        if 0 <= ni < m and 0 <= nj < n and new_grid[ni][nj] == 1:
                            new_grid[ni][nj] = 2
                            changed = True
        if not changed:
            break
        grid = new_grid
        minutes += 1
    for row in grid:
        if 1 in row:
            return -1
    return minutes
```

**C++**
```cpp
int orangesRotting(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    int minutes = 0;
    while (true) {
        bool changed = false;
        auto newGrid = grid;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) {
                    for (auto [dx, dy] : vector<pair<int,int>>{{-1,0},{1,0},{0,-1},{0,1}}) {
                        int ni = i + dx, nj = j + dy;
                        if (ni >= 0 && ni < m && nj >= 0 && nj < n && newGrid[ni][nj] == 1) {
                            newGrid[ni][nj] = 2;
                            changed = true;
                        }
                    }
                }
            }
        }
        if (!changed) break;
        grid = newGrid;
        minutes++;
    }
    for (auto& row : grid)
        for (int v : row)
            if (v == 1) return -1;
    return minutes;
}
```

### Complexity
- **Time:** O(M × N × min(M, N))
- **Space:** O(M × N)

## Optimized Solution
### Code
**Python**
```python
from collections import deque

def orangesRotting(grid):
    m, n = len(grid), len(grid[0])
    queue = deque()
    fresh = 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 2:
                queue.append((i, j))
            elif grid[i][j] == 1:
                fresh += 1
    if fresh == 0:
        return 0
    minutes = 0
    directions = [(-1,0),(1,0),(0,-1),(0,1)]
    while queue:
        minutes += 1
        for _ in range(len(queue)):
            x, y = queue.popleft()
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if 0 <= nx < m and 0 <= ny < n and grid[nx][ny] == 1:
                    grid[nx][ny] = 2
                    fresh -= 1
                    queue.append((nx, ny))
    return minutes - 1 if fresh == 0 else -1
```

**C++**
```cpp
int orangesRotting(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    queue<pair<int,int>> q;
    int fresh = 0;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == 2) q.push({i, j});
            else if (grid[i][j] == 1) fresh++;
        }
    }
    if (fresh == 0) return 0;
    int minutes = 0;
    vector<pair<int,int>> dirs = {{-1,0},{1,0},{0,-1},{0,1}};
    while (!q.empty()) {
        minutes++;
        int sz = q.size();
        while (sz--) {
            auto [x, y] = q.front(); q.pop();
            for (auto [dx, dy] : dirs) {
                int nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] == 1) {
                    grid[nx][ny] = 2;
                    fresh--;
                    q.push({nx, ny});
                }
            }
        }
    }
    return fresh == 0 ? minutes - 1 : -1;
}
```

### Complexity
- **Time:** O(M × N)
- **Space:** O(M × N)

## Key Insight
> Perform multi-source BFS from all initially rotten oranges simultaneously; each BFS level represents one minute of rotting.

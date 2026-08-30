# 200. Number of Islands

> **Difficulty:** Medium | **Topic:** DFS, BFS, Union-Find, Matrix | **Platform:** LeetCode

---

## Problem Statement
Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

## Examples
**Example 1:**
```
Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1
```

**Example 2:**
```
Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3
```

## Constraints
- m == grid.length
- n == grid[i].length
- 1 <= m, n <= 300
- grid[i][j] is '0' or '1'.

## Topic Tags
`DFS` `BFS` `Union-Find` `Matrix`

## Expected Complexities
| | |
|---|---|
| **Time** | O(m * n) |
| **Space** | O(m * n) |

## Intuition
An island is a connected component of '1's. We need to count how many connected components exist in the grid. We can traverse the grid, and whenever we find an unvisited '1', we start a DFS/BFS to mark all connected '1's as visited, incrementing our island count.

## Approach
1. Initialize island count to 0
2. Iterate through each cell in the grid
3. When encountering a '1' (unvisited land):
   - Increment island count
   - Use DFS/BFS to mark all connected '1's as visited (change to '0' or use visited set)
4. Return the count

## Brute Force
### Approach
Without modifying the grid or using a visited set, we would repeatedly visit the same cells, leading to incorrect counts. We need a way to track which cells have been visited.

### Code
**Python**
```python
# Brute force without visited tracking - will count same island multiple times
class Solution:
    def numIslands(self, grid):
        if not grid:
            return 0
        
        count = 0
        for i in range(len(grid)):
            for j in range(len(grid[0])):
                if grid[i][j] == '1':
                    count += 1
                    # This DFS would keep going forever without visited set
                    self.dfs(grid, i, j)
        return count
    
    def dfs(self, grid, i, j):
        if i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]) or grid[i][j] == '0':
            return
        grid[i][j] = '0'  # Mark as visited by changing to water
        self.dfs(grid, i-1, j)
        self.dfs(grid, i+1, j)
        self.dfs(grid, i, j-1)
        self.dfs(grid, i, j+1)
```

**C++**
```cpp
// Brute force - works but modifies input
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;
        
        int count = 0;
        for (int i = 0; i < grid.size(); i++) {
            for (int j = 0; j < grid[0].size(); j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j);
                }
            }
        }
        return count;
    }
    
    void dfs(vector<vector<char>>& grid, int i, int j) {
        if (i < 0 || i >= grid.size() || j < 0 || j >= grid[0].size() || grid[i][j] == '0')
            return;
        
        grid[i][j] = '0';
        dfs(grid, i-1, j);
        dfs(grid, i+1, j);
        dfs(grid, i, j-1);
        dfs(grid, i, j+1);
    }
};
```

### Complexity
- Time: O(m * n) - each cell visited once
- Space: O(m * n) - recursion stack in worst case

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        if not grid:
            return 0
        
        rows, cols = len(grid), len(grid[0])
        count = 0
        
        def dfs(i, j):
            if i < 0 or i >= rows or j < 0 or j >= cols or grid[i][j] == '0':
                return
            grid[i][j] = '0'
            dfs(i-1, j)
            dfs(i+1, j)
            dfs(i, j-1)
            dfs(i, j+1)
        
        for i in range(rows):
            for j in range(cols):
                if grid[i][j] == '1':
                    count += 1
                    dfs(i, j)
        
        return count
```

**C++**
```cpp
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;
        
        int rows = grid.size(), cols = grid[0].size();
        int count = 0;
        
        function<void(int, int)> dfs = [&](int i, int j) {
            if (i < 0 || i >= rows || j < 0 || j >= cols || grid[i][j] == '0')
                return;
            grid[i][j] = '0';
            dfs(i-1, j);
            dfs(i+1, j);
            dfs(i, j-1);
            dfs(i, j+1);
        };
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(i, j);
                }
            }
        }
        
        return count;
    }
};
```

### Complexity
- Time: O(m * n) - each cell is visited exactly once
- Space: O(m * n) - worst case recursion stack when all cells are land

## Key Insight
> Each connected component of '1's represents one island. By using DFS to mark visited land as '0' (water), we avoid revisiting cells and ensure each island is counted exactly once.
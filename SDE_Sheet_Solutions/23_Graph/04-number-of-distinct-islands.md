# 694. Number of Distinct Islands

> **Difficulty:** Hard | **Topic:** DFS, BFS, Hashing, Matrix | **Platform:** LeetCode

---

## Problem Statement
You are given an m x n binary matrix grid. An island is a group of 1's (representing land) connected 4-directionally (horizontal or vertical). You may assume all four edges of the grid are surrounded by water.

An island is considered to be the same as another if and only if one island can be translated (and not rotated or reflected) to equal the other. Return the number of distinct islands.

## Examples
**Example 1:**
```
Input: grid = [[1,1,0,0,0],[1,1,0,0,0],[0,0,0,1,1],[0,0,0,1,1]]
Output: 1
Explanation: Both islands are the same shape when translated.
```

**Example 2:**
```
Input: grid = [[1,1,0,1,1],[1,0,0,0,0],[0,0,0,0,1],[1,1,0,1,1]]
Output: 3
Explanation: There are 3 distinct islands.
```

## Constraints
- m == grid.length
- n == grid[i].length
- 1 <= m, n <= 50
- grid[i][j] is either 0 or 1.

## Topic Tags
`DFS` `BFS` `Hashing` `Matrix`

## Expected Complexities
| | |
|---|---|
| **Time** | O(m * n) |
| **Space** | O(m * n) |

## Intuition
To determine if two islands are the same, we need to capture their shape. One approach is to record the path taken during DFS relative to the starting point. If two islands produce the same sequence of moves, they have the same shape.

## Approach
1. Use DFS to explore each island
2. Record the path as a sequence of directions (e.g., "RRDDLLU")
3. Use a hash set to store unique path signatures
4. Return the size of the hash set

## Brute Force
### Approach
Compare each island with every other island by translating them to a common origin and checking if their shapes match. This is inefficient with high time complexity.

### Code
**Python**
```python
# Brute force - compare all pairs of islands
class Solution:
    def numDistinctIslands(self, grid):
        if not grid:
            return 0
        
        islands = []
        
        def dfs(i, j, path, start_i, start_j):
            if i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]) or grid[i][j] == 0:
                return
            grid[i][j] = 0
            path.append((i - start_i, j - start_j))
            dfs(i-1, j, path, start_i, start_j)
            dfs(i+1, j, path, start_i, start_j)
            dfs(i, j-1, path, start_i, start_j)
            dfs(i, j+1, path, start_i, start_j)
        
        for i in range(len(grid)):
            for j in range(len(grid[0])):
                if grid[i][j] == 1:
                    path = []
                    dfs(i, j, path, i, j)
                    if path not in islands:
                        islands.append(path)
        
        return len(islands)
```

**C++**
```cpp
// Brute force - O(n^4) time complexity
class Solution {
public:
    int numDistinctIslands(vector<vector<int>>& grid) {
        if (grid.empty()) return 0;
        
        vector<vector<pair<int,int>>> islands;
        
        function<void(int, int, vector<pair<int,int>>&, int, int)> dfs = 
            [&](int i, int j, vector<pair<int,int>>& path, int start_i, int start_j) {
            if (i < 0 || i >= grid.size() || j < 0 || j >= grid[0].size() || grid[i][j] == 0)
                return;
            grid[i][j] = 0;
            path.push_back({i - start_i, j - start_j});
            dfs(i-1, j, path, start_i, start_j);
            dfs(i+1, j, path, start_i, start_j);
            dfs(i, j-1, path, start_i, start_j);
            dfs(i, j+1, path, start_i, start_j);
        };
        
        for (int i = 0; i < grid.size(); i++) {
            for (int j = 0; j < grid[0].size(); j++) {
                if (grid[i][j] == 1) {
                    vector<pair<int,int>> path;
                    dfs(i, j, path, i, j);
                    if (find(islands.begin(), islands.end(), path) == islands.end()) {
                        islands.push_back(path);
                    }
                }
            }
        }
        
        return islands.size();
    }
};
```

### Complexity
- Time: O(m * n * k) where k is the number of islands
- Space: O(m * n)

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def numDistinctIslands(self, grid: list[list[int]]) -> int:
        if not grid:
            return 0
        
        rows, cols = len(grid), len(grid[0])
        distinct_islands = set()
        
        def dfs(i, j, path, start_i, start_j):
            if i < 0 or i >= rows or j < 0 or j >= cols or grid[i][j] == 0:
                return '#'
            
            grid[i][j] = 0
            path += 'D' + dfs(i+1, j, path, start_i, start_j)
            path += 'U' + dfs(i-1, j, path, start_i, start_j)
            path += 'R' + dfs(i, j+1, path, start_i, start_j)
            path += 'L' + dfs(i, j-1, path, start_i, start_j)
            return path
        
        for i in range(rows):
            for j in range(cols):
                if grid[i][j] == 1:
                    path = dfs(i, j, '', i, j)
                    distinct_islands.add(path)
        
        return len(distinct_islands)
```

**C++**
```cpp
class Solution {
public:
    int numDistinctIslands(vector<vector<int>>& grid) {
        if (grid.empty()) return 0;
        
        int rows = grid.size(), cols = grid[0].size();
        set<string> distinct_islands;
        
        function<string(int, int)> dfs = [&](int i, int j) -> string {
            if (i < 0 || i >= rows || j < 0 || j >= cols || grid[i][j] == 0)
                return "#";
            
            grid[i][j] = 0;
            string path = "D" + dfs(i+1, j) + "U" + dfs(i-1, j) + 
                         "R" + dfs(i, j+1) + "L" + dfs(i, j-1);
            return path;
        };
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (grid[i][j] == 1) {
                    distinct_islands.insert(dfs(i, j));
                }
            }
        }
        
        return distinct_islands.size();
    }
};
```

### Complexity
- Time: O(m * n) - each cell visited once, string operations are bounded
- Space: O(m * n) - for the set and recursion stack

## Key Insight
> By recording the DFS path as a string of directions (U/D/L/R), we can uniquely identify the shape of each island. Two islands with identical path strings are the same shape.
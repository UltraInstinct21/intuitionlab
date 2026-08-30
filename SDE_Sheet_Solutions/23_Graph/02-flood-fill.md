# 733. Flood Fill

> **Difficulty:** Easy | **Topic:** DFS, BFS, Matrix | **Platform:** LeetCode

---

## Problem Statement
An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image. You are also given three integers sr, sc, and newColor. You should perform a flood fill on the image starting from the pixel image[sr][sc].

To perform a flood fill, consider the initial pixel value, plus any pixels connected 4-directionally to the initial pixel with the same color as the initial pixel, and then recursively color those pixels with the newColor. You do not need to return the image.

## Examples
**Example 1:**
```
Input: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, newColor = 2
Output: [[2,2,2],[2,2,0],[2,0,1]]
Explanation: From the center of the image (with position (sr, sc) = (1, 1)), all pixels that are connected by the same color and the same color as the starting pixel are colored with the new color.
```

**Example 2:**
```
Input: image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, newColor = 0
Output: [[0,0,0],[0,0,0]]
Explanation: The starting pixel is already the new color 0, so no change is made.
```

## Constraints
- m == image.length
- n == image[i].length
- 1 <= m, n <= 50
- 0 <= image[i][j], newColor < 2^16
- 0 <= sr < m
- 0 <= sc < n

## Topic Tags
`DFS` `BFS` `Matrix`

## Expected Complexities
| | |
|---|---|
| **Time** | O(m * n) |
| **Space** | O(m * n) |

## Intuition
Flood fill is essentially a graph traversal problem where each pixel is a node and adjacent pixels with the same color are edges. We can use either DFS or BFS to explore all connected pixels of the same color and change them to the new color. The key is to avoid revisiting pixels that have already been processed.

## Approach
1. Get the original color of the starting pixel
2. If original color equals newColor, return (no change needed)
3. Use DFS/BFS starting from (sr, sc)
4. For each pixel, check if it's within bounds and has the original color
5. Change color and recursively/explore all 4-directional neighbors

## Brute Force
### Approach
Without using a visited set, we could end up revisiting pixels and creating infinite loops. We need to track visited pixels or use the color change itself as a marker.

### Code
**Python**
```python
# Brute force without proper visited tracking (will cause infinite loop)
class Solution:
    def floodFill(self, image, sr, sc, newColor):
        # This would cause stack overflow due to cycles
        def dfs(i, j):
            if image[i][j] == originalColor:
                image[i][j] = newColor
                if i > 0: dfs(i-1, j)
                if i < len(image)-1: dfs(i+1, j)
                if j > 0: dfs(i, j-1)
                if j < len(image[0])-1: dfs(i, j+1)
        
        originalColor = image[sr][sc]
        dfs(sr, sc)
        return image
```

**C++**
```cpp
// Brute force - works but not optimal due to potential stack overflow
class Solution {
public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int newColor) {
        int originalColor = image[sr][sc];
        if (originalColor == newColor) return image;
        
        function<void(int, int)> dfs = [&](int i, int j) {
            if (i < 0 || i >= image.size() || j < 0 || j >= image[0].size())
                return;
            if (image[i][j] != originalColor) return;
            
            image[i][j] = newColor;
            dfs(i-1, j);
            dfs(i+1, j);
            dfs(i, j-1);
            dfs(i, j+1);
        };
        
        dfs(sr, sc);
        return image;
    }
};
```

### Complexity
- Time: O(m * n) - in worst case, visits all pixels
- Space: O(m * n) - recursion stack in worst case

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def floodFill(self, image: list[list[int]], sr: int, sc: int, newColor: int) -> list[list[int]]:
        originalColor = image[sr][sc]
        if originalColor == newColor:
            return image
        
        rows, cols = len(image), len(image[0])
        
        def dfs(i, j):
            if i < 0 or i >= rows or j < 0 or j >= cols:
                return
            if image[i][j] != originalColor:
                return
            
            image[i][j] = newColor
            dfs(i-1, j)
            dfs(i+1, j)
            dfs(i, j-1)
            dfs(i, j+1)
        
        dfs(sr, sc)
        return image
```

**C++**
```cpp
class Solution {
public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int newColor) {
        int originalColor = image[sr][sc];
        if (originalColor == newColor) return image;
        
        int rows = image.size(), cols = image[0].size();
        
        function<void(int, int)> dfs = [&](int i, int j) {
            if (i < 0 || i >= rows || j < 0 || j >= cols) return;
            if (image[i][j] != originalColor) return;
            
            image[i][j] = newColor;
            dfs(i-1, j);
            dfs(i+1, j);
            dfs(i, j-1);
            dfs(i, j+1);
        };
        
        dfs(sr, sc);
        return image;
    }
};
```

### Complexity
- Time: O(m * n) - each pixel is visited at most once
- Space: O(m * n) - worst case recursion stack depth

## Key Insight
> The key insight is to check if the original color equals the newColor before starting - if they're the same, no flood fill is needed. The color change itself acts as a visited marker.
# 174. Dungeon Game

> **Difficulty:** Hard | **Topic:** Dynamic Programming | **Platform:** LeetCode

---

## Problem Statement
The demons had captured the princess and imprisoned her in the bottom-right corner of a dungeon. The dungeon consists of `m x n` rooms laid out in a 2D grid. The knight starts at the top-left corner and must fight his way to the princess. The knight has an initial health point represented by a positive integer. If at any point his health point drops to 0 or below, he dies immediately.

Some rooms are guarded by demons, so the knight loses health (negative integers) upon entering these rooms; other rooms are either empty (0's) or contain magic orbs that increase the knight's health (positive integers). In order to reach the princess as quickly as possible, the knight decides to move only rightward or downward in each step.

Return the knight's minimum initial health so that he is able to rescue the princess.

## Examples
**Example 1:**
```
Input: dungeon = [[-2,-3,3],[-5,-10,1],[10,30,-5]]
Output: 7
Explanation: The initial health of the knight must be at least 7 if he follows the optimal path:
RIGHT-> RIGHT -> DOWN -> DOWN.
```

**Example 2:**
```
Input: dungeon = [[0]]
Output: 1
```

## Constraints
- m == dungeon.length
- n == dungeon[i].length
- 1 ≤ m, n ≤ 200
- -1000 ≤ dungeon[i][j] ≤ 1000

## Topic Tags
`Array` `Dynamic Programming` `Matrix`

## Expected Complexities
| | |
|---|---|
| **Time** | O(m × n) |
| **Space** | O(m × n) or O(n) with optimization |

## Intuition
The key insight is to work backwards from the princess (bottom-right). At each cell, we need to know the minimum health needed to reach the princess from that cell. If the current cell has negative value, we need more health before entering. If positive, we might need less (but at least 1).

`dp[i][j]` = minimum health needed to start at cell (i,j) and reach the princess.

## Approach
1. Start from princess cell (m-1, n-1)
2. At each cell, calculate minimum health needed based on right and bottom cells
3. Formula: `dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j])`
4. The max(1, ...) ensures health never drops to 0 or below

## Step 1: Recursion
### Code
**Python**
```python
def calculateMinimumHP(dungeon):
    m, n = len(dungeon), len(dungeon[0])
    
    def solve(i, j):
        if i == m - 1 and j == n - 1:
            return max(1, 1 - dungeon[i][j])
        
        if i >= m or j >= n:
            return float('inf')
        
        right = solve(i, j + 1)
        down = solve(i + 1, j)
        
        minHealthNeeded = min(right, down) - dungeon[i][j]
        return max(1, minHealthNeeded)
    
    return solve(0, 0)
```

**C++**
```cpp
class Solution {
public:
    int solve(int i, int j, vector<vector<int>>& dungeon) {
        int m = dungeon.size(), n = dungeon[0].size();
        
        if (i == m - 1 && j == n - 1) {
            return max(1, 1 - dungeon[i][j]);
        }
        
        if (i >= m || j >= n) return INT_MAX;
        
        int right = solve(i, j + 1, dungeon);
        int down = solve(i + 1, j, dungeon);
        
        int minHealthNeeded = min(right, down) - dungeon[i][j];
        return max(1, minHealthNeeded);
    }
    
    int calculateMinimumHP(vector<vector<int>>& dungeon) {
        return solve(0, 0, dungeon);
    }
};
```
### Complexity
- **Time:** O(2^(m+n)) - exponential
- **Space:** O(m + n) - recursion stack

## Step 2: Memoization (Top-Down DP)
### Code
**Python**
```python
def calculateMinimumHP(dungeon):
    m, n = len(dungeon), len(dungeon[0])
    dp = [[-1] * n for _ in range(m)]
    
    def solve(i, j):
        if i == m - 1 and j == n - 1:
            return max(1, 1 - dungeon[i][j])
        if dp[i][j] != -1:
            return dp[i][j]
        
        right = solve(i, j + 1) if j + 1 < n else float('inf')
        down = solve(i + 1, j) if i + 1 < m else float('inf')
        
        minHealthNeeded = min(right, down) - dungeon[i][j]
        dp[i][j] = max(1, minHealthNeeded)
        return dp[i][j]
    
    return solve(0, 0)
```

**C++**
```cpp
class Solution {
public:
    int solve(int i, int j, vector<vector<int>>& dungeon, vector<vector<int>>& dp) {
        int m = dungeon.size(), n = dungeon[0].size();
        
        if (i == m - 1 && j == n - 1) {
            return max(1, 1 - dungeon[i][j]);
        }
        if (dp[i][j] != -1) return dp[i][j];
        
        int right = (j + 1 < n) ? solve(i, j + 1, dungeon, dp) : INT_MAX;
        int down = (i + 1 < m) ? solve(i + 1, j, dungeon, dp) : INT_MAX;
        
        int minHealthNeeded = min(right, down) - dungeon[i][j];
        dp[i][j] = max(1, minHealthNeeded);
        return dp[i][j];
    }
    
    int calculateMinimumHP(vector<vector<int>>& dungeon) {
        int m = dungeon.size(), n = dungeon[0].size();
        vector<vector<int>> dp(m, vector<int>(n, -1));
        return solve(0, 0, dungeon, dp);
    }
};
```
### Complexity
- **Time:** O(m × n)
- **Space:** O(m × n)

## Step 3: Tabulation (Bottom-Up DP)
### Code
**Python**
```python
def calculateMinimumHP(dungeon):
    m, n = len(dungeon), len(dungeon[0])
    dp = [[0] * n for _ in range(m)]
    
    dp[m - 1][n - 1] = max(1, 1 - dungeon[m - 1][n - 1])
    
    for i in range(m - 2, -1, -1):
        dp[i][n - 1] = max(1, dp[i + 1][n - 1] - dungeon[i][n - 1])
    
    for j in range(n - 2, -1, -1):
        dp[m - 1][j] = max(1, dp[m - 1][j + 1] - dungeon[m - 1][j])
    
    for i in range(m - 2, -1, -1):
        for j in range(n - 2, -1, -1):
            minHealthNeeded = min(dp[i + 1][j], dp[i][j + 1]) - dungeon[i][j]
            dp[i][j] = max(1, minHealthNeeded)
    
    return dp[0][0]
```

**C++**
```cpp
class Solution {
public:
    int calculateMinimumHP(vector<vector<int>>& dungeon) {
        int m = dungeon.size(), n = dungeon[0].size();
        vector<vector<int>> dp(m, vector<int>(n, 0));
        
        dp[m - 1][n - 1] = max(1, 1 - dungeon[m - 1][n - 1]);
        
        for (int i = m - 2; i >= 0; i--) {
            dp[i][n - 1] = max(1, dp[i + 1][n - 1] - dungeon[i][n - 1]);
        }
        
        for (int j = n - 2; j >= 0; j--) {
            dp[m - 1][j] = max(1, dp[m - 1][j + 1] - dungeon[m - 1][j]);
        }
        
        for (int i = m - 2; i >= 0; i--) {
            for (int j = n - 2; j >= 0; j--) {
                int minHealthNeeded = min(dp[i + 1][j], dp[i][j + 1]) - dungeon[i][j];
                dp[i][j] = max(1, minHealthNeeded);
            }
        }
        
        return dp[0][0];
    }
};
```
### Complexity
- **Time:** O(m × n)
- **Space:** O(m × n)

## Step 4: Space Optimization
### Code
**Python**
```python
def calculateMinimumHP(dungeon):
    m, n = len(dungeon), len(dungeon[0])
    dp = [0] * n
    
    dp[n - 1] = max(1, 1 - dungeon[m - 1][n - 1])
    
    for j in range(n - 2, -1, -1):
        dp[j] = max(1, dp[j + 1] - dungeon[m - 1][j])
    
    for i in range(m - 2, -1, -1):
        dp[n - 1] = max(1, dp[n - 1] - dungeon[i][n - 1])
        for j in range(n - 2, -1, -1):
            dp[j] = max(1, min(dp[j], dp[j + 1]) - dungeon[i][j])
    
    return dp[0]
```

**C++**
```cpp
class Solution {
public:
    int calculateMinimumHP(vector<vector<int>>& dungeon) {
        int m = dungeon.size(), n = dungeon[0].size();
        vector<int> dp(n, 0);
        
        dp[n - 1] = max(1, 1 - dungeon[m - 1][n - 1]);
        
        for (int j = n - 2; j >= 0; j--) {
            dp[j] = max(1, dp[j + 1] - dungeon[m - 1][j]);
        }
        
        for (int i = m - 2; i >= 0; i--) {
            dp[n - 1] = max(1, dp[n - 1] - dungeon[i][n - 1]);
            for (int j = n - 2; j >= 0; j--) {
                dp[j] = max(1, min(dp[j], dp[j + 1]) - dungeon[i][j]);
            }
        }
        
        return dp[0];
    }
};
```
### Complexity
- **Time:** O(m × n)
- **Space:** O(n)

## Key Insight
> The Dungeon Game requires reverse DP: starting from the princess (bottom-right), calculate minimum health needed at each cell. The answer propagates backwards because we need to ensure health never drops to 0 or below during the forward journey.

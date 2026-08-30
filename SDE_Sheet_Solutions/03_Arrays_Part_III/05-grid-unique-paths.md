# 62. Unique Paths

> **Difficulty:** Medium | **Topic:** Math, Dynamic Programming, Combinatorics | **LeetCode:** [62](https://leetcode.com/problems/unique-paths/)

---

## Problem Statement

There is a robot on an `m x n` grid. The robot is initially located at the top-left corner (i.e., `grid[0][0]`). The robot tries to move to the bottom-right corner (i.e., `grid[m-1][n-1]`). The robot can only move either down or right at any point in time.

Given the two integers `m` and `n`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.

---

## Examples

**Example 1:**
```
Input: m = 3, n = 7
Output: 28
```

**Example 2:**
```
Input: m = 3, n = 2
Output: 3
```

---

## Constraints

- `1 <= m, n <= 100`

---

## Topic Tags

`Math` `Dynamic Programming` `Combinatorics`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(m × n) for DP, O(min(m,n)) for combinatorics |
| **Space** | O(n) for DP, O(1) for combinatorics |

---

## Intuition

The number of unique paths is a combinatorial problem. To reach the bottom-right corner, the robot must make exactly (m-1) down moves and (n-1) right moves. The answer is C(m+n-2, m-1).

---

## Approach (DP)

1. Create a DP table where `dp[i][j]` = number of paths to reach cell (i,j)
2. `dp[i][j] = dp[i-1][j] + dp[i][j-1]`
3. First row and column are all 1s

---

## Optimized Solution (Combinatorics)

### Code

**Python**
```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        from math import comb
        return comb(m + n - 2, m - 1)
```

**C++**
```cpp
class Solution {
public:
    int uniquePaths(int m, int n) {
        int N = m + n - 2;
        int k = min(m - 1, n - 1);
        long long result = 1;
        
        for (int i = 1; i <= k; i++)
            result = result * (N - k + i) / i;
        
        return (int)result;
    }
};
```

### Complexity
- **Time:** O(min(m, n))
- **Space:** O(1)

---

## Key Insight

> The number of unique paths is C(m+n-2, m-1) — choosing which (m-1) of the (m+n-2) total moves are down moves.

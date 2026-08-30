# Egg Dropping Problem

> **Difficulty:** Hard | **Topic:** Dynamic Programming, Binary Search | **Platform:** GeeksforGeeks

---

## Problem Statement
You are given `n` eggs and you want to determine from which floor of a `k`-floor building you can drop an egg such that it doesn't break. You have to find the minimum number of attempts needed in the worst case to find the critical floor. Note: If an egg breaks when dropped from floor `x`, it will also break from any floor higher than `x`. If an egg does not break from floor `x`, it will not break from any floor lower than `x`.

## Examples
**Example 1:**
```
Input: n = 2, k = 10
Output: 4
Explanation: We need at most 4 attempts in worst case.
```

**Example 2:**
```
Input: n = 2, k = 6
Output: 3
Explanation: We need at most 3 attempts in worst case.
```

## Constraints
- 1 ≤ n ≤ 10
- 1 ≤ k ≤ 10000

## Topic Tags
`Dynamic Programming` `Binary Search`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n × k²) or O(n × k × log k) |
| **Space** | O(n × k) |

## Intuition
For a given number of eggs `n` and floors `k`, we need to find the floor where the egg breaks. The key insight is:

1. If we drop an egg from floor `x`:
   - If it breaks: We need to solve for `n-1` eggs and `x-1` floors (floors below x)
   - If it doesn't break: We need to solve for `n` eggs and `k-x` floors (floors above x)

2. We want to minimize the worst case, so we take max of both scenarios and minimize over all possible `x`.

## Approach
1. Define `solve(eggs, floors)` = minimum attempts needed
2. Base cases: 0 floors = 0 attempts, 1 floor = 1 attempt, 1 egg = floors attempts
3. Try all floors from 1 to k, take max of both outcomes, minimize

## Step 1: Recursion
### Code
**Python**
```python
def eggDrop(n, k):
    def solve(eggs, floors):
        if eggs == 1:
            return floors
        if floors == 0 or floors == 1:
            return floors
        
        minAttempts = float('inf')
        for floor in range(1, floors + 1):
            breaks = solve(eggs - 1, floor - 1)
            notBreaks = solve(eggs, floors - floor)
            minAttempts = min(minAttempts, max(breaks, notBreaks) + 1)
        
        return minAttempts
    
    return solve(n, k)
```

**C++**
```cpp
class Solution {
public:
    int solve(int eggs, int floors) {
        if (eggs == 1) return floors;
        if (floors == 0 || floors == 1) return floors;
        
        int minAttempts = INT_MAX;
        for (int floor = 1; floor <= floors; floor++) {
            int breaks = solve(eggs - 1, floor - 1);
            int notBreaks = solve(eggs, floors - floor);
            minAttempts = min(minAttempts, max(breaks, notBreaks) + 1);
        }
        return minAttempts;
    }
    
    int eggDrop(int n, int k) {
        return solve(n, k);
    }
};
```
### Complexity
- **Time:** O(k^n) - exponential
- **Space:** O(n) - recursion stack

## Step 2: Memoization (Top-Down DP)
### Code
**Python**
```python
def eggDrop(n, k):
    dp = [[-1] * (k + 1) for _ in range(n + 1)]
    
    def solve(eggs, floors):
        if eggs == 1:
            return floors
        if floors == 0 or floors == 1:
            return floors
        if dp[eggs][floors] != -1:
            return dp[eggs][floors]
        
        dp[eggs][floors] = float('inf')
        for floor in range(1, floors + 1):
            breaks = solve(eggs - 1, floor - 1)
            notBreaks = solve(eggs, floors - floor)
            dp[eggs][floors] = min(dp[eggs][floors], max(breaks, notBreaks) + 1)
        
        return dp[eggs][floors]
    
    return solve(n, k)
```

**C++**
```cpp
class Solution {
public:
    int solve(int eggs, int floors, vector<vector<int>>& dp) {
        if (eggs == 1) return floors;
        if (floors == 0 || floors == 1) return floors;
        if (dp[eggs][floors] != -1) return dp[eggs][floors];
        
        dp[eggs][floors] = INT_MAX;
        for (int floor = 1; floor <= floors; floor++) {
            int breaks = solve(eggs - 1, floor - 1, dp);
            int notBreaks = solve(eggs, floors - floor, dp);
            dp[eggs][floors] = min(dp[eggs][floors], max(breaks, notBreaks) + 1);
        }
        return dp[eggs][floors];
    }
    
    int eggDrop(int n, int k) {
        vector<vector<int>> dp(n + 1, vector<int>(k + 1, -1));
        return solve(n, k, dp);
    }
};
```
### Complexity
- **Time:** O(n × k²)
- **Space:** O(n × k)

## Step 3: Tabulation (Bottom-Up DP)
### Code
**Python**
```python
def eggDrop(n, k):
    dp = [[0] * (k + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        dp[i][0] = 0
        dp[i][1] = 1
    for j in range(1, k + 1):
        dp[1][j] = j
    
    for i in range(2, n + 1):
        for j in range(2, k + 1):
            dp[i][j] = float('inf')
            for x in range(1, j + 1):
                breaks = dp[i - 1][x - 1]
                notBreaks = dp[i][j - x]
                dp[i][j] = min(dp[i][j], max(breaks, notBreaks) + 1)
    
    return dp[n][k]
```

**C++**
```cpp
class Solution {
public:
    int eggDrop(int n, int k) {
        vector<vector<int>> dp(n + 1, vector<int>(k + 1, 0));
        
        for (int i = 1; i <= n; i++) {
            dp[i][0] = 0;
            dp[i][1] = 1;
        }
        for (int j = 1; j <= k; j++) {
            dp[1][j] = j;
        }
        
        for (int i = 2; i <= n; i++) {
            for (int j = 2; j <= k; j++) {
                dp[i][j] = INT_MAX;
                for (int x = 1; x <= j; x++) {
                    int breaks = dp[i - 1][x - 1];
                    int notBreaks = dp[i][j - x];
                    dp[i][j] = min(dp[i][j], max(breaks, notBreaks) + 1);
                }
            }
        }
        return dp[n][k];
    }
};
```
### Complexity
- **Time:** O(n × k²)
- **Space:** O(n × k)

## Step 4: Space Optimization
### Code
**Python**
```python
def eggDrop(n, k):
    dp = [0] * (k + 1)
    prev = [0] * (k + 1)
    
    for j in range(1, k + 1):
        dp[j] = j
    
    for i in range(2, n + 1):
        prev = dp[:]
        dp = [0] * (k + 1)
        dp[1] = 1
        for j in range(2, k + 1):
            dp[j] = float('inf')
            for x in range(1, j + 1):
                breaks = prev[x - 1]
                notBreaks = dp[j - x]
                dp[j] = min(dp[j], max(breaks, notBreaks) + 1)
    
    return dp[k]
```

**C++**
```cpp
class Solution {
public:
    int eggDrop(int n, int k) {
        vector<int> dp(k + 1, 0);
        vector<int> prev(k + 1, 0);
        
        for (int j = 1; j <= k; j++) {
            dp[j] = j;
        }
        
        for (int i = 2; i <= n; i++) {
            prev = dp;
            dp[0] = 0;
            dp[1] = 1;
            for (int j = 2; j <= k; j++) {
                dp[j] = INT_MAX;
                for (int x = 1; x <= j; x++) {
                    int breaks = prev[x - 1];
                    int notBreaks = dp[j - x];
                    dp[j] = min(dp[j], max(breaks, notBreaks) + 1);
                }
            }
        }
        return dp[k];
    }
};
```
### Complexity
- **Time:** O(n × k²)
- **Space:** O(k)

## Key Insight
> The egg dropping problem uses a minimax approach: for each floor we drop, we get worst-case result (max of break/no-break), then we minimize over all possible floors. Binary search can optimize the inner loop to O(log k).

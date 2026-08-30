# 70. Climbing Stairs

> **Difficulty:** Easy | **Topic:** Dynamic Programming | **Platform:** LeetCode

---

## Problem Statement
You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?

## Examples
**Example 1:**
```
Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps
```

**Example 2:**
```
Input: n = 3
Output: 3
Explanation: There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step
```

## Constraints
- `1 <= n <= 45`

## Topic Tags
`Dynamic Programming` `Math` `Memoization`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

## Intuition
This is essentially the Fibonacci sequence in disguise. To reach step `n`, you could have come from step `n-1` (by taking 1 step) or from step `n-2` (by taking 2 steps). So the number of ways to reach step `n` is the sum of ways to reach steps `n-1` and `n-2`.

## Approach
1. Base cases: 1 way to reach step 1, 2 ways to reach step 2
2. For each step from 3 to n, ways[i] = ways[i-1] + ways[i-2]
3. Optimize space by only tracking the last two values

## Step 1: Recursion
### Code
**Python**
```python
def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    return climbStairs(n - 1) + climbStairs(n - 2)
```

**C++**
```cpp
class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        return climbStairs(n - 1) + climbStairs(n - 2);
    }
};
```

### Complexity
- **Time:** O(2^n) — exponential, branching at each call
- **Space:** O(n) — recursion stack depth

## Step 2: Memoization (Top-Down DP)
### Code
**Python**
```python
def climbStairs(n: int) -> int:
    memo = {}

    def helper(i):
        if i <= 2:
            return i
        if i in memo:
            return memo[i]
        memo[i] = helper(i - 1) + helper(i - 2)
        return memo[i]

    return helper(n)
```

**C++**
```cpp
class Solution {
public:
    int climbStairs(int n) {
        unordered_map<int, int> memo;
        return helper(n, memo);
    }

    int helper(int i, unordered_map<int, int>& memo) {
        if (i <= 2) return i;
        if (memo.count(i)) return memo[i];
        memo[i] = helper(i - 1, memo) + helper(i - 2, memo);
        return memo[i];
    }
};
```

### Complexity
- **Time:** O(n) — each subproblem solved once
- **Space:** O(n) — memoization map + recursion stack

## Step 3: Tabulation (Bottom-Up DP)
### Code
**Python**
```python
def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]
```

**C++**
```cpp
class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        vector<int> dp(n + 1);
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
};
```

### Complexity
- **Time:** O(n) — single loop from 3 to n
- **Space:** O(n) — dp array of size n+1

## Step 4: Space Optimization
### Code
**Python**
```python
def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    prev2, prev1 = 1, 2
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    return prev1
```

**C++**
```cpp
class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
};
```

### Complexity
- **Time:** O(n) — single loop
- **Space:** O(1) — only three variables

## Key Insight
> Climbing stairs is the Fibonacci sequence: each step's ways equals the sum of the two preceding steps, allowing O(1) space optimization.

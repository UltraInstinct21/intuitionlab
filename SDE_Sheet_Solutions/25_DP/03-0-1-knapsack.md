# 0/1 Knapsack Problem

> **Difficulty:** Medium | **Topic:** Dynamic Programming | **Platform:** GeeksforGeeks

---

## Problem Statement
Given `n` items, each with a weight and a value, determine the maximum value that can be obtained by filling a knapsack of capacity `W`. You cannot break items — either pick the whole item or don't pick it (0/1 property).

## Examples
**Example 1:**
```
Input: N = 3, W = 4, val[] = {1, 2, 3}, wt[] = {4, 5, 1}
Output: 3
Explanation: Pick the third item (weight=1, value=3). Total weight = 1 <= 4.
```

**Example 2:**
```
Input: N = 3, W = 3, val[] = {1, 2, 3}, wt[] = {4, 5, 6}
Output: 0
Explanation: No item can fit in the knapsack.
```

## Constraints
- `1 <= N <= 1000`
- `1 <= W <= 1000`
- `1 <= wt[i] <= 1000`
- `1 <= val[i] <= 1000`

## Topic Tags
`Dynamic Programming` `Knapsack` `0/1`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N * W) |
| **Space** | O(W) |

## Intuition
For each item, we decide: include it or exclude it. If we include it, we gain its value but reduce remaining capacity by its weight. If we exclude it, capacity stays the same. We want the combination that maximizes total value without exceeding capacity W.

## Approach
1. Recursively try including/excluding each item
2. Memoize on (index, remaining capacity)
3. Build bottom-up table where dp[i][w] = max value using items 0..i with capacity w
4. Optimize to 1D array since each row only depends on the previous row

## Step 1: Recursion
### Code
**Python**
```python
def knapsack(W, wt, val, n):
    def helper(i, remaining):
        if i == n or remaining == 0:
            return 0
        if wt[i] > remaining:
            return helper(i + 1, remaining)
        include = val[i] + helper(i + 1, remaining - wt[i])
        exclude = helper(i + 1, remaining)
        return max(include, exclude)

    return helper(0, W)
```

**C++**
```cpp
int knapsack(int W, int wt[], int val[], int n) {
    function<int(int, int)> helper = [&](int i, int remaining) -> int {
        if (i == n || remaining == 0) return 0;
        if (wt[i] > remaining) return helper(i + 1, remaining);
        int include = val[i] + helper(i + 1, remaining - wt[i]);
        int exclude = helper(i + 1, remaining);
        return max(include, exclude);
    };
    return helper(0, W);
}
```

### Complexity
- **Time:** O(2^n) — each item has two choices
- **Space:** O(n) — recursion stack depth

## Step 2: Memoization (Top-Down DP)
### Code
**Python**
```python
def knapsack(W, wt, val, n):
    memo = {}

    def helper(i, remaining):
        if i == n or remaining == 0:
            return 0
        if (i, remaining) in memo:
            return memo[(i, remaining)]
        if wt[i] > remaining:
            memo[(i, remaining)] = helper(i + 1, remaining)
        else:
            include = val[i] + helper(i + 1, remaining - wt[i])
            exclude = helper(i + 1, remaining)
            memo[(i, remaining)] = max(include, exclude)
        return memo[(i, remaining)]

    return helper(0, W)
```

**C++**
```cpp
int knapsack(int W, int wt[], int val[], int n) {
    unordered_map<int, int> memo;

    function<int(int, int)> helper = [&](int i, int remaining) -> int {
        if (i == n || remaining == 0) return 0;
        int key = i * (W + 1) + remaining;
        if (memo.count(key)) return memo[key];
        if (wt[i] > remaining) {
            memo[key] = helper(i + 1, remaining);
        } else {
            int include = val[i] + helper(i + 1, remaining - wt[i]);
            int exclude = helper(i + 1, remaining);
            memo[key] = max(include, exclude);
        }
        return memo[key];
    };
    return helper(0, W);
}
```

### Complexity
- **Time:** O(N * W) — each (index, capacity) pair solved once
- **Space:** O(N * W) — memoization table + recursion stack

## Step 3: Tabulation (Bottom-Up DP)
### Code
**Python**
```python
def knapsack(W, wt, val, n):
    dp = [[0] * (W + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if wt[i - 1] <= w:
                dp[i][w] = max(
                    val[i - 1] + dp[i - 1][w - wt[i - 1]],
                    dp[i - 1][w]
                )
            else:
                dp[i][w] = dp[i - 1][w]

    return dp[n][W]
```

**C++**
```cpp
int knapsack(int W, int wt[], int val[], int n) {
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w) {
                dp[i][w] = max(
                    val[i - 1] + dp[i - 1][w - wt[i - 1]],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}
```

### Complexity
- **Time:** O(N * W) — nested loops
- **Space:** O(N * W) — 2D dp table

## Step 4: Space Optimization
### Code
**Python**
```python
def knapsack(W, wt, val, n):
    dp = [0] * (W + 1)

    for i in range(n):
        for w in range(W, wt[i] - 1, -1):
            dp[w] = max(dp[w], val[i] + dp[w - wt[i]])

    return dp[W]
```

**C++**
```cpp
int knapsack(int W, int wt[], int val[], int n) {
    vector<int> dp(W + 1, 0);

    for (int i = 0; i < n; i++) {
        for (int w = W; w >= wt[i]; w--) {
            dp[w] = max(dp[w], val[i] + dp[w - wt[i]]);
        }
    }
    return dp[W];
}
```

### Complexity
- **Time:** O(N * W) — same nested loops
- **Space:** O(W) — single 1D array

## Key Insight
> Iterate items top-down and capacity right-to-left in 1D to ensure each item is used at most once (0/1 constraint).

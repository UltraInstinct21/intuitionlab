# Rod Cutting

> **Difficulty:** Medium | **Topic:** Dynamic Programming, Unbounded Knapsack | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a rod of length `n` and an array of prices `price[]` that contains prices of all pieces of size `1` to `n`, determine the maximum value obtainable by cutting up the rod and selling the pieces.

## Examples
**Example 1:**
```
Input: price[] = [1, 5, 8, 9, 10, 17, 17, 20], n = 8
Output: 22
Explanation: By cutting rod into pieces of length 2 and 6, we get 5 + 17 = 22
```

**Example 2:**
```
Input: price[] = [3, 5, 8, 9, 10, 17, 17, 20], n = 8
Output: 24
Explanation: By cutting rod into pieces of length 1, 3, and 4, we get 3 + 8 + 9 = 20
```

## Constraints
- 1 ≤ n ≤ 1000
- 1 ≤ price[i] ≤ 1000

## Topic Tags
`Dynamic Programming` `Arrays`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n²) |
| **Space** | O(n) |

## Intuition
This is an unbounded knapsack variant. We can cut pieces of any length (1 to n) multiple times. For each length, we decide whether to include it and recursively solve for remaining length. The goal is to maximize total value.

For each rod length `len`, we can either:
1. Not cut any piece of this length
2. Cut one piece and solve for remaining length `n - len`

## Approach
1. For each possible cut length from 1 to n
2. If we take a piece of this length, add its price and recurse for remaining
3. Take maximum over all choices

## Step 1: Recursion
### Code
**Python**
```python
def cutRod(price, n):
    def solve(rodLength, currentIndex):
        if currentIndex == 0 or rodLength == 0:
            return 0
        
        if currentIndex <= rodLength:
            take = price[currentIndex - 1] + solve(rodLength - currentIndex, currentIndex)
            notTake = solve(rodLength, currentIndex - 1)
            return max(take, notTake)
        else:
            return solve(rodLength, currentIndex - 1)
    
    return solve(n, n)
```

**C++**
```cpp
class Solution {
public:
    int solve(int rodLength, int currentIndex, vector<int>& price) {
        if (currentIndex == 0 || rodLength == 0) return 0;
        
        if (currentIndex <= rodLength) {
            int take = price[currentIndex - 1] + solve(rodLength - currentIndex, currentIndex, price);
            int notTake = solve(rodLength, currentIndex - 1, price);
            return max(take, notTake);
        }
        return solve(rodLength, currentIndex - 1, price);
    }
    
    int cutRod(vector<int>& price, int n) {
        return solve(n, n, price);
    }
};
```
### Complexity
- **Time:** O(2^n) - exponential with overlapping subproblems
- **Space:** O(n) - recursion stack

## Step 2: Memoization (Top-Down DP)
### Code
**Python**
```python
def cutRod(price, n):
    dp = [[-1] * (n + 1) for _ in range(n + 1)]
    
    def solve(rodLength, currentIndex):
        if currentIndex == 0 or rodLength == 0:
            return 0
        if dp[rodLength][currentIndex] != -1:
            return dp[rodLength][currentIndex]
        
        if currentIndex <= rodLength:
            take = price[currentIndex - 1] + solve(rodLength - currentIndex, currentIndex)
            notTake = solve(rodLength, currentIndex - 1)
            dp[rodLength][currentIndex] = max(take, notTake)
        else:
            dp[rodLength][currentIndex] = solve(rodLength, currentIndex - 1)
        
        return dp[rodLength][currentIndex]
    
    return solve(n, n)
```

**C++**
```cpp
class Solution {
public:
    int solve(int rodLength, int currentIndex, vector<int>& price, vector<vector<int>>& dp) {
        if (currentIndex == 0 || rodLength == 0) return 0;
        if (dp[rodLength][currentIndex] != -1) return dp[rodLength][currentIndex];
        
        if (currentIndex <= rodLength) {
            int take = price[currentIndex - 1] + solve(rodLength - currentIndex, currentIndex, price, dp);
            int notTake = solve(rodLength, currentIndex - 1, price, dp);
            dp[rodLength][currentIndex] = max(take, notTake);
        } else {
            dp[rodLength][currentIndex] = solve(rodLength, currentIndex - 1, price, dp);
        }
        return dp[rodLength][currentIndex];
    }
    
    int cutRod(vector<int>& price, int n) {
        vector<vector<int>> dp(n + 1, vector<int>(n + 1, -1));
        return solve(n, n, price, dp);
    }
};
```
### Complexity
- **Time:** O(n²)
- **Space:** O(n²) - DP table + recursion stack

## Step 3: Tabulation (Bottom-Up DP)
### Code
**Python**
```python
def cutRod(price, n):
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    
    for rodLength in range(1, n + 1):
        for currentIndex in range(1, n + 1):
            if currentIndex <= rodLength:
                take = price[currentIndex - 1] + dp[rodLength - currentIndex][currentIndex]
                notTake = dp[rodLength][currentIndex - 1]
                dp[rodLength][currentIndex] = max(take, notTake)
            else:
                dp[rodLength][currentIndex] = dp[rodLength][currentIndex - 1]
    
    return dp[n][n]
```

**C++**
```cpp
class Solution {
public:
    int cutRod(vector<int>& price, int n) {
        vector<vector<int>> dp(n + 1, vector<int>(n + 1, 0));
        
        for (int rodLength = 1; rodLength <= n; rodLength++) {
            for (int currentIndex = 1; currentIndex <= n; currentIndex++) {
                if (currentIndex <= rodLength) {
                    int take = price[currentIndex - 1] + dp[rodLength - currentIndex][currentIndex];
                    int notTake = dp[rodLength][currentIndex - 1];
                    dp[rodLength][currentIndex] = max(take, notTake);
                } else {
                    dp[rodLength][currentIndex] = dp[rodLength][currentIndex - 1];
                }
            }
        }
        return dp[n][n];
    }
};
```
### Complexity
- **Time:** O(n²)
- **Space:** O(n²)

## Step 4: Space Optimization
### Code
**Python**
```python
def cutRod(price, n):
    dp = [0] * (n + 1)
    
    for currentIndex in range(1, n + 1):
        for rodLength in range(currentIndex, n + 1):
            dp[rodLength] = max(dp[rodLength], dp[rodLength - currentIndex] + price[currentIndex - 1])
    
    return dp[n]
```

**C++**
```cpp
class Solution {
public:
    int cutRod(vector<int>& price, int n) {
        vector<int> dp(n + 1, 0);
        
        for (int currentIndex = 1; currentIndex <= n; currentIndex++) {
            for (int rodLength = currentIndex; rodLength <= n; rodLength++) {
                dp[rodLength] = max(dp[rodLength], dp[rodLength - currentIndex] + price[currentIndex - 1]);
            }
        }
        return dp[n];
    }
};
```
### Complexity
- **Time:** O(n²)
- **Space:** O(n) - 1D array only

## Key Insight
> Rod cutting is an unbounded knapsack problem where each length can be used unlimited times. We iterate through all lengths and for each, decide whether to include it in the optimal solution.

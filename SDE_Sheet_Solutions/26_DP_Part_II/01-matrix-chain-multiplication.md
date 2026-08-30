# Matrix Chain Multiplication

> **Difficulty:** Hard | **Topic:** Dynamic Programming, Interval DP | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a sequence of matrices, find the most efficient way to multiply these matrices. The problem is not actually to perform the multiplications, but just to decide in which order to perform the multiplications. Given an array `arr[]` which represents the chain of matrices such that theith matrix `Ai` has dimensions `arr[i-1] x arr[i]`, find the minimum number of multiplications needed to multiply the chain.

## Examples
**Example 1:**
```
Input: arr[] = [40, 20, 30, 10, 30]
Output: 26000
Explanation: There are 4 matrices of dimensions 40x20, 20x30, 30x10, 10x30.
The optimal parenthesization is ((A0 x A1) x A2) x A3 = 26000
```

**Example 2:**
```
Input: arr[] = [10, 20, 30, 40, 30]
Output: 30000
Explanation: There are 4 matrices of dimensions 10x20, 20x30, 30x40, 40x30.
The optimal parenthesization is (A0 x A1) x (A2 x A3) = 30000
```

## Constraints
- 2 ≤ arr.size() ≤ 100
- 1 ≤ arr[i] ≤ 500

## Topic Tags
`Matrix` `Dynamic Programming`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n³) |
| **Space** | O(n²) |

## Intuition
The key insight is that when we multiply two matrices A (p×q) and B (q×r), the total multiplications needed are p×q×r. For a chain of matrices, we need to find the optimal point to split the chain to minimize total cost.

For each subchain from matrix i to matrix j, we try every possible split point k. The cost is: cost(i,k) + cost(k+1,j) + arr[i-1]*arr[k]*arr[j]. We need the minimum over all k.

## Approach
1. Define recursive function `solve(i, j)` = min cost to multiply matrices from i to j
2. Base case: when i == j (single matrix), cost is 0
3. Try all split points k from i to j-1
4. Return minimum cost over all splits

## Step 1: Recursion
### Code
**Python**
```python
def matrixMultiplication(arr):
    n = len(arr)
    
    def solve(i, j):
        if i == j:
            return 0
        
        min_cost = float('inf')
        for k in range(i, j):
            cost = solve(i, k) + solve(k + 1, j) + arr[i - 1] * arr[k] * arr[j]
            min_cost = min(min_cost, cost)
        
        return min_cost
    
    return solve(1, n - 1)
```

**C++**
```cpp
class Solution {
public:
    int solve(int i, int j, vector<int>& arr) {
        if (i == j) return 0;
        
        int minCost = INT_MAX;
        for (int k = i; k < j; k++) {
            int cost = solve(i, k, arr) + solve(k + 1, j, arr) + 
                       arr[i - 1] * arr[k] * arr[j];
            minCost = min(minCost, cost);
        }
        return minCost;
    }
    
    int matrixMultiplication(vector<int>& arr) {
        int n = arr.size();
        return solve(1, n - 1, arr);
    }
};
```
### Complexity
- **Time:** O(2^n) - exponential due to overlapping subproblems
- **Space:** O(n) - recursion stack

## Step 2: Memoization (Top-Down DP)
### Code
**Python**
```python
def matrixMultiplication(arr):
    n = len(arr)
    dp = [[-1] * n for _ in range(n)]
    
    def solve(i, j):
        if i == j:
            return 0
        if dp[i][j] != -1:
            return dp[i][j]
        
        dp[i][j] = float('inf')
        for k in range(i, j):
            cost = solve(i, k) + solve(k + 1, j) + arr[i - 1] * arr[k] * arr[j]
            dp[i][j] = min(dp[i][j], cost)
        
        return dp[i][j]
    
    return solve(1, n - 1)
```

**C++**
```cpp
class Solution {
public:
    int solve(int i, int j, vector<int>& arr, vector<vector<int>>& dp) {
        if (i == j) return 0;
        if (dp[i][j] != -1) return dp[i][j];
        
        dp[i][j] = INT_MAX;
        for (int k = i; k < j; k++) {
            int cost = solve(i, k, arr, dp) + solve(k + 1, j, arr, dp) + 
                       arr[i - 1] * arr[k] * arr[j];
            dp[i][j] = min(dp[i][j], cost);
        }
        return dp[i][j];
    }
    
    int matrixMultiplication(vector<int>& arr) {
        int n = arr.size();
        vector<vector<int>> dp(n, vector<int>(n, -1));
        return solve(1, n - 1, arr, dp);
    }
};
```
### Complexity
- **Time:** O(n³) - O(n²) states × O(n) per state
- **Space:** O(n²) - DP table + recursion stack

## Step 3: Tabulation (Bottom-Up DP)
### Code
**Python**
```python
def matrixMultiplication(arr):
    n = len(arr)
    dp = [[0] * n for _ in range(n)]
    
    for length in range(2, n):
        for i in range(1, n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j):
                cost = dp[i][k] + dp[k + 1][j] + arr[i - 1] * arr[k] * arr[j]
                dp[i][j] = min(dp[i][j], cost)
    
    return dp[1][n - 1]
```

**C++**
```cpp
class Solution {
public:
    int matrixMultiplication(vector<int>& arr) {
        int n = arr.size();
        vector<vector<int>> dp(n, vector<int>(n, 0));
        
        for (int length = 2; length < n; length++) {
            for (int i = 1; i <= n - length; i++) {
                int j = i + length - 1;
                dp[i][j] = INT_MAX;
                for (int k = i; k < j; k++) {
                    int cost = dp[i][k] + dp[k + 1][j] + 
                               arr[i - 1] * arr[k] * arr[j];
                    dp[i][j] = min(dp[i][j], cost);
                }
            }
        }
        return dp[1][n - 1];
    }
};
```
### Complexity
- **Time:** O(n³)
- **Space:** O(n²)

## Step 4: Space Optimization
### Code
**Python**
```python
# Note: Matrix Chain Multiplication requires the full DP table
# as each state (i,j) depends on multiple previous states.
# True space optimization is not possible for this problem.
# The tabulation solution is the optimal approach.
def matrixMultiplication(arr):
    n = len(arr)
    dp = [[0] * n for _ in range(n)]
    
    for length in range(2, n):
        for i in range(1, n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j):
                cost = dp[i][k] + dp[k + 1][j] + arr[i - 1] * arr[k] * arr[j]
                dp[i][j] = min(dp[i][j], cost)
    
    return dp[1][n - 1]
```

**C++**
```cpp
// Space optimization is not feasible for MCM due to dependency pattern
// The tabulation approach is already optimal for this problem
class Solution {
public:
    int matrixMultiplication(vector<int>& arr) {
        int n = arr.size();
        vector<vector<int>> dp(n, vector<int>(n, 0));
        
        for (int length = 2; length < n; length++) {
            for (int i = 1; i <= n - length; i++) {
                int j = i + length - 1;
                dp[i][j] = INT_MAX;
                for (int k = i; k < j; k++) {
                    int cost = dp[i][k] + dp[k + 1][j] + 
                               arr[i - 1] * arr[k] * arr[j];
                    dp[i][j] = min(dp[i][j], cost);
                }
            }
        }
        return dp[1][n - 1];
    }
};
```
### Complexity
- **Time:** O(n³)
- **Space:** O(n²)

## Key Insight
> Matrix Chain Multiplication is an interval DP problem where we try all possible split points between i and j, combining results from smaller intervals to build up to the full solution.

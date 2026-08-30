# 312. Burst Balloons

> **Difficulty:** Hard | **Topic:** Dynamic Programming, Interval DP | **Platform:** LeetCode

---

## Problem Statement
You are given `n` balloons indexed from `0` to `n - 1`. Each balloon is painted with a number on it represented by an array `nums`. You are asked to burst all the balloons. If you burst the `ith` balloon, you will get `nums[i - 1] * nums[i] * nums[i + 1]` coins. If `i - 1` or `i + 1` goes out of bounds of the array, then treat it as if there is a balloon with a `1` painted on it. Return the maximum coins you can collect by bursting the balloons wisely.

## Examples
**Example 1:**
```
Input: nums = [3,1,5,8]
Output: 167
Explanation: nums = [3,1,5,8] --> [3,5,8] --> [3,8] --> [8] --> []
coins =  3*1*5    +  3*5*8  +  1*3*8  + 1*8*1 = 15 + 120 + 24 + 8 = 167
```

**Example 2:**
```
Input: nums = [1,5]
Output: 10
```

## Constraints
- n == nums.length
- 1 ≤ n ≤ 300
- 0 ≤ nums[i] ≤ 100

## Topic Tags
`Array` `Dynamic Programming`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n³) |
| **Space** | O(n²) |

## Intuition
This problem is similar to Matrix Chain Multiplication. The key insight is to think about which balloon is burst LAST in a range [i, j]. If balloon k is burst last in range [i, j], then:
- Left part [i, k-1] is already burst
- Right part [k+1, j] is already burst
- Balloon k gives coins: nums[i-1] * nums[k] * nums[j+1]

## Approach
1. Define `dp[i][j]` = maximum coins from bursting balloons in range [i, j]
2. For each range, try all possible last balloons to burst
3. Combine results from left and right subranges

## Step 1: Recursion
### Code
**Python**
```python
def maxCoins(nums):
    n = len(nums)
    newNums = [1] + nums + [1]
    
    def solve(i, j):
        if i > j:
            return 0
        
        maxCoins = 0
        for k in range(i, j + 1):
            coins = solve(i, k - 1) + solve(k + 1, j) + newNums[i - 1] * newNums[k] * newNums[j + 1]
            maxCoins = max(maxCoins, coins)
        
        return maxCoins
    
    return solve(1, n)
```

**C++**
```cpp
class Solution {
public:
    int solve(int i, int j, vector<int>& nums) {
        if (i > j) return 0;
        
        int maxCoins = 0;
        for (int k = i; k <= j; k++) {
            int coins = solve(i, k - 1, nums) + solve(k + 1, j, nums) + 
                        nums[i - 1] * nums[k] * nums[j + 1];
            maxCoins = max(maxCoins, coins);
        }
        return maxCoins;
    }
    
    int maxCoins(vector<int>& nums) {
        int n = nums.size();
        nums.insert(nums.begin(), 1);
        nums.push_back(1);
        return solve(1, n, nums);
    }
};
```
### Complexity
- **Time:** O(2^n) - exponential
- **Space:** O(n) - recursion stack

## Step 2: Memoization (Top-Down DP)
### Code
**Python**
```python
def maxCoins(nums):
    n = len(nums)
    nums = [1] + nums + [1]
    dp = [[-1] * (n + 2) for _ in range(n + 2)]
    
    def solve(i, j):
        if i > j:
            return 0
        if dp[i][j] != -1:
            return dp[i][j]
        
        dp[i][j] = 0
        for k in range(i, j + 1):
            coins = solve(i, k - 1) + solve(k + 1, j) + nums[i - 1] * nums[k] * nums[j + 1]
            dp[i][j] = max(dp[i][j], coins)
        
        return dp[i][j]
    
    return solve(1, n)
```

**C++**
```cpp
class Solution {
public:
    int solve(int i, int j, vector<int>& nums, vector<vector<int>>& dp) {
        if (i > j) return 0;
        if (dp[i][j] != -1) return dp[i][j];
        
        dp[i][j] = 0;
        for (int k = i; k <= j; k++) {
            int coins = solve(i, k - 1, nums, dp) + solve(k + 1, j, nums, dp) + 
                        nums[i - 1] * nums[k] * nums[j + 1];
            dp[i][j] = max(dp[i][j], coins);
        }
        return dp[i][j];
    }
    
    int maxCoins(vector<int>& nums) {
        int n = nums.size();
        nums.insert(nums.begin(), 1);
        nums.push_back(1);
        vector<vector<int>> dp(n + 2, vector<int>(n + 2, -1));
        return solve(1, n, nums, dp);
    }
};
```
### Complexity
- **Time:** O(n³)
- **Space:** O(n²)

## Step 3: Tabulation (Bottom-Up DP)
### Code
**Python**
```python
def maxCoins(nums):
    n = len(nums)
    nums = [1] + nums + [1]
    dp = [[0] * (n + 2) for _ in range(n + 2)]
    
    for length in range(1, n + 1):
        for i in range(1, n - length + 2):
            j = i + length - 1
            for k in range(i, j + 1):
                coins = dp[i][k - 1] + dp[k + 1][j] + nums[i - 1] * nums[k] * nums[j + 1]
                dp[i][j] = max(dp[i][j], coins)
    
    return dp[1][n]
```

**C++**
```cpp
class Solution {
public:
    int maxCoins(vector<int>& nums) {
        int n = nums.size();
        nums.insert(nums.begin(), 1);
        nums.push_back(1);
        vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));
        
        for (int length = 1; length <= n; length++) {
            for (int i = 1; i <= n - length + 1; i++) {
                int j = i + length - 1;
                for (int k = i; k <= j; k++) {
                    int coins = dp[i][k - 1] + dp[k + 1][j] + 
                                nums[i - 1] * nums[k] * nums[j + 1];
                    dp[i][j] = max(dp[i][j], coins);
                }
            }
        }
        return dp[1][n];
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
# Space optimization not feasible for interval DP problems like this
# The tabulation solution is already optimal
def maxCoins(nums):
    n = len(nums)
    nums = [1] + nums + [1]
    dp = [[0] * (n + 2) for _ in range(n + 2)]
    
    for length in range(1, n + 1):
        for i in range(1, n - length + 2):
            j = i + length - 1
            for k in range(i, j + 1):
                coins = dp[i][k - 1] + dp[k + 1][j] + nums[i - 1] * nums[k] * nums[j + 1]
                dp[i][j] = max(dp[i][j], coins)
    
    return dp[1][n]
```

**C++**
```cpp
// Space optimization not feasible for interval DP problems like this
class Solution {
public:
    int maxCoins(vector<int>& nums) {
        int n = nums.size();
        nums.insert(nums.begin(), 1);
        nums.push_back(1);
        vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));
        
        for (int length = 1; length <= n; length++) {
            for (int i = 1; i <= n - length + 1; i++) {
                int j = i + length - 1;
                for (int k = i; k <= j; k++) {
                    int coins = dp[i][k - 1] + dp[k + 1][j] + 
                                nums[i - 1] * nums[k] * nums[j + 1];
                    dp[i][j] = max(dp[i][j], coins);
                }
            }
        }
        return dp[1][n];
    }
};
```
### Complexity
- **Time:** O(n³)
- **Space:** O(n²)

## Key Insight
> Burst Balloons is an interval DP problem similar to MCM. Think backwards: which balloon is burst LAST in a range. This gives the recursive structure: for each range [i,j], try all possible last balloons k, combining results from subranges.

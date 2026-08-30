# 198. House Robber

> **Difficulty:** Medium | **Topic:** Dynamic Programming | **Platform:** LeetCode

---

## Problem Statement
You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected — it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.

## Examples
**Example 1:**
```
Input: nums = [1,2,3,1]
Output: 4
Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
Total amount = 1 + 3 = 4.
```

**Example 2:**
```
Input: nums = [2,7,9,3,1]
Output: 12
Explanation: Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).
Total amount = 2 + 9 + 1 = 12.
```

## Constraints
- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 400`

## Topic Tags
`Dynamic Programming` `Array`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

## Intuition
At each house, you have two choices: rob it or skip it. If you rob house `i`, you cannot rob house `i-1`, so you add `nums[i]` to the best result from house `i-2`. If you skip house `i`, the best result is the same as house `i-1`. The answer is the maximum of these two choices.

## Approach
1. Define `dp[i]` as the maximum money you can rob from houses 0 to i
2. Recurrence: `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`
3. Either skip house i (take dp[i-1]) or rob it (take dp[i-2] + nums[i])

## Step 1: Recursion
### Code
**Python**
```python
def rob(nums: list[int]) -> int:
    def helper(i):
        if i < 0:
            return 0
        if i == 0:
            return nums[0]
        return max(helper(i - 1), helper(i - 2) + nums[i])

    return helper(len(nums) - 1)
```

**C++**
```cpp
class Solution {
public:
    int rob(vector<int>& nums) {
        return helper(nums.size() - 1, nums);
    }

    int helper(int i, vector<int>& nums) {
        if (i < 0) return 0;
        if (i == 0) return nums[0];
        return max(helper(i - 1, nums), helper(i - 2, nums) + nums[i]);
    }
};
```

### Complexity
- **Time:** O(2^n) — exponential branching
- **Space:** O(n) — recursion stack depth

## Step 2: Memoization (Top-Down DP)
### Code
**Python**
```python
def rob(nums: list[int]) -> int:
    memo = {}

    def helper(i):
        if i < 0:
            return 0
        if i == 0:
            return nums[0]
        if i in memo:
            return memo[i]
        memo[i] = max(helper(i - 1), helper(i - 2) + nums[i])
        return memo[i]

    return helper(len(nums) - 1)
```

**C++**
```cpp
class Solution {
public:
    int rob(vector<int>& nums) {
        unordered_map<int, int> memo;
        return helper(nums.size() - 1, nums, memo);
    }

    int helper(int i, vector<int>& nums, unordered_map<int, int>& memo) {
        if (i < 0) return 0;
        if (i == 0) return nums[0];
        if (memo.count(i)) return memo[i];
        memo[i] = max(helper(i - 1, nums, memo), helper(i - 2, nums, memo) + nums[i]);
        return memo[i];
    }
};
```

### Complexity
- **Time:** O(n) — each subproblem computed once
- **Space:** O(n) — memoization map + recursion stack

## Step 3: Tabulation (Bottom-Up DP)
### Code
**Python**
```python
def rob(nums: list[int]) -> int:
    n = len(nums)
    if n == 1:
        return nums[0]
    dp = [0] * n
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    for i in range(2, n):
        dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])
    return dp[n - 1]
```

**C++**
```cpp
class Solution {
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        vector<int> dp(n);
        dp[0] = nums[0];
        dp[1] = max(nums[0], nums[1]);
        for (int i = 2; i < n; i++) {
            dp[i] = max(dp[i - 1], dp[i - 2] + nums[i]);
        }
        return dp[n - 1];
    }
};
```

### Complexity
- **Time:** O(n) — single pass through the array
- **Space:** O(n) — dp array

## Step 4: Space Optimization
### Code
**Python**
```python
def rob(nums: list[int]) -> int:
    n = len(nums)
    if n == 1:
        return nums[0]
    prev2, prev1 = nums[0], max(nums[0], nums[1])
    for i in range(2, n):
        curr = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = curr
    return prev1
```

**C++**
```cpp
class Solution {
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        int prev2 = nums[0];
        int prev1 = max(nums[0], nums[1]);
        for (int i = 2; i < n; i++) {
            int curr = max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
};
```

### Complexity
- **Time:** O(n) — single pass
- **Space:** O(1) — only two variables

## Key Insight
> At each house, choose between robbing it (add to best of i-2) or skipping it (keep best of i-1), reducing to two rolling variables.

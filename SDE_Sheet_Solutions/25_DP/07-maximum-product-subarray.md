# 152. Maximum Product Subarray

> **Difficulty:** Medium | **Topic:** Dynamic Programming | **Platform:** LeetCode

---

## Problem Statement
Given an integer array `nums`, find a subarray that has the largest product, and return the product. The test cases are generated so that the answer will fit in a 32-bit integer.

## Examples
**Example 1:**
```
Input: nums = [2,3,-2,4]
Output: 6
Explanation: [2,3] has the largest product 6.
```

**Example 2:**
```
Input: nums = [-2,0,-1]
Output: 0
Explanation: The result cannot be 2 because it is not a subarray.
```

## Constraints
- `1 <= nums.length <= 2 * 10^4`
- `-10 <= nums[i] <= 10`
- The product of any subarray of `nums` is guaranteed to fit in a 32-bit integer.

## Topic Tags
`Dynamic Programming` `Array` `Divide and Conquer`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

## Intuition
Unlike sum, products can flip signs. A negative number multiplied by another negative becomes positive. So we track both the maximum and minimum product ending at each position — the minimum could become the maximum if multiplied by a negative. At each step, we decide whether to extend the current subarray or start fresh.

## Approach
1. Track `maxProd` and `minProd` ending at current position
2. For each element, consider three candidates: element alone, element * maxProd, element * minProd
3. Update max and min simultaneously (negative flip property)
4. Global maximum tracks the best seen so far

## Step 1: Recursion
### Code
**Python**
```python
def maxProduct(nums: list[int]) -> int:
    n = len(nums)

    def helper(i):
        if i == 0:
            return (nums[0], nums[0])
        prev_max, prev_min = helper(i - 1)
        curr_max = max(nums[i], nums[i] * prev_max, nums[i] * prev_min)
        curr_min = min(nums[i], nums[i] * prev_max, nums[i] * prev_min)
        return (curr_max, curr_min)

    result = float('-inf')
    for i in range(n):
        curr_max, _ = helper(i)
        result = max(result, curr_max)
    return result
```

**C++**
```cpp
class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int n = nums.size();
        int result = INT_MIN;

        function<pair<int,int>(int)> helper = [&](int i) -> pair<int,int> {
            if (i == 0) return {nums[0], nums[0]};
            auto [prev_max, prev_min] = helper(i - 1);
            int curr_max = max({nums[i], nums[i] * prev_max, nums[i] * prev_min});
            int curr_min = min({nums[i], nums[i] * prev_max, nums[i] * prev_min});
            return {curr_max, curr_min};
        };

        for (int i = 0; i < n; i++) {
            auto [curr_max, _] = helper(i);
            result = max(result, curr_max);
        }
        return result;
    }
};
```

### Complexity
- **Time:** O(n!) — repeated recursive calls recompute subproblems
- **Space:** O(n) — recursion stack depth

## Step 2: Memoization (Top-Down DP)
### Code
**Python**
```python
def maxProduct(nums: list[int]) -> int:
    n = len(nums)
    memo_max = {}
    memo_min = {}

    def helper(i):
        if i == 0:
            return (nums[0], nums[0])
        if i in memo_max:
            return (memo_max[i], memo_min[i])
        prev_max, prev_min = helper(i - 1)
        curr_max = max(nums[i], nums[i] * prev_max, nums[i] * prev_min)
        curr_min = min(nums[i], nums[i] * prev_max, nums[i] * prev_min)
        memo_max[i] = curr_max
        memo_min[i] = curr_min
        return (curr_max, curr_min)

    result = float('-inf')
    for i in range(n):
        curr_max, _ = helper(i)
        result = max(result, curr_max)
    return result
```

**C++**
```cpp
class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int n = nums.size();
        unordered_map<int, pair<int,int>> memo;

        function<pair<int,int>(int)> helper = [&](int i) -> pair<int,int> {
            if (i == 0) return {nums[0], nums[0]};
            if (memo.count(i)) return memo[i];
            auto [prev_max, prev_min] = helper(i - 1);
            int curr_max = max({nums[i], nums[i] * prev_max, nums[i] * prev_min});
            int curr_min = min({nums[i], nums[i] * prev_max, nums[i] * prev_min});
            memo[i] = {curr_max, curr_min};
            return memo[i];
        };

        int result = INT_MIN;
        for (int i = 0; i < n; i++) {
            auto [curr_max, _] = helper(i);
            result = max(result, curr_max);
        }
        return result;
    }
};
```

### Complexity
- **Time:** O(n) — each index computed once
- **Space:** O(n) — memoization maps + recursion stack

## Step 3: Tabulation (Bottom-Up DP)
### Code
**Python**
```python
def maxProduct(nums: list[int]) -> int:
    n = len(nums)
    dp_max = [0] * n
    dp_min = [0] * n

    dp_max[0] = nums[0]
    dp_min[0] = nums[0]
    result = nums[0]

    for i in range(1, n):
        candidates = [nums[i], nums[i] * dp_max[i - 1], nums[i] * dp_min[i - 1]]
        dp_max[i] = max(candidates)
        dp_min[i] = min(candidates)
        result = max(result, dp_max[i])

    return result
```

**C++**
```cpp
class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int n = nums.size();
        vector<int> dp_max(n), dp_min(n);

        dp_max[0] = nums[0];
        dp_min[0] = nums[0];
        int result = nums[0];

        for (int i = 1; i < n; i++) {
            dp_max[i] = max({nums[i], nums[i] * dp_max[i - 1], nums[i] * dp_min[i - 1]});
            dp_min[i] = min({nums[i], nums[i] * dp_max[i - 1], nums[i] * dp_min[i - 1]});
            result = max(result, dp_max[i]);
        }
        return result;
    }
};
```

### Complexity
- **Time:** O(n) — single pass
- **Space:** O(n) — two dp arrays

## Step 4: Space Optimization
### Code
**Python**
```python
def maxProduct(nums: list[int]) -> int:
    result = nums[0]
    prev_max = nums[0]
    prev_min = nums[0]

    for i in range(1, len(nums)):
        candidates = [nums[i], nums[i] * prev_max, nums[i] * prev_min]
        curr_max = max(candidates)
        curr_min = min(candidates)
        prev_max, prev_min = curr_max, curr_min
        result = max(result, curr_max)

    return result
```

**C++**
```cpp
class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int result = nums[0];
        int prev_max = nums[0];
        int prev_min = nums[0];

        for (int i = 1; i < nums.size(); i++) {
            int curr_max = max({nums[i], nums[i] * prev_max, nums[i] * prev_min});
            int curr_min = min({nums[i], nums[i] * prev_max, nums[i] * prev_min});
            prev_max = curr_max;
            prev_min = curr_min;
            result = max(result, curr_max);
        }
        return result;
    }
};
```

### Complexity
- **Time:** O(n) — single pass
- **Space:** O(1) — only three variables

## Key Insight
> Track both max and min at each step because a negative min can become the max when multiplied by another negative — this dual tracking is the key to the O(n) solution.

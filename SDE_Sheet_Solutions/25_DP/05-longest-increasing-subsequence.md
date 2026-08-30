# 300. Longest Increasing Subsequence

> **Difficulty:** Hard | **Topic:** Dynamic Programming | **Platform:** LeetCode

---

## Problem Statement
Given an integer array `nums`, return the length of the longest strictly increasing subsequence.

## Examples
**Example 1:**
```
Input: nums = [10,9,2,5,3,7,101,18]
Output: 4
Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.
```

**Example 2:**
```
Input: nums = [0,1,0,3,2,3]
Output: 4
```

**Example 3:**
```
Input: nums = [7,7,7,7,7,7,7]
Output: 1
```

## Constraints
- `1 <= nums.length <= 2500`
- `-10^4 <= nums[i] <= 10^4`

## Topic Tags
`Dynamic Programming` `Binary Search` `Subsequence`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n log n) |
| **Space** | O(n) |

## Intuition
For each element, we look at all previous elements. If a previous element is smaller, we can extend that subsequence. The LIS ending at index `i` equals 1 + max(LIS ending at all valid previous indices). For optimization, we maintain a sorted array where `tails[k]` holds the smallest possible tail of all increasing subsequences of length `k+1`.

## Approach
1. Recursion: try all previous smaller elements and take the max
2. Memoize on index
3. Build dp bottom-up: dp[i] = 1 + max(dp[j]) for all j < i where nums[j] < nums[i]
4. Binary search approach: maintain tails array, use bisect to find insertion point

## Step 1: Recursion
### Code
**Python**
```python
def lengthOfLIS(nums: list[int]) -> int:
    def helper(i):
        best = 1
        for j in range(i):
            if nums[j] < nums[i]:
                best = max(best, 1 + helper(j))
        return best

    return max(helper(i) for i in range(len(nums)))
```

**C++**
```cpp
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        int n = nums.size();
        int result = 0;
        for (int i = 0; i < n; i++) {
            result = max(result, helper(i, nums));
        }
        return result;
    }

    int helper(int i, vector<int>& nums) {
        int best = 1;
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                best = max(best, 1 + helper(j, nums));
            }
        }
        return best;
    }
};
```

### Complexity
- **Time:** O(n!) — overlapping recursive calls
- **Space:** O(n) — recursion stack depth

## Step 2: Memoization (Top-Down DP)
### Code
**Python**
```python
def lengthOfLIS(nums: list[int]) -> int:
    n = len(nums)
    memo = [0] * n

    def helper(i):
        if memo[i]:
            return memo[i]
        memo[i] = 1
        for j in range(i):
            if nums[j] < nums[i]:
                memo[i] = max(memo[i], 1 + helper(j))
        return memo[i]

    return max(helper(i) for i in range(n))
```

**C++**
```cpp
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        int n = nums.size();
        vector<int> memo(n, 0);
        int result = 0;
        for (int i = 0; i < n; i++) {
            result = max(result, helper(i, nums, memo));
        }
        return result;
    }

    int helper(int i, vector<int>& nums, vector<int>& memo) {
        if (memo[i]) return memo[i];
        memo[i] = 1;
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                memo[i] = max(memo[i], 1 + helper(j, nums, memo));
            }
        }
        return memo[i];
    }
};
```

### Complexity
- **Time:** O(n^2) — each index computed once, inner loop up to n
- **Space:** O(n) — memoization array + recursion stack

## Step 3: Tabulation (Bottom-Up DP)
### Code
**Python**
```python
def lengthOfLIS(nums: list[int]) -> int:
    n = len(nums)
    dp = [1] * n

    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)

    return max(dp)
```

**C++**
```cpp
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        int n = nums.size();
        vector<int> dp(n, 1);
        int result = 1;

        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    dp[i] = max(dp[i], dp[j] + 1);
                }
            }
            result = max(result, dp[i]);
        }
        return result;
    }
};
```

### Complexity
- **Time:** O(n^2) — nested loops
- **Space:** O(n) — dp array

## Step 4: Space Optimization
### Code
**Python**
```python
import bisect

def lengthOfLIS(nums: list[int]) -> int:
    tails = []
    for num in nums:
        pos = bisect.bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    return len(tails)
```

**C++**
```cpp
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        for (int num : nums) {
            auto it = lower_bound(tails.begin(), tails.end(), num);
            if (it == tails.end()) {
                tails.push_back(num);
            } else {
                *it = num;
            }
        }
        return tails.size();
    }
};
```

### Complexity
- **Time:** O(n log n) — n iterations, each with O(log n) binary search
- **Space:** O(n) — tails array

## Key Insight
> The greedy + binary search approach maintains the smallest possible tail for each subsequence length, enabling O(n log n) resolution.

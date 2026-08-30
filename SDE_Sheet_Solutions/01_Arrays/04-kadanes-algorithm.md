# 53. Maximum Subarray

> **Difficulty:** Medium | **Topic:** Array, Divide and Conquer, Dynamic Programming | **LeetCode:** [53](https://leetcode.com/problems/maximum-subarray/)

---

## Problem Statement

Given an integer array `nums`, find the subarray with the largest sum, and return its sum.

A **subarray** is a contiguous part of an array.

---

## Examples

**Example 1:**
```
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.
```

**Example 2:**
```
Input: nums = [1]
Output: 1
Explanation: The subarray [1] has the largest sum 1.
```

**Example 3:**
```
Input: nums = [5,4,-1,7,8]
Output: 23
Explanation: The subarray [5,4,-1,7,8] has the largest sum 23.
```

---

## Constraints

- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

---

## Topic Tags

`Array` `Divide and Conquer` `Dynamic Programming`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Intuition

At each position, we have two choices: extend the current subarray or start a new one. If the current sum becomes negative, it's better to start fresh. We track the maximum sum seen so far.

---

## Approach (Kadane's Algorithm)

1. Initialize `current_sum` and `max_sum` with the first element
2. For each subsequent element:
   - Add it to `current_sum`
   - If `current_sum` becomes less than the current element alone, start a new subarray
   - Update `max_sum` if `current_sum` is larger
3. Return `max_sum`

---

## Brute Force

### Approach

Check every possible subarray and track the maximum sum.

### Code

**Python**
```python
class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        max_sum = float('-inf')
        
        for i in range(len(nums)):
            current_sum = 0
            for j in range(i, len(nums)):
                current_sum += nums[j]
                max_sum = max(max_sum, current_sum)
        
        return max_sum
```

**C++**
```cpp
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSum = INT_MIN;
        
        for (int i = 0; i < nums.size(); i++) {
            int currentSum = 0;
            for (int j = i; j < nums.size(); j++) {
                currentSum += nums[j];
                maxSum = max(maxSum, currentSum);
            }
        }
        
        return maxSum;
    }
};
```

### Complexity
- **Time:** O(n²)
- **Space:** O(1)

---

## Optimized Solution (Kadane's Algorithm)

### Approach

Track the maximum sum ending at current position. If it becomes worse than starting fresh, reset.

### Code

**Python**
```python
class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        max_sum = nums[0]
        current_sum = nums[0]
        
        for i in range(1, len(nums)):
            current_sum = max(nums[i], current_sum + nums[i])
            max_sum = max(max_sum, current_sum)
        
        return max_sum
```

**C++**
```cpp
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];
        
        for (int i = 1; i < nums.size(); i++) {
            currentSum = max(nums[i], currentSum + nums[i]);
            maxSum = max(maxSum, currentSum);
        }
        
        return maxSum;
    }
};
```

### Complexity
- **Time:** O(n)
- **Space:** O(1)

---

## Key Insight

> At each step, either extend the current subarray or start fresh. If the running sum is negative, it's better to start over from the current element.

# 1. Two Sum

> **Difficulty:** Easy | **Topic:** Array, Hash Table | **LeetCode:** [1](https://leetcode.com/problems/two-sum/)

---

## Problem Statement

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

---

## Examples

**Example 1:**
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1]
```

**Example 2:**
```
Input: nums = [3,2,4], target = 6
Output: [1,2]
```

---

## Constraints

- `2 <= nums.length <= 10^4`
- `-10^9 <= nums[i] <= 10^9`
- `-10^9 <= target <= 10^9`
- Only one valid answer exists.

---

## Topic Tags

`Array` `Hash Table`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) |

---

## Intuition

Use a hash map to store seen numbers and their indices. For each number, check if `target - num` exists in the map.

---

## Approach

1. Create an empty hash map
2. For each element, calculate complement = target - nums[i]
3. If complement exists in map, return both indices
4. Otherwise, add current element to map

---

## Optimized Solution

### Code

**Python**
```python
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        
        return []
```

**C++**
```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.count(complement))
                return {seen[complement], i};
            seen[nums[i]] = i;
        }
        
        return {};
    }
};
```

### Complexity
- **Time:** O(n)
- **Space:** O(n)

---

## Key Insight

> Use a hash map to store seen numbers. For each number, check if its complement (target - current) exists in the map for O(1) lookup.

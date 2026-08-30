# 169. Majority Element

> **Difficulty:** Easy | **Topic:** Array, Hash Table, Sorting, Divide and Conquer | **LeetCode:** [169](https://leetcode.com/problems/majority-element/)

---

## Problem Statement

Given an array `nums` of size `n`, return the majority element. The majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.

---

## Examples

**Example 1:**
```
Input: nums = [3,2,3]
Output: 3
```

**Example 2:**
```
Input: nums = [2,2,1,1,1,2,2]
Output: 2
```

---

## Constraints

- `n == nums.length`
- `1 <= n <= 5 * 10^4`
- `-10^9 <= nums[i] <= 10^9`

---

## Topic Tags

`Array` `Hash Table` `Sorting` `Divide and Conquer`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Intuition

Use Boyer-Moore Voting Algorithm. Maintain a candidate and count. When count reaches 0, pick a new candidate. The majority element will survive because it appears more than n/2 times.

---

## Approach (Boyer-Moore Voting Algorithm)

1. Initialize `candidate = nums[0]`, `count = 1`
2. For each element:
   - If count is 0, set candidate to current element
   - If current element equals candidate, increment count
   - Otherwise, decrement count
3. Return candidate

---

## Optimized Solution

### Code

**Python**
```python
class Solution:
    def majorityElement(self, nums: list[int]) -> int:
        candidate = nums[0]
        count = 1
        
        for i in range(1, len(nums)):
            if nums[i] == candidate:
                count += 1
            elif count == 0:
                candidate = nums[i]
                count = 1
            else:
                count -= 1
        
        return candidate
```

**C++**
```cpp
class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int candidate = nums[0];
        int count = 1;
        
        for (int i = 1; i < nums.size(); i++) {
            if (nums[i] == candidate)
                count++;
            else if (count == 0) {
                candidate = nums[i];
                count = 1;
            } else
                count--;
        }
        
        return candidate;
    }
};
```

### Complexity
- **Time:** O(n)
- **Space:** O(1)

---

## Key Insight

> Boyer-Moore Voting Algorithm works because the majority element appears more than n/2 times, so it will always be the final candidate after all cancellations.

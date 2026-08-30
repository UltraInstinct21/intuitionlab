# 229. Majority Element II

> **Difficulty:** Medium | **Topic:** Array, Hash Table, Counting | **LeetCode:** [229](https://leetcode.com/problems/majority-element-ii/)

---

## Problem Statement

Given an integer array of size `n`, find all elements that appear more than `⌊n/3⌋` times.

---

## Examples

**Example 1:**
```
Input: nums = [3,2,3]
Output: [3]
```

**Example 2:**
```
Input: nums = [1,1,1,3,3,2,2,2]
Output: [1,2]
```

---

## Constraints

- `1 <= nums.length <= 5 * 10^4`
- `-10^9 <= nums[i] <= 10^9`

---

## Topic Tags

`Array` `Hash Table` `Counting`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Intuition

At most 2 elements can appear more than n/3 times. Use Boyer-Moore Voting Algorithm with two candidates.

---

## Approach

1. Find two potential candidates using Boyer-Moore Voting
2. Verify if they actually appear more than n/3 times
3. Return verified candidates

---

## Optimized Solution

### Code

**Python**
```python
class Solution:
    def majorityElement(self, nums: list[int]) -> list[int]:
        if not nums:
            return []
        
        # Step 1: Find two candidates
        candidate1, candidate2 = None, None
        count1, count2 = 0, 0
        
        for num in nums:
            if candidate1 == num:
                count1 += 1
            elif candidate2 == num:
                count2 += 1
            elif count1 == 0:
                candidate1, count1 = num, 1
            elif count2 == 0:
                candidate2, count2 = num, 1
            else:
                count1 -= 1
                count2 -= 1
        
        # Step 2: Verify candidates
        result = []
        threshold = len(nums) // 3
        
        if count1 > 0 and nums.count(candidate1) > threshold:
            result.append(candidate1)
        if count2 > 0 and nums.count(candidate2) > threshold:
            result.append(candidate2)
        
        return result
```

**C++**
```cpp
class Solution {
public:
    vector<int> majorityElement(vector<int>& nums) {
        int candidate1 = 0, candidate2 = 0;
        int count1 = 0, count2 = 0;
        
        for (int num : nums) {
            if (candidate1 == num) count1++;
            else if (candidate2 == num) count2++;
            else if (count1 == 0) { candidate1 = num; count1 = 1; }
            else if (count2 == 0) { candidate2 = num; count2 = 1; }
            else { count1--; count2--; }
        }
        
        vector<int> result;
        int threshold = nums.size() / 3;
        
        count1 = count2 = 0;
        for (int num : nums) {
            if (num == candidate1) count1++;
            else if (num == candidate2) count2++;
        }
        
        if (count1 > threshold) result.push_back(candidate1);
        if (count2 > threshold) result.push_back(candidate2);
        
        return result;
    }
};
```

### Complexity
- **Time:** O(n)
- **Space:** O(1)

---

## Key Insight

> At most 2 elements can appear more than n/3 times. Use two pairs of candidate+count to track potential majority elements, then verify.

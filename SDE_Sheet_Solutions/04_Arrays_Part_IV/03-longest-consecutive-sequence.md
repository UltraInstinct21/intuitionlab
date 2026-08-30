# 128. Longest Consecutive Sequence

> **Difficulty:** Medium | **Topic:** Array, Hash Table, Union Find | **LeetCode:** [128](https://leetcode.com/problems/longest-consecutive-sequence/)

---

## Problem Statement

Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in `O(n)` time.

---

## Examples

**Example 1:**
```
Input: nums = [100,4,200,1,3,2]
Output: 4
Explanation: The longest consecutive elements sequence is [1, 2, 3, 4].
```

**Example 2:**
```
Input: nums = [0,3,7,2,5,8,4,6,0,1]
Output: 9
```

---

## Constraints

- `0 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`

---

## Topic Tags

`Array` `Hash Table` `Union Find`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) |

---

## Intuition

Use a hash set for O(1) lookups. For each number, check if it's the start of a sequence (num-1 not in set), then count the sequence length.

---

## Approach

1. Add all numbers to a hash set
2. For each number, if num-1 is not in set, it's a sequence start
3. Count consecutive numbers from that start
4. Track the maximum length

---

## Optimized Solution

### Code

**Python**
```python
class Solution:
    def longestConsecutive(self, nums: list[int]) -> int:
        num_set = set(nums)
        max_length = 0
        
        for num in num_set:
            if num - 1 not in num_set:
                current = num
                length = 1
                
                while current + 1 in num_set:
                    current += 1
                    length += 1
                
                max_length = max(max_length, length)
        
        return max_length
```

**C++**
```cpp
class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> numSet(nums.begin(), nums.end());
        int maxLength = 0;
        
        for (int num : numSet) {
            if (numSet.find(num - 1) == numSet.end()) {
                int current = num;
                int length = 1;
                
                while (numSet.find(current + 1) != numSet.end()) {
                    current++;
                    length++;
                }
                
                maxLength = max(maxLength, length);
            }
        }
        
        return maxLength;
    }
};
```

### Complexity
- **Time:** O(n)
- **Space:** O(n)

---

## Key Insight

> Only start counting from the beginning of a sequence (where num-1 is not in the set). This ensures each element is visited at most twice, giving O(n) time.

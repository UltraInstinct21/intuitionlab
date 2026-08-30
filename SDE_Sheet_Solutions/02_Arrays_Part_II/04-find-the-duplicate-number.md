# 287. Find the Duplicate Number

> **Difficulty:** Medium | **Topic:** Array, Two Pointers, Binary Search | **LeetCode:** [287](https://leetcode.com/problems/find-the-duplicate-number/)

---

## Problem Statement

Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive.

There is only **one repeated number** in `nums`, return this repeated number.

You must solve the problem without modifying the array `nums` and using only constant extra space.

---

## Examples

**Example 1:**
```
Input: nums = [1,3,4,2,2]
Output: 2
```

**Example 2:**
```
Input: nums = [3,1,3,4,2]
Output: 3
```

**Example 3:**
```
Input: nums = [1,1]
Output: 1
```

---

## Constraints

- `1 <= n <= 10^5`
- `nums.length == n + 1`
- `1 <= nums[i] <= n`
- All the integers in `nums` appear only **once** except for precisely one element which appears two or more times.

---

## Topic Tags

`Array` `Two Pointers` `Binary Search`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Intuition

The array can be treated as a linked list where `nums[i]` is the next node. A duplicate creates a cycle. Use Floyd's cycle detection to find the cycle entrance, which is the duplicate number.

---

## Approach (Floyd's Cycle Detection)

1. Use two pointers: slow moves one step, fast moves two steps
2. Find the intersection point inside the cycle
3. Reset one pointer to start and move both one step at a time
4. The meeting point is the duplicate number

---

## Brute Force

### Approach

Use a hash set to track seen numbers.

### Code

**Python**
```python
class Solution:
    def findDuplicate(self, nums: list[int]) -> int:
        seen = set()
        for num in nums:
            if num in seen:
                return num
            seen.add(num)
```

**C++**
```cpp
class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int num : nums) {
            if (seen.count(num))
                return num;
            seen.insert(num);
        }
        return -1;
    }
};
```

### Complexity
- **Time:** O(n)
- **Space:** O(n)

---

## Optimized Solution (Floyd's Cycle Detection)

### Code

**Python**
```python
class Solution:
    def findDuplicate(self, nums: list[int]) -> int:
        slow = nums[0]
        fast = nums[0]
        
        # Find intersection point
        while True:
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break
        
        # Find entrance to cycle
        slow = nums[0]
        while slow != fast:
            slow = nums[slow]
            fast = nums[fast]
        
        return slow
```

**C++**
```cpp
class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int slow = nums[0];
        int fast = nums[0];
        
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        
        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        
        return slow;
    }
};
```

### Complexity
- **Time:** O(n)
- **Space:** O(1)

---

## Key Insight

> Treat the array as a linked list where `nums[i]` points to the next index. A duplicate creates a cycle. Floyd's algorithm finds the cycle entrance, which is the duplicate.

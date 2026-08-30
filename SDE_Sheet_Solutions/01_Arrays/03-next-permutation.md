# 31. Next Permutation

> **Difficulty:** Medium | **Topic:** Array, Two Pointers | **LeetCode:** [31](https://leetcode.com/problems/next-permutation/)

---

## Problem Statement

A **permutation** of an array of integers is an arrangement of its members into a sequence or linear order.

The **next permutation** of an array of integers is the next lexicographically greater permutation of its integer. If such arrangement is not possible, the array must be rearranged as the lowest possible order (sorted in ascending order).

The replacement must be **in place** and use only constant extra memory.

---

## Examples

**Example 1:**
```
Input: nums = [1,2,3]
Output: [1,3,2]
```

**Example 2:**
```
Input: nums = [3,2,1]
Output: [1,2,3]
```

**Example 3:**
```
Input: nums = [1,1,5]
Output: [1,5,1]
```

---

## Constraints

- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 100`

---

## Topic Tags

`Array` `Two Pointers`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Intuition

To find the next permutation, we need to find the smallest change that makes the array larger. The key insight is:
1. Find the rightmost element that is smaller than its next element (the "pivot")
2. Find the smallest element to the right of pivot that is larger than pivot
3. Swap them
4. Reverse the suffix after the pivot position

---

## Approach

1. Scan from right to left to find the first pair where `nums[i] < nums[i+1]` (the pivot)
2. If no such pair exists, the array is in descending order — reverse entire array
3. Otherwise, find the rightmost element `nums[j]` such that `nums[j] > nums[i]`
4. Swap `nums[i]` and `nums[j]`
5. Reverse all elements from `i+1` to end

---

## Brute Force

### Approach

Generate all permutations, sort them, find the current permutation's index, and return the next one. This is O(n! × n) and not practical.

### Code

**Python**
```python
from itertools import permutations

class Solution:
    def nextPermutation(self, nums: list[int]) -> None:
        perms = sorted(set(permutations(nums)))
        idx = perms.index(tuple(nums))
        next_perm = perms[(idx + 1) % len(perms)]
        nums[:] = list(next_perm)
```

**C++**
```cpp
class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        next_permutation(nums.begin(), nums.end());
    }
};
```

### Complexity
- **Time:** O(n! × n) for brute force, O(n) for built-in
- **Space:** O(n)

---

## Optimized Solution

### Approach

Three-step algorithm: find pivot, swap with next greater, reverse suffix.

### Code

**Python**
```python
class Solution:
    def nextPermutation(self, nums: list[int]) -> None:
        n = len(nums)
        
        # Step 1: Find pivot (rightmost i where nums[i] < nums[i+1])
        i = n - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1
        
        # Step 2: Find rightmost element greater than pivot
        if i >= 0:
            j = n - 1
            while nums[j] <= nums[i]:
                j -= 1
            nums[i], nums[j] = nums[j], nums[i]
        
        # Step 3: Reverse suffix
        nums[i + 1:] = nums[i + 1:][::-1]
```

**C++**
```cpp
class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        int n = nums.size();
        int i = n - 2;
        
        while (i >= 0 && nums[i] >= nums[i + 1])
            i--;
        
        if (i >= 0) {
            int j = n - 1;
            while (nums[j] <= nums[i])
                j--;
            swap(nums[i], nums[j]);
        }
        
        reverse(nums.begin() + i + 1, nums.end());
    }
};
```

### Complexity
- **Time:** O(n)
- **Space:** O(1)

---

## Key Insight

> Find the rightmost "dip" where order breaks, swap with the smallest larger element to the right, then reverse the suffix to get the smallest possible arrangement.

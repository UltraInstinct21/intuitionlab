# 75. Sort Colors

> **Difficulty:** Medium | **Topic:** Array, Two Pointers, Sorting | **LeetCode:** [75](https://leetcode.com/problems/sort-colors/)

---

## Problem Statement

Given an array `nums` with `n` objects colored red, white, or blue, sort them **in-place** so that objects of the same color are adjacent, with the colors in the order red, white, and blue.

We will use the integers `0`, `1`, and `2` to represent the color red, white, and blue, respectively.

You must solve this problem without using the library's sort function.

---

## Examples

**Example 1:**
```
Input: nums = [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]
```

**Example 2:**
```
Input: nums = [2,0,1]
Output: [0,1,2]
```

---

## Constraints

- `n == nums.length`
- `1 <= n <= 300`
- `nums[i]` is either `0`, `1`, or `2`

---

## Topic Tags

`Array` `Two Pointers` `Sorting`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Intuition

This is the classic **Dutch National Flag problem**. We need to partition the array into three regions in a single pass:
- `[0..low-1]` → all 0s
- `[low..mid-1]` → all 1s
- `[high+1..n-1]` → all 2s

The unknown region `[mid..high]` is processed one element at a time.

---

## Approach (Dutch National Flag Algorithm)

1. Initialize three pointers: `low = 0`, `mid = 0`, `high = n - 1`
2. While `mid <= high`:
   - If `nums[mid] == 0`: swap with `nums[low]`, increment both `low` and `mid`
   - If `nums[mid] == 1`: just increment `mid`
   - If `nums[mid] == 2`: swap with `nums[high]`, decrement `high` (don't increment `mid`)
3. Array is sorted in-place

---

## Brute Force

### Approach

Use any standard sorting algorithm.

### Code

**Python**
```python
class Solution:
    def sortColors(self, nums: list[int]) -> None:
        nums.sort()
```

**C++**
```cpp
class Solution {
public:
    void sortColors(vector<int>& nums) {
        sort(nums.begin(), nums.end());
    }
};
```

### Complexity
- **Time:** O(n log n)
- **Space:** O(1)

---

## Better Solution (Counting Sort)

### Approach

Count occurrences of 0, 1, 2, then overwrite the array.

### Code

**Python**
```python
class Solution:
    def sortColors(self, nums: list[int]) -> None:
        zeros = ones = twos = 0
        
        for num in nums:
            if num == 0: zeros += 1
            elif num == 1: ones += 1
            else: twos += 1
        
        i = 0
        for _ in range(zeros):
            nums[i] = 0; i += 1
        for _ in range(ones):
            nums[i] = 1; i += 1
        for _ in range(twos):
            nums[i] = 2; i += 1
```

**C++**
```cpp
class Solution {
public:
    void sortColors(vector<int>& nums) {
        int zeros = 0, ones = 0, twos = 0;
        
        for (int num : nums) {
            if (num == 0) zeros++;
            else if (num == 1) ones++;
            else twos++;
        }
        
        int i = 0;
        while (zeros--) nums[i++] = 0;
        while (ones--) nums[i++] = 1;
        while (twos--) nums[i++] = 2;
    }
};
```

### Complexity
- **Time:** O(n) — two passes
- **Space:** O(1)

---

## Optimized Solution (Dutch National Flag)

### Approach

Three pointers to partition in a single pass.

### Code

**Python**
```python
class Solution:
    def sortColors(self, nums: list[int]) -> None:
        low, mid, high = 0, 0, len(nums) - 1
        
        while mid <= high:
            if nums[mid] == 0:
                nums[low], nums[mid] = nums[mid], nums[low]
                low += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            else:
                nums[mid], nums[high] = nums[high], nums[mid]
                high -= 1
```

**C++**
```cpp
class Solution {
public:
    void sortColors(vector<int>& nums) {
        int low = 0, mid = 0, high = nums.size() - 1;
        
        while (mid <= high) {
            if (nums[mid] == 0) {
                swap(nums[low], nums[mid]);
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                swap(nums[mid], nums[high]);
                high--;
            }
        }
    }
};
```

### Complexity
- **Time:** O(n) — single pass
- **Space:** O(1)

---

## Key Insight

> Use three pointers to maintain three regions. When you see a 2, swap it to the end and don't advance mid (the swapped element needs checking). When you see a 0, swap to the front and advance both low and mid.

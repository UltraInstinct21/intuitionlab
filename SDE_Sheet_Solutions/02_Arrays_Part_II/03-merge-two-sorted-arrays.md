# 88. Merge Sorted Array

> **Difficulty:** Easy | **Topic:** Array, Two Pointers, Sorting | **LeetCode:** [88](https://leetcode.com/problems/merge-sorted-array/)

---

## Problem Statement

You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.

Merge `nums1` and `nums2` into a single array sorted in non-decreasing order.

The final sorted array should not be returned by the function, but instead be stored inside the array `nums1`. To accommodate this, `nums1` has a length of `m + n`, where the first `m` elements denote the elements that should be merged, and the last `n` elements are set to `0` and should be ignored.

---

## Examples

**Example 1:**
```
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
Explanation: The arrays we are merging are [1,2,3] and [2,5,6].
```

**Example 2:**
```
Input: nums1 = [1], m = 1, nums2 = [], n = 0
Output: [1]
```

---

## Constraints

- `nums1.length == m + n`
- `nums2.length == n`
- `0 <= m, n <= 200`
- `1 <= m + n <= 200`
- `-10^9 <= nums1[i], nums2[j] <= 10^9`

---

## Topic Tags

`Array` `Two Pointers` `Sorting`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(m + n) |
| **Space** | O(1) |

---

## Intuition

Merge from the end to avoid overwriting elements in nums1. Start from the last valid elements of both arrays and place them at the end of nums1.

---

## Approach

1. Start with pointers at the end of valid elements: `i = m-1`, `j = n-1`, `k = m+n-1`
2. Compare elements and place the larger one at position k
3. Move pointers accordingly
4. Copy remaining elements from nums2 if any

---

## Optimized Solution

### Code

**Python**
```python
class Solution:
    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:
        i, j, k = m - 1, n - 1, m + n - 1
        
        while i >= 0 and j >= 0:
            if nums1[i] > nums2[j]:
                nums1[k] = nums1[i]
                i -= 1
            else:
                nums1[k] = nums2[j]
                j -= 1
            k -= 1
        
        while j >= 0:
            nums1[k] = nums2[j]
            j -= 1
            k -= 1
```

**C++**
```cpp
class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;
        
        while (i >= 0 && j >= 0) {
            if (nums1[i] > nums2[j])
                nums1[k--] = nums1[i--];
            else
                nums1[k--] = nums2[j--];
        }
        
        while (j >= 0)
            nums1[k--] = nums2[j--];
    }
};
```

### Complexity
- **Time:** O(m + n)
- **Space:** O(1)

---

## Key Insight

> Merge from the back to avoid overwriting. This allows O(1) space since nums1 already has enough room.

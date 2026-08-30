# 493. Reverse Pairs

> **Difficulty:** Hard | **Topic:** Array, Binary Search, Divide and Conquer, Merge Sort | **LeetCode:** [493](https://leetcode.com/problems/reverse-pairs/)

---

## Problem Statement

Given an integer array `nums`, return the number of **reverse pairs** in the array.

A **reverse pair** is a pair `(i, j)` where:
- `0 <= i < j < nums.length` and
- `nums[i] > 2 * nums[j]`

---

## Examples

**Example 1:**
```
Input: nums = [1,3,2,3,1]
Output: 2
Explanation: The reverse pairs are:
(1, 4) --> nums[1] = 3, nums[4] = 1, 3 > 2 * 1
(3, 4) --> nums[3] = 3, nums[4] = 1, 3 > 2 * 1
```

**Example 2:**
```
Input: nums = [2,4,3,5,1]
Output: 3
Explanation: The reverse pairs are:
(1, 4) --> nums[1] = 4, nums[4] = 1, 4 > 2 * 1
(2, 4) --> nums[2] = 3, nums[4] = 1, 3 > 2 * 1
(3, 4) --> nums[3] = 5, nums[4] = 1, 5 > 2 * 1
```

---

## Constraints

- `1 <= nums.length <= 5 * 10^4`
- `-2^31 <= nums[i] <= 2^31 - 1`

---

## Topic Tags

`Array` `Binary Search` `Divide and Conquer` `Merge Sort`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n log n) |
| **Space** | O(n) |

---

## Intuition

Similar to counting inversions. During merge sort, count pairs where left element > 2 * right element. Use binary search to count such pairs efficiently.

---

## Approach

1. Use modified merge sort
2. During merge step, count reverse pairs using binary search
3. For each element in left half, find how many elements in right half satisfy `nums[i] > 2 * nums[j]`

---

## Optimized Solution

### Code

**Python**
```python
class Solution:
    def reversePairs(self, nums: list[int]) -> int:
        def mergeSort(arr, left, right):
            if left >= right:
                return 0
            
            mid = (left + right) // 2
            count = mergeSort(arr, left, mid) + mergeSort(arr, mid + 1, right)
            
            # Count reverse pairs
            j = mid + 1
            for i in range(left, mid + 1):
                while j <= right and arr[i] > 2 * arr[j]:
                    j += 1
                count += j - (mid + 1)
            
            # Merge
            temp = []
            i, j = left, mid + 1
            while i <= mid and j <= right:
                if arr[i] <= arr[j]:
                    temp.append(arr[i])
                    i += 1
                else:
                    temp.append(arr[j])
                    j += 1
            
            while i <= mid:
                temp.append(arr[i])
                i += 1
            while j <= right:
                temp.append(arr[j])
                j += 1
            
            for i in range(len(temp)):
                arr[left + i] = temp[i]
            
            return count
        
        return mergeSort(nums, 0, len(nums) - 1)
```

**C++**
```cpp
class Solution {
public:
    int reversePairs(vector<int>& nums) {
        return mergeSort(nums, 0, nums.size() - 1);
    }
    
    int mergeSort(vector<int>& nums, int left, int right) {
        if (left >= right) return 0;
        
        int mid = left + (right - left) / 2;
        int count = mergeSort(nums, left, mid) + mergeSort(nums, mid + 1, right);
        
        // Count reverse pairs
        int j = mid + 1;
        for (int i = left; i <= mid; i++) {
            while (j <= right && (long long)nums[i] > 2LL * nums[j])
                j++;
            count += j - (mid + 1);
        }
        
        // Merge
        vector<int> temp;
        int i = left;
        j = mid + 1;
        while (i <= mid && j <= right) {
            if (nums[i] <= nums[j])
                temp.push_back(nums[i++]);
            else
                temp.push_back(nums[j++]);
        }
        while (i <= mid) temp.push_back(nums[i++]);
        while (j <= right) temp.push_back(nums[j++]);
        
        for (int k = 0; k < temp.size(); k++)
            nums[left + k] = temp[k];
        
        return count;
    }
};
```

### Complexity
- **Time:** O(n log n)
- **Space:** O(n)

---

## Key Insight

> During merge sort, use two pointers to count pairs where left element > 2 * right element. The sorted halves allow efficient counting.

# Single Element in Sorted Array

> **Difficulty:** Medium | **Topic:** Binary Search, Bit Manipulation | **Platform:** LeetCode

---

## Problem Statement
You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once.

Find the single element that appears only once. Your solution should run in O(log n) time complexity and O(1) space complexity.

## Examples
**Example 1:**
```
Input: nums = [1,1,2,3,3,4,4,8,8]
Output: 2
```

**Example 2:**
```
Input: nums = [3,3,7,7,10,11,11]
Output: 10
```

## Constraints
- 1 <= nums.length <= 10^5
- 0 <= nums[i] <= 10^5
- Each element in the array appears exactly twice except for one element which appears once

## Topic Tags
`Binary Search` `Array` `Bit Manipulation`

## Expected Complexities
| | |
|---|---|
| **Time** | O(log n) |
| **Space** | O(1) |

## Intuition
Before the single element, pairs appear at indices (even, odd). After the single element, pairs appear at indices (odd, even). We can binary search on the index and check which side the single element lies on by comparing `nums[mid]` with `nums[mid ^ 1]` (its expected pair partner).

If `nums[mid] == nums[mid ^ 1]`, then the left side is correct and the single element is on the right. Otherwise, the single element is on the left.

## Approach
1. Set `low = 0`, `high = len(nums) - 1`.
2. While `low < high`:
   - Compute `mid = (low + high) // 2`.
   - If `mid` is even, check if `nums[mid] == nums[mid + 1]`.
   - If `mid` is odd, check if `nums[mid] == nums[mid - 1]`.
   - If the pair is intact (left half is correct), the single element is on the right: `low = mid + 1`.
   - Otherwise, the single element is on the left: `high = mid - 1`.
3. Return `nums[low]`.

## Brute Force
### Approach
XOR all elements. Since all pairs cancel out, the result is the single element.

### Code
**Python**
```python
def singleNonDuplicate(nums):
    result = 0
    for num in nums:
        result ^= num
    return result
```

**C++**
```cpp
int singleNonDuplicate(vector<int>& nums) {
    int result = 0;
    for (int num : nums)
        result ^= num;
    return result;
}
```

### Complexity
- **Time:** O(n) - iterating through all elements
- **Space:** O(1)

## Optimized Solution
### Code
**Python**
```python
def singleNonDuplicate(nums):
    low, high = 0, len(nums) - 1
    while low < high:
        mid = (low + high) // 2
        if nums[mid] == nums[mid ^ 1]:
            low = mid + 1
        else:
            high = mid
    return nums[low]
```

**C++**
```cpp
int singleNonDuplicate(vector<int>& nums) {
    int low = 0, high = nums.size() - 1;
    while (low < high) {
        int mid = (low + high) / 2;
        if (nums[mid] == nums[mid ^ 1])
            low = mid + 1;
        else
            high = mid;
    }
    return nums[low];
}
```

### Complexity
- **Time:** O(log n) - binary search
- **Space:** O(1)

## Key Insight
> Before the single element, pairs are at (even, odd) indices; after, they're at (odd, even). Using `mid ^ 1` flips the last bit, finding the expected pair partner in O(1).

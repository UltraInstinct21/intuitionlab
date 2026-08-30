# Search in Rotated Sorted Array

> **Difficulty:** Medium | **Topic:** Binary Search, Array | **Platform:** LeetCode

---

## Problem Statement
There is an integer array `nums` sorted in ascending order (with distinct values). The array is possibly rotated at an unknown pivot index `k` such that the resulting array is `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]`.

Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` in `nums`, or -1 if it does not exist.

## Examples
**Example 1:**
```
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
```

**Example 2:**
```
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1
```

**Example 3:**
```
Input: nums = [1], target = 0
Output: -1
```

## Constraints
- 1 <= nums.length <= 5000
- -10^4 <= nums[i] <= 10^4
- All values of nums are unique
- nums is an ascending array that is possibly rotated

## Topic Tags
`Binary Search` `Array`

## Expected Complexities
| | |
|---|---|
| **Time** | O(log n) |
| **Space** | O(1) |

## Intuition
Even though the array is rotated, at any point one of the two halves (left or right of `mid`) is guaranteed to be sorted. We can identify which half is sorted by comparing `nums[low]` with `nums[mid]`, then determine if the target lies within that sorted half.

## Approach
1. Set `low = 0`, `high = len(nums) - 1`.
2. While `low <= high`:
   - Compute `mid = (low + high) // 2`.
   - If `nums[mid] == target`, return `mid`.
   - Check if the left half `[low, mid]` is sorted (`nums[low] <= nums[mid]`).
     - If yes and `target` is in range `[nums[low], nums[mid])`, search left: `high = mid - 1`.
     - Otherwise, search right: `low = mid + 1`.
   - Check if the right half `[mid, high]` is sorted (`nums[mid] <= nums[high]`).
     - If yes and `target` is in range `(nums[mid], nums[high]]`, search right: `low = mid + 1`.
     - Otherwise, search left: `high = mid - 1`.
3. Return -1 if not found.

## Brute Force
### Approach
Linearly scan the array to find the target.

### Code
**Python**
```python
def search(nums, target):
    for i, num in enumerate(nums):
        if num == target:
            return i
    return -1
```

**C++**
```cpp
int search(vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); i++)
        if (nums[i] == target) return i;
    return -1;
}
```

### Complexity
- **Time:** O(n) - linear scan
- **Space:** O(1)

## Optimized Solution
### Code
**Python**
```python
def search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid

        if nums[low] <= nums[mid]:
            if nums[low] <= target < nums[mid]:
                high = mid - 1
            else:
                low = mid + 1
        else:
            if nums[mid] < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1
    return -1
```

**C++**
```cpp
int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (nums[mid] == target) return mid;

        if (nums[low] <= nums[mid]) {
            if (nums[low] <= target && target < nums[mid])
                high = mid - 1;
            else
                low = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[high])
                low = mid + 1;
            else
                high = mid - 1;
        }
    }
    return -1;
}
```

### Complexity
- **Time:** O(log n) - binary search
- **Space:** O(1)

## Key Insight
> At least one half of the array (left or right of mid) is always sorted. By checking which half is sorted and whether the target lies in that range, we can binary search efficiently in O(log n).

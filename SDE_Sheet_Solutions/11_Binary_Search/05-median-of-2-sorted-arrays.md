# Median of Two Sorted Arrays

> **Difficulty:** Hard | **Topic:** Binary Search, Divide and Conquer | **Platform:** LeetCode

---

## Problem Statement
Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log(m+n)).

## Examples
**Example 1:**
```
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2] and median is 2.
```

**Example 2:**
```
Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: merged array = [1,2,3,4] and median is (2+3)/2 = 2.5.
```

## Constraints
- nums1.length == m
- nums2.length == n
- 0 <= m <= 1000
- 0 <= n <= 1000
- 1 <= m + n <= 2000
- -10^6 <= nums1[i], nums2[i] <= 10^6

## Topic Tags
`Binary Search` `Array` `Divide and Conquer` `Sorting`

## Expected Complexities
| | |
|---|---|
| **Time** | O(log(min(m, n))) |
| **Space** | O(1) |

## Intuition
We binary search on the partition of the smaller array. We split both arrays such that the left half contains exactly `(m + n + 1) / 2` elements. The median is then derived from the boundary elements of the two halves.

By ensuring we always binary search on the smaller array, we guarantee O(log(min(m,n))) time complexity.

## Approach
1. Ensure `nums1` is the smaller array (swap if needed).
2. Binary search on `cut1` in range `[0, m]` where `cut1` is the number of elements from `nums1` in the left half.
3. Compute `cut2 = (m + n + 1) / 2 - cut1`.
4. Define `left1`, `left2`, `right1`, `right2` as the boundary elements.
5. If `left1 <= right2` and `left2 <= right1`, we found the correct partition.
6. If `left1 > right2`, move left: `high = cut1 - 1`.
7. If `left2 > right1`, move right: `low = cut1 + 1`.
8. Compute median from the boundary values.

## Brute Force
### Approach
Merge both arrays into a single sorted array and return the median.

### Code
**Python**
```python
def findMedianSortedArrays(nums1, nums2):
    merged = sorted(nums1 + nums2)
    n = len(merged)
    if n % 2 == 1:
        return merged[n // 2]
    return (merged[n // 2 - 1] + merged[n // 2]) / 2.0
```

**C++**
```cpp
double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    vector<int> merged;
    merge(nums1.begin(), nums1.end(), nums2.begin(), nums2.end(), back_inserter(merged));
    int n = merged.size();
    if (n % 2 == 1) return merged[n / 2];
    return (merged[n / 2 - 1] + merged[n / 2]) / 2.0;
}
```

### Complexity
- **Time:** O(m + n) - merge operation
- **Space:** O(m + n)

## Optimized Solution
### Code
**Python**
```python
def findMedianSortedArrays(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1

    m, n = len(nums1), len(nums2)
    half = (m + n + 1) // 2
    low, high = 0, m

    while low <= high:
        cut1 = (low + high) // 2
        cut2 = half - cut1

        left1 = nums1[cut1 - 1] if cut1 > 0 else float('-inf')
        right1 = nums1[cut1] if cut1 < m else float('inf')
        left2 = nums2[cut2 - 1] if cut2 > 0 else float('-inf')
        right2 = nums2[cut2] if cut2 < n else float('inf')

        if left1 <= right2 and left2 <= right1:
            if (m + n) % 2 == 1:
                return max(left1, left2)
            return (max(left1, left2) + min(right1, right2)) / 2.0
        elif left1 > right2:
            high = cut1 - 1
        else:
            low = cut1 + 1

    return 0.0
```

**C++**
```cpp
double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    if (nums1.size() > nums2.size())
        swap(nums1, nums2);

    int m = nums1.size(), n = nums2.size();
    int half = (m + n + 1) / 2;
    int low = 0, high = m;

    while (low <= high) {
        int cut1 = (low + high) / 2;
        int cut2 = half - cut1;

        int left1  = cut1 > 0   ? nums1[cut1 - 1] : INT_MIN;
        int right1 = cut1 < m   ? nums1[cut1]     : INT_MAX;
        int left2  = cut2 > 0   ? nums2[cut2 - 1] : INT_MIN;
        int right2 = cut2 < n   ? nums2[cut2]     : INT_MAX;

        if (left1 <= right2 && left2 <= right1) {
            if ((m + n) % 2 == 1)
                return max(left1, left2);
            return (max(left1, left2) + min(right1, right2)) / 2.0;
        } else if (left1 > right2) {
            high = cut1 - 1;
        } else {
            low = cut1 + 1;
        }
    }
    return 0.0;
}
```

### Complexity
- **Time:** O(log(min(m, n))) - binary search on smaller array
- **Space:** O(1)

## Key Insight
> By always binary searching on the smaller array and ensuring the left half has exactly `(m+n+1)/2` elements, we find the correct partition in O(log(min(m,n))) without merging.

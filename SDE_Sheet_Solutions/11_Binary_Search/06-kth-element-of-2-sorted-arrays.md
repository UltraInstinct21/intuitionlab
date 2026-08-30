# Kth Element of Two Sorted Arrays

> **Difficulty:** Medium | **Topic:** Binary Search, Array | **Platform:** GeeksforGeeks

---

## Problem Statement
Given two sorted arrays `arr1` and `arr2` of size `n` and `m` respectively, return the element that would be at the k-th position (1-indexed) of the sorted merged array.

## Examples
**Example 1:**
```
Input: arr1 = [2, 3, 6, 7, 9], arr2 = [1, 4, 8, 10], k = 5
Output: 6
Explanation: Merged array = [1, 2, 3, 4, 6, 7, 8, 9, 10], 5th element is 6.
```

**Example 2:**
```
Input: arr1 = [100, 112, 256, 349, 770], arr2 = [72, 86, 113, 119, 265, 445, 892], k = 7
Output: 256
```

## Constraints
- 1 <= n, m <= 10^6
- 0 <= arr1[i], arr2[i] <= 10^9
- 1 <= k <= n + m

## Topic Tags
`Binary Search` `Array` `Two Pointers`

## Expected Complexities
| | |
|---|---|
| **Time** | O(log(min(n, m))) |
| **Space** | O(1) |

## Intuition
We binary search on the number of elements taken from the smaller array. We need to pick `cut1` elements from `arr1` and `cut2 = k - cut1` from `arr2`. We ensure the partition is valid by checking that the maximum element on the left side is less than or equal to the minimum element on the right side.

## Approach
1. Ensure `arr1` is the smaller array.
2. Binary search on `cut1` in range `[max(0, k - n), min(k, m)]`.
3. Compute `cut2 = k - cut1`.
4. Define boundary elements: `left1`, `right1`, `left2`, `right2`.
5. If `left1 <= right2` and `left2 <= right1`, the answer is `max(left1, left2)`.
6. If `left1 > right2`, move left: `high = cut1 - 1`.
7. If `left2 > right1`, move right: `low = cut1 + 1`.

## Brute Force
### Approach
Merge both arrays into a single sorted array and return the k-th element.

### Code
**Python**
```python
def kthElement(arr1, arr2, k):
    merged = []
    i = j = 0
    while i < len(arr1) and j < len(arr2):
        if arr1[i] < arr2[j]:
            merged.append(arr1[i])
            i += 1
        else:
            merged.append(arr2[j])
            j += 1
    while i < len(arr1):
        merged.append(arr1[i])
        i += 1
    while j < len(arr2):
        merged.append(arr2[j])
        j += 1
    return merged[k - 1]
```

**C++**
```cpp
int kthElement(vector<int>& arr1, vector<int>& arr2, int k) {
    vector<int> merged;
    int i = 0, j = 0;
    while (i < arr1.size() && j < arr2.size()) {
        if (arr1[i] < arr2[j]) merged.push_back(arr1[i++]);
        else merged.push_back(arr2[j++]);
    }
    while (i < arr1.size()) merged.push_back(arr1[i++]);
    while (j < arr2.size()) merged.push_back(arr2[j++]);
    return merged[k - 1];
}
```

### Complexity
- **Time:** O(n + m) - two-pointer merge
- **Space:** O(n + m)

## Optimized Solution
### Code
**Python**
```python
def kthElement(arr1, arr2, k):
    if len(arr1) > len(arr2):
        arr1, arr2 = arr2, arr1

    m, n = len(arr1), len(arr2)
    low = max(0, k - n)
    high = min(k, m)

    while low <= high:
        cut1 = (low + high) // 2
        cut2 = k - cut1

        left1 = arr1[cut1 - 1] if cut1 > 0 else float('-inf')
        right1 = arr1[cut1] if cut1 < m else float('inf')
        left2 = arr2[cut2 - 1] if cut2 > 0 else float('-inf')
        right2 = arr2[cut2] if cut2 < n else float('inf')

        if left1 <= right2 and left2 <= right1:
            return max(left1, left2)
        elif left1 > right2:
            high = cut1 - 1
        else:
            low = cut1 + 1

    return -1
```

**C++**
```cpp
int kthElement(vector<int>& arr1, vector<int>& arr2, int k) {
    if (arr1.size() > arr2.size())
        swap(arr1, arr2);

    int m = arr1.size(), n = arr2.size();
    int low = max(0, k - n), high = min(k, m);

    while (low <= high) {
        int cut1 = (low + high) / 2;
        int cut2 = k - cut1;

        int left1  = cut1 > 0 ? arr1[cut1 - 1] : INT_MIN;
        int right1 = cut1 < m ? arr1[cut1]     : INT_MAX;
        int left2  = cut2 > 0 ? arr2[cut2 - 1] : INT_MIN;
        int right2 = cut2 < n ? arr2[cut2]     : INT_MAX;

        if (left1 <= right2 && left2 <= right1)
            return max(left1, left2);
        else if (left1 > right2)
            high = cut1 - 1;
        else
            low = cut1 + 1;
    }
    return -1;
}
```

### Complexity
- **Time:** O(log(min(n, m))) - binary search on smaller array
- **Space:** O(1)

## Key Insight
> By binary searching on how many elements to take from the smaller array, we find the correct partition where `cut1 + cut2 = k` and all left elements ≤ all right elements, giving the k-th element in O(log(min(n,m))).

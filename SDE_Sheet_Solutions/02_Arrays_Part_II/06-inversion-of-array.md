# Inversion of Array

> **Difficulty:** Hard | **Topic:** Array, Divide and Conquer, Merge Sort | **Pre-req:** Merge Sort

---

## Problem Statement

Given an array of integers `arr[]`, find the inversion count in the array. Two elements `arr[i]` and `arr[j]` form an inversion if `arr[i] > arr[j]` and `i < j`.

Inversion Count: For an array, inversion count indicates how far (or close) the array is from being sorted. If the array is already sorted, the inversion count is 0. If the array is sorted in reverse order, the inversion count is the maximum.

---

## Examples

**Example 1:**
```
Input: arr[] = {2, 4, 1, 3, 5}
Output: 3
Explanation: The sequence 2, 4, 1, 3, 5 has three inversions: (2, 1), (4, 1), (4, 3)
```

**Example 2:**
```
Input: arr[] = {2, 3, 4, 5, 6}
Output: 0
Explanation: The array is already sorted, so no inversions exist.
```

**Example 3:**
```
Input: arr[] = {5, 4, 3, 2, 1}
Output: 10
Explanation: Every pair forms an inversion. Total = 10
```

---

## Constraints

- `1 <= arr.size() <= 10^5`
- `1 <= arr[i] <= 10^9`

---

## Topic Tags

`Array` `Divide and Conquer` `Merge Sort`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n log n) |
| **Space** | O(n) |

---

## Intuition

Use modified merge sort. During the merge step, when an element from the right half is smaller than an element from the left half, it forms inversions with all remaining elements in the left half.

---

## Approach

1. Divide the array into two halves
2. Recursively count inversions in left and right halves
3. Count split inversions during merge
4. Return total inversions

---

## Brute Force

### Approach

Check every pair of elements.

### Code

**Python**
```python
def countInversions(arr):
    n = len(arr)
    count = 0
    for i in range(n):
        for j in range(i + 1, n):
            if arr[i] > arr[j]:
                count += 1
    return count
```

**C++**
```cpp
int countInversions(vector<int>& arr) {
    int n = arr.size();
    int count = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (arr[i] > arr[j])
                count++;
    return count;
}
```

### Complexity
- **Time:** O(n²)
- **Space:** O(1)

---

## Optimized Solution (Modified Merge Sort)

### Code

**Python**
```python
def mergeSort(arr, temp, left, right):
    mid = (left + right) // 2
    inv_count = 0
    
    if left < right:
        inv_count += mergeSort(arr, temp, left, mid)
        inv_count += mergeSort(arr, temp, mid + 1, right)
        inv_count += merge(arr, temp, left, mid, right)
    
    return inv_count

def merge(arr, temp, left, mid, right):
    i = left
    j = mid + 1
    k = left
    inv_count = 0
    
    while i <= mid and j <= right:
        if arr[i] <= arr[j]:
            temp[k] = arr[i]
            i += 1
        else:
            temp[k] = arr[j]
            inv_count += (mid - i + 1)
            j += 1
        k += 1
    
    while i <= mid:
        temp[k] = arr[i]
        i += 1
        k += 1
    
    while j <= right:
        temp[k] = arr[j]
        j += 1
        k += 1
    
    for i in range(left, right + 1):
        arr[i] = temp[i]
    
    return inv_count

def countInversions(arr):
    temp = [0] * len(arr)
    return mergeSort(arr, temp, 0, len(arr) - 1)
```

**C++**
```cpp
int merge(vector<int>& arr, vector<int>& temp, int left, int mid, int right) {
    int i = left, j = mid + 1, k = left;
    int inv_count = 0;
    
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
            inv_count += (mid - i + 1);
        }
    }
    
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    
    for (i = left; i <= right; i++)
        arr[i] = temp[i];
    
    return inv_count;
}

int mergeSort(vector<int>& arr, vector<int>& temp, int left, int right) {
    int mid, inv_count = 0;
    if (right > left) {
        mid = (right + left) / 2;
        inv_count += mergeSort(arr, temp, left, mid);
        inv_count += mergeSort(arr, temp, mid + 1, right);
        inv_count += merge(arr, temp, left, mid, right);
    }
    return inv_count;
}

int countInversions(vector<int>& arr) {
    vector<int> temp(arr.size());
    return mergeSort(arr, temp, 0, arr.size() - 1);
}
```

### Complexity
- **Time:** O(n log n)
- **Space:** O(n)

---

## Key Insight

> During merge sort's merge step, when an element from the right half is chosen before elements in the left half, it forms inversions with all remaining elements in the left half.

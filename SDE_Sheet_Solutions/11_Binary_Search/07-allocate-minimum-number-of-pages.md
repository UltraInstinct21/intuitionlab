# Allocate Minimum Number of Pages

> **Difficulty:** Hard | **Topic:** Binary Search, Greedy | **Platform:** GeeksforGeeks

---

## Problem Statement
Given an array `arr[]` of integers where `arr[i]` represents the number of pages in the `i`-th book, and an integer `k` representing the number of students, allocate all books to `k` students such that:

1. Each student gets at least one book.
2. Each book is allocated to exactly one student.
3. Allocation is contiguous (books are allocated in order).

The goal is to minimize the maximum number of pages assigned to any student. If a valid allocation is not possible, return -1.

## Examples
**Example 1:**
```
Input: arr = [12, 34, 67, 90], k = 2
Output: 113
Explanation: Student 1 gets [12, 34, 67] = 113 pages, Student 2 gets [90] = 90 pages. Maximum is 113.
```

**Example 2:**
```
Input: arr = [10, 20, 30, 40], k = 3
Output: 60
```

## Constraints
- 1 <= arr.size() <= 10^5
- 1 <= arr[i] <= 10^6
- 1 <= k <= arr.size()

## Topic Tags
`Binary Search` `Greedy` `Arrays`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n * log(sum - max)) |
| **Space** | O(1) |

## Intuition
The answer lies between `max(arr)` (best case: one student gets the hardest book) and `sum(arr)` (worst case: one student gets all books). We binary search on this range and check if a given maximum page limit can be achieved by `k` students using greedy allocation.

## Approach
1. Set `low = max(arr)`, `high = sum(arr)`.
2. Binary search on the answer range.
3. For each `mid`, greedily allocate books to students:
   - Start a new student when adding the next book would exceed `mid`.
   - If we need more than `k` students, `mid` is too small → increase it.
4. If we can allocate within `k` students, `mid` is a candidate → try smaller values.
5. Return `low` as the minimum possible maximum pages.

## Brute Force
### Approach
Iterate over all possible values from `max(arr)` to `sum(arr)` and check each one.

### Code
**Python**
```python
def isPossible(arr, k, maxPages):
    students, currentSum = 1, 0
    for pages in arr:
        if currentSum + pages > maxPages:
            students += 1
            currentSum = pages
        else:
            currentSum += pages
    return students <= k

def findPages(arr, k):
    if k > len(arr):
        return -1
    for maxPages in range(max(arr), sum(arr) + 1):
        if isPossible(arr, k, maxPages):
            return maxPages
    return -1
```

**C++**
```cpp
bool isPossible(vector<int>& arr, int k, int maxPages) {
    int students = 1, currentSum = 0;
    for (int pages : arr) {
        if (currentSum + pages > maxPages) {
            students++;
            currentSum = pages;
        } else {
            currentSum += pages;
        }
    }
    return students <= k;
}

int findPages(vector<int>& arr, int k) {
    if (k > arr.size()) return -1;
    int lo = *max_element(arr.begin(), arr.end());
    int hi = accumulate(arr.begin(), arr.end(), 0);
    for (int maxPages = lo; maxPages <= hi; maxPages++) {
        if (isPossible(arr, k, maxPages)) return maxPages;
    }
    return -1;
}
```

### Complexity
- **Time:** O(n * (sum - max)) - linear scan for each candidate
- **Space:** O(1)

## Optimized Solution
### Code
**Python**
```python
def isPossible(arr, k, maxPages):
    students, currentSum = 1, 0
    for pages in arr:
        if currentSum + pages > maxPages:
            students += 1
            currentSum = pages
            if students > k:
                return False
        else:
            currentSum += pages
    return True

def findPages(arr, k):
    if k > len(arr):
        return -1

    low, high = max(arr), sum(arr)
    result = -1

    while low <= high:
        mid = (low + high) // 2
        if isPossible(arr, k, mid):
            result = mid
            high = mid - 1
        else:
            low = mid + 1

    return result
```

**C++**
```cpp
bool isPossible(vector<int>& arr, int k, int maxPages) {
    int students = 1, currentSum = 0;
    for (int pages : arr) {
        if (currentSum + pages > maxPages) {
            students++;
            currentSum = pages;
            if (students > k) return false;
        } else {
            currentSum += pages;
        }
    }
    return true;
}

int findPages(vector<int>& arr, int k) {
    if (k > arr.size()) return -1;

    int low = *max_element(arr.begin(), arr.end());
    int high = accumulate(arr.begin(), arr.end(), 0);
    int result = -1;

    while (low <= high) {
        int mid = (low + high) / 2;
        if (isPossible(arr, k, mid)) {
            result = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return result;
}
```

### Complexity
- **Time:** O(n * log(sum - max)) - binary search with greedy check
- **Space:** O(1)

## Key Insight
> The answer binary searches between `max(arr)` and `sum(arr)`. A greedy O(n) check validates if a given page limit is achievable with k students, giving O(n * log(sum - max)) overall.

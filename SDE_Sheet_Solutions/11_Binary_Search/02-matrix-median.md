# Matrix Median

> **Difficulty:** Hard | **Topic:** Binary Search, Matrix | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a matrix of size `R x C` with each row sorted in non-decreasing order, find the median of the matrix. It is guaranteed that the total number of elements is odd.

## Examples
**Example 1:**
```
Input: matrix = [[1, 3, 5], [2, 6, 9], [3, 6, 9]]
Output: 5
```

**Example 2:**
```
Input: matrix = [[1, 3, 5], [2, 6, 9], [3, 6, 9], [1, 6, 9]]
Output: 5
```

## Constraints
- 1 <= R, C <= 500
- 1 <= matrix[i][j] <= 2000
- R * C is always odd
- Each row is sorted in non-decreasing order

## Topic Tags
`Binary Search` `Matrix` `Two Pointers`

## Expected Complexities
| | |
|---|---|
| **Time** | O(R * log(C) * log(max - min)) |
| **Space** | O(1) |

## Intuition
The median of the matrix is the element that has exactly `(R * C) / 2` elements smaller than it. We can use binary search on the value range (min to max of the matrix). For each candidate `mid`, count how many elements are less than or equal to `mid` using `upper_bound` on each sorted row.

If the count of elements ≤ mid is less than or equal to `(R * C) / 2`, then the median is greater than mid; otherwise, it's less than or equal to mid.

## Approach
1. Find `low = min` and `high = max` of the matrix.
2. Binary search on the value range [low, high].
3. For each `mid`, count elements ≤ `mid` across all rows using binary search (upper_bound).
4. If count ≤ `(R * C) / 2`, move `low = mid + 1` (median is in the right half).
5. If count > `(R * C) / 2`, move `high = mid - 1` (median is in the left half).
6. Return `low` as the median.

## Brute Force
### Approach
Flatten the matrix into a single sorted array and return the middle element.

### Code
**Python**
```python
def median(matrix):
    flat = []
    for row in matrix:
        flat.extend(row)
    flat.sort()
    return flat[len(flat) // 2]
```

**C++**
```cpp
int median(vector<vector<int>>& matrix) {
    vector<int> flat;
    for (auto& row : matrix)
        for (int x : row)
            flat.push_back(x);
    sort(flat.begin(), flat.end());
    return flat[flat.size() / 2];
}
```

### Complexity
- **Time:** O(R * C * log(R * C)) - sorting all elements
- **Space:** O(R * C)

## Optimized Solution
### Code
**Python**
```python
def countSmallerThanOrEqual(row, target):
    lo, hi = 0, len(row)
    while lo < hi:
        mid = (lo + hi) // 2
        if row[mid] <= target:
            lo = mid + 1
        else:
            hi = mid
    return lo

def median(matrix):
    R, C = len(matrix), len(matrix[0])
    low = min(row[0] for row in matrix)
    high = max(row[-1] for row in matrix)
    desired = (R * C) // 2

    while low <= high:
        mid = (low + high) // 2
        count = sum(countSmallerThanOrEqual(row, mid) for row in matrix)
        if count <= desired:
            low = mid + 1
        else:
            high = mid - 1

    return low
```

**C++**
```cpp
int countSmallerThanOrEqual(const vector<int>& row, int target) {
    int lo = 0, hi = row.size();
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (row[mid] <= target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

int median(vector<vector<int>>& matrix) {
    int R = matrix.size(), C = matrix[0].size();
    int low = INT_MAX, high = INT_MIN;
    for (int i = 0; i < R; i++) {
        low = min(low, matrix[i][0]);
        high = max(high, matrix[i][C - 1]);
    }

    int desired = (R * C) / 2;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int count = 0;
        for (int i = 0; i < R; i++)
            count += countSmallerThanOrEqual(matrix[i], mid);
        if (count <= desired) low = mid + 1;
        else high = mid - 1;
    }
    return low;
}
```

### Complexity
- **Time:** O(R * log(C) * log(max_val - min_val)) - binary search on value range, O(R) rows, O(log C) per row
- **Space:** O(1)

## Key Insight
> Binary search on the value domain combined with upper_bound on each row lets us count elements ≤ mid in O(R * log C), achieving an efficient O(R * log C * log(max - min)) solution.

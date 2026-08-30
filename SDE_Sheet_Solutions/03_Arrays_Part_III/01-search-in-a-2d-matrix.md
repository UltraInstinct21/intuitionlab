# 74. Search a 2D Matrix

> **Difficulty:** Medium | **Topic:** Array, Binary Search, Matrix | **LeetCode:** [74](https://leetcode.com/problems/search-a-2d-matrix/)

---

## Problem Statement

You are given an `m x n` integer matrix `matrix` with the following two properties:
1. Each row is sorted in non-decreasing order.
2. The first integer of each row is greater than the last integer of the previous row.

Given an integer `target`, return `true` if `target` is in `matrix` or `false` otherwise.

---

## Examples

**Example 1:**
```
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
Output: true
```

**Example 2:**
```
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
Output: false
```

---

## Constraints

- `m == matrix.length`
- `n == matrix[i].length`
- `1 <= m, n <= 100`
- `-10^4 <= matrix[i][j], target <= 10^4`

---

## Topic Tags

`Array` `Binary Search` `Matrix`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(log(m × n)) |
| **Space** | O(1) |

---

## Intuition

Since rows are sorted and first element of each row is greater than last of previous, we can treat the matrix as a single sorted array and apply binary search.

---

## Approach

1. Treat the 2D matrix as a 1D sorted array
2. Use binary search with index mapping: `row = mid // n`, `col = mid % n`
3. Compare target with `matrix[row][col]`

---

## Optimized Solution

### Code

**Python**
```python
class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        m, n = len(matrix), len(matrix[0])
        lo, hi = 0, m * n - 1
        
        while lo <= hi:
            mid = (lo + hi) // 2
            val = matrix[mid // n][mid % n]
            if val == target:
                return True
            elif val < target:
                lo = mid + 1
            else:
                hi = mid - 1
        
        return False
```

**C++**
```cpp
class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m = matrix.size(), n = matrix[0].size();
        int lo = 0, hi = m * n - 1;
        
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int val = matrix[mid / n][mid % n];
            if (val == target) return true;
            else if (val < target) lo = mid + 1;
            else hi = mid - 1;
        }
        
        return false;
    }
};
```

### Complexity
- **Time:** O(log(m × n))
- **Space:** O(1)

---

## Key Insight

> The matrix properties allow us to treat it as a single sorted array. Use binary search with index mapping to find the element.

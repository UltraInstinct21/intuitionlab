# 73. Set Matrix Zeroes

> **Difficulty:** Medium | **Topic:** Arrays, Hash Table, Matrix | **LeetCode:** [73](https://leetcode.com/problems/set-matrix-zeroes/)

---

## Problem Statement

Given an `m x n` integer matrix `matrix`, if an element is `0`, set its entire row and column to `0`'s.

You must do it **in place**.

---

## Examples

**Example 1:**
```
Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]
Output: [[1,0,1],[0,0,0],[1,0,1]]
```

**Example 2:**
```
Input: matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
```

---

## Constraints

- `m == matrix.length`
- `n == matrix[0].length`
- `1 <= m, n <= 200`
- `-2^31 <= matrix[i][j] <= 2^31 - 1`

---

## Topic Tags

`Array` `Hash Table` `Matrix`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(m × n) |
| **Space** | O(1) for optimal, O(m + n) for better |

---

## Intuition

The key insight is that we need to **mark** which rows and columns should be zeroed, then **apply** the changes. The challenge is doing this in-place without losing information. We can use the first row and first column as markers, since they can serve dual purpose — we just need to handle them separately at the end.

---

## Approach

1. Check if the first row or first column originally contained any zeros (store in flags)
2. Use first row and first column as markers: for each `matrix[i][j] == 0`, mark `matrix[i][0] = 0` and `matrix[0][j] = 0`
3. Second pass: for each cell, if its row marker or column marker is 0, set it to 0
4. Finally, zero out first row and first column if their flags were set

---

## Brute Force

### Approach

Create a copy of the matrix. For each zero found in the copy, set the entire row and column to zero in the original matrix.

### Code

**Python**
```python
class Solution:
    def setZeroes(self, matrix: list[list[int]]) -> None:
        m, n = len(matrix), len(matrix[0])
        to_zero = set()
        
        for i in range(m):
            for j in range(n):
                if matrix[i][j] == 0:
                    to_zero.add((i, j))
        
        for i, j in to_zero:
            for k in range(n):
                matrix[i][k] = 0
            for k in range(m):
                matrix[k][j] = 0
```

**C++**
```cpp
class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        vector<pair<int,int>> toZero;
        
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (matrix[i][j] == 0)
                    toZero.push_back({i, j});
        
        for (auto& [i, j] : toZero) {
            for (int k = 0; k < n; k++) matrix[i][k] = 0;
            for (int k = 0; k < m; k++) matrix[k][j] = 0;
        }
    }
};
```

### Complexity
- **Time:** O(m × n × (m + n)) — for each zero, we may scan entire row and column
- **Space:** O(m × n) — storing all zero positions

---

## Better Solution

### Approach

Use two separate arrays to mark which rows and columns need to be zeroed.

### Code

**Python**
```python
class Solution:
    def setZeroes(self, matrix: list[list[int]]) -> None:
        m, n = len(matrix), len(matrix[0])
        row_mark = [False] * m
        col_mark = [False] * n
        
        for i in range(m):
            for j in range(n):
                if matrix[i][j] == 0:
                    row_mark[i] = True
                    col_mark[j] = True
        
        for i in range(m):
            for j in range(n):
                if row_mark[i] or col_mark[j]:
                    matrix[i][j] = 0
```

**C++**
```cpp
class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        vector<bool> rowMark(m, false), colMark(n, false);
        
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (matrix[i][j] == 0)
                    rowMark[i] = colMark[j] = true;
        
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (rowMark[i] || colMark[j])
                    matrix[i][j] = 0;
    }
};
```

### Complexity
- **Time:** O(m × n)
- **Space:** O(m + n)

---

## Optimized Solution (O(1) Space)

### Approach

Use the first row and first column as markers. Track separately if the first row/column themselves need zeroing.

### Code

**Python**
```python
class Solution:
    def setZeroes(self, matrix: list[list[int]]) -> None:
        m, n = len(matrix), len(matrix[0])
        first_row_zero = any(matrix[0][j] == 0 for j in range(n))
        first_col_zero = any(matrix[i][0] == 0 for i in range(m))
        
        # Mark zeros using first row/col
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][j] == 0:
                    matrix[i][0] = 0
                    matrix[0][j] = 0
        
        # Apply marks
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][0] == 0 or matrix[0][j] == 0:
                    matrix[i][j] = 0
        
        if first_row_zero:
            for j in range(n):
                matrix[0][j] = 0
        if first_col_zero:
            for i in range(m):
                matrix[i][0] = 0
```

**C++**
```cpp
class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        bool firstRowZero = false, firstColZero = false;
        
        for (int j = 0; j < n; j++)
            if (matrix[0][j] == 0) { firstRowZero = true; break; }
        for (int i = 0; i < m; i++)
            if (matrix[i][0] == 0) { firstColZero = true; break; }
        
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][j] == 0)
                    matrix[i][0] = matrix[0][j] = 0;
        
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][0] == 0 || matrix[0][j] == 0)
                    matrix[i][j] = 0;
        
        if (firstRowZero)
            for (int j = 0; j < n; j++) matrix[0][j] = 0;
        if (firstColZero)
            for (int i = 0; i < m; i++) matrix[i][0] = 0;
    }
};
```

### Complexity
- **Time:** O(m × n)
- **Space:** O(1)

---

## Key Insight

> Use the matrix's own first row and column as markers. Handle them last to avoid losing the original data.

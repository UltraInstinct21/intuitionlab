# 118. Pascal's Triangle

> **Difficulty:** Easy | **Topic:** Array, Dynamic Programming | **LeetCode:** [118](https://leetcode.com/problems/pascals-triangle/)

---

## Problem Statement

Given an integer `numRows`, return the first numRows of **Pascal's triangle**.

In Pascal's triangle, each number is the sum of the two numbers directly above it.

---

## Examples

**Example 1:**
```
Input: numRows = 5
Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
```

**Example 2:**
```
Input: numRows = 1
Output: [[1]]
```

---

## Constraints

- `1 <= numRows <= 30`

---

## Topic Tags

`Array` `Dynamic Programming`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(numRows²) |
| **Space** | O(1) excluding output, O(numRows²) including output |

---

## Intuition

Each row in Pascal's triangle is built from the previous row. The first and last element of every row is 1. Every other element is the sum of the two elements directly above it from the previous row.

---

## Approach

1. Start with the first row `[1]`
2. For each subsequent row, create a new row where:
   - First element = 1
   - Middle elements = previous_row[j-1] + previous_row[j]
   - Last element = 1
3. Add each row to the result

---

## Brute Force

### Approach

Same as optimized for this problem - there's no more efficient way since we need to construct all rows.

### Code

**Python**
```python
class Solution:
    def generate(self, numRows: int) -> list[list[int]]:
        result = [[1]]
        
        for i in range(1, numRows):
            prev = result[-1]
            row = [1]
            for j in range(1, i):
                row.append(prev[j-1] + prev[j])
            row.append(1)
            result.append(row)
        
        return result
```

**C++**
```cpp
class Solution {
public:
    vector<vector<int>> generate(int numRows) {
        vector<vector<int>> result = {{1}};
        
        for (int i = 1; i < numRows; i++) {
            vector<int> row(i + 1, 1);
            for (int j = 1; j < i; j++)
                row[j] = result[i-1][j-1] + result[i-1][j];
            result.push_back(row);
        }
        
        return result;
    }
};
```

### Complexity
- **Time:** O(numRows²)
- **Space:** O(1) excluding output

---

## Optimized Solution

### Approach

Use the mathematical property: C(n, k) = C(n, k-1) * (n - k + 1) / k to generate each row directly.

### Code

**Python**
```python
class Solution:
    def generate(self, numRows: int) -> list[list[int]]:
        result = []
        
        for i in range(numRows):
            row = [1] * (i + 1)
            for j in range(1, i):
                row[j] = result[i-1][j-1] + result[i-1][j]
            result.append(row)
        
        return result
```

**C++**
```cpp
class Solution {
public:
    vector<vector<int>> generate(int numRows) {
        vector<vector<int>> result;
        
        for (int i = 0; i < numRows; i++) {
            vector<int> row(i + 1, 1);
            for (int j = 1; j < i; j++)
                row[j] = result[i-1][j-1] + result[i-1][j];
            result.push_back(row);
        }
        
        return result;
    }
};
```

### Complexity
- **Time:** O(numRows²)
- **Space:** O(1) excluding output

---

## Key Insight

> Each element is the sum of two elements from the previous row. First and last elements are always 1.

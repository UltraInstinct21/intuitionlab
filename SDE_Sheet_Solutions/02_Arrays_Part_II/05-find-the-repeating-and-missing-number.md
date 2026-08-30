# Find the Repeating and Missing Number

> **Difficulty:** Hard | **Topic:** Array, Math | **LeetCode:** [645](https://leetcode.com/problems/set-mismatch/) (similar)

---

## Problem Statement

Given an unsorted array of size `n` of positive integers where each element is in the range `[1, n]`. One number appears twice and one number is missing. Find the repeating number and the missing number.

---

## Examples

**Example 1:**
```
Input: arr[] = {3, 1, 3}
Output: {3, 2}
Explanation: 3 is repeating, 2 is missing
```

**Example 2:**
```
Input: arr[] = {4, 3, 6, 2, 1, 1}
Output: {1, 5}
Explanation: 1 is repeating, 5 is missing
```

---

## Constraints

- `1 <= n <= 10^5`
- `1 <= arr[i] <= n`

---

## Topic Tags

`Array` `Math`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Intuition

Use mathematical equations. Let x be repeating and y be missing. We can form two equations using sum and sum of squares, then solve for x and y.

---

## Approach (Mathematical)

1. Calculate `S = sum(arr)` and `S2 = sum(arr²)`
2. Expected sum `Sn = n*(n+1)/2`, expected sum of squares `S2n = n*(n+1)*(2n+1)/6`
3. `S - Sn = x - y` (diff equation)
4. `S2 - S2n = x² - y² = (x+y)(x-y)` (sum equation)
5. Solve the two equations

---

## Optimized Solution

### Code

**Python**
```python
def findMissingAndRepeating(arr):
    n = len(arr)
    S = sum(arr)
    S2 = sum(x * x for x in arr)
    
    Sn = n * (n + 1) // 2
    S2n = n * (n + 1) * (2 * n + 1) // 6
    
    diff = S - Sn  # x - y
    sum_xy = (S2 - S2n) // diff  # x + y
    
    x = (diff + sum_xy) // 2  # repeating
    y = sum_xy - x  # missing
    
    return [x, y]
```

**C++**
```cpp
pair<int, int> findMissingAndRepeating(vector<int>& arr) {
    int n = arr.size();
    long long S = 0, S2 = 0;
    
    for (int x : arr) {
        S += x;
        S2 += (long long)x * x;
    }
    
    long long Sn = (long long)n * (n + 1) / 2;
    long long S2n = (long long)n * (n + 1) * (2 * n + 1) / 6;
    
    long long diff = S - Sn;
    long long sum_xy = (S2 - S2n) / diff;
    
    int x = (diff + sum_xy) / 2;
    int y = sum_xy - x;
    
    return {x, y};
}
```

### Complexity
- **Time:** O(n)
- **Space:** O(1)

---

## Key Insight

> Use the difference between actual and expected sum (x - y) and actual and expected sum of squares (x² - y²) to form two equations and solve for x and y.

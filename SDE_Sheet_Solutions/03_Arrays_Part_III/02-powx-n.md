# 50. Pow(x, n)

> **Difficulty:** Medium | **Topic:** Math, Recursion | **LeetCode:** [50](https://leetcode.com/problems/powx-n/)

---

## Problem Statement

Implement `pow(x, n)`, which calculates `x` raised to the power `n` (i.e., `x^n`).

---

## Examples

**Example 1:**
```
Input: x = 2.00000, n = 10
Output: 1024.00000
```

**Example 2:**
```
Input: x = 2.10000, n = 3
Output: 9.26100
```

**Example 3:**
```
Input: x = 2.00000, n = -2
Output: 0.25000
```

---

## Constraints

- `-100.0 < x < 100.0`
- `-2^31 <= n <= 2^31 - 1`
- `n` is an integer
- Either `x != 0` or `n > 0`
- `-10^4 <= x^n <= 10^4`

---

## Topic Tags

`Math` `Recursion`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(log n) |
| **Space** | O(log n) recursion stack |

---

## Intuition

Use fast exponentiation (binary exponentiation). If n is even, `x^n = (x²)^(n/2)`. If n is odd, `x^n = x × x^(n-1)`.

---

## Approach

1. Handle negative n by taking reciprocal of x
2. Use recursion: if n is even, compute `myPow(x*x, n/2)`; if odd, compute `x * myPow(x*x, n/2)`

---

## Optimized Solution

### Code

**Python**
```python
class Solution:
    def myPow(self, x: float, n: int) -> float:
        if n < 0:
            x = 1 / x
            n = -n
        
        def helper(x, n):
            if n == 0:
                return 1
            half = helper(x, n // 2)
            if n % 2 == 0:
                return half * half
            else:
                return half * half * x
        
        return helper(x, n)
```

**C++**
```cpp
class Solution {
public:
    double myPow(double x, long long n) {
        if (n < 0) {
            x = 1 / x;
            n = -n;
        }
        return helper(x, n);
    }
    
    double helper(double x, long long n) {
        if (n == 0) return 1;
        double half = helper(x, n / 2);
        if (n % 2 == 0)
            return half * half;
        else
            return half * half * x;
    }
};
```

### Complexity
- **Time:** O(log n)
- **Space:** O(log n) for recursion stack

---

## Key Insight

> Binary exponentiation reduces the problem size by half each step. `x^n = (x²)^(n/2)` for even n, and `x^n = x × (x²)^((n-1)/2)` for odd n.

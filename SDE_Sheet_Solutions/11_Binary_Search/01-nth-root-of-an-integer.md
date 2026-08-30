# Nth Root of an Integer

> **Difficulty:** Medium | **Topic:** Binary Search, Mathematics | **Platform:** GeeksforGeeks

---

## Problem Statement
Given two integers `n` and `m`, find the integer `x` such that `x^n = m`. If such an integer exists, return it. If not, return -1.

## Examples
**Example 1:**
```
Input: n = 3, m = 27
Output: 3
```

**Example 2:**
```
Input: n = 2, m = 16
Output: 4
```

**Example 3:**
```
Input: n = 3, m = 9
Output: -1
```

## Constraints
- 1 <= n <= 30
- 1 <= m <= 10^9

## Topic Tags
`Binary Search` `Mathematics` `Exponentiation`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n * log(m)) |
| **Space** | O(1) |

## Intuition
We need to find `x` such that `x^n = m`. Since `x^n` is a monotonically increasing function for positive `x`, we can use binary search over the range [1, m] to find the answer. For each candidate `mid`, we compute `mid^n` and compare it with `m`.

A key optimization is using fast exponentiation (`power` function) which computes `x^n` in `O(log n)` time. This prevents overflow issues and improves performance.

## Approach
1. Set the search range from `low = 1` to `high = m`.
2. While `low <= high`, compute `mid = (low + high) / 2`.
3. Compute `mid^n` using fast exponentiation.
4. If `mid^n == m`, return `mid`.
5. If `mid^n < m`, search right (`low = mid + 1`).
6. If `mid^n > m`, search left (`high = mid - 1`).
7. If no exact match is found, return -1.

## Brute Force
### Approach
Linearly search from 1 to m, checking each integer x if x^n == m.

### Code
**Python**
```python
def nthRoot(n, m):
    for x in range(1, m + 1):
        if x ** n == m:
            return x
        if x ** n > m:
            break
    return -1
```

**C++**
```cpp
long long power(long long base, int exp) {
    long long result = 1;
    while (exp--) result *= base;
    return result;
}

int nthRoot(int n, int m) {
    for (int x = 1; x <= m; x++) {
        long long val = power(x, n);
        if (val == m) return x;
        if (val > m) break;
    }
    return -1;
}
```

### Complexity
- **Time:** O(m * n) - iterating up to m and computing power in O(n)
- **Space:** O(1)

## Optimized Solution
### Code
**Python**
```python
def power(x, n, m):
    result = 1
    base = x
    while n > 0:
        if n % 2 == 1:
            result *= base
            if result > m:
                return m + 1
        base *= base
        if base > m and n > 1:
            return m + 1
        n //= 2
    return result

def nthRoot(n, m):
    low, high = 1, m
    while low <= high:
        mid = (low + high) // 2
        val = power(mid, n, m)
        if val == m:
            return mid
        elif val < m:
            low = mid + 1
        else:
            high = mid - 1
    return -1
```

**C++**
```cpp
long long power(long long base, int exp, long long limit) {
    long long result = 1;
    while (exp > 0) {
        if (exp & 1) {
            result *= base;
            if (result > limit) return limit + 1;
        }
        base *= base;
        if (base > limit && exp > 1) return limit + 1;
        exp >>= 1;
    }
    return result;
}

int nthRoot(int n, int m) {
    long long low = 1, high = m;
    while (low <= high) {
        long long mid = (low + high) / 2;
        long long val = power(mid, n, m);
        if (val == m) return (int)mid;
        else if (val < m) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}
```

### Complexity
- **Time:** O(n * log(m)) - binary search over [1, m] with fast exponentiation O(n)
- **Space:** O(1)

## Key Insight
> Binary search on the answer space [1, m] combined with fast exponentiation gives an efficient O(n * log m) solution instead of brute force O(m * n).

# Z-Function (GFG - Hard)

> **Difficulty:** Hard | **Topic:** String, Z-Algorithm | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a string `s` of length `n`, the Z-function for this string is an array of length `n` where the i-th element is equal to the greatest number of characters starting from the position i that coincide with the first characters of s. In other words, `z[i]` is the length of the longest common prefix between `s` and the suffix of `s` starting at position `i`.

Implement the Z-function for the given string.

## Examples
**Example 1:**
```
Input: s = "ababaa"
Output: [0, 0, 3, 0, 1, 5]
```

**Example 2:**
```
Input: s = "aaaaaa"
Output: [0, 5, 4, 3, 2, 1]
```

## Constraints
- 1 ≤ s.length ≤ 10^6
- s consists of only lowercase English letters

## Topic Tags
`String` `Z-Algorithm` `Pattern-Matching`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) |

## Intuition
The Z-function computes, for each position `i`, the length of the longest substring starting at `i` that matches a prefix of the string. A naive approach would compare characters one by one from each position, leading to O(n^2). The optimized approach uses a "Z-box" (a window `[l, r]`) that tracks the rightmost interval starting from position 0 where we already know the Z-values. When we process position `i` inside the current Z-box, we can reuse previously computed information to avoid redundant character comparisons, achieving linear time.

## Approach
1. Initialize `z[0] = n` (or 0 depending on convention) and set the Z-box `[l, r]` to `[0, 0]`.
2. For each `i` from 1 to `n-1`:
   - If `i ≤ r`, set `z[i] = min(r - i + 1, z[i - l])` to reuse known information.
   - Otherwise, `z[i] = 0`.
   - Extend `z[i]` by comparing characters starting from `s[z[i]]` and `s[i + z[i]]`.
   - If `i + z[i] - 1 > r`, update the Z-box to `[i, i + z[i] - 1]`.
3. Return the `z` array.

## Brute Force
### Approach
For each position `i`, compare characters starting from `s[0]` and `s[i]` one by one until they mismatch. This is O(n^2) in the worst case.

### Code
**Python**
```python
def z_function(s):
    n = len(s)
    z = [0] * n
    for i in range(1, n):
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
    return z
```

**C++**
```cpp
vector<int> z_function(string s) {
    int n = s.size();
    vector<int> z(n, 0);
    for (int i = 1; i < n; i++) {
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) {
            z[i]++;
        }
    }
    return z;
}
```

### Complexity
- **Time:** O(n^2) worst case
- **Space:** O(n)

## Optimized Solution
### Code
**Python**
```python
def z_function(s):
    n = len(s)
    z = [0] * n
    l, r = 0, 0
    for i in range(1, n):
        if i <= r:
            z[i] = min(r - i + 1, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] - 1 > r:
            l, r = i, i + z[i] - 1
    return z
```

**C++**
```cpp
vector<int> z_function(string s) {
    int n = s.size();
    vector<int> z(n, 0);
    int l = 0, r = 0;
    for (int i = 1; i < n; i++) {
        if (i <= r) {
            z[i] = min(r - i + 1, z[i - l]);
        }
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) {
            z[i]++;
        }
        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }
    return z;
}
```

### Complexity
- **Time:** O(n)
- **Space:** O(n)

## Key Insight
> By maintaining a Z-box `[l, r]` representing the rightmost known match, we can reuse previously computed Z-values to skip redundant character comparisons, achieving linear time.

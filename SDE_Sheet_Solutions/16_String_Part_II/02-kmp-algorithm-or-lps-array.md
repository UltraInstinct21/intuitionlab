# 28. Find the Index of the First Occurrence in a String

> **Difficulty:** Hard | **Topic:** String, KMP, LPS Array | **Platform:** LeetCode

---

## Problem Statement
Given two strings `needle` and `haystack`, return the index of the first occurrence of `needle` in `haystack`, or `-1` if `needle` is not part of `haystack`.

## Examples
**Example 1:**
```
Input: haystack = "sadbutsad", needle = "sad"
Output: 0
Explanation: "sad" occurs at index 0 and 6. The first occurrence is at index 0.
```

**Example 2:**
```
Input: haystack = "leetcode", needle = "leeto"
Output: -1
```

## Constraints
- 1 ≤ haystack.length, needle.length ≤ 10^4
- haystack and needle consist of only lowercase English letters

## Topic Tags
`String` `KMP-Algorithm` `Pattern-Matching` `LPS-Array`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n + m) |
| **Space** | O(m) |

## Intuition
The KMP (Knuth-Morris-Pratt) algorithm avoids redundant comparisons by preprocessing the pattern (`needle`) into an LPS (Longest Proper Prefix which is also Suffix) array. When a mismatch occurs, the LPS array tells us the next position in the pattern to continue matching from, rather than restarting from the beginning. This ensures each character in the haystack is compared at most once.

## Approach
1. **Build the LPS array** for the `needle`:
   - `lps[i]` = length of the longest proper prefix of `needle[0..i]` that is also a suffix.
   - Use two pointers: `len` (current LPS length) and `i` (current index).
2. **Search using KMP:**
   - Use two pointers: `i` for `haystack` and `j` for `needle`.
   - If characters match, advance both pointers.
   - If they don't match and `j > 0`, set `j = lps[j - 1]` (fall back in the pattern).
   - If `j == 0` and characters don't match, advance `i` only.
   - When `j == m` (full match), return `i - m`.

## Brute Force
### Approach
Slide a window of length `m` over the haystack and check for a match character by character. This is O(n * m) in the worst case.

### Code
**Python**
```python
def strStr(haystack, needle):
    n, m = len(haystack), len(needle)
    for i in range(n - m + 1):
        if haystack[i:i + m] == needle:
            return i
    return -1
```

**C++**
```cpp
int strStr(string haystack, string needle) {
    int n = haystack.size(), m = needle.size();
    for (int i = 0; i <= n - m; i++) {
        int j = 0;
        while (j < m && haystack[i + j] == needle[j]) j++;
        if (j == m) return i;
    }
    return -1;
}
```

### Complexity
- **Time:** O(n * m)
- **Space:** O(1)

## Optimized Solution
### Code
**Python**
```python
def build_lps(pattern):
    m = len(pattern)
    lps = [0] * m
    length = 0
    i = 1
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    return lps

def strStr(haystack, needle):
    n, m = len(haystack), len(needle)
    if m == 0:
        return 0
    lps = build_lps(needle)
    i = j = 0
    while i < n:
        if haystack[i] == needle[j]:
            i += 1
            j += 1
        if j == m:
            return i - j
        elif i < n and haystack[i] != needle[j]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    return -1
```

**C++**
```cpp
vector<int> build_lps(string pattern) {
    int m = pattern.size();
    vector<int> lps(m, 0);
    int len = 0, i = 1;
    while (i < m) {
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0)
                len = lps[len - 1];
            else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}

int strStr(string haystack, string needle) {
    int n = haystack.size(), m = needle.size();
    if (m == 0) return 0;
    vector<int> lps = build_lps(needle);
    int i = 0, j = 0;
    while (i < n) {
        if (haystack[i] == needle[j]) {
            i++;
            j++;
        }
        if (j == m)
            return i - j;
        else if (i < n && haystack[i] != needle[j]) {
            if (j != 0)
                j = lps[j - 1];
            else
                i++;
        }
    }
    return -1;
}
```

### Complexity
- **Time:** O(n + m)
- **Space:** O(m) for the LPS array

## Key Insight
> The LPS array encodes self-overlap information in the pattern, allowing the KMP algorithm to skip redundant character comparisons and achieve linear time complexity.

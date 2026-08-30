# 165. Compare Version Numbers

> **Difficulty:** Medium | **Topic:** String, Two Pointers | **Platform:** LeetCode

---

## Problem Statement
Given two version strings `version1` and `version2`, compare them. A version string consists of revisions separated by dots `'.'`. The revisions are converted to integers and compared from left to right. If `version1 > version2` return `1`, if `version1 < version2` return `-1`, otherwise return `0`.

Leading zeros in version strings are invalid (e.g., `"01"` is not a valid version).

## Examples
**Example 1:**
```
Input: version1 = "1.01", version2 = "1.001"
Output: 0
Explanation: Ignoring leading zeros, 01 and 001 both represent the integer 1.
```

**Example 2:**
```
Input: version1 = "1.0", version2 = "1.0.0"
Output: 0
Explanation: version1 has no third revision, which means it is treated as 0.
```

**Example 3:**
```
Input: version1 = "0.1", version2 = "1.1"
Output: -1
Explanation: version1's first revision is 0, while version2's is 1, so 0 < 1.
```

## Constraints
- 1 ≤ version1.length, version2.length ≤ 500
- version1 and version2 only contain digits and `'.'`
- All the revisions in version1 and version2 are separated by `'.'`

## Topic Tags
`String` `Two-Pointers` `Simulation`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n + m) |
| **Space** | O(n + m) |

## Intuition
Split both version strings by `'.'` into lists of integer revisions. Pad the shorter list with zeros. Then compare corresponding revisions from left to right. Return the first non-zero comparison result, or `0` if all are equal.

## Approach
1. Split `version1` and `version2` by `'.'`.
2. Convert each part to an integer (automatically handles leading zeros).
3. Pad the shorter list with zeros using `zip_longest`.
4. Compare revisions one by one from left to right.
5. Return `1`, `-1`, or `0` based on the comparison.

## Brute Force
### Approach
Split both versions, pad with zeros manually, and compare. This is essentially the optimized approach since we need to process every character at least once.

### Code
**Python**
```python
def compareVersion(version1, version2):
    v1 = list(map(int, version1.split('.')))
    v2 = list(map(int, version2.split('.')))
    max_len = max(len(v1), len(v2))
    v1.extend([0] * (max_len - len(v1)))
    v2.extend([0] * (max_len - len(v2)))
    for a, b in zip(v1, v2):
        if a > b:
            return 1
        elif a < b:
            return -1
    return 0
```

**C++**
```cpp
vector<int> split(string s) {
    vector<int> result;
    istringstream ss(s);
    string token;
    while (getline(ss, token, '.'))
        result.push_back(stoi(token));
    return result;
}

int compareVersion(string version1, string version2) {
    vector<int> v1 = split(version1);
    vector<int> v2 = split(version2);
    int maxLen = max(v1.size(), v2.size());
    v1.resize(maxLen, 0);
    v2.resize(maxLen, 0);
    for (int i = 0; i < maxLen; i++) {
        if (v1[i] > v2[i]) return 1;
        if (v1[i] < v2[i]) return -1;
    }
    return 0;
}
```

### Complexity
- **Time:** O(n + m)
- **Space:** O(n + m)

## Optimized Solution
### Code
**Python**
```python
def compareVersion(version1, version2):
    v1 = list(map(int, version1.split('.')))
    v2 = list(map(int, version2.split('.')))
    max_len = max(len(v1), len(v2))
    v1.extend([0] * (max_len - len(v1)))
    v2.extend([0] * (max_len - len(v2)))
    for a, b in zip(v1, v2):
        if a > b:
            return 1
        elif a < b:
            return -1
    return 0
```

**C++**
```cpp
vector<int> parse(string version) {
    vector<int> result;
    istringstream ss(version);
    string token;
    while (getline(ss, token, '.'))
        result.push_back(stoi(token));
    return result;
}

int compareVersion(string version1, string version2) {
    vector<int> v1 = parse(version1);
    vector<int> v2 = parse(version2);
    int n = max(v1.size(), v2.size());
    for (int i = 0; i < n; i++) {
        int a = i < (int)v1.size() ? v1[i] : 0;
        int b = i < (int)v2.size() ? v2[i] : 0;
        if (a > b) return 1;
        if (a < b) return -1;
    }
    return 0;
}
```

### Complexity
- **Time:** O(n + m)
- **Space:** O(n + m) for storing parsed versions

## Key Insight
> By splitting on `'.'` and converting to integers, we automatically handle leading zeros. Padding the shorter version with zeros ensures proper comparison of versions with different numbers of revisions.

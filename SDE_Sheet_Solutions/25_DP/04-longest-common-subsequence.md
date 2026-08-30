# 1143. Longest Common Subsequence

> **Difficulty:** Medium | **Topic:** Dynamic Programming | **Platform:** LeetCode

---

## Problem Statement
Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return `0`. A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.

## Examples
**Example 1:**
```
Input: text1 = "abcde", text2 = "ace"
Output: 3
Explanation: The longest common subsequence is "ace" and its length is 3.
```

**Example 2:**
```
Input: text1 = "abc", text2 = "def"
Output: 0
Explanation: There is no common subsequence, so the result is 0.
```

## Constraints
- `1 <= text1.length, text2.length <= 1000`
- `text1` and `text2` consist of only lowercase English characters

## Topic Tags
`Dynamic Programming` `String` `Subsequence`

## Expected Complexities
| | |
|---|---|
| **Time** | O(m * n) |
| **Space** | O(min(m, n)) |

## Intuition
Compare characters from both strings. If they match, both pointers advance and we add 1 to the result. If they don't match, we try advancing each pointer independently and take the maximum. This recursive structure with overlapping subproblems makes it a classic DP problem.

## Approach
1. Define dp[i][j] as LCS length of text1[0..i-1] and text2[0..j-1]
2. If characters match: dp[i][j] = dp[i-1][j-1] + 1
3. If not: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
4. Space optimize by keeping only the previous row

## Step 1: Recursion
### Code
**Python**
```python
def longestCommonSubsequence(text1: str, text2: str) -> int:
    def helper(i, j):
        if i == 0 or j == 0:
            return 0
        if text1[i - 1] == text2[j - 1]:
            return 1 + helper(i - 1, j - 1)
        return max(helper(i - 1, j), helper(i, j - 1))

    return helper(len(text1), len(text2))
```

**C++**
```cpp
class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        return helper(text1.size(), text2.size(), text1, text2);
    }

    int helper(int i, int j, string& text1, string& text2) {
        if (i == 0 || j == 0) return 0;
        if (text1[i - 1] == text2[j - 1])
            return 1 + helper(i - 1, j - 1, text1, text2);
        return max(helper(i - 1, j, text1, text2),
                   helper(i, j - 1, text1, text2));
    }
};
```

### Complexity
- **Time:** O(2^(m+n)) — exponential branching
- **Space:** O(m + n) — recursion stack depth

## Step 2: Memoization (Top-Down DP)
### Code
**Python**
```python
def longestCommonSubsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    memo = {}

    def helper(i, j):
        if i == 0 or j == 0:
            return 0
        if (i, j) in memo:
            return memo[(i, j)]
        if text1[i - 1] == text2[j - 1]:
            memo[(i, j)] = 1 + helper(i - 1, j - 1)
        else:
            memo[(i, j)] = max(helper(i - 1, j), helper(i, j - 1))
        return memo[(i, j)]

    return helper(m, n)
```

**C++**
```cpp
class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int m = text1.size(), n = text2.size();
        unordered_map<int, int> memo;
        return helper(m, n, text1, text2, memo);
    }

    int helper(int i, int j, string& t1, string& t2, unordered_map<int, int>& memo) {
        if (i == 0 || j == 0) return 0;
        int key = i * 1001 + j;
        if (memo.count(key)) return memo[key];
        if (t1[i - 1] == t2[j - 1]) {
            memo[key] = 1 + helper(i - 1, j - 1, t1, t2, memo);
        } else {
            memo[key] = max(helper(i - 1, j, t1, t2, memo),
                            helper(i, j - 1, t1, t2, memo));
        }
        return memo[key];
    }
};
```

### Complexity
- **Time:** O(m * n) — each state computed once
- **Space:** O(m * n) — memoization table

## Step 3: Tabulation (Bottom-Up DP)
### Code
**Python**
```python
def longestCommonSubsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]
```

**C++**
```cpp
class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int m = text1.size(), n = text2.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i - 1] == text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }
};
```

### Complexity
- **Time:** O(m * n) — nested loops
- **Space:** O(m * n) — 2D dp table

## Step 4: Space Optimization
### Code
**Python**
```python
def longestCommonSubsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    if m < n:
        text1, text2, m, n = text2, text1, n, m

    prev = [0] * (n + 1)
    curr = [0] * (n + 1)

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                curr[j] = prev[j - 1] + 1
            else:
                curr[j] = max(prev[j], curr[j - 1])
        prev, curr = curr, [0] * (n + 1)

    return prev[n]
```

**C++**
```cpp
class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int m = text1.size(), n = text2.size();
        if (m < n) swap(text1, text2), swap(m, n);

        vector<int> prev(n + 1, 0), curr(n + 1, 0);

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i - 1] == text2[j - 1]) {
                    curr[j] = prev[j - 1] + 1;
                } else {
                    curr[j] = max(prev[j], curr[j - 1]);
                }
            }
            swap(prev, curr);
            fill(curr.begin(), curr.end(), 0);
        }
        return prev[n];
    }
};
```

### Complexity
- **Time:** O(m * n) — same loops
- **Space:** O(min(m, n)) — two 1D arrays of size min(m,n)

## Key Insight
> LCS depends on diagonal (match), above (skip char in text1), and left (skip char in text2) — enabling 1D row compression.

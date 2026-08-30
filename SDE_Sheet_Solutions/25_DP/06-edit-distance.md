# 72. Edit Distance

> **Difficulty:** Hard | **Topic:** Dynamic Programming | **Platform:** LeetCode

---

## Problem Statement
Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`. You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character.

## Examples
**Example 1:**
```
Input: word1 = "horse", word2 = "ros"
Output: 3
Explanation:
horse -> rorse (replace 'h' with 'r')
rorse -> rose (remove 'r')
rose -> ros (remove 'e')
```

**Example 2:**
```
Input: word1 = "intention", word2 = "execution"
Output: 5
Explanation:
intention -> inention (remove 't')
inention -> enention (replace 'i' with 'e')
enention -> exention (replace 'n' with 'x')
exention -> exection (replace 'n' with 'c')
exection -> execution (insert 'u')
```

## Constraints
- `0 <= word1.length, word2.length <= 500`
- `word1` and `word2` consist of lowercase English letters

## Topic Tags
`Dynamic Programming` `String` `Edit Distance`

## Expected Complexities
| | |
|---|---|
| **Time** | O(m * n) |
| **Space** | O(min(m, n)) |

## Intuition
Compare characters from both strings. If they match, no operation needed — move both pointers. If they don't match, try all three operations (insert, delete, replace) and take the minimum. Each operation costs 1 and advances one or both pointers. The overlapping subproblems arise from reprocessing the same suffixes repeatedly.

## Approach
1. dp[i][j] = min edits to convert word1[0..i-1] to word2[0..j-1]
2. If chars match: dp[i][j] = dp[i-1][j-1]
3. Else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) for delete, insert, replace

## Step 1: Recursion
### Code
**Python**
```python
def minDistance(word1: str, word2: str) -> int:
    def helper(i, j):
        if i == 0:
            return j
        if j == 0:
            return i
        if word1[i - 1] == word2[j - 1]:
            return helper(i - 1, j - 1)
        return 1 + min(
            helper(i - 1, j),      # delete
            helper(i, j - 1),      # insert
            helper(i - 1, j - 1)   # replace
        )

    return helper(len(word1), len(word2))
```

**C++**
```cpp
class Solution {
public:
    int minDistance(string word1, string word2) {
        return helper(word1.size(), word2.size(), word1, word2);
    }

    int helper(int i, int j, string& w1, string& w2) {
        if (i == 0) return j;
        if (j == 0) return i;
        if (w1[i - 1] == w2[j - 1])
            return helper(i - 1, j - 1, w1, w2);
        return 1 + min({helper(i - 1, j, w1, w2),
                        helper(i, j - 1, w1, w2),
                        helper(i - 1, j - 1, w1, w2)});
    }
};
```

### Complexity
- **Time:** O(3^(m+n)) — three choices at each mismatch
- **Space:** O(m + n) — recursion stack depth

## Step 2: Memoization (Top-Down DP)
### Code
**Python**
```python
def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    memo = {}

    def helper(i, j):
        if i == 0:
            return j
        if j == 0:
            return i
        if (i, j) in memo:
            return memo[(i, j)]
        if word1[i - 1] == word2[j - 1]:
            memo[(i, j)] = helper(i - 1, j - 1)
        else:
            memo[(i, j)] = 1 + min(
                helper(i - 1, j),
                helper(i, j - 1),
                helper(i - 1, j - 1)
            )
        return memo[(i, j)]

    return helper(m, n)
```

**C++**
```cpp
class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size(), n = word2.size();
        unordered_map<int, int> memo;
        return helper(m, n, word1, word2, memo);
    }

    int helper(int i, int j, string& w1, string& w2, unordered_map<int, int>& memo) {
        if (i == 0) return j;
        if (j == 0) return i;
        int key = i * 501 + j;
        if (memo.count(key)) return memo[key];
        if (w1[i - 1] == w2[j - 1]) {
            memo[key] = helper(i - 1, j - 1, w1, w2, memo);
        } else {
            memo[key] = 1 + min({helper(i - 1, j, w1, w2, memo),
                                  helper(i, j - 1, w1, w2, memo),
                                  helper(i - 1, j - 1, w1, w2, memo)});
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
def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],
                    dp[i][j - 1],
                    dp[i - 1][j - 1]
                )

    return dp[m][n]
```

**C++**
```cpp
class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size(), n = word2.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1));

        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i - 1] == word2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + min({dp[i - 1][j],
                                         dp[i][j - 1],
                                         dp[i - 1][j - 1]});
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
def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    if m < n:
        word1, word2, m, n = word2, word1, n, m

    prev = list(range(n + 1))
    curr = [0] * (n + 1)

    for i in range(1, m + 1):
        curr[0] = i
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                curr[j] = prev[j - 1]
            else:
                curr[j] = 1 + min(prev[j], curr[j - 1], prev[j - 1])
        prev, curr = curr, [0] * (n + 1)

    return prev[n]
```

**C++**
```cpp
class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size(), n = word2.size();
        if (m < n) swap(word1, word2), swap(m, n);

        vector<int> prev(n + 1), curr(n + 1);
        iota(prev.begin(), prev.end(), 0);

        for (int i = 1; i <= m; i++) {
            curr[0] = i;
            for (int j = 1; j <= n; j++) {
                if (word1[i - 1] == word2[j - 1]) {
                    curr[j] = prev[j - 1];
                } else {
                    curr[j] = 1 + min({prev[j], curr[j - 1], prev[j - 1]});
                }
            }
            swap(prev, curr);
        }
        return prev[n];
    }
};
```

### Complexity
- **Time:** O(m * n) — same loops
- **Space:** O(min(m, n)) — two 1D arrays

## Key Insight
> Each cell depends on three neighbors (above, left, diagonal) — the diagonal enables 1D compression since we only need the previous row.

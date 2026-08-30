# 516. Longest Palindromic Subsequence

> **Difficulty:** Hard | **Topic:** Dynamic Programming, String | **Platform:** LeetCode

---

## Problem Statement
Given a string `s`, find the length of the longest palindromic subsequence in `s`. A subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.

## Examples
**Example 1:**
```
Input: s = "bbbab"
Output: 4
Explanation: One possible longest palindromic subsequence is "bbbb".
```

**Example 2:**
```
Input: s = "cbbd"
Output: 2
Explanation: One possible longest palindromic subsequence is "bb".
```

## Constraints
- 1 ≤ s.length ≤ 1000
- s consists only of lowercase English letters

## Topic Tags
`String` `Dynamic Programming`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n²) |
| **Space** | O(n²) or O(n) with optimization |

## Intuition
The longest palindromic subsequence can be found by comparing the string with its reverse. If we find the Longest Common Subsequence (LCS) between `s` and `reverse(s)`, that gives us the longest palindromic subsequence.

Alternatively, we can use interval DP: `dp[i][j]` = longest palindromic subsequence in s[i..j].

## Approach
1. Create reversed string `rev`
2. Find LCS between `s` and `rev`
3. The LCS length is the answer

## Step 1: Recursion
### Code
**Python**
```python
def longestPalindromeSubseq(s):
    def lcs(i, j, s1, s2):
        if i == len(s1) or j == len(s2):
            return 0
        
        if s1[i] == s2[j]:
            return 1 + lcs(i + 1, j + 1, s1, s2)
        
        return max(lcs(i + 1, j, s1, s2), lcs(i, j + 1, s1, s2))
    
    return lcs(0, 0, s, s[::-1])
```

**C++**
```cpp
class Solution {
public:
    int lcs(int i, int j, string& s1, string& s2) {
        if (i == s1.size() || j == s2.size()) return 0;
        
        if (s1[i] == s2[j]) {
            return 1 + lcs(i + 1, j + 1, s1, s2);
        }
        return max(lcs(i + 1, j, s1, s2), lcs(i, j + 1, s1, s2));
    }
    
    int longestPalindromeSubseq(string s) {
        string rev = s;
        reverse(rev.begin(), rev.end());
        return lcs(0, 0, s, rev);
    }
};
```
### Complexity
- **Time:** O(2^n) - exponential
- **Space:** O(n) - recursion stack

## Step 2: Memoization (Top-Down DP)
### Code
**Python**
```python
def longestPalindromeSubseq(s):
    def lcs(i, j, s1, s2, dp):
        if i == len(s1) or j == len(s2):
            return 0
        if dp[i][j] != -1:
            return dp[i][j]
        
        if s1[i] == s2[j]:
            dp[i][j] = 1 + lcs(i + 1, j + 1, s1, s2, dp)
        else:
            dp[i][j] = max(lcs(i + 1, j, s1, s2, dp), lcs(i, j + 1, s1, s2, dp))
        
        return dp[i][j]
    
    rev = s[::-1]
    dp = [[-1] * len(s) for _ in range(len(s))]
    return lcs(0, 0, s, rev, dp)
```

**C++**
```cpp
class Solution {
public:
    int lcs(int i, int j, string& s1, string& s2, vector<vector<int>>& dp) {
        if (i == s1.size() || j == s2.size()) return 0;
        if (dp[i][j] != -1) return dp[i][j];
        
        if (s1[i] == s2[j]) {
            dp[i][j] = 1 + lcs(i + 1, j + 1, s1, s2, dp);
        } else {
            dp[i][j] = max(lcs(i + 1, j, s1, s2, dp), lcs(i, j + 1, s1, s2, dp));
        }
        return dp[i][j];
    }
    
    int longestPalindromeSubseq(string s) {
        string rev = s;
        reverse(rev.begin(), rev.end());
        vector<vector<int>> dp(s.size(), vector<int>(s.size(), -1));
        return lcs(0, 0, s, rev, dp);
    }
};
```
### Complexity
- **Time:** O(n²)
- **Space:** O(n²)

## Step 3: Tabulation (Bottom-Up DP)
### Code
**Python**
```python
def longestPalindromeSubseq(s):
    n = len(s)
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            if s[i - 1] == s[n - j]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    return dp[n][n]
```

**C++**
```cpp
class Solution {
public:
    int longestPalindromeSubseq(string s) {
        int n = s.size();
        vector<vector<int>> dp(n + 1, vector<int>(n + 1, 0));
        
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                if (s[i - 1] == s[n - j]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[n][n];
    }
};
```
### Complexity
- **Time:** O(n²)
- **Space:** O(n²)

## Step 4: Space Optimization
### Code
**Python**
```python
def longestPalindromeSubseq(s):
    n = len(s)
    prev = [0] * (n + 1)
    curr = [0] * (n + 1)
    
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            if s[i - 1] == s[n - j]:
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
    int longestPalindromeSubseq(string s) {
        int n = s.size();
        vector<int> prev(n + 1, 0);
        vector<int> curr(n + 1, 0);
        
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                if (s[i - 1] == s[n - j]) {
                    curr[j] = prev[j - 1] + 1;
                } else {
                    curr[j] = max(prev[j], curr[j - 1]);
                }
            }
            prev = curr;
            fill(curr.begin(), curr.end(), 0);
        }
        return prev[n];
    }
};
```
### Complexity
- **Time:** O(n²)
- **Space:** O(n)

## Key Insight
> The longest palindromic subsequence equals the LCS of the string with its reverse. This transforms the problem into a classic LCS problem that can be solved with 1D DP space optimization.

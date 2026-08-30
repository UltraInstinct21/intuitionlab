# 1312. Minimum Insertions to Make String Palindrome

> **Difficulty:** Hard | **Topic:** String, Dynamic Programming | **Platform:** LeetCode

---

## Problem Statement
Given a string `s`. In one step you can insert any character at any index of the string. Return the minimum number of steps to make `s` a palindrome.

## Examples
**Example 1:**
```
Input: s = "leetcode"
Output: 5
Explanation: Inserting 5 characters the string becomes "leetcodetceedle". (One possible answer is "leetcodedetcel")
```

**Example 2:**
```
Input: s = "zzazz"
Output: 0
Explanation: The string "zzazz" is already a palindrome.
```

**Example 3:**
```
Input: s = "mbadm"
Output: 2
Explanation: "mbadbm" or "mdbadm" are valid palindromes with 2 insertions.
```

## Constraints
- 1 ≤ s.length ≤ 500
- s consists of lowercase English letters

## Topic Tags
`String` `Dynamic-Programming` `Palindrome`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n^2) |
| **Space** | O(n^2) |

## Intuition
To make a string a palindrome by inserting minimum characters, we need to find the longest palindromic subsequence (LPS). Characters that are already part of the LPS don't need insertion. The minimum insertions needed is `n - LPS_length`. This reduces to finding the Longest Common Subsequence (LCS) between `s` and its reverse.

## Approach
1. Let `s_rev` be the reverse of `s`.
2. Find the LCS of `s` and `s_rev` using dynamic programming.
3. The LPS length = LCS length.
4. The minimum insertions = `n - LPS_length`.

Alternatively, we can directly use a 2D DP where `dp[i][j]` represents the minimum insertions needed to make `s[i..j]` a palindrome.

## Brute Force
### Approach
Try all possible insertions at every position and check if the result is a palindrome. This is exponential.

### Code
**Python**
```python
# Exponential brute force - not practical
def minInsertions(s):
    def is_palindrome(s):
        return s == s[::-1]
    
    def helper(s, insertions):
        if is_palindrome(s):
            return insertions
        result = float('inf')
        for i in range(len(s) + 1):
            result = min(result, helper(s[:i] + 'a' + s[i:], insertions + 1))
        return result
    
    return helper(s, 0)
```

**C++**
```cpp
bool isPalindrome(string s) {
    string r = s;
    reverse(r.begin(), r.end());
    return s == r;
}

int minInsertions(string s) {
    if (isPalindrome(s)) return 0;
    int res = INT_MAX;
    for (int i = 0; i <= s.size(); i++) {
        string t = s.substr(0, i) + "a" + s.substr(i);
        res = min(res, minInsertions(t) + 1);
    }
    return res;
}
```

### Complexity
- **Time:** O(2^n) exponential
- **Space:** O(n) recursion stack

## Optimized Solution
### Code
**Python**
```python
def minInsertions(s):
    n = len(s)
    s_rev = s[::-1]
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            if s[i - 1] == s_rev[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return n - dp[n][n]
```

**C++**
```cpp
int minInsertions(string s) {
    int n = s.size();
    string s_rev = s;
    reverse(s_rev.begin(), s_rev.end());
    vector<vector<int>> dp(n + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (s[i - 1] == s_rev[j - 1])
                dp[i][j] = dp[i - 1][j - 1] + 1;
            else
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return n - dp[n][n];
}
```

### Complexity
- **Time:** O(n^2)
- **Space:** O(n^2)

## Key Insight
> The minimum insertions to make a string a palindrome equals `n - length of the longest palindromic subsequence`, which can be computed via LCS of the string and its reverse.

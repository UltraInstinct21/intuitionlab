# Palindrome Partitioning

> **Difficulty:** Medium | **Topic:** Recursion, Backtracking, String | **Platform:** LeetCode

---

## Problem Statement
Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s.

## Examples
**Example 1:**
```
Input: s = "aab"
Output: [["a", "a", "b"], ["aa", "b"]]
```

**Example 2:**
```
Input: s = "a"
Output: [["a"]]
```

## Constraints
- 1 ≤ s.length ≤ 16
- s contains only lowercase English letters

## Topic Tags
`Recursion` `Backtracking` `String` `Dynamic Programming`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n * 2^n) |
| **Space** | O(n) recursion stack |

## Intuition
At each position in the string, we try all possible partitions. For each partition, we check if the left substring is a palindrome. If yes, we recurse on the remaining string. When we reach the end of the string, we have a valid partitioning.

## Approach
1. Use recursion with current index and current partition list
2. At each index `i`, try all substrings from current position to `i`
3. Check if substring is palindrome
4. If yes, add to current partition and recurse from `i+1`
5. When `start == n`, add current partition to result
6. Backtrack by removing last added substring

## Brute Force
### Approach
Generate all possible partitions (2^(n-1) ways), check if each is valid.
### Code
**Python**
```python
def partition(s):
    result = []
    
    def isPalindrome(sub):
        return sub == sub[::-1]
    
    def solve(start, current):
        if start == len(s):
            result.append(current[:])
            return
        for i in range(start, len(s)):
            sub = s[start:i+1]
            if isPalindrome(sub):
                current.append(sub)
                solve(i + 1, current)
                current.pop()
    
    solve(0, [])
    return result
```
**C++**
```cpp
class Solution {
  public:
    vector<vector<string>> partition(string s) {
        vector<vector<string>> result;
        
        function<bool(string)> isPal = [](string sub) {
            int l = 0, r = sub.size() - 1;
            while (l < r) {
                if (sub[l++] != sub[r--]) return false;
            }
            return true;
        };
        
        function<void(int, vector<string>&)> solve = [&](int start, vector<string>& current) {
            if (start == s.size()) {
                result.push_back(current);
                return;
            }
            for (int i = start; i < s.size(); i++) {
                string sub = s.substr(start, i - start + 1);
                if (isPal(sub)) {
                    current.push_back(sub);
                    solve(i + 1, current);
                    current.pop();
                }
            }
        };
        
        vector<string> temp;
        solve(0, temp);
        return result;
    }
};
```
### Complexity
- **Time:** O(n * 2^n) checking palindrome takes O(n)
- **Space:** O(n) recursion depth

## Optimized Solution
### Code
**Python**
```python
def partition(s):
    n = len(s)
    result = []
    
    # precompute palindrome table
    dp = [[False] * n for _ in range(n)]
    for i in range(n):
        for j in range(i, -1, -1):
            if s[i] == s[j] and (i - j <= 2 or dp[j+1][i-1]):
                dp[j][i] = True
    
    def solve(start, current):
        if start == n:
            result.append(current[:])
            return
        for i in range(start, n):
            if dp[start][i]:
                current.append(s[start:i+1])
                solve(i + 1, current)
                current.pop()
    
    solve(0, [])
    return result
```
**C++**
```cpp
class Solution {
  public:
    vector<vector<string>> partition(string s) {
        int n = s.size();
        vector<vector<string>> result;
        
        vector<vector<bool>> dp(n, vector<bool>(n, false));
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                dp[i][j] = (s[i] == s[j]) && (j - i <= 2 || dp[i+1][j-1]);
            }
        }
        
        function<void(int, vector<string>&)> solve = [&](int start, vector<string>& current) {
            if (start == n) {
                result.push_back(current);
                return;
            }
            for (int i = start; i < n; i++) {
                if (dp[start][i]) {
                    current.push_back(s.substr(start, i - start + 1));
                    solve(i + 1, current);
                    current.pop();
                }
            }
        };
        
        vector<string> temp;
        solve(0, temp);
        return result;
    }
};
```
### Complexity
- **Time:** O(n * 2^n) — palindrome check is O(1) after DP, still 2^n partitions
- **Space:** O(n^2) for DP table + O(n) recursion

## Key Insight
> Precomputing a palindrome DP table reduces substring check from O(n) to O(1), making partitioning the bottleneck.
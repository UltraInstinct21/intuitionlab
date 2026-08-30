# 131. Palindrome Partitioning

> **Difficulty:** Hard | **Topic:** Dynamic Programming, String, Backtracking | **Platform:** LeetCode

---

## Problem Statement
Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of `s`.

## Examples
**Example 1:**
```
Input: s = "aab"
Output: [["a","a","b"],["aa","b"]]
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
`String` `Dynamic Programming` `Backtracking`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n × 2ⁿ) |
| **Space** | O(n) |

## Intuition
We need to find all ways to partition a string into palindromic substrings. The approach involves:
1. First checking if a substring is a palindrome (using DP)
2. Then using backtracking to generate all valid partitions

For palindrome checking, `isPalin[i][j]` is true if s[i..j] is a palindrome. We precompute this using interval DP.

## Approach
1. Precompute palindrome information using DP
2. Use backtracking to explore all partitions
3. At each position, try all possible next cuts
4. If the substring from current position to cut is palindrome, include it and recurse

## Step 1: Recursion
### Code
**Python**
```python
def partition(s):
    n = len(s)
    
    def isPalindrome(start, end):
        while start < end:
            if s[start] != s[end]:
                return False
            start += 1
            end -= 1
        return True
    
    def solve(index, path):
        if index == n:
            result.append(path[:])
            return
        
        for end in range(index, n):
            if isPalindrome(index, end):
                path.append(s[index:end + 1])
                solve(end + 1, path)
                path.pop()
    
    result = []
    solve(0, [])
    return result
```

**C++**
```cpp
class Solution {
public:
    bool isPalindrome(string& s, int start, int end) {
        while (start < end) {
            if (s[start] != s[end]) return false;
            start++;
            end--;
        }
        return true;
    }
    
    void solve(int index, string& s, vector<string>& path, vector<vector<string>>& result) {
        if (index == s.size()) {
            result.push_back(path);
            return;
        }
        
        for (int end = index; end < s.size(); end++) {
            if (isPalindrome(s, index, end)) {
                path.push_back(s.substr(index, end - index + 1));
                solve(end + 1, s, path, result);
                path.pop_back();
            }
        }
    }
    
    vector<vector<string>> partition(string s) {
        vector<vector<string>> result;
        vector<string> path;
        solve(0, s, path, result);
        return result;
    }
};
```
### Complexity
- **Time:** O(n × 2ⁿ) - For each position, we may make a cut or not
- **Space:** O(n) - recursion stack

## Step 2: Memoization (Top-Down DP)
### Code
**Python**
```python
def partition(s):
    n = len(s)
    dp = [[False] * n for _ in range(n)]
    
    for i in range(n):
        dp[i][i] = True
    for i in range(n - 1):
        if s[i] == s[i + 1]:
            dp[i][i + 1] = True
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j] and dp[i + 1][j - 1]:
                dp[i][j] = True
    
    memo = {}
    
    def solve(index):
        if index == n:
            return [[]]
        if index in memo:
            return memo[index]
        
        result = []
        for end in range(index, n):
            if dp[index][end]:
                rest_partitions = solve(end + 1)
                for partition in rest_partitions:
                    result.append([s[index:end + 1]] + partition)
        
        memo[index] = result
        return result
    
    return solve(0)
```

**C++**
```cpp
class Solution {
public:
    vector<vector<string>> partition(string s) {
        int n = s.size();
        vector<vector<bool>> dp(n, vector<bool>(n, false));
        
        for (int i = 0; i < n; i++) dp[i][i] = true;
        for (int i = 0; i < n - 1; i++) {
            if (s[i] == s[i + 1]) dp[i][i + 1] = true;
        }
        for (int len = 3; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                if (s[i] == s[j] && dp[i + 1][j - 1]) {
                    dp[i][j] = true;
                }
            }
        }
        
        unordered_map<int, vector<vector<string>>> memo;
        
        function<vector<vector<string>>(int)> solve = [&](int index) {
            if (index == n) return vector<vector<string>>(1, vector<string>());
            if (memo.count(index)) return memo[index];
            
            vector<vector<string>> result;
            for (int end = index; end < n; end++) {
                if (dp[index][end]) {
                    auto rest = solve(end + 1);
                    string sub = s.substr(index, end - index + 1);
                    for (auto& part : rest) {
                        vector<string> current = {sub};
                        current.insert(current.end(), part.begin(), part.end());
                        result.push_back(current);
                    }
                }
            }
            return memo[index] = result;
        };
        
        return solve(0);
    }
};
```
### Complexity
- **Time:** O(n² + n × 2ⁿ) - O(n²) for palindrome check + O(n × 2ⁿ) for partition generation
- **Space:** O(n²) - palindrome DP table + memoization

## Step 3: Tabulation (Bottom-Up DP)
### Code
**Python**
```python
def partition(s):
    n = len(s)
    dp = [[False] * n for _ in range(n)]
    
    for i in range(n):
        dp[i][i] = True
    for i in range(n - 1):
        if s[i] == s[i + 1]:
            dp[i][i + 1] = True
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j] and dp[i + 1][j - 1]:
                dp[i][j] = True
    
    result = [[] for _ in range(n + 1)]
    result[0] = [[]]
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j][i - 1]:
                for partition in result[j]:
                    result[i].append(partition + [s[j:i]])
    
    return result[n]
```

**C++**
```cpp
class Solution {
public:
    vector<vector<string>> partition(string s) {
        int n = s.size();
        vector<vector<bool>> dp(n, vector<bool>(n, false));
        
        for (int i = 0; i < n; i++) dp[i][i] = true;
        for (int i = 0; i < n - 1; i++) {
            if (s[i] == s[i + 1]) dp[i][i + 1] = true;
        }
        for (int len = 3; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                if (s[i] == s[j] && dp[i + 1][j - 1]) {
                    dp[i][j] = true;
                }
            }
        }
        
        vector<vector<vector<string>>> result(n + 1);
        result[0] = {{}};
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j][i - 1]) {
                    for (auto& part : result[j]) {
                        vector<string> current = part;
                        current.push_back(s.substr(j, i - j));
                        result[i].push_back(current);
                    }
                }
            }
        }
        
        return result[n];
    }
};
```
### Complexity
- **Time:** O(n² + n × 2ⁿ)
- **Space:** O(n × 2ⁿ) - storing all partitions

## Step 4: Space Optimization
### Code
**Python**
```python
def partition(s):
    n = len(s)
    dp = [[False] * n for _ in range(n)]
    
    for i in range(n):
        dp[i][i] = True
    for i in range(n - 1):
        if s[i] == s[i + 1]:
            dp[i][i + 1] = True
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j] and dp[i + 1][j - 1]:
                dp[i][j] = True
    
    result = [[] for _ in range(n + 1)]
    result[0] = [[]]
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j][i - 1]:
                for partition in result[j]:
                    result[i].append(partition + [s[j:i]])
    
    return result[n]
```

**C++**
```cpp
// Same as tabulation - cannot optimize further as we need all partitions
class Solution {
public:
    vector<vector<string>> partition(string s) {
        int n = s.size();
        vector<vector<bool>> dp(n, vector<bool>(n, false));
        
        for (int i = 0; i < n; i++) dp[i][i] = true;
        for (int i = 0; i < n - 1; i++) {
            if (s[i] == s[i + 1]) dp[i][i + 1] = true;
        }
        for (int len = 3; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                if (s[i] == s[j] && dp[i + 1][j - 1]) {
                    dp[i][j] = true;
                }
            }
        }
        
        vector<vector<vector<string>>> result(n + 1);
        result[0] = {{}};
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j][i - 1]) {
                    for (auto& part : result[j]) {
                        vector<string> current = part;
                        current.push_back(s.substr(j, i - j));
                        result[i].push_back(current);
                    }
                }
            }
        }
        
        return result[n];
    }
};
```
### Complexity
- **Time:** O(n² + n × 2ⁿ)
- **Space:** O(n × 2ⁿ) - unavoidable for returning all partitions

## Key Insight
> Precompute palindrome information using interval DP, then use DP/backtracking to generate all valid partitions where each substring is a palindrome.

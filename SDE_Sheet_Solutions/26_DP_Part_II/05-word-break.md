# 139. Word Break

> **Difficulty:** Medium | **Topic:** Dynamic Programming, String | **Platform:** LeetCode

---

## Problem Statement
Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words. Note that the same word in the dictionary may be reused multiple times in the segmentation.

## Examples
**Example 1:**
```
Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
Explanation: Return true because "leetcode" can be segmented as "leet code".
```

**Example 2:**
```
Input: s = "applepenapple", wordDict = ["apple","pen"]
Output: true
Explanation: Return true because "applepenapple" can be segmented as "apple pen apple".
```

**Example 3:**
```
Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
Output: false
```

## Constraints
- 1 ≤ s.length ≤ 300
- 1 ≤ wordDict.length ≤ 1000
- 1 ≤ wordDict[i].length ≤ 20
- s and wordDict[i] consist of only lowercase English letters
- All the strings of wordDict are unique

## Topic Tags
`Hash Table` `String` `Dynamic Programming` `Trie`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n² × m) where m is max word length |
| **Space** | O(n) |

## Intuition
We need to check if the string can be broken into dictionary words. At each position in the string, we check all possible prefixes. If a prefix is in the dictionary and the remaining suffix can also be segmented, then the whole string can be segmented.

`dp[i]` = True if s[0:i] can be segmented. For each i, check all j < i: if dp[j] is True and s[j:i] is in wordDict, then dp[i] is True.

## Approach
1. Create a set from wordDict for O(1) lookup
2. Initialize dp[0] = True (empty string is always valid)
3. For each position i from 1 to n, check all previous positions j
4. If dp[j] is True and s[j:i] is in wordDict, set dp[i] = True
5. Return dp[n]

## Step 1: Recursion
### Code
**Python**
```python
def wordBreak(s, wordDict):
    wordSet = set(wordDict)
    n = len(s)
    
    def solve(index):
        if index == n:
            return True
        
        for end in range(index + 1, n + 1):
            if s[index:end] in wordSet and solve(end):
                return True
        
        return False
    
    return solve(0)
```

**C++**
```cpp
class Solution {
public:
    bool solve(int index, string& s, unordered_set<string>& wordSet) {
        if (index == s.size()) return true;
        
        for (int end = index + 1; end <= s.size(); end++) {
            string word = s.substr(index, end - index);
            if (wordSet.count(word) && solve(end, s, wordSet)) {
                return true;
            }
        }
        return false;
    }
    
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        return solve(0, s, wordSet);
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
def wordBreak(s, wordDict):
    wordSet = set(wordDict)
    n = len(s)
    dp = [-1] * n
    
    def solve(index):
        if index == n:
            return True
        if dp[index] != -1:
            return dp[index] == 1
        
        for end in range(index + 1, n + 1):
            if s[index:end] in wordSet and solve(end):
                dp[index] = 1
                return True
        
        dp[index] = 0
        return False
    
    return solve(0)
```

**C++**
```cpp
class Solution {
public:
    bool solve(int index, string& s, unordered_set<string>& wordSet, vector<int>& dp) {
        if (index == s.size()) return true;
        if (dp[index] != -1) return dp[index] == 1;
        
        for (int end = index + 1; end <= s.size(); end++) {
            string word = s.substr(index, end - index);
            if (wordSet.count(word) && solve(end, s, wordSet, dp)) {
                dp[index] = 1;
                return true;
            }
        }
        dp[index] = 0;
        return false;
    }
    
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        vector<int> dp(s.size(), -1);
        return solve(0, s, wordSet, dp);
    }
};
```
### Complexity
- **Time:** O(n²) - O(n) states, O(n) per state
- **Space:** O(n) - DP array + recursion stack

## Step 3: Tabulation (Bottom-Up DP)
### Code
**Python**
```python
def wordBreak(s, wordDict):
    wordSet = set(wordDict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in wordSet:
                dp[i] = True
                break
    
    return dp[n]
```

**C++**
```cpp
class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        int n = s.size();
        vector<bool> dp(n + 1, false);
        dp[0] = true;
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && wordSet.count(s.substr(j, i - j))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[n];
    }
};
```
### Complexity
- **Time:** O(n² × m) where m is max word length for substring operations
- **Space:** O(n)

## Step 4: Space Optimization
### Code
**Python**
```python
def wordBreak(s, wordDict):
    wordSet = set(wordDict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in wordSet:
                dp[i] = True
                break
    
    return dp[n]
```

**C++**
```cpp
// Space optimization not possible - need full dp array for lookback
class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        int n = s.size();
        vector<bool> dp(n + 1, false);
        dp[0] = true;
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && wordSet.count(s.substr(j, i - j))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[n];
    }
};
```
### Complexity
- **Time:** O(n² × m)
- **Space:** O(n)

## Key Insight
> Word Break uses a DP approach where dp[i] indicates if s[0:i] can be segmented. At each position, we check all possible last words ending at i and verify if the prefix before them was also segmentable.

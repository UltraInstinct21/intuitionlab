# Word Break - Print All Possible Ways

> **Difficulty:** Medium | **Topic:** Backtracking, Recursion | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a string `s` and a dictionary of words `dict`, print all possible ways to break the string into constituent dictionary words. Each word in the dictionary can be used multiple times. Print all possible segmentations.

## Examples
**Example 1:**
```
Input: s = "catsanddog", dict = ["cat", "cats", "and", "sand", "dog"]
Output: ["cat sand dog", "cats and dog"]
```

**Example 2:**
```
Input: s = "pineapplepenapple", dict = ["apple", "pen", "applepen", "pine", "pineapple"]
Output: ["pine apple pen apple", "pine applepen apple", "pineapple pen apple"]
```

## Constraints
- 1 <= s.length <= 20
- 1 <= dict.length <= 1000
- 1 <= dict[i].length <= 20
- All dictionary words are unique.

## Topic Tags
`Backtracking` `Recursion` `String`

## Expected Complexities
| | |
|---|---|
| **Time** | O(2^n) |
| **Space** | O(n) - recursion stack |

## Intuition
We need to find all possible ways to segment the string using dictionary words. We use backtracking to try all possible prefixes at each position. If a prefix is a valid dictionary word, we add it to the current path and recurse on the remaining string. When we reach the end of the string, we've found a valid segmentation.

## Approach
1. Convert the dictionary to a set for O(1) lookups.
2. Use a recursive function that takes the current index and current path.
3. If the current index equals the string length, add the current path to the result.
4. For each possible end index from the current index, check if the substring is in the dictionary.
5. If it is, add it to the path and recurse on the remaining string.
6. Backtrack by removing the word from the path.

## Brute Force
### Approach
Try all possible splits and check if each part is a valid dictionary word.
### Code
**Python**
```python
class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> list[str]:
        result = []
        word_set = set(wordDict)
        
        def backtrack(start, current):
            if start == len(s):
                result.append(' '.join(current))
                return
            for end in range(start + 1, len(s) + 1):
                word = s[start:end]
                if word in word_set:
                    current.append(word)
                    backtrack(end, current)
                    current.pop()
        
        backtrack(0, [])
        return result
```
**C++**
```cpp
class Solution {
public:
    vector<string> wordBreak(string s, vector<string>& wordDict) {
        vector<string> result;
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        vector<string> current;
        
        function<void(int)> backtrack = [&](int start) {
            if (start == s.size()) {
                string sentence;
                for (int i = 0; i < current.size(); i++) {
                    if (i > 0) sentence += " ";
                    sentence += current[i];
                }
                result.push_back(sentence);
                return;
            }
            for (int end = start + 1; end <= s.size(); end++) {
                string word = s.substr(start, end - start);
                if (wordSet.count(word)) {
                    current.push_back(word);
                    backtrack(end);
                    current.pop_back();
                }
            }
        };
        
        backtrack(0);
        return result;
    }
};
```
### Complexity
- Time: O(2^n) - trying all possible splits
- Space: O(n) - recursion stack

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> list[str]:
        result = []
        word_set = set(wordDict)
        max_len = max(len(w) for w in wordDict)
        
        def backtrack(start, current):
            if start == len(s):
                result.append(' '.join(current))
                return
            for end in range(start + 1, min(start + max_len + 1, len(s) + 1)):
                word = s[start:end]
                if word in word_set:
                    current.append(word)
                    backtrack(end, current)
                    current.pop()
        
        backtrack(0, [])
        return result
```
**C++**
```cpp
class Solution {
public:
    vector<string> wordBreak(string s, vector<string>& wordDict) {
        vector<string> result;
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        int maxLen = 0;
        for (const string& word : wordDict)
            maxLen = max(maxLen, (int)word.size());
        
        vector<string> current;
        
        function<void(int)> backtrack = [&](int start) {
            if (start == s.size()) {
                string sentence;
                for (int i = 0; i < current.size(); i++) {
                    if (i > 0) sentence += " ";
                    sentence += current[i];
                }
                result.push_back(sentence);
                return;
            }
            for (int end = start + 1; end <= min(start + maxLen, (int)s.size()); end++) {
                string word = s.substr(start, end - start);
                if (wordSet.count(word)) {
                    current.push_back(word);
                    backtrack(end);
                    current.pop_back();
                }
            }
        };
        
        backtrack(0);
        return result;
    }
};
```
### Complexity
- Time: O(2^n) - backtracking with early termination
- Space: O(n) - recursion stack

## Key Insight
> Limiting the maximum prefix length to the longest dictionary word reduces unnecessary substring checks, optimizing the backtracking process without changing the worst-case complexity.

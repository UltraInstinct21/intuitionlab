# 14. Longest Common Prefix

> **Difficulty:** Easy | **Topic:** String | **Platform:** LeetCode

---

## Problem Statement
Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string `""`.

## Examples
**Example 1:**
```
Input: strs = ["flower","flow","flight"]
Output: "fl"
```

**Example 2:**
```
Input: strs = ["dog","racecar","car"]
Output: ""
```

## Constraints
- `1 <= strs.length <= 200`
- `0 <= strs[i].length <= 200`
- `strs[i]` consists of only lowercase English letters.

## Topic Tags
`String`

## Expected Complexities
| | |
|---|---|
| **Time** | O(S) where S is the sum of all characters |
| **Space** | O(1) |

## Intuition
The longest common prefix must be a prefix of every string in the array. We can take the first string as a reference and check how many characters of it match with all other strings. The moment a mismatch is found, we stop. This naturally gives us the longest common prefix.

## Approach
1. If the array is empty, return `""`.
2. Take the first string as the reference prefix.
3. For each subsequent string, compare character by character with the prefix.
4. Truncate the prefix at the first mismatch.
5. If the prefix becomes empty, return `""`.
6. Return the final prefix.

## Brute Force
### Approach
Compare character by character across all strings, incrementing a shared prefix length until a mismatch is found.
### Code
**Python**
```python
class Solution:
    def longestCommonPrefix(self, strs: list[str]) -> str:
        if not strs:
            return ""
        prefix = strs[0]
        for s in strs[1:]:
            while not s.startswith(prefix):
                prefix = prefix[:-1]
                if not prefix:
                    return ""
        return prefix
```
**C++**
```cpp
class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        if (strs.empty()) return "";
        string prefix = strs[0];
        for (int i = 1; i < strs.size(); i++) {
            while (strs[i].find(prefix) != 0) {
                prefix = prefix.substr(0, prefix.size() - 1);
                if (prefix.empty()) return "";
            }
        }
        return prefix;
    }
};
```
### Complexity
- **Time:** O(S) where S is the sum of all characters in all strings
- **Space:** O(1)

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def longestCommonPrefix(self, strs: list[str]) -> str:
        if not strs:
            return ""
        min_len = min(len(s) for s in strs)
        result = []
        for i in range(min_len):
            char = strs[0][i]
            for s in strs[1:]:
                if s[i] != char:
                    return ''.join(result)
            result.append(char)
        return ''.join(result)
```
**C++**
```cpp
class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        if (strs.empty()) return "";
        int minLen = INT_MAX;
        for (const string& s : strs) {
            minLen = min(minLen, (int)s.size());
        }
        string result;
        for (int i = 0; i < minLen; i++) {
            char c = strs[0][i];
            for (int j = 1; j < strs.size(); j++) {
                if (strs[j][i] != c) return result;
            }
            result += c;
        }
        return result;
    }
};
```
### Complexity
- **Time:** O(S) where S is the sum of all characters
- **Space:** O(1) (excluding output)

## Key Insight
> Vertical scanning (comparing column by column across all strings) avoids creating substring objects and short-circuits as soon as any mismatch is found, making it both time and space efficient.

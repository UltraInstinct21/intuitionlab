# 14. Longest Common Prefix

> **Difficulty:** Easy | **Topic:** Trie, String | **Platform:** LeetCode

---

## Problem Statement
Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string `""`.

## Examples
**Example 1:**
```
Input: strs = ["flower", "flow", "flight"]
Output: "fl"
```

**Example 2:**
```
Input: strs = ["dog", "racecar", "car"]
Output: ""
Explanation: There is no common prefix among the input strings.
```

## Constraints
- `1 <= strs.length <= 200`
- `0 <= strs[i].length <= 200`
- `strs[i]` consists of only lowercase English letters.

## Topic Tags
`Trie` `String`

## Expected Complexities
| | |
|---|---|
| **Time** | O(S) where S is sum of all characters |
| **Space** | O(m) where m is the length of the shortest string |

## Intuition
The longest common prefix must be a prefix of all strings. We can use a Trie to store all strings and then find the common path from the root. However, a simpler approach is to sort the strings and compare only the first and last strings, as they will have the most different prefixes.

Another approach is to build a Trie with all strings and traverse down while a node has only one child.

## Approach
1. **Sorting approach**: Sort the array. The longest common prefix is the common prefix between the first and last strings after sorting.
2. **Trie approach**: Insert all strings into a Trie. Traverse from root, stopping when we find a node with multiple children or reach the end.

## Brute Force
### Approach
Compare characters of all strings one by one. For each position, check if all strings have the same character. Stop when a mismatch is found.

### Code
**Python**
```python
class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        if not strs:
            return ""
        prefix = ""
        for i in range(len(min(strs, key=len))):
            char = strs[0][i]
            if all(s[i] == char for s in strs):
                prefix += char
            else:
                break
        return prefix
```

**C++**
```cpp
class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        if (strs.empty()) return "";
        string prefix = "";
        for (int i = 0; i < strs[0].size(); i++) {
            char c = strs[0][i];
            for (const string& s : strs) {
                if (i >= s.size() || s[i] != c) return prefix;
            }
            prefix += c;
        }
        return prefix;
    }
};
```

### Complexity
- Time: O(S) where S is sum of all characters
- Space: O(1) excluding output

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        if not strs:
            return ""
        strs.sort()
        first = strs[0]
        last = strs[-1]
        prefix = ""
        for i in range(len(first)):
            if i < len(last) and first[i] == last[i]:
                prefix += first[i]
            else:
                break
        return prefix
```

**C++**
```cpp
class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        if (strs.empty()) return "";
        sort(strs.begin(), strs.end());
        string first = strs[0];
        string last = strs.back();
        string prefix = "";
        for (int i = 0; i < first.size(); i++) {
            if (i < last.size() && first[i] == last[i]) {
                prefix += first[i];
            } else {
                break;
            }
        }
        return prefix;
    }
};
```

### Complexity
- Time: O(S * log n) for sorting where S is total characters and n is number of strings
- Space: O(1) excluding output

## Alternative Trie Solution
### Code
**Python**
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        if not strs:
            return ""
        trie = Trie()
        for word in strs:
            trie.insert(word)
        prefix = ""
        node = trie.root
        while len(node.children) == 1 and not node.is_end:
            char = list(node.children.keys())[0]
            prefix += char
            node = node.children[char]
        return prefix
```

**C++**
```cpp
class TrieNode {
public:
    TrieNode* children[26];
    bool is_end;
    TrieNode() {
        for (int i = 0; i < 26; i++) children[i] = nullptr;
        is_end = false;
    }
};

class Trie {
public:
    TrieNode* root;
    Trie() { root = new TrieNode(); }
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) node->children[idx] = new TrieNode();
            node = node->children[idx];
        }
        node->is_end = true;
    }
};

class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        if (strs.empty()) return "";
        Trie trie;
        for (string& word : strs) trie.insert(word);
        string prefix = "";
        TrieNode* node = trie.root;
        int childCount = 0;
        for (int i = 0; i < 26; i++) {
            if (node->children[i]) childCount++;
        }
        while (childCount == 1 && !node->is_end) {
            for (int i = 0; i < 26; i++) {
                if (node->children[i]) {
                    prefix += ('a' + i);
                    node = node->children[i];
                    break;
                }
            }
            childCount = 0;
            for (int i = 0; i < 26; i++) {
                if (node->children[i]) childCount++;
            }
        }
        return prefix;
    }
};
```

### Complexity
- Time: O(S) for building Trie and O(m) for traversal
- Space: O(S) for Trie storage

## Key Insight
> After sorting the array, the longest common prefix is simply the common prefix between the first and last strings, as they are lexicographically most different.

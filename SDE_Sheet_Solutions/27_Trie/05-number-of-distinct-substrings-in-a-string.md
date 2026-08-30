# Number of Distinct Substrings in a String

> **Difficulty:** Medium | **Topic:** Trie, String | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a string `s` of length `n`, count the number of distinct non-empty substrings present in it.

## Examples
**Example 1:**
```
Input: s = "ababa"
Output: 10
Explanation: The distinct substrings are: "a", "ab", "aba", "abab", "ababa", "b", "ba", "bab", "baba", "aba"
```

**Example 2:**
```
Input: s = "abc"
Output: 6
Explanation: The distinct substrings are: "a", "ab", "abc", "b", "bc", "c"
```

## Constraints
- `1 <= s.length <= 10^4`
- `s` consists of lowercase English letters.

## Topic Tags
`Trie` `String`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N^2) where N is string length |
| **Space** | O(N^2) |

## Intuition
Every substring is a prefix of some suffix. We can insert all suffixes into a Trie. The number of distinct substrings equals the total number of nodes in the Trie (excluding root).

Each path from root to any node represents a unique substring, so counting nodes gives us the count of distinct substrings.

## Approach
1. Generate all suffixes of the string.
2. Insert each suffix into a Trie.
3. Count the total number of nodes created (excluding root).
4. Return the count.

## Brute Force
### Approach
Generate all substrings, store them in a set, and return the size of the set.

### Code
**Python**
```python
class Solution:
    def countDistinctSubstrings(self, s):
        substrings = set()
        n = len(s)
        for i in range(n):
            for j in range(i + 1, n + 1):
                substrings.add(s[i:j])
        return len(substrings)
```

**C++**
```cpp
class Solution {
public:
    int countDistinctSubstrings(string s) {
        unordered_set<string> substrings;
        int n = s.size();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j <= n; j++) {
                substrings.insert(s.substr(i, j - i));
            }
        }
        return substrings.size();
    }
};
```

### Complexity
- Time: O(N^3) due to substring creation
- Space: O(N^2)

## Optimized Solution
### Code
**Python**
```python
class TrieNode:
    def __init__(self):
        self.children = {}

class Trie:
    def __init__(self):
        self.root = TrieNode()
        self.count = 0

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
                self.count += 1
            node = node.children[char]

class Solution:
    def countDistinctSubstrings(self, s):
        trie = Trie()
        n = len(s)
        for i in range(n):
            trie.insert(s[i:])
        return trie.count + 1
```

**C++**
```cpp
class TrieNode {
public:
    TrieNode* children[26];
    TrieNode() {
        for (int i = 0; i < 26; i++) children[i] = nullptr;
    }
};

class Trie {
public:
    TrieNode* root;
    int count;
    Trie() { 
        root = new TrieNode(); 
        count = 0;
    }
    
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) {
                node->children[idx] = new TrieNode();
                count++;
            }
            node = node->children[idx];
        }
    }
};

class Solution {
public:
    int countDistinctSubstrings(string s) {
        Trie trie;
        int n = s.size();
        for (int i = 0; i < n; i++) {
            trie.insert(s.substr(i));
        }
        return trie.count + 1;
    }
};
```

### Complexity
- Time: O(N^2) for inserting all suffixes
- Space: O(N^2) for Trie

## Key Insight
> Each node in the Trie (except root) represents a unique substring. By inserting all suffixes, we automatically create nodes for all distinct substrings.

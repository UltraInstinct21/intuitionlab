# Complete String

> **Difficulty:** Medium | **Topic:** Trie, String | **Platform:** GeeksforGeeks

---

## Problem Statement
You are given an array of strings `words` consisting of lowercase English letters. A string is called a complete string if it can be formed by concatenating some (possibly empty) prefix of a string `s` with some (possibly empty) suffix of the same string `s` (both prefix and suffix can be empty).

For example, `"a"` is a complete string because it can be formed by taking prefix `"a"` and suffix `""`.
Similarly, `"ab"` is complete because prefix `"a"` + suffix `"b"`, and `"ba"` is complete because prefix `"b"` + suffix `"a"`.

Find the longest complete string in the array. If there are multiple longest complete strings, return the lexicographically largest one. If there is no complete string, return `""`.

## Examples
**Example 1:**
```
Input: words = ["ab", "aa", "a", "ba", "b"]
Output: "ba"
Explanation: "ba" is complete because it can be formed as prefix "b" + suffix "a".
```

**Example 2:**
```
Input: words = ["abc", "ab", "a", "b", "bc"]
Output: "abc"
```

## Constraints
- `1 <= words.length <= 10^4`
- `1 <= words[i].length <= 10`
- `words[i]` consists of only lowercase English letters.

## Topic Tags
`Trie` `String`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N * M^2) where N is number of words and M is max word length |
| **Space** | O(N * M) |

## Intuition
For a string to be complete, it must be a concatenation of a prefix and suffix from itself. This means for a string `s` of length `n`, there must exist some index `i` such that `s[0:i]` and `s[i:n]` are both valid prefixes in the trie (i.e., both exist as words in the array).

We can use a Trie to store all words, then for each word, check if it can be split into two valid prefixes.

## Approach
1. Insert all words into a Trie.
2. For each word, check all possible split points (i from 0 to n-1).
3. For each split, check if both `word[0:i]` and `word[i:n]` exist in the Trie.
4. Track the longest complete string found.

## Brute Force
### Approach
For each word, iterate through all possible split points and check if both parts exist in the original set of words.

### Code
**Python**
```python
class Solution:
    def completeString(self, words):
        word_set = set(words)
        result = ""
        for word in words:
            n = len(word)
            for i in range(n):
                prefix = word[:i+1]
                suffix = word[i+1:]
                if prefix in word_set and suffix in word_set:
                    if len(word) > len(result) or (len(word) == len(result) and word > result):
                        result = word
                    break
        return result
```

**C++**
```cpp
class Solution {
public:
    string completeString(vector<string>& words) {
        unordered_set<string> word_set(words.begin(), words.end());
        string result = "";
        for (string& word : words) {
            int n = word.size();
            for (int i = 0; i < n; i++) {
                string prefix = word.substr(0, i + 1);
                string suffix = word.substr(i + 1);
                if (word_set.count(prefix) && word_set.count(suffix)) {
                    if (word.size() > result.size() || 
                        (word.size() == result.size() && word > result)) {
                        result = word;
                    }
                    break;
                }
            }
        }
        return result;
    }
};
```

### Complexity
- Time: O(N * M^2) for checking all splits
- Space: O(N * M)

## Optimized Solution
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

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end

class Solution:
    def completeString(self, words):
        trie = Trie()
        for word in words:
            trie.insert(word)

        result = ""
        for word in words:
            n = len(word)
            is_complete = False
            for i in range(n):
                if trie.search(word[:i+1]) and trie.search(word[i+1:]):
                    is_complete = True
                    break
            if is_complete:
                if len(word) > len(result) or (len(word) == len(result) and word > result):
                    result = word
        return result
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
    
    bool search(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) return false;
            node = node->children[idx];
        }
        return node->is_end;
    }
};

class Solution {
public:
    string completeString(vector<string>& words) {
        Trie trie;
        for (string& word : words) trie.insert(word);
        
        string result = "";
        for (string& word : words) {
            int n = word.size();
            bool is_complete = false;
            for (int i = 0; i < n; i++) {
                if (trie.search(word.substr(0, i + 1)) && 
                    trie.search(word.substr(i + 1))) {
                    is_complete = true;
                    break;
                }
            }
            if (is_complete) {
                if (word.size() > result.size() || 
                    (word.size() == result.size() && word > result)) {
                    result = word;
                }
            }
        }
        return result;
    }
};
```

### Complexity
- Time: O(N * M^2) for checking all splits with Trie
- Space: O(N * M) for Trie

## Key Insight
> A string is complete if it can be split at any point such that both prefix and suffix exist in the Trie. We check all possible splits for each word.

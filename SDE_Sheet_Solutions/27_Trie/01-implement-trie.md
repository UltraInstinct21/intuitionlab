# 208. Implement Trie (Prefix Tree)

> **Difficulty:** Medium | **Topic:** Trie, String, Design | **Platform:** LeetCode

---

## Problem Statement
A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.

Implement the Trie class:
- `Trie()` Initializes the trie object.
- `void insert(String word)` Inserts the string `word` into the trie.
- `boolean search(String word)` Returns `true` if the string `word` is in the trie (i.e., was inserted before), and `false` otherwise.
- `boolean startsWith(String prefix)` Returns `true` if there is a previously inserted string `word` that has the prefix `prefix`, and `false` otherwise.

## Examples
**Example 1:**
```
Input:
["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
Output:
[null, null, true, false, true, null, true]
```

## Constraints
- `1 <= word.length, prefix.length <= 2000`
- `word` and `prefix` consist only of lowercase English letters.
- At most `3 * 10^4` calls in total will be made to `insert`, `search`, and `startsWith`.

## Topic Tags
`Trie` `String` `Design`

## Expected Complexities
| | |
|---|---|
| **Time** | O(m) per operation where m is word length |
| **Space** | O(m) per insertion |

## Intuition
A Trie is a tree-like data structure where each node represents a character. To implement a Trie, we need a node structure that stores children (a map or array of child nodes) and a flag indicating if the node marks the end of a word.

For insertion, we traverse the trie character by character, creating new nodes as needed. For search, we traverse and check if we reach the end node marked as a complete word. For prefix search, we only need to verify the prefix exists, regardless of whether it's a complete word.

## Approach
1. Create a TrieNode class with a dictionary of children and an `is_end_of_word` flag.
2. For `insert`: Start from root, for each character create a child node if it doesn't exist, move to that child, and mark the last node as end of word.
3. For `search`: Start from root, traverse through each character. If any character is missing, return false. Return true only if we reach the end of word marker.
4. For `startsWith`: Similar to search but return true as long as we can traverse all characters without checking end-of-word marker.

## Brute Force
### Approach
Store all words in a list and check prefix/word by iterating through all stored words. This is inefficient for large datasets.

### Code
**Python**
```python
class Trie:
    def __init__(self):
        self.words = []

    def insert(self, word: str) -> None:
        self.words.append(word)

    def search(self, word: str) -> bool:
        return word in self.words

    def startsWith(self, prefix: str) -> bool:
        return any(w.startswith(prefix) for w in self.words)
```

**C++**
```cpp
class Trie {
private:
    vector<string> words;
public:
    Trie() {}

    void insert(string word) {
        words.push_back(word);
    }

    bool search(string word) {
        return find(words.begin(), words.end(), word) != words.end();
    }

    bool startsWith(string prefix) {
        for (const string& w : words) {
            if (w.substr(0, prefix.size()) == prefix) return true;
        }
        return false;
    }
};
```

### Complexity
- Time: O(n * m) for search/startsWith where n is number of words and m is word length
- Space: O(n * m) to store all words

## Optimized Solution
### Code
**Python**
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def search(self, word: str) -> bool:
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word

    def startsWith(self, prefix: str) -> bool:
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True
```

**C++**
```cpp
class TrieNode {
public:
    TrieNode* children[26];
    bool is_end_of_word;
    TrieNode() {
        for (int i = 0; i < 26; i++) children[i] = nullptr;
        is_end_of_word = false;
    }
};

class Trie {
private:
    TrieNode* root;
public:
    Trie() {
        root = new TrieNode();
    }

    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) {
                node->children[idx] = new TrieNode();
            }
            node = node->children[idx];
        }
        node->is_end_of_word = true;
    }

    bool search(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) return false;
            node = node->children[idx];
        }
        return node->is_end_of_word;
    }

    bool startsWith(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            int idx = c - 'a';
            if (!node->children[idx]) return false;
            node = node->children[idx];
        }
        return true;
    }
};
```

### Complexity
- Time: O(m) for all operations where m is word length
- Space: O(m) for insertion, O(1) for search and startsWith

## Key Insight
> A Trie stores characters as edges in a tree, allowing O(m) operations where m is the word length, independent of the number of words stored.

# Implement Trie II

> **Difficulty:** Medium | **Topic:** Trie, Design | **Platform:** GeeksforGeeks

---

## Problem Statement
Design a data structure that supports the following operations efficiently:

1. `insert(word)`: Insert a word into the trie.
2. `countWordsEqualTo(word)`: Return the count of words equal to the given word.
3. `countWordsStartingWith(prefix)`: Return the count of words with the given prefix.
4. `erase(word)`: Remove exactly one occurrence of the word from the trie.

Implement the `Trie` class:
- `Trie()` Initializes the trie object.
- `void insert(string word)` Inserts the string `word` into the trie.
- `int countWordsEqualTo(string word)` Returns the number of strings equal to `word`.
- `int countWordsStartingWith(string prefix)` Returns the number of strings with prefix `prefix`.
- `void erase(string word)` Erases the string `word` from the trie.

## Examples
**Example 1:**
```
Input:
["Trie", "insert", "insert", "countWordsEqualTo", "countWordsStartingWith", "erase", "countWordsEqualTo"]
[[], ["apple"], ["app"], ["apple"], ["app"], ["apple"], ["apple"]]
Output:
[null, null, null, 1, 2, null, 0]
```

## Constraints
- `1 <= word.length, prefix.length <= 2000`
- `word` and `prefix` consist only of lowercase English letters.
- At most `10^4` calls will be made to each function.
- `erase` will be called only for words that were previously inserted.

## Topic Tags
`Trie` `Design` `String`

## Expected Complexities
| | |
|---|---|
| **Time** | O(m) per operation where m is word length |
| **Space** | O(m) per insertion |

## Intuition
Unlike the basic Trie, we need to track frequency counts at each node. Each node stores:
- `count`: Number of words ending at this node
- `pref`: Number of words with prefix from root to this node

This allows efficient counting of exact matches and prefix matches without traversing the entire subtree.

## Approach
1. Create a TrieNode with children dictionary, count of words ending here, and prefix count.
2. For `insert`: Traverse and increment prefix count at each node, increment word count at the end.
3. For `countWordsEqualTo`: Traverse to the end and return the count at that node.
4. For `countWordsStartingWith`: Traverse to the last character and return prefix count.
5. For `erase`: Traverse and decrement prefix counts, decrement word count at the end.

## Brute Force
### Approach
Store all words in a hash map with counts. For prefix queries, iterate through all stored words and count matches.

### Code
**Python**
```python
class Trie:
    def __init__(self):
        self.words = {}

    def insert(self, word: str) -> None:
        self.words[word] = self.words.get(word, 0) + 1

    def countWordsEqualTo(self, word: str) -> int:
        return self.words.get(word, 0)

    def countWordsStartingWith(self, prefix: str) -> int:
        count = 0
        for word in self.words:
            if word.startswith(prefix):
                count += self.words[word]
        return count

    def erase(self, word: str) -> None:
        if word in self.words:
            self.words[word] -= 1
            if self.words[word] == 0:
                del self.words[word]
```

**C++**
```cpp
class Trie {
private:
    unordered_map<string, int> words;
public:
    Trie() {}

    void insert(string word) {
        words[word]++;
    }

    int countWordsEqualTo(string word) {
        return words[word];
    }

    int countWordsStartingWith(string prefix) {
        int count = 0;
        for (auto& [word, cnt] : words) {
            if (word.substr(0, prefix.size()) == prefix) {
                count += cnt;
            }
        }
        return count;
    }

    void erase(string word) {
        if (words[word] > 0) {
            words[word]--;
            if (words[word] == 0) words.erase(word);
        }
    }
};
```

### Complexity
- Time: O(n * m) for countWordsStartingWith
- Space: O(n * m)

## Optimized Solution
### Code
**Python**
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.count = 0
        self.pref = 0

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
            node.pref += 1
        node.count += 1

    def countWordsEqualTo(self, word: str) -> int:
        node = self.root
        for char in word:
            if char not in node.children:
                return 0
            node = node.children[char]
        return node.count

    def countWordsStartingWith(self, prefix: str) -> int:
        node = self.root
        for char in prefix:
            if char not in node.children:
                return 0
            node = node.children[char]
        return node.pref

    def erase(self, word: str) -> None:
        node = self.root
        for char in word:
            node = node.children[char]
            node.pref -= 1
        node.count -= 1
```

**C++**
```cpp
class TrieNode {
public:
    TrieNode* children[26];
    int count;
    int pref;
    TrieNode() {
        for (int i = 0; i < 26; i++) children[i] = nullptr;
        count = 0;
        pref = 0;
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
            node->pref++;
        }
        node->count++;
    }

    int countWordsEqualTo(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) return 0;
            node = node->children[idx];
        }
        return node->count;
    }

    int countWordsStartingWith(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            int idx = c - 'a';
            if (!node->children[idx]) return 0;
            node = node->children[idx];
        }
        return node->pref;
    }

    void erase(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            node = node->children[idx];
            node->pref--;
        }
        node->count--;
    }
};
```

### Complexity
- Time: O(m) for all operations
- Space: O(m) per insertion

## Key Insight
> By maintaining `count` and `prefix` counters at each node, we can efficiently track word frequencies and prefix occurrences without traversing subtrees.

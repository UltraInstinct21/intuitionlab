# 336. Palindrome Pairs

> **Difficulty:** Hard | **Topic:** Trie, String | **Platform:** LeetCode

---

## Problem Statement
You are given a list of unique strings `words`. A palindrome pair is a pair of indices `(i, j)` such that `0 <= i, j < words.length`, `i != j`, and `words[i] + words[j]` (the concatenation of the two strings) is a palindrome.

Return all the palindrome pairs in the given list.

## Examples
**Example 1:**
```
Input: words = ["abcd", "dcba", "lls", "s", "sssll"]
Output: [[0,1],[1,0],[3,2],[2,4]]
Explanation: 
"dcba" + "abcd" = "dcbaabcd" is a palindrome
"abcd" + "dcba" = "abcdcba" is a palindrome
"s" + "lls" = "slls" is a palindrome
"sssll" + "s" = "ssslls" is a palindrome
```

**Example 2:**
```
Input: words = ["bat", "tab", "cat"]
Output: [[0,1],[1,0]]
Explanation: "bat" + "tab" = "battab" is a palindrome, "tab" + "bat" = "tabbat" is a palindrome
```

## Constraints
- `1 <= words.length <= 5000`
- `0 <= words[i].length <= 300`
- `words[i]` consists of lowercase English letters.

## Topic Tags
`Trie` `String` `Hash Table`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N * M^2) where N is number of words and M is max word length |
| **Space** | O(N * M) |

## Intuition
For a concatenation `words[i] + words[j]` to be a palindrome, one of these must hold:
1. `words[j]` is a reverse of `words[i]` (e.g., "abcd" + "dcba")
2. `words[i]` has a suffix that's a palindrome, and the remaining prefix reversed equals `words[j]` (e.g., "lls" + "s" → "s" + "lls" where "ll" is palindrome)
3. `words[j]` has a prefix that's a palindrome, and the remaining suffix reversed equals `words[i]`

We can use a Trie with reversed words to efficiently find these pairs.

## Approach
1. Insert all words in reverse into a Trie, storing their indices.
2. For each word, check all possible split points:
   - If the prefix is a palindrome, check if the reverse of the suffix exists in the Trie.
   - If the suffix is a palindrome, check if the reverse of the prefix exists in the Trie.
3. Collect all valid pairs.

## Brute Force
### Approach
Check all pairs of words and verify if their concatenation is a palindrome.

### Code
**Python**
```python
class Solution:
    def palindromePairs(self, words):
        def is_palindrome(s):
            return s == s[::-1]
        
        result = []
        for i in range(len(words)):
            for j in range(len(words)):
                if i != j:
                    if is_palindrome(words[i] + words[j]):
                        result.append([i, j])
        return result
```

**C++**
```cpp
class Solution {
public:
    vector<vector<int>> palindromePairs(vector<string>& words) {
        auto isPalindrome = [](const string& s) {
            int left = 0, right = s.size() - 1;
            while (left < right) {
                if (s[left] != s[right]) return false;
                left++;
                right--;
            }
            return true;
        };
        
        vector<vector<int>> result;
        for (int i = 0; i < words.size(); i++) {
            for (int j = 0; j < words.size(); j++) {
                if (i != j && isPalindrome(words[i] + words[j])) {
                    result.push_back({i, j});
                }
            }
        }
        return result;
    }
};
```

### Complexity
- Time: O(N^2 * M) where N is number of words and M is max word length
- Space: O(1) excluding output

## Optimized Solution
### Code
**Python**
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.word_idx = -1
        self.palindrome_indices = []

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word, idx):
        node = self.root
        for i, char in enumerate(reversed(word)):
            if word[:len(word)-i] == word[:len(word)-i][::-1]:
                node.palindrome_indices.append(idx)
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.word_idx = idx
        node.palindrome_indices.append(idx)

class Solution:
    def palindromePairs(self, words):
        trie = Trie()
        for i, word in enumerate(words):
            trie.insert(word, i)

        result = []
        for i, word in enumerate(words):
            self._search(trie, word, i, result)
        return result

    def _search(self, trie, word, idx, result):
        node = trie.root
        for i, char in enumerate(word):
            if node.word_idx != -1 and node.word_idx != idx:
                if word[i:] == word[i:][::-1]:
                    result.append([idx, node.word_idx])
            if char not in node.children:
                return
            node = node.children[char]

        for j in node.palindrome_indices:
            if j != idx:
                result.append([idx, j])
```

**C++**
```cpp
class TrieNode {
public:
    TrieNode* children[26];
    int word_idx;
    vector<int> palindrome_indices;
    TrieNode() {
        for (int i = 0; i < 26; i++) children[i] = nullptr;
        word_idx = -1;
    }
};

class Trie {
public:
    TrieNode* root;
    Trie() { root = new TrieNode(); }
    
    void insert(string word, int idx) {
        TrieNode* node = root;
        for (int i = word.size() - 1; i >= 0; i--) {
            if (isPalindrome(word, 0, i)) {
                node->palindrome_indices.push_back(idx);
            }
            int c = word[i] - 'a';
            if (!node->children[c]) node->children[c] = new TrieNode();
            node = node->children[c];
        }
        node->word_idx = idx;
        node->palindrome_indices.push_back(idx);
    }
    
    bool isPalindrome(string& s, int left, int right) {
        while (left < right) {
            if (s[left] != s[right]) return false;
            left++;
            right--;
        }
        return true;
    }
    
    void search(string word, int idx, vector<vector<int>>& result) {
        TrieNode* node = root;
        for (int i = 0; i < word.size(); i++) {
            if (node->word_idx != -1 && node->word_idx != idx) {
                if (isPalindrome(word, i, word.size() - 1)) {
                    result.push_back({idx, node->word_idx});
                }
            }
            int c = word[i] - 'a';
            if (!node->children[c]) return;
            node = node->children[c];
        }
        for (int j : node->palindrome_indices) {
            if (j != idx) result.push_back({idx, j});
        }
    }
};

class Solution {
public:
    vector<vector<int>> palindromePairs(vector<string>& words) {
        Trie trie;
        for (int i = 0; i < words.size(); i++) {
            trie.insert(words[i], i);
        }
        
        vector<vector<int>> result;
        for (int i = 0; i < words.size(); i++) {
            trie.search(words[i], i, result);
        }
        return result;
    }
};
```

### Complexity
- Time: O(N * M^2) where N is number of words and M is max word length
- Space: O(N * M) for Trie

## Key Insight
> By inserting words in reverse and checking palindrome conditions at each Trie node, we can efficiently find all pairs where concatenation forms a palindrome in O(N * M^2) time.

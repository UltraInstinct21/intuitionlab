# 1268. Search Suggestions System

> **Difficulty:** Medium | **Topic:** Trie, String, Sorting | **Platform:** LeetCode

---

## Problem Statement
You are given an array of strings `products` and a string `searchWord`.

Design a system that suggests at most three product names from `products` after each character of `searchWord` is typed. Suggested products should have common prefix with `searchWord`. If there are more than three products with a common prefix, return the three lexicographically minimums products.

Return a list of lists of the suggested products after each character of `searchWord` is typed.

## Examples
**Example 1:**
```
Input: products = ["mobile", "mouse", "monitor", "moneypot", "monitor", "mousepad"], searchWord = "mouse"
Output: [["mobile", "moneypot", "monitor"], ["mobile", "moneypot", "monitor"], ["mouse", "mousepad"], ["mouse", "mousepad"], ["mouse", "mousepad"]]
```

**Example 2:**
```
Input: products = ["havana"], searchWord = "havana"
Output: [["havana"], ["havana"], ["havana"], ["havana"], ["havana"], ["havana"]]
```

## Constraints
- `1 <= products.length <= 1000`
- `1 <= products[i].length <= 3000`
- `1 <= searchWord.length <= 1000`
- `products[i]` and `searchWord` consist of lowercase English letters.
- All the strings of `products` are unique.

## Topic Tags
`Trie` `String` `Sorting`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N * L + Q * L) where N is products, L is max length, Q is searchWord length |
| **Space** | O(N * L) |

## Intuition
We need to find all products that have a common prefix with the searchWord as it's being typed character by character. A Trie is perfect for this because:
1. Insert all products into a Trie.
2. For each prefix of searchWord, traverse the Trie and collect up to 3 lexicographically smallest products.

We can optimize by sorting products first, so when we DFS the Trie, we naturally get lexicographic order.

## Approach
1. Sort the products lexicographically.
2. Build a Trie from sorted products.
3. For each prefix of searchWord (from length 1 to len(searchWord)):
   - Traverse the Trie to the prefix node.
   - DFS to collect up to 3 product names.
4. Return the list of suggestions for each prefix.

## Brute Force
### Approach
For each prefix of searchWord, filter all products that start with that prefix, sort them, and take the first 3.

### Code
**Python**
```python
class Solution:
    def suggestedProducts(self, products, searchWord):
        products.sort()
        result = []
        for i in range(len(searchWord)):
            prefix = searchWord[:i + 1]
            suggestions = [p for p in products if p.startswith(prefix)][:3]
            result.append(suggestions)
        return result
```

**C++**
```cpp
class Solution {
public:
    vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
        sort(products.begin(), products.end());
        vector<vector<string>> result;
        for (int i = 0; i < searchWord.size(); i++) {
            string prefix = searchWord.substr(0, i + 1);
            vector<string> suggestions;
            for (string& p : products) {
                if (p.substr(0, i + 1) == prefix && suggestions.size() < 3) {
                    suggestions.push_back(p);
                }
            }
            result.push_back(suggestions);
        }
        return result;
    }
};
```

### Complexity
- Time: O(N * L * log N + Q * N * L) where N is products count, L is max length, Q is searchWord length
- Space: O(1) excluding output

## Optimized Solution
### Code
**Python**
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.products = []

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
            if len(node.products) < 3:
                node.products.append(word)

class Solution:
    def suggestedProducts(self, products, searchWord):
        trie = Trie()
        for product in sorted(products):
            trie.insert(product)

        result = []
        node = trie.root
        for char in searchWord:
            if char in node.children:
                node = node.children[char]
                result.append(node.products)
            else:
                node = TrieNode()
                result.append([])
        return result
```

**C++**
```cpp
class TrieNode {
public:
    TrieNode* children[26];
    vector<string> products;
    TrieNode() {
        for (int i = 0; i < 26; i++) children[i] = nullptr;
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
            if (node->products.size() < 3) node->products.push_back(word);
        }
    }
};

class Solution {
public:
    vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
        sort(products.begin(), products.end());
        Trie trie;
        for (string& p : products) trie.insert(p);
        
        vector<vector<string>> result;
        TrieNode* node = trie.root;
        for (char c : searchWord) {
            if (node->children[c - 'a']) {
                node = node->children[c - 'a'];
                result.push_back(node->products);
            } else {
                node = new TrieNode();
                result.push_back({});
            }
        }
        return result;
    }
};
```

### Complexity
- Time: O(N * L * log N + Q * L) where N is products, L is max length, Q is searchWord length
- Space: O(N * L) for Trie

## Key Insight
> By storing up to 3 products at each Trie node during sorted insertion, we can retrieve the lexicographically smallest suggestions in O(1) per prefix.

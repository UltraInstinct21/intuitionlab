# 126. Word Ladder II

> **Difficulty:** Hard | **Topic:** BFS, DFS, Graph, String | **Platform:** LeetCode

---

## Problem Statement
A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:

- Every adjacent pair of words differs by a single letter.
- Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.
- sk == endWord

Given two words, beginWord and endWord, and a dictionary wordList, return all the shortest transformation sequences from beginWord to endWord. Return an empty list if there is no such transformation sequence.

## Examples
**Example 1:**
```
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: [["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]
```

**Example 2:**
```
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
Output: []
```

## Constraints
- 1 <= beginWord.length <= 10
- endWord.length == beginWord.length
- 1 <= wordList.length <= 5000
- wordList[i].length == beginWord.length
- beginWord, endWord, and wordList[i] consist of lowercase English letters.
- beginWord != endWord
- All the words in wordList are unique.

## Topic Tags
`BFS` `DFS` `Graph` `String`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N * M^2) |
| **Space** | O(N * M) |

## Intuition
This is harder than Word Ladder I because we need ALL shortest paths, not just the length. We use BFS to build a graph of parent relationships level by level, then use DFS to reconstruct all shortest paths from endWord back to beginWord.

## Approach
1. BFS to build parent map (each word's predecessors at shortest distance)
2. Track visited words at each level to avoid cycles
3. Use DFS to reconstruct all paths from endWord to beginWord
4. Return all valid paths

## Brute Force
### Approach
Try all possible paths using DFS, tracking shortest length. For each path, check if it's valid and update results if shorter than current best.

### Code
**Python**
```python
# Brute force - try all paths and filter shortest ones
class Solution:
    def findLadders(self, beginWord, endWord, wordList):
        wordSet = set(wordList)
        if endWord not in wordSet:
            return []
        
        self.result = []
        self.min_length = float('inf')
        
        def dfs(current, path, visited):
            if current == endWord:
                if len(path) < self.min_length:
                    self.min_length = len(path)
                    self.result = [path[:]]
                elif len(path) == self.min_length:
                    self.result.append(path[:])
                return
            
            if len(path) >= self.min_length:
                return
            
            for i in range(len(current)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    next_word = current[:i] + c + current[i+1:]
                    if next_word in wordSet and next_word not in visited:
                        visited.add(next_word)
                        path.append(next_word)
                        dfs(next_word, path, visited)
                        path.pop()
                        visited.remove(next_word)
        
        visited = {beginWord}
        dfs(beginWord, [beginWord], visited)
        return self.result
```

**C++**
```cpp
// Brute force - exponential time complexity
class Solution {
public:
    vector<vector<string>> findLadders(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> wordSet(wordList.begin(), wordList.end());
        if (wordSet.find(endWord) == wordSet.end()) return {};
        
        vector<vector<string>> result;
        int minLength = INT_MAX;
        
        function<void(string, vector<string>&, unordered_set<string>&)> dfs = 
            [&](string current, vector<string>& path, unordered_set<string>& visited) {
            if (current == endWord) {
                if (path.size() < minLength) {
                    minLength = path.size();
                    result = {path};
                } else if (path.size() == minLength) {
                    result.push_back(path);
                }
                return;
            }
            
            if (path.size() >= minLength) return;
            
            for (int i = 0; i < current.size(); i++) {
                char original = current[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    current[i] = c;
                    if (wordSet.count(current) && !visited.count(current)) {
                        visited.insert(current);
                        path.push_back(current);
                        dfs(current, path, visited);
                        path.pop_back();
                        visited.erase(current);
                    }
                }
                current[i] = original;
            }
        };
        
        unordered_set<string> visited = {beginWord};
        vector<string> path = {beginWord};
        dfs(beginWord, path, visited);
        return result;
    }
};
```

### Complexity
- Time: O(N * 26^M) where N is word length, M is number of words
- Space: O(N * 26^M)

## Optimized Solution
### Code
**Python**
```python
from collections import defaultdict, deque

class Solution:
    def findLadders(self, beginWord: str, endWord: str, wordList: list[str]) -> list[list[str]]:
        wordSet = set(wordList)
        if endWord not in wordSet:
            return []
        
        # Build parent map using BFS
        parents = defaultdict(list)
        visited = {beginWord}
        queue = deque([beginWord])
        found = False
        
        while queue and not found:
            level_visited = set()
            level_size = len(queue)
            
            for _ in range(level_size):
                word = queue.popleft()
                
                for i in range(len(word)):
                    for c in 'abcdefghijklmnopqrstuvwxyz':
                        next_word = word[:i] + c + word[i+1:]
                        
                        if next_word in wordSet and next_word not in visited:
                            if next_word == endWord:
                                found = True
                            
                            level_visited.add(next_word)
                            parents[next_word].append(word)
                            
                            if next_word not in visited:
                                queue.append(next_word)
            
            visited.update(level_visited)
        
        if not found:
            return []
        
        # Reconstruct paths using DFS
        result = []
        
        def dfs(word, path):
            if word == beginWord:
                result.append(path[::-1])
                return
            
            for parent in parents[word]:
                dfs(parent, path + [parent])
        
        dfs(endWord, [endWord])
        return result
```

**C++**
```cpp
class Solution {
public:
    vector<vector<string>> findLadders(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> wordSet(wordList.begin(), wordList.end());
        if (wordSet.find(endWord) == wordSet.end()) return {};
        
        unordered_map<string, vector<string>> parents;
        unordered_set<string> visited = {beginWord};
        queue<string> q;
        q.push(beginWord);
        bool found = false;
        
        while (!q.empty() && !found) {
            unordered_set<string> level_visited;
            int level_size = q.size();
            
            for (int i = 0; i < level_size; i++) {
                string word = q.front();
                q.pop();
                
                for (int j = 0; j < word.size(); j++) {
                    char original = word[j];
                    for (char c = 'a'; c <= 'z'; c++) {
                        word[j] = c;
                        
                        if (wordSet.count(word) && !visited.count(word)) {
                            if (word == endWord) found = true;
                            
                            level_visited.insert(word);
                            parents[word].push_back(word.substr(0, j) + original + word.substr(j+1));
                            
                            if (!visited.count(word)) {
                                q.push(word);
                            }
                        }
                    }
                    word[j] = original;
                }
            }
            
            for (const string& w : level_visited) {
                visited.insert(w);
            }
        }
        
        if (!found) return {};
        
        vector<vector<string>> result;
        
        function<void(string, vector<string>&)> dfs = [&](string word, vector<string>& path) {
            if (word == beginWord) {
                reverse(path.begin(), path.end());
                result.push_back(path);
                reverse(path.begin(), path.end());
                return;
            }
            
            for (const string& parent : parents[word]) {
                path.push_back(parent);
                dfs(parent, path);
                path.pop_back();
            }
        };
        
        vector<string> path = {endWord};
        dfs(endWord, path);
        return result;
    }
};
```

### Complexity
- Time: O(N * M^2) where N is number of words, M is word length
- Space: O(N * M) for storing parents and paths

## Key Insight
> Use BFS to build a graph of parent relationships level by level, ensuring we only capture shortest paths. Then use DFS to reconstruct all paths from endWord back to beginWord. The key is processing each BFS level completely before moving to the next.
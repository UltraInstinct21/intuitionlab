# 127. Word Ladder

> **Difficulty:** Hard | **Topic:** BFS, Graph, String | **Platform:** LeetCode

---

## Problem Statement
A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:

- Every adjacent pair of words differs by a single letter.
- Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.
- sk == endWord

Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.

## Examples
**Example 1:**
```
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5
Explanation: One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.
```

**Example 2:**
```
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
Output: 0
Explanation: The endWord "cog" is not in wordList, so there is no valid transformation sequence.
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
`BFS` `Graph` `String`

## Expected Complexities
| | |
|---|---|
| **Time** | O(M^2 * N) |
| **Space** | O(M^2 * N) |

## Intuition
This is a shortest path problem in an implicit graph where nodes are words and edges connect words that differ by one character. BFS is ideal because it explores all words at the current distance before moving to words at distance+1, guaranteeing the first time we reach endWord is the shortest path.

## Approach
1. Convert wordList to a set for O(1) lookup
2. Use BFS starting from beginWord
3. For each word, generate all possible one-character transformations
4. If a transformation is in wordList, add to queue with distance+1
5. Remove visited words from set to avoid cycles
6. Return distance when endWord is found

## Brute Force
### Approach
Try all possible paths using DFS, keeping track of visited words. This is exponential time.

### Code
**Python**
```python
# Brute force - DFS approach (exponential time)
class Solution:
    def ladderLength(self, beginWord, endWord, wordList):
        wordSet = set(wordList)
        if endWord not in wordSet:
            return 0
        
        visited = set()
        self.result = float('inf')
        
        def dfs(current, end, length):
            if current == end:
                self.result = min(self.result, length)
                return
            
            for i in range(len(current)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    next_word = current[:i] + c + current[i+1:]
                    if next_word in wordSet and next_word not in visited:
                        visited.add(next_word)
                        dfs(next_word, end, length + 1)
                        visited.remove(next_word)
        
        visited.add(beginWord)
        dfs(beginWord, endWord, 1)
        return self.result if self.result != float('inf') else 0
```

**C++**
```cpp
// Brute force - DFS (will TLE on large inputs)
class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> wordSet(wordList.begin(), wordList.end());
        if (wordSet.find(endWord) == wordSet.end()) return 0;
        
        int result = INT_MAX;
        
        function<void(string, int)> dfs = [&](string current, int length) {
            if (current == endWord) {
                result = min(result, length);
                return;
            }
            
            for (int i = 0; i < current.size(); i++) {
                char original = current[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    current[i] = c;
                    if (wordSet.count(current)) {
                        wordSet.erase(current);
                        dfs(current, length + 1);
                        wordSet.insert(current);
                    }
                }
                current[i] = original;
            }
        };
        
        dfs(beginWord, 1);
        return result == INT_MAX ? 0 : result;
    }
};
```

### Complexity
- Time: O(M * 26^M) where M is word length
- Space: O(M * 26^M)

## Optimized Solution
### Code
**Python**
```python
from collections import deque

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: list[str]) -> int:
        wordSet = set(wordList)
        if endWord not in wordSet:
            return 0
        
        queue = deque([(beginWord, 1)])
        visited = {beginWord}
        
        while queue:
            word, length = queue.popleft()
            
            if word == endWord:
                return length
            
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    next_word = word[:i] + c + word[i+1:]
                    if next_word in wordSet and next_word not in visited:
                        visited.add(next_word)
                        queue.append((next_word, length + 1))
        
        return 0
```

**C++**
```cpp
class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> wordSet(wordList.begin(), wordList.end());
        if (wordSet.find(endWord) == wordSet.end()) return 0;
        
        queue<pair<string, int>> q;
        q.push({beginWord, 1});
        unordered_set<string> visited = {beginWord};
        
        while (!q.empty()) {
            auto [word, length] = q.front();
            q.pop();
            
            if (word == endWord) return length;
            
            for (int i = 0; i < word.size(); i++) {
                char original = word[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    word[i] = c;
                    if (wordSet.count(word) && !visited.count(word)) {
                        visited.insert(word);
                        q.push({word, length + 1});
                    }
                }
                word[i] = original;
            }
        }
        
        return 0;
    }
};
```

### Complexity
- Time: O(M^2 * N) where M is word length, N is number of words
- Space: O(M * N) for the queue and visited set

## Key Insight
> Treat words as nodes in a graph where edges connect words differing by one character. BFS finds the shortest transformation sequence. Using a set for O(1) lookup and marking visited words prevents cycles.
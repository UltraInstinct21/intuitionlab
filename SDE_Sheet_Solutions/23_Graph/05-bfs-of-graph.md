# 733. BFS of Graph

> **Difficulty:** Medium | **Topic:** BFS, Graph, Queue | **Platform:** LeetCode/GFG

---

## Problem Statement
Given a connected undirected graph represented by an adjacency list adj, return a list containing the BFS traversal starting from vertex 0.

A BFS (Breadth-First Search) traversal visits all vertices at the present depth level before moving to vertices at the next depth level.

## Examples
**Example 1:**
```
Input: adj = [[2,3,1],[0],[0,4],[0]]
Output: [0, 2, 3, 1, 4]
Explanation: Starting from vertex 0, BFS visits vertices in order: 0, then its neighbors 2, 3, 1, then 4.
```

**Example 2:**
```
Input: adj = [[1,2],[0,3],[0,4],[1],[2]]
Output: [0, 1, 2, 3, 4]
Explanation: Starting from vertex 0, BFS visits 0, then 1 and 2, then 3 and 4.
```

## Constraints
- 1 ≤ adj.size() ≤ 10^4
- 0 ≤ adj[i][j] ≤ adj.size()-1

## Topic Tags
`BFS` `Graph` `Queue`

## Expected Complexities
| | |
|---|---|
| **Time** | O(V + E) |
| **Space** | O(V) |

## Intuition
BFS explores a graph level by level. Starting from the source vertex, we visit all its immediate neighbors first, then move to their unvisited neighbors, and so on. A queue is used to maintain the order of visitation, and a visited array prevents revisiting nodes.

## Approach
1. Initialize a visited array and a queue
2. Mark the starting vertex as visited and enqueue it
3. While the queue is not empty:
   - Dequeue a vertex and add it to the result
   - For each unvisited neighbor, mark it visited and enqueue it
4. Return the result list

## Brute Force
### Approach
Without using a visited set, we might revisit nodes and get stuck in infinite loops. We need to track which nodes have been processed.

### Code
**Python**
```python
# Brute force without visited tracking - would cause infinite loop
from collections import deque

class Solution:
    def bfsOfGraph(self, V, adj):
        result = []
        queue = deque([0])
        
        visited = [False] * V
        visited[0] = True
        
        while queue:
            node = queue.popleft()
            result.append(node)
            
            for neighbor in adj[node]:
                if not visited[neighbor]:
                    visited[neighbor] = True
                    queue.append(neighbor)
        
        return result
```

**C++**
```cpp
// Brute force - uses visited array to prevent infinite loops
class Solution {
public:
    vector<int> bfsOfGraph(int V, vector<int> adj[]) {
        vector<int> result;
        vector<bool> visited(V, false);
        queue<int> q;
        
        visited[0] = true;
        q.push(0);
        
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            result.push_back(node);
            
            for (int neighbor : adj[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
        
        return result;
    }
};
```

### Complexity
- Time: O(V + E) - each vertex and edge processed once
- Space: O(V) - for visited array and queue

## Optimized Solution
### Code
**Python**
```python
from collections import deque

class Solution:
    def bfsOfGraph(self, V: int, adj: list[list[int]]) -> list[int]:
        visited = [False] * V
        result = []
        
        queue = deque([0])
        visited[0] = True
        
        while queue:
            node = queue.popleft()
            result.append(node)
            
            for neighbor in adj[node]:
                if not visited[neighbor]:
                    visited[neighbor] = True
                    queue.append(neighbor)
        
        return result
```

**C++**
```cpp
class Solution {
public:
    vector<int> bfsOfGraph(int V, vector<int> adj[]) {
        vector<int> result;
        vector<bool> visited(V, false);
        queue<int> q;
        
        visited[0] = true;
        q.push(0);
        
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            result.push_back(node);
            
            for (int neighbor : adj[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
        
        return result;
    }
};
```

### Complexity
- Time: O(V + E) - each vertex and edge is processed exactly once
- Space: O(V) - visited array and queue can hold at most V vertices

## Key Insight
> BFS uses a queue to explore nodes level by level. The visited array is crucial to avoid revisiting nodes and getting stuck in cycles.
# Shortest Path in Undirected Graph

> **Difficulty:** Medium | **Topic:** BFS, Graph, Shortest Path | **Platform:** GeeksforGeeks

---

## Problem Statement
Given an undirected graph with V vertices (numbered from 0 to V-1) and E edges, find the shortest distance from a source vertex S to a destination vertex D. If there is no path from S to D, return -1.

## Examples
**Example 1:**
```
Input: V = 5, E = 6, edges = [[0,1],[0,2],[1,2],[1,3],[2,4],[3,4]], S = 0, D = 4
Output: 2
Explanation: The shortest path from 0 to 4 is 0 -> 2 -> 4 with length 2.
```

**Example 2:**
```
Input: V = 4, E = 3, edges = [[0,1],[1,2],[2,3]], S = 0, D = 3
Output: 3
Explanation: The shortest path from 0 to 3 is 0 -> 1 -> 2 -> 3 with length 3.
```

## Constraints
- 1 ≤ V, E ≤ 10^5
- 0 ≤ S, D < V

## Topic Tags
`BFS` `Graph` `Shortest-Path`

## Expected Complexities
| | |
|---|---|
| **Time** | O(V + E) |
| **Space** | O(V) |

## Intuition
In an unweighted graph, BFS naturally finds the shortest path. BFS explores nodes level by level, so the first time we reach the destination, we've found the shortest path. We track distances from the source as we traverse.

## Approach
1. Build adjacency list from edges
2. Initialize distances array with -1 (unreachable)
3. Use BFS starting from source with distance 0
4. For each node, explore neighbors:
   - If not visited (distance is -1), set distance = current + 1
   - Add to queue
5. Return distance to destination

## Brute Force
### Approach
Without using BFS, we might use DFS which doesn't guarantee shortest path. Or we could try all paths which is exponential.

### Code
**Python**
```python
# Brute force - DFS doesn't guarantee shortest path
class Solution:
    def shortestPath(self, V, adj, S, D):
        visited = [False] * V
        shortest = [float('inf')] * V
        shortest[S] = 0
        
        def dfs(node, dist):
            if node == D:
                return
            for neighbor in adj[node]:
                if not visited[neighbor] or dist + 1 < shortest[neighbor]:
                    visited[neighbor] = True
                    shortest[neighbor] = dist + 1
                    dfs(neighbor, dist + 1)
        
        dfs(S, 0)
        return shortest[D] if shortest[D] != float('inf') else -1
```

**C++**
```cpp
// Brute force - DFS approach (not optimal for shortest path)
class Solution {
public:
    int shortestPath(int V, vector<int> adj[], int S, int D) {
        vector<int> shortest(V, INT_MAX);
        vector<bool> visited(V, false);
        shortest[S] = 0;
        
        function<void(int, int)> dfs = [&](int node, int dist) {
            for (int neighbor : adj[node]) {
                if (!visited[neighbor] || dist + 1 < shortest[neighbor]) {
                    visited[neighbor] = true;
                    shortest[neighbor] = dist + 1;
                    dfs(neighbor, dist + 1);
                }
            }
        };
        
        dfs(S, 0);
        return shortest[D] == INT_MAX ? -1 : shortest[D];
    }
};
```

### Complexity
- Time: O(V + E)
- Space: O(V)

## Optimized Solution
### Code
**Python**
```python
from collections import deque

class Solution:
    def shortestPath(self, V: int, adj: list[list[int]], S: int, D: int) -> int:
        distances = [-1] * V
        distances[S] = 0
        
        queue = deque([S])
        
        while queue:
            node = queue.popleft()
            
            for neighbor in adj[node]:
                if distances[neighbor] == -1:
                    distances[neighbor] = distances[node] + 1
                    queue.append(neighbor)
        
        return distances[D]
```

**C++**
```cpp
class Solution {
public:
    int shortestPath(int V, vector<int> adj[], int S, int D) {
        vector<int> distances(V, -1);
        distances[S] = 0;
        
        queue<int> q;
        q.push(S);
        
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            
            for (int neighbor : adj[node]) {
                if (distances[neighbor] == -1) {
                    distances[neighbor] = distances[node] + 1;
                    q.push(neighbor);
                }
            }
        }
        
        return distances[D];
    }
};
```

### Complexity
- Time: O(V + E) - each vertex and edge processed once
- Space: O(V) - for distances array and queue

## Key Insight
> BFS naturally finds the shortest path in unweighted graphs. By tracking distances as we traverse level by level, the first time we reach the destination is guaranteed to be the shortest path.
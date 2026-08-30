# Detect Cycle in Undirected Graph

> **Difficulty:** Medium | **Topic:** DFS, BFS, Union-Find, Undirected Graph | **Platform:** GeeksforGeeks

---

## Problem Statement
Given an undirected graph with V vertices and E edges, check whether it contains any cycle or not. The graph is given as an adjacency list where adj[i] contains a list of all the nodes that there is an edge from node i.

## Examples
**Example 1:**
```
Input: V = 5, E = 5, edges = [[0,1], [1,2], [2,3], [3,4], [4,0]]
Output: true
Explanation: There is a cycle: 0 -> 1 -> 2 -> 3 -> 4 -> 0
```

**Example 2:**
```
Input: V = 4, E = 3, edges = [[0,1], [1,2], [2,3]]
Output: false
Explanation: There is no cycle in the graph.
```

## Constraints
- 1 ≤ V, E ≤ 10^5

## Topic Tags
`DFS` `BFS` `Union-Find` `Undirected-Graph`

## Intuition
In an undirected graph, a cycle exists if during DFS/BFS we encounter a node that has already been visited and is not the parent of the current node. Unlike directed graphs, we don't need the three-color approach - we just need to track visited nodes and ensure we don't count the edge back to the parent as a cycle.

## Approach
1. Use DFS with parent tracking
2. Mark each node as visited when first encountered
3. For each neighbor:
   - If neighbor is not visited, recursively visit it
   - If neighbor is visited and not the parent, cycle exists
4. If no cycle found after checking all components, return false

## Brute Force
### Approach
Without proper parent tracking, we would incorrectly detect the edge back to the parent as a cycle.

### Code
**Python**
```python
# Brute force - incorrect approach without parent tracking
class Solution:
    def isCycle(self, V, adj):
        visited = [False] * V
        
        def dfs(node):
            visited[node] = True
            for neighbor in adj[node]:
                if visited[neighbor]:
                    return True
                if not visited[neighbor]:
                    if dfs(neighbor):
                        return True
            return False
        
        for i in range(V):
            if not visited[i]:
                if dfs(i):
                    return True
        return False
```

**C++**
```cpp
// Brute force - will incorrectly detect back edge to parent
class Solution {
public:
    bool isCycle(int V, vector<int> adj[]) {
        vector<bool> visited(V, false);
        
        function<bool(int)> dfs = [&](int node) -> bool {
            visited[node] = true;
            for (int neighbor : adj[node]) {
                if (visited[neighbor]) return true;
                if (dfs(neighbor)) return true;
            }
            return false;
        };
        
        for (int i = 0; i < V; i++) {
            if (!visited[i]) {
                if (dfs(i)) return true;
            }
        }
        return false;
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
class Solution:
    def isCycle(self, V: int, adj: list[list[int]]) -> bool:
        visited = [False] * V
        
        def dfs(node, parent):
            visited[node] = True
            
            for neighbor in adj[node]:
                if not visited[neighbor]:
                    if dfs(neighbor, node):
                        return True
                elif neighbor != parent:
                    return True
            
            return False
        
        for i in range(V):
            if not visited[i]:
                if dfs(i, -1):
                    return True
        
        return False
```

**C++**
```cpp
class Solution {
public:
    bool isCycle(int V, vector<int> adj[]) {
        vector<bool> visited(V, false);
        
        function<bool(int, int)> dfs = [&](int node, int parent) -> bool {
            visited[node] = true;
            
            for (int neighbor : adj[node]) {
                if (!visited[neighbor]) {
                    if (dfs(neighbor, node)) return true;
                } else if (neighbor != parent) {
                    return true;
                }
            }
            
            return false;
        };
        
        for (int i = 0; i < V; i++) {
            if (!visited[i]) {
                if (dfs(i, -1)) return true;
            }
        }
        
        return false;
    }
};
```

### Complexity
- Time: O(V + E) - each vertex and edge processed once
- Space: O(V) - for visited array and recursion stack

## Key Insight
> In an undirected graph, a cycle exists if we encounter a visited node that is NOT the parent of the current node. The parent parameter is crucial to distinguish between a cycle and a simple back edge.
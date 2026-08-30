# Detect Cycle in Directed Graph

> **Difficulty:** Hard | **Topic:** DFS, BFS, Topological Sort, Directed Graph | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a Directed Graph with V vertices (Numbered from 0 to V-1) and E edges, check whether it contains any cycle or not. The graph is given as an adjacency list where adj[i] contains a list of all the nodes that there is an edge from node i.

## Examples
**Example 1:**
```
Input: V = 4, adj = [[], [0], [1, 3], [2, 4], []]
Output: true
Explanation: There is a cycle: 2 -> 3 -> 4 -> 2 (if we consider the path)
Actually: 2 -> 3 -> 2 is a cycle
```

**Example 2:**
```
Input: V = 4, adj = [[1,2], [2,3], [3], []]
Output: false
Explanation: There is no cycle in the graph.
```

## Constraints
- 1 ≤ V, E ≤ 10^5

## Topic Tags
`DFS` `BFS` `Topological-Sort` `Directed-Graph`

## Expected Complexities
| | |
|---|---|
| **Time** | O(V + E) |
| **Space** | O(V) |

## Intuition
A cycle exists in a directed graph if, during DFS traversal, we encounter a node that is currently on the recursion stack (being processed). We use three states: unvisited (0), visiting (1), and visited (2). If we reach a node in the "visiting" state, we've found a cycle.

## Approach
1. Use DFS with three states: unvisited (0), visiting (1), visited (2)
2. For each unvisited node, start DFS
3. Mark current node as "visiting" (state 1)
4. For each neighbor:
   - If neighbor is "visiting" (state 1), cycle found
   - If neighbor is unvisited, recursively visit it
5. After exploring all neighbors, mark current node as "visited" (state 2)
6. If no cycle found after checking all nodes, return false

## Brute Force
### Approach
Check for cycles by maintaining a recursion stack. Without proper state tracking, we might miss cycles or incorrectly identify them.

### Code
**Python**
```python
# Brute force - basic DFS approach
class Solution:
    def isCycle(self, V, adj):
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
// Brute force - may not work correctly for directed graphs
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
- Time: O(V + E)
- Space: O(V)

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def isCycle(self, V: int, adj: list[list[int]]) -> bool:
        WHITE, GRAY, BLACK = 0, 1, 2
        color = [WHITE] * V
        
        def dfs(node):
            color[node] = GRAY
            
            for neighbor in adj[node]:
                if color[neighbor] == GRAY:
                    return True
                if color[neighbor] == WHITE:
                    if dfs(neighbor):
                        return True
            
            color[node] = BLACK
            return False
        
        for i in range(V):
            if color[i] == WHITE:
                if dfs(i):
                    return True
        
        return False
```

**C++**
```cpp
class Solution {
public:
    bool isCycle(int V, vector<int> adj[]) {
        const int WHITE = 0, GRAY = 1, BLACK = 2;
        vector<int> color(V, WHITE);
        
        function<bool(int)> dfs = [&](int node) -> bool {
            color[node] = GRAY;
            
            for (int neighbor : adj[node]) {
                if (color[neighbor] == GRAY) return true;
                if (color[neighbor] == WHITE) {
                    if (dfs(neighbor)) return true;
                }
            }
            
            color[node] = BLACK;
            return false;
        };
        
        for (int i = 0; i < V; i++) {
            if (color[i] == WHITE) {
                if (dfs(i)) return true;
            }
        }
        
        return false;
    }
};
```

### Complexity
- Time: O(V + E) - each vertex and edge processed once
- Space: O(V) - for the color array and recursion stack

## Key Insight
> In a directed graph, a cycle exists if during DFS we encounter a node that is currently on the recursion stack (marked as GRAY). The three-color approach (WHITE/GRAY/BLACK) is essential to correctly detect cycles.
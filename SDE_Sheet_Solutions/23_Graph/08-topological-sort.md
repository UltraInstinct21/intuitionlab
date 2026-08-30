# Topological Sort

> **Difficulty:** Hard | **Topic:** DFS, BFS, Kahn's Algorithm, Directed Acyclic Graph | **Platform:** LeetCode/GFG

---

## Problem Statement
Given a Directed Acyclic Graph (DAG) with V vertices and E edges, find all the vertices in the graph which have in-degree as 0. A topological sort of a Directed Acyclic Graph (DAG) is a linear ordering of its vertices such that for every directed edge u -> v, vertex u comes before v in the ordering. Note: The graph may have multiple topological sorts.

## Examples
**Example 1:**
```
Input: V = 6, edges = [[5,0], [5,2], [4,0], [4,1], [2,3], [3,1]]
Output: [5, 4, 2, 3, 1, 0] or any valid topological order
Explanation: For every edge u -> v, u comes before v in the ordering.
```

**Example 2:**
```
Input: V = 3, edges = [[0,1], [1,2]]
Output: [0, 1, 2]
Explanation: The only valid topological sort is 0, 1, 2.
```

## Constraints
- 1 ≤ V ≤ 10^5
- 1 ≤ E ≤ 10^5

## Topic Tags
`DFS` `BFS` `Kahn-Algorithm` `DAG`

## Expected Complexities
| | |
|---|---|
| **Time** | O(V + E) |
| **Space** | O(V) |

## Intuition
Topological sort orders vertices such that for every directed edge (u, v), u comes before v. Two approaches exist: DFS-based (using recursion stack and post-order) and BFS-based (Kahn's algorithm using in-degree). Kahn's algorithm is more intuitive: repeatedly remove nodes with zero in-degree.

## Approach
**Kahn's Algorithm (BFS):**
1. Calculate in-degree for all vertices
2. Add all vertices with in-degree 0 to a queue
3. While queue is not empty:
   - Dequeue a vertex, add to result
   - For each neighbor, decrement in-degree
   - If in-degree becomes 0, enqueue it
4. If result contains all vertices, topological sort exists

**DFS Approach:**
1. Use a stack and visited set
2. For each unvisited node, do DFS
3. After exploring all neighbors, push node to stack
4. Reverse the stack to get topological order

## Brute Force
### Approach
Without using in-degree or proper DFS tracking, we cannot correctly determine the order of vertices.

### Code
**Python**
```python
# Brute force - incorrect approach
class Solution:
    def topoSort(self, V, adj):
        # Without proper tracking, this won't work
        result = []
        visited = [False] * V
        
        def dfs(node):
            if visited[node]:
                return
            visited[node] = True
            result.append(node)
            for neighbor in adj[node]:
                dfs(neighbor)
        
        for i in range(V):
            if not visited[i]:
                dfs(i)
        
        return result
```

**C++**
```cpp
// Brute force - won't produce correct topological order
class Solution {
public:
    vector<int> topoSort(int V, vector<int> adj[]) {
        vector<int> result;
        vector<bool> visited(V, false);
        
        function<void(int)> dfs = [&](int node) {
            if (visited[node]) return;
            visited[node] = true;
            result.push_back(node);
            for (int neighbor : adj[node]) {
                dfs(neighbor);
            }
        };
        
        for (int i = 0; i < V; i++) {
            if (!visited[i]) dfs(i);
        }
        
        return result;
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
    def topoSort(self, V: int, adj: list[list[int]]) -> list[int]:
        in_degree = [0] * V
        
        for i in range(V):
            for neighbor in adj[i]:
                in_degree[neighbor] += 1
        
        queue = deque([i for i in range(V) if in_degree[i] == 0])
        result = []
        
        while queue:
            node = queue.popleft()
            result.append(node)
            
            for neighbor in adj[node]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
        
        return result
```

**C++**
```cpp
class Solution {
public:
    vector<int> topoSort(int V, vector<int> adj[]) {
        vector<int> in_degree(V, 0);
        
        for (int i = 0; i < V; i++) {
            for (int neighbor : adj[i]) {
                in_degree[neighbor]++;
            }
        }
        
        queue<int> q;
        for (int i = 0; i < V; i++) {
            if (in_degree[i] == 0) q.push(i);
        }
        
        vector<int> result;
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            result.push_back(node);
            
            for (int neighbor : adj[node]) {
                in_degree[neighbor]--;
                if (in_degree[neighbor] == 0) {
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
- Space: O(V) - for in-degree array and queue

## Key Insight
> Kahn's algorithm is intuitive: vertices with no dependencies (in-degree 0) can be processed first. As we process them, their neighbors' dependencies decrease, potentially making them available for processing.
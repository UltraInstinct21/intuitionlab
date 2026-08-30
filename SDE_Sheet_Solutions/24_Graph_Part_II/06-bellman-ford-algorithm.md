# Bellman-Ford Algorithm

> **Difficulty:** Medium | **Topic:** Graph, Shortest-Path, Negative-Weights | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a weighted directed graph with `V` vertices and `E` edges, and a source vertex `src`, find the shortest path distances from `src` to all other vertices. If a vertex is unreachable from `src`, its distance should be `INF`. If the graph contains a negative weight cycle reachable from `src`, return an array containing `-1` for all vertices.

This is the standard Bellman-Ford algorithm problem as taught in the SDE sheet.

## Examples
**Example 1:**
```
Input: V = 5, edges = [[0,1,-1],[0,2,4],[1,2,3],[1,3,2],[1,4,2],[3,2,5],[3,1,1],[4,3,-3]], src = 0
Output: [0, -1, 2, -2, 1]
```

**Example 2:**
```
Input: V = 3, edges = [[0,1,5],[1,2,-2],[2,0,1]], src = 0
Output: [-1, -1, -1]  (negative cycle exists)
```

## Constraints
- `1 <= V <= 500`
- `1 <= E <= min(V*(V-1), 10000)`
- `-1000 <= weight <= 1000`

## Topic Tags
`Bellman-Ford` `Shortest-Path` `Graph` `Negative-Weights` `Dynamic-Programming`

## Expected Complexities
| | |
|---|---|
| **Time** | O(V * E) |
| **Space** | O(V) |

## Intuition
Bellman-Ford is a shortest path algorithm that works with negative edge weights (unlike Dijkstra). It's based on relaxation: after `i` iterations, we are guaranteed to have the shortest paths using at most `i` edges.

The key steps:
1. Relax all edges `V-1` times. After `V-1` iterations, all shortest paths (which use at most `V-1` edges) are found.
2. Check for negative cycles by attempting one more relaxation. If any distance still improves, a negative cycle exists.

This is essentially dynamic programming: `dist[v] = min(dist[v], dist[u] + w)` for all edges `(u, v, w)`.

## Approach
1. Initialize `dist[src] = 0`, all others `INF`.
2. Repeat `V-1` times:
   - For each edge `(u, v, w)`: if `dist[u] + w < dist[v]`, update `dist[v] = dist[u] + w`.
3. Check for negative cycles:
   - For each edge `(u, v, w)`: if `dist[u] + w < dist[v]`, a negative cycle exists. Return `-1` for all.
4. Return the `dist` array.

## Brute Force
### Approach
For each vertex, try all possible paths and find the minimum. This is exponential and not practical for any real graph.

Alternative: Run Dijkstra with handling for negative weights by shifting all weights (not always correct).

### Code
**Python**
```python
class Solution:
    def bellmanFord(self, V, edges, src):
        INF = float('inf')
        dist = [INF] * V
        dist[src] = 0

        # Try all possible path lengths
        for path_length in range(V):
            for u, v, w in edges:
                if dist[u] != INF and dist[u] + w < dist[v]:
                    if path_length == V - 1:
                        # Negative cycle detected
                        return [-1] * V
                    dist[v] = dist[u] + w

        return [d if d != INF else -1 for d in dist]
```
**C++**
```cpp
class Solution {
public:
    vector<int> bellmanFord(int V, vector<vector<int>>& edges, int src) {
        const int INF = 1e9;
        vector<int> dist(V, INF);
        dist[src] = 0;

        for (int i = 0; i < V - 1; i++) {
            for (auto& e : edges) {
                int u = e[0], v = e[1], w = e[2];
                if (dist[u] != INF && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                }
            }
        }

        // Check for negative cycle
        for (auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                return vector<int>(V, -1);
            }
        }

        for (int& d : dist) if (d == INF) d = -1;
        return dist;
    }
};
```
### Complexity
- **Time:** O(V * E) — same as optimized, but without early termination
- **Space:** O(V) — distance array

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def bellmanFord(self, V, edges, src):
        INF = float('inf')
        dist = [INF] * V
        dist[src] = 0

        # Relax all edges V-1 times
        for _ in range(V - 1):
            updated = False
            for u, v, w in edges:
                if dist[u] != INF and dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
                    updated = True
            # Early termination if no update
            if not updated:
                break

        # Check for negative weight cycle
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                return [-1] * V

        return [d if d != INF else -1 for d in dist]
```
**C++**
```cpp
class Solution {
public:
    vector<int> bellmanFord(int V, vector<vector<int>>& edges, int src) {
        const int INF = 1e9;
        vector<int> dist(V, INF);
        dist[src] = 0;

        for (int i = 0; i < V - 1; i++) {
            bool updated = false;
            for (auto& e : edges) {
                int u = e[0], v = e[1], w = e[2];
                if (dist[u] != INF && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    updated = true;
                }
            }
            if (!updated) break; // Early termination
        }

        // Detect negative cycle
        for (auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                return vector<int>(V, -1);
            }
        }

        for (int& d : dist) if (d == INF) d = -1;
        return dist;
    }
};
```
### Complexity
- **Time:** O(V * E) worst case, often better with early termination
- **Space:** O(V) — distance array

### Additional: Detect and Return Negative Cycle Path
```python
def bellmanFordWithPath(self, V, edges, src):
    INF = float('inf')
    dist = [INF] * V
    parent = [-1] * V
    dist[src] = 0

    for _ in range(V - 1):
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                parent[v] = u

    # Find negative cycle
    cycle_node = -1
    for u, v, w in edges:
        if dist[u] != INF and dist[u] + w < dist[v]:
            cycle_node = v
            break

    if cycle_node == -1:
        return dist, -1  # No negative cycle

    # Trace back to find a node in the cycle
    node = cycle_node
    for _ in range(V):
        node = parent[node]

    # Extract cycle
    cycle = []
    curr = node
    while True:
        cycle.append(curr)
        curr = parent[curr]
        if curr == node:
            cycle.append(curr)
            break
    cycle.reverse()

    return dist, cycle
```

## Key Insight
> Bellman-Ford's power is handling negative weights — something Dijkstra cannot do. After `V-1` relaxations, all shortest paths (which use at most `V-1` edges) are guaranteed to be found. The `V`-th relaxation detects negative cycles because a shortest path cannot have more than `V-1` edges unless a negative cycle exists.

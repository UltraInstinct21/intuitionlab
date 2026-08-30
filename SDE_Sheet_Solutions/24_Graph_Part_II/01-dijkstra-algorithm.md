# 743. Network Delay Time (Dijkstra's Algorithm)

> **Difficulty:** Hard | **Topic:** Graph, Shortest Path, Dijkstra | **Platform:** LeetCode

---

## Problem Statement
You are given a network of `n` nodes, labeled from `1` to `n`. You are given a list `times` where `times[i] = (u_i, v_i, w_i)` represents that a signal from node `u_i` takes `w_i` time to reach node `v_i`.

You are also given an integer `k`. Return the minimum time it takes for all `n` nodes to receive the signal starting from node `k`. If it is not possible for all `n` nodes to receive the signal, return `-1`.

## Examples
**Example 1:**
```
Input: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
Output: 2
Explanation: The signal goes from node 2 to node 1 in 1 unit and to node 3 in 1 unit. Node 4 receives from node 3 in 1 unit. Total = 2.
```

**Example 2:**
```
Input: times = [[1,2,1]], n = 2, k = 1
Output: 1
```

## Constraints
- `1 <= k <= n <= 100`
- `1 <= times.length <= 6000`
- `times[i].length == 3`
- `1 <= u_i, v_i <= n`
- `1 <= w_i <= 300`
- All pairs `(u_i, v_i)` are unique

## Topic Tags
`Graph` `Shortest-Path` `Dijkstra` `Priority-Queue` `Heap`

## Expected Complexities
| | |
|---|---|
| **Time** | O(E log V) |
| **Space** | O(V + E) |

## Intuition
This is a classic single-source shortest path problem, which is best solved with Dijkstra's algorithm. Starting from node `k`, we want to find the shortest time to reach every other node. The answer is the maximum distance among all nodes (the time when the last node receives the signal). If any node is unreachable, we return -1.

Dijkstra's algorithm works by always expanding the node with the smallest known distance first. Using a min-heap (priority queue), we greedily process nodes in order of increasing distance, relaxing edges along the way.

## Approach
1. Build an adjacency list from the `times` array.
2. Initialize a min-heap with `(0, k)` — starting at node `k` with distance 0.
3. Initialize a distance array with infinity for all nodes except `k` (distance 0).
4. While the heap is not empty:
   - Pop the node with the smallest distance.
   - If its distance is greater than the recorded shortest distance, skip it.
   - For each neighbor, check if going through the current node gives a shorter path. If so, update and push to heap.
5. Return the maximum value in the distance array. If any node has infinity distance, return -1.

## Brute Force
### Approach
Use Bellman-Ford algorithm — relax all edges `V-1` times. Simpler to implement but slower.
### Code
**Python**
```python
class Solution:
    def networkDelayTime(self, times, n, k):
        dist = [float('inf')] * (n + 1)
        dist[k] = 0

        for _ in range(n - 1):
            for u, v, w in times:
                if dist[u] != float('inf') and dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w

        max_dist = max(dist[1:])
        return max_dist if max_dist != float('inf') else -1
```
**C++**
```cpp
class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        vector<int> dist(n + 1, INT_MAX);
        dist[k] = 0;

        for (int i = 0; i < n - 1; i++) {
            for (auto& edge : times) {
                int u = edge[0], v = edge[1], w = edge[2];
                if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                }
            }
        }

        int maxDist = *max_element(dist.begin() + 1, dist.end());
        return maxDist == INT_MAX ? -1 : maxDist;
    }
};
```
### Complexity
- **Time:** O(V * E) — relaxing all edges V-1 times
- **Space:** O(V) — distance array

## Optimized Solution
### Code
**Python**
```python
import heapq
from collections import defaultdict

class Solution:
    def networkDelayTime(self, times, n, k):
        graph = defaultdict(list)
        for u, v, w in times:
            graph[u].append((v, w))

        dist = {}
        min_heap = [(0, k)]

        while min_heap:
            d, node = heapq.heappop(min_heap)
            if node in dist:
                continue
            dist[node] = d

            for neighbor, weight in graph[node]:
                if neighbor not in dist:
                    heapq.heappush(min_heap, (d + weight, neighbor))

        if len(dist) != n:
            return -1
        return max(dist.values())
```
**C++**
```cpp
class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        vector<vector<pair<int,int>>> graph(n + 1);
        for (auto& edge : times) {
            graph[edge[0]].push_back({edge[1], edge[2]});
        }

        vector<int> dist(n + 1, INT_MAX);
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;

        dist[k] = 0;
        pq.push({0, k});

        while (!pq.empty()) {
            auto [d, u] = pq.top();
            pq.pop();

            if (d > dist[u]) continue;

            for (auto& [v, w] : graph[u]) {
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.push({dist[v], v});
                }
            }
        }

        int maxDist = *max_element(dist.begin() + 1, dist.end());
        return maxDist == INT_MAX ? -1 : maxDist;
    }
};
```
### Complexity
- **Time:** O(E log V) — each edge processed once, heap operations are log V
- **Space:** O(V + E) — adjacency list + heap

## Key Insight
> Dijkstra's algorithm guarantees the shortest path to a node once it's popped from the min-heap, because we always process the closest unvisited node first. The answer is the maximum shortest distance — the time when the farthest node gets the signal.

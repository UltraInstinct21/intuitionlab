# 743. Network Delay Time

> **Difficulty:** Hard | **Topic:** Graph, Dijkstra, Shortest-Path | **Platform:** LeetCode

---

## Problem Statement
You are given a network of `n` nodes, labeled from `1` to `n`. You are given a list `times` where `times[i] = (u_i, v_i, w_i)` represents that a signal from node `u_i` takes `w_i` time to reach node `v_i`.

You are also given an integer `k`. Return the minimum time it takes for all `n` nodes to receive the signal starting from node `k`. If it is not possible for all `n` nodes to receive the signal, return `-1`.

## Examples
**Example 1:**
```
Input: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
Output: 2
Explanation: Node 2 sends to nodes 1 and 3 (time 1). Node 3 sends to node 4 (time 1). All nodes receive by time 2.
```

**Example 2:**
```
Input: times = [[1,2,1]], n = 2, k = 1
Output: 1
```

**Example 3:**
```
Input: times = [[1,2,1]], n = 2, k = 2
Output: -1
```

## Constraints
- `1 <= k <= n <= 100`
- `1 <= times.length <= 6000`
- `times[i].length == 3`
- `1 <= u_i, v_i <= n`
- `1 <= w_i <= 300`
- All pairs `(u_i, v_i)` are unique

## Topic Tags
`Dijkstra` `Graph` `Shortest-Path` `Priority-Queue` `Heap`

## Expected Complexities
| | |
|---|---|
| **Time** | O(E log V) |
| **Space** | O(V + E) |

## Intuition
This is the quintessential Dijkstra problem. We need the shortest path from a single source to all other nodes. The answer is the maximum of all shortest distances — the time when the last node receives the signal. Dijkstra's algorithm is optimal here because all edge weights are non-negative.

The key insight is that we're not looking for a specific destination's shortest path; we need ALL nodes to receive the signal. So the answer is `max(shortest distances)` — the bottleneck node.

## Approach
1. Build an adjacency list from the `times` array.
2. Use Dijkstra's algorithm starting from node `k`:
   - Min-heap stores `(distance, node)`.
   - Track shortest distance to each node.
   - Pop the closest unprocessed node, relax all its edges.
3. After Dijkstra completes, check if all nodes were reached:
   - If any node still has infinity distance, return -1.
   - Otherwise, return the maximum distance.

## Brute Force
### Approach
Run BFS/DFS from `k` and for each node, try all possible paths to find the minimum. This is exponential and impractical.

Alternative brute force: Floyd-Warshall to compute all-pairs shortest paths, then find the max distance from `k`.
### Code
**Python**
```python
class Solution:
    def networkDelayTime(self, times, n, k):
        # Floyd-Warshall approach
        INF = float('inf')
        dist = [[INF] * (n + 1) for _ in range(n + 1)]

        for i in range(1, n + 1):
            dist[i][i] = 0

        for u, v, w in times:
            dist[u][v] = w

        for mid in range(1, n + 1):
            for i in range(1, n + 1):
                for j in range(1, n + 1):
                    dist[i][j] = min(dist[i][j], dist[i][mid] + dist[mid][j])

        max_dist = max(dist[k][1:])
        return max_dist if max_dist != INF else -1
```
**C++**
```cpp
class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        vector<vector<int>> dist(n + 1, vector<int>(n + 1, INT_MAX));
        for (int i = 1; i <= n; i++) dist[i][i] = 0;
        for (auto& t : times) dist[t[0]][t[1]] = t[2];

        for (int mid = 1; mid <= n; mid++)
            for (int i = 1; i <= n; i++)
                for (int j = 1; j <= n; j++)
                    if (dist[i][mid] != INT_MAX && dist[mid][j] != INT_MAX)
                        dist[i][j] = min(dist[i][j], dist[i][mid] + dist[mid][j]);

        int ans = *max_element(dist[k].begin() + 1, dist[k].end());
        return ans == INT_MAX ? -1 : ans;
    }
};
```
### Complexity
- **Time:** O(V^3) — Floyd-Warshall
- **Space:** O(V^2) — distance matrix

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

        # Dijkstra's algorithm
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
        for (auto& t : times) graph[t[0]].push_back({t[1], t[2]});

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

        int ans = *max_element(dist.begin() + 1, dist.end());
        return ans == INT_MAX ? -1 : ans;
    }
};
```
### Complexity
- **Time:** O(E log V) — each edge relaxed once, heap ops are log V
- **Space:** O(V + E) — adjacency list + heap + distance tracking

## Key Insight
> The network delay time is the longest shortest path from the source. Dijkstra naturally computes shortest paths to all nodes. The answer is simply the maximum of those distances — the worst-case time for the signal to reach the farthest node. If any node is unreachable, the answer is -1.

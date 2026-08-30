# 787. Cheapest Flights Within K Stops

> **Difficulty:** Hard | **Topic:** Graph, BFS, Bellman-Ford, Dijkstra | **Platform:** LeetCode

---

## Problem Statement
There are `n` cities connected by some number of flights. You are given an array `flights` where `flights[i] = [from_i, to_i, price_i]` indicates that there is a flight from city `from_i` to city `to_i` with cost `price_i`.

You are also given three integers `src`, `dst`, and `k`. Return the cheapest price from `src` to `dst` with at most `k` stops. If there is no such route, return `-1`.

## Examples
**Example 1:**
```
Input: n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1
Output: 700
Explanation: 0 -> 1 -> 3 costs 700 with 1 stop.
```

**Example 2:**
```
Input: n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1
Output: 200
Explanation: 0 -> 1 -> 2 costs 200 with 1 stop. Direct flight costs 500 but requires 0 stops (k=1 allows it, but 200 is cheaper).
```

## Constraints
- `1 <= n <= 100`
- `0 <= flights.length <= n * (n - 1) / 2`
- `flights[i].length == 3`
- `0 <= from_i, to_i < n`
- `from_i != to_i`
- `1 <= price_i <= 10^4`
- `0 <= src, dst, k < n`
- `src != dst`

## Topic Tags
`BFS` `Bellman-Ford` `Dynamic-Programming` `Graph` `Shortest-Path`

## Expected Complexities
| | |
|---|---|
| **Time** | O(K * E) |
| **Space** | O(V + E) |

## Intuition
The key constraint here is "at most `k` stops." Standard Dijkstra doesn't account for a hop limit. We can use:

1. **Bellman-Ford variant:** Limit relaxation to exactly `k+1` iterations (since `k` stops means `k+1` edges). This is the cleanest approach.
2. **BFS with level tracking:** Process nodes level by level (each level = one more stop). Keep track of the minimum cost to reach each city within the allowed stops.
3. **Modified Dijkstra:** Store `(cost, node, stops_used)` in the heap. Only relax if stops_used <= k.

Bellman-Ford is most natural here because the "at most k stops" maps directly to "at most k+1 relaxations."

## Approach
### Bellman-Ford with K constraint
1. Initialize `dist` array with infinity except `dist[src] = 0`.
2. Repeat `k+1` times (for `k+1` edges maximum):
   - For each flight `(u, v, w)`, if `dist[u] + w < dist[v]`, update `dist[v]`.
   - Use a copy of `dist` from the previous iteration to avoid using updated values in the same round.
3. Return `dist[dst]` if finite, else -1.

### BFS Approach
1. Build adjacency list.
2. Use a queue with `(node, cost, stops)`.
3. Track minimum cost to reach each city.
4. Only explore neighbors if stops < k+1.

## Brute Force
### Approach
Try all possible paths using DFS, track the minimum cost for paths with at most k stops.
### Code
**Python**
```python
class Solution:
    def findCheapestPrice(self, n, flights, src, dst, k):
        from collections import defaultdict
        graph = defaultdict(list)
        for u, v, w in flights:
            graph[u].append((v, w))

        best = float('inf')

        def dfs(node, cost, stops):
            nonlocal best
            if node == dst:
                best = min(best, cost)
                return
            if stops > k or cost >= best:
                return
            for neighbor, price in graph[node]:
                dfs(neighbor, cost + price, stops + 1)

        dfs(src, 0, 0)
        return best if best != float('inf') else -1
```
**C++**
```cpp
class Solution {
public:
    int best = INT_MAX;

    void dfs(vector<vector<pair<int,int>>>& graph, int node, int dst, int cost, int stops, int k) {
        if (node == dst) { best = min(best, cost); return; }
        if (stops > k || cost >= best) return;
        for (auto& [next, price] : graph[node]) {
            dfs(graph, next, dst, cost + price, stops + 1, k);
        }
    }

    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        vector<vector<pair<int,int>>> graph(n);
        for (auto& f : flights) graph[f[0]].push_back({f[1], f[2]});
        dfs(graph, src, dst, 0, 0, k);
        return best == INT_MAX ? -1 : best;
    }
};
```
### Complexity
- **Time:** O(V^k) — exponential
- **Space:** O(V + E) — graph + recursion stack

## Optimized Solution
### Code
**Python**
```python
from collections import deque

class Solution:
    def findCheapestPrice(self, n, flights, src, dst, k):
        # Approach 1: Bellman-Ford with K constraint
        INF = float('inf')
        dist = [INF] * n
        dist[src] = 0

        for _ in range(k + 1):
            temp = dist[:]
            for u, v, w in flights:
                if dist[u] != INF and dist[u] + w < temp[v]:
                    temp[v] = dist[u] + w
            dist = temp

        return dist[dst] if dist[dst] != INF else -1

    def findCheapestPriceBFS(self, n, flights, src, dst, k):
        # Approach 2: BFS with level tracking
        from collections import defaultdict
        graph = defaultdict(list)
        for u, v, w in flights:
            graph[u].append((v, w))

        INF = float('inf')
        cost = [INF] * n
        cost[src] = 0
        queue = deque([(src, 0)])
        stops = 0

        while queue and stops <= k:
            size = len(queue)
            for _ in range(size):
                node, curr_cost = queue.popleft()
                for neighbor, price in graph[node]:
                    new_cost = curr_cost + price
                    if new_cost < cost[neighbor]:
                        cost[neighbor] = new_cost
                        queue.append((neighbor, new_cost))
            stops += 1

        return cost[dst] if cost[dst] != INF else -1
```
**C++**
```cpp
class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        // Approach 1: Bellman-Ford with K constraint
        vector<int> dist(n, INT_MAX);
        dist[src] = 0;

        for (int i = 0; i <= k; i++) {
            vector<int> temp = dist;
            for (auto& f : flights) {
                int u = f[0], v = f[1], w = f[2];
                if (dist[u] != INT_MAX && dist[u] + w < temp[v]) {
                    temp[v] = dist[u] + w;
                }
            }
            dist = temp;
        }

        return dist[dst] == INT_MAX ? -1 : dist[dst];
    }

    int findCheapestPriceBFS(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        // Approach 2: BFS
        vector<vector<pair<int,int>>> graph(n);
        for (auto& f : flights) graph[f[0]].push_back({f[1], f[2]});

        vector<int> cost(n, INT_MAX);
        cost[src] = 0;
        queue<pair<int,int>> q;
        q.push({src, 0});
        int stops = 0;

        while (!q.empty() && stops <= k) {
            int sz = q.size();
            for (int i = 0; i < sz; i++) {
                auto [node, curr] = q.front(); q.pop();
                for (auto& [next, price] : graph[node]) {
                    if (curr + price < cost[next]) {
                        cost[next] = curr + price;
                        q.push({next, curr + price});
                    }
                }
            }
            stops++;
        }

        return cost[dst] == INT_MAX ? -1 : cost[dst];
    }
};
```
### Complexity
- **Time:** O(K * E) — K+1 iterations over all edges
- **Space:** O(V) — distance array

## Key Insight
> The "at most k stops" constraint makes this a perfect fit for Bellman-Ford with a fixed number of iterations. Each iteration guarantees we've found the cheapest paths using at most `i` edges, so after `k+1` iterations, we have the cheapest path with at most `k` stops.

# 1631. Path With Minimum Effort

> **Difficulty:** Hard | **Topic:** Graph, Binary Search, Dijkstra, Union-Find | **Platform:** LeetCode

---

## Problem Statement
You are a hiker preparing for an upcoming hike. You are given a 2D array `heights` of size `m x n` where `heights[row][col]` represents the height of cell `(row, col)`. You are situated in the top-left cell `(0, 0)`, and you hope to travel to the bottom-right cell `(m-1, n-1)`.

The effort of a path is defined as the maximum absolute difference in heights between two consecutive cells of the path. Return the minimum effort required to travel from the top-left cell to the bottom-right cell.

## Examples
**Example 1:**
```
Input: heights = [[1,2,2],[3,8,2],[5,3,5]]
Output: 2
Explanation: Path [1,3,5,3,5] has max diff = 2.
```

**Example 2:**
```
Input: heights = [[1,2,3],[3,8,4],[5,3,5]]
Output: 1
Explanation: Path [1,2,3,4,5] has max diff = 1.
```

## Constraints
- `m == heights.length`
- `n == heights[r].length`
- `1 <= m, n <= 100`
- `1 <= heights[r][c] <= 10^6`

## Topic Tags
`Binary-Search` `BFS` `Dijkstra` `Union-Find` `Graph`

## Expected Complexities
| | |
|---|---|
| **Time** | O(m*n*log(max_height)) |
| **Space** | O(m*n) |

## Intuition
We want to find a path where the maximum edge weight (height difference) is minimized. This is a minimax problem. Two approaches work well:

1. **Binary Search + BFS/DFS:** Binary search on the answer (effort). For a given effort, check if a path exists where all consecutive height differences are <= that effort.
2. **Modified Dijkstra:** Treat this as finding the path with minimum "maximum edge" — use a min-heap where we always expand the path with the smallest maximum effort so far.

Both are efficient. The binary search approach is elegant because the answer space is bounded (0 to 10^6).

## Approach
### Binary Search + BFS
1. Binary search on effort `mid` from 0 to max height difference.
2. For each `mid`, run BFS from `(0,0)` to `(m-1,n-1)`, only traversing edges where `abs(height_diff) <= mid`.
3. If reachable, the answer is <= mid, so search lower. Otherwise, search higher.

### Dijkstra Variant
1. Min-heap stores `(effort, row, col)`.
2. For each cell popped, explore neighbors. New effort = max(current effort, abs(height difference)).
3. If new effort < best known for neighbor, update and push.
4. First time we pop the target, that's the answer.

## Brute Force
### Approach
Try all possible paths using DFS, track the maximum edge difference for each path, return the minimum.
### Code
**Python**
```python
class Solution:
    def minimumEffortPath(self, heights):
        m, n = len(heights), len(heights[0])
        directions = [(0,1),(1,0),(0,-1),(-1,0)]
        best = float('inf')

        def dfs(r, c, max_effort, visited):
            nonlocal best
            if r == m - 1 and c == n - 1:
                best = min(best, max_effort)
                return
            visited.add((r, c))
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and (nr, nc) not in visited:
                    effort = max(max_effort, abs(heights[nr][nc] - heights[r][c]))
                    if effort < best:
                        dfs(nr, nc, effort, visited)
            visited.remove((r, c))

        dfs(0, 0, 0, set())
        return best
```
**C++**
```cpp
class Solution {
public:
    int m, n;
    int dirs[4][2] = {{0,1},{1,0},{0,-1},{-1,0}};
    int best = INT_MAX;

    void dfs(vector<vector<int>>& h, int r, int c, int effort, vector<vector<bool>>& vis) {
        if (r == m-1 && c == n-1) { best = min(best, effort); return; }
        vis[r][c] = true;
        for (auto& [dr, dc] : dirs) {
            int nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && !vis[nr][nc]) {
                int e = max(effort, abs(h[nr][nc] - h[r][c]));
                if (e < best) dfs(h, nr, nc, e, vis);
            }
        }
        vis[r][c] = false;
    }

    int minimumEffortPath(vector<vector<int>>& heights) {
        m = heights.size(); n = heights[0].size();
        vector<vector<bool>> vis(m, vector<bool>(n, false));
        dfs(heights, 0, 0, 0, vis);
        return best;
    }
};
```
### Complexity
- **Time:** O(4^(m*n)) — exponential
- **Space:** O(m*n) — recursion stack

## Optimized Solution
### Code
**Python**
```python
import heapq
from collections import deque

class Solution:
    def minimumEffortPath(self, heights):
        m, n = len(heights), len(heights[0])
        directions = [(0,1),(1,0),(0,-1),(-1,0)]

        # Approach 1: Dijkstra variant
        dist = [[float('inf')] * n for _ in range(m)]
        dist[0][0] = 0
        heap = [(0, 0, 0)]

        while heap:
            effort, r, c = heapq.heappop(heap)
            if r == m - 1 and c == n - 1:
                return effort
            if effort > dist[r][c]:
                continue
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n:
                    new_effort = max(effort, abs(heights[nr][nc] - heights[r][c]))
                    if new_effort < dist[nr][nc]:
                        dist[nr][nc] = new_effort
                        heapq.heappush(heap, (new_effort, nr, nc))

    def minimumEffortPathBinarySearch(self, heights):
        # Approach 2: Binary Search + BFS
        m, n = len(heights), len(heights[0])
        directions = [(0,1),(1,0),(0,-1),(-1,0)]

        def can_reach(limit):
            visited = set()
            queue = deque([(0, 0)])
            visited.add((0, 0))
            while queue:
                r, c = queue.popleft()
                if r == m - 1 and c == n - 1:
                    return True
                for dr, dc in directions:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < m and 0 <= nc < n and (nr, nc) not in visited:
                        if abs(heights[nr][nc] - heights[r][c]) <= limit:
                            visited.add((nr, nc))
                            queue.append((nr, nc))
            return False

        lo, hi = 0, 10**6
        while lo < hi:
            mid = (lo + hi) // 2
            if can_reach(mid):
                hi = mid
            else:
                lo = mid + 1
        return lo
```
**C++**
```cpp
class Solution {
public:
    int minimumEffortPath(vector<vector<int>>& heights) {
        int m = heights.size(), n = heights[0].size();
        vector<vector<int>> dist(m, vector<int>(n, INT_MAX));
        priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> pq;

        dist[0][0] = 0;
        pq.push({0, 0, 0});
        int dirs[4][2] = {{0,1},{1,0},{0,-1},{-1,0}};

        while (!pq.empty()) {
            auto [effort, r, c] = pq.top();
            pq.pop();
            if (r == m-1 && c == n-1) return effort;
            if (effort > dist[r][c]) continue;

            for (auto& [dr, dc] : dirs) {
                int nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                    int newEffort = max(effort, abs(heights[nr][nc] - heights[r][c]));
                    if (newEffort < dist[nr][nc]) {
                        dist[nr][nc] = newEffort;
                        pq.push({newEffort, nr, nc});
                    }
                }
            }
        }
        return 0;
    }
};
```
### Complexity
- **Time:** O(m*n*log(max_height)) — Dijkstra with m*n nodes, or binary search with BFS
- **Space:** O(m*n) — distance array or visited set

## Key Insight
> This is a minimax problem: minimize the maximum edge on the path. Dijkstra's greedy approach works because we always expand the path with the smallest worst-case effort, guaranteeing optimality when we first reach the destination.

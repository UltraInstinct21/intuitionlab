# 207. Course Schedule

> **Difficulty:** Medium | **Topic:** DFS, BFS, Topological Sort, Directed Graph | **Platform:** LeetCode

---

## Problem Statement
There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

Return true if you can finish all courses. Otherwise, return false.

## Examples
**Example 1:**
```
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
Explanation: You can take course 0 first, then course 1.
```

**Example 2:**
```
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
Explanation: There is a cycle: 0 -> 1 -> 0, so it's impossible to finish all courses.
```

## Constraints
- 1 <= numCourses <= 2000
- 0 <= prerequisites.length <= 5000
- prerequisites[i].length == 2
- 0 <= ai, bi < numCourses

## Topic Tags
`DFS` `BFS` `Topological-Sort` `Directed-Graph`

## Expected Complexities
| | |
|---|---|
| **Time** | O(V + E) |
| **Space** | O(V) |

## Intuition
This problem is equivalent to detecting a cycle in a directed graph. If there's a cycle, we can't complete all courses. We can use topological sort (Kahn's algorithm) - if we can process all courses, there's no cycle.

## Approach
1. Build adjacency list and calculate in-degree for each course
2. Use Kahn's algorithm:
   - Add courses with no prerequisites (in-degree 0) to queue
   - Process courses, reducing in-degree of dependent courses
   - If a course's in-degree becomes 0, add to queue
3. If we can process all courses (result size == numCourses), return true

## Brute Force
### Approach
Try all possible orderings of courses and check if any order satisfies all prerequisites. This is exponential time.

### Code
**Python**
```python
# Brute force - try all permutations (not practical)
class Solution:
    def canFinish(self, numCourses, prerequisites):
        # Build adjacency list
        adj = [[] for _ in range(numCourses)]
        for course, prereq in prerequisites:
            adj[course].append(prereq)
        
        # Use DFS to detect cycle
        visited = [0] * numCourses  # 0: unvisited, 1: visiting, 2: visited
        
        def dfs(node):
            if visited[node] == 1:
                return False
            if visited[node] == 2:
                return True
            
            visited[node] = 1
            for neighbor in adj[node]:
                if not dfs(neighbor):
                    return False
            visited[node] = 2
            return True
        
        for i in range(numCourses):
            if not dfs(i):
                return False
        
        return True
```

**C++**
```cpp
// Brute force - DFS cycle detection
class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        for (auto& p : prerequisites) {
            adj[p[0]].push_back(p[1]);
        }
        
        vector<int> visited(numCourses, 0);
        
        function<bool(int)> dfs = [&](int node) -> bool {
            if (visited[node] == 1) return false;
            if (visited[node] == 2) return true;
            
            visited[node] = 1;
            for (int neighbor : adj[node]) {
                if (!dfs(neighbor)) return false;
            }
            visited[node] = 2;
            return true;
        };
        
        for (int i = 0; i < numCourses; i++) {
            if (!dfs(i)) return false;
        }
        
        return true;
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
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        adj = [[] for _ in range(numCourses)]
        in_degree = [0] * numCourses
        
        for course, prereq in prerequisites:
            adj[prereq].append(course)
            in_degree[course] += 1
        
        queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
        count = 0
        
        while queue:
            course = queue.popleft()
            count += 1
            
            for next_course in adj[course]:
                in_degree[next_course] -= 1
                if in_degree[next_course] == 0:
                    queue.append(next_course)
        
        return count == numCourses
```

**C++**
```cpp
class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        vector<int> in_degree(numCourses, 0);
        
        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
            in_degree[p[0]]++;
        }
        
        queue<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (in_degree[i] == 0) q.push(i);
        }
        
        int count = 0;
        while (!q.empty()) {
            int course = q.front();
            q.pop();
            count++;
            
            for (int next_course : adj[course]) {
                in_degree[next_course]--;
                if (in_degree[next_course] == 0) {
                    q.push(next_course);
                }
            }
        }
        
        return count == numCourses;
    }
};
```

### Complexity
- Time: O(V + E) - each vertex and edge processed once
- Space: O(V) - for in-degree array and queue

## Key Insight
> Course scheduling is equivalent to topological sort. If we can process all courses (in-degree becomes 0 for all), there's no cycle and we can complete all courses.
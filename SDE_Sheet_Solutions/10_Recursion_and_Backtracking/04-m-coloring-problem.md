# M-Coloring Problem

> **Difficulty:** Hard | **Topic:** Backtracking, Graph Coloring | **Platform:** GeeksforGeeks

---

## Problem Statement
Given an undirected graph and a number m, the task is to determine if the graph can be colored with at most m colors such that no two adjacent vertices of the graph are colored with the same color. Here coloring of a graph means the assignment of colors to all vertices.

## Examples
**Example 1:**
```
Input: graph = [[0,1,1,1],[1,0,1,0],[1,1,0,1],[1,0,1,0]], m = 3
Output: 1
Explanation: It is possible to color the given graph with 3 colors.
```

**Example 2:**
```
Input: graph = [[0,1],[1,0]], m = 1
Output: 0
Explanation: It is not possible to color the given graph with 1 color.
```

## Constraints
- 1 <= n <= 20
- 1 <= m <= n
- 0 <= edges <= n*(n-1)/2

## Topic Tags
`Backtracking` `Graph` `Recursion`

## Expected Complexities
| | |
|---|---|
| **Time** | O(m^n) |
| **Space** | O(n) |

## Intuition
The M-Coloring problem is about finding a valid coloring of a graph using at most M colors. We use backtracking to try assigning colors to vertices one by one. For each vertex, we try each color and check if it conflicts with any adjacent vertex. If valid, we assign the color and move to the next vertex. If no valid color exists, we backtrack.

## Approach
1. Create an array to store the color assigned to each vertex (initialized to 0).
2. Define a function to check if a color can be assigned to a vertex.
3. A color is safe if no adjacent vertex has the same color.
4. Recursively assign colors to vertices.
5. For each vertex, try each color from 1 to m.
6. If the color is safe, assign it and recurse to the next vertex.
7. If all vertices are colored, return true.
8. If no color works for a vertex, return false to trigger backtracking.

## Brute Force
### Approach
Try all possible color combinations and check if any valid coloring exists.
### Code
**Python**
```python
class Solution:
    def graphColoring(self, graph, m, V):
        colors = [0] * V
        
        def is_safe(vertex, color):
            for i in range(V):
                if graph[vertex][i] == 1 and colors[i] == color:
                    return False
            return True
        
        def solve(vertex):
            if vertex == V:
                return True
            for color in range(1, m + 1):
                if is_safe(vertex, color):
                    colors[vertex] = color
                    if solve(vertex + 1):
                        return True
                    colors[vertex] = 0
            return False
        
        return 1 if solve(0) else 0
```
**C++**
```cpp
class Solution {
public:
    bool isSafe(vector<vector<int>>& graph, vector<int>& colors, int vertex, int color, int V) {
        for (int i = 0; i < V; i++)
            if (graph[vertex][i] == 1 && colors[i] == color)
                return false;
        return true;
    }
    
    bool solve(vector<vector<int>>& graph, vector<int>& colors, int m, int V, int vertex) {
        if (vertex == V) return true;
        for (int color = 1; color <= m; color++) {
            if (isSafe(graph, colors, vertex, color, V)) {
                colors[vertex] = color;
                if (solve(graph, colors, m, V, vertex + 1))
                    return true;
                colors[vertex] = 0;
            }
        }
        return false;
    }
    
    int graphColoring(vector<vector<int>>& graph, int m, int V) {
        vector<int> colors(V, 0);
        return solve(graph, colors, m, V, 0) ? 1 : 0;
    }
};
```
### Complexity
- Time: O(m^n) - trying m colors for n vertices
- Space: O(n) - for storing colors

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def graphColoring(self, graph, m, V):
        colors = [0] * V
        adjacency = [[] for _ in range(V)]
        
        for i in range(V):
            for j in range(V):
                if graph[i][j] == 1:
                    adjacency[i].append(j)
        
        def is_safe(vertex, color):
            for neighbor in adjacency[vertex]:
                if colors[neighbor] == color:
                    return False
            return True
        
        def solve(vertex):
            if vertex == V:
                return True
            for color in range(1, m + 1):
                if is_safe(vertex, color):
                    colors[vertex] = color
                    if solve(vertex + 1):
                        return True
                    colors[vertex] = 0
            return False
        
        return 1 if solve(0) else 0
```
**C++**
```cpp
class Solution {
public:
    bool isSafe(vector<vector<int>>& adjacency, vector<int>& colors, int vertex, int color) {
        for (int neighbor : adjacency[vertex])
            if (colors[neighbor] == color)
                return false;
        return true;
    }
    
    bool solve(vector<vector<int>>& adjacency, vector<int>& colors, int m, int V, int vertex) {
        if (vertex == V) return true;
        for (int color = 1; color <= m; color++) {
            if (isSafe(adjacency, colors, vertex, color)) {
                colors[vertex] = color;
                if (solve(adjacency, colors, m, V, vertex + 1))
                    return true;
                colors[vertex] = 0;
            }
        }
        return false;
    }
    
    int graphColoring(vector<vector<int>>& graph, int m, int V) {
        vector<vector<int>> adjacency(V);
        for (int i = 0; i < V; i++)
            for (int j = 0; j < V; j++)
                if (graph[i][j] == 1)
                    adjacency[i].push_back(j);
        
        vector<int> colors(V, 0);
        return solve(adjacency, colors, m, V, 0) ? 1 : 0;
    }
};
```
### Complexity
- Time: O(m^n) - backtracking with pruning
- Space: O(V + E) - for adjacency list

## Key Insight
> Converting the adjacency matrix to an adjacency list allows faster iteration over neighbors during color validity checks, reducing constant factors in the backtracking process.

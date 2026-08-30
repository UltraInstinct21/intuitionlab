# 133. Clone Graph

> **Difficulty:** Medium | **Topic:** Graph, DFS, BFS, Hash Map | **Platform:** LeetCode

---

## Problem Statement
Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node in the graph contains a value (int) and a list of its neighbors.

## Examples
**Example 1:**
```
Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
Output: [[2,4],[1,3],[2,4],[1,3]]
Explanation: There are 4 nodes in the graph.
Node 1's neighbors are 2 and 4.
Node 2's neighbors are 1 and 3.
Node 3's neighbors are 2 and 4.
Node 4's neighbors are 1 and 3.
```

**Example 2:**
```
Input: adjList = [[]]
Output: [[]]
Explanation: The graph has one node with no neighbors.
```

**Example 3:**
```
Input: adjList = []
Output: []
Explanation: The graph is empty.
```

## Constraints
- The number of nodes in the graph is in the range [0, 100].
- 1 <= Node.val <= 100
- Node.val is unique for each node.
- There are no repeated edges and no self-loops in the graph.
- The Graph is connected and all nodes can be visited starting from the given node.

## Topic Tags
`Hash-Map` `DFS` `BFS` `Graph`

## Expected Complexities
| | |
|---|---|
| **Time** | O(V + E) |
| **Space** | O(V) |

## Intuition
The key challenge is to create a deep copy of the graph while avoiding infinite loops (due to cycles) and redundant work. We need to keep track of which nodes have already been cloned. A hash map serves as our visited/cloned set, mapping original nodes to their clones. For each node, we create a new clone, then recursively or iteratively clone all its neighbors.

## Approach
1. Use a hash map to store mapping from original node to cloned node
2. Use DFS or BFS to traverse the graph
3. For each node encountered:
   - If already cloned, return the clone
   - Otherwise, create a new clone and add to hash map
   - Recursively clone all neighbors and add to clone's neighbor list
4. Return the clone of the starting node

## Brute Force
### Approach
Without using a hash map, we could use a visited set and create new nodes, but we'd lose the mapping between original and cloned nodes when encountering them again. This makes it impossible to add the same cloned node as a neighbor to multiple original nodes' clones.

### Code
**Python**
```python
# Brute force would not work well without hash map
# This is shown for completeness - not recommended
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
```

**C++**
```cpp
// Brute force approach without hash map (not recommended)
// Cannot properly handle shared references between nodes
class Node {
public:
    int val;
    vector<Node*> neighbors;
    Node() : val(0), neighbors(nullptr) {}
    Node(int _val) : val(_val), neighbors(nullptr) {}
    Node(int _val, vector<Node*> _neighbors) : val(_val), neighbors(_neighbors) {}
};
```

### Complexity
- Time: O(V + E) - visits each node and edge once
- Space: O(V) - for recursion stack

## Optimized Solution
### Code
**Python**
```python
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

class Solution:
    def cloneGraph(self, node: 'Node') -> 'Node':
        if not node:
            return None
        
        cloned = {}
        
        def dfs(original):
            if original in cloned:
                return cloned[original]
            
            clone = Node(original.val)
            cloned[original] = clone
            
            for neighbor in original.neighbors:
                clone.neighbors.append(dfs(neighbor))
            
            return clone
        
        return dfs(node)
```

**C++**
```cpp
class Node {
public:
    int val;
    vector<Node*> neighbors;
    Node() : val(0), neighbors(nullptr) {}
    Node(int _val) : val(_val), neighbors(nullptr) {}
    Node(int _val, vector<Node*> _neighbors) : val(_val), neighbors(_neighbors) {}
};

class Solution {
public:
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        
        unordered_map<Node*, Node*> cloned;
        
        function<Node*(Node*)> dfs = [&](Node* original) -> Node* {
            if (cloned.find(original) != cloned.end()) {
                return cloned[original];
            }
            
            Node* clone = new Node(original->val);
            cloned[original] = clone;
            
            for (Node* neighbor : original->neighbors) {
                clone->neighbors.push_back(dfs(neighbor));
            }
            
            return clone;
        };
        
        return dfs(node);
    }
};
```

### Complexity
- Time: O(V + E) - DFS visits each node and edge exactly once
- Space: O(V) - hash map stores V entries, recursion stack can go up to V deep

## Key Insight
> Use a hash map to maintain the mapping from original nodes to their clones, preventing cycles from causing infinite recursion and ensuring each node is cloned exactly once.
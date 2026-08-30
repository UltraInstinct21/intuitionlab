# Top View of Binary Tree

> **Difficulty:** Medium | **Topic:** Binary Tree, BFS, HashMap | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a binary tree, print the top view of it. The top view of a binary tree is the set of nodes visible when the tree is viewed from the top.

A node is included in the top view if it is the topmost node at its horizontal distance from the root.

## Examples
**Example 1:**
```
Input: 
       1
      / \
     2   3
    / \ / \
   4  5 6  7
Output: [4, 2, 1, 3, 7]
```

**Example 2:**
```
Input:
       1
      / \
     2   3
    /     
   4      
Output: [4, 2, 1, 3]
```

## Constraints
- 1 ≤ Number of nodes ≤ 10^5
- 1 ≤ Data of a node ≤ 10^5

## Topic Tags
`Binary Tree` `BFS` `HashMap` `Horizontal Distance`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n log n) |
| **Space** | O(n) |

## Intuition
The top view shows the topmost node at each horizontal distance from the root. Unlike bottom view, we only store the first node encountered at each hd (first-come-first-served). We use BFS to ensure we process nodes level by level, and a TreeMap to maintain sorted order of horizontal distances.

## Approach
1. Use BFS with a queue storing (node, horizontal_distance)
2. Use a TreeMap/HashMap to store first node value at each hd
3. For each node, only update the map if hd is not already present
4. After BFS, extract values from map in order of hd

## Brute Force
### Approach
We could store all nodes with their hd and then sort by hd, keeping only the first occurrence. BFS with TreeMap is cleaner.

## Optimized Solution
### Code
**Python**
```python
from collections import deque
from sortedcontainers import TreeMap

'''
class Node:
    def __init__(self, val):
        self.data = val
        self.left = None
        self.right = None
'''

class Solution:
    def topView(self, root):
        if not root:
            return []
        
        hd_map = TreeMap()
        queue = deque([(root, 0)])
        
        while queue:
            node, hd = queue.popleft()
            if hd not in hd_map:  # Only store first occurrence
                hd_map[hd] = node.data
            
            if node.left:
                queue.append((node.left, hd - 1))
            if node.right:
                queue.append((node.right, hd + 1))
        
        return list(hd_map.values())
```

**C++**
```cpp
/*
struct Node
{
    int data;
    Node* left;
    Node* right;
};
*/

class Solution {
  public:
    vector<int> topView(Node *root) {
        vector<int> result;
        if (!root) return result;
        
        map<int, int> hdMap;
        queue<pair<Node*, int>> q;
        q.push({root, 0});
        
        while (!q.empty()) {
            auto [node, hd] = q.front();
            q.pop();
            
            if (hdMap.find(hd) == hdMap.end()) {
                hdMap[hd] = node->data;
            }
            
            if (node->left) q.push({node->left, hd - 1});
            if (node->right) q.push({node->right, hd + 1});
        }
        
        for (auto& [hd, val] : hdMap) {
            result.push_back(val);
        }
        
        return result;
    }
};
```

### Complexity
- **Time Complexity:** O(n log n) - BFS is O(n), TreeMap operations are O(log n)
- **Space Complexity:** O(n) - For storing nodes in queue and map

## Key Insight
> Top view captures the topmost node at each horizontal distance - we only store the first node encountered at each hd, ensuring visibility from the top.

# Bottom View of Binary Tree

> **Difficulty:** Medium | **Topic:** Binary Tree, BFS, HashMap | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a binary tree, print the bottom view of it. The bottom view of a binary tree is the set of nodes visible when the tree is viewed from the bottom.

A node is included in the bottom view if it is the bottommost node at its horizontal distance from the root.

## Examples
**Example 1:**
```
Input: 
       1
      / \
     2   3
    / \ / \
   4  5 6  7
Output: [4, 2, 5, 6, 7]
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
The bottom view shows the bottommost node at each horizontal distance from the root. We assign horizontal distances (hd) to nodes: root has hd=0, left child has hd-1, right child has hd+1. We use BFS to traverse level by level, and for each horizontal distance, we keep updating the node value (later nodes at same hd override earlier ones).

Using a TreeMap (sorted map) ensures we get nodes in left-to-right order of horizontal distances.

## Approach
1. Use BFS with a queue storing (node, horizontal_distance)
2. Use a TreeMap/HashMap to store last node value at each hd
3. For each node, update the map with current hd
4. After BFS, extract values from map in order of hd

## Brute Force
### Approach
We could store all nodes with their hd and then sort by hd, but BFS with TreeMap is more efficient.

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
    def bottomView(self, root):
        if not root:
            return []
        
        hd_map = TreeMap()
        queue = deque([(root, 0)])
        
        while queue:
            node, hd = queue.popleft()
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
    vector<int> bottomView(Node *root) {
        vector<int> result;
        if (!root) return result;
        
        map<int, int> hdMap;  // TreeMap equivalent
        queue<pair<Node*, int>> q;
        q.push({root, 0});
        
        while (!q.empty()) {
            auto [node, hd] = q.front();
            q.pop();
            
            hdMap[hd] = node->data;
            
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
> Bottom view captures the bottommost node at each horizontal distance - later nodes at the same hd override earlier ones, giving us the "bottom" view.

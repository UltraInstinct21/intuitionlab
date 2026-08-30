# Print Root to Leaf Paths in Binary Tree

> **Difficulty:** Medium | **Topic:** Binary Tree, DFS, Backtracking | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a binary tree, print all root-to-leaf paths. Each path should be represented as a list of node values from root to leaf.

## Examples
**Example 1:**
```
Input: 
       1
      / \
     2   3
Output: [[1,2], [1,3]]
```

**Example 2:**
```
Input:
       1
      / \
     2   3
    / \
   4   5
Output: [[1,2,4], [1,2,5], [1,3]]
```

## Constraints
- 1 ≤ Number of nodes ≤ 10^4
- 1 ≤ Data of a node ≤ 10^4

## Topic Tags
`Binary Tree` `DFS` `Backtracking` `Path`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n * h) where h is height |
| **Space** | O(h) for recursion stack |

## Intuition
To print all root-to-leaf paths, we use DFS to explore each path from root to leaf. We maintain a current path list and add/remove nodes as we traverse (backtracking). When we reach a leaf node, we add a copy of the current path to the result.

The key is to backtrack (remove the last node) after exploring both subtrees to maintain the correct path for other branches.

## Approach
1. Use DFS with a current path list
2. Add current node to path
3. If leaf node, add path to result
4. Recurse on left and right subtrees
5. Remove current node from path (backtrack)

## Brute Force
### Approach
We could collect all paths in a list, but the backtracking approach is space-efficient as it reuses the same path list.

## Optimized Solution
### Code
**Python**
```python
'''
class Node:
    def __init__(self,val):
        self.data = val
        self.left = None
        self.right = None
'''

class Solution:
    def Paths(self, root):
        result = []
        path = []
        
        def dfs(node):
            if not node:
                return
            
            path.append(node.data)
            
            # If leaf node, add path to result
            if not node.left and not node.right:
                result.append(path.copy())
            else:
                dfs(node.left)
                dfs(node.right)
            
            path.pop()  # Backtrack
        
        dfs(root)
        return result
```

**C++**
```cpp
/*
struct Node {
    int data;
    Node *left;
    Node *right;
};
*/

class Solution {
  public:
    void dfs(Node* node, vector<int>& path, vector<vector<int>>& result) {
        if (!node) return;
        
        path.push_back(node->data);
        
        if (!node->left && !node->right) {
            result.push_back(path);
        } else {
            dfs(node->left, path, result);
            dfs(node->right, path, result);
        }
        
        path.pop_back();  // Backtrack
    }
    
    vector<vector<int>> Paths(Node *root) {
        vector<vector<int>> result;
        vector<int> path;
        dfs(root, path, result);
        return result;
    }
};
```

### Complexity
- **Time Complexity:** O(n * h) - Visit each node once, copy path of length h at each leaf
- **Space Complexity:** O(h) - Recursion stack and path list (h = height of tree)

## Key Insight
> Backtracking allows us to reuse a single path list - we add nodes before recursion and remove them after, ensuring the path is correct for all branches.

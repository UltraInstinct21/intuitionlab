# 104. Maximum Depth of Binary Tree

> **Difficulty:** Medium | **Topic:** Binary Tree, DFS | **Platform:** LeetCode

---

## Problem Statement
Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

## Examples
**Example 1:**
```
Input: root = [3,9,20,null,null,15,7]
Output: 3
```

**Example 2:**
```
Input: root = [1,null,2]
Output: 2
```

## Constraints
- The number of nodes in the tree is in the range [0, 10^4]
- -100 <= Node.val <= 100

## Topic Tags
`Tree` `Depth-First Search` `Breadth-First Search` `Binary Tree`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(h) where h is height of tree |

## Intuition
The maximum depth of a binary tree can be found by recursively finding the maximum depth of the left and right subtrees, then taking the maximum of both and adding 1 (for the current node). This is a classic recursive problem where the base case is when the node is null, returning 0.

## Approach
1. Base case: if root is null, return 0
2. Recursively find the maximum depth of the left subtree
3. Recursively find the maximum depth of the right subtree
4. Return the maximum of left and right depths plus 1

## Brute Force
### Approach
Use DFS recursion to traverse the entire tree and keep track of the maximum depth found.

### Code
**Python**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxDepth(self, root: TreeNode) -> int:
        if not root:
            return 0
        
        left_depth = self.maxDepth(root.left)
        right_depth = self.maxDepth(root.right)
        
        return max(left_depth, right_depth) + 1
```

**C++**
```cpp
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        
        int leftDepth = maxDepth(root->left);
        int rightDepth = maxDepth(root->right);
        
        return max(leftDepth, rightDepth) + 1;
    }
};
```

### Complexity
- **Time:** O(n) where n is the number of nodes
- **Space:** O(h) where h is the height of the tree (recursion stack)

## Optimized Solution
### Code
**Python**
```python
from collections import deque

class Solution:
    def maxDepth(self, root: TreeNode) -> int:
        if not root:
            return 0
        
        queue = deque([root])
        depth = 0
        
        while queue:
            depth += 1
            level_size = len(queue)
            
            for _ in range(level_size):
                node = queue.popleft()
                
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
        
        return depth
```

**C++**
```cpp
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        
        queue<TreeNode*> q;
        q.push(root);
        int depth = 0;
        
        while (!q.empty()) {
            depth++;
            int levelSize = q.size();
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
        }
        
        return depth;
    }
};
```

### Complexity
- **Time:** O(n) where n is the number of nodes
- **Space:** O(n) for the queue (at most n/2 nodes at the last level)

## Key Insight
> The maximum depth of a tree is 1 + maximum of the depths of its left and right subtrees, which can be elegantly solved with recursion.
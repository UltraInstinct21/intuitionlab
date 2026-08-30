# 100. Same Tree

> **Difficulty:** Medium | **Topic:** Binary Tree, DFS | **Platform:** LeetCode

---

## Problem Statement
Given the roots of two binary trees p and q, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical and the nodes have the same value.

## Examples
**Example 1:**
```
Input: p = [1,2,3], q = [1,2,3]
Output: true
```

**Example 2:**
```
Input: p = [1,2], q = [1,null,2]
Output: false
```

**Example 3:**
```
Input: p = [1,2,1], q = [1,1,2]
Output: false
```

## Constraints
- The number of nodes in both trees is in the range [0, 100]
- -10^4 <= Node.val <= 10^4

## Topic Tags
`Tree` `Depth-First Search` `Breadth-First Search` `Binary Tree`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(h) where h is height of tree |

## Intuition
Two trees are identical if they have the same structure and the same values at each node. We can use DFS to traverse both trees simultaneously and compare nodes at each position.

## Approach
1. If both nodes are null, return true
2. If one node is null and the other is not, return false
3. If the values of the nodes are different, return false
4. Recursively check if the left subtrees are identical
5. Recursively check if the right subtrees are identical
6. Return true only if both left and right subtrees are identical

## Brute Force
### Approach
Use DFS to traverse both trees and compare nodes at each position.

### Code
**Python**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isSameTree(self, p: TreeNode, q: TreeNode) -> bool:
        if not p and not q:
            return True
        
        if not p or not q:
            return False
        
        if p.val != q.val:
            return False
        
        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
```

**C++**
```cpp
class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if (!p && !q) return true;
        
        if (!p || !q) return false;
        
        if (p->val != q->val) return false;
        
        return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
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
    def isSameTree(self, p: TreeNode, q: TreeNode) -> bool:
        queue = deque([(p, q)])
        
        while queue:
            node1, node2 = queue.popleft()
            
            if not node1 and not node2:
                continue
            
            if not node1 or not node2:
                return False
            
            if node1.val != node2.val:
                return False
            
            queue.append((node1.left, node2.left))
            queue.append((node1.right, node2.right))
        
        return True
```

**C++**
```cpp
class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        queue<pair<TreeNode*, TreeNode*>> q;
        q.push({p, q});
        
        while (!q.empty()) {
            auto [node1, node2] = q.front();
            q.pop();
            
            if (!node1 && !node2) continue;
            
            if (!node1 || !node2) return false;
            
            if (node1->val != node2->val) return false;
            
            q.push({node1->left, node2->left});
            q.push({node1->right, node2->right});
        }
        
        return true;
    }
};
```

### Complexity
- **Time:** O(n) where n is the number of nodes
- **Space:** O(n) for the queue (at most n/2 nodes at the last level)

## Key Insight
> Two trees are identical if they have the same structure and the same values at each node, which can be checked with a simultaneous DFS traversal.
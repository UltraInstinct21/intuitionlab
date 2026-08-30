# 236. Lowest Common Ancestor of a Binary Tree

> **Difficulty:** Hard | **Topic:** Binary Tree, DFS | **Platform:** LeetCode

---

## Problem Statement
Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree. According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself)."

## Examples
**Example 1:**
```
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
Output: 3
Explanation: The LCA of nodes 5 and 1 is 3.
```

**Example 2:**
```
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
Output: 5
Explanation: The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself.
```

## Constraints
- The number of nodes in the tree is in the range [2, 10^5]
- -10^9 <= Node.val <= 10^9
- All Node.val are unique
- p != q
- p and q will exist in the tree

## Topic Tags
`Tree` `Depth-First Search` `Binary Tree`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(h) where h is height of tree |

## Intuition
The lowest common ancestor of two nodes p and q is the deepest node that has both p and q as descendants. We can use DFS to traverse the tree and find the LCA. If we find either p or q at a node, we return that node. If both left and right subtrees return non-null values, then the current node is the LCA.

## Approach
1. Use DFS to traverse the tree
2. If the current node is null, return null
3. If the current node is p or q, return the current node
4. Recursively search in the left and right subtrees
5. If both left and right return non-null values, current node is LCA
6. Otherwise, return the non-null value (either left or right)

## Brute Force
### Approach
Find the path from root to p and the path from root to q, then find the last common node in both paths.

### Code
**Python**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
        def find_path(node, target, path):
            if not node:
                return False
            
            path.append(node)
            
            if node == target:
                return True
            
            if find_path(node.left, target, path) or find_path(node.right, target, path):
                return True
            
            path.pop()
            return False
        
        path_p = []
        path_q = []
        
        find_path(root, p, path_p)
        find_path(root, q, path_q)
        
        lca = None
        for i in range(min(len(path_p), len(path_q))):
            if path_p[i] == path_q[i]:
                lca = path_p[i]
            else:
                break
        
        return lca
```

**C++**
```cpp
class Solution {
public:
    bool findPath(TreeNode* node, TreeNode* target, vector<TreeNode*>& path) {
        if (!node) return false;
        
        path.push_back(node);
        
        if (node == target) return true;
        
        if (findPath(node->left, target, path) || findPath(node->right, target, path)) {
            return true;
        }
        
        path.pop_back();
        return false;
    }
    
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        vector<TreeNode*> pathP, pathQ;
        
        findPath(root, p, pathP);
        findPath(root, q, pathQ);
        
        TreeNode* lca = nullptr;
        for (int i = 0; i < min(pathP.size(), pathQ.size()); i++) {
            if (pathP[i] == pathQ[i]) {
                lca = pathP[i];
            } else {
                break;
            }
        }
        
        return lca;
    }
};
```

### Complexity
- **Time:** O(n) where n is the number of nodes
- **Space:** O(n) for storing paths

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
        if not root or root == p or root == q:
            return root
        
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        
        if left and right:
            return root
        
        return left if left else right
```

**C++**
```cpp
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root || root == p || root == q) {
            return root;
        }
        
        TreeNode* left = lowestCommonAncestor(root->left, p, q);
        TreeNode* right = lowestCommonAncestor(root->right, p, q);
        
        if (left && right) {
            return root;
        }
        
        return left ? left : right;
    }
};
```

### Complexity
- **Time:** O(n) where n is the number of nodes
- **Space:** O(h) where h is the height of the tree (recursion stack)

## Key Insight
> If both left and right subtrees return non-null values, the current node is the LCA; otherwise, return the non-null subtree.
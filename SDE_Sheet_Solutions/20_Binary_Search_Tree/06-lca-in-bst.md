# 235. Lowest Common Ancestor of a Binary Search Tree

> **Difficulty:** Medium | **Topic:** Binary Search Tree, LCA, Tree | **Platform:** LeetCode

---

## Problem Statement
Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.

According to the [definition of LCA on Wikipedia](https://en.wikipedia.org/wiki/Lowest_common_ancestor): "The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in the tree that has both `p` and `q` as descendants (where we allow **a node to be a descendant of itself**)."

## Examples
**Example 1:**
```
Input: root = [6,2,8,0,4,7,9,null,null,null,3,5], p = 2, q = 8
Output: 6
Explanation: The LCA of nodes 2 and 8 is 6.
        6
       / \
      2   8
     / \ / \
    0  4 7  9
      / \
     3   5
```

**Example 2:**
```
Input: root = [6,2,8,0,4,7,9,null,null,null,3,5], p = 2, q = 4
Output: 2
Explanation: The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself.
```

## Constraints
- The number of nodes in the tree is in the range `[2, 10^5]`
- `-10^9 <= Node.val <= 10^9`
- All `Node.val` are **unique**
- `p != q`
- `p` and `q` will exist in the BST

## Topic Tags
`Binary Search Tree` `Tree` `LCA` `Recursion` `Iterative`

## Expected Complexities
| | |
|---|---|
| **Time** | O(H) where H is the height of the tree |
| **Space** | O(1) iterative, O(H) recursive |

## Intuition
In a BST, for any two nodes p and q, their LCA is the first node where the paths to p and q diverge. Since BST has the property that left < root < right:
- If both p and q are smaller than current node, LCA is in the left subtree.
- If both p and q are greater than current node, LCA is in the right subtree.
- If p and q are on different sides (or one equals current), then current node is the LCA.

This is similar to binary search - we can eliminate half the tree at each step.

## Approach
1. Start at the root.
2. If both p and q are less than current node, move to left child.
3. If both p and q are greater than current node, move to right child.
4. Otherwise, we've found the split point - return current node.

This works because the LCA is the deepest node where p and q are in different subtrees (or one is the node itself).

## Brute Force
### Approach
Treat the BST as a regular binary tree and use the standard LCA algorithm with recursion. Check if current node is p or q, then recursively search left and right. If both sides return non-null, current is LCA.
### Code
**Python**
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
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
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root || root == p || root == q)
            return root;
        
        TreeNode* left = lowestCommonAncestor(root->left, p, q);
        TreeNode* right = lowestCommonAncestor(root->right, p, q);
        
        if (left && right)
            return root;
        
        return left ? left : right;
    }
};
```
### Complexity
- Time: O(N) - may visit all nodes in worst case
- Space: O(H) - recursion stack

## Optimized Solution
### Code
**Python**
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        current = root
        
        while current:
            if p.val < current.val and q.val < current.val:
                current = current.left
            elif p.val > current.val and q.val > current.val:
                current = current.right
            else:
                return current
        
        return None
```

**C++**
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        TreeNode* current = root;
        
        while (current) {
            if (p->val < current->val && q->val < current->val) {
                current = current->left;
            } else if (p->val > current->val && q->val > current->val) {
                current = current->right;
            } else {
                return current;
            }
        }
        
        return nullptr;
    }
};
```
### Complexity
- Time: O(H) - traverse at most the height of the tree
- Space: O(1) - no extra space needed

## Key Insight
> In a BST, the LCA is the first node where the paths to p and q diverge. Since BST property ensures left < root < right, we can use this to navigate directly to the LCA in O(H) time without visiting unnecessary nodes.

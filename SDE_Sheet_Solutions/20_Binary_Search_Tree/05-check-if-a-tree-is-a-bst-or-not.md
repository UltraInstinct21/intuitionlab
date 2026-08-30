# 98. Validate Binary Search Tree

> **Difficulty:** Medium | **Topic:** Binary Search Tree, DFS, Recursion | **Platform:** LeetCode

---

## Problem Statement
Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).

A **valid BST** is defined as follows:
- The left subtree of a node contains only nodes with keys **less than** the node's key.
- The right subtree of a node contains only nodes with keys **greater than** the node's key.
- Both the left and right subtrees must also be binary search trees.

## Examples
**Example 1:**
```
Input: root = [2,1,3]
Output: true
    2
   / \
  1   3
```

**Example 2:**
```
Input: root = [5,1,4,null,null,3,6]
Output: false
    5
   / \
  1   4
     / \
    3   6
Explanation: The root node's value is 5 but its right child's value is 4.
```

## Constraints
- The number of nodes in the tree is in the range `[1, 10^4]`
- `-2^31 <= Node.val <= 2^31 - 1`

## Topic Tags
`Binary Search Tree` `Tree` `DFS` `Recursion` `BST Validation`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N) |
| **Space** | O(H) where H is the height of the tree |

## Intuition
To validate a BST, we need to ensure that every node follows the BST property. The key insight is that each node must not only be greater than its left child and less than its right child, but must also be within a valid range determined by all its ancestors. We can pass down (min, max) bounds through recursion to check this.

Simply comparing each node with its immediate children is insufficient - we need to verify the entire range constraint inherited from ancestors.

## Approach
**Approach 1: Recursive with Bounds**
1. Start with the root and bounds of (-∞, +∞).
2. For each node, check if its value is within bounds.
3. Recurse on left child with updated upper bound (current value).
4. Recurse on right child with updated lower bound (current value).

**Approach 2: Inorder Traversal**
1. Perform an inorder traversal of the BST.
2. In a valid BST, inorder traversal should produce a strictly increasing sequence.
3. Check if each element is greater than the previous one.

**Approach 3: Iterative with Stack**
1. Use a stack for iterative inorder traversal.
2. Track the previously visited node.
3. Ensure current node's value is greater than previous.

## Brute Force
### Approach
Compare each node with all nodes in its left and right subtrees. This is O(N^2) in worst case.
### Code
**Python**
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def get_min(node):
            while node.left:
                node = node.left
            return node.val
        
        def get_max(node):
            while node.right:
                node = node.right
            return node.val
        
        if not root:
            return True
        
        if root.left:
            if root.val <= get_max(root.left):
                return False
        
        if root.right:
            if root.val >= get_min(root.right):
                return False
        
        return self.isValidBST(root.left) and self.isValidBST(root.right)
```

**C++**
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    int getMin(TreeNode* node) {
        while (node->left) node = node->left;
        return node->val;
    }
    
    int getMax(TreeNode* node) {
        while (node->right) node = node->right;
        return node->val;
    }
    
    bool isValidBST(TreeNode* root) {
        if (!root) return true;
        
        if (root->left && root->val <= getMax(root->left))
            return false;
        
        if (root->right && root->val >= getMin(root->right))
            return false;
        
        return isValidBST(root->left) && isValidBST(root->right);
    }
};
```
### Complexity
- Time: O(N^2) worst case (skewed tree)
- Space: O(H) recursion stack

## Optimized Solution
### Code
**Python**
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def validate(node, min_val, max_val):
            if not node:
                return True
            
            if node.val <= min_val or node.val >= max_val:
                return False
            
            return (validate(node.left, min_val, node.val) and 
                    validate(node.right, node.val, max_val))
        
        return validate(root, float('-inf'), float('inf'))
```

**C++**
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    bool validate(TreeNode* node, long minVal, long maxVal) {
        if (!node) return true;
        
        if (node->val <= minVal || node->val >= maxVal)
            return false;
        
        return validate(node->left, minVal, node->val) && 
               validate(node->right, node->val, maxVal);
    }
    
    bool isValidBST(TreeNode* root) {
        return validate(root, LONG_MIN, LONG_MAX);
    }
};
```
### Complexity
- Time: O(N) - visit each node once
- Space: O(H) - recursion stack depth

## Key Insight
> Each node must satisfy the BST property not just with its immediate children, but with all its ancestors. By passing down min/max bounds from parent nodes, we can validate the entire tree in a single O(N) pass.

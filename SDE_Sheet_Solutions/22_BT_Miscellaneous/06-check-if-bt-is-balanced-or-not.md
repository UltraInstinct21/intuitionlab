# Balanced Binary Tree

> **Difficulty:** Medium | **Topic:** Binary Tree, Tree Height | **Platform:** LeetCode 110

---

## Problem Statement
Given a binary tree, determine if it is height-balanced. A height-balanced binary tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one.

## Examples
**Example 1:**
```
Input: [3,9,20,null,null,15,7]
    3
   / \
  9  20
    /  \
   15   7
Output: true
```

**Example 2:**
```
Input: [1,2,2,3,3,null,null,4,4]
       1
      / \
     2   2
    / \
   3   3
  / \
 4   4
Output: false
```

## Constraints
- The number of nodes in the tree is in the range [0, 5000]
- -10^4 ≤ Node.val ≤ 10^4

## Topic Tags
`Binary Tree` `Tree Height` `DFS` `Recursion`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(h) |

## Intuition
The key insight is that we can check balance while computing height. For each node, we need to know if left subtree is balanced, right subtree is balanced, and height difference is at most 1. We can return -1 to indicate unbalanced, which allows early termination.

## Approach
1. For each node, recursively check if left and right subtrees are balanced
2. If either subtree is unbalanced (returns -1), propagate -1 upward
3. If height difference > 1, return -1
4. Otherwise return the height of current node
5. At the end, check if root returned -1 or not

## Brute Force
### Approach
For each node, compute height of left and right subtrees and check if difference > 1.

### Code
**Python**
```python
class Solution:
    def height(self, node):
        if not node:
            return 0
        return 1 + max(self.height(node.left), self.height(node.right))
    
    def isBalanced(self, root):
        if not root:
            return True
        
        left_height = self.height(root.left)
        right_height = self.height(root.right)
        
        if abs(left_height - right_height) > 1:
            return False
        
        return self.isBalanced(root.left) and self.isBalanced(root.right)
```

**C++**
```cpp
class Solution {
public:
    int height(TreeNode* node) {
        if (!node) return 0;
        return 1 + max(height(node->left), height(node->right));
    }
    
    bool isBalanced(TreeNode* root) {
        if (!root) return true;
        
        int left_height = height(root->left);
        int right_height = height(root->right);
        
        if (abs(left_height - right_height) > 1)
            return false;
        
        return isBalanced(root->left) && isBalanced(root->right);
    }
};
```

### Complexity
- Time: O(n²) - For each node, we compute height which is O(n)
- Space: O(h) - Recursion stack

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def check(self, node):
        if not node:
            return 0
        
        left = self.check(node.left)
        if left == -1:
            return -1
        
        right = self.check(node.right)
        if right == -1:
            return -1
        
        if abs(left - right) > 1:
            return -1
        
        return 1 + max(left, right)
    
    def isBalanced(self, root):
        return self.check(root) != -1
```

**C++**
```cpp
class Solution {
public:
    int check(TreeNode* node) {
        if (!node) return 0;
        
        int left = check(node->left);
        if (left == -1) return -1;
        
        int right = check(node->right);
        if (right == -1) return -1;
        
        if (abs(left - right) > 1)
            return -1;
        
        return 1 + max(left, right);
    }
    
    bool isBalanced(TreeNode* root) {
        return check(root) != -1;
    }
};
```

### Complexity
- Time: O(n) - Single pass through tree
- Space: O(h) - Recursion stack height

## Key Insight
> By returning -1 for unbalanced subtrees, we can detect imbalance early and avoid redundant height calculations, achieving optimal O(n) time complexity.
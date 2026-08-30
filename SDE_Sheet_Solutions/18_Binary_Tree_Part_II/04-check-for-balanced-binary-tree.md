# 110. Balanced Binary Tree

> **Difficulty:** Medium | **Topic:** Binary Tree, DFS | **Platform:** LeetCode

---

## Problem Statement
Given a binary tree, determine if it is height-balanced. A height-balanced binary tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one.

## Examples
**Example 1:**
```
Input: root = [3,9,20,null,null,15,7]
Output: true
```

**Example 2:**
```
Input: root = [1,2,2,3,3,null,null,4,4]
Output: false
```

**Example 3:**
```
Input: root = []
Output: true
```

## Constraints
- The number of nodes in the tree is in the range [0, 5000]
- -10^4 <= Node.val <= 10^4

## Topic Tags
`Tree` `Depth-First Search` `Binary Tree`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(h) where h is height of tree |

## Intuition
A tree is balanced if for every node, the height difference between its left and right subtrees is at most 1. We can use DFS to compute the height of each subtree while checking the balance condition. If we find any unbalanced node, we can return early.

## Approach
1. Use DFS to calculate the height of each subtree
2. For each node, check if the height difference between left and right subtrees is greater than 1
3. If unbalanced, return -1 to indicate imbalance
4. Otherwise, return the height of the current subtree

## Brute Force
### Approach
For each node, calculate the height of its left and right subtrees separately, then check if they differ by more than 1. This results in redundant height calculations.

### Code
**Python**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def height(self, node):
        if not node:
            return 0
        return max(self.height(node.left), self.height(node.right)) + 1
    
    def isBalanced(self, root: TreeNode) -> bool:
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
        return max(height(node->left), height(node->right)) + 1;
    }
    
    bool isBalanced(TreeNode* root) {
        if (!root) return true;
        
        int leftHeight = height(root->left);
        int rightHeight = height(root->right);
        
        if (abs(leftHeight - rightHeight) > 1) {
            return false;
        }
        
        return isBalanced(root->left) && isBalanced(root->right);
    }
};
```

### Complexity
- **Time:** O(n^2) in worst case (skewed tree)
- **Space:** O(h) where h is height of tree

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def isBalanced(self, root: TreeNode) -> bool:
        def check_height(node):
            if not node:
                return 0
            
            left_height = check_height(node.left)
            if left_height == -1:
                return -1
            
            right_height = check_height(node.right)
            if right_height == -1:
                return -1
            
            if abs(left_height - right_height) > 1:
                return -1
            
            return max(left_height, right_height) + 1
        
        return check_height(root) != -1
```

**C++**
```cpp
class Solution {
public:
    int checkHeight(TreeNode* node) {
        if (!node) return 0;
        
        int leftHeight = checkHeight(node->left);
        if (leftHeight == -1) return -1;
        
        int rightHeight = checkHeight(node->right);
        if (rightHeight == -1) return -1;
        
        if (abs(leftHeight - rightHeight) > 1) return -1;
        
        return max(leftHeight, rightHeight) + 1;
    }
    
    bool isBalanced(TreeNode* root) {
        return checkHeight(root) != -1;
    }
};
```

### Complexity
- **Time:** O(n) where n is the number of nodes
- **Space:** O(h) where h is the height of the tree (recursion stack)

## Key Insight
> Use a single DFS pass that returns -1 if unbalanced, otherwise returns the height; this avoids redundant height calculations.
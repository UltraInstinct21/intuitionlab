# 543. Diameter of Binary Tree

> **Difficulty:** Easy | **Topic:** Binary Tree, DFS | **Platform:** LeetCode

---

## Problem Statement
Given the root of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root. The length of a path between two nodes is represented by the number of edges between them.

## Examples
**Example 1:**
```
Input: root = [1,2,3,4,5]
Output: 3
Explanation: 3 is the length of the path [4,2,1,3] or [5,2,1,3].
```

**Example 2:**
```
Input: root = [1,2]
Output: 1
```

## Constraints
- The number of nodes in the tree is in the range [1, 10^4]
- -100 <= Node.val <= 100

## Topic Tags
`Tree` `Depth-First Search` `Binary Tree`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(h) where h is height of tree |

## Intuition
The diameter of a binary tree is the longest path between any two nodes. For each node, the longest path passing through it is the sum of the heights of its left and right subtrees. We can use DFS to compute the height of each subtree while simultaneously tracking the maximum diameter found.

## Approach
1. Initialize a variable to track the maximum diameter
2. Use DFS to calculate the height of each subtree
3. For each node, calculate the diameter passing through it (left height + right height)
4. Update the maximum diameter if current diameter is larger
5. Return the height of the current subtree (1 + max of left and right heights)

## Brute Force
### Approach
For each node, calculate the height of its left and right subtrees separately, then compute the diameter. This results in redundant calculations.

### Code
**Python**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def diameterOfBinaryTree(self, root: TreeNode) -> int:
        if not root:
            return 0
        
        def height(node):
            if not node:
                return 0
            return max(height(node.left), height(node.right)) + 1
        
        left_height = height(root.left)
        right_height = height(root.right)
        diameter_through_root = left_height + right_height
        
        left_diameter = self.diameterOfBinaryTree(root.left)
        right_diameter = self.diameterOfBinaryTree(root.right)
        
        return max(diameter_through_root, left_diameter, right_diameter)
```

**C++**
```cpp
class Solution {
public:
    int diameterOfBinaryTree(TreeNode* root) {
        if (!root) return 0;
        
        auto height = [](TreeNode* node) -> int {
            if (!node) return 0;
            return max(height(node->left), height(node->right)) + 1;
        };
        
        int leftHeight = height(root->left);
        int rightHeight = height(root->right);
        int diameterThroughRoot = leftHeight + rightHeight;
        
        int leftDiameter = diameterOfBinaryTree(root->left);
        int rightDiameter = diameterOfBinaryTree(root->right);
        
        return max({diameterThroughRoot, leftDiameter, rightDiameter});
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
    def diameterOfBinaryTree(self, root: TreeNode) -> int:
        self.diameter = 0
        
        def height(node):
            if not node:
                return 0
            
            left_height = height(node.left)
            right_height = height(node.right)
            
            # Update diameter if path through current node is longer
            self.diameter = max(self.diameter, left_height + right_height)
            
            return max(left_height, right_height) + 1
        
        height(root)
        return self.diameter
```

**C++**
```cpp
class Solution {
public:
    int diameter = 0;
    
    int height(TreeNode* node) {
        if (!node) return 0;
        
        int leftHeight = height(node->left);
        int rightHeight = height(node->right);
        
        // Update diameter if path through current node is longer
        diameter = max(diameter, leftHeight + rightHeight);
        
        return max(leftHeight, rightHeight) + 1;
    }
    
    int diameterOfBinaryTree(TreeNode* root) {
        height(root);
        return diameter;
    }
};
```

### Complexity
- **Time:** O(n) where n is the number of nodes
- **Space:** O(h) where h is the height of the tree (recursion stack)

## Key Insight
> The diameter through any node is the sum of the heights of its left and right subtrees; compute heights in a single DFS pass while tracking the maximum diameter.
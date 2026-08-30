# 545. Boundary of Binary Tree

> **Difficulty:** Medium | **Topic:** Binary Tree, DFS | **Platform:** LeetCode

---

## Problem Statement
Given a binary tree, return the values of its boundary in anti-clockwise direction starting from the root. The boundary includes left boundary, leaves, and right boundary in order without duplicate nodes. The left boundary is defined as the path from the root to the left-most node. The right boundary is defined as the path from the root to the right-most node. If the root doesn't have left subtree or right subtree, then the root itself is the left boundary or right boundary. Note: Left boundary means path from root to the left-most node NOT the left-most node of left subtree.

## Examples
**Example 1:**
```
Input: root = [1,null,2,3,4]
Output: [1,3,4,2]
Explanation:
The left boundary is node 1 itself.
The right boundary is node 2 itself.
The leaves are nodes 3 and 4.
So the boundary is [1,3,4,2].
```

**Example 2:**
```
Input: root = [1,2,3,4,5,6,null,null,null,7,8,9,10]
Output: [1,2,4,7,8,9,10,6,3]
Explanation:
The left boundary is node 1 -> node 2 -> node 4.
The leaves are node 7, node 8, node 9, node 10.
The right boundary is node 1 -> node 3 -> node 6.
The boundary is [1,2,4,7,8,9,10,6,3].
```

## Constraints
- The number of nodes in the tree is in the range [1, 10^4]
- -1000 <= Node.val <= 1000

## Topic Tags
`Tree` `Depth-First Search` `Binary Tree`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(h) where h is height of tree |

## Intuition
The boundary of a binary tree consists of three parts: the left boundary (excluding leaves), the leaves (from left to right), and the right boundary (excluding leaves, in reverse order). We need to traverse these three parts separately and combine them.

## Approach
1. Add the root to the result (if it's not a leaf)
2. Traverse the left boundary (excluding leaves) from top to bottom
3. Traverse all leaves from left to right
4. Traverse the right boundary (excluding leaves) from bottom to top
5. Combine all parts while avoiding duplicates

## Brute Force
### Approach
Use DFS to traverse the entire tree and collect nodes that are part of the boundary. We need to check if a node is on the left boundary, right boundary, or is a leaf.

### Code
**Python**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def boundaryOfBinaryTree(self, root: TreeNode) -> list[int]:
        if not root:
            return []
        
        if not root.left and not root.right:
            return [root.val]
        
        result = [root.val]
        
        # Left boundary (excluding leaves)
        left_boundary = []
        node = root.left
        while node:
            if node.left or node.right:
                left_boundary.append(node.val)
            if node.left:
                node = node.left
            else:
                node = node.right
        
        # Leaves
        leaves = []
        def get_leaves(node):
            if not node:
                return
            if not node.left and not node.right:
                leaves.append(node.val)
                return
            get_leaves(node.left)
            get_leaves(node.right)
        
        get_leaves(root)
        
        # Right boundary (excluding leaves)
        right_boundary = []
        node = root.right
        while node:
            if node.left or node.right:
                right_boundary.append(node.val)
            if node.right:
                node = node.right
            else:
                node = node.left
        right_boundary.reverse()
        
        return result + left_boundary + leaves + right_boundary
```

**C++**
```cpp
class Solution {
public:
    vector<int> boundaryOfBinaryTree(TreeNode* root) {
        if (!root) return {};
        
        if (!root->left && !root->right) {
            return {root->val};
        }
        
        vector<int> result = {root->val};
        
        // Left boundary (excluding leaves)
        vector<int> leftBoundary;
        TreeNode* node = root->left;
        while (node) {
            if (node->left || node->right) {
                leftBoundary.push_back(node->val);
            }
            if (node->left) {
                node = node->left;
            } else {
                node = node->right;
            }
        }
        
        // Leaves
        vector<int> leaves;
        function<void(TreeNode*)> getLeaves = [&](TreeNode* node) {
            if (!node) return;
            if (!node->left && !node->right) {
                leaves.push_back(node->val);
                return;
            }
            getLeaves(node->left);
            getLeaves(node->right);
        };
        getLeaves(root);
        
        // Right boundary (excluding leaves)
        vector<int> rightBoundary;
        node = root->right;
        while (node) {
            if (node->left || node->right) {
                rightBoundary.push_back(node->val);
            }
            if (node->right) {
                node = node->right;
            } else {
                node = node->left;
            }
        }
        reverse(rightBoundary.begin(), rightBoundary.end());
        
        result.insert(result.end(), leftBoundary.begin(), leftBoundary.end());
        result.insert(result.end(), leaves.begin(), leaves.end());
        result.insert(result.end(), rightBoundary.begin(), rightBoundary.end());
        
        return result;
    }
};
```

### Complexity
- **Time:** O(n) where n is the number of nodes
- **Space:** O(h) where h is the height of the tree (recursion stack for leaves)

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def boundaryOfBinaryTree(self, root: TreeNode) -> list[int]:
        if not root:
            return []
        
        if not root.left and not root.right:
            return [root.val]
        
        result = [root.val]
        
        # Left boundary (excluding leaves)
        node = root.left
        while node:
            if node.left or node.right:
                result.append(node.val)
            node = node.left if node.left else node.right
        
        # Leaves
        def add_leaves(node):
            if not node:
                return
            if not node.left and not node.right:
                result.append(node.val)
                return
            add_leaves(node.left)
            add_leaves(node.right)
        
        add_leaves(root)
        
        # Right boundary (excluding leaves, in reverse)
        right_boundary = []
        node = root.right
        while node:
            if node.left or node.right:
                right_boundary.append(node.val)
            node = node.right if node.right else node.left
        
        result.extend(reversed(right_boundary))
        
        return result
```

**C++**
```cpp
class Solution {
public:
    vector<int> boundaryOfBinaryTree(TreeNode* root) {
        if (!root) return {};
        
        if (!root->left && !root->right) {
            return {root->val};
        }
        
        vector<int> result = {root->val};
        
        // Left boundary (excluding leaves)
        TreeNode* node = root->left;
        while (node) {
            if (node->left || node->right) {
                result.push_back(node->val);
            }
            node = node->left ? node->left : node->right;
        }
        
        // Leaves
        function<void(TreeNode*)> addLeaves = [&](TreeNode* node) {
            if (!node) return;
            if (!node->left && !node->right) {
                result.push_back(node->val);
                return;
            }
            addLeaves(node->left);
            addLeaves(node->right);
        };
        addLeaves(root);
        
        // Right boundary (excluding leaves, in reverse)
        vector<int> rightBoundary;
        node = root->right;
        while (node) {
            if (node->left || node->right) {
                rightBoundary.push_back(node->val);
            }
            node = node->right ? node->right : node->left;
        }
        
        result.insert(result.end(), rightBoundary.rbegin(), rightBoundary.rend());
        
        return result;
    }
};
```

### Complexity
- **Time:** O(n) where n is the number of nodes
- **Space:** O(h) where h is the height of the tree (recursion stack for leaves)

## Key Insight
> The boundary consists of three parts: left boundary (top-down), leaves (left-right), and right boundary (bottom-up), each traversed separately.
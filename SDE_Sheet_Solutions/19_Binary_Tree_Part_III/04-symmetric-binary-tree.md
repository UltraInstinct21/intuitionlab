# 101. Symmetric Tree

> **Difficulty:** Medium | **Topic:** Binary Tree, BFS, DFS | **Platform:** LeetCode

---

## Problem Statement
Given the `root` of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).

## Examples
**Example 1:**
```
Input: root = [1,2,2,3,4,4,3]
Output: true
```

**Example 2:**
```
Input: root = [1,2,2,null,3,null,3]
Output: false
```

## Constraints
- The number of nodes in the tree is in the range `[1, 1000]`.
- `-100 <= Node.val <= 100`

## Topic Tags
`Binary Tree` `Breadth-First Search` `Depth-First Search`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(h) |

## Intuition
A tree is symmetric if its left subtree is a mirror reflection of its right subtree. Two trees are mirrors if:
1. Their root values are equal.
2. The left child of one is a mirror of the right child of the other.
3. The right child of one is a mirror of the left child of the other.

## Approach
1. A tree is symmetric if and only if it is a mirror of itself.
2. Use a helper function `isMirror(node1, node2)` that checks if two trees are mirror images.
3. The base case: both nodes are null → true; one is null → false.
4. Recursively check: values match, left of node1 mirrors right of node2, and right of node1 mirrors left of node2.

## Brute Force
### Approach
Use BFS (level-order traversal) and check if each level is a palindrome.

### Complexity
- **Time:** O(n) — visit each node once.
- **Space:** O(n) — queue can hold up to n/2 nodes at the last level.

## Optimized Solution
### Code
**Python**
```python
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        def isMirror(left, right):
            if not left and not right:
                return True
            if not left or not right:
                return False
            return (left.val == right.val
                    and isMirror(left.left, right.right)
                    and isMirror(left.right, right.left))

        return isMirror(root.left, root.right) if root else True
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
    bool isMirror(TreeNode* left, TreeNode* right) {
        if (!left && !right) return true;
        if (!left || !right) return false;
        return (left->val == right->val
                && isMirror(left->left, right->right)
                && isMirror(left->right, right->left));
    }

    bool isSymmetric(TreeNode* root) {
        if (!root) return true;
        return isMirror(root->left, root->right);
    }
};
```

### Complexity
- **Time:** O(n) — each node is visited once.
- **Space:** O(h) — recursion stack depth equals tree height.

## Key Insight
> Symmetry is a property of two trees being mirrors of each other. By recursively comparing the outer and inner children of left and right subtrees, we can determine symmetry in a single traversal.

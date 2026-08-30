# 114. Flatten Binary Tree to Linked List

> **Difficulty:** Medium | **Topic:** Binary Tree, Linked List, DFS | **Platform:** LeetCode

---

## Problem Statement
Given the `root` of a binary tree, flatten the tree into a "linked list":
- The "linked list" should use the same `TreeNode` class where the `right` child pointer points to the next node in the list and the `left` child pointer is always `null`.
- The "linked list" should be in the same order as a **preorder traversal** of the binary tree.

## Examples
**Example 1:**
```
Input: root = [1,2,5,3,4,null,6]
Output: [1,null,2,null,3,null,4,null,5,null,6]
```

**Example 2:**
```
Input: root = []
Output: []
```

**Example 3:**
```
Input: root = [0]
Output: [0]
```

## Constraints
- The number of nodes in the tree is in the range `[0, 2000]`.
- `-100 <= Node.val <= 100`

## Topic Tags
`Binary Tree` `Linked List` `Depth-First Search` `Stack`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(h) |

## Intuition
We need to rearrange the tree so that each node's right pointer points to the next node in preorder sequence. The trick is to use the rightmost node of the left subtree to link with the right subtree. This avoids using extra space for a linked list.

## Approach
1. For each node, if it has a left subtree:
   - Find the rightmost node of the left subtree.
   - Connect the rightmost node's right pointer to the current node's right subtree.
   - Move the left subtree to the right side.
   - Set the left pointer to null.
2. Move to the next node (which is now the right child).
3. Repeat until all nodes are processed.

## Brute Force
### Approach
Store the preorder traversal in an array, then rebuild the tree as a right-skewed tree from the array.

### Complexity
- **Time:** O(n) — two passes through the tree.
- **Space:** O(n) — for storing the preorder traversal.

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
    def flatten(self, root: Optional[TreeNode]) -> None:
        """
        Do not return anything, modify root in-place instead.
        """
        curr = root
        while curr:
            if curr.left:
                # Find rightmost node in left subtree
                runner = curr.left
                while runner.right:
                    runner = runner.right
                runner.right = curr.right
                curr.right = curr.left
                curr.left = None
            curr = curr.right
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
    void flatten(TreeNode* root) {
        TreeNode* curr = root;
        while (curr) {
            if (curr->left) {
                TreeNode* runner = curr->left;
                while (runner->right) {
                    runner = runner->right;
                }
                runner->right = curr->right;
                curr->right = curr->left;
                curr->left = nullptr;
            }
            curr = curr->right;
        }
    }
};
```

### Complexity
- **Time:** O(n) — each node is visited once; the runner moves at most O(n) total.
- **Space:** O(1) — constant extra space, in-place modification.

## Key Insight
> For each node with a left child, the rightmost node of that left subtree becomes the bridge to the right subtree. This lets us move the entire left subtree to the right side without any extra space.

# 144. Binary Tree Preorder Traversal

> **Difficulty:** Easy | **Topic:** Binary Tree, DFS | **Platform:** LeetCode

---

## Problem Statement
Given the `root` of a binary tree, return the preorder traversal of its nodes' values.

Preorder traversal visits nodes in the order: Root → Left → Right.

## Examples
**Example 1:**
```
Input: root = [1,null,2,3]
Output: [1,2,3]
```

**Example 2:**
```
Input: root = []
Output: []
```

**Example 3:**
```
Input: root = [1]
Output: [1]
```

## Constraints
- The number of nodes in the tree is in the range `[0, 100]`
- `-100 <= Node.val <= 100`

## Topic Tags
`Stack` `Tree` `Depth-First Search` `Binary Tree`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(h) where h is height of tree |

## Intuition
Preorder traversal is useful for creating a copy of the tree or for prefix expression evaluation. The key idea is to process the current node first, then recursively visit the left subtree, and finally visit the right subtree.

For the iterative approach, we use a stack but in reverse order - we push the right child first, then the left child, so that the left child is processed first (LIFO property).

## Approach
1. **Recursive Approach:**
   - Base case: if node is None, return
   - Add current node's value to result
   - Recursively call preorder on left child
   - Recursively call preorder on right child

2. **Iterative Approach:**
   - Use a stack initialized with root
   - Pop from stack, process the node
   - Push right child first, then left child (so left is processed first)

## Brute Force
### Approach
The recursive solution is already optimal for this problem. No brute force needed beyond the standard approach.

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
    def preorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        result = []
        
        def preorder(node):
            if not node:
                return
            result.append(node.val)
            preorder(node.left)
            preorder(node.right)
        
        preorder(root)
        return result
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
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> result;
        if (!root) return result;
        
        stack<TreeNode*> stk;
        stk.push(root);
        
        while (!stk.empty()) {
            TreeNode* node = stk.top();
            stk.pop();
            result.push_back(node->val);
            
            if (node->right) stk.push(node->right);
            if (node->left) stk.push(node->left);
        }
        
        return result;
    }
};
```

### Complexity
- **Time Complexity:** O(n) - Each node is visited exactly once
- **Space Complexity:** O(h) - Where h is the height of the tree (stack space)

## Key Insight
> Preorder traversal is essential for serializing a binary tree - it captures the tree structure in a way that allows reconstruction when combined with inorder traversal.

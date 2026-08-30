# 94. Binary Tree Inorder Traversal

> **Difficulty:** Easy | **Topic:** Binary Tree, DFS | **Platform:** LeetCode

---

## Problem Statement
Given the `root` of a binary tree, return the inorder traversal of its nodes' values.

Inorder traversal visits nodes in the order: Left → Root → Right.

## Examples
**Example 1:**
```
Input: root = [1,null,2,3]
Output: [1,3,2]
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
Inorder traversal is one of the three standard depth-first traversal methods for binary trees. The key idea is to recursively visit the left subtree first, then process the current node, and finally visit the right subtree. This gives us nodes in non-decreasing order for BSTs.

For the iterative approach, we use a stack to模拟 the recursive call stack. We push all left nodes onto the stack, then when we can't go left anymore, we pop from the stack, process the node, and move to its right child.

## Approach
1. **Recursive Approach:**
   - Base case: if node is None, return
   - Recursively call inorder on left child
   - Add current node's value to result
   - Recursively call inorder on right child

2. **Iterative Approach:**
   - Use a stack to keep track of nodes
   - Push all left children onto stack
   - When no more left children, pop from stack and process
   - Move to right child and repeat

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
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        result = []
        
        def inorder(node):
            if not node:
                return
            inorder(node.left)
            result.append(node.val)
            inorder(node.right)
        
        inorder(root)
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
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        stack<TreeNode*> stk;
        TreeNode* curr = root;
        
        while (curr || !stk.empty()) {
            while (curr) {
                stk.push(curr);
                curr = curr->left;
            }
            curr = stk.top();
            stk.pop();
            result.push_back(curr->val);
            curr = curr->right;
        }
        
        return result;
    }
};
```

### Complexity
- **Time Complexity:** O(n) - Each node is visited exactly once
- **Space Complexity:** O(h) - Where h is the height of the tree (stack space)

## Key Insight
> Inorder traversal of a BST always gives nodes in sorted (non-decreasing) order, making it useful for validating BSTs and extracting sorted data from tree structures.

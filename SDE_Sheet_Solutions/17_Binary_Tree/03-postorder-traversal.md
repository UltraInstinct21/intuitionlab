# 145. Binary Tree Postorder Traversal

> **Difficulty:** Easy | **Topic:** Binary Tree, DFS | **Platform:** LeetCode

---

## Problem Statement
Given the `root` of a binary tree, return the postorder traversal of its nodes' values.

Postorder traversal visits nodes in the order: Left → Right → Root.

## Examples
**Example 1:**
```
Input: root = [1,null,2,3]
Output: [3,2,1]
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
Postorder traversal is useful for deleting a tree or evaluating postfix expressions. The key idea is to recursively visit the left subtree first, then the right subtree, and finally process the current node.

For the iterative approach, we can use a modified preorder traversal (Root → Right → Left) and then reverse the result to get postorder (Left → Right → Root).

## Approach
1. **Recursive Approach:**
   - Base case: if node is None, return
   - Recursively call postorder on left child
   - Recursively call postorder on right child
   - Add current node's value to result

2. **Iterative Approach:**
   - Use modified preorder (Root → Right → Left)
   - Push root to stack
   - Pop, add to result, push left first then right
   - Reverse the result at the end

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
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        result = []
        
        def postorder(node):
            if not node:
                return
            postorder(node.left)
            postorder(node.right)
            result.append(node.val)
        
        postorder(root)
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
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> result;
        if (!root) return result;
        
        stack<TreeNode*> stk;
        stk.push(root);
        
        while (!stk.empty()) {
            TreeNode* node = stk.top();
            stk.pop();
            result.push_back(node->val);
            
            if (node->left) stk.push(node->left);
            if (node->right) stk.push(node->right);
        }
        
        reverse(result.begin(), result.end());
        return result;
    }
};
```

### Complexity
- **Time Complexity:** O(n) - Each node is visited exactly once
- **Space Complexity:** O(h) - Where h is the height of the tree (stack space)

## Key Insight
> Postorder traversal is crucial for deleting trees safely - children must be deleted before their parent to avoid memory leaks, and for evaluating expressions where operands come before operators.

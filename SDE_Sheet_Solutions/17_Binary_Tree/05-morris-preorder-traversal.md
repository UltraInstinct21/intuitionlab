# 144. Binary Tree Preorder Traversal (Morris Traversal)

> **Difficulty:** Hard | **Topic:** Binary Tree, Morris Traversal | **Platform:** LeetCode

---

## Problem Statement
Given the `root` of a binary tree, return the preorder traversal of its nodes' values using Morris Traversal algorithm which achieves O(1) space complexity.

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
`Binary Tree` `Morris Traversal` `Preorder` `O(1) Space`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

## Intuition
Morris Traversal for preorder is similar to inorder but with a key difference in when we process the node. For preorder, we process the node when we first encounter it (when creating the thread), not when we return to it.

The algorithm creates temporary threads from inorder predecessors back to current nodes. When we create a thread, we immediately process the current node (since in preorder we process root before children).

## Approach
1. Initialize current as root
2. While current is not NULL:
   - If current has no left child:
     - Add current's value to result
     - Move to right child
   - Else:
     - Find inorder predecessor (rightmost node in left subtree)
     - If predecessor's right is NULL:
       - Create thread: set predecessor's right to current
       - Add current's value to result (preorder: process before going left)
       - Move to left child
     - Else (predecessor's right is current):
       - Remove thread: set predecessor's right to NULL
       - Move to right child

## Brute Force
### Approach
The recursive or iterative approach using O(n) space is the standard solution. Morris traversal is the optimization.

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
        current = root
        
        while current:
            if not current.left:
                result.append(current.val)
                current = current.right
            else:
                # Find inorder predecessor
                predecessor = current.left
                while predecessor.right and predecessor.right != current:
                    predecessor = predecessor.right
                
                if not predecessor.right:
                    # Create thread and process node (preorder)
                    predecessor.right = current
                    result.append(current.val)
                    current = current.left
                else:
                    # Remove thread and move right
                    predecessor.right = None
                    current = current.right
        
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
        TreeNode* current = root;
        
        while (current) {
            if (!current->left) {
                result.push_back(current->val);
                current = current->right;
            } else {
                // Find inorder predecessor
                TreeNode* predecessor = current->left;
                while (predecessor->right && predecessor->right != current) {
                    predecessor = predecessor->right;
                }
                
                if (!predecessor->right) {
                    // Create thread and process node (preorder)
                    predecessor->right = current;
                    result.push_back(current->val);
                    current = current->left;
                } else {
                    // Remove thread and move right
                    predecessor->right = nullptr;
                    current = current->right;
                }
            }
        }
        
        return result;
    }
};
```

### Complexity
- **Time Complexity:** O(n) - Each node is visited at most twice
- **Space Complexity:** O(1) - No extra space used except for result array

## Key Insight
> In Morris preorder traversal, we process the node when creating the thread (first visit), whereas in inorder we process when removing the thread (second visit).

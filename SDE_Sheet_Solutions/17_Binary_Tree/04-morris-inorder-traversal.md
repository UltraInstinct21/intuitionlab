# 94. Binary Tree Inorder Traversal (Morris Traversal)

> **Difficulty:** Hard | **Topic:** Binary Tree, Morris Traversal | **Platform:** LeetCode

---

## Problem Statement
Given the `root` of a binary tree, return the inorder traversal of its nodes' values using Morris Traversal algorithm which achieves O(1) space complexity.

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
`Binary Tree` `Morris Traversal` `Inorder` `O(1) Space`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

## Intuition
Morris Traversal is an elegant algorithm that achieves O(1) space by temporarily modifying the tree structure. The key insight is to create temporary links from the inorder predecessor of a node back to the node itself. This allows us to return to a node after processing its left subtree without using a stack.

For inorder traversal, we find the inorder predecessor (rightmost node in left subtree) and create a thread from it back to the current node. When we encounter a node with no left child or a node whose left subtree has been fully processed (indicated by the thread), we process the node and move to its right child.

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
       - Move to left child
     - Else (predecessor's right is current):
       - Remove thread: set predecessor's right to NULL
       - Add current's value to result
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
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
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
                    # Create thread
                    predecessor.right = current
                    current = current.left
                else:
                    # Remove thread and process node
                    predecessor.right = None
                    result.append(current.val)
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
    vector<int> inorderTraversal(TreeNode* root) {
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
                    // Create thread
                    predecessor->right = current;
                    current = current->left;
                } else {
                    // Remove thread and process node
                    predecessor->right = nullptr;
                    result.push_back(current->val);
                    current = current->right;
                }
            }
        }
        
        return result;
    }
};
```

### Complexity
- **Time Complexity:** O(n) - Each node is visited at most twice (once to create thread, once to process)
- **Space Complexity:** O(1) - No extra space used except for result array

## Key Insight
> Morris Traversal temporarily modifies the tree by creating threads from inorder predecessors back to current nodes, allowing O(1) space traversal by avoiding explicit stack usage.

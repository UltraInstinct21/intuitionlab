# 700. Search in a Binary Search Tree

> **Difficulty:** Easy | **Topic:** Binary Search Tree, Search | **Platform:** LeetCode

---

## Problem Statement
You are given the `root` of a binary search tree (BST) and an integer `val`.

Find the node in the BST that the node's value equals `val` and return the subtree rooted with that node. If such a node does not exist, return `NULL`.

## Examples
**Example 1:**
```
Input: root = [4,2,7,1,3], val = 2
Output: [2,1,3]
```

**Example 2:**
```
Input: root = [4,2,7,1,3], val = 5
Output: []
```

## Constraints
- The number of nodes in the tree is in the range `[1, 5000]`
- `1 <= Node.val <= 10^7`
- `root` is a binary search tree
- All the values `Node.val` are **unique**

## Topic Tags
`Binary Search Tree` `Tree` `Recursion` `Iterative`

## Expected Complexities
| | |
|---|---|
| **Time** | O(H) where H is the height of the tree |
| **Space** | O(1) iterative, O(H) recursive |

## Intuition
In a BST, for any given node, all values in its left subtree are smaller and all values in its right subtree are larger. This property allows us to eliminate half of the remaining nodes at each step, similar to binary search. We simply compare the target value with the current node's value and go left or right accordingly.

## Approach
1. Start at the root node.
2. Compare the target value with the current node's value.
3. If equal, return the current node.
4. If target is less, move to the left child.
5. If target is greater, move to the right child.
6. If we reach NULL, the value doesn't exist; return NULL.

## Brute Force
### Approach
Treat the BST as a regular binary tree and use any traversal (inorder, preorder, or level-order) to search for the value. This ignores the BST property.
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
    def searchBST(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:
        if not root:
            return None
        
        # Level-order traversal (BFS) - ignores BST property
        queue = [root]
        
        while queue:
            node = queue.pop(0)
            
            if node.val == val:
                return node
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        return None
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
    TreeNode* searchBST(TreeNode* root, int val) {
        if (!root) return nullptr;
        
        // BFS - ignores BST property
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            TreeNode* node = q.front();
            q.pop();
            
            if (node->val == val) return node;
            
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        
        return nullptr;
    }
};
```
### Complexity
- Time: O(N) - may need to visit all nodes
- Space: O(N) - queue can hold up to N/2 nodes

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
    def searchBST(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:
        # Iterative approach using BST property
        while root and root.val != val:
            if val < root.val:
                root = root.left
            else:
                root = root.right
        
        return root
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
    TreeNode* searchBST(TreeNode* root, int val) {
        // Iterative approach using BST property
        while (root && root->val != val) {
            if (val < root->val) {
                root = root->left;
            } else {
                root = root->right;
            }
        }
        
        return root;
    }
};
```
### Complexity
- Time: O(H) - H is height of tree (O(log N) for balanced BST)
- Space: O(1) - no extra space needed

## Key Insight
> The BST property allows us to eliminate half the remaining nodes at each comparison, achieving O(H) time complexity similar to binary search on a sorted array.

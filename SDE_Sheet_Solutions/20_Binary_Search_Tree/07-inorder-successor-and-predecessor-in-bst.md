# 285. Inorder Successor in BST

> **Difficulty:** Medium | **Topic:** Binary Search Tree, Inorder Traversal, Successor/Predecessor | **Platform:** LeetCode

---

## Problem Statement
Given the `root` of a binary search tree and a node `p` in it, find the in-order successor of `p` in the BST. The successor of a node `p` is the node with the smallest key greater than `p.val`.

**Note:** This problem also covers finding the inorder predecessor (the largest key smaller than `p.val`).

## Examples
**Example 1:**
```
Input: root = [2,1,3], p = 1
Output: 2
Explanation: The inorder successor of node 1 is node 2.
    2
   / \
  1   3
```

**Example 2:**
```
Input: root = [5,3,6,2,4,null,null,1], p = 6
Output: null
Explanation: Node 6 has no inorder successor as it is the rightmost node.
        5
       / \
      3   6
     / \
    2   4
   /
  1
```

## Constraints
- The number of nodes in the tree is in the range `[1, 10^4]`
- `-10^5 <= Node.val <= 10^5`
- All Nodes will have **distinct** values

## Topic Tags
`Binary Search Tree` `Tree` `Inorder Traversal` `Successor` `Predecessor`

## Expected Complexities
| | |
|---|---|
| **Time** | O(H) where H is the height of the tree |
| **Space** | O(1) iterative, O(H) recursive |

## Intuition
In a BST, the inorder traversal visits nodes in ascending order. The inorder successor of a node p is the node that comes immediately after p in this sorted order.

**Key observations:**
1. If p has a right subtree, the successor is the leftmost (minimum) node in that right subtree.
2. If p has no right subtree, the successor is one of p's ancestors - specifically, the deepest ancestor for which p is in the left subtree.

We can find the successor by traversing from the root, keeping track of potential successors whenever we go left.

## Approach
**Finding Inorder Successor:**
1. If p has a right child, find the minimum node in p's right subtree.
2. Otherwise, start from root and traverse:
   - If current node's value > p's value, this could be the successor; move left.
   - If current node's value <= p's value, move right.
3. The last node where we went left is the successor.

**Finding Inorder Predecessor (bonus):**
1. If p has a left child, find the maximum node in p's left subtree.
2. Otherwise, start from root and traverse:
   - If current node's value < p's value, this could be the predecessor; move right.
   - If current node's value >= p's value, move left.

## Brute Force
### Approach
Perform a full inorder traversal of the BST and store all nodes in a list. Find the position of p and return the next node. This works but uses O(N) space and always O(N) time.
### Code
**Python**
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def inorderSuccessor(self, root: 'TreeNode', p: 'TreeNode') -> 'TreeNode':
        # Brute force: full inorder traversal
        result = []
        
        def inorder(node):
            if not node:
                return
            inorder(node.left)
            result.append(node)
            inorder(node.right)
        
        inorder(root)
        
        # Find p in the result and return next
        for i in range(len(result) - 1):
            if result[i].val == p.val:
                return result[i + 1]
        
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
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    void inorder(TreeNode* root, vector<TreeNode*>& result) {
        if (!root) return;
        inorder(root->left, result);
        result.push_back(root);
        inorder(root->right, result);
    }
    
    TreeNode* inorderSuccessor(TreeNode* root, TreeNode* p) {
        vector<TreeNode*> result;
        inorder(root, result);
        
        for (int i = 0; i < result.size() - 1; i++) {
            if (result[i]->val == p->val) {
                return result[i + 1];
            }
        }
        
        return nullptr;
    }
};
```
### Complexity
- Time: O(N) - traverse entire tree
- Space: O(N) - store all nodes in array

## Optimized Solution
### Code
**Python**
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def inorderSuccessor(self, root: 'TreeNode', p: 'TreeNode') -> 'TreeNode':
        successor = None
        current = root
        
        while current:
            if p.val < current.val:
                successor = current
                current = current.left
            else:
                current = current.right
        
        return successor
    
    def inorderPredecessor(self, root: 'TreeNode', p: 'TreeNode') -> 'TreeNode':
        predecessor = None
        current = root
        
        while current:
            if p.val > current.val:
                predecessor = current
                current = current.right
            else:
                current = current.left
        
        return predecessor
```

**C++**
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    TreeNode* inorderSuccessor(TreeNode* root, TreeNode* p) {
        TreeNode* successor = nullptr;
        TreeNode* current = root;
        
        while (current) {
            if (p->val < current->val) {
                successor = current;
                current = current->left;
            } else {
                current = current->right;
            }
        }
        
        return successor;
    }
    
    TreeNode* inorderPredecessor(TreeNode* root, TreeNode* p) {
        TreeNode* predecessor = nullptr;
        TreeNode* current = root;
        
        while (current) {
            if (p->val > current->val) {
                predecessor = current;
                current = current->right;
            } else {
                current = current->left;
            }
        }
        
        return predecessor;
    }
};
```
### Complexity
- Time: O(H) - traverse at most the height of the tree
- Space: O(1) - no extra space needed

## Key Insight
> The inorder successor of a node in a BST is either the minimum node in its right subtree (if it has one) or the deepest ancestor for which the node is in its left subtree. We can find this by traversing from the root, keeping track of potential candidates whenever we move left (for successor) or right (for predecessor).

# Kth Smallest Element in a BST

> **Difficulty:** Medium | **Topic:** Binary Search Tree, BST | **Platform:** LeetCode

---

## Problem Statement
Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.

## Examples
**Example 1:**
```
Input: root = [3,1,4,null,2], k = 1
    3
   / \
  1   4
   \
    2
Output: 1
```

**Example 2:**
```
Input: root = [5,3,6,2,4,null,null,1], k = 3
      5
     / \
    3   6
   / \
  2   4
 /
1
Output: 3
```

## Constraints
- The number of nodes in the tree is n.
- 1 ≤ k ≤ n ≤ 10^4
- 0 ≤ Node.val ≤ 10^4

## Topic Tags
`BST` `Tree` `Binary Search Tree` `DFS`

## Expected Complexities
| | |
|---|---|
| **Time** | O(H + k) where H is the height of the tree |
| **Space** | O(H) for recursion stack |

## Intuition
In a BST, an inorder traversal (Left → Root → Right) visits nodes in ascending sorted order. Therefore, the kth node visited during an inorder traversal is the kth smallest element.

We can optimize by stopping the traversal early once we've visited k nodes, rather than traversing the entire tree.

## Approach
1. Perform an inorder traversal of the BST.
2. Keep a counter of nodes visited.
3. When the counter reaches k, return that node's value.
4. Use early termination to avoid unnecessary traversal.

## Brute Force
### Approach
Perform a complete inorder traversal, collect all values in a sorted list, and return the (k-1)th index.

### Code
**Python**
```python
class Solution:
    def kthSmallest(self, root, k):
        result = []
        self.inorder(root, result)
        return result[k-1]

    def inorder(self, node, result):
        if not node:
            return
        self.inorder(node.left, result)
        result.append(node.val)
        self.inorder(node.right, result)
```

**C++**
```cpp
class Solution {
public:
    void inorder(TreeNode* root, vector<int>& result) {
        if (!root) return;
        inorder(root->left, result);
        result.push_back(root->val);
        inorder(root->right, result);
    }

    int kthSmallest(TreeNode* root, int k) {
        vector<int> result;
        inorder(root, result);
        return result[k-1];
    }
};
```

### Complexity
- **Time:** O(N) — Visits all nodes.
- **Space:** O(N) — To store all values.

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def kthSmallest(self, root, k):
        self.count = 0
        self.result = -1
        self.inorder(root, k)
        return self.result

    def inorder(self, node, k):
        if not node or self.count >= k:
            return
        self.inorder(node.left, k)
        self.count += 1
        if self.count == k:
            self.result = node.val
            return
        self.inorder(node.right, k)
```

**C++**
```cpp
class Solution {
public:
    int count = 0;
    int result = -1;

    void inorder(TreeNode* node, int k) {
        if (!node || count >= k) return;
        inorder(node->left, k);
        count++;
        if (count == k) {
            result = node->val;
            return;
        }
        inorder(node->right, k);
    }

    int kthSmallest(TreeNode* root, int k) {
        count = 0;
        result = -1;
        inorder(root, k);
        return result;
    }
};
```

### Complexity
- **Time:** O(H + k) — We traverse at most H nodes to reach the leftmost node, then k nodes.
- **Space:** O(H) — Recursion stack depth equals tree height.

## Key Insight
> Inorder traversal of BST yields sorted order; we stop early at the kth visit to achieve O(H + k) time instead of O(N).
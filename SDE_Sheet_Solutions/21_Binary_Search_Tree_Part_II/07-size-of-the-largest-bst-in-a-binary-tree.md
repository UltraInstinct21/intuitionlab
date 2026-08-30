# Largest BST

> **Difficulty:** Hard | **Topic:** Binary Search Tree, BST, Binary Tree | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a binary tree, find the largest subtree which is a Binary Search Tree (BST). The largest subtree means the subtree with the maximum number of nodes. Return the size (number of nodes) of the largest BST subtree.

## Examples
**Example 1:**
```
Input:
      5
     / \
    2   4
   / \
  1   3

Output: 3
Explanation: The subtree rooted at node 2 with nodes {1, 2, 3} is the largest BST subtree.
```

**Example 2:**
```
Input:
        50
       /  \
      30   60
     / \   / \
    5  20 45  70
              / \
             65  80

Output: 5
Explanation: The subtree rooted at 60 with nodes {45, 60, 65, 70, 80} is the largest BST subtree.
```

## Constraints
- 1 ≤ Number of Nodes ≤ 10^5
- 1 ≤ Data of a Node ≤ 10^6

## Topic Tags
`BST` `Binary Tree` `Recursion` `Dynamic Programming`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N) |
| **Space** | O(H) where H is the height of the tree |

## Intuition
For each node, we need to determine if the subtree rooted at that node is a BST. A subtree is a BST if:
1. The left subtree is a BST.
2. The right subtree is a BST.
3. The node's value is greater than the maximum value in the left subtree.
4. The node's value is less than the minimum value in the right subtree.

We can use a bottom-up approach where we return information from each subtree:
- Whether it's a BST
- The size of the subtree
- The minimum and maximum values in the subtree

This way, we can check the BST property at each node without redundant traversals.

## Approach
1. Use post-order traversal (process children before parent).
2. For each node, collect from left and right subtrees:
   - Is it a BST?
   - Size of subtree
   - Min and max values
3. Check if current node can form a BST with its children:
   - Left subtree must be BST
   - Right subtree must be BST
   - current->val > left_max
   - current->val < right_min
4. If valid BST, update the maximum size.
5. Return the subtree information to the parent.

## Brute Force
### Approach
For each node, check if the subtree rooted at that node is a BST by verifying BST property for all nodes in the subtree.

### Code
**Python**
```python
class Solution:
    def largestBst(self, root):
        self.max_size = 0
        self.check_all(root)
        return self.max_size

    def is_bst(self, node, min_val, max_val):
        if not node:
            return True
        if node.data <= min_val or node.data >= max_val:
            return False
        return (self.is_bst(node.left, min_val, node.data) and
                self.is_bst(node.right, node.data, max_val))

    def count_nodes(self, node):
        if not node:
            return 0
        return 1 + self.count_nodes(node.left) + self.count_nodes(node.right)

    def check_all(self, node):
        if not node:
            return
        if self.is_bst(node, float('-inf'), float('inf')):
            self.max_size = max(self.max_size, self.count_nodes(node))
        self.check_all(node.left)
        self.check_all(node.right)
```

**C++**
```cpp
class Solution {
public:
    int maxSize = 0;

    bool isBST(Node* node, long minVal, long maxVal) {
        if (!node) return true;
        if (node->data <= minVal || node->data >= maxVal) return false;
        return isBST(node->left, minVal, node->data) &&
               isBST(node->right, node->data, maxVal);
    }

    int countNodes(Node* node) {
        if (!node) return 0;
        return 1 + countNodes(node->left) + countNodes(node->right);
    }

    void checkAll(Node* node) {
        if (!node) return;
        if (isBST(node, LONG_MIN, LONG_MAX))
            maxSize = max(maxSize, countNodes(node));
        checkAll(node->left);
        checkAll(node->right);
    }

    int largestBst(Node* root) {
        maxSize = 0;
        checkAll(root);
        return maxSize;
    }
};
```

### Complexity
- **Time:** O(N^2) — For each node, we may traverse its entire subtree.
- **Space:** O(H) — Recursion stack.

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def largestBst(self, root):
        self.max_size = 0
        self.solve(root)
        return self.max_size

    def solve(self, node):
        if not node:
            return (True, 0, float('inf'), float('-inf'))

        left_is_bst, left_size, left_min, left_max = self.solve(node.left)
        right_is_bst, right_size, right_min, right_max = self.solve(node.right)

        if (left_is_bst and right_is_bst and
            node.data > left_max and node.data < right_min):
            current_size = left_size + right_size + 1
            self.max_size = max(self.max_size, current_size)
            return (True, current_size, min(left_min, node.data), max(right_max, node.data))

        return (False, 0, 0, 0)
```

**C++**
```cpp
class Solution {
public:
    int maxSize = 0;

    struct Info {
        bool isBST;
        int size;
        int minVal;
        int maxVal;
    };

    Info solve(Node* node) {
        if (!node)
            return {true, 0, INT_MAX, INT_MIN};

        Info left = solve(node->left);
        Info right = solve(node->right);

        if (left.isBST && right.isBST &&
            node->data > left.maxVal && node->data < right.minVal) {
            int currentSize = left.size + right.size + 1;
            maxSize = max(maxSize, currentSize);
            return {true, currentSize, min(left.minVal, node->data), max(right.maxVal, node->data)};
        }

        return {false, 0, 0, 0};
    }

    int largestBst(Node* root) {
        maxSize = 0;
        solve(root);
        return maxSize;
    }
};
```

### Complexity
- **Time:** O(N) — Single post-order traversal.
- **Space:** O(H) — Recursion stack depth equals tree height.

## Key Insight
> By returning min/max values and BST status from each subtree during post-order traversal, we can determine BST validity in O(1) at each node, achieving O(N) overall.
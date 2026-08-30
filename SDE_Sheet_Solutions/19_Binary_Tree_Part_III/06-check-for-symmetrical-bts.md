# 101. Symmetric Tree (Mirror Check)

> **Difficulty:** Medium | **Topic:** Binary Tree, BFS, Queue | **Platform:** LeetCode

---

## Problem Statement
Given the `root` of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center). This solution uses an iterative BFS approach with a queue.

## Examples
**Example 1:**
```
Input: root = [1,2,2,3,4,4,3]
Output: true
```

**Example 2:**
``**Input:** root = [1,2,2,null,3,null,3]
Output: false
```

## Constraints
- The number of nodes in the tree is in the range `[1, 1000]`.
- `-100 <= Node.val <= 100`

## Topic Tags
`Binary Tree` `Breadth-First Search` `Iterative`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) |

## Intuition
Instead of recursion, we can use a queue to iteratively compare pairs of nodes that should be mirrors. We enqueue pairs (left of left, right of right) and (right of left, left of right) and check if each pair has equal values.

## Approach
1. If root is null or has no children, return true.
2. Initialize a queue with the pair `(root.left, root.right)`.
3. While the queue is not empty:
   - Dequeue two nodes `left` and `right`.
   - If both are null, continue.
   - If one is null or values differ, return false.
   - Enqueue the mirror pairs: `(left.left, right.right)` and `(left.right, right.left)`.
4. If queue is exhausted, the tree is symmetric.

## Brute Force
### Approach
Collect each level as a list and check if each level is a palindrome. Uses more memory.

### Complexity
- **Time:** O(n)
- **Space:** O(n)

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

from collections import deque

class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        if not root:
            return True

        queue = deque([(root.left, root.right)])

        while queue:
            left, right = queue.popleft()

            if not left and not right:
                continue
            if not left or not right:
                return False
            if left.val != right.val:
                return False

            queue.append((left.left, right.right))
            queue.append((left.right, right.left))

        return True
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
    bool isSymmetric(TreeNode* root) {
        if (!root) return true;

        queue<pair<TreeNode*, TreeNode*>> q;
        q.push({root->left, root->right});

        while (!q.empty()) {
            auto [left, right] = q.front();
            q.pop();

            if (!left && !right) continue;
            if (!left || !right) return false;
            if (left->val != right->val) return false;

            q.push({left->left, right->right});
            q.push({left->right, right->left});
        }

        return true;
    }
};
```

### Complexity
- **Time:** O(n) — each node is visited once.
- **Space:** O(n) — queue can hold up to O(n) nodes in the worst case.

## Key Insight
> An iterative BFS approach avoids recursion stack limitations. By processing mirror-pair nodes together in a queue, we can detect asymmetry as soon as a mismatch is found.

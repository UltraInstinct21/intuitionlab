# 124. Binary Tree Maximum Path Sum

> **Difficulty:** Hard | **Topic:** Binary Tree, Dynamic Programming, DFS | **Platform:** LeetCode

---

## Problem Statement
A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence **at most once**. Note that the path does not need to pass through the root.

The path sum of a path is the sum of the node's values in the path.

Given the `root` of a binary tree, return the maximum path sum of any **non-empty** path.

## Examples
**Example 1:**
```
Input: root = [1,2,3]
Output: 6
Explanation: The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.
```

**Example 2:**
```
Input: root = [-10,9,20,null,null,15,7]
Output: 42
Explanation: The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.
```

## Constraints
- The number of nodes in the tree is in the range `[1, 3 * 10^4]`.
- `-1000 <= Node.val <= 1000`

## Topic Tags
`Binary Tree` `Dynamic Programming` `Depth-First Search`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(h) where h is the height of the tree |

## Intuition
The key insight is that at each node, we need to consider two things:
1. The maximum path sum that passes through this node (could be the answer).
2. The maximum "branch" sum we can return to the parent (only one side can be chosen).

A path through a node can combine the left branch sum, the node's value, and the right branch sum. However, when returning to a parent, we can only take one branch (left or right) plus the node's value.

## Approach
1. Perform a post-order DFS traversal of the tree.
2. At each node, calculate the maximum gain from the left and right subtrees.
3. Consider the path that uses both children: `left_gain + node.val + right_gain`. Update the global maximum.
4. Return to the parent the maximum of `node.val` or `node.val + max(left_gain, right_gain)` — only one branch can extend upward.
5. Handle negative gains by clamping them to 0 (a negative subtree is worse than not using it at all).

## Brute Force
### Approach
Try all possible paths in the tree by exploring every node as a potential path peak. For each node, compute all path sums that pass through it.

### Complexity
- **Time:** O(n²) — for each node, we might traverse its subtrees multiple times.
- **Space:** O(h) for recursion stack.

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

class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        self.max_sum = float('-inf')

        def dfs(node):
            if not node:
                return 0

            left_gain = max(dfs(node.left), 0)
            right_gain = max(dfs(node.right), 0)

            # Path passing through this node
            current_path_sum = node.val + left_gain + right_gain
            self.max_sum = max(self.max_sum, current_path_sum)

            # Return max gain extending to parent
            return node.val + max(left_gain, right_gain)

        dfs(root)
        return self.max_sum
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
    int maxSum = INT_MIN;

    int dfs(TreeNode* node) {
        if (!node) return 0;

        int leftGain = max(dfs(node->left), 0);
        int rightGain = max(dfs(node->right), 0);

        int currentPathSum = node->val + leftGain + rightGain;
        maxSum = max(maxSum, currentPathSum);

        return node->val + max(leftGain, rightGain);
    }

    int maxPathSum(TreeNode* root) {
        dfs(root);
        return maxSum;
    }
};
```

### Complexity
- **Time:** O(n) — each node is visited exactly once.
- **Space:** O(h) — recursion stack depth equals tree height.

## Key Insight
> At each node, the maximum path can use both children, but when returning to the parent, only one branch can extend upward. Negative subtree gains are clamped to zero since omitting them is always better.

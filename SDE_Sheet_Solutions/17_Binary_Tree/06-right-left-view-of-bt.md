# 199. Binary Tree Right Side View

> **Difficulty:** Medium | **Topic:** Binary Tree, BFS, DFS | **Platform:** LeetCode

---

## Problem Statement
Given the `root` of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.

Note: This can be adapted to left side view by simply taking the first node at each level instead of the last.

## Examples
**Example 1:**
```
Input: root = [1,2,3,null,5,null,4]
Output: [1,3,4]
```

**Example 2:**
```
Input: root = [1,null,3]
Output: [1,3]
```

**Example 3:**
```
Input: root = []
Output: []
```

## Constraints
- The number of nodes in the tree is in the range `[0, 100]`
- `-100 <= Node.val <= 100`

## Topic Tags
`Tree` `Breadth-First Search` `Depth-First Search` `Binary Tree`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) |

## Intuition
The right side view of a binary tree consists of the last node visible at each level when viewed from the right. We can solve this using level-order traversal (BFS) where we take the last node at each level, or using DFS where we traverse right subtree first and record the first node encountered at each depth.

For left side view, we would take the first node at each level (BFS) or traverse left subtree first (DFS).

## Approach
1. **BFS Approach:**
   - Perform level-order traversal
   - For each level, take the last node (rightmost)
   - Add to result

2. **DFS Approach:**
   - Traverse right subtree first
   - Track depth and add node when depth equals result length
   - This ensures we only add the first node encountered at each depth

## Brute Force
### Approach
The BFS and DFS approaches are both optimal with O(n) time. No brute force needed.

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
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []
        
        result = []
        queue = deque([root])
        
        while queue:
            level_size = len(queue)
            for i in range(level_size):
                node = queue.popleft()
                if i == level_size - 1:  # Last node in level
                    result.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
        
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
    vector<int> rightSideView(TreeNode* root) {
        vector<int> result;
        if (!root) return result;
        
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            int levelSize = q.size();
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                if (i == levelSize - 1) {
                    result.push_back(node->val);
                }
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
        }
        
        return result;
    }
};
```

### Complexity
- **Time Complexity:** O(n) - Each node is visited exactly once
- **Space Complexity:** O(n) - Queue can hold up to n/2 nodes at the last level

## Key Insight
> For right side view, process the last node at each level; for left side view, process the first node at each level. DFS can also work by traversing right/left subtree first.

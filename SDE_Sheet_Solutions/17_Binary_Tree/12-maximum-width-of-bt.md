# 662. Maximum Width of Binary Tree

> **Difficulty:** Medium | **Topic:** Binary Tree, BFS, DFS | **Platform:** LeetCode

---

## Problem Statement
Given the `root` of a binary tree, return the maximum width of the tree. The maximum width is the maximum number of nodes at any level, including null nodes between the first and last non-null nodes.

## Examples
**Example 1:**
```
Input: root = [1,3,2,5,3,null,9]
Output: 4
```

**Example 2:**
```
Input: root = [1,3,2,5]
Output: 2
```

**Example 3:**
``: root = [1,3,2,5,3,null,9]
Output: 4
```

**Example 2:**
```
Input: root = [1,3,2,5]
Output: 2
```

**Example 3:**
```
Input: root = [1,3,2,5,null,null,9,6,null,null,7]
Output: 8
```

## Constraints
- The number of nodes in the tree is in the range `[1, 3000]`
- `-100 <= Node.val <= 100`

## Topic Tags
`Binary Tree` `BFS` `DFS` `Indexing`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) |

## Intuition
The width of a binary tree at any level is defined as the difference between the position of the rightmost and leftmost non-null nodes plus one. We can use BFS to process level by level, assigning indices to nodes similar to a heap: for node at index i, left child is at 2*i+1 and right child at 2*i+2.

However, to avoid integer overflow, we normalize indices at each level by subtracting the minimum index of that level.

## Approach
1. Use BFS with a queue storing (node, index)
2. For each level, track min and max indices
3. Width = max_index - min_index + 1
4. For children: left = 2*i + 1, right = 2*i + 2
5. Normalize by subtracting level's minimum index to prevent overflow

## Brute Force
### Approach
We could use DFS to track indices, but BFS is more natural for level-by-level processing.

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
    def widthOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        
        max_width = 0
        queue = deque([(root, 0)])
        
        while queue:
            level_size = len(queue)
            min_idx = queue[0][1]
            max_idx = queue[-1][1]
            max_width = max(max_width, max_idx - min_idx + 1)
            
            for _ in range(level_size):
                node, idx = queue.popleft()
                # Normalize index to prevent overflow
                normalized_idx = idx - min_idx
                
                if node.left:
                    queue.append((node.left, 2 * normalized_idx + 1))
                if node.right:
                    queue.append((node.right, 2 * normalized_idx + 2))
        
        return max_width
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
    int widthOfBinaryTree(TreeNode* root) {
        if (!root) return 0;
        
        unsigned long long maxWidth = 0;
        queue<pair<TreeNode*, unsigned long long>> q;
        q.push({root, 0});
        
        while (!q.empty()) {
            int levelSize = q.size();
            unsigned long long minIdx = q.front().second;
            unsigned long long maxIdx = q.back().second;
            maxWidth = max(maxWidth, maxIdx - minIdx + 1);
            
            for (int i = 0; i < levelSize; i++) {
                auto [node, idx] = q.front();
                q.pop();
                
                unsigned long long normalizedIdx = idx - minIdx;
                
                if (node->left) q.push({node->left, 2 * normalizedIdx + 1});
                if (node->right) q.push({node->right, 2 * normalizedIdx + 2});
            }
        }
        
        return maxWidth;
    }
};
```

### Complexity
- **Time Complexity:** O(n) - Each node is visited exactly once
- **Space Complexity:** O(n) - Queue can hold up to n/2 nodes at the last level

## Key Insight
> By normalizing indices at each level (subtracting the minimum index), we prevent integer overflow while maintaining the correct width calculation across all levels.

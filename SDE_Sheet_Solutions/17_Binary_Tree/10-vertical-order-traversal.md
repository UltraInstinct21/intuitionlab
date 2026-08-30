# 987. Vertical Order Traversal of a Binary Tree

> **Difficulty:** Medium | **Topic:** Binary Tree, BFS, Sorting | **Platform:** LeetCode

---

## Problem Statement
Given the `root` of a binary tree, calculate the vertical order traversal of it. For each node at position `(row, col)`, its left and right children will be at positions `(row + 1, col - 1)` and `(row + 1, col + 1)` respectively. The vertical order traversal is a list of non-empty triples `(col, row, value)` sorted first by `col`, then by `row`.

## Examples
**Example 1:**
```
Input: root = [3,9,20,null,null,15,7]
Output: [[9],[3,15],[20],[7]]
```

**Example 2:**
```
Input: root = [1,2,3,4,5,6,7]
Output: [[4],[2],[1,5,6],[3],[7]]
```

**Example 3:**
```
Input: root = [1,2,3,4,6,5,7]
Output: [[4],[2],[1,5,6],[3],[7]]
```

## Constraints
- The number of nodes in the tree is in the range `[1, 1000]`
- `0 <= Node.val <= 1000`

## Topic Tags
`Binary Tree` `BFS` `Sorting` `Hash Map`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n log n) |
| **Space** | O(n) |

## Intuition
Vertical order traversal requires us to group nodes by their column (horizontal distance) and row (level). Nodes at the same column and row are sorted by value. We use BFS to traverse level by level, storing (row, col, value) for each node. Then we sort by (col, row, value) and group by column.

The key challenge is handling nodes at the same position - they must be sorted by value.

## Approach
1. Use BFS to traverse the tree, tracking row and column for each node
2. Store tuples of (col, row, val) in a list
3. Sort the list by (col, row, val)
4. Group by column to form the final result

## Brute Force
### Approach
We could use a HashMap with col as key and list of (row, val) as value, then sort each list. The approach above is cleaner.

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
    def verticalTraversal(self, root: Optional[TreeNode]) -> List[List[int]]:
        nodes = []
        queue = deque([(root, 0, 0)])  # (node, row, col)
        
        while queue:
            node, row, col = queue.popleft()
            nodes.append((col, row, node.val))
            
            if node.left:
                queue.append((node.left, row + 1, col - 1))
            if node.right:
                queue.append((node.right, row + 1, col + 1))
        
        # Sort by (col, row, val)
        nodes.sort()
        
        result = []
        current_col = nodes[0][0]
        current_col_nodes = []
        
        for col, row, val in nodes:
            if col != current_col:
                result.append(current_col_nodes)
                current_col = col
                current_col_nodes = [val]
            else:
                current_col_nodes.append(val)
        
        result.append(current_col_nodes)
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
    vector<vector<int>> verticalTraversal(TreeNode* root) {
        vector<tuple<int, int, int>> nodes;
        queue<tuple<TreeNode*, int, int>> q;
        q.push({root, 0, 0});
        
        while (!q.empty()) {
            auto [node, row, col] = q.front();
            q.pop();
            
            nodes.push_back({col, row, node->val});
            
            if (node->left) q.push({node->left, row + 1, col - 1});
            if (node->right) q.push({node->right, row + 1, col + 1});
        }
        
        sort(nodes.begin(), nodes.end());
        
        vector<vector<int>> result;
        int currentCol = get<0>(nodes[0]);
        vector<int> currentColNodes;
        
        for (auto& [col, row, val] : nodes) {
            if (col != currentCol) {
                result.push_back(currentColNodes);
                currentCol = col;
                currentColNodes = {val};
            } else {
                currentColNodes.push_back(val);
            }
        }
        
        result.push_back(currentColNodes);
        return result;
    }
};
```

### Complexity
- **Time Complexity:** O(n log n) - BFS is O(n), sorting is O(n log n)
- **Space Complexity:** O(n) - For storing nodes and result

## Key Insight
> Vertical order traversal requires sorting by (col, row, val) to handle nodes at the same position - they must be ordered by value, not just by level.

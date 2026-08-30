# 102. Binary Tree Level Order Traversal

> **Difficulty:** Easy | **Topic:** Binary Tree, BFS | **Platform:** LeetCode

---

## Problem Statement
Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).

## Examples
**Example 1:**
```
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]
```

**Example 2:**
```
Input: root = [1]
Output: [[1]]
```

**Example 3:**
```
Input: root = []
Output: []
```

## Constraints
- The number of nodes in the tree is in the range [0, 2000]
- -1000 <= Node.val <= 1000

## Topic Tags
`Tree` `Breadth-First Search` `Binary Tree`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) |

## Intuition
Level order traversal is a BFS problem where we visit nodes level by level. We can use a queue to keep track of nodes at each level. For each level, we process all nodes currently in the queue (which represents one complete level), collect their values, and add their children to the queue for the next level.

## Approach
1. Handle edge case: if root is null, return empty list
2. Initialize a queue with the root node
3. While queue is not empty:
   - Get the current size of queue (number of nodes at current level)
   - Process all nodes at current level
   - For each node, add its value to current level list
   - Add left and right children to queue if they exist
4. Add current level list to result
5. Return result

## Brute Force
### Approach
Use recursion with a level parameter. For each node, pass the current level. If the level matches the result list size, add a new list. Then append the node's value to the appropriate level list.

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
    def levelOrder(self, root: TreeNode) -> list[list[int]]:
        result = []
        
        def dfs(node, level):
            if not node:
                return
            
            # If this is a new level, create a new list
            if level == len(result):
                result.append([])
            
            # Add current node's value to its level
            result[level].append(node.val)
            
            # Recurse for left and right children
            dfs(node.left, level + 1)
            dfs(node.right, level + 1)
        
        dfs(root, 0)
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
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> result;
        dfs(root, 0, result);
        return result;
    }
    
    void dfs(TreeNode* node, int level, vector<vector<int>>& result) {
        if (!node) return;
        
        // If this is a new level, create a new vector
        if (level == result.size()) {
            result.push_back({});
        }
        
        // Add current node's value to its level
        result[level].push_back(node->val);
        
        // Recurse for left and right children
        dfs(node->left, level + 1, result);
        dfs(node->right, level + 1, result);
    }
};
```

### Complexity
- **Time:** O(n) where n is the number of nodes
- **Space:** O(n) for recursion stack and result storage

## Optimized Solution
### Code
**Python**
```python
from collections import deque

class Solution:
    def levelOrder(self, root: TreeNode) -> list[list[int]]:
        if not root:
            return []
        
        result = []
        queue = deque([root])
        
        while queue:
            level_size = len(queue)
            current_level = []
            
            for _ in range(level_size):
                node = queue.popleft()
                current_level.append(node.val)
                
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            
            result.append(current_level)
        
        return result
```

**C++**
```cpp
class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        if (!root) return {};
        
        vector<vector<int>> result;
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            int levelSize = q.size();
            vector<int> currentLevel;
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                
                currentLevel.push_back(node->val);
                
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            
            result.push_back(currentLevel);
        }
        
        return result;
    }
};
```

### Complexity
- **Time:** O(n) where n is the number of nodes
- **Space:** O(n) for the queue (at most n/2 nodes at the last level)

## Key Insight
> Use BFS with a queue to process nodes level by level, where the queue size at each iteration tells us how many nodes are at the current level.
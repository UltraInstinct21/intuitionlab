# 103. Binary Tree Zigzag Level Order Traversal

> **Difficulty:** Medium | **Topic:** Binary Tree, BFS | **Platform:** LeetCode

---

## Problem Statement
Given the root of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next level and alternate between).

## Examples
**Example 1:**
```
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[20,9],[15,7]]
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
- -100 <= Node.val <= 100

## Topic Tags
`Tree` `Breadth-First Search` `Binary Tree`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) |

## Intuition
Zigzag traversal is a variation of level order traversal where we alternate the direction of traversal at each level. We can use BFS with a queue and a flag to track the direction. For each level, we collect the nodes in the appropriate order based on the current direction.

## Approach
1. Handle edge case: if root is null, return empty list
2. Initialize a queue with the root node and a flag to track direction
3. While queue is not empty:
   - Get the current size of queue (number of nodes at current level)
   - Process all nodes at current level
   - For each node, add its value to current level list
   - Add left and right children to queue if they exist
   - If current level is from right to left, reverse the current level list
   - Toggle the direction flag
4. Add current level list to result
5. Return result

## Brute Force
### Approach
Use BFS to collect nodes at each level, then reverse the list for odd levels.

### Code
**Python**
```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def zigzagLevelOrder(self, root: TreeNode) -> list[list[int]]:
        if not root:
            return []
        
        result = []
        queue = deque([root])
        left_to_right = True
        
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
            
            if not left_to_right:
                current_level.reverse()
            
            result.append(current_level)
            left_to_right = not left_to_right
        
        return result
```

**C++**
```cpp
class Solution {
public:
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        if (!root) return {};
        
        vector<vector<int>> result;
        queue<TreeNode*> q;
        q.push(root);
        bool leftToRight = true;
        
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
            
            if (!leftToRight) {
                reverse(currentLevel.begin(), currentLevel.end());
            }
            
            result.push_back(currentLevel);
            leftToRight = !leftToRight;
        }
        
        return result;
    }
};
```

### Complexity
- **Time:** O(n) where n is the number of nodes
- **Space:** O(n) for the queue (at most n/2 nodes at the last level)

## Optimized Solution
### Code
**Python**
```python
from collections import deque

class Solution:
    def zigzagLevelOrder(self, root: TreeNode) -> list[list[int]]:
        if not root:
            return []
        
        result = []
        queue = deque([root])
        left_to_right = True
        
        while queue:
            level_size = len(queue)
            current_level = deque()
            
            for _ in range(level_size):
                node = queue.popleft()
                
                if left_to_right:
                    current_level.append(node.val)
                else:
                    current_level.appendleft(node.val)
                
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            
            result.append(list(current_level))
            left_to_right = not left_to_right
        
        return result
```

**C++**
```cpp
class Solution {
public:
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        if (!root) return {};
        
        vector<vector<int>> result;
        queue<TreeNode*> q;
        q.push(root);
        bool leftToRight = true;
        
        while (!q.empty()) {
            int levelSize = q.size();
            deque<int> currentLevel;
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                
                if (leftToRight) {
                    currentLevel.push_back(node->val);
                } else {
                    currentLevel.push_front(node->val);
                }
                
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            
            result.push_back(vector<int>(currentLevel.begin(), currentLevel.end()));
            leftToRight = !leftToRight;
        }
        
        return result;
    }
};
```

### Complexity
- **Time:** O(n) where n is the number of nodes
- **Space:** O(n) for the queue and deque

## Key Insight
> Use BFS with a deque to efficiently build the level list in the correct order without needing to reverse it.
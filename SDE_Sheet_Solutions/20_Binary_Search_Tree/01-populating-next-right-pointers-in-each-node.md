# 116. Populating Next Right Pointers in Each Node

> **Difficulty:** Medium | **Topic:** Binary Tree, BFS, Level Order Traversal | **Platform:** LeetCode

---

## Problem Statement
You are given a **perfect binary tree** where all leaves are on the same level, and every parent has two children. The tree has the following definition:

```cpp
struct Node {
  int val;
  Node *left;
  Node *right;
  Node *next;
}
```

Populate each `next` pointer to point to its next right node. If there is no next right node, the `next` pointer should be `NULL`.

Initially, all `next` pointers are `NULL`.

## Examples
**Example 1:**
```
Input: [1,2,3,4,5,6,7]
Output: [1,#,2,3,#,4,5,6,7,#]

    1           1 -> NULL
   / \         / \
  2   3       2 -> 3 -> NULL
 / \ / \      / \ / \
4  5 6  7    4->5->6->7 -> NULL
```

**Example 2:**
```
Input: []
Output: []
```

## Constraints
- The number of nodes in the tree is in the range `[0, 2^12 - 1]`
- `-1000 <= Node.val <= 1000`
- The tree is a **perfect binary tree**

## Topic Tags
`Binary Tree` `BFS` `DFS` `Level Order Traversal` `Recursion`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N) |
| **Space** | O(1) (O(N) for BFS approach) |

## Intuition
The key insight is that we can connect nodes at the same level using the `next` pointers that already exist. For a perfect binary tree, each node's left child's `next` should point to its right child. Each node's right child's `next` should point to the left child of the node's `next` (if it exists).

We can use a BFS approach (level-order traversal) to connect nodes level by level, or we can use a DFS approach that takes advantage of the existing `next` pointers to traverse without extra space.

## Approach
**BFS Approach:**
1. Start from the root node.
2. Use a queue to perform level-order traversal.
3. For each level, connect all nodes from left to right using the `next` pointer.
4. The last node in each level should point to `NULL`.

**Optimized Approach (Using existing next pointers):**
1. Start from the root.
2. For each level, use the `next` pointers to traverse across.
3. Connect left child's `next` to right child.
4. Connect right child's `next` to the left child of the next node in the current level.

## Brute Force
### Approach
Use BFS with a queue to perform level-order traversal and connect nodes at each level.
### Code
**Python**
```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val: int = 0, left: 'Node' = None, right: 'Node' = None, next: 'Node' = None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next
"""
from collections import deque

class Solution:
    def connect(self, root: 'Node') -> 'Node':
        if not root:
            return None
        
        queue = deque([root])
        
        while queue:
            level_size = len(queue)
            prev = None
            
            for i in range(level_size):
                node = queue.popleft()
                
                if prev:
                    prev.next = node
                prev = node
                
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
        
        return root
```

**C++**
```cpp
/*
// Definition for a Node.
class Node {
public:
    int val;
    Node* left;
    Node* right;
    Node* next;

    Node() : val(0), left(NULL), right(NULL), next(NULL) {}

    Node(int _val) : val(_val), left(NULL), right(NULL), next(NULL) {}

    Node(int _val, Node* _left, Node* _right, Node* _next)
        : val(_val), left(_left), right(_right), next(_next) {}
};
*/
class Solution {
public:
    Node* connect(Node* root) {
        if (!root) return nullptr;
        
        queue<Node*> q;
        q.push(root);
        
        while (!q.empty()) {
            int levelSize = q.size();
            Node* prev = nullptr;
            
            for (int i = 0; i < levelSize; i++) {
                Node* node = q.front();
                q.pop();
                
                if (prev) {
                    prev->next = node;
                }
                prev = node;
                
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
        }
        
        return root;
    }
};
```
### Complexity
- Time: O(N) - visit each node once
- Space: O(N) - queue can hold up to N/2 nodes (last level)

## Optimized Solution
### Code
**Python**
```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val: int = 0, left: 'Node' = None, right: 'Node' = None, next: 'Node' = None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next
"""

class Solution:
    def connect(self, root: 'Node') -> 'Node':
        if not root:
            return None
        
        leftmost = root
        
        while leftmost.left:
            head = leftmost
            
            while head:
                # Connect left child to right child
                head.left.next = head.right
                
                # Connect right child to left child of next node
                if head.next:
                    head.right.next = head.next.left
                
                head = head.next
            
            leftmost = leftmost.left
        
        return root
```

**C++**
```cpp
/*
// Definition for a Node.
class Node {
public:
    int val;
    Node* left;
    Node* right;
    Node* next;

    Node() : val(0), left(NULL), right(NULL), next(NULL) {}

    Node(int _val) : val(_val), left(NULL), right(NULL), next(NULL) {}

    Node(int _val, Node* _left, Node* _right, Node* _next)
        : val(_val), left(_left), right(_right), next(_next) {}
};
*/
class Solution {
public:
    Node* connect(Node* root) {
        if (!root) return nullptr;
        
        Node* leftmost = root;
        
        while (leftmost->left) {
            Node* head = leftmost;
            
            while (head) {
                // Connect left child to right child
                head->left->next = head->right;
                
                // Connect right child to left child of next node
                if (head->next) {
                    head->right->next = head->next->left;
                }
                
                head = head->next;
            }
            
            leftmost = leftmost->left;
        }
        
        return root;
    }
};
```
### Complexity
- Time: O(N) - visit each node once
- Space: O(1) - no extra space needed

## Key Insight
> By leveraging the `next` pointers that already exist in the tree, we can traverse horizontally across levels and connect children without any extra space, turning a BFS problem into an O(1) space solution.

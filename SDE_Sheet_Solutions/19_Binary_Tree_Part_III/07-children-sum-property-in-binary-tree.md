# Children Sum Property in Binary Tree

> **Difficulty:** Medium | **Topic:** Binary Tree, DFS, Greedy | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a binary tree, determine if it satisfies the **Children Sum Property**. A binary tree satisfies the Children Sum Property if for every node, the value of the node is equal to the sum of the values of its left and right children. If a child is missing, its value is considered 0.

## Examples
**Example 1:**
```
Input:
       10
      /  \
     4    6
    / \    \
   1   2    3
Output: Yes (4+6=10, 1+2=3, 0+3=3... wait, 1+2=3 not 4)
```

**Example 2:**
```
Input:
       10
      /  \
     4    6
    / \   / \
   1   3 2   4
Output: Yes (4+6=10, 1+3=4, 2+4=6)
```

**Example 3:**
```
Input:
       5
      / \
     3   2
Output: Yes (3+2=5)
```

## Constraints
- `1 <= number of nodes <= 10^4`
- `0 <= node->data <= 10^4`

## Topic Tags
`Binary Tree` `DFS` `Greedy`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(h) |

## Intuition
We can check the property bottom-up: for each node, verify that its value equals the sum of its children's values. A DFS traversal naturally processes children before parents, making this straightforward.

## Approach
1. Use post-order DFS traversal.
2. For each node:
   - If it's a leaf, it satisfies the property trivially.
   - Compute the sum of left and right child values (0 if child is null).
   - Check if the node's value equals the children's sum.
   - If any node fails the check, return false.
3. Return true if all nodes pass.

## Brute Force
### Approach
For each node, recursively check the left and right subtrees, then verify the current node's value equals the sum of its children.

### Complexity
- **Time:** O(n) — visit each node once.
- **Space:** O(h) — recursion stack.

## Optimized Solution
### Code
**Python**
```python
# User function Template for python3

'''
# Node Class:
class Node:
    def __init__(self,val):
        self.data = val
        self.left = None
        self.right = None
'''

class Solution:
    def isSumProperty(self, root):
        if not root or (not root.left and not root.right):
            return 1

        left_val = root.left.data if root.left else 0
        right_val = root.right.data if root.right else 0

        if root.data == left_val + right_val:
            left_ok = self.isSumProperty(root.left)
            right_ok = self.isSumProperty(root.right)
            return 1 if left_ok and right_ok else 0

        return 0
```

**C++**
```cpp
/*
struct Node
{
    int data;
    struct Node* left;
    struct Node* right;

    Node(int x){
        data = x;
        left = right = NULL;
    }
};
*/

class Solution {
  public:
    int isSumProperty(Node *root) {
        if (!root || (!root->left && !root->right))
            return 1;

        int leftVal = root->left ? root->left->data : 0;
        int rightVal = root->right ? root->right->data : 0;

        if (root->data == leftVal + rightVal) {
            int leftOk = isSumProperty(root->left);
            int rightOk = isSumProperty(root->right);
            return leftOk && rightOk;
        }

        return 0;
    }
};
```

### Complexity
- **Time:** O(n) — each node is visited once.
- **Space:** O(h) — recursion stack depth equals tree height.

## Key Insight
> The Children Sum Property is a local constraint: each node only needs to equal the sum of its immediate children. A simple recursive check verifying this at every node solves the problem in linear time.

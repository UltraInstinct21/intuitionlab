# Ceil in a BST

> **Difficulty:** Easy | **Topic:** Binary Search Tree | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a BST and a number X, find the Ceil of X in the BST. The Ceil of X is the smallest node value in the BST which is greater than or equal to X. If no such node exists, return -1.

## Examples
**Example 1:**
```
Input:       10
           /    \
          5      15
         / \
        2   7
    X = 12
Output: 15
```

**Example 2:**
```
Input:       10
           /    \
          5      15
         / \
        2   7
    X = 1
Output: 2
```

## Constraints
- 1 ≤ Number of Nodes ≤ 10^5
- 1 ≤ Data of a Node ≤ 10^9
- 1 ≤ X ≤ 10^9

## Topic Tags
`BST` `Search` `Binary Search Tree`

## Expected Complexities
| | |
|---|---|
| **Time** | O(H) where H is the height of the BST |
| **Space** | O(1) |

## Intuition
The Ceil of a number X in a BST is the smallest value in the BST that is greater than or equal to X. This is the opposite of the Floor problem.

We traverse the tree starting from the root:
- If the current node's value is equal to X, we found the exact match, so this is the ceil.
- If the current node's value is less than X, the ceil must be in the right subtree (since all values in the left subtree are even smaller).
- If the current node's value is greater than X, the current node could be a potential ceil. But we continue searching in the left subtree to find a smaller value that is still ≥ X.

We keep track of the candidate (the last node where current->data ≥ X) as we traverse. At the end, the candidate is our answer.

## Approach
1. Initialize `ceil = -1` as the default result.
2. Start from the root node.
3. While the current node is not null:
   - If current node's data equals X, return current node's data (exact match).
   - If current node's data is greater than X, update ceil to current node's data and move to the left subtree.
   - If current node's data is less than X, move to the right subtree.
4. Return the ceil value.

## Brute Force
### Approach
Perform an inorder traversal of the BST and store all values in a sorted list. Then find the smallest value ≥ X using binary search or linear scan.

### Code
**Python**
```python
class Solution:
    def ceil(self, root, x):
        result = []
        self.inorder(root, result)
        for val in result:
            if val >= x:
                return val
        return -1

    def inorder(self, node, result):
        if not node:
            return
        self.inorder(node.left, result)
        result.append(node.data)
        self.inorder(node.right, result)
```

**C++**
```cpp
class Solution {
public:
    void inorder(Node* root, vector<int>& result) {
        if (!root) return;
        inorder(root->left, result);
        result.push_back(root->data);
        inorder(root->right, result);
    }

    int ceil(Node* root, int x) {
        vector<int> result;
        inorder(root, result);
        for (int val : result) {
            if (val >= x)
                return val;
        }
        return -1;
    }
};
```

### Complexity
- **Time:** O(N) — Inorder traversal visits all nodes.
- **Space:** O(N) — To store all node values.

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def ceil(self, root, x):
        ceil_val = -1
        current = root
        while current:
            if current.data == x:
                return current.data
            elif current.data > x:
                ceil_val = current.data
                current = current.left
            else:
                current = current.right
        return ceil_val
```

**C++**
```cpp
class Solution {
public:
    int ceil(Node* root, int x) {
        int ceilVal = -1;
        Node* current = root;
        while (current) {
            if (current->data == x) {
                return current->data;
            } else if (current->data > x) {
                ceilVal = current->data;
                current = current->left;
            } else {
                current = current->right;
            }
        }
        return ceilVal;
    }
};
```

### Complexity
- **Time:** O(H) — We traverse at most the height of the tree.
- **Space:** O(1) — No extra space used.

## Key Insight
> The Ceil is the mirror of Floor: when current node's value is greater than X, it becomes a potential ceil candidate, and we search left for a better (smaller) candidate; when it's less, we search right for a valid candidate.
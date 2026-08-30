# Floor in a BST

> **Difficulty:** Easy | **Topic:** Binary Search Tree | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a BST and a number X, find the Floor of X in the BST. The Floor of X is the largest node value in the BST which is smaller than or equal to X. If no such node exists, return -1.

## Examples
**Example 1:**
```
Input:       10
           /    \
          5      15
         / \
        2   7
    X = 12
Output: 10
```

**Example 2:**
```
Input:       10
           /    \
          5      15
         / \
        2   7
    X = 3
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
The Floor of a number X in a BST is the greatest value in the BST that is less than or equal to X. Since a BST has the property that left child < parent < right child, we can use this ordering to efficiently find the floor.

We traverse the tree starting from the root:
- If the current node's value is equal to X, we found the exact match, so this is the floor.
- If the current node's value is greater than X, the floor must be in the left subtree (since all values in the right subtree are even larger).
- If the current node's value is less than X, the current node could be a potential floor. But we continue searching in the right subtree to find a larger value that is still ≤ X.

We keep track of the candidate (the last node where current->data ≤ X) as we traverse. At the end, the candidate is our answer.

## Approach
1. Initialize `floor = -1` as the default result.
2. Start from the root node.
3. While the current node is not null:
   - If current node's data equals X, return current node's data (exact match).
   - If current node's data is less than X, update floor to current node's data and move to the right subtree.
   - If current node's data is greater than X, move to the left subtree.
4. Return the floor value.

## Brute Force
### Approach
Perform an inorder traversal of the BST and store all values in a sorted list. Then find the largest value ≤ X using binary search or linear scan.

### Code
**Python**
```python
class Solution:
    def floor(self, root, x):
        result = []
        self.inorder(root, result)
        floor_val = -1
        for val in result:
            if val <= x:
                floor_val = val
            else:
                break
        return floor_val

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

    int floor(Node* root, int x) {
        vector<int> result;
        inorder(root, result);
        int floorVal = -1;
        for (int val : result) {
            if (val <= x)
                floorVal = val;
            else
                break;
        }
        return floorVal;
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
    def floor(self, root, x):
        floor_val = -1
        current = root
        while current:
            if current.data == x:
                return current.data
            elif current.data < x:
                floor_val = current.data
                current = current.right
            else:
                current = current.left
        return floor_val
```

**C++**
```cpp
class Solution {
public:
    int floor(Node* root, int x) {
        int floorVal = -1;
        Node* current = root;
        while (current) {
            if (current->data == x) {
                return current->data;
            } else if (current->data < x) {
                floorVal = current->data;
                current = current->right;
            } else {
                current = current->left;
            }
        }
        return floorVal;
    }
};
```

### Complexity
- **Time:** O(H) — We traverse at most the height of the tree.
- **Space:** O(1) — No extra space used.

## Key Insight
> In a BST, when the current node's value is less than X, it becomes a potential floor candidate, and we search right for a better (larger) candidate; when it's greater, we search left for a valid candidate.
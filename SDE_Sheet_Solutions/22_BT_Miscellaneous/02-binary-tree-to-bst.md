# Binary Tree to BST

> **Difficulty:** Medium | **Topic:** Binary Tree, Binary Search Tree | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a Binary Tree, convert it to a Binary Search Tree. The conversion should maintain the structure of the original binary tree while ensuring BST property is satisfied.

## Examples
**Example 1:**
```
Input:
       1
      / \
     2   3
Output:
       2
      / \
     1   3
Explanation: BST with same structure as original tree
```

**Example 2:**
```
Input:
       1
      / \
     2   3
    / \
   4   6
Output:
       3
      / \
     2   4
    / \
   1   6
```

## Constraints
- 1 ≤ Number of nodes ≤ 10^4
- 1 ≤ Data ≤ 10^6

## Topic Tags
`Binary Tree` `BST` `Inorder Traversal`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n log n) |
| **Space** | O(n) |

## Intuition
The key insight is that inorder traversal of a BST always gives elements in sorted order. So we can:
1. Collect all node values from the binary tree
2. Sort them
3. Assign them back to nodes following inorder traversal pattern

This way, the tree structure remains the same but the values satisfy BST property.

## Approach
1. Perform inorder traversal of the binary tree and collect all node values
2. Sort the collected values
3. Perform inorder traversal again, but this time assign sorted values to nodes

## Brute Force
### Approach
Use any traversal to collect values, sort them, then rebuild the tree with BST property.

### Code
**Python**
```python
class Solution:
    def binaryTreeToBST(self, root):
        elements = []
        
        def collect(node):
            if not node:
                return
            elements.append(node.data)
            collect(node.left)
            collect(node.right)
        
        collect(root)
        elements.sort()
        
        self.index = 0
        def assign(node):
            if not node:
                return
            assign(node.left)
            node.data = elements[self.index]
            self.index += 1
            assign(node.right)
        
        assign(root)
        return root
```

**C++**
```cpp
class Solution {
public:
    void collect(Node* root, vector<int>& elements) {
        if (!root) return;
        elements.push_back(root->data);
        collect(root->left, elements);
        collect(root->right, elements);
    }
    
    void assign(Node* root, vector<int>& elements, int& index) {
        if (!root) return;
        assign(root->left, elements, index);
        root->data = elements[index++];
        assign(root->right, elements, index);
    }
    
    Node *binaryTreeToBST(Node *root) {
        vector<int> elements;
        collect(root, elements);
        sort(elements.begin(), elements.end());
        int index = 0;
        assign(root, elements, index);
        return root;
    }
};
```

### Complexity
- Time: O(n log n) - Sorting takes O(n log n)
- Space: O(n) - For storing elements

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def binaryTreeToBST(self, root):
        elements = []
        
        def inorder(node):
            if not node:
                return
            inorder(node.left)
            elements.append(node.data)
            inorder(node.right)
        
        inorder(root)
        elements.sort()
        
        self.idx = 0
        def construct(node):
            if not node:
                return
            construct(node.left)
            node.data = elements[self.idx]
            self.idx += 1
            construct(node.right)
        
        construct(root)
        return root
```

**C++**
```cpp
class Solution {
public:
    void inorder(Node* root, vector<int>& elements) {
        if (!root) return;
        inorder(root->left, elements);
        elements.push_back(root->data);
        inorder(root->right, elements);
    }
    
    void construct(Node* root, vector<int>& elements, int& idx) {
        if (!root) return;
        construct(root->left, elements, idx);
        root->data = elements[idx++];
        construct(root->right, elements, idx);
    }
    
    Node *binaryTreeToBST(Node *root) {
        vector<int> elements;
        inorder(root, elements);
        sort(elements.begin(), elements.end());
        int idx = 0;
        construct(root, elements, idx);
        return root;
    }
};
```

### Complexity
- Time: O(n log n) - Due to sorting
- Space: O(n) - For storing elements

## Key Insight
> Inorder traversal of BST always produces sorted sequence, so we can sort the collected values and reassign them following inorder pattern to maintain tree structure while achieving BST property.
# Preorder, Postorder and Inorder Traversal of Binary Tree

> **Difficulty:** Easy | **Topic:** Binary Tree, DFS | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a binary tree, find the preorder, postorder, and inorder traversals of the tree in a single traversal.

## Examples
**Example 1:**
```
Input: 
       1
      / \
     2   3
Output: 
Preorder: [1, 2, 3]
Inorder: [2, 1, 3]
Postorder: [2, 3, 1]
```

**Example 2:**
```
Input:
       1
      / \
     2   3
    / \
   4   5
Output:
Preorder: [1, 2, 4, 5, 3]
Inorder: [4, 2, 5, 1, 3]
Postorder: [4, 5, 2, 3, 1]
```

## Constraints
- 1 ≤ Number of nodes ≤ 10^5
- 0 ≤ Data of a node ≤ 10^5

## Topic Tags
`Binary Tree` `DFS` `Traversal` `Recursion`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(h) |

## Intuition
Instead of traversing the tree three separate times, we can compute all three traversals in a single DFS pass. The key insight is to track how many times a node has been visited using a count variable. 

- When count = 0: It's preorder (first visit, before left subtree)
- When count = 1: It's inorder (after left subtree, before right)
- When count = 2: It's postorder (after both subtrees)

## Approach
1. Use a recursive function with a count parameter
2. When count = 0, add to preorder and increment count
3. When count = 1, add to inorder and increment count
4. When count = 2, add to postorder
5. For each node, process left and right subtrees with current count

## Brute Force
### Approach
We could do three separate traversals, but that would require three passes through the tree. The single-pass approach is optimal.

## Optimized Solution
### Code
**Python**
```python
'''
class Node:
    def __init__(self,val):
        self.data = val
        self.left = None
        self.right = None
'''

class Solution:
    def traversal(self, root):
        preorder = []
        inorder = []
        postorder = []
        
        def dfs(node, count):
            if not node:
                return
            
            if count[0] == 0:
                preorder.append(node.data)
                count[0] += 1
            
            dfs(node.left, count)
            
            if count[0] == 1:
                inorder.append(node.data)
                count[0] += 1
            
            dfs(node.right, count)
            
            if count[0] == 2:
                postorder.append(node.data)
                count[0] += 1
        
        dfs(root, [0])
        return preorder, inorder, postorder
```

**C++**
```cpp
/*
struct Node {
    int data;
    Node *left;
    Node *right;
};
*/

class Solution {
  public:
    void dfs(Node* node, int& count, vector<int>& preorder, 
             vector<int>& inorder, vector<int>& postorder) {
        if (!node) return;
        
        if (count == 0) {
            preorder.push_back(node->data);
            count++;
        }
        
        dfs(node->left, count, preorder, inorder, postorder);
        
        if (count == 1) {
            inorder.push_back(node->data);
            count++;
        }
        
        dfs(node->right, count, preorder, inorder, postorder);
        
        if (count == 2) {
            postorder.push_back(node->data);
            count++;
        }
    }
    
    vector<vector<int>> prePostIn(Node *root) {
        vector<int> preorder, inorder, postorder;
        int count = 0;
        dfs(root, count, preorder, inorder, postorder);
        return {preorder, inorder, postorder};
    }
};
```

### Complexity
- **Time Complexity:** O(n) - Single traversal through all nodes
- **Space Complexity:** O(h) - Recursive stack space, h is height of tree

## Key Insight
> By tracking visit count (0=preorder, 1=inorder, 2=postorder), we can compute all three traversals in a single DFS pass, saving redundant tree traversals.

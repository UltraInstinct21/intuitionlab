# Kth Largest Element in BST

> **Difficulty:** Medium | **Topic:** Binary Search Tree, BST Properties | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a BST and an integer k, find the kth largest element in the BST. The BST contains distinct values.

## Examples
**Example 1:**
```
Input:
       5
      / \
     3   6
    / \   \
   2   4   7
k = 3
Output: 5
Explanation: 3rd largest element is 5
```

**Example 2:**
```
Input:
       5
      / \
     3   6
    / \   \
   2   4   7
k = 2
Output: 6
Explanation: 2nd largest element is 6
```

## Constraints
- 1 ≤ Number of nodes ≤ 10^4
- 1 ≤ K ≤ Number of nodes
- 1 ≤ Data ≤ 10^6

## Topic Tags
`BST` `Kth Largest` `Inorder Traversal`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(h) |

## Intuition
The key insight is that reverse inorder traversal (Right -> Root -> Left) of BST gives elements in descending order. So we can perform reverse inorder traversal and count nodes until we reach kth node.

Alternatively, we can find inorder traversal and access the (n-k+1)th element from the sorted array.

## Approach
1. Perform reverse inorder traversal (Right, Root, Left)
2. Keep a counter for nodes visited
3. When counter equals k, return that node's value
4. This gives us kth largest element efficiently

## Brute Force
### Approach
Perform inorder traversal to get sorted array, then access element at index (n-k).

### Code
**Python**
```python
class Solution:
    def inorder(self, root, elements):
        if not root:
            return
        self.inorder(root.left, elements)
        elements.append(root.data)
        self.inorder(root.right, elements)
    
    def kthLargest(self, root, k):
        elements = []
        self.inorder(root, elements)
        return elements[len(elements) - k]
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
    
    int kthLargest(Node *root, int k) {
        vector<int> elements;
        inorder(root, elements);
        return elements[elements.size() - k];
    }
};
```

### Complexity
- Time: O(n) - Inorder traversal
- Space: O(n) - For storing elements

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def __init__(self):
        self.count = 0
        self.result = 0
    
    def reverseInorder(self, root, k):
        if not root or self.count >= k:
            return
        
        self.reverseInorder(root.right, k)
        self.count += 1
        
        if self.count == k:
            self.result = root.data
            return
        
        self.reverseInorder(root.left, k)
    
    def kthLargest(self, root, k):
        self.count = 0
        self.result = 0
        self.reverseInorder(root, k)
        return self.result
```

**C++**
```cpp
class Solution {
public:
    int count = 0;
    int result = 0;
    
    void reverseInorder(Node* root, int k) {
        if (!root || count >= k) return;
        
        reverseInorder(root->right, k);
        count++;
        
        if (count == k) {
            result = root->data;
            return;
        }
        
        reverseInorder(root->left, k);
    }
    
    int kthLargest(Node *root, int k) {
        count = 0;
        result = 0;
        reverseInorder(root, k);
        return result;
    }
};
```

### Complexity
- Time: O(n) - Worst case visits all nodes
- Space: O(h) - Recursion stack height

## Key Insight
> Reverse inorder traversal of BST (Right -> Root -> Left) gives elements in descending order, so we can stop after visiting k nodes to find kth largest element.
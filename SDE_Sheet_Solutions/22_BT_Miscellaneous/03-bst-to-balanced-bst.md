# BST to Balanced BST

> **Difficulty:** Medium | **Topic:** Binary Search Tree, Balanced BST | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a BST (Binary Search Tree) that may be unbalanced, convert it into a balanced BST. A balanced BST is one where the height difference between left and right subtrees of any node is at most 1.

## Examples
**Example 1:**
```
Input:
       10
      /
     8
    /
   7
  /
 6
Output:
       8
      / \
     6   10
    /
   7
```

**Example 2:**
```
Input:
       5
      / \
     3   6
    /     \
   2       7
  /         \
 1           8
Output:
       6
      / \
     3   8
    / \  /
   2   5 7
  /
 1
```

## Constraints
- 1 ≤ Number of nodes ≤ 10^4
- 1 ≤ Data ≤ 10^6

## Topic Tags
`BST` `Balanced BST` `Inorder Traversal` `Recursion`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) |

## Intuition
The key insight is that inorder traversal of BST gives sorted array. From a sorted array, we can construct a balanced BST by always picking the middle element as the root. This ensures minimum height difference between left and right subtrees.

## Approach
1. Perform inorder traversal to get sorted array of elements
2. Use the sorted array to construct a balanced BST
3. Pick middle element as root
4. Recursively construct left subtree from left half
5. Recursively construct right subtree from right half

## Brute Force
### Approach
Use any tree traversal to collect values, sort them, then build a balanced BST.

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
    
    def sortedArrayToBST(self, elements):
        if not elements:
            return None
        
        mid = len(elements) // 2
        node = Node(elements[mid])
        node.left = self.sortedArrayToBST(elements[:mid])
        node.right = self.sortedArrayToBST(elements[mid+1:])
        return node
    
    def buildBalancedTree(self, root):
        elements = []
        self.inorder(root, elements)
        return self.sortedArrayToBST(elements)
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
    
    Node* sortedArrayToBST(vector<int>& elements, int start, int end) {
        if (start > end) return nullptr;
        
        int mid = (start + end) / 2;
        Node* node = new Node(elements[mid]);
        node->left = sortedArrayToBST(elements, start, mid - 1);
        node->right = sortedArrayToBST(elements, mid + 1, end);
        return node;
    }
    
    Node* buildBalancedTree(Node* root) {
        vector<int> elements;
        inorder(root, elements);
        return sortedArrayToBST(elements, 0, elements.size() - 1);
    }
};
```

### Complexity
- Time: O(n) - Inorder traversal + BST construction
- Space: O(n) - For storing elements

## Optimized Solution
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
    
    def sortedArrayToBST(self, elements, start, end):
        if start > end:
            return None
        
        mid = (start + end) // 2
        node = Node(elements[mid])
        node.left = self.sortedArrayToBST(elements, start, mid - 1)
        node.right = self.sortedArrayToBST(elements, mid + 1, end)
        return node
    
    def buildBalancedTree(self, root):
        elements = []
        self.inorder(root, elements)
        return self.sortedArrayToBST(elements, 0, len(elements) - 1)
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
    
    Node* sortedArrayToBST(vector<int>& elements, int start, int end) {
        if (start > end) return nullptr;
        
        int mid = (start + end) / 2;
        Node* node = new Node(elements[mid]);
        node->left = sortedArrayToBST(elements, start, mid - 1);
        node->right = sortedArrayToBST(elements, mid + 1, end);
        return node;
    }
    
    Node* buildBalancedTree(Node* root) {
        vector<int> elements;
        inorder(root, elements);
        return sortedArrayToBST(elements, 0, elements.size() - 1);
    }
};
```

### Complexity
- Time: O(n) - Single pass for inorder + construction
- Space: O(n) - For storing elements + recursion stack

## Key Insight
> Inorder traversal of BST gives sorted array, and a sorted array can always be converted to a balanced BST by recursively picking the middle element as root.
# 1008. Construct Binary Search Tree from Preorder Traversal

> **Difficulty:** Medium | **Topic:** Binary Search Tree, Tree Construction, Preorder | **Platform:** LeetCode

---

## Problem Statement
Given an array of integers `preorder` which represents the preorder traversal of a BST, construct the tree and return its root.

It is guaranteed that there is always a unique BST for the given preorder traversal.

**Note:** The preorder traversal of a BST visits nodes in the order: Root → Left → Right.

## Examples
**Example 1:**
```
Input: preorder = [8,5,1,7,10,12]
Output: [8,5,10,1,7,null,12]
        8
       / \
      5  10
     / \    \
    1   7   12
```

**Example 2:**
```
Input: preorder = [1,3]
Output: [1,null,3]
    1
     \
      3
```

## Constraints
- `1 <= preorder.length <= 100`
- `1 <= preorder[i] <= 1000`
- All the values of `preorder` are **unique**

## Topic Tags
`Binary Search Tree` `Tree` `Preorder Traversal` `Recursion` `Stack`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N) |
| **Space** | O(N) for tree, O(H) recursion stack |

## Intuition
In preorder traversal, we visit Root → Left → Right. For a BST, the first element is always the root. All elements smaller than the root belong to the left subtree, and all elements greater belong to the right subtree. We can use this property along with bounds to construct the tree efficiently.

The key insight is that for each node, we can determine valid ranges for its left and right children. A left child must be within `(lower_bound, parent_value)`, and a right child must be within `(parent_value, upper_bound)`.

## Approach
**Approach 1: Recursive with Bounds**
1. Use an index to track the current position in the preorder array.
2. For each recursive call, maintain valid bounds (min, max).
3. If the current value is within bounds, create a node and recursively build left and right subtrees.
4. Update bounds: left subtree uses (min, current_val), right uses (current_val, max).

**Approach 2: Using Stack (Iterative)**
1. Use a stack to keep track of nodes.
2. For each value in preorder:
   a. Create a new node.
   b. If stack top's value is less than current, pop and attach as left child.
   c. Otherwise, attach current as right child of the last popped node.
3. Push current node to stack.

## Brute Force
### Approach
For each element in preorder, find all elements smaller (left subtree) and larger (right subtree) in the remaining array, then recursively construct. This is O(N^2).
### Code
**Python**
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def bstFromPreorder(self, preorder: List[int]) -> Optional[TreeNode]:
        if not preorder:
            return None
        
        def build(start, end):
            if start > end:
                return None
            
            root = TreeNode(preorder[start])
            
            # Find the first element greater than root
            mid = start + 1
            while mid <= end and preorder[mid] < preorder[start]:
                mid += 1
            
            root.left = build(start + 1, mid - 1)
            root.right = build(mid, end)
            
            return root
        
        return build(0, len(preorder) - 1)
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
    TreeNode* build(vector<int>& preorder, int start, int end) {
        if (start > end) return nullptr;
        
        TreeNode* root = new TreeNode(preorder[start]);
        
        // Find the first element greater than root
        int mid = start + 1;
        while (mid <= end && preorder[mid] < preorder[start]) {
            mid++;
        }
        
        root->left = build(preorder, start + 1, mid - 1);
        root->right = build(preorder, mid, end);
        
        return root;
    }
    
    TreeNode* bstFromPreorder(vector<int>& preorder) {
        if (preorder.empty()) return nullptr;
        return build(preorder, 0, preorder.size() - 1);
    }
};
```
### Complexity
- Time: O(N^2) worst case (skewed tree)
- Space: O(N) recursion stack

## Optimized Solution
### Code
**Python**
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def bstFromPreorder(self, preorder: List[int]) -> Optional[TreeNode]:
        self.index = 0
        
        def build(lower, upper):
            if self.index >= len(preorder):
                return None
            
            val = preorder[self.index]
            if val < lower or val > upper:
                return None
            
            self.index += 1
            node = TreeNode(val)
            node.left = build(lower, val)
            node.right = build(val, upper)
            
            return node
        
        return build(float('-inf'), float('inf'))
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
    int idx = 0;
    
    TreeNode* build(long lower, long upper) {
        if (idx >= preorder.size()) return nullptr;
        
        int val = preorder[idx];
        if (val < lower || val > upper) return nullptr;
        
        idx++;
        TreeNode* node = new TreeNode(val);
        node->left = build(lower, val);
        node->right = build(val, upper);
        
        return node;
    }
    
    TreeNode* bstFromPreorder(vector<int>& preorder) {
        idx = 0;
        return build(LONG_MIN, LONG_MAX);
    }
};
```
### Complexity
- Time: O(N) - each node processed once
- Space: O(H) - recursion stack depth equals tree height

## Key Insight
> By maintaining valid bounds (min, max) for each recursive call, we can determine in O(1) whether the current preorder element belongs to the current subtree, allowing single-pass construction in O(N) time.

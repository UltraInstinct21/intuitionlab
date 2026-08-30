# Pair Sum in BST

> **Difficulty:** Medium | **Topic:** Binary Search Tree, Two Pointers | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a Binary Search Tree and a target sum. Check whether there exists a pair of distinct nodes in the BST whose sum is equal to the given target sum.

## Examples
**Example 1:**
```
Input: 
       5
      / \
     3   6
    / \   \
   2   4   7
Target = 9
Output: true
Explanation: 2 + 7 = 9, so pair exists
```

**Example 2:**
```
Input:
       5
      / \
     3   6
    / \   \
   2   4   7
Target = 28
Output: false
```

## Constraints
- 1 ≤ Number of nodes ≤ 10^4
- 1 ≤ Data ≤ 10^6
- 1 ≤ Target sum ≤ 10^6

## Topic Tags
`BST` `Two Pointers` `Inorder Traversal`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(h) |

## Intuition
We can perform an inorder traversal to get a sorted array of BST elements, then use two pointers to find the pair with the given sum. The key insight is that inorder traversal of a BST always gives sorted order.

Alternatively, we can use a hash set approach where for each node, we check if (target - node->val) exists in the set.

## Approach
1. Perform inorder traversal and store elements in an array
2. Use two pointers (left and right) on the sorted array
3. If sum equals target, return true
4. If sum is less than target, move left pointer right
5. If sum is greater than target, move right pointer left

## Brute Force
### Approach
Check every pair of nodes using nested loops.

### Code
**Python**
```python
class Solution:
    def findPair(self, root, target):
        elements = []
        
        def inorder(node):
            if not node:
                return
            inorder(node.left)
            elements.append(node.data)
            inorder(node.right)
        
        inorder(root)
        
        for i in range(len(elements)):
            for j in range(i+1, len(elements)):
                if elements[i] + elements[j] == target:
                    return True
        return False
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
    
    bool findPair(Node* root, int target) {
        vector<int> elements;
        inorder(root, elements);
        
        for (int i = 0; i < elements.size(); i++) {
            for (int j = i + 1; j < elements.size(); j++) {
                if (elements[i] + elements[j] == target)
                    return true;
            }
        }
        return false;
    }
};
```

### Complexity
- Time: O(n²) - Two nested loops over array
- Space: O(n) - For storing elements

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def findPair(self, root, target):
        elements = []
        
        def inorder(node):
            if not node:
                return
            inorder(node.left)
            elements.append(node.data)
            inorder(node.right)
        
        inorder(root)
        
        left, right = 0, len(elements) - 1
        
        while left < right:
            current_sum = elements[left] + elements[right]
            if current_sum == target:
                return True
            elif current_sum < target:
                left += 1
            else:
                right -= 1
        
        return False
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
    
    bool findPair(Node* root, int target) {
        vector<int> elements;
        inorder(root, elements);
        
        int left = 0, right = elements.size() - 1;
        
        while (left < right) {
            int current_sum = elements[left] + elements[right];
            if (current_sum == target)
                return true;
            else if (current_sum < target)
                left++;
            else
                right--;
        }
        return false;
    }
};
```

### Complexity
- Time: O(n) - Single inorder traversal + two pointer scan
- Space: O(n) - For storing elements + O(h) recursion stack

## Key Insight
> Inorder traversal of BST gives sorted array, enabling two-pointer technique for pair sum problem in linear time.
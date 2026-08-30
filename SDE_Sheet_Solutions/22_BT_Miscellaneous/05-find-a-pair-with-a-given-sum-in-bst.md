# Find a Pair with a Given Sum in BST

> **Difficulty:** Medium | **Topic:** Binary Search Tree, Two Pointers | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a Binary Search Tree and a target sum. Find a pair of distinct nodes in the BST whose values add up to the given target sum. Return true if such a pair exists, false otherwise.

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
Output: True
Explanation: 2 + 7 = 9 or 4 + 5 = 9
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
Output: False
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
The key insight is that inorder traversal of BST gives sorted array. Once we have sorted array, we can use two pointer technique to find if any pair sums to target. The two pointers start from opposite ends and move towards each other based on current sum comparison with target.

## Approach
1. Perform inorder traversal to get sorted array of BST elements
2. Initialize two pointers: left at start, right at end
3. Calculate current sum of elements at both pointers
4. If sum equals target, return true
5. If sum is less than target, move left pointer right
6. If sum is greater than target, move right pointer left
7. Continue until pointers meet

## Brute Force
### Approach
Check every pair of nodes using nested loops.

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
    
    def isPairPresent(self, root, target):
        elements = []
        self.inorder(root, elements)
        
        for i in range(len(elements)):
            for j in range(i + 1, len(elements)):
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
    
    bool isPairPresent(Node* root, int target) {
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
- Time: O(n²) - Two nested loops
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
    
    def isPairPresent(self, root, target):
        elements = []
        self.inorder(root, elements)
        
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
    
    bool isPairPresent(Node* root, int target) {
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
- Time: O(n) - Inorder traversal + two pointer scan
- Space: O(n) - For storing elements + O(h) recursion stack

## Key Insight
> Inorder traversal of BST produces sorted array, enabling two-pointer technique to find pair sum in linear time after sorting.
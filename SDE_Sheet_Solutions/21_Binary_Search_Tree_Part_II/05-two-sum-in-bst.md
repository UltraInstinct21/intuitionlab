# Two Sum IV - Input is a BST

> **Difficulty:** Medium | **Topic:** Binary Search Tree, BST | **Platform:** LeetCode

---

## Problem Statement
Given the root of a binary search tree and an integer k, return true if there exist two elements in the BST such that their sum is equal to k.

## Examples
**Example 1:**
```
Input: root = [5,3,6,2,4,null,null,1], k = 9
      5
     / \
    3   6
   / \
  2   4
 /
1
Output: true (4 + 5 = 9)
```

**Example 2:**
```
Input: root = [5,3,6,2,4,null,null,1], k = 28
Output: false
```

## Constraints
- The number of nodes in the tree is in the range [1, 10^4].
- -10^4 ≤ Node.val ≤ 10^4
- root is guaranteed to be a valid binary search tree.
- -10^5 ≤ k ≤ 10^5

## Topic Tags
`BST` `Tree` `Two Pointers` `Binary Search Tree`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N) |
| **Space** | O(N) |

## Intuition
We need to find if any two nodes in the BST sum up to k. Since BST has sorted structure via inorder traversal, we can leverage this property.

**Approach 1:** Convert BST to sorted array using inorder traversal, then use two-pointer technique on the sorted array.

**Approach 2:** Use iterator pattern with two pointers - one from the smallest (leftmost) and one from the largest (rightmost), moving inward based on the sum comparison with k.

**Approach 3:** Use a HashSet to store visited values. For each node, check if (k - node.val) exists in the set.

## Approach
1. Flatten the BST into a sorted array using inorder traversal.
2. Use two pointers: one at the start and one at the end of the array.
3. If sum equals k, return true.
4. If sum is less than k, move the left pointer right.
5. If sum is greater than k, move the right pointer left.
6. If pointers cross, return false.

## Brute Force
### Approach
For each pair of nodes in the BST, check if their sum equals k. This requires checking all pairs.

### Code
**Python**
```python
class Solution:
    def findTarget(self, root, k):
        values = []
        self.inorder(root, values)
        for i in range(len(values)):
            for j in range(i + 1, len(values)):
                if values[i] + values[j] == k:
                    return True
        return False

    def inorder(self, node, values):
        if not node:
            return
        self.inorder(node.left, values)
        values.append(node.val)
        self.inorder(node.right, values)
```

**C++**
```cpp
class Solution {
public:
    void inorder(TreeNode* root, vector<int>& values) {
        if (!root) return;
        inorder(root->left, values);
        values.push_back(root->val);
        inorder(root->right, values);
    }

    bool findTarget(TreeNode* root, int k) {
        vector<int> values;
        inorder(root, values);
        for (int i = 0; i < values.size(); i++) {
            for (int j = i + 1; j < values.size(); j++) {
                if (values[i] + values[j] == k)
                    return true;
            }
        }
        return false;
    }
};
```

### Complexity
- **Time:** O(N^2) — Nested loops over all pairs.
- **Space:** O(N) — To store all values.

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def findTarget(self, root, k):
        values = []
        self.inorder(root, values)
        left, right = 0, len(values) - 1
        while left < right:
            current_sum = values[left] + values[right]
            if current_sum == k:
                return True
            elif current_sum < k:
                left += 1
            else:
                right -= 1
        return False

    def inorder(self, node, values):
        if not node:
            return
        self.inorder(node.left, values)
        values.append(node.val)
        self.inorder(node.right, values)
```

**C++**
```cpp
class Solution {
public:
    void inorder(TreeNode* root, vector<int>& values) {
        if (!root) return;
        inorder(root->left, values);
        values.push_back(root->val);
        inorder(root->right, values);
    }

    bool findTarget(TreeNode* root, int k) {
        vector<int> values;
        inorder(root, values);
        int left = 0, right = values.size() - 1;
        while (left < right) {
            int sum = values[left] + values[right];
            if (sum == k)
                return true;
            else if (sum < k)
                left++;
            else
                right--;
        }
        return false;
    }
};
```

### Complexity
- **Time:** O(N) — Inorder traversal + two-pointer scan.
- **Space:** O(N) — To store all values.

## Key Insight
> BST inorder traversal produces sorted order, enabling the two-pointer technique to find pairs summing to k in O(N) time after sorting.
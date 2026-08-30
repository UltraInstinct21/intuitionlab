# Kth Smallest and Largest Element in BST

> **Difficulty:** Medium | **Topic:** Binary Search Tree, BST | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a BST and a number k, find the kth smallest and kth largest element in the BST. Return them as a pair [kth_smallest, kth_largest].

## Examples
**Example 1:**
```
Input:       10
           /    \
          5      15
         / \    / \
        2   7  12  20
    k = 2
Output: [5, 15]
```

**Example 2:**
```
Input:       10
           /    \
          5      15
         / \    / \
        2   7  12  20
    k = 3
Output: [7, 12]
```

## Constraints
- 1 ≤ Number of Nodes ≤ 10^5
- 1 ≤ Node Data ≤ 10^5
- 1 ≤ k ≤ N

## Topic Tags
`BST` `Tree` `Binary Search Tree`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N) |
| **Space** | O(N) |

## Intuition
The kth smallest element can be found using an inorder traversal (left → root → right) since it visits nodes in ascending order. The kth largest element can be found using a reverse inorder traversal (right → root → left) since it visits nodes in descending order.

We can solve both in a single pass by maintaining two counters during the traversal.

## Approach
1. Perform an inorder traversal of the BST.
2. During traversal, increment a counter for each node visited.
3. When the counter equals k, record the value as kth smallest.
4. Simultaneously track the total number of nodes, and use (N - k + 1)th position in inorder for kth largest.
5. Alternatively, do two separate traversals or use reverse inorder for kth largest.

## Brute Force
### Approach
Collect all values using inorder traversal, sort them (already sorted), and pick kth smallest (index k-1) and kth largest (index N-k).

### Code
**Python**
```python
class Solution:
    def kthSmallestLargest(self, root, k):
        result = []
        self.inorder(root, result)
        n = len(result)
        return [result[k-1], result[n-k]]

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

    vector<int> kthSmallestLargest(Node* root, int k) {
        vector<int> result;
        inorder(root, result);
        int n = result.size();
        return {result[k-1], result[n-k]};
    }
};
```

### Complexity
- **Time:** O(N) — Inorder traversal visits all nodes.
- **Space:** O(N) — To store all values.

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def kthSmallestLargest(self, root, k):
        self.count_small = 0
        self.kth_small = -1
        self.count_large = 0
        self.kth_large = -1

        def inorder(node):
            if not node:
                return
            inorder(node.left)
            self.count_small += 1
            if self.count_small == k:
                self.kth_small = node.data
            inorder(node.right)

        def reverse_inorder(node):
            if not node:
                return
            reverse_inorder(node.right)
            self.count_large += 1
            if self.count_large == k:
                self.kth_large = node.data
            reverse_inorder(node.left)

        inorder(root)
        reverse_inorder(root)
        return [self.kth_small, self.kth_large]
```

**C++**
```cpp
class Solution {
public:
    int countSmall = 0, kthSmall = -1;
    int countLarge = 0, kthLarge = -1;

    void inorder(Node* node, int k) {
        if (!node) return;
        inorder(node->left, k);
        countSmall++;
        if (countSmall == k) kthSmall = node->data;
        inorder(node->right, k);
    }

    void reverseInorder(Node* node, int k) {
        if (!node) return;
        reverseInorder(node->right, k);
        countLarge++;
        if (countLarge == k) kthLarge = node->data;
        reverseInorder(node->left, k);
    }

    vector<int> kthSmallestLargest(Node* root, int k) {
        countSmall = 0;
        kthSmall = -1;
        countLarge = 0;
        kthLarge = -1;
        inorder(root, k);
        reverseInorder(root, k);
        return {kthSmall, kthLarge};
    }
};
```

### Complexity
- **Time:** O(N) — Two traversals in worst case.
- **Space:** O(H) — Recursion stack depth equals tree height.

## Key Insight
> Inorder traversal gives ascending order (kth smallest), while reverse inorder gives descending order (kth largest); both can be computed with early termination at k visits.
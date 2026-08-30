# 106. Construct Binary Tree from Inorder and Postorder Traversal

> **Difficulty:** Medium | **Topic:** Binary Tree, Array, Divide and Conquer | **Platform:** LeetCode

---

## Problem Statement
Given two integer arrays `inorder` and `postorder` where `inorder` is the inorder traversal of a binary tree and `postorder` is the postorder traversal of the same tree, construct and return the binary tree.

## Examples
**Example 1:**
```
Input: inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]
Output: [3,9,20,null,null,15,7]
```

**Example 2:**
```
Input: inorder = [-1], postorder = [-1]
Output: [-1]
```

## Constraints
- `1 <= inorder.length <= 3000`
- `-3000 <= inorder[i], postorder[i] <= 3000`
- `inorder` and `postorder` consist of unique values.
- Every value of `postorder` also appears in `inorder`.

## Topic Tags
`Binary Tree` `Array` `Divide and Conquer` `Hash Map`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) |

## Intuition
In postorder traversal, the last element is always the root. In inorder, everything to the left of the root is the left subtree and everything to the right is the right subtree. The key difference from the preorder approach is that we process the right subtree before the left (since in postorder, right comes before left).

## Approach
1. Create a hash map for inorder values to indices.
2. Use a global postorder index that decrements (since we process from the end of postorder).
3. For a given inorder range `[left, right]`:
   - The current root is `postorder[postIdx]`. Decrement `postIdx`.
   - Find the root's position in inorder.
   - Recursively build the **right** subtree first (since postorder processes right before left).
   - Then recursively build the **left** subtree.

## Brute Force
### Approach
Scan the inorder array linearly for the root in each recursive call. Works but is less efficient.

### Complexity
- **Time:** O(n²) worst case.
- **Space:** O(n) for recursion stack.

## Optimized Solution
### Code
**Python**
```python
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def buildTree(self, inorder: List[int], postorder: List[int]) -> Optional[TreeNode]:
        inorder_map = {val: idx for idx, val in enumerate(inorder)}
        self.post_idx = len(postorder) - 1

        def build(left, right):
            if left > right:
                return None

            root_val = postorder[self.post_idx]
            self.post_idx -= 1
            root = TreeNode(root_val)

            mid = inorder_map[root_val]
            root.right = build(mid + 1, right)
            root.left = build(left, mid - 1)
            return root

        return build(0, len(inorder) - 1)
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
    int postIdx;

    TreeNode* build(vector<int>& inorder, unordered_map<int,int>& inorderMap,
                    int left, int right) {
        if (left > right) return nullptr;

        int rootVal = postorder[postIdx--];
        TreeNode* root = new TreeNode(rootVal);
        int mid = inorderMap[rootVal];

        root->right = build(inorder, inorderMap, mid + 1, right);
        root->left = build(inorder, inorderMap, left, mid - 1);
        return root;
    }

    TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
        postIdx = postorder.size() - 1;
        unordered_map<int, int> inorderMap;
        for (int i = 0; i < inorder.size(); i++) {
            inorderMap[inorder[i]] = i;
        }
        return build(inorder, inorderMap, 0, inorder.size() - 1);
    }
};
```

### Complexity
- **Time:** O(n) — each node is visited once with O(1) hash map lookups.
- **Space:** O(n) — hash map plus O(h) recursion stack.

## Key Insight
> The last element in postorder is the root, and we must build the right subtree before the left (opposite of preorder construction), because postorder processes children before the parent in right-to-left order.

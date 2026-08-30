# 105. Construct Binary Tree from Preorder and Inorder Traversal

> **Difficulty:** Medium | **Topic:** Binary Tree, Array, Divide and Conquer | **Platform:** LeetCode

---

## Problem Statement
Given two integer arrays `preorder` and `inorder` where `preorder` is the preorder traversal of a binary tree and `inorder` is the inorder traversal of the same tree, construct and return the binary tree.

## Examples
**Example 1:**
```
Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
Output: [3,9,20,null,null,15,7]
```

**Example 2:**
```
Input: preorder = [-1], inorder = [-1]
Output: [-1]
```

## Constraints
- `1 <= preorder.length <= 3000`
- `-3000 <= preorder[i], inorder[i] <= 3000`
- `preorder` and `inorder` consist of unique values.
- Each value of `inorder` also appears in `preorder`.
- Every value of `preorder` is unique.

## Topic Tags
`Binary Tree` `Array` `Divide and Conquer` `Hash Map`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) |

## Intuition
The first element in preorder is always the root. In inorder, everything to the left of the root belongs to the left subtree, and everything to the right belongs to the right subtree. We can recursively apply this logic to build the tree.

## Approach
1. Create a hash map for inorder values to their indices for O(1) lookup.
2. Use a global preorder index that advances as we assign root values.
3. For a given inorder range `[left, right]`:
   - The current root is `preorder[preIndex]`. Increment `preIndex`.
   - Find the root's position in inorder to split into left and right subtrees.
   - Recursively build the left subtree with inorder range `[left, rootIdx - 1]`.
   - Recursively build the right subtree with inorder range `[rootIdx + 1, right]`.

## Brute Force
### Approach
For each recursive call, scan the inorder array linearly to find the root index. This works but is slower without the hash map optimization.

### Complexity
- **Time:** O(n²) worst case for skewed trees due to linear scans.
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
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        inorder_map = {val: idx for idx, val in enumerate(inorder)}
        self.pre_idx = 0

        def build(left, right):
            if left > right:
                return None

            root_val = preorder[self.pre_idx]
            self.pre_idx += 1
            root = TreeNode(root_val)

            mid = inorder_map[root_val]
            root.left = build(left, mid - 1)
            root.right = build(mid + 1, right)
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
    int preIdx = 0;

    TreeNode* build(vector<int>& preorder, unordered_map<int,int>& inorderMap,
                    int left, int right) {
        if (left > right) return nullptr;

        int rootVal = preorder[preIdx++];
        TreeNode* root = new TreeNode(rootVal);
        int mid = inorderMap[rootVal];

        root->left = build(preorder, inorderMap, left, mid - 1);
        root->right = build(preorder, inorderMap, mid + 1, right);
        return root;
    }

    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        unordered_map<int, int> inorderMap;
        for (int i = 0; i < inorder.size(); i++) {
            inorderMap[inorder[i]] = i;
        }
        return build(preorder, inorderMap, 0, inorder.size() - 1);
    }
};
```

### Complexity
- **Time:** O(n) — each node is processed once; hash map lookup is O(1).
- **Space:** O(n) — hash map storage plus O(h) recursion stack.

## Key Insight
> The preorder array reveals the root at each step, while the inorder array splits nodes into left and right subtrees. A hash map on inorder indices makes root position lookup O(1), giving a clean O(n) solution.

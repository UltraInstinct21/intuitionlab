# Binary Search Tree Iterator

> **Difficulty:** Medium | **Topic:** Binary Search Tree, BST, Stack | **Platform:** LeetCode

---

## Problem Statement
Implement the BSTIterator class that represents an iterator over the in-order traversal of a binary search tree (BST):

- `BSTIterator(TreeNode root)` Initializes an object of the BSTIterator class. The root of the BST is given as part of the constructor. The pointer should be initialized to a non-existent number smaller than any element in the BST.
- `boolean hasNext()` Returns true if there exists a number in the traversal to the right of the pointer, otherwise returns false.
- `int next()` Moves the pointer to the right, then returns the number at the pointer.

You may assume that next() calls will always be valid, i.e., there will be at least a next smallest number in the BST when next() is called.

## Examples
**Example 1:**
```
Input: ["BSTIterator", "next", "next", "hasNext", "next", "hasNext", "next", "hasNext", "next", "hasNext"]
       [[[7, 3, 15, null, null, 9, 20]], [], [], [], [], [], [], [], [], []]
Output: [null, 3, 7, true, 9, true, 15, true, 20, false]

Explanation:
    7
   / \
  3   15
     /  \
    9    20

BSTIterator bSTIterator = new BSTIterator([7, 3, 15, null, null, 9, 20]);
bSTIterator.next();    // return 3
bSTIterator.next();    // return 7
bSTIterator.hasNext(); // return True
bSTIterator.next();    // return 9
bSTIterator.hasNext(); // return True
bSTIterator.next();    // return 15
bSTIterator.hasNext(); // return True
bSTIterator.next();    // return 20
bSTIterator.hasNext(); // return False
```

## Constraints
- The number of nodes in the tree is in the range [1, 10^5].
- 0 ≤ Node.val ≤ 10^6
- At most 10^5 calls will be made to next() and hasNext().
- All the calls to next() are valid.

## Topic Tags
`BST` `Stack` `Design` `Iterator`

## Expected Complexities
| | |
|---|---|
| **Time** | O(1) amortized for next() and hasNext() |
| **Space** | O(H) where H is the height of the tree |

## Intuition
The key challenge is to iterate through a BST in sorted order without pre-computing the entire traversal. We need to achieve O(1) time for both `next()` and `hasNext()` while using only O(H) space.

The insight is to use a stack to simulate the inorder traversal. We push all leftmost nodes onto the stack (from root to the leftmost node). When we call `next()`, we pop from the stack and push all leftmost nodes of the right subtree onto the stack.

This gives us:
- O(1) amortized for `next()` — each node is pushed and popped at most once.
- O(H) space — the stack stores at most H nodes at any time.

## Approach
1. **Constructor:** Initialize a stack and push all leftmost nodes starting from root.
2. **next():** Pop the top node from stack (this is the next smallest). If it has a right child, push all leftmost nodes of the right subtree.
3. **hasNext():** Return true if the stack is not empty.

## Brute Force
### Approach
Flatten the entire BST into a sorted array during construction, then iterate through it.

### Code
**Python**
```python
class BSTIterator:
    def __init__(self, root):
        self.values = []
        self.index = 0
        self.inorder(root)

    def inorder(self, node):
        if not node:
            return
        self.inorder(node.left)
        self.values.append(node.val)
        self.inorder(node.right)

    def next(self):
        val = self.values[self.index]
        self.index += 1
        return val

    def hasNext(self):
        return self.index < len(self.values)
```

**C++**
```cpp
class BSTIterator {
public:
    vector<int> values;
    int index;

    void inorder(TreeNode* node) {
        if (!node) return;
        inorder(node->left);
        values.push_back(node->val);
        inorder(node->right);
    }

    BSTIterator(TreeNode* root) : index(0) {
        inorder(root);
    }

    int next() {
        return values[index++];
    }

    bool hasNext() {
        return index < values.size();
    }
};
```

### Complexity
- **Time:** O(N) for construction, O(1) for next() and hasNext().
- **Space:** O(N) — To store all values.

## Optimized Solution
### Code
**Python**
```python
class BSTIterator:
    def __init__(self, root):
        self.stack = []
        self._push_left(root)

    def _push_left(self, node):
        while node:
            self.stack.append(node)
            node = node.left

    def next(self):
        node = self.stack.pop()
        if node.right:
            self._push_left(node.right)
        return node.val

    def hasNext(self):
        return len(self.stack) > 0
```

**C++**
```cpp
class BSTIterator {
public:
    stack<TreeNode*> stk;

    void pushLeft(TreeNode* node) {
        while (node) {
            stk.push(node);
            node = node->left;
        }
    }

    BSTIterator(TreeNode* root) {
        pushLeft(root);
    }

    int next() {
        TreeNode* node = stk.top();
        stk.pop();
        if (node->right)
            pushLeft(node->right);
        return node->val;
    }

    bool hasNext() {
        return !stk.empty();
    }
};
```

### Complexity
- **Time:** O(1) amortized — Each node is pushed and popped at most once.
- **Space:** O(H) — Stack depth equals tree height.

## Key Insight
> By using a stack to simulate inorder traversal, we achieve O(1) amortized time for next() and O(H) space, avoiding pre-computation of the entire traversal.
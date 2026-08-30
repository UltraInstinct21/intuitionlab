# Construct BST from Given Keys

> **Difficulty:** Easy | **Topic:** Binary Search Tree, Construction | **Platform:** GeeksforGeeks

---

## Problem Statement
Given an array of integers `arr[]` representing keys to be inserted into a BST, construct a BST from these keys. If there are multiple correct BSTs, return any one of them. The keys should be inserted in the order given in the array.

Note: The BST should be constructed such that for every node, all values in its left subtree are less than the node's value, and all values in its right subtree are greater.

## Examples
**Example 1:**
```
Input: arr[] = [5, 3, 7, 2, 4, 6, 8]
Output: BST with root 5, left subtree [3,2,4], right subtree [7,6,8]
        5
       / \
      3   7
     / \ / \
    2  4 6  8
```

**Example 2:**
```
Input: arr[] = [10, 5, 15, 3, 7]
Output: BST with root 10, left subtree [5,3,7], right subtree [15]
        10
       /  \
      5   15
     / \
    3   7
```

## Constraints
- `1 <= arr.length <= 1000`
- `1 <= arr[i] <= 10^6`
- All values in `arr` are **unique**

## Topic Tags
`Binary Search Tree` `Tree` `Construction` `Recursion`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N log N) average, O(N^2) worst case |
| **Space** | O(N) for tree storage, O(H) recursion stack |

## Intuition
To construct a BST from an array of keys, we insert each key one by one into the BST. For each key, we start from the root and traverse down: if the key is less than the current node, we go left; if greater, we go right. We continue until we find an empty spot (NULL), where we insert the new node.

The order of insertion matters - different orders can produce different BSTs. Since we're given a specific order, we follow it directly.

## Approach
1. Create the root node with the first element of the array.
2. For each subsequent element in the array:
   a. Start from the root.
   b. Compare the element with current node's value.
   c. If smaller, move to left child; if larger, move to right child.
   d. When we reach an empty spot, insert the new node there.
3. Return the root of the constructed BST.

## Brute Force
### Approach
Insert each element by traversing from root each time. For each new key, compare with root, then go left or right until finding an empty spot.
### Code
**Python**
```python
class Node:
    def __init__(self, key):
        self.data = key
        self.left = None
        self.right = None

def insert(root, key):
    if root is None:
        return Node(key)
    
    if key < root.data:
        root.left = insert(root.left, key)
    elif key > root.data:
        root.right = insert(root.right, key)
    
    return root

def constructBST(keys):
    if not keys:
        return None
    
    root = None
    for key in keys:
        root = insert(root, key)
    
    return root
```

**C++**
```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int data;
    Node *left;
    Node *right;
    
    Node(int val) {
        data = val;
        left = right = NULL;
    }
};

Node* insert(Node* root, int key) {
    if (root == NULL) {
        return new Node(key);
    }
    
    if (key < root->data) {
        root->left = insert(root->left, key);
    } else if (key > root->data) {
        root->right = insert(root->right, key);
    }
    
    return root;
}

Node* constructBST(vector<int>& keys) {
    if (keys.empty()) return NULL;
    
    Node* root = NULL;
    for (int key : keys) {
        root = insert(root, key);
    }
    
    return root;
}
```
### Complexity
- Time: O(N^2) worst case (skewed tree), O(N log N) average
- Space: O(N) for storing nodes, O(H) recursion stack

## Optimized Solution
### Code
**Python**
```python
class Node:
    def __init__(self, key):
        self.data = key
        self.left = None
        self.right = None

def insert(root, key):
    if root is None:
        return Node(key)
    
    if key < root.data:
        root.left = insert(root.left, key)
    elif key > root.data:
        root.right = insert(root.right, key)
    
    return root

def constructBST(keys):
    if not keys:
        return None
    
    root = None
    for key in keys:
        root = insert(root, key)
    
    return root
```

**C++**
```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int data;
    Node *left;
    Node *right;
    
    Node(int val) {
        data = val;
        left = right = NULL;
    }
};

Node* insert(Node* root, int key) {
    if (root == NULL) {
        return new Node(key);
    }
    
    if (key < root->data) {
        root->left = insert(root->left, key);
    } else if (key > root->data) {
        root->right = insert(root->right, key);
    }
    
    return root;
}

Node* constructBST(vector<int>& keys) {
    if (keys.empty()) return NULL;
    
    Node* root = NULL;
    for (int key : keys) {
        root = insert(root, key);
    }
    
    return root;
}
```
### Complexity
- Time: O(N^2) worst case, O(N log N) average
- Space: O(N) for tree, O(H) recursion stack

## Key Insight
> Each insertion follows a path from root to a leaf, making it equivalent to searching for where the key belongs in the BST structure. The BST property ensures each key finds its unique correct position.

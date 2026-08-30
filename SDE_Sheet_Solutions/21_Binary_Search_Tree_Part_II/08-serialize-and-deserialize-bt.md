# Serialize and Deserialize Binary Tree

> **Difficulty:** Hard | **Topic:** Binary Tree, BFS, DFS, Design | **Platform:** LeetCode

---

## Problem Statement
Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.

## Examples
**Example 1:**
```
Input: root = [1,2,3,null,null,4,5]
    1
   / \
  2   3
     / \
    4   5
Output: [1,2,3,null,null,4,5]
```

**Example 2:**
```
Input: root = []
Output: []
```

## Constraints
- The number of nodes in the tree is in the range [0, 10^4].
- -1000 ≤ Node.val ≤ 1000

## Topic Tags
`Tree` `BFS` `DFS` `Design` `Binary Tree`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N) for both serialize and deserialize |
| **Space** | O(N) for storing the serialized string and reconstruction |

## Intuition
Serialization is the process of converting a tree into a string representation, and deserialization is the reverse process. The key challenge is to preserve the tree structure so we can reconstruct it exactly.

**Approach 1 (Pre-order DFS):** Traverse the tree in pre-order (root → left → right). For each node, append its value to the string. Use a special marker (like "null" or "#") for null nodes. This naturally captures the tree structure.

**Approach 2 (Level-order BFS):** Use level-order traversal. For each level, append all node values. Use markers for null children. This produces a level-order representation similar to LeetCode's format.

The pre-order approach is simpler to implement recursively, while the BFS approach is more intuitive for understanding the tree level by level.

## Approach
1. **Serialize (Pre-order DFS):**
   - If node is null, append "null" to the string.
   - Otherwise, append the node's value.
   - Recursively serialize left and right subtrees.
   - Join all values with a delimiter.

2. **Deserialize (Pre-order DFS):**
   - Split the string by delimiter to get a list of values.
   - Use a pointer to consume values one by one.
   - If value is "null", return null.
   - Otherwise, create a node with the value.
   - Recursively deserialize left and right subtrees.

## Brute Force
### Approach
Use level-order traversal with null markers. This produces a representation similar to LeetCode's array format.

### Code
**Python**
```python
class Codec:
    def serialize(self, root):
        if not root:
            return ""
        result = []
        queue = [root]
        while queue:
            node = queue.pop(0)
            if node:
                result.append(str(node.val))
                queue.append(node.left)
                queue.append(node.right)
            else:
                result.append("null")
        return ",".join(result)

    def deserialize(self, data):
        if not data:
            return None
        values = data.split(",")
        root = TreeNode(int(values[0]))
        queue = [root]
        i = 1
        while queue and i < len(values):
            node = queue.pop(0)
            if values[i] != "null":
                node.left = TreeNode(int(values[i]))
                queue.append(node.left)
            i += 1
            if i < len(values) and values[i] != "null":
                node.right = TreeNode(int(values[i]))
                queue.append(node.right)
            i += 1
        return root
```

**C++**
```cpp
class Codec {
public:
    string serialize(TreeNode* root) {
        if (!root) return "";
        string result;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            TreeNode* node = q.front();
            q.pop();
            if (node) {
                result += to_string(node->val) + ",";
                q.push(node->left);
                q.push(node->right);
            } else {
                result += "null,";
            }
        }
        result.pop_back();
        return result;
    }

    TreeNode* deserialize(string data) {
        if (data.empty()) return nullptr;
        stringstream ss(data);
        string item;
        getline(ss, item, ',');
        TreeNode* root = new TreeNode(stoi(item));
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            TreeNode* node = q.front();
            q.pop();
            if (getline(ss, item, ',') && item != "null") {
                node->left = new TreeNode(stoi(item));
                q.push(node->left);
            }
            if (getline(ss, item, ',') && item != "null") {
                node->right = new TreeNode(stoi(item));
                q.push(node->right);
            }
        }
        return root;
    }
};
```

### Complexity
- **Time:** O(N) — Each node is visited once.
- **Space:** O(N) — Queue and string storage.

## Optimized Solution
### Code
**Python**
```python
class Codec:
    def serialize(self, root):
        result = []
        self._serialize_helper(root, result)
        return ",".join(result)

    def _serialize_helper(self, node, result):
        if not node:
            result.append("null")
            return
        result.append(str(node.val))
        self._serialize_helper(node.left, result)
        self._serialize_helper(node.right, result)

    def deserialize(self, data):
        values = iter(data.split(","))
        return self._deserialize_helper(values)

    def _deserialize_helper(self, values):
        val = next(values)
        if val == "null":
            return None
        node = TreeNode(int(val))
        node.left = self._deserialize_helper(values)
        node.right = self._deserialize_helper(values)
        return node
```

**C++**
```cpp
class Codec {
public:
    void serializeHelper(TreeNode* node, string& result) {
        if (!node) {
            result += "null,";
            return;
        }
        result += to_string(node->val) + ",";
        serializeHelper(node->left, result);
        serializeHelper(node->right, result);
    }

    string serialize(TreeNode* root) {
        string result;
        serializeHelper(root, result);
        result.pop_back();
        return result;
    }

    TreeNode* deserializeHelper(istringstream& ss) {
        string item;
        getline(ss, item, ',');
        if (item == "null")
            return nullptr;
        TreeNode* node = new TreeNode(stoi(item));
        node->left = deserializeHelper(ss);
        node->right = deserializeHelper(ss);
        return node;
    }

    TreeNode* deserialize(string data) {
        istringstream ss(data);
        return deserializeHelper(ss);
    }
};
```

### Complexity
- **Time:** O(N) — Each node is visited exactly once during serialization and deserialization.
- **Space:** O(N) — String storage and recursion stack.

## Key Insight
> Using pre-order traversal with null markers preserves the exact tree structure; the recursive approach naturally handles the order of node creation during deserialization.
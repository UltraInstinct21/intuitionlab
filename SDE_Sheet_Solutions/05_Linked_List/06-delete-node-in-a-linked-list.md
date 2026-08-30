# 237. Delete Node in a Linked List

> **Difficulty:** Medium | **Topic:** Linked List | **LeetCode:** [237](https://leetcode.com/problems/delete-node-in-a-linked-list/)

---

## Problem Statement

There is a singly-linked list head and we want to delete a node `node` in it.

Given the node to be deleted, we are given **access only to that node** and not the head. The function should not return anything.

You are guaranteed that all nodes in the linked list are **unique** and the value of `node` is **not** the tail node.

---

## Examples

**Example 1:**
```
Input: head = [4,5,1,9], node = 5
Output: [4,1,9]
Explanation: Node with value 5 is deleted.
```

**Example 2:**
```
Input: head = [4,5,1,9], node = 1
Output: [4,5,9]
```

---

## Constraints

- `The number of nodes in the given list is in the range [2, 1000]`
- `-1000 <= Node.val <= 1000`
- The value of each node in the list is **unique**.
- The `node` to be deleted is **in the list** and is **not a tail node**.

---

## Topic Tags

`Linked List`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(1) |
| **Space** | O(1) |

---

## Intuition

Copy the value from the next node into the current node, then delete the next node. This effectively "deletes" the given node by replacing it with the next one.

---

## Approach

1. Copy the value from the next node to the current node
2. Skip the next node by pointing to the node after it
3. This effectively deletes the current node by replacing it with the next

---

## Optimized Solution

### Code

**Python**
```python
class Solution:
    def deleteNode(self, node: ListNode):
        node.val = node.next.val
        node.next = node.next.next
```

**C++**
```cpp
class Solution {
public:
    void deleteNode(ListNode* node) {
        node->val = node->next->val;
        node->next = node->next->next;
    }
};
```

### Complexity
- **Time:** O(1)
- **Space:** O(1)

---

## Key Insight

> Since we can't access the previous node, we copy the next node's value into the current node and skip the next node. This effectively "deletes" the given node.

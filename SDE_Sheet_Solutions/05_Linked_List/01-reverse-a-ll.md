# 206. Reverse Linked List

> **Difficulty:** Easy | **Topic:** Linked List, Recursion | **LeetCode:** [206](https://leetcode.com/problems/reverse-linked-list/)

---

## Problem Statement

Given the `head` of a singly linked list, reverse the list, and return the reversed list.

---

## Examples

**Example 1:**
```
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]
```

**Example 2:**
```
Input: head = [1,2]
Output: [2,1]
```

---

## Constraints

- `0 <= The number of nodes in the list <= 5000`
- `-5000 <= Node.val <= 5000`

---

## Topic Tags

`Linked List` `Recursion`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) iterative, O(n) recursive |

---

## Intuition

Reverse the pointers of each node to point to the previous node instead of the next. Use three pointers: prev, current, and next.

---

## Approach (Iterative)

1. Initialize `prev = None`, `current = head`
2. While current is not None:
   - Store next node
   - Reverse the pointer
   - Move prev and current forward
3. Return prev as new head

---

## Optimized Solution

### Code

**Python**
```python
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        current = head
        
        while current:
            next_node = current.next
            current.next = prev
            prev = current
            current = next_node
        
        return prev
```

**C++**
```cpp
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* current = head;
        
        while (current) {
            ListNode* nextNode = current->next;
            current->next = prev;
            prev = current;
            current = nextNode;
        }
        
        return prev;
    }
};
```

### Complexity
- **Time:** O(n)
- **Space:** O(1)

---

## Key Insight

> Use three pointers to reverse the links. At each step, reverse the current node's pointer and move all pointers forward.

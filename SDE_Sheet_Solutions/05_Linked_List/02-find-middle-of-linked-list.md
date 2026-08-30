# 876. Middle of the Linked List

> **Difficulty:** Easy | **Topic:** Linked List, Two Pointers | **LeetCode:** [876](https://leetcode.com/problems/middle-of-the-linked-list/)

---

## Problem Statement

Given the `head` of a singly linked list, return the middle node of the linked list.

If there are two middle nodes, return the second middle node.

---

## Examples

**Example 1:**
```
Input: head = [1,2,3,4,5]
Output: [3,4,5]
Explanation: The middle node is node 3.
```

**Example 2:**
```
Input: head = [1,2,3,4,5,6]
Output: [4,5,6]
Explanation: The middle node is node 4.
```

---

## Constraints

- `1 <= The number of nodes in the list <= 100`
- `1 <= Node.val <= 100`

---

## Topic Tags

`Linked List` `Two Pointers`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Intuition

Use slow and fast pointers. Slow moves one step, fast moves two steps. When fast reaches the end, slow is at the middle.

---

## Approach

1. Initialize slow and fast pointers at head
2. Move slow one step, fast two steps
3. When fast reaches end, slow is at middle
4. Return slow

---

## Optimized Solution

### Code

**Python**
```python
class Solution:
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        slow = fast = head
        
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        
        return slow
```

**C++**
```cpp
class Solution {
public:
    ListNode* middleNode(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;
        
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
        }
        
        return slow;
    }
};
```

### Complexity
- **Time:** O(n)
- **Space:** O(1)

---

## Key Insight

> Two pointers (slow and fast) technique: slow moves 1 step, fast moves 2 steps. When fast reaches end, slow is at middle.

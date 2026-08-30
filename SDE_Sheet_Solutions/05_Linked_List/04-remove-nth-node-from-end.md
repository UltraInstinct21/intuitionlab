# 19. Remove Nth Node From End of List

> **Difficulty:** Medium | **Topic:** Linked List, Two Pointers | **LeetCode:** [19](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)

---

## Problem Statement

Given the `head` of a linked list, remove the `nth` node from the end of the list and return its head.

---

## Examples

**Example 1:**
```
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]
```

**Example 2:**
```
Input: head = [1], n = 1
Output: []
```

---

## Constraints

- `The number of nodes in the list is sz.`
- `1 <= sz <= 30`
- `0 <= Node.val <= 100`
- `1 <= n <= sz`

---

## Topic Tags

`Linked List` `Two Pointers`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(L) |
| **Space** | O(1) |

---

## Intuition

Use two pointers with a gap of n. When the second pointer reaches the end, the first pointer is at the node to remove. Use a dummy node to handle edge cases.

---

## Approach

1. Create a dummy node pointing to head
2. Move first pointer n+1 steps ahead
3. Move both pointers until first reaches end
4. Second pointer is at the node before the one to remove
5. Remove the node

---

## Optimized Solution

### Code

**Python**
```python
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        fast = slow = dummy
        
        # Move fast n+1 steps ahead
        for _ in range(n + 1):
            fast = fast.next
        
        # Move both until fast reaches end
        while fast:
            fast = fast.next
            slow = slow.next
        
        # Remove the node
        slow.next = slow.next.next
        
        return dummy.next
```

**C++**
```cpp
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0);
        dummy.next = head;
        ListNode* fast = &dummy;
        ListNode* slow = &dummy;
        
        for (int i = 0; i <= n; i++)
            fast = fast->next;
        
        while (fast) {
            fast = fast->next;
            slow = slow->next;
        }
        
        slow->next = slow->next->next;
        return dummy.next;
    }
};
```

### Complexity
- **Time:** O(L) where L is the length of list
- **Space:** O(1)

---

## Key Insight

> Two pointers with a gap of n. When fast reaches end, slow is at the node before the one to remove. Use dummy node for edge cases.

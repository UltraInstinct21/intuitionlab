# 21. Merge Two Sorted Lists

> **Difficulty:** Easy | **Topic:** Linked List, Recursion | **LeetCode:** [21](https://leetcode.com/problems/merge-two-sorted-lists/)

---

## Problem Statement

Given the `head` of two sorted linked lists, merge them into one sorted list and return the head of the merged list.

---

## Examples

**Example 1:**
```
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
```

**Example 2:**
```
Input: list1 = [], list2 = []
Output: []
```

---

## Constraints

- `0 <= The number of nodes in both lists <= 50`
- `-100 <= Node.val <= 100`
- Both lists are sorted in non-decreasing order.

---

## Topic Tags

`Linked List` `Recursion`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n + m) |
| **Space** | O(1) |

---

## Intuition

Compare heads of both lists, attach the smaller node to the result, and continue. Use a dummy node to simplify edge cases.

---

## Approach

1. Create a dummy node
2. Compare heads, attach smaller to result
3. Move the pointer of the list from which node was taken
4. Continue until one list is exhausted
5. Attach remaining nodes from the other list

---

## Optimized Solution

### Code

**Python**
```python
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0)
        current = dummy
        
        while list1 and list2:
            if list1.val <= list2.val:
                current.next = list1
                list1 = list1.next
            else:
                current.next = list2
                list2 = list2.next
            current = current.next
        
        current.next = list1 or list2
        return dummy.next
```

**C++**
```cpp
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode dummy(0);
        ListNode* current = &dummy;
        
        while (list1 && list2) {
            if (list1->val <= list2->val) {
                current->next = list1;
                list1 = list1->next;
            } else {
                current->next = list2;
                list2 = list2->next;
            }
            current = current->next;
        }
        
        current->next = list1 ? list1 : list2;
        return dummy.next;
    }
};
```

### Complexity
- **Time:** O(n + m)
- **Space:** O(1)

---

## Key Insight

> Use a dummy node to simplify handling the head. Compare and attach the smaller node, then attach remaining nodes from the non-empty list.

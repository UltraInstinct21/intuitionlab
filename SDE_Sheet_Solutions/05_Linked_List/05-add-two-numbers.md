# 2. Add Two Numbers

> **Difficulty:** Medium | **Topic:** Linked List, Math, Recursion | **LeetCode:** [2](https://leetcode.com/problems/add-two-numbers/)

---

## Problem Statement

You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

---

## Examples

**Example 1:**
```
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.
```

**Example 2:**
```
Input: l1 = [0], l2 = [0]
Output: [0]
```

---

## Constraints

- `The number of nodes in each linked list is in the range [1, 100].`
- `0 <= Node.val <= 9`
- `It is guaranteed that the list represents a number that does not have leading zeros.`

---

## Topic Tags

`Linked List` `Math` `Recursion`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(max(m, n)) |
| **Space** | O(max(m, n)) |

---

## Intuition

Traverse both lists, add corresponding digits along with carry. Create new nodes for each digit of the sum.

---

## Approach

1. Initialize dummy node and carry = 0
2. While both lists have nodes or carry exists:
   - Add values from both lists plus carry
   - Create new node with digit (sum % 10)
   - Update carry (sum / 10)
3. Return dummy.next

---

## Optimized Solution

### Code

**Python**
```python
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0)
        current = dummy
        carry = 0
        
        while l1 or l2 or carry:
            val1 = l1.val if l1 else 0
            val2 = l2.val if l2 else 0
            
            total = val1 + val2 + carry
            carry = total // 10
            current.next = ListNode(total % 10)
            current = current.next
            
            l1 = l1.next if l1 else None
            l2 = l2.next if l2 else None
        
        return dummy.next
```

**C++**
```cpp
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* current = &dummy;
        int carry = 0;
        
        while (l1 || l2 || carry) {
            int val1 = l1 ? l1->val : 0;
            int val2 = l2 ? l2->val : 0;
            
            int total = val1 + val2 + carry;
            carry = total / 10;
            current->next = new ListNode(total % 10);
            current = current->next;
            
            l1 = l1 ? l1->next : nullptr;
            l2 = l2 ? l2->next : nullptr;
        }
        
        return dummy.next;
    }
};
```

### Complexity
- **Time:** O(max(m, n))
- **Space:** O(max(m, n))

---

## Key Insight

> Traverse both lists simultaneously, add digits with carry. Create new nodes for each sum digit. Handle lists of different lengths and final carry.

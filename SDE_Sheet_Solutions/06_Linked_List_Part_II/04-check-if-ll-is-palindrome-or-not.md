# 234. Palindrome Linked List

> **Difficulty:** Easy | **Topic:** Linked List, Two Pointers, Stack | **LeetCode:** [#234](https://leetcode.com/problems/palindrome-linked-list/)

---

## Problem Statement
Given the `head` of a singly linked list, return `true` if it is a palindrome or `false` otherwise.

## Examples
**Example 1:**
```
Input: head = [1,2,2,1]
Output: true
```

**Example 2:**
```
Input: head = [1,2]
Output: false
```

## Constraints
- The number of nodes in the list is in the range `[1, 10^5]`.
- `0 <= Node.val <= 9`

## Topic Tags
`Linked List` `Two Pointers` `Stack` `Recursion`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

## Intuition
To check if a linked list is a palindrome, we need to compare the first half with the reversed second half. The optimal approach is to find the middle of the list using the slow-fast pointer technique, reverse the second half, and then compare both halves node by node. This achieves O(n) time and O(1) space.

## Approach
1. Use slow and fast pointers to find the middle of the linked list.
2. Reverse the second half of the list starting from the slow pointer.
3. Compare the first half with the reversed second half.
4. (Optional) Restore the list by reversing the second half again.

## Brute Force
### Approach
Use a stack to store all values, then traverse the list again while comparing with the stack's top (which gives values in reverse order).

### Code
**Python**
```python
# Brute Force using Stack - O(n) time, O(n) space
class Solution:
    def isPalindrome(self, head: Optional[ListNode]) -> bool:
        stack = []
        current = head
        while current:
            stack.append(current.val)
            current = current.next

        current = head
        while current:
            if current.val != stack.pop():
                return False
            current = current.next

        return True
```

**C++**
```cpp
// Brute Force using Stack - O(n) time, O(n) space
class Solution {
public:
    bool isPalindrome(ListNode* head) {
        stack<int> stk;
        ListNode* current = head;
        while (current) {
            stk.push(current->val);
            current = current->next;
        }

        current = head;
        while (current) {
            if (current->val != stk.top()) return false;
            stk.pop();
            current = current->next;
        }

        return true;
    }
};
```
### Complexity
- Time: O(n) — two passes through the list
- Space: O(n) — stack stores all n values

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def isPalindrome(self, head: Optional[ListNode]) -> bool:
        if not head or not head.next:
            return True

        # Find the middle using slow and fast pointers
        slow, fast = head, head
        while fast.next and fast.next.next:
            slow = slow.next
            fast = fast.next.next

        # Reverse the second half
        prev, curr = None, slow.next
        slow.next = None
        while curr:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node

        # Compare first half with reversed second half
        first, second = head, prev
        while second:
            if first.val != second.val:
                return False
            first = first.next
            second = second.next

        return True
```

**C++**
```cpp
class Solution {
public:
    bool isPalindrome(ListNode* head) {
        if (!head || !head->next) return true;

        // Find the middle using slow and fast pointers
        ListNode *slow = head, *fast = head;
        while (fast->next && fast->next->next) {
            slow = slow->next;
            fast = fast->next->next;
        }

        // Reverse the second half
        ListNode* prev = nullptr;
        ListNode* curr = slow->next;
        slow->next = nullptr;
        while (curr) {
            ListNode* nextNode = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nextNode;
        }

        // Compare first half with reversed second half
        ListNode *first = head, *second = prev;
        while (second) {
            if (first->val != second->val) return false;
            first = first->next;
            second = second->next;
        }

        return true;
    }
};
```
### Complexity
- Time: O(n) — finding middle, reversing, and comparing all take O(n)
- Space: O(1) — only a constant number of pointers used

## Key Insight
> Find the middle with slow-fast pointers, reverse the second half, and compare both halves — this checks for palindrome in O(n) time and O(1) space.

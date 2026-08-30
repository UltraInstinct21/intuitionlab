# 25. Reverse Nodes in k-Group

> **Difficulty:** Hard | **Topic:** Linked List, Recursion | **LeetCode:** [#25](https://leetcode.com/problems/reverse-nodes-in-k-group/)

---

## Problem Statement
Given the `head` of a linked list, reverse the nodes of the list `k` at a time, and return the modified list.

`k` is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of `k`, then the left-out nodes, in the end, should remain as they are.

You may not alter the values in the list's nodes, only nodes themselves may be changed.

## Examples
**Example 1:**
```
Input: head = [1,2,3,4,5], k = 2
Output: [2,1,4,3,5]
```

**Example 2:**
```
Input: head = [1,2,3,4,5], k = 3
Output: [3,2,1,4,5]
```

## Constraints
- The number of nodes in the list is `n`.
- `1 <= k <= n <= 5000`
- `0 <= Node.val <= 1000`

## Topic Tags
`Linked List` `Recursion` `Stack`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

## Intuition
We need to reverse every k nodes in the linked list. The approach involves identifying a group of k nodes, reversing them, and then connecting the reversed group to the previously processed part. This process repeats until we have fewer than k nodes remaining. We can use an iterative approach with a dummy node to simplify edge cases, or a recursive approach that processes each group.

## Approach
1. Create a dummy node that points to the head for easier handling of edge cases.
2. For each group:
   a. Check if there are at least k nodes remaining.
   b. If yes, reverse the k nodes.
   c. Connect the reversed group to the previous part.
   d. Move the pointer to the end of the reversed group.
3. If fewer than k nodes remain, leave them as-is.

## Brute Force
### Approach
Convert the linked list to an array, reverse every k elements in the array, then rebuild the linked list. This is simpler but uses extra space.

### Code
**Python**
```python
# Brute Force using Array - O(n) time, O(n) space
class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        # Store all values
        values = []
        current = head
        while current:
            values.append(current.val)
            current = current.next

        # Reverse in groups of k
        for i in range(0, len(values), k):
            if i + k <= len(values):
                values[i:i+k] = reversed(values[i:i+k])

        # Rebuild linked list
        dummy = ListNode(0)
        current = dummy
        for val in values:
            current.next = ListNode(val)
            current = current.next

        return dummy.next
```

**C++**
```cpp
// Brute Force using Vector - O(n) time, O(n) space
class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        vector<int> values;
        ListNode* current = head;
        while (current) {
            values.push_back(current->val);
            current = current->next;
        }

        for (int i = 0; i < values.size(); i += k) {
            if (i + k <= values.size()) {
                reverse(values.begin() + i, values.begin() + i + k);
            }
        }

        ListNode* dummy = new ListNode(0);
        current = dummy;
        for (int val : values) {
            current->next = new ListNode(val);
            current = current->next;
        }

        return dummy->next;
    }
};
```
### Complexity
- Time: O(n) — two passes through the list
- Space: O(n) — array to store all values

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        def reverse(start: ListNode, end: ListNode) -> ListNode:
            prev, curr = None, start
            while curr != end:
                next_node = curr.next
                curr.next = prev
                prev = curr
                curr = next_node
            return prev

        dummy = ListNode(0, head)
        group_prev = dummy

        while True:
            # Check if k nodes exist
            kth = group_prev
            for _ in range(k):
                kth = kth.next
                if not kth:
                    return dummy.next

            group_next = kth.next
            prev, curr = kth.next, group_prev.next
            group_prev.next = kth  # Connect to reversed group

            # Reverse the group
            while curr != group_next:
                next_node = curr.next
                curr.next = prev
                prev = curr
                curr = next_node

            # Move group_prev to the end of reversed group
            group_prev = group_prev.next  # This is now the tail of reversed group

        return dummy.next
```

**C++**
```cpp
class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        ListNode* dummy = new ListNode(0, head);
        ListNode* groupPrev = dummy;

        while (true) {
            // Check if k nodes exist
            ListNode* kth = groupPrev;
            for (int i = 0; i < k; i++) {
                kth = kth->next;
                if (!kth) return dummy->next;
            }

            ListNode* groupNext = kth->next;
            ListNode* prev = groupNext;
            ListNode* curr = groupPrev->next;
            groupPrev->next = kth; // Connect to reversed group

            // Reverse the group
            while (curr != groupNext) {
                ListNode* nextNode = curr->next;
                curr->next = prev;
                prev = curr;
                curr = nextNode;
            }

            // Move group_prev to the end of reversed group
            groupPrev = groupPrev->next; // This is now the tail of reversed group
        }

        return dummy->next;
    }
};
```
### Complexity
- Time: O(n) — each node is visited at most twice (once to check count, once to reverse)
- Space: O(1) — only a constant number of pointers used

## Key Insight
> Use a dummy node to handle edge cases, and for each group of k nodes, reverse them in-place by iterating through the list, checking if k nodes exist before reversing.

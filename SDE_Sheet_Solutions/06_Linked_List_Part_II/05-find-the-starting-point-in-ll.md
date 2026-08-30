# 142. Linked List Cycle II

> **Difficulty:** Medium | **Topic:** Linked List, Two Pointers | **LeetCode:** [#142](https://leetcode.com/problems/linked-list-cycle-ii/)

---

## Problem Statement
Given the `head` of a linked list, return the node where the cycle begins. If there is no cycle, return `null`.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer. Internally, `pos` is used to denote the index of the node that `tail`'s `next` pointer is connected to. **Note that `pos` is not passed as a parameter**.

**Do not modify** the linked list.

## Examples
**Example 1:**
```
Input: head = [3,2,0,-4], pos = 1
Output: tail connects to node index 1
Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).
```

**Example 2:**
```
Input: head = [1,2], pos = 0
Output: tail connects to node index 0
Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.
```

**Example 3:**
```
Input: head = [1], pos = -1
Output: no cycle
Explanation: There is no cycle in the linked list.
```

## Constraints
- The number of the nodes in the list is in the range `[0, 10^4]`.
- `-10^5 <= Node.val <= 10^5`
- `pos` is `-1` or a valid index in the linked list.

## Topic Tags
`Linked List` `Two Pointers`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

## Intuition
This extends Floyd's Cycle Detection Algorithm. After detecting a cycle using slow and fast pointers (they meet inside the cycle), we need to find where the cycle begins. The mathematical proof shows: if we place one pointer at the head and another at the meeting point, and move both one step at a time, they will meet at the cycle's start node. This is because the distance from head to cycle start equals the distance from meeting point to cycle start (going around the cycle).

## Approach
1. Use slow and fast pointers to detect if a cycle exists.
2. If a cycle is detected (slow == fast), reset one pointer to head.
3. Move both pointers one step at a time until they meet — that's the cycle start.
4. If no cycle (fast reaches null), return null.

## Brute Force
### Approach
Use a hash set to store visited nodes. The first node that appears again is the cycle start.

### Code
**Python**
```python
# Brute Force using Hash Set - O(n) time, O(n) space
class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        visited = set()
        current = head
        while current:
            if current in visited:
                return current
            visited.add(current)
            current = current.next
        return None
```

**C++**
```cpp
// Brute Force using Hash Set - O(n) time, O(n) space
class Solution {
public:
    ListNode *detectCycle(ListNode *head) {
        unordered_set<ListNode*> visited;
        ListNode* current = head;
        while (current) {
            if (visited.count(current)) return current;
            visited.insert(current);
            current = current->next;
        }
        return nullptr;
    }
};
```
### Complexity
- Time: O(n) — each node visited at most once
- Space: O(n) — hash set stores up to n nodes

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head or not head.next:
            return None

        # Phase 1: Detect if cycle exists
        slow, fast = head, head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast:
                # Phase 2: Find the start of the cycle
                ptr = head
                while ptr != slow:
                    ptr = ptr.next
                    slow = slow.next
                return ptr

        return None
```

**C++**
```cpp
class Solution {
public:
    ListNode *detectCycle(ListNode *head) {
        if (!head || !head->next) return nullptr;

        // Phase 1: Detect if cycle exists
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) {
                // Phase 2: Find the start of the cycle
                ListNode* ptr = head;
                while (ptr != slow) {
                    ptr = ptr->next;
                    slow = slow->next;
                }
                return ptr;
            }
        }

        return nullptr;
    }
};
```
### Complexity
- Time: O(n) — phase 1 takes at most n steps, phase 2 takes at most n steps
- Space: O(1) — only a constant number of pointers used

## Key Insight
> After Floyd's algorithm detects a cycle (slow meets fast), resetting one pointer to head and moving both at same speed will make them meet at the cycle start — this is a mathematical property of the cycle structure.

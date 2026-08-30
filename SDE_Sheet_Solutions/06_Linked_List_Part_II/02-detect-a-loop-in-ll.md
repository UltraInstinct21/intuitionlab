# 141. Linked List Cycle

> **Difficulty:** Easy | **Topic:** Linked List, Two Pointers | **LeetCode:** [#141](https://leetcode.com/problems/linked-list-cycle/)

---

## Problem Statement
Given `head`, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer. Internally, `pos` is used to denote the index of the node that `tail`'s `next` pointer is connected to. **Note that `pos` is not passed as a parameter**.

Return `true` if there is a cycle in the linked list. Otherwise, return `false`.

## Examples
**Example 1:**
```
Input: head = [3,2,0,-4], pos = 1
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).
```

**Example 2:**
```
Input: head = [1,2], pos = 0
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.
```

**Example 3:**
```
Input: head = [1], pos = -1
Output: false
Explanation: There is no cycle in the linked list.
```

## Constraints
- The number of the nodes in the list is in the range `[0, 10^4]`.
- `-10^5 <= Node.val <= 10^5`
- `pos` is `-1` or a valid index in the linked list.

## Topic Tags
`Linked List` `Two Pointers` `Hash Table`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

## Intuition
The classic approach to detect a cycle is Floyd's Cycle Detection Algorithm (Tortoise and Hare). We use two pointers moving at different speeds. If there is a cycle, the fast pointer will eventually meet the slow pointer inside the cycle. If there is no cycle, the fast pointer will reach the end of the list (null).

## Approach
1. Initialize `slow` and `fast` pointers both at `head`.
2. Move `slow` one step at a time and `fast` two steps at a time.
3. If there is a cycle, `fast` will eventually equal `slow` inside the cycle.
4. If there is no cycle, `fast` (or `fast.next`) will reach null.

## Brute Force
### Approach
Use a hash set to store all visited nodes. If we encounter a node that's already in the set, there's a cycle.

### Code
**Python**
```python
# Brute Force using Hash Set - O(n) time, O(n) space
class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        visited = set()
        current = head
        while current:
            if current in visited:
                return True
            visited.add(current)
            current = current.next
        return False
```

**C++**
```cpp
// Brute Force using Hash Set - O(n) time, O(n) space
class Solution {
public:
    bool hasCycle(ListNode *head) {
        unordered_set<ListNode*> visited;
        ListNode *current = head;
        while (current) {
            if (visited.count(current)) return true;
            visited.insert(current);
            current = current->next;
        }
        return false;
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
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        if not head or not head.next:
            return False

        slow, fast = head, head.next

        while slow != fast:
            if not fast or not fast.next:
                return False
            slow = slow.next
            fast = fast.next.next

        return True
```

**C++**
```cpp
class Solution {
public:
    bool hasCycle(ListNode *head) {
        if (!head || !head->next) return false;

        ListNode *slow = head, *fast = head->next;

        while (slow != fast) {
            if (!fast || !fast->next) return false;
            slow = slow->next;
            fast = fast->next->next;
        }

        return true;
    }
};
```
### Complexity
- Time: O(n) — in the worst case, the fast pointer meets the slow pointer in at most n steps
- Space: O(1) — only two pointers used

## Key Insight
> Floyd's Tortoise and Hare algorithm: a fast pointer (2x speed) and slow pointer (1x speed) will meet if and only if there is a cycle, using constant space.

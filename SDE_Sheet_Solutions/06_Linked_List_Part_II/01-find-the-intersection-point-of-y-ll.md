# 160. Intersection of Two Linked Lists

> **Difficulty:** Easy | **Topic:** Linked List, Two Pointers | **LeetCode:** [#160](https://leetcode.com/problems/intersection-of-two-linked-lists/)

---

## Problem Statement
Given the heads of two singly linked-lists `headA` and `headB`, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return `null`.

The test case is generated such that there are no cycles anywhere in the entire linked structure.

Note that the linked lists must retain their original structure after the function returns.

## Examples
**Example 1:**
```
Input: intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
Output: Intersected at '8'
```

**Example 2:**
```
Input: intersectVal = 2, listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
Output: Intersected at '2'
```

**Example 3:**
```
Input: intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
Output: No intersection
```

## Constraints
- The number of nodes of `listA` is `m`.
- The number of nodes of `listB` is `n`.
- `1 <= m, n <= 3 * 10^4`
- `1 <= Node.val <= 10^5`
- `0 <= skipA <= m`
- `0 <= skipB <= n`
- It is guaranteed that `headA` is not null.
- It is guaranteed that `headB` is null or not null.

## Topic Tags
`Linked List` `Two Pointers`

## Expected Complexities
| | |
|---|---|
| **Time** | O(m + n) |
| **Space** | O(1) |

## Intuition
The key insight is that if two linked lists intersect, they share the same tail portion from the intersection point onwards. The two lists may have different lengths before the intersection. By using two pointers, we can equalize the distances each pointer travels. When one pointer reaches the end of its list, we redirect it to the head of the other list. This way, both pointers will travel exactly `m + n` steps, and they will meet at the intersection point (or both become null if there is no intersection).

## Approach
1. Initialize two pointers `ptrA` at `headA` and `ptrB` at `headB`.
2. Traverse both lists. When a pointer reaches the end of its list, redirect it to the head of the other list.
3. If the lists intersect, the pointers will eventually meet at the intersection node.
4. If they don't intersect, both pointers will eventually become null simultaneously.

## Brute Force
### Approach
For each node in list A, traverse the entire list B to check if they are the same node. This is straightforward but inefficient.

### Code
**Python**
```python
# Brute Force - O(m*n) time
class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> Optional[ListNode]:
        ptrA = headA
        while ptrA:
            ptrB = headB
            while ptrB:
                if ptrA == ptrB:
                    return ptrA
                ptrB = ptrB.next
            ptrA = ptrA.next
        return None
```

**C++**
```cpp
// Brute Force - O(m*n) time
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        ListNode *ptrA = headA;
        while (ptrA) {
            ListNode *ptrB = headB;
            while (ptrB) {
                if (ptrA == ptrB) return ptrA;
                ptrB = ptrB->next;
            }
            ptrA = ptrA->next;
        }
        return nullptr;
    }
};
```
### Complexity
- Time: O(m * n) — for each node in A, we traverse all nodes in B
- Space: O(1) — no extra space used

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> Optional[ListNode]:
        if not headA or not headB:
            return None

        ptrA, ptrB = headA, headB

        while ptrA != ptrB:
            ptrA = ptrA.next if ptrA else headB
            ptrB = ptrB.next if ptrB else headA

        return ptrA
```

**C++**
```cpp
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        if (!headA || !headB) return nullptr;

        ListNode *ptrA = headA, *ptrB = headB;

        while (ptrA != ptrB) {
            ptrA = ptrA ? ptrA->next : headB;
            ptrB = ptrB ? ptrB->next : headA;
        }

        return ptrA;
    }
};
```
### Complexity
- Time: O(m + n) — both pointers traverse at most m + n nodes each
- Space: O(1) — only two pointers used

## Key Insight
> By redirecting each pointer to the other list's head when it reaches the end, both pointers travel exactly `m + n` steps and meet at the intersection point (or null simultaneously if no intersection).

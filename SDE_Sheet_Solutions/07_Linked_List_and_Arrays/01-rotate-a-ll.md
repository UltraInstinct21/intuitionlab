# 61. Rotate List

> **Difficulty:** Medium | **Topic:** Linked List, Two Pointers | **LeetCode:** [#61](https://leetcode.com/problems/rotate-list/)

---

## Problem Statement
Given the head of a linked list, rotate the list to the right by k places.

## Examples
**Example 1:**
```
Input: head = [1,2,3,4,5], k = 2
Output: [4,5,1,2,3]
```

**Example 2:**
```
Input: head = [0,1,2], k = 4
Output: [2,0,1]
```

## Constraints
- The number of nodes in the list is in the range [0, 500].
- -100 <= Node.val <= 100
- 0 <= k <= 2 * 10^9

## Topic Tags
`Linked List` `Two Pointers`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

## Intuition
The key observation is that rotating a list by k places is equivalent to making the last k nodes become the first k nodes. However, if k is larger than the list length, we only need to rotate k % length times. 

We can approach this by first finding the length of the list and connecting the tail to the head to form a circular list. Then, we break the circle at the appropriate position to get the rotated list.

## Approach
1. Handle edge cases: if list is empty or has only one node, return as is.
2. Find the length of the linked list and keep track of the tail.
3. Connect tail to head to form a circular linked list.
4. Calculate the actual rotation position: k % length.
5. Find the new tail position: length - k % length - 1 steps from head.
6. Break the circle: new head is new_tail->next, and new_tail->next = nullptr.

## Brute Force
### Approach
Create a new list by rotating elements one by one k times. For each rotation, move the last element to the front.

### Code
**Python**
```python
# Brute force approach - O(n*k) time, O(1) space
def rotateRight(head, k):
    if not head or not head.next or k == 0:
        return head
    
    length = 0
    current = head
    while current:
        length += 1
        current = current.next
    
    k = k % length
    if k == 0:
        return head
    
    for _ in range(k):
        prev = None
        current = head
        while current.next:
            prev = current
            current = current.next
        current.next = head
        prev.next = None
        head = current
    
    return head
```

**C++**
```cpp
// Brute force approach - O(n*k) time, O(1) space
ListNode* rotateRight(ListNode* head, int k) {
    if (!head || !head->next || k == 0) return head;
    
    int length = 0;
    ListNode* current = head;
    while (current) {
        length++;
        current = current->next;
    }
    
    k = k % length;
    if (k == 0) return head;
    
    for (int i = 0; i < k; i++) {
        ListNode* prev = nullptr;
        current = head;
        while (current->next) {
            prev = current;
            current = current->next;
        }
        current->next = head;
        prev->next = nullptr;
        head = current;
    }
    
    return head;
}
```
### Complexity
- Time: O(n*k) where n is the length of the list
- Space: O(1)

## Optimized Solution
### Code
**Python**
```python
def rotateRight(head, k):
    if not head or not head.next or k == 0:
        return head
    
    # Find length and tail
    length = 1
    tail = head
    while tail.next:
        length += 1
        tail = tail.next
    
    # Calculate actual rotations needed
    k = k % length
    if k == 0:
        return head
    
    # Connect tail to head to form circle
    tail.next = head
    
    # Find new tail: (length - k) steps from head
    new_tail = head
    for _ in range(length - k - 1):
        new_tail = new_tail.next
    
    # Break the circle
    new_head = new_tail.next
    new_tail.next = None
    
    return new_head
```

**C++**
```cpp
ListNode* rotateRight(ListNode* head, int k) {
    if (!head || !head->next || k == 0) return head;
    
    // Find length and tail
    int length = 1;
    ListNode* tail = head;
    while (tail->next) {
        length++;
        tail = tail->next;
    }
    
    // Calculate actual rotations needed
    k = k % length;
    if (k == 0) return head;
    
    // Connect tail to head to form circle
    tail->next = head;
    
    // Find new tail: (length - k) steps from head
    ListNode* new_tail = head;
    for (int i = 0; i < length - k - 1; i++) {
        new_tail = new_tail->next;
    }
    
    // Break the circle
    ListNode* new_head = new_tail->next;
    new_tail->next = nullptr;
    
    return new_head;
}
```
### Complexity
- Time: O(n) where n is the length of the list
- Space: O(1)

## Key Insight
> By connecting the tail to the head to form a circular list, we can rotate the list in one pass by breaking the circle at the appropriate position.
# Flatten a Multilevel Doubly Linked List

> **Difficulty:** Hard | **Topic:** Linked List, DFS, Recursion | **LeetCode:** [#430](https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/)

---

## Problem Statement
You are given a doubly linked list, which contains nodes that have a next pointer, a previous pointer, and an additional **child pointer**. This child pointer may or may not point to a separate doubly linked list, also containing these special nodes. These child lists may have one or more children of their own, and so on, to produce a **multilevel data structure** as shown in the example below.

Given the `head` of the first level of the linked list, **flatten** the list so that all the nodes appear in a single-level, doubly linked list. All `child` pointers should be set to `null` in the resulting list.

## Examples
**Example 1:**
```
Input: head = [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]
Output: [1,2,3,7,8,11,12,9,10,4,5,6]
```

**Example 2:**
```
Input: head = [1,2,null,3]
Output: [1,3,2]
```

**Example 3:**
```
Input: head = []
Output: []
```

## Constraints
- The number of nodes is at most `1000`.
- `1 <= Node.val <= 10^5`

## Topic Tags
`Linked List` `DFS` `Stack` `Recursion`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(d) where d is the depth of child lists |

## Intuition
The problem requires us to flatten a multilevel doubly linked list where nodes can have child pointers. The key insight is to use a depth-first approach: when we encounter a node with a child, we need to:
1. Save the next node (what comes after the current node).
2. Flatten the child list recursively.
3. Insert the flattened child list between the current node and the saved next node.
4. Update the pointers accordingly.

## Approach
1. Traverse the list using a current pointer.
2. When a node with a child is found:
   a. Save the next node.
   b. Recursively flatten the child list.
   c. Connect the current node to the flattened child.
   d. Connect the tail of the flattened child to the saved next node.
3. Continue traversal from the next node.

Alternatively, use a stack to process nodes iteratively:
1. Push the next node onto the stack before processing the child.
2. Process the child list.
3. Pop from the stack to continue.

## Brute Force
### Approach
Traverse the list and collect all node values (including child lists) into an array. Create a new flattened doubly linked list from these values. This works but creates a completely new list.

### Code
**Python**
```python
# Brute Force - Rebuild from scratch - O(n) time, O(n) space
class Solution:
    def flatten(self, head: 'Node') -> 'Node':
        # Collect all values
        values = []

        def collect(node):
            while node:
                values.append(node.val)
                if node.child:
                    collect(node.child)
                node = node.next

        collect(head)

        # Build new list
        if not values:
            return None

        dummy = Node(0)
        current = dummy
        for val in values:
            new_node = Node(val)
            current.next = new_node
            new_node.prev = current
            current = current.next

        dummy.next.prev = None
        return dummy.next
```

**C++**
```cpp
// Brute Force - Rebuild from scratch - O(n) time, O(n) space
class Solution {
public:
    Node* flatten(Node* head) {
        vector<int> values;

        function<void(Node*)> collect = [&](Node* node) {
            while (node) {
                values.push_back(node->val);
                if (node->child) collect(node->child);
                node = node->next;
            }
        };

        collect(head);

        if (values.empty()) return nullptr;

        Node* dummy = new Node(0);
        Node* current = dummy;
        for (int val : values) {
            Node* newNode = new Node(val);
            current->next = newNode;
            newNode->prev = current;
            current = current->next;
        }

        dummy->next->prev = nullptr;
        return dummy->next;
    }
};
```
### Complexity
- Time: O(n) — each node visited once
- Space: O(n) — storing all values and rebuilding the list

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def flatten(self, head: 'Node') -> 'Node':
        if not head:
            return None

        dummy = Node(0)
        prev = dummy
        stack = [head]

        while stack:
            curr = stack.pop()

            # Link the node to the flattened list
            prev.next = curr
            curr.prev = prev

            # Push next node first so child is processed first (stack is LIFO)
            if curr.next:
                stack.append(curr.next)

            # Push child to be processed before next
            if curr.child:
                stack.append(curr.child)
                curr.child = None  # Remove child pointer

            prev = curr

        dummy.next.prev = None
        return dummy.next
```

**C++**
```cpp
class Solution {
public:
    Node* flatten(Node* head) {
        if (!head) return nullptr;

        Node* dummy = new Node(0);
        Node* prev = dummy;
        stack<Node*> stk;
        stk.push(head);

        while (!stk.empty()) {
            Node* curr = stk.top();
            stk.pop();

            // Link the node to the flattened list
            prev->next = curr;
            curr->prev = prev;

            // Push next node first so child is processed first (stack is LIFO)
            if (curr->next) stk.push(curr->next);

            // Push child to be processed before next
            if (curr->child) {
                stk.push(curr->child);
                curr->child = nullptr; // Remove child pointer
            }

            prev = curr;
        }

        dummy->next->prev = nullptr;
        return dummy->next;
    }
};
```
### Complexity
- Time: O(n) — each node visited exactly once
- Space: O(d) — stack depth equals the maximum depth of child lists

## Alternative Recursive Solution
### Code
**Python**
```python
class Solution:
    def flatten(self, head: 'Node') -> 'Node':
        def flatten_dfs(node):
            curr = node
            last = node

            while curr:
                if curr.child:
                    # Flatten the child list
                    child_tail = flatten_dfs(curr.child)

                    # Save the next node
                    next_node = curr.next

                    # Connect curr -> child_head
                    curr.next = curr.child
                    curr.child.prev = curr
                    curr.child = None

                    # Connect child_tail -> next_node
                    child_tail.next = next_node
                    if next_node:
                        next_node.prev = child_tail

                    last = child_tail
                    curr = next_node
                else:
                    last = curr
                    curr = curr.next

            return last

        flatten_dfs(head)
        return head
```

**C++**
```cpp
class Solution {
public:
    Node* flatten(Node* head) {
        function<Node*(Node*)> flatten_dfs = [&](Node* node) -> Node* {
            Node* curr = node;
            Node* last = node;

            while (curr) {
                if (curr->child) {
                    Node* childTail = flatten_dfs(curr->child);

                    Node* nextNode = curr->next;

                    curr->next = curr->child;
                    curr->child->prev = curr;
                    curr->child = nullptr;

                    childTail->next = nextNode;
                    if (nextNode) nextNode->prev = childTail;

                    last = childTail;
                    curr = nextNode;
                } else {
                    last = curr;
                    curr = curr->next;
                }
            }

            return last;
        };

        flatten_dfs(head);
        return head;
    }
};
```

## Key Insight
> Use a stack (iterative) or DFS (recursive) to process child lists in depth-first order, connecting flattened child lists between the current node and its next node, while maintaining both next and prev pointers.

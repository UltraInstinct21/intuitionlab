# 138. Copy List with Random Pointer

> **Difficulty:** Medium | **Topic:** Linked List, Hash Map | **LeetCode:** [#138](https://leetcode.com/problems/copy-list-with-random-pointer/)

---

## Problem Statement
A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null.

Construct a deep copy of the list. The deep copy should consist of exactly n brand new nodes, where each new node has its value set to the value of its corresponding original node. Both the next and random pointers of the new nodes should point to new nodes in the copied list such that the pointers in the original list and copied list represent the same list state. None of the pointers in the new list should point to nodes in the original list.

For example, if there are two nodes X and Y in the original list, where X.random --> Y, then for the corresponding two nodes x and y in the copied list, x.random --> y.

Return the head of the copied linked list.

## Examples
**Example 1:**
```
Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
Output: [[7,null],[13,0],[11,4],[10,2],[1,0]]
```

**Example 2:**
```
Input: head = [[1,1],[2,1]]
Output: [[1,1],[2,1]]
```

**Example 3:**
```
Input: head = [[3,null],[3,0],[3,null]]
Output: [[3,null],[3,0],[3,null]]
```

## Constraints
- 0 <= n <= 1000
- -10^4 <= Node.val <= 10^4
- Node.random is null or pointing to a node in the linked list.

## Topic Tags
`Linked List` `Hash Map`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) |

## Intuition
The challenge is to copy both the next and random pointers correctly. Since random pointers can point to any node, we need a way to map original nodes to their copies. We can use a hash map to store this mapping.

## Approach
1. Create a hash map to store mapping from original nodes to copied nodes.
2. First pass: create copies of all nodes and store them in the hash map.
3. Second pass: set up next and random pointers for each copied node using the hash map.

## Brute Force
### Approach
Use a hash map to store the mapping from original nodes to their copies. Then in a second pass, set up the next and random pointers.

### Code
**Python**
```python
# Definition for a Node.
class Node:
    def __init__(self, x, next=None, random=None):
        self.val = int(x)
        self.next = next
        self.random = random

def copyRandomList(head):
    if not head:
        return None
    
    # Create mapping from original to copy
    mapping = {}
    current = head
    while current:
        mapping[current] = Node(current.val)
        current = current.next
    
    # Set up next and random pointers
    current = head
    while current:
        if current.next:
            mapping[current].next = mapping[current.next]
        if current.random:
            mapping[current].random = mapping[current.random]
        current = current.next
    
    return mapping[head]
```

**C++**
```cpp
// Definition for a Node.
class Node {
public:
    int val;
    Node* next;
    Node* random;
    
    Node(int _val) {
        val = _val;
        next = nullptr;
        random = nullptr;
    }
};

Node* copyRandomList(Node* head) {
    if (!head) return nullptr;
    
    // Create mapping from original to copy
    unordered_map<Node*, Node*> mapping;
    Node* current = head;
    while (current) {
        mapping[current] = new Node(current->val);
        current = current->next;
    }
    
    // Set up next and random pointers
    current = head;
    while (current) {
        if (current->next) {
            mapping[current]->next = mapping[current->next];
        }
        if (current->random) {
            mapping[current]->random = mapping[current->random];
        }
        current = current->next;
    }
    
    return mapping[head];
}
```
### Complexity
- Time: O(n)
- Space: O(n)

## Optimized Solution
### Code
**Python**
```python
def copyRandomList(head):
    if not head:
        return None
    
    # Step 1: Create copy nodes and insert them between original nodes
    current = head
    while current:
        copy = Node(current.val)
        copy.next = current.next
        current.next = copy
        current = copy.next
    
    # Step 2: Set up random pointers for copy nodes
    current = head
    while current:
        if current.random:
            current.next.random = current.random.next
        current = current.next.next
    
    # Step 3: Separate the copied list from the original list
    copied_head = head.next
    current = head
    while current:
        copy = current.next
        current.next = copy.next
        if copy.next:
            copy.next = copy.next.next
        current = current.next
    
    return copied_head
```

**C++**
```cpp
Node* copyRandomList(Node* head) {
    if (!head) return nullptr;
    
    // Step 1: Create copy nodes and insert them between original nodes
    Node* current = head;
    while (current) {
        Node* copy = new Node(current->val);
        copy->next = current->next;
        current->next = copy;
        current = copy->next;
    }
    
    // Step 2: Set up random pointers for copy nodes
    current = head;
    while (current) {
        if (current->random) {
            current->next->random = current->random->next;
        }
        current = current->next->next;
    }
    
    // Step 3: Separate the copied list from the original list
    Node* copied_head = head->next;
    current = head;
    while (current) {
        Node* copy = current->next;
        current->next = copy->next;
        if (copy->next) {
            copy->next = copy->next->next;
        }
        current = current->next;
    }
    
    return copied_head;
}
```
### Complexity
- Time: O(n)
- Space: O(1) (excluding the output space)

## Key Insight
> By interleaving copy nodes between original nodes, we can set up random pointers without needing extra space for a hash map.
# Sort a Stack

> **Difficulty:** Medium | **Topic:** Stack, Recursion | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a stack, sort it using recursion. Use of any loop constructs like while, for..etc is not allowed. We can only use the following ADT functions on Stack:
- `insertAtBottom(stack, element)`: Inserts an element at the bottom of the stack.
- `pop()`: Removes the top element from the stack.
- `top()`: Returns the top element of the stack without removing it.
- `isEmpty()`: Returns whether the stack is empty.

## Examples
**Example 1:**
```
Input: stack = [11, 2, 32, 3, 41]
Output: [41, 32, 11, 3, 2] (top to bottom)
```

**Example 2:**
```
Input: stack = [5, 1, 2, 3, 4]
Output: [5, 4, 3, 2, 1] (top to bottom)
```

## Constraints
- 1 ≤ stack size ≤ 100
- 1 ≤ elements ≤ 100

## Topic Tags
`Stack` `Recursion` `Sorting` `GeeksforGeeks`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n²) |
| **Space** | O(n) (recursion stack) |

## Intuition
We use recursion to sort the stack. The idea is to pop the top element, recursively sort the remaining stack, and then insert the popped element back at its correct position using `insertAtBottom`. This naturally maintains sorted order.

## Approach
1. Recursively pop all elements from the stack until it's empty.
2. Store the current element in a variable.
3. Recursively sort the remaining stack.
4. Use `insertAtBottom` to insert the stored element at the correct position in the sorted stack.
5. `insertAtBottom` recursively removes elements until the stack is empty, then inserts the new element and restores the removed elements.

## Brute Force
### Approach
Use an auxiliary array to store all elements, sort the array, and then rebuild the stack. This violates the constraint of not using loops, but is conceptually simple.

### Code
**Python**
```python
def sort(stack):
    temp = []
    while stack:
        temp.append(stack.pop())
    temp.sort(reverse=True)
    for item in temp:
        stack.append(item)
```

**C++**
```cpp
void sort(stack<int>& s) {
    vector<int> temp;
    while (!s.empty()) {
        temp.push_back(s.top());
        s.pop();
    }
    sort(temp.begin(), temp.end(), greater<int>());
    for (int val : temp)
        s.push(val);
}
```

### Complexity
- **Time:** O(n log n) for sorting.
- **Space:** O(n) for the auxiliary array.

## Optimized Solution
### Code
**Python**
```python
def insertAtBottom(stack, element):
    if not stack:
        stack.append(element)
        return
    top = stack.pop()
    insertAtBottom(stack, element)
    stack.append(top)

def sort(stack):
    if not stack:
        return
    top = stack.pop()
    sort(stack)
    insertAtBottom(stack, top)
```

**C++**
```cpp
void insertAtBottom(stack<int>& s, int element) {
    if (s.empty()) {
        s.push(element);
        return;
    }
    int top = s.top();
    s.pop();
    insertAtBottom(s, element);
    s.push(top);
}

void sortedInsert(stack<int>& s, int element) {
    if (s.empty() || s.top() < element) {
        s.push(element);
        return;
    }
    int top = s.top();
    s.pop();
    sortedInsert(s, element);
    s.push(top);
}

void sort(stack<int>& s) {
    if (s.empty()) return;
    int top = s.top();
    s.pop();
    sort(s);
    insertAtBottom(s, top);
}
```

### Complexity
- **Time:** O(n²) — each of n elements may require O(n) insertions.
- **Space:** O(n) — recursion stack depth.

## Key Insight
> Recursion naturally reverses the order of operations; by popping all elements and inserting them back at the correct position, we achieve sorting without explicit loops.

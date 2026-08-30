# Implement Stack using Arrays

> **Difficulty:** Easy | **Topic:** Stack | **Platform:** GeeksforGeeks

---

## Problem Statement
Implement a Stack using an array. A stack is a linear data structure that follows the LIFO (Last In First Out) principle. Implement the following operations:
- `push(x)`: Insert an element x at the top of the stack.
- `pop()`: Remove the element at the top of the stack and return it.
- `top()`: Return the top element of the stack.
- `isEmpty()`: Return true if the stack is empty, else false.

## Examples
**Example 1:**
```
Input:
push(2)
push(3)
pop()
top()
isEmpty()

Output:
3 (popped element)
2 (top element)
false (not empty)
```

## Constraints
- 1 ≤ Number of operations ≤ 100
- 0 ≤ values ≤ 100

## Topic Tags
`Stack` `Data Structures` `GeeksforGeeks`

## Expected Complexities
| | |
|---|---|
| **Time** | O(1) for all operations |
| **Space** | O(n) |

## Intuition
A stack follows LIFO (Last In First Out) order. We use an array with a `top` pointer to track the top of the stack. When we push, we increment `top` and store the element. When we pop, we return the element at `top` and decrement the pointer.

## Approach
1. Initialize an array of fixed size and a `top` variable set to -1.
2. **push(x)**: Increment `top`, then store `x` at `arr[top]`.
3. **pop()**: Return `arr[top]` and decrement `top`.
4. **top()**: Return `arr[top]` without modifying it.
5. **isEmpty()**: Return `True` if `top == -1`.

## Brute Force
### Approach
N/A - This is a straightforward array-based implementation.

### Code
**Python**
```python
class MyStack:
    def __init__(self):
        self.arr = []
        self.top = -1

    def push(self, data):
        self.top += 1
        self.arr.append(data)

    def pop(self):
        if self.top == -1:
            return -1
        data = self.arr[self.top]
        self.top -= 1
        return data

    def top(self):
        if self.top == -1:
            return -1
        return self.arr[self.top]

    def isEmpty(self):
        return self.top == -1
```

**C++**
```cpp
class MyStack {
private:
    int arr[1000];
    int top;

public:
    MyStack() { top = -1; }

    void push(int x) {
        arr[++top] = x;
    }

    int pop() {
        if (top == -1) return -1;
        return arr[top--];
    }

    int Top() {
        if (top == -1) return -1;
        return arr[top];
    }

    bool isEmpty() {
        return top == -1;
    }
};
```

### Complexity
- **Time:** O(1) for push, pop, top, and isEmpty.
- **Space:** O(n) for storing n elements.

## Optimized Solution
### Code
**Python**
```python
class MyStack:
    def __init__(self):
        self.arr = []
        self.top = -1

    def push(self, data):
        self.top += 1
        self.arr.append(data)

    def pop(self):
        if self.top == -1:
            return -1
        data = self.arr[self.top]
        self.top -= 1
        return data

    def top(self):
        if self.top == -1:
            return -1
        return self.arr[self.top]

    def isEmpty(self):
        return self.top == -1
```

**C++**
```cpp
class MyStack {
private:
    int arr[1000];
    int top;

public:
    MyStack() { top = -1; }

    void push(int x) {
        arr[++top] = x;
    }

    int pop() {
        if (top == -1) return -1;
        return arr[top--];
    }

    int Top() {
        if (top == -1) return -1;
        return arr[top];
    }

    bool isEmpty() {
        return top == -1;
    }
};
```

### Complexity
- **Time:** O(1) for all operations.
- **Space:** O(n) — fixed-size array.

## Key Insight
> A stack is best implemented with a `top` pointer and an array; all core operations run in O(1) time.

# Implement Queue using Arrays

> **Difficulty:** Easy | **Topic:** Queue | **Platform:** GeeksforGeeks

---

## Problem Statement
Implement a Queue using an array. A queue is a linear data structure that follows the FIFO (First In First Out) principle. Implement the following operations:
- `push(x)`: Insert an element x at the rear of the queue.
- `pop()`: Remove the element at the front of the queue and return it.
- `front()`: Return the front element of the queue.
- `isEmpty()`: Return true if the queue is empty, else false.

## Examples
**Example 1:**
```
Input:
push(2)
push(3)
pop()
front()
isEmpty()

Output:
2 (front element)
2 (after pop, front is still 2)
false (not empty)
```

## Constraints
- 1 ≤ Number of operations ≤ 100
- 0 ≤ values ≤ 100

## Topic Tags
`Queue` `Data Structures` `GeeksforGeeks`

## Expected Complexities
| | |
|---|---|
| **Time** | O(1) for all operations |
| **Space** | O(n) |

## Intuition
A queue follows FIFO (First In First Out) order. We use two pointers: `front` and `rear`. When we push, we insert at `rear` and increment it. When we pop, we return the element at `front` and increment `front`. A circular array can optimize space usage by reusing positions.

## Approach
1. Initialize an array, `front = 0`, `rear = -1`, and `size = 0`.
2. **push(x)**: Increment `rear`, store `x` at `arr[rear]`, increment `size`.
3. **pop()**: If empty, return -1. Otherwise, return `arr[front]` and increment `front`, decrement `size`.
4. **front()**: If empty, return -1. Otherwise, return `arr[front]`.
5. **isEmpty()**: Return `True` if `size == 0`.

## Brute Force
### Approach
Use a simple array with front and rear pointers. Elements are added at the rear and removed from the front.

### Code
**Python**
```python
class MyQueue:
    def __init__(self):
        self.arr = []
        self.front = 0
        self.rear = -1
        self.size = 0

    def push(self, x):
        self.rear += 1
        self.arr.append(x)
        self.size += 1

    def pop(self):
        if self.size == 0:
            return -1
        data = self.arr[self.front]
        self.front += 1
        self.size -= 1
        return data

    def front(self):
        if self.size == 0:
            return -1
        return self.arr[self.front]

    def isEmpty(self):
        return self.size == 0
```

**C++**
```cpp
class MyQueue {
private:
    int arr[1000];
    int front, rear, sz;

public:
    MyQueue() {
        front = 0;
        rear = -1;
        sz = 0;
    }

    void push(int x) {
        arr[++rear] = x;
        sz++;
    }

    int pop() {
        if (sz == 0) return -1;
        int data = arr[front++];
        sz--;
        return data;
    }

    int Front() {
        if (sz == 0) return -1;
        return arr[front];
    }

    bool isEmpty() {
        return sz == 0;
    }
};
```

### Complexity
- **Time:** O(1) for push, pop, front, and isEmpty.
- **Space:** O(n) for storing n elements.

## Optimized Solution
### Code
**Python**
```python
class MyQueue:
    def __init__(self):
        self.arr = []
        self.front = 0
        self.rear = -1
        self.size = 0

    def push(self, x):
        self.rear += 1
        self.arr.append(x)
        self.size += 1

    def pop(self):
        if self.size == 0:
            return -1
        data = self.arr[self.front]
        self.front += 1
        self.size -= 1
        return data

    def front(self):
        if self.size == 0:
            return -1
        return self.arr[self.front]

    def isEmpty(self):
        return self.size == 0
```

**C++**
```cpp
class MyQueue {
private:
    int arr[1000];
    int front, rear, sz;

public:
    MyQueue() {
        front = 0;
        rear = -1;
        sz = 0;
    }

    void push(int x) {
        arr[++rear] = x;
        sz++;
    }

    int pop() {
        if (sz == 0) return -1;
        int data = arr[front++];
        sz--;
        return data;
    }

    int Front() {
        if (sz == 0) return -1;
        return arr[front];
    }

    bool isEmpty() {
        return sz == 0;
    }
};
```

### Complexity
- **Time:** O(1) for all operations.
- **Space:** O(n) — fixed-size array.

## Key Insight
> A queue uses front and rear pointers to maintain FIFO order; all core operations run in O(1) time.

# 225. Implement Stack using Queues

> **Difficulty:** Easy | **Topic:** Stack, Queue, Design | **Platform:** LeetCode

---

## Problem Statement
Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (`push`, `top`, `pop`, and `empty`).

Implement the `MyStack` class:
- `void push(int x)` Pushes element x to the top of the stack.
- `int pop()` Removes the element on the top of the stack and returns it.
- `int top()` Returns the element on the top of the stack.
- `boolean empty()` Returns true if the stack is empty, else false.

## Examples
**Example 1:**
```
Input:
["MyStack", "push", "push", "top", "pop", "empty"]
[[], [1], [2], [], [], []]

Output:
[null, null, null, 2, 2, false]

Explanation:
MyStack myStack = new MyStack();
myStack.push(1);
myStack.push(2);
myStack.top(); // returns 2
myStack.pop(); // returns 2
myStack.empty(); // returns false
```

## Constraints
- 1 ≤ x ≤ 9
- At most 100 calls will be made to push, pop, top, and empty.
- All the calls to pop and top are valid.

## Topic Tags
`Stack` `Queue` `Design` `Data Structures`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) for push, O(1) for pop/top/empty |
| **Space** | O(n) |

## Intuition
To simulate a stack using queues, we need to reverse the order of elements when pushing. A queue is FIFO, but a stack is LIFO. When we push a new element, we enqueue it and then rotate the existing elements behind it so that the new element becomes the front. This way, pop and top always access the front of the queue (which is the most recently pushed element).

## Approach
1. Use a single queue for this optimized approach.
2. **push(x)**: Enqueue `x`, then rotate by dequeuing and re-enqueuing `size - 1` elements.
3. **pop()**: Dequeue and return the front element.
4. **top()**: Return the front element without removing it.
5. **empty()**: Return whether the queue is empty.

## Brute Force
### Approach
Use two queues. On every push, enqueue into an empty auxiliary queue, then move all elements from the main queue to the auxiliary queue, then swap the two queues. This ensures the most recently pushed element is always at the front.

### Code
**Python**
```python
from collections import deque

class MyStack:
    def __init__(self):
        self.q1 = deque()
        self.q2 = deque()

    def push(self, x: int) -> None:
        self.q2.append(x)
        while self.q1:
            self.q2.append(self.q1.popleft())
        self.q1, self.q2 = self.q2, self.q1

    def pop(self) -> int:
        return self.q1.popleft()

    def top(self) -> int:
        return self.q1[0]

    def empty(self) -> bool:
        return len(self.q1) == 0
```

**C++**
```cpp
class MyStack {
private:
    queue<int> q1, q2;

public:
    MyStack() {}

    void push(int x) {
        q2.push(x);
        while (!q1.empty()) {
            q2.push(q1.front());
            q1.pop();
        }
        swap(q1, q2);
    }

    int pop() {
        int val = q1.front();
        q1.pop();
        return val;
    }

    int top() {
        return q1.front();
    }

    bool empty() {
        return q1.empty();
    }
};
```

### Complexity
- **Time:** O(n) for push, O(1) for pop/top/empty.
- **Space:** O(n) — two queues store at most n elements total.

## Optimized Solution
### Code
**Python**
```python
from collections import deque

class MyStack:
    def __init__(self):
        self.q = deque()

    def push(self, x: int) -> None:
        self.q.append(x)
        for _ in range(len(self.q) - 1):
            self.q.append(self.q.popleft())

    def pop(self) -> int:
        return self.q.popleft()

    def top(self) -> int:
        return self.q[0]

    def empty(self) -> bool:
        return len(self.q) == 0
```

**C++**
```cpp
class MyStack {
private:
    queue<int> q;

public:
    MyStack() {}

    void push(int x) {
        q.push(x);
        for (int i = 0; i < (int)q.size() - 1; i++) {
            q.push(q.front());
            q.pop();
        }
    }

    int pop() {
        int val = q.front();
        q.pop();
        return val;
    }

    int top() {
        return q.front();
    }

    bool empty() {
        return q.empty();
    }
};
```

### Complexity
- **Time:** O(n) for push, O(1) for pop/top/empty.
- **Space:** O(n) — single queue.

## Key Insight
> Rotate elements after each push so the most recently added element is always at the front of the queue, enabling O(1) pop/top.

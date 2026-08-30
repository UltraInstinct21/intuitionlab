# 232. Implement Queue using Stacks

> **Difficulty:** Easy | **Topic:** Stack, Queue, Design | **Platform:** LeetCode

---

## Problem Statement
Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (`push`, `peek`, `pop`, and `empty`).

Implement the `MyQueue` class:
- `void push(int x)` Pushes element x to the back of the queue.
- `int pop()` Removes the element from the front of the queue and returns it.
- `int peek()` Returns the element at the front of the queue.
- `boolean empty()` Returns true if the queue is empty, else false.

## Examples
**Example 1:**
```
Input:
["MyQueue", "push", "push", "peek", "pop", "empty"]
[[], [1], [2], [], [], []]

Output:
[null, null, null, 1, 1, false]

Explanation:
MyQueue myQueue = new MyQueue();
myQueue.push(1);
myQueue.push(2);
myQueue.peek(); // returns 1
myQueue.pop(); // returns 1
myQueue.empty(); // returns false
```

## Constraints
- 1 ≤ x ≤ 9
- At most 100 calls will be made to push, pop, peek, and empty.
- All the calls to pop and peek are valid.

## Topic Tags
`Stack` `Queue` `Design` `Data Structures`

## Expected Complexities
| | |
|---|---|
| **Time** | Amortized O(1) for all operations |
| **Space** | O(n) |

## Intuition
We use two stacks: `inbox` for push operations and `outbox` for pop/peek operations. When `outbox` is empty and we need to pop or peek, we transfer all elements from `inbox` to `outbox`, reversing the order and giving us FIFO behavior.

## Approach
1. Use two stacks: `inbox` (for push) and `outbox` (for pop/peek).
2. **push(x)**: Push `x` onto `inbox`.
3. **pop()**: If `outbox` is empty, transfer all elements from `inbox` to `outbox`. Pop from `outbox`.
4. **peek()**: If `outbox` is empty, transfer all elements from `inbox` to `outbox`. Return front of `outbox`.
5. **empty()**: Return `True` if both stacks are empty.

## Brute Force
### Approach
On every pop or peek, transfer all elements from inbox to outbox if outbox is empty. Each element is moved at most twice (once to outbox, once back), giving amortized O(1).

### Code
**Python**
```python
class MyQueue:
    def __init__(self):
        self.inbox = []
        self.outbox = []

    def push(self, x: int) -> None:
        self.inbox.append(x)

    def pop(self) -> int:
        self._transfer()
        return self.outbox.pop()

    def peek(self) -> int:
        self._transfer()
        return self.outbox[-1]

    def empty(self) -> bool:
        return not self.inbox and not self.outbox

    def _transfer(self):
        if not self.outbox:
            while self.inbox:
                self.outbox.append(self.inbox.pop())
```

**C++**
```cpp
class MyQueue {
private:
    stack<int> inbox, outbox;

    void transfer() {
        if (outbox.empty()) {
            while (!inbox.empty()) {
                outbox.push(inbox.top());
                inbox.pop();
            }
        }
    }

public:
    MyQueue() {}

    void push(int x) {
        inbox.push(x);
    }

    int pop() {
        transfer();
        int val = outbox.top();
        outbox.pop();
        return val;
    }

    int peek() {
        transfer();
        return outbox.top();
    }

    bool empty() {
        return inbox.empty() && outbox.empty();
    }
};
```

### Complexity
- **Time:** Amortized O(1) for push, pop, peek. Worst case O(n) when outbox is empty.
- **Space:** O(n) — two stacks store at most n elements total.

## Optimized Solution
### Code
**Python**
```python
class MyQueue:
    def __init__(self):
        self.inbox = []
        self.outbox = []

    def push(self, x: int) -> None:
        self.inbox.append(x)

    def pop(self) -> int:
        self._transfer()
        return self.outbox.pop()

    def peek(self) -> int:
        self._transfer()
        return self.outbox[-1]

    def empty(self) -> bool:
        return not self.inbox and not self.outbox

    def _transfer(self):
        if not self.outbox:
            while self.inbox:
                self.outbox.append(self.inbox.pop())
```

**C++**
```cpp
class MyQueue {
private:
    stack<int> inbox, outbox;

    void transfer() {
        if (outbox.empty()) {
            while (!inbox.empty()) {
                outbox.push(inbox.top());
                inbox.pop();
            }
        }
    }

public:
    MyQueue() {}

    void push(int x) {
        inbox.push(x);
    }

    int pop() {
        transfer();
        int val = outbox.top();
        outbox.pop();
        return val;
    }

    int peek() {
        transfer();
        return outbox.top();
    }

    bool empty() {
        return inbox.empty() && outbox.empty();
    }
};
```

### Complexity
- **Time:** Amortized O(1) for all operations.
- **Space:** O(n).

## Key Insight
> The lazy transfer approach ensures each element is moved at most twice between stacks, giving amortized O(1) per operation.

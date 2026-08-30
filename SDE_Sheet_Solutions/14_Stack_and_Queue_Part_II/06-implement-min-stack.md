# Min Stack

> **Difficulty:** Hard | **Topic:** Stack, Design | **Platform:** LeetCode 155

---

## Problem Statement
Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement the MinStack class with `push(val)`, `pop()`, `top()`, and `getMin()` operations.

## Examples
**Example 1:**
```
Input:
["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"]
[[], [-2], [0], [-3], [], [], [], []]
Output:
[null, null, null, null, -3, null, 0, -2]
```

## Constraints
- -2^31 ≤ val ≤ 2^31 - 1
- Methods pop, top and getMin operations will always be called on non-empty stacks
- At most 3 * 10^4 calls will be made to push, pop, top, and getMin

## Topic Tags
`Stack` `Design`

## Expected Complexities
| | |
|---|---|
| **Time** | O(1) for all operations |
| **Space** | O(N) |

## Intuition
We maintain a separate stack that tracks the minimum value at each level. When a new minimum is pushed, it's recorded; when popped, the previous minimum is restored.

## Approach
1. Use two stacks: one for the actual data and one for tracking minimums.
2. On `push`: push to data stack. If min stack is empty or val ≤ min, push to min stack.
3. On `pop`: pop from data stack. If popped value equals min stack's top, pop from min stack.
4. `top` returns the top of data stack.
5. `getMin` returns the top of min stack.

## Brute Force
### Approach
Scan the entire stack on each `getMin` call.

### Code
**Python**
```python
class MinStack:
    def __init__(self):
        self.stack = []

    def push(self, val):
        self.stack.append(val)

    def pop(self):
        self.stack.pop()

    def top(self):
        return self.stack[-1]

    def getMin(self):
        return min(self.stack)
```

**C++**
```cpp
class MinStack {
    stack<int> st;
public:
    MinStack() {}

    void push(int val) {
        st.push(val);
    }

    void pop() {
        st.pop();
    }

    int top() {
        return st.top();
    }

    int getMin() {
        stack<int> temp;
        int minVal = st.top();
        while (!st.empty()) {
            minVal = min(minVal, st.top());
            temp.push(st.top());
            st.pop();
        }
        while (!temp.empty()) {
            st.push(temp.top());
            temp.pop();
        }
        return minVal;
    }
};
```

### Complexity
- **Time:** O(N) for getMin, O(1) for others
- **Space:** O(N)

## Optimized Solution
### Code
**Python**
```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)

    def pop(self):
        if self.stack.pop() == self.min_stack[-1]:
            self.min_stack.pop()

    def top(self):
        return self.stack[-1]

    def getMin(self):
        return self.min_stack[-1]
```

**C++**
```cpp
class MinStack {
    stack<int> st;
    stack<int> minSt;
public:
    MinStack() {}

    void push(int val) {
        st.push(val);
        if (minSt.empty() || val <= minSt.top()) {
            minSt.push(val);
        }
    }

    void pop() {
        if (st.top() == minSt.top()) {
            minSt.pop();
        }
        st.pop();
    }

    int top() {
        return st.top();
    }

    int getMin() {
        return minSt.top();
    }
};
```

### Complexity
- **Time:** O(1) for all operations
- **Space:** O(N)

## Key Insight
> Use a auxiliary stack that mirrors the main stack but only pushes values when they are new minimums, enabling O(1) getMin.

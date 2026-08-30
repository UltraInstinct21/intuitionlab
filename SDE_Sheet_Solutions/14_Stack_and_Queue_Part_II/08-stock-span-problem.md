# Online Stock Span

> **Difficulty:** Hard | **Topic:** Stack, Monotonic Stack | **Platform:** LeetCode 901

---

## Problem Statement
Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day. The span is defined as the maximum number of consecutive days (starting from today and going backwards) for which the stock price was less than or equal to today's price.

## Examples
**Example 1:**
```
Input:
["StockSpanner", "next", "next", "next", "next", "next", "next", "next"]
[[], [100], [80], [60], [70], [60], [75], [85]]
Output:
[null, 1, 1, 1, 2, 1, 4, 6]
```

## Constraints
- 1 ≤ price ≤ 10^5
- At most 10^4 calls will be made to next

## Topic Tags
`Stack` `Monotonic Stack` `Design`

## Expected Complexities
| | |
|---|---|
| **Time** | O(1) amortized for next |
| **Space** | O(N) |

## Intuition
Use a monotonic decreasing stack that stores pairs of (price, span). When a new price arrives, pop all smaller prices from the stack and accumulate their spans. The total span is the sum of popped spans plus 1.

## Approach
1. Maintain a stack of (price, span) pairs in decreasing order of price.
2. On `next(price)`: initialize span = 1.
3. While the stack is not empty and the top price ≤ current price, pop and add its span to current span.
4. Push (price, span) onto the stack.
5. Return the span.

## Brute Force
### Approach
Store all prices and scan backwards on each call.

### Code
**Python**
```python
class StockSpanner:
    def __init__(self):
        self.prices = []

    def next(self, price):
        span = 1
        for p in reversed(self.prices):
            if p <= price:
                span += 1
            else:
                break
        self.prices.append(price)
        return span
```

**C++**
```cpp
class StockSpanner {
    vector<int> prices;
public:
    StockSpanner() {}

    int next(int price) {
        int span = 1;
        for (int i = prices.size() - 1; i >= 0; i--) {
            if (prices[i] <= price) span++;
            else break;
        }
        prices.push_back(price);
        return span;
    }
};
```

### Complexity
- **Time:** O(N) per call
- **Space:** O(N)

## Optimized Solution
### Code
**Python**
```python
class StockSpanner:
    def __init__(self):
        self.stack = []

    def next(self, price):
        span = 1
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack[-1][1]
            self.stack.pop()
        self.stack.append((price, span))
        return span
```

**C++**
```cpp
class StockSpanner {
    stack<pair<int, int>> st;
public:
    StockSpanner() {}

    int next(int price) {
        int span = 1;
        while (!st.empty() && st.top().first <= price) {
            span += st.top().second;
            st.pop();
        }
        st.push({price, span});
        return span;
    }
};
```

### Complexity
- **Time:** O(1) amortized
- **Space:** O(N)

## Key Insight
> Store (price, span) pairs in a monotonic decreasing stack; each price is pushed and popped at most once, giving amortized O(1) per call.

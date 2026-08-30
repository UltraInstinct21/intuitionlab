# Maximum of Minimums for Every Window Size

> **Difficulty:** Medium | **Topic:** Stack, Array | **Platform:** GeeksforGeeks

---

## Problem Statement
Given an integer array of size n, find the maximum of minimums for every window size from 1 to n. That is, for each window size k (1 ≤ k ≤ n), find the maximum value among all minimums of all windows of size k.

## Examples
**Example 1:**
```
Input: arr[] = [10, 20, 30, 50, 10, 70, 30]
Output: [70, 30, 20, 10, 10, 10, 10]
```

**Example 2:**
```
Input: arr[] = [10, 20, 30]
Output: [30, 20, 10]
```

## Constraints
- 1 ≤ arr.size() ≤ 10^6
- 1 ≤ arr[i] ≤ 10^6

## Topic Tags
`Stack` `Arrays`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N) |
| **Space** | O(N) |

## Intuition
For each element, find the range (left and right) where it is the minimum. The element can be the minimum for all window sizes between 1 and (right - left - 1). We update the answer for that window size range.

## Approach
1. Use a monotonic increasing stack to find the left and right boundaries for each element.
2. For each element, the window size range where it is the minimum is from 1 to (right - left - 1).
3. Store the maximum minimum for each window size.
4. Fill in the answers using a suffix maximum approach.

## Brute Force
### Approach
For each window size k, scan all windows and find the minimum, then take the maximum.

### Code
**Python**
```python
def maxOfMin(arr):
    n = len(arr)
    result = [0] * (n + 1)
    for k in range(1, n + 1):
        max_min = float('-inf')
        for i in range(n - k + 1):
            window_min = min(arr[i:i + k])
            max_min = max(max_min, window_min)
        result[k] = max_min
    return result[1:]
```

**C++**
```cpp
vector<int> maxOfMin(vector<int>& arr) {
    int n = arr.size();
    vector<int> result(n + 1, 0);
    for (int k = 1; k <= n; k++) {
        int maxMin = INT_MIN;
        for (int i = 0; i <= n - k; i++) {
            int windowMin = *min_element(arr.begin() + i, arr.begin() + i + k);
            maxMin = max(maxMin, windowMin);
        }
        result[k] = maxMin;
    }
    return vector<int>(result.begin() + 1, result.end());
}
```

### Complexity
- **Time:** O(N^2)
- **Space:** O(N)

## Optimized Solution
### Code
**Python**
```python
def maxOfMin(arr):
    n = len(arr)
    left = [-1] * n
    right = [n] * n
    stack = []
    for i in range(n):
        while stack and arr[stack[-1]] >= arr[i]:
            stack.pop()
        if stack:
            left[i] = stack[-1]
        stack.append(i)
    stack.clear()
    for i in range(n - 1, -1, -1):
        while stack and arr[stack[-1]] >= arr[i]:
            stack.pop()
        if stack:
            right[i] = stack[-1]
        stack.append(i)
    result = [0] * (n + 1)
    for i in range(n):
        window_len = right[i] - left[i] - 1
        result[window_len] = max(result[window_len], arr[i])
    for i in range(n - 1, 0, -1):
        result[i] = max(result[i], result[i + 1])
    return result[1:]
```

**C++**
```cpp
vector<int> maxOfMin(vector<int>& arr) {
    int n = arr.size();
    vector<int> left(n, -1), right(n, n);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && arr[st.top()] >= arr[i]) st.pop();
        if (!st.empty()) left[i] = st.top();
        st.push(i);
    }
    while (!st.empty()) st.pop();
    for (int i = n - 1; i >= 0; i--) {
        while (!st.empty() && arr[st.top()] >= arr[i]) st.pop();
        if (!st.empty()) right[i] = st.top();
        st.push(i);
    }
    vector<int> result(n + 1, 0);
    for (int i = 0; i < n; i++) {
        int windowLen = right[i] - left[i] - 1;
        result[windowLen] = max(result[windowLen], arr[i]);
    }
    for (int i = n - 1; i > 0; i--) {
        result[i] = max(result[i], result[i + 1]);
    }
    return vector<int>(result.begin() + 1, result.end());
}
```

### Complexity
- **Time:** O(N)
- **Space:** O(N)

## Key Insight
> For each element, compute the largest window where it is the minimum using left/right boundaries from a monotonic stack, then fill answers via suffix maximum.

# Next Smaller Element

> **Difficulty:** Medium | **Topic:** Stack | **Platform:** GeeksforGeeks

---

## Problem Statement
Given an array arr[] of integers, find the next smaller element for each element in the array. The next smaller element for an element x is the first element on the right side of x that is smaller than x. If there is no smaller element on the right, the next smaller element is -1.

## Examples
**Example 1:**
```
Input: arr[] = [4, 5, 2, 10, 8]
Output: [2, 2, -1, -1, -1]
```

**Example 2:**
```
Input: arr[] = [3, 1, 2, 4]
Output: [1, -1, -1, -1]
```

## Constraints
- 1 ≤ arr.size() ≤ 10^6
- 1 ≤ arr[i] ≤ 10^9

## Topic Tags
`Stack` `Arrays`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N) |
| **Space** | O(N) |

## Intuition
We use a stack to keep track of elements for which we haven't found the next smaller element yet. By traversing from right to left, when we encounter an element smaller than the stack's top, it becomes the answer for all elements in the stack that are larger than it.

## Approach
1. Initialize a result array with -1.
2. Traverse the array from right to left.
3. While the stack is not empty and the top of the stack is greater than or equal to the current element, pop from the stack.
4. If the stack is not empty, the top of the stack is the next smaller element for the current element.
5. Push the current element onto the stack.

## Brute Force
### Approach
For each element, scan all elements to its right to find the first smaller element.

### Code
**Python**
```python
def nextSmallerElement(arr):
    n = len(arr)
    result = [-1] * n
    for i in range(n - 1, -1, -1):
        for j in range(i + 1, n):
            if arr[j] < arr[i]:
                result[i] = arr[j]
                break
    return result
```

**C++**
```cpp
vector<int> nextSmallerElement(vector<int>& arr) {
    int n = arr.size();
    vector<int> result(n, -1);
    for (int i = n - 1; i >= 0; i--) {
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[i]) {
                result[i] = arr[j];
                break;
            }
        }
    }
    return result;
}
```

### Complexity
- **Time:** O(N^2)
- **Space:** O(N)

## Optimized Solution
### Code
**Python**
```python
def nextSmallerElement(arr):
    n = len(arr)
    result = [-1] * n
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and stack[-1] >= arr[i]:
            stack.pop()
        if stack:
            result[i] = stack[-1]
        stack.append(arr[i])
    return result
```

**C++**
```cpp
vector<int> nextSmallerElement(vector<int>& arr) {
    int n = arr.size();
    vector<int> result(n, -1);
    stack<int> st;
    for (int i = n - 1; i >= 0; i--) {
        while (!st.empty() && st.top() >= arr[i]) {
            st.pop();
        }
        if (!st.empty()) {
            result[i] = st.top();
        }
        st.push(arr[i]);
    }
    return result;
}
```

### Complexity
- **Time:** O(N)
- **Space:** O(N)

## Key Insight
> Traverse from right to left and use a stack to maintain elements in increasing order, popping elements that are greater than or equal to the current one.

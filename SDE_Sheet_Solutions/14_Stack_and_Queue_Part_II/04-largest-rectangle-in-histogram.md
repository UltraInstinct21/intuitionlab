# Largest Rectangle in Histogram

> **Difficulty:** Hard | **Topic:** Stack, Array | **Platform:** LeetCode 84

---

## Problem Statement
Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.

## Examples
**Example 1:**
```
Input: heights = [2,1,5,6,2,3]
Output: 10
```

**Example 2:**
```
Input: heights = [2,4]
Output: 4
```

## Constraints
- 1 ≤ heights.length ≤ 10^5
- 0 ≤ heights[i] ≤ 10^4

## Topic Tags
`Stack` `Array` `Monotonic Stack`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N) |
| **Space** | O(N) |

## Intuition
For each bar, the largest rectangle using that bar as the shortest bar extends left and right until it finds bars shorter than itself. We can use a monotonic increasing stack to efficiently find these boundaries.

## Approach
1. Use a stack that stores indices in increasing order of heights.
2. Traverse the array. For each bar, while the stack's top bar is taller, pop and calculate the area using the popped bar as the minimum height.
3. The width is determined by the current index and the new top of the stack.
4. Push the current index onto the stack.
5. After traversal, pop remaining bars from the stack.

## Brute Force
### Approach
For each bar, expand left and right to find the largest rectangle with that bar as the minimum.

### Code
**Python**
```python
def largestRectangleArea(heights):
    n = len(heights)
    max_area = 0
    for i in range(n):
        left = i
        while left > 0 and heights[left - 1] >= heights[i]:
            left -= 1
        right = i
        while right < n - 1 and heights[right + 1] >= heights[i]:
            right += 1
        area = heights[i] * (right - left + 1)
        max_area = max(max_area, area)
    return max_area
```

**C++**
```cpp
int largestRectangleArea(vector<int>& heights) {
    int n = heights.size();
    int maxArea = 0;
    for (int i = 0; i < n; i++) {
        int left = i;
        while (left > 0 && heights[left - 1] >= heights[i]) left--;
        int right = i;
        while (right < n - 1 && heights[right + 1] >= heights[i]) right++;
        maxArea = max(maxArea, heights[i] * (right - left + 1));
    }
    return maxArea;
}
```

### Complexity
- **Time:** O(N^2)
- **Space:** O(1)

## Optimized Solution
### Code
**Python**
```python
def largestRectangleArea(heights):
    stack = [-1]
    max_area = 0
    for i in range(len(heights)):
        while stack[-1] != -1 and heights[stack[-1]] >= heights[i]:
            height = heights[stack.pop()]
            width = i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    while stack[-1] != -1:
        height = heights[stack.pop()]
        width = len(heights) - stack[-1] - 1
        max_area = max(max_area, height * width)
    return max_area
```

**C++**
```cpp
int largestRectangleArea(vector<int>& heights) {
    stack<int> st;
    st.push(-1);
    int maxArea = 0;
    for (int i = 0; i < heights.size(); i++) {
        while (st.top() != -1 && heights[st.top()] >= heights[i]) {
            int height = heights[st.top()];
            st.pop();
            int width = i - st.top() - 1;
            maxArea = max(maxArea, height * width);
        }
        st.push(i);
    }
    while (st.top() != -1) {
        int height = heights[st.top()];
        st.pop();
        int width = heights.size() - st.top() - 1;
        maxArea = max(maxArea, height * width);
    }
    return maxArea;
}
```

### Complexity
- **Time:** O(N)
- **Space:** O(N)

## Key Insight
> Use a monotonic stack to find for each bar the first smaller bar on the left and right, enabling O(N) area calculation.

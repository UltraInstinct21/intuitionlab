# Sliding Window Maximum

> **Difficulty:** Hard | **Topic:** Stack, Queue, Monotonic Deque | **Platform:** LeetCode 239

---

## Problem Statement
You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Return the max sliding window.

## Examples
**Example 1:**
```
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
```

**Example 2:**
```
Input: nums = [1], k = 1
Output: [1]
```

## Constraints
- 1 ≤ nums.length ≤ 10^5
- -10^4 ≤ nums[i] ≤ 10^4
- 1 ≤ k ≤ nums.length

## Topic Tags
`Queue` `Sliding Window` `Monotonic Deque` `Heap`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N) |
| **Space** | O(K) |

## Intuition
We use a monotonic decreasing deque that stores indices. The front of the deque always holds the index of the maximum element in the current window. Elements that are smaller than the current element are removed from the back since they can never be the maximum while the current element is in the window.

## Approach
1. Use a deque to store indices of elements in decreasing order of values.
2. For each element, remove indices from the back that are smaller than the current element.
3. Add the current index to the back.
4. Remove indices from the front that are outside the window.
5. The front of the deque is the maximum for the current window.

## Brute Force
### Approach
For each window, scan all k elements to find the maximum.

### Code
**Python**
```python
def maxSlidingWindow(nums, k):
    result = []
    for i in range(len(nums) - k + 1):
        result.append(max(nums[i:i + k]))
    return result
```

**C++**
```cpp
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    vector<int> result;
    for (int i = 0; i <= nums.size() - k; i++) {
        int maxVal = nums[i];
        for (int j = i + 1; j < i + k; j++) {
            maxVal = max(maxVal, nums[j]);
        }
        result.push_back(maxVal);
    }
    return result;
}
```

### Complexity
- **Time:** O(N * K)
- **Space:** O(N)

## Optimized Solution
### Code
**Python**
```python
from collections import deque

def maxSlidingWindow(nums, k):
    dq = deque()
    result = []
    for i in range(len(nums)):
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        while dq and nums[dq[-1]] <= nums[i]:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result
```

**C++**
```cpp
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> result;
    for (int i = 0; i < nums.size(); i++) {
        while (!dq.empty() && dq.front() < i - k + 1) {
            dq.pop_front();
        }
        while (!dq.empty() && nums[dq.back()] <= nums[i]) {
            dq.pop_back();
        }
        dq.push_back(i);
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }
    return result;
}
```

### Complexity
- **Time:** O(N)
- **Space:** O(K)

## Key Insight
> Maintain a monotonic decreasing deque of indices so that the front always holds the maximum for the current window, achieving O(N) total time.

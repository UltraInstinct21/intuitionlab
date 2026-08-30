# 42. Trapping Rain Water

> **Difficulty:** Hard | **Topic:** Array, Two Pointers, Stack, Dynamic Programming | **LeetCode:** [#42](https://leetcode.com/problems/trapping-rain-water/)

---

## Problem Statement
Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

## Examples
**Example 1:**
```
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The elevation map is shown above. The trapped water is 6 units.
```

**Example 2:**
```
Input: height = [4,2,0,3,2,5]
Output: 9
```

## Constraints
- n == height.length
- 1 <= n <= 2 * 10^4
- 0 <= height[i] <= 10^5

## Topic Tags
`Array` `Two Pointers` `Stack` `Dynamic Programming`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

## Intuition
The amount of water that can be trapped at each position is determined by the minimum of the maximum heights to its left and right, minus the height at that position. We can precompute the maximum heights from both sides or use a two-pointer approach to solve this efficiently.

## Approach
1. For each position, calculate the maximum height to its left and right.
2. The water trapped at each position is min(max_left, max_right) - height[i].
3. Sum up all the trapped water.

## Brute Force
### Approach
For each position, find the maximum height to its left and right by scanning the entire array.

### Code
**Python**
```python
def trap(height):
    if not height:
        return 0
    
    n = len(height)
    water = 0
    
    for i in range(n):
        # Find max height to the left
        max_left = 0
        for j in range(i):
            max_left = max(max_left, height[j])
        
        # Find max height to the right
        max_right = 0
        for j in range(i + 1, n):
            max_right = max(max_right, height[j])
        
        # Calculate water at current position
        water += max(0, min(max_left, max_right) - height[i])
    
    return water
```

**C++**
```cpp
int trap(vector<int>& height) {
    if (height.empty()) return 0;
    
    int n = height.size();
    int water = 0;
    
    for (int i = 0; i < n; i++) {
        // Find max height to the left
        int max_left = 0;
        for (int j = 0; j < i; j++) {
            max_left = max(max_left, height[j]);
        }
        
        // Find max height to the right
        int max_right = 0;
        for (int j = i + 1; j < n; j++) {
            max_right = max(max_right, height[j]);
        }
        
        // Calculate water at current position
        water += max(0, min(max_left, max_right) - height[i]);
    }
    
    return water;
}
```
### Complexity
- Time: O(n^2)
- Space: O(1)

## Optimized Solution
### Code
**Python**
```python
def trap(height):
    if not height:
        return 0
    
    n = len(height)
    left_max = [0] * n
    right_max = [0] * n
    
    # Fill left_max array
    left_max[0] = height[0]
    for i in range(1, n):
        left_max[i] = max(left_max[i - 1], height[i])
    
    # Fill right_max array
    right_max[n - 1] = height[n - 1]
    for i in range(n - 2, -1, -1):
        right_max[i] = max(right_max[i + 1], height[i])
    
    # Calculate trapped water
    water = 0
    for i in range(n):
        water += max(0, min(left_max[i], right_max[i]) - height[i])
    
    return water
```

**C++**
```cpp
int trap(vector<int>& height) {
    if (height.empty()) return 0;
    
    int n = height.size();
    vector<int> left_max(n), right_max(n);
    
    // Fill left_max array
    left_max[0] = height[0];
    for (int i = 1; i < n; i++) {
        left_max[i] = max(left_max[i - 1], height[i]);
    }
    
    // Fill right_max array
    right_max[n - 1] = height[n - 1];
    for (int i = n - 2; i >= 0; i--) {
        right_max[i] = max(right_max[i + 1], height[i]);
    }
    
    // Calculate trapped water
    int water = 0;
    for (int i = 0; i < n; i++) {
        water += max(0, min(left_max[i], right_max[i]) - height[i]);
    }
    
    return water;
}
```
### Complexity
- Time: O(n)
- Space: O(n)

## Two-Pointer Approach
### Code
**Python**
```python
def trap(height):
    if not height:
        return 0
    
    left, right = 0, len(height) - 1
    left_max, right_max = 0, 0
    water = 0
    
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    
    return water
```

**C++**
```cpp
int trap(vector<int>& height) {
    if (height.empty()) return 0;
    
    int left = 0, right = height.size() - 1;
    int left_max = 0, right_max = 0;
    int water = 0;
    
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= left_max) {
                left_max = height[left];
            } else {
                water += left_max - height[left];
            }
            left++;
        } else {
            if (height[right] >= right_max) {
                right_max = height[right];
            } else {
                water += right_max - height[right];
            }
            right--;
        }
    }
    
    return water;
}
```
### Complexity
- Time: O(n)
- Space: O(1)

## Key Insight
> The water trapped at any position depends on the minimum of the maximum heights to its left and right. Using two pointers, we can compute this in a single pass with constant space.
# 485. Max Consecutive Ones

> **Difficulty:** Easy | **Topic:** Array | **LeetCode:** [#485](https://leetcode.com/problems/max-consecutive-ones/)

---

## Problem Statement
Given a binary array nums, return the maximum number of consecutive 1's in the array.

## Examples
**Example 1:**
```
Input: nums = [1,1,0,1,1,1]
Output: 3
Explanation: The first two digits or the last three digits are consecutive 1s. The maximum number of consecutive 1s is 3.
```

**Example 2:**
```
Input: nums = [1,0,1,1,0,1]
Output: 2
```

## Constraints
- 1 <= nums.length <= 10^5
- nums[i] is either 0 or 1.

## Topic Tags
`Array`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

## Intuition
We can iterate through the array, keeping track of the current streak of consecutive 1s and updating the maximum streak whenever we encounter a 0.

## Approach
1. Initialize counters for current streak and maximum streak.
2. Iterate through the array:
   - If element is 1, increment current streak.
   - If element is 0, update maximum streak if current is greater, then reset current streak.
3. After the loop, update maximum streak one more time to handle the case where the array ends with 1s.

## Brute Force
### Approach
For each position, count the consecutive 1s starting from that position and keep track of the maximum.

### Code
**Python**
```python
def findMaxConsecutiveOnes(nums):
    max_count = 0
    
    for i in range(len(nums)):
        count = 0
        for j in range(i, len(nums)):
            if nums[j] == 1:
                count += 1
                max_count = max(max_count, count)
            else:
                break
    
    return max_count
```

**C++**
```cpp
int findMaxConsecutiveOnes(vector<int>& nums) {
    int max_count = 0;
    
    for (int i = 0; i < nums.size(); i++) {
        int count = 0;
        for (int j = i; j < nums.size(); j++) {
            if (nums[j] == 1) {
                count++;
                max_count = max(max_count, count);
            } else {
                break;
            }
        }
    }
    
    return max_count;
}
```
### Complexity
- Time: O(n^2)
- Space: O(1)

## Optimized Solution
### Code
**Python**
```python
def findMaxConsecutiveOnes(nums):
    max_count = 0
    current_count = 0
    
    for num in nums:
        if num == 1:
            current_count += 1
            max_count = max(max_count, current_count)
        else:
            current_count = 0
    
    return max_count
```

**C++**
```cpp
int findMaxConsecutiveOnes(vector<int>& nums) {
    int max_count = 0;
    int current_count = 0;
    
    for (int num : nums) {
        if (num == 1) {
            current_count++;
            max_count = max(max_count, current_count);
        } else {
            current_count = 0;
        }
    }
    
    return max_count;
}
```
### Complexity
- Time: O(n)
- Space: O(1)

## Key Insight
> By maintaining a running count of consecutive 1s and resetting it when we encounter a 0, we can find the maximum in a single pass.
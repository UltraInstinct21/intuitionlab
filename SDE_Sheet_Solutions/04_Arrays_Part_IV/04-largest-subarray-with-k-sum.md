# Largest Subarray with K Sum (Longest Subarray with Sum K)

> **Difficulty:** Medium | **Topic:** Array, Hash Table, Prefix Sum | **Platform:** GeeksforGeeks

---

## Problem Statement

Given an array `arr[]` containing integers and an integer `k`, your task is to find the length of the longest subarray where the sum of its elements equals `k`.

---

## Examples

**Example 1:**
```
Input: arr[] = [10, 5, 2, 7, 1, 9], k = 15
Output: 4
Explanation: The subarray [5, 2, 7, 1] has sum 15.
```

**Example 2:**
```
Input: arr[] = [-1, 2, 3], k = 6
Output: 1
Explanation: No subarray has sum 6.
```

---

## Constraints

- `1 <= arr.size() <= 10^5`
- `-10^4 <= arr[i] <= 10^4`

---

## Topic Tags

`Array` `Hash Table` `Prefix Sum`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) |

---

## Intuition

Use prefix sum with a hash map. If `prefix_sum[j] - prefix_sum[i] = k`, then the subarray from i+1 to j has sum k. Store the first occurrence of each prefix sum.

---

## Approach

1. Maintain a running prefix sum
2. Store the first occurrence of each prefix sum in a hash map
3. If `prefix_sum - k` exists in the map, update the maximum length
4. If prefix_sum equals k, update max length to current index + 1

---

## Optimized Solution

### Code

**Python**
```python
def longestSubarray(arr, k):
    prefix_sum = 0
    max_length = 0
    sum_map = {}
    
    for i in range(len(arr)):
        prefix_sum += arr[i]
        
        if prefix_sum == k:
            max_length = i + 1
        
        if prefix_sum - k in sum_map:
            max_length = max(max_length, i - sum_map[prefix_sum - k])
        
        if prefix_sum not in sum_map:
            sum_map[prefix_sum] = i
    
    return max_length
```

**C++**
```cpp
int longestSubarray(vector<int>& arr, int k) {
    unordered_map<int, int> sumMap;
    int prefixSum = 0, maxLength = 0;
    
    for (int i = 0; i < arr.size(); i++) {
        prefixSum += arr[i];
        
        if (prefixSum == k)
            maxLength = i + 1;
        
        if (sumMap.find(prefixSum - k) != sumMap.end())
            maxLength = max(maxLength, i - sumMap[prefixSum - k]);
        
        if (sumMap.find(prefixSum) == sumMap.end())
            sumMap[prefixSum] = i;
    }
    
    return maxLength;
}
```

### Complexity
- **Time:** O(n)
- **Space:** O(n)

---

## Key Insight

> Use prefix sum with hash map. If `prefix_sum[j] - prefix_sum[i] = k`, then subarray (i+1, j) has sum k. Store first occurrence to maximize length.

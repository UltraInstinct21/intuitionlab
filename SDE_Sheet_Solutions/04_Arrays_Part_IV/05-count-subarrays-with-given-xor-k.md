# Count Subarrays with Given XOR K

> **Difficulty:** Hard | **Topic:** Array, Hash Table, Bit Manipulation | **Platform:** GeeksforGeeks

---

## Problem Statement

Given an array `arr[]` and an integer `k`, find the count of subarrays whose XOR of elements equals `k`.

---

## Examples

**Example 1:**
```
Input: arr[] = [4, 2, 2, 6, 4], k = 6
Output: 4
Explanation: Subarrays with XOR 6 are: [4, 2], [4, 2, 2, 6, 4], [2, 2, 6], [6]
```

**Example 2:**
```
Input: arr[] = [5, 6, 7, 8, 9], k = 5
Output: 2
Explanation: Subarrays with XOR 5 are: [5], [5, 6, 7, 8, 9]
```

---

## Constraints

- `1 <= arr.size() <= 10^5`
- `1 <= arr[i] <= 10^5`
- `1 <= k <= 10^5`

---

## Topic Tags

`Array` `Hash Table` `Bit Manipulation`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) |

---

## Intuition

Similar to subarray sum equals k, but using XOR. If `prefix_xor[j] ^ prefix_xor[i] = k`, then the subarray from i+1 to j has XOR k. Store counts of prefix XOR values.

---

## Approach

1. Maintain a running prefix XOR
2. Store count of each prefix XOR value
3. If `prefix_xor ^ k` exists in the map, add its count to result
4. Update the count of current prefix XOR

---

## Optimized Solution

### Code

**Python**
```python
def countSubarrays(arr, k):
    prefix_xor = 0
    count = 0
    xor_map = {0: 1}
    
    for num in arr:
        prefix_xor ^= num
        
        if prefix_xor ^ k in xor_map:
            count += xor_map[prefix_xor ^ k]
        
        xor_map[prefix_xor] = xor_map.get(prefix_xor, 0) + 1
    
    return count
```

**C++**
```cpp
int countSubarrays(vector<int>& arr, int k) {
    unordered_map<int, int> xorMap;
    int prefixXor = 0, count = 0;
    xorMap[0] = 1;
    
    for (int num : arr) {
        prefixXor ^= num;
        
        if (xorMap.find(prefixXor ^ k) != xorMap.end())
            count += xorMap[prefixXor ^ k];
        
        xorMap[prefixXor]++;
    }
    
    return count;
}
```

### Complexity
- **Time:** O(n)
- **Space:** O(n)

---

## Key Insight

> If `prefix_xor[j] ^ prefix_xor[i] = k`, then subarray (i+1, j) has XOR k. Store counts of prefix XOR values for O(1) lookup.

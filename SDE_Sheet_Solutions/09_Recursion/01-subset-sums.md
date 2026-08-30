# Subset Sums

> **Difficulty:** Hard | **Topic:** Recursion, Backtracking | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a list of positive integers arr, print all subset sums in sorted order.

## Examples
**Example 1:**
```
Input: arr = [5, 1, 6]
Output: [0, 1, 5, 6, 7, 11, 12]
Explanation: All subsets: {}, {1}, {5}, {6}, {1,5}, {1,6}, {5,6}, {1,5,6} → sums in sorted order
```

**Example 2:**
```
Input: arr = [1, 2, 3]
Output: [0, 1, 2, 3, 4, 5, 6]
```

## Constraints
- 1 ≤ arr.size() ≤ 15
- 1 ≤ arr[i] ≤ 10^4
- Subsets can be empty (sum = 0)

## Topic Tags
`Recursion` `Backtracking` `Bit Manipulation`

## Expected Complexities
| | |
|---|---|
| **Time** | O(2^n) |
| **Space** | O(n) recursion stack |

## Intuition
For each element, we have two choices: either include it in the subset or exclude it. We recursively explore both paths. At each recursive call, we either add the current element to the running sum (include) or skip it (exclude). When we reach the end of the array, we record the current sum.

## Approach
1. Use recursion with index `i` and current `currentSum`
2. Base case: if `i == n`, add `currentSum` to result list
3. Recursive case:
   - Pick: add `arr[i]` to sum and recurse for `i+1`
   - Not pick: recurse for `i+1` without adding

## Brute Force
### Approach
Generate all 2^n subsets using bit manipulation, compute sum for each.
### Code
**Python**
```python
def subsetSums(arr):
    n = len(arr)
    result = []
    for mask in range(1 << n):
        s = 0
        for j in range(n):
            if mask & (1 << j):
                s += arr[j]
        result.append(s)
    result.sort()
    return result
```
**C++**
```cpp
class Solution {
  public:
    vector<int> subsetSums(vector<int> arr) {
        int n = arr.size();
        vector<int> result;
        for (int mask = 0; mask < (1 << n); mask++) {
            int s = 0;
            for (int j = 0; j < n; j++) {
                if (mask & (1 << j)) s += arr[j];
            }
            result.push_back(s);
        }
        sort(result.begin(), result.end());
        return result;
    }
};
```
### Complexity
- **Time:** O(2^n * n)
- **Space:** O(2^n)

## Optimized Solution
### Code
**Python**
```python
def subsetSums(arr):
    result = []
    
    def solve(idx, currentSum):
        if idx == len(arr):
            result.append(currentSum)
            return
        solve(idx + 1, currentSum + arr[idx])  # pick
        solve(idx + 1, currentSum)              # not pick
    
    solve(0, 0)
    result.sort()
    return result
```
**C++**
```cpp
class Solution {
  public:
    vector<int> subsetSums(vector<int> arr) {
        vector<int> result;
        
        function<void(int, int)> solve = [&](int idx, int currentSum) {
            if (idx == arr.size()) {
                result.push_back(currentSum);
                return;
            }
            solve(idx + 1, currentSum + arr[idx]);  // pick
            solve(idx + 1, currentSum);              // not pick
        };
        
        solve(0, 0);
        sort(result.begin(), result.end());
        return result;
    }
};
```
### Complexity
- **Time:** O(2^n)
- **Space:** O(n) recursion stack

## Key Insight
> Each element gives exactly two branches — include or exclude — naturally forming a binary recursion tree of 2^n leaves.
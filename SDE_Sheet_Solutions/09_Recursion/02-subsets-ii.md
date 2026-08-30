# Subsets II

> **Difficulty:** Medium | **Topic:** Recursion, Backtracking | **Platform:** LeetCode

---

## Problem Statement
Given an integer array nums that may contain duplicates, return all possible subsets (the power set). The solution set must not contain duplicate subsets.

## Examples
**Example 1:**
```
Input: nums = [1, 2, 2]
Output: [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]
```

**Example 2:**
```
Input: nums = [0]
Output: [[], [0]]
```

## Constraints
- 1 ≤ nums.length ≤ 10
- -10 ≤ nums[i] ≤ 10
- All elements are unique in terms of positions but may have duplicate values

## Topic Tags
`Recursion` `Backtracking` `Array`

## Expected Complexities
| | |
|---|---|
| **Time** | O(2^n) |
| **Space** | O(n) recursion stack |

## Intuition
To avoid duplicate subsets, we sort the array first. Then during recursion, when we skip an element, we skip ALL its duplicates. This ensures each subset is generated exactly once.

## Approach
1. Sort the array
2. Use recursion with index `idx` and a temporary list `current`
3. At each step, add `current` to result (all subsets include empty)
4. Loop from `i = idx` to `n-1`:
   - Skip duplicates: if `i > idx` and `nums[i] == nums[i-1]`, continue
   - Include `nums[i]`, recurse for `i+1`
   - Backtrack (remove last element)

## Brute Force
### Approach
Generate all subsets using power set, convert each to a tuple, store in a set to remove duplicates.
### Code
**Python**
```python
def subsetsWithDup(nums):
    result = set()
    for mask in range(1 << len(nums)):
        subset = []
        for j in range(len(nums)):
            if mask & (1 << j):
                subset.append(nums[j])
        result.add(tuple(sorted(subset)))
    return [list(s) for s in sorted(result)]
```
**C++**
```cpp
class Solution {
  public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        set<vector<int>> result;
        int n = nums.size();
        for (int mask = 0; mask < (1 << n); mask++) {
            vector<int> subset;
            for (int j = 0; j < n; j++)
                if (mask & (1 << j)) subset.push_back(nums[j]);
            sort(subset.begin(), subset.end());
            result.insert(subset);
        }
        return vector<vector<int>>(result.begin(), result.end());
    }
};
```
### Complexity
- **Time:** O(2^n * n * log(2^n)) = O(n * 2^n)
- **Space:** O(2^n)

## Optimized Solution
### Code
**Python**
```python
def subsetsWithDup(nums):
    result = []
    nums.sort()
    
    def solve(idx, current):
        result.append(current[:])
        for i in range(idx, len(nums)):
            if i > idx and nums[i] == nums[i - 1]:
                continue
            current.append(nums[i])
            solve(i + 1, current)
            current.pop()
    
    solve(0, [])
    return result
```
**C++**
```cpp
class Solution {
  public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        vector<vector<int>> result;
        sort(nums.begin(), nums.end());
        
        function<void(int, vector<int>&)> solve = [&](int idx, vector<int>& current) {
            result.push_back(current);
            for (int i = idx; i < nums.size(); i++) {
                if (i > idx && nums[i] == nums[i - 1]) continue;
                current.push_back(nums[i]);
                solve(i + 1, current);
                current.pop();
            }
        };
        
        vector<int> temp;
        solve(0, temp);
        return result;
    }
};
```
### Complexity
- **Time:** O(2^n)
- **Space:** O(n) recursion stack

## Key Insight
> Sorting + skipping duplicates at the same level of recursion ensures each unique subset is generated exactly once.
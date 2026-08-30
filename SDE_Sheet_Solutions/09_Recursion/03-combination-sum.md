# Combination Sum

> **Difficulty:** Medium | **Topic:** Recursion, Backtracking | **Platform:** LeetCode

---

## Problem Statement
Given an array of distinct positive integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. The same number may be chosen from candidates an unlimited number of times.

## Examples
**Example 1:**
```
Input: candidates = [2, 3, 6, 7], target = 7
Output: [[2, 2, 3], [7]]
```

**Example 2:**
```
Input: candidates = [2, 3, 5], target = 8
Output: [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
```

## Constraints
- 1 ≤ candidates.length ≤ 30
- 2 ≤ candidates[i] ≤ 40
- All elements are distinct
- 1 ≤ target ≤ 40

## Topic Tags
`Recursion` `Backtracking` `Array`

## Expected Complexities
| | |
|---|---|
| **Time** | O(2^target) |
| **Space** | O(target) recursion stack |

## Intuition
Since elements can be reused, at each step we can pick the same element again. We only move to the next index when we decide not to use the current element, avoiding duplicate combinations in different orders.

## Approach
1. Sort candidates (optional, helps pruning)
2. Use recursion with index `idx`, current combination `current`, and remaining `target`
3. Base cases:
   - If `target == 0`: add `current` to result
   - If `idx == n` or `target < 0`: return
4. Recursive case:
   - Pick `candidates[idx]`: subtract from target, recurse (same index allowed)
   - Not pick: move to `idx + 1`

## Brute Force
### Approach
Recursively try all combinations with unlimited reuse, collecting valid ones.
### Code
**Python**
```python
def combinationSum(candidates, target):
    result = []
    
    def solve(idx, current, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        if idx == len(candidates) or remaining < 0:
            return
        # pick
        current.append(candidates[idx])
        solve(idx, current, remaining - candidates[idx])
        current.pop()
        # not pick
        solve(idx + 1, current, remaining)
    
    solve(0, [], target)
    return result
```
**C++**
```cpp
class Solution {
  public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        
        function<void(int, vector<int>&, int)> solve = [&](int idx, vector<int>& current, int rem) {
            if (rem == 0) {
                result.push_back(current);
                return;
            }
            if (idx == candidates.size() || rem < 0) return;
            current.push_back(candidates[idx]);
            solve(idx, current, rem - candidates[idx]);
            current.pop();
            solve(idx + 1, current, rem);
        };
        
        vector<int> temp;
        solve(0, temp, target);
        return result;
    }
};
```
### Complexity
- **Time:** O(2^target) per element
- **Space:** O(target) recursion depth

## Optimized Solution
### Code
**Python**
```python
def combinationSum(candidates, target):
    result = []
    candidates.sort()
    
    def solve(idx, current, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        for i in range(idx, len(candidates)):
            if candidates[i] > remaining:
                break
            current.append(candidates[i])
            solve(i, current, remaining - candidates[i])
            current.pop()
    
    solve(0, [], target)
    return result
```
**C++**
```cpp
class Solution {
  public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        sort(candidates.begin(), candidates.end());
        
        function<void(int, vector<int>&, int)> solve = [&](int idx, vector<int>& current, int rem) {
            if (rem == 0) {
                result.push_back(current);
                return;
            }
            for (int i = idx; i < candidates.size(); i++) {
                if (candidates[i] > rem) break;
                current.push_back(candidates[i]);
                solve(i, current, rem - candidates[i]);
                current.pop();
            }
        };
        
        vector<int> temp;
        solve(0, temp, target);
        return result;
    }
};
```
### Complexity
- **Time:** O(2^target)
- **Space:** O(target) recursion depth

## Key Insight
> Same index is passed on "pick" to allow reuse; index increments only on "not pick" to avoid ordering duplicates.
# Combination Sum II

> **Difficulty:** Medium | **Topic:** Recursion, Backtracking | **Platform:** LeetCode

---

## Problem Statement
Given a collection of candidate numbers (may contain duplicates) and a target number, find all unique combinations where the candidate numbers sum to target. Each number may only be used once, and the solution set must not contain duplicate combinations.

## Examples
**Example 1:**
```
Input: candidates = [10, 1, 2, 7, 6, 1, 5], target = 8
Output: [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]
```

**Example 2:**
```
Input: candidates = [2, 5, 2, 1, 2], target = 5
Output: [[1, 2, 2], [5]]
```

## Constraints
- 1 ≤ candidates.length ≤ 100
- 1 ≤ candidates[i] ≤ 50
- 1 ≤ target ≤ 30

## Topic Tags
`Recursion` `Backtracking` `Array`

## Expected Complexities
| | |
|---|---|
| **Time** | O(2^n) |
| **Space** | O(n) recursion stack |

## Intuition
Unlike Combination Sum I, each element can be used only once. Sorting helps group duplicates. When skipping a value, we skip all its duplicates at the same recursion level to avoid generating duplicate combinations.

## Approach
1. Sort the array
2. Use recursion with index `idx`, current list `current`, and remaining `target`
3. Loop from `i = idx` to `n-1`:
   - Skip duplicates: if `i > idx` and `candidates[i] == candidates[i-1]`, continue
   - If `candidates[i] > remaining`, break (sorted array)
   - Include `candidates[i]`, recurse with `i+1` (can't reuse same element)
   - Backtrack

## Brute Force
### Approach
Generate all 2^n subsets, filter those whose sum equals target, use set to remove duplicates.
### Code
**Python**
```python
def combinationSum2(candidates, target):
    result = set()
    
    def solve(idx, current, remaining):
        if remaining == 0:
            result.add(tuple(sorted(current)))
            return
        if idx == len(candidates):
            return
        # pick
        current.append(candidates[idx])
        solve(idx + 1, current, remaining - candidates[idx])
        current.pop()
        # not pick
        solve(idx + 1, current, remaining)
    
    candidates.sort()
    solve(0, [], target)
    return [list(c) for c in result]
```
**C++**
```cpp
class Solution {
  public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        set<vector<int>> result;
        sort(candidates.begin(), candidates.end());
        
        function<void(int, vector<int>&, int)> solve = [&](int idx, vector<int>& current, int rem) {
            if (rem == 0) {
                result.insert(current);
                return;
            }
            if (idx == candidates.size()) return;
            current.push_back(candidates[idx]);
            solve(idx + 1, current, rem - candidates[idx]);
            current.pop();
            solve(idx + 1, current, rem);
        };
        
        vector<int> temp;
        solve(0, temp, target);
        return vector<vector<int>>(result.begin(), result.end());
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
def combinationSum2(candidates, target):
    result = []
    candidates.sort()
    
    def solve(idx, current, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        for i in range(idx, len(candidates)):
            if i > idx and candidates[i] == candidates[i - 1]:
                continue
            if candidates[i] > remaining:
                break
            current.append(candidates[i])
            solve(i + 1, current, remaining - candidates[i])
            current.pop()
    
    solve(0, [], target)
    return result
```
**C++**
```cpp
class Solution {
  public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        sort(candidates.begin(), candidates.end());
        
        function<void(int, vector<int>&, int)> solve = [&](int idx, vector<int>& current, int rem) {
            if (rem == 0) {
                result.push_back(current);
                return;
            }
            for (int i = idx; i < candidates.size(); i++) {
                if (i > idx && candidates[i] == candidates[i - 1]) continue;
                if (candidates[i] > rem) break;
                current.push_back(candidates[i]);
                solve(i + 1, current, rem - candidates[i]);
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
- **Time:** O(2^n)
- **Space:** O(n) recursion stack

## Key Insight
> Using each element only once (`i+1` on pick) plus skipping duplicates at the same level ensures unique combinations.
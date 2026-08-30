# 46. Permutations

> **Difficulty:** Medium | **Topic:** Recursion, Backtracking | **Platform:** LeetCode

---

## Problem Statement
Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.

## Examples
**Example 1:**
```
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

**Example 2:**
```
Input: nums = [0,1]
Output: [[0,1],[1,0]]
```

## Constraints
- 1 <= nums.length <= 6
- -10 <= nums[i] <= 10
- All the integers of nums are unique.

## Topic Tags
`Array` `Backtracking` `Recursion`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n * n!) |
| **Space** | O(n) |

## Intuition
The idea is to fix one element at each position and recursively permute the remaining elements. At each step, we swap the current element with each of the remaining elements and recurse on the subarray. After the recursive call returns, we backtrack by swapping back to restore the original array.

Alternatively, we can build permutations element by element, maintaining a list of used elements and a current permutation being built.

## Approach
1. Use a recursive function that takes the current index and the array.
2. If the index reaches the end, add the current permutation to the result.
3. For each position from the current index to the end, swap the current index with that position.
4. Recurse on the next index.
5. Backtrack by swapping back.

## Brute Force
### Approach
Try all possible arrangements by swapping elements and backtracking.
### Code
**Python**
```python
class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        result = []
        
        def backtrack(start):
            if start == len(nums):
                result.append(nums[:])
                return
            for i in range(start, len(nums)):
                nums[start], nums[i] = nums[i], nums[start]
                backtrack(start + 1)
                nums[start], nums[i] = nums[i], nums[start]
        
        backtrack(0)
        return result
```
**C++**
```cpp
class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> result;
        backtrack(nums, 0, result);
        return result;
    }
    
    void backtrack(vector<int>& nums, int start, vector<vector<int>>& result) {
        if (start == nums.size()) {
            result.push_back(nums);
            return;
        }
        for (int i = start; i < nums.size(); i++) {
            swap(nums[start], nums[i]);
            backtrack(nums, start + 1, result);
            swap(nums[start], nums[i]);
        }
    }
};
```
### Complexity
- Time: O(n * n!) - n! permutations, each takes O(n) to copy
- Space: O(n) - recursion stack depth

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        result = []
        used = [False] * len(nums)
        
        def backtrack(current):
            if len(current) == len(nums):
                result.append(current[:])
                return
            for i in range(len(nums)):
                if not used[i]:
                    used[i] = True
                    current.append(nums[i])
                    backtrack(current)
                    current.pop()
                    used[i] = False
        
        backtrack([])
        return result
```
**C++**
```cpp
class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> result;
        vector<bool> used(nums.size(), false);
        vector<int> current;
        backtrack(nums, used, current, result);
        return result;
    }
    
    void backtrack(vector<int>& nums, vector<bool>& used, vector<int>& current, vector<vector<int>>& result) {
        if (current.size() == nums.size()) {
            result.push_back(current);
            return;
        }
        for (int i = 0; i < nums.size(); i++) {
            if (!used[i]) {
                used[i] = true;
                current.push_back(nums[i]);
                backtrack(nums, used, current, result);
                current.pop_back();
                used[i] = false;
            }
        }
    }
};
```
### Complexity
- Time: O(n * n!) - generating all permutations
- Space: O(n) - recursion stack and used array

## Key Insight
> Backtracking systematically explores all arrangements by fixing elements at each position and recursively permuting the rest, undoing choices to explore alternatives.

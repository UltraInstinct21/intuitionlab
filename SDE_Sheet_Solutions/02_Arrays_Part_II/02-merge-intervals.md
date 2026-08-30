# 56. Merge Intervals

> **Difficulty:** Medium | **Topic:** Array, Sorting | **LeetCode:** [56](https://leetcode.com/problems/merge-intervals/)

---

## Problem Statement

Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

---

## Examples

**Example 1:**
```
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].
```

**Example 2:**
```
Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.
```

---

## Constraints

- `1 <= intervals.length <= 10^4`
- `intervals[i].length == 2`
- `0 <= starti <= endi <= 10^4`

---

## Topic Tags

`Array` `Sorting`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n log n) |
| **Space** | O(n) excluding output |

---

## Intuition

After sorting intervals by start time, overlapping intervals will be adjacent. We can then merge them in a single pass by checking if the current interval overlaps with the last merged interval.

---

## Approach

1. Sort intervals by start time
2. Initialize result with the first interval
3. For each subsequent interval:
   - If it overlaps with the last interval in result (current start <= last end), merge them
   - Otherwise, add it as a new interval
4. Return result

---

## Brute Force

### Approach

Check every pair of intervals and merge overlapping ones. Repeat until no more merges are possible.

### Code

**Python**
```python
class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        merged = True
        while merged:
            merged = False
            i = 0
            while i < len(intervals):
                j = i + 1
                while j < len(intervals):
                    if (intervals[i][0] <= intervals[j][1] and 
                        intervals[j][0] <= intervals[i][1]):
                        # Merge
                        intervals[i] = [
                            min(intervals[i][0], intervals[j][0]),
                            max(intervals[i][1], intervals[j][1])
                        ]
                        intervals.pop(j)
                        merged = True
                    else:
                        j += 1
                i += 1
        return intervals
```

**C++**
```cpp
class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        vector<vector<int>> result = intervals;
        bool merged = true;
        
        while (merged) {
            merged = false;
            for (int i = 0; i < result.size(); i++) {
                for (int j = i + 1; j < result.size(); j++) {
                    if (result[i][0] <= result[j][1] && result[j][0] <= result[i][1]) {
                        result[i] = {
                            min(result[i][0], result[j][0]),
                            max(result[i][1], result[j][1])
                        };
                        result.erase(result.begin() + j);
                        merged = true;
                        break;
                    }
                }
                if (merged) break;
            }
        }
        return result;
    }
};
```

### Complexity
- **Time:** O(n²) or O(n³) depending on implementation
- **Space:** O(n)

---

## Optimized Solution

### Approach

Sort by start time, then merge in a single pass.

### Code

**Python**
```python
class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        intervals.sort()
        result = []
        
        for interval in intervals:
            if not result or result[-1][1] < interval[0]:
                result.append(interval)
            else:
                result[-1][1] = max(result[-1][1], interval[1])
        
        return result
```

**C++**
```cpp
class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> result;
        
        for (auto& interval : intervals) {
            if (result.empty() || result.back()[1] < interval[0]) {
                result.push_back(interval);
            } else {
                result.back()[1] = max(result.back()[1], interval[1]);
            }
        }
        
        return result;
    }
};
```

### Complexity
- **Time:** O(n log n) for sorting
- **Space:** O(n) excluding output

---

## Key Insight

> After sorting by start time, overlapping intervals are adjacent. Simply check if current interval starts before the last one ends, and merge if so.

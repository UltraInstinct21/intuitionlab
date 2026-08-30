# N Meetings in One Room

> **Difficulty:** Medium | **Topic:** Greedy, Sorting | **Platform:** GeeksforGeeks

---

## Problem Statement
You are given timings of n meetings in the form of (start[i], end[i]) where start[i] is the start time of meeting i and end[i] is the end time of meeting i. You need to find the maximum number of meetings that can be accommodated in the meeting room. You can start a new meeting just after the completion of a previous meeting. Print the maximum number of meetings that can be held.

## Examples
**Example 1:**
```
Input: start[] = [1, 3, 0, 5, 8, 5], end[] = [2, 4, 6, 7, 9, 9]
Output: 4
Explanation: Meetings that can be held are: (1,2), (3,4), (5,7), (8,9)
```

**Example 2:**
```
Input: start[] = [10, 12, 20], end[] = [20, 25, 30]
Output: 1
Explanation: Only one meeting can be held as all overlap with each other.
```

## Constraints
- 1 ≤ n ≤ 10^5
- 0 ≤ start[i] < end[i] ≤ 10^5

## Topic Tags
`Greedy` `Sorting`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n log n) |
| **Space** | O(n) |

## Intuition
The key idea is to always pick the meeting that finishes earliest. This leaves the maximum remaining time for other meetings. By sorting meetings based on their end times and greedily selecting meetings that don't conflict with the previously selected one, we maximize the count.

## Approach
1. Create pairs of (start, end) for all meetings.
2. Sort the pairs based on end time (ascending). If end times are equal, sort by start time.
3. Initialize count = 1 and set the end time of the first meeting as the reference.
4. Iterate through the sorted meetings. If the start time of the current meeting is greater than the end time of the last selected meeting, select it and update the reference.

## Brute Force
### Approach
Try all possible subsets of meetings and check which subset has the maximum number of non-overlapping meetings. This is exponential in nature.
### Complexity
- Time: O(2^n)
- Space: O(n)

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def maximumMeetings(self, n, start, end):
        meetings = []
        for i in range(n):
            meetings.append((start[i], end[i]))
        
        meetings.sort(key=lambda x: (x[1], x[0]))
        
        count = 1
        last_end = meetings[0][1]
        
        for i in range(1, n):
            if meetings[i][0] > last_end:
                count += 1
                last_end = meetings[i][1]
        
        return count
```

**C++**
```cpp
class Solution {
public:
    int maximumMeetings(int n, vector<int>& start, vector<int>& end) {
        vector<pair<int,int>> meetings;
        for (int i = 0; i < n; i++) {
            meetings.push_back({end[i], start[i]});
        }
        
        sort(meetings.begin(), meetings.end());
        
        int count = 1;
        int lastEnd = meetings[0].first;
        
        for (int i = 1; i < n; i++) {
            if (meetings[i].second > lastEnd) {
                count++;
                lastEnd = meetings[i].first;
            }
        }
        
        return count;
    }
};
```

### Complexity
- Time: O(n log n)
- Space: O(n)

## Key Insight
> Always select the meeting that finishes earliest to maximize the total number of non-overlapping meetings.

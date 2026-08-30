# Minimum Number of Platforms Required for a Railway Station

> **Difficulty:** Medium | **Topic:** Greedy, Sorting, Two Pointers | **Platform:** GeeksforGeeks

---

## Problem Statement
Given arrival and departure times of all trains that reach a railway station, find the minimum number of platforms required for the railway station so that no train waits.

## Examples
**Example 1:**
```
Input: arr[] = [900, 940, 950, 1100, 1500, 1800], dep[] = [920, 1200, 1120, 1130, 1900, 2000]
Output: 3
Explanation: There are at most three trains at any time on platform.
```

**Example 2:**
```
Input: arr[] = [100, 200, 300], dep[] = [200, 300, 400]
Output: 1
Explanation: All trains arrive and depart at different times.
```

## Constraints
- 1 ≤ n ≤ 50000
- 0 ≤ arr[i] ≤ dep[i] ≤ 2359

## Topic Tags
`Greedy` `Sorting` `Two Pointers`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n log n) |
| **Space** | O(1) |

## Intuition
The idea is to track the simultaneous presence of trains. When a train arrives, we need a platform; when it departs, we free one. By sorting arrival and departure times separately and using two pointers, we can simulate the process of counting maximum simultaneous trains.

## Approach
1. Sort both the arrival and departure arrays.
2. Use two pointers: one for arrival (i) and one for departure (j).
3. If arr[i] <= dep[j], a train has arrived before the previous one departs, so increment platforms needed and move to the next arrival.
4. If arr[i] > dep[j], a train has departed, so decrement platforms needed and move to the next departure.
5. Track and return the maximum platforms needed at any point.

## Brute Force
### Approach
For each time point, count how many trains are present by checking all intervals. This is very inefficient.
### Complexity
- Time: O(n^2)
- Space: O(1)

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def minimumPlatform(self, n, arr, dep):
        arr.sort()
        dep.sort()
        
        platforms_needed = 0
        max_platforms = 0
        i = 0
        j = 0
        
        while i < n and j < n:
            if arr[i] <= dep[j]:
                platforms_needed += 1
                max_platforms = max(max_platforms, platforms_needed)
                i += 1
            else:
                platforms_needed -= 1
                j += 1
        
        return max_platforms
```

**C++**
```cpp
class Solution {
public:
    int minimumPlatform(int n, vector<int>& arr, vector<int>& dep) {
        sort(arr.begin(), arr.end());
        sort(dep.begin(), dep.end());
        
        int platforms = 0;
        int maxPlatforms = 0;
        int i = 0, j = 0;
        
        while (i < n && j < n) {
            if (arr[i] <= dep[j]) {
                platforms++;
                maxPlatforms = max(maxPlatforms, platforms);
                i++;
            } else {
                platforms--;
                j++;
            }
        }
        
        return maxPlatforms;
    }
};
```

### Complexity
- Time: O(n log n)
- Space: O(1)

## Key Insight
> Sorting arrivals and departures separately and using two pointers allows us to simulate platform usage in O(n log n) time.

# Aggressive Cows

> **Difficulty:** Hard | **Topic:** Binary Search, Greedy | **Platform:** GeeksforGeeks

---

## Problem Statement
You are given an array `stalls` of size `n` which denotes the positions of the stalls on a number line. You are also given an integer `k` which denotes the number of aggressive cows. The cows are aggressive such that every cow tries to occupy the stall farthest from the others, starting from the leftmost or rightmost end.

The task is to place `k` cows in the stalls such that the minimum distance between any two cows is maximized. Return this maximum minimum distance.

## Examples
**Example 1:**
```
Input: stalls = [1, 2, 4, 8, 8], k = 3
Output: 3
Explanation: Place cows at positions 1, 4, and 8. Minimum distance = 3.
```

**Example 2:**
```
Input: stalls = [1, 2, 4, 8, 9], k = 3
Output: 3
```

## Constraints
- 2 <= stalls.length <= 10^5
- 1 <= stalls[i] <= 10^9
- 2 <= k <= stalls.length

## Topic Tags
`Binary Search` `Greedy` `Sorting`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n * log(max_stall - min_stall)) |
| **Space** | O(1) |

## Intuition
The maximum minimum distance lies between 1 and `(max - min) / (k - 1)`. We binary search on this range. For each candidate distance, we greedily place cows starting from the first stall, ensuring each cow is at least `dist` away from the previous one. If we can place all k cows, the distance is feasible.

## Approach
1. Sort the stalls array.
2. Set `low = 1`, `high = (max - min) / (k - 1)`.
3. Binary search on the distance:
   - For each `mid`, check if we can place `k` cows with minimum distance `mid`.
   - Greedy: place first cow at stalls[0], then place subsequent cows at the first stall ≥ previous + mid.
   - If we can place all k cows, try a larger distance: `low = mid + 1`.
   - Otherwise, try a smaller distance: `high = mid - 1`.
4. Return `high` as the answer.

## Brute Force
### Approach
Check every possible distance from 1 to max distance, and for each check if we can place k cows greedily.

### Code
**Python**
```python
def canPlace(stalls, k, dist):
    count, lastPos = 1, stalls[0]
    for i in range(1, len(stalls)):
        if stalls[i] - lastPos >= dist:
            count += 1
            lastPos = stalls[i]
    return count >= k

def solve(n, k, stalls):
    stalls.sort()
    for dist in range(1, (stalls[-1] - stalls[0]) // (k - 1) + 2):
        if canPlace(stalls, k, dist):
            return dist
    return -1
```

**C++**
```cpp
bool canPlace(vector<int>& stalls, int k, int dist) {
    int count = 1, lastPos = stalls[0];
    for (int i = 1; i < stalls.size(); i++) {
        if (stalls[i] - lastPos >= dist) {
            count++;
            lastPos = stalls[i];
        }
    }
    return count >= k;
}

int solve(int n, int k, vector<int>& stalls) {
    sort(stalls.begin(), stalls.end());
    for (int dist = 1; dist <= (stalls.back() - stalls[0]) / (k - 1) + 1; dist++) {
        if (canPlace(stalls, k, dist)) return dist;
    }
    return -1;
}
```

### Complexity
- **Time:** O(n * (max - min) / k) - linear check for each distance
- **Space:** O(1)

## Optimized Solution
### Code
**Python**
```python
def canPlace(stalls, k, dist):
    count, lastPos = 1, stalls[0]
    for i in range(1, len(stalls)):
        if stalls[i] - lastPos >= dist:
            count += 1
            lastPos = stalls[i]
    return count >= k

def solve(n, k, stalls):
    stalls.sort()
    low, high = 1, (stalls[-1] - stalls[0]) // (k - 1)
    result = -1

    while low <= high:
        mid = (low + high) // 2
        if canPlace(stalls, k, mid):
            result = mid
            low = mid + 1
        else:
            high = mid - 1

    return result
```

**C++**
```cpp
bool canPlace(vector<int>& stalls, int k, int dist) {
    int count = 1, lastPos = stalls[0];
    for (int i = 1; i < stalls.size(); i++) {
        if (stalls[i] - lastPos >= dist) {
            count++;
            lastPos = stalls[i];
        }
    }
    return count >= k;
}

int solve(int n, int k, vector<int>& stalls) {
    sort(stalls.begin(), stalls.end());
    int low = 1, high = (stalls.back() - stalls[0]) / (k - 1);
    int result = -1;

    while (low <= high) {
        int mid = (low + high) / 2;
        if (canPlace(stalls, k, mid)) {
            result = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return result;
}
```

### Complexity
- **Time:** O(n * log(max_stall - min_stall)) - binary search with greedy check
- **Space:** O(1)

## Key Insight
> The maximum minimum distance binary searches between 1 and `(max - min) / (k - 1)`. A greedy O(n) check validates if k cows can be placed at a given distance, giving O(n * log(range)) overall.

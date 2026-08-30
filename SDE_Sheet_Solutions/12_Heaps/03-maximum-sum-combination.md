# Maximum Sum Combinations

> **Difficulty:** Hard | **Topic:** Heap, Arrays, Sorting | **Platform:** GeeksforGeeks

---

## Problem Statement
Given two integer arrays `A` and `B` of size `N` each, and an integer `C`, find the maximum sum of `C` combinations where each combination consists of one element from `A` and one element from `B`. Return the `C` maximum sums in sorted descending order.

Each element from `A` can be paired with at most one element from `B` and vice versa.

## Examples
**Example 1:**
```
Input: A = [1, 4, 2, 3], B = [2, 5, 1, 6], C = 3
Output: [10, 9, 8]
Explanation: 
Maximum sum combinations: (4+6)=10, (3+6)=9, (4+5)=9
```

**Example 2:**
```
Input: A = [1, 2, 3], B = [4, 5, 6], C = 2
Output: [9, 8]
Explanation: Maximum sum combinations: (3+6)=9, (3+5)=8
```

## Constraints
- 1 ≤ N ≤ 10⁵
- 1 ≤ C ≤ N
- -10⁴ ≤ A[i], B[i] ≤ 10⁴

## Topic Tags
`Heap` `Arrays` `Sorting` `Greedy` `Priority Queue`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N log N + C log C) |
| **Space** | O(N + C) |

## Intuition
The brute force approach would generate all N² combinations, sort them, and return the top C. This is too slow for large N. 

We can optimize by sorting both arrays in descending order. The maximum sum will be the sum of the largest elements from both arrays. We use a max-heap to efficiently track the top C combinations. Starting with the pair (0,0) representing the largest elements from both arrays, we explore neighboring pairs by moving to next elements in either array, avoiding duplicates using a visited set.

## Approach
1. Sort both arrays A and B in descending order.
2. Use a max-heap (priority queue) to store tuples of (sum, i, j) where i and j are indices in A and B.
3. Start by pushing (A[0]+B[0], 0, 0) to the heap.
4. For each extraction from heap, add the sum to result, then push (A[i+1]+B[j], i+1, j) and (A[i]+B[j+1], i, j+1) if not visited.
5. Continue until we have C sums.
6. Return the sums in sorted descending order.

## Brute Force
### Approach
Generate all possible sums by pairing every element from A with every element from B. Sort all sums in descending order and return the top C.

### Code
**Python**
```python
class Solution:
    def maxCombinations(self, N: int, K: int, A: list[int], B: list[int]) -> list[int]:
        sums = []
        for i in range(N):
            for j in range(N):
                sums.append(A[i] + B[j])
        sums.sort(reverse=True)
        return sums[:K]
```

**C++**
```cpp
class Solution {
public:
    vector<int> maxCombinations(int N, int K, vector<int>& A, vector<int>& B) {
        vector<int> sums;
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                sums.push_back(A[i] + B[j]);
            }
        }
        sort(sums.rbegin(), sums.rend());
        return vector<int>(sums.begin(), sums.begin() + K);
    }
};
```

### Complexity
- **Time:** O(N² log N)
- **Space:** O(N²)

## Optimized Solution
### Code
**Python**
```python
import heapq

class Solution:
    def maxCombinations(self, N: int, K: int, A: list[int], B: list[int]) -> list[int]:
        A.sort(reverse=True)
        B.sort(reverse=True)

        max_heap = [(-(A[0] + B[0]), 0, 0)]
        visited = set()
        visited.add((0, 0))

        result = []

        while len(result) < K and max_heap:
            neg_sum, i, j = heapq.heappop(max_heap)
            result.append(-neg_sum)

            if i + 1 < N and (i + 1, j) not in visited:
                heapq.heappush(max_heap, (-(A[i + 1] + B[j]), i + 1, j))
                visited.add((i + 1, j))

            if j + 1 < N and (i, j + 1) not in visited:
                heapq.heappush(max_heap, (-(A[i] + B[j + 1]), i, j + 1))
                visited.add((i, j + 1))

        return result
```

**C++**
```cpp
class Solution {
public:
    vector<int> maxCombinations(int N, int K, vector<int>& A, vector<int>& B) {
        sort(A.rbegin(), A.rend());
        sort(B.rbegin(), B.rend());

        priority_queue<tuple<int, int, int>> maxHeap;
        set<pair<int, int>> visited;

        maxHeap.push({A[0] + B[0], 0, 0});
        visited.insert({0, 0});

        vector<int> result;

        while (result.size() < K && !maxHeap.empty()) {
            auto [sum, i, j] = maxHeap.top();
            maxHeap.pop();
            result.push_back(sum);

            if (i + 1 < N && visited.find({i + 1, j}) == visited.end()) {
                maxHeap.push({A[i + 1] + B[j], i + 1, j});
                visited.insert({i + 1, j});
            }

            if (j + 1 < N && visited.find({i, j + 1}) == visited.end()) {
                maxHeap.push({A[i] + B[j + 1], i, j + 1});
                visited.insert({i, j + 1});
            }
        }

        return result;
    }
};
```

### Complexity
- **Time:** O(N log N + K log K) - sorting + heap operations
- **Space:** O(N + K) - for visited set and heap

## Key Insight
> By sorting both arrays in descending order and using a max-heap with visited tracking, we efficiently explore only the most promising combinations without generating all N² possibilities, achieving O(N log N + K log K) complexity.
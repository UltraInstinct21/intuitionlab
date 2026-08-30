# Merge K Sorted Arrays

> **Difficulty:** Medium | **Topic:** Heap, Arrays, Divide and Conquer | **Platform:** GeeksforGeeks

---

## Problem Statement
Given `K` sorted arrays of size `N` each, merge them into a single sorted array.

## Examples
**Example 1:**
```
Input: K = 3, N = 4
arrays = [[1, 2, 3, 4], [2, 2, 3, 4], [5, 5, 6, 6]]
Output: [1, 2, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]
```

**Example 2:**
```
Input: K = 4, N = 3
arrays = [[1, 3, 5], [2, 4, 6], [0, 8, 9], [7, 10, 11]]
Output: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
```

## Constraints
- 1 ≤ K ≤ 100
- 1 ≤ N ≤ 100
- 0 ≤ arrays[i][j] ≤ 10⁶

## Topic Tags
`Heap` `Arrays` `Divide and Conquer` `Merge Sort` `Priority Queue`

## Expected Complexities
| | |
|---|---|
| **Time** | O(NK log K) |
| **Space** | O(NK) |

## Intuition
We can use a min-heap to efficiently merge K sorted arrays. The idea is to:
1. Insert the first element of each array into a min-heap along with the array index and element index.
2. Extract the minimum element from the heap and add it to the result.
3. If there are more elements in the same array, push the next element to the heap.
4. Repeat until the heap is empty.

This approach processes elements in sorted order without having to sort the entire merged array.

## Approach
1. Create a min-heap storing tuples of (value, array_index, element_index).
2. Initialize by pushing the first element of each non-empty array.
3. While heap is not empty:
   - Extract minimum element.
   - Add value to result.
   - If there's a next element in the same array, push it to heap.
4. Return the result array.

## Brute Force
### Approach
Concatenate all arrays into one, then sort the concatenated array.

### Code
**Python**
```python
class Solution:
    def mergeKArrays(self, arrays: list[list[int]]) -> list[int]:
        result = []
        for arr in arrays:
            result.extend(arr)
        result.sort()
        return result
```

**C++**
```cpp
class Solution {
public:
    vector<int> mergeKArrays(vector<vector<int>>& arrays) {
        vector<int> result;
        for (auto& arr : arrays) {
            result.insert(result.end(), arr.begin(), arr.end());
        }
        sort(result.begin(), result.end());
        return result;
    }
};
```

### Complexity
- **Time:** O(NK log(NK))
- **Space:** O(NK)

## Optimized Solution
### Code
**Python**
```python
import heapq

class Solution:
    def mergeKArrays(self, arrays: list[list[int]]) -> list[int]:
        result = []
        min_heap = []

        for i in range(len(arrays)):
            if arrays[i]:
                heapq.heappush(min_heap, (arrays[i][0], i, 0))

        while min_heap:
            val, arr_idx, elem_idx = heapq.heappop(min_heap)
            result.append(val)

            if elem_idx + 1 < len(arrays[arr_idx]):
                heapq.heappush(min_heap, (arrays[arr_idx][elem_idx + 1], arr_idx, elem_idx + 1))

        return result
```

**C++**
```cpp
class Solution {
public:
    vector<int> mergeKArrays(vector<vector<int>>& arrays) {
        vector<int> result;
        priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<tuple<int, int, int>>> minHeap;

        for (int i = 0; i < arrays.size(); i++) {
            if (!arrays[i].empty()) {
                minHeap.push({arrays[i][0], i, 0});
            }
        }

        while (!minHeap.empty()) {
            auto [val, arrIdx, elemIdx] = minHeap.top();
            minHeap.pop();
            result.push_back(val);

            if (elemIdx + 1 < arrays[arrIdx].size()) {
                minHeap.push({arrays[arrIdx][elemIdx + 1], arrIdx, elemIdx + 1});
            }
        }

        return result;
    }
};
```

### Complexity
- **Time:** O(NK log K) - each of NK elements is pushed and popped from heap of size K
- **Space:** O(NK) for result + O(K) for heap

## Alternative Approach (Merge Pairs)
### Code
**Python**
```python
import heapq

class Solution:
    def mergeKArrays(self, arrays: list[list[int]]) -> list[int]:
        def mergeTwo(arr1, arr2):
            result = []
            i, j = 0, 0
            while i < len(arr1) and j < len(arr2):
                if arr1[i] <= arr2[j]:
                    result.append(arr1[i])
                    i += 1
                else:
                    result.append(arr2[j])
                    j += 1
            result.extend(arr1[i:])
            result.extend(arr2[j:])
            return result

        result = arrays[0]
        for i in range(1, len(arrays)):
            result = mergeTwo(result, arrays[i])

        return result
```

**C++**
```cpp
class Solution {
public:
    vector<int> mergeKArrays(vector<vector<int>>& arrays) {
        auto mergeTwo = [](vector<int>& arr1, vector<int>& arr2) {
            vector<int> result;
            int i = 0, j = 0;
            while (i < arr1.size() && j < arr2.size()) {
                if (arr1[i] <= arr2[j]) {
                    result.push_back(arr1[i++]);
                } else {
                    result.push_back(arr2[j++]);
                }
            }
            while (i < arr1.size()) result.push_back(arr1[i++]);
            while (j < arr2.size()) result.push_back(arr2[j++]);
            return result;
        };

        vector<int> result = arrays[0];
        for (int i = 1; i < arrays.size(); i++) {
            result = mergeTwo(result, arrays[i]);
        }

        return result;
    }
};
```

### Complexity
- **Time:** O(NK²) worst case for sequential merging
- **Space:** O(NK)

## Key Insight
> Using a min-heap to track the smallest element among the current heads of all K arrays allows us to efficiently merge them in sorted order, processing each element exactly once with O(log K) heap operations.
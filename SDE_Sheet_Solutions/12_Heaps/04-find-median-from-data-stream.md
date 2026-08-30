# 295. Find Median from Data Stream

> **Difficulty:** Hard | **Topic:** Heap, Design, Data Stream | **Platform:** LeetCode

---

## Problem Statement
The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

Implement the `MedianFinder` class:
- `MedianFinder()` initializes the `MedianFinder` object.
- `void addNum(int num)` adds the integer `num` from the data stream to the data structure.
- `double findMedian()` returns the median of all elements so far.

## Examples
**Example 1:**
```
Input:
["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
Output: [null, null, null, 1.5, null, 2.0]

Explanation:
MedianFinder medianFinder = new MedianFinder();
medianFinder.addNum(1);    // arr = [1]
medianFinder.addNum(2);    // arr = [1, 2]
medianFinder.findMedian(); // return 1.5
medianFinder.addNum(3);    // arr = [1, 2, 3]
medianFinder.findMedian(); // return 2.0
```

## Constraints
- -10⁵ ≤ num ≤ 10⁵
- There will be at least one element in the data structure before calling findMedian.
- At most 5 * 10⁴ calls will be made to addNum and findMedian.

## Topic Tags
`Two Pointers` `Heap` `Design` `Data Stream` `Sorting`

## Expected Complexities
| | |
|---|---|
| **Time** | O(log N) addNum, O(1) findMedian |
| **Space** | O(N) |

## Intuition
To find the median efficiently, we can maintain two heaps:
1. A max-heap to store the smaller half of numbers.
2. A min-heap to store the larger half of numbers.

The max-heap stores the lower half, and the min-heap stores the upper half. The heaps are balanced such that their sizes differ by at most 1. The median is either the root of the larger heap (if sizes differ) or the average of both roots (if sizes are equal).

When adding a number, we first add it to the max-heap, then move the max of max-heap to min-heap to maintain balance. This ensures all elements in max-heap ≤ all elements in min-heap.

## Approach
1. Use two heaps: `max_heap` (inverted values for Python's min-heap) for lower half, `min_heap` for upper half.
2. For `addNum`: Add to max-heap, then move max to min-heap. If min-heap is larger, move min back to max-heap.
3. For `findMedian`: If heaps are equal size, return average of both roots. Otherwise, return root of larger heap.

## Brute Force
### Approach
Store all numbers in a list. For each `findMedian`, sort the list and find the middle element.

### Code
**Python**
```python
class MedianFinder:
    def __init__(self):
        self.nums = []

    def addNum(self, num: int) -> None:
        self.nums.append(num)

    def findMedian(self) -> float:
        self.nums.sort()
        n = len(self.nums)
        if n % 2 == 1:
            return self.nums[n // 2]
        else:
            return (self.nums[n // 2 - 1] + self.nums[n // 2]) / 2
```

**C++**
```cpp
class MedianFinder {
    vector<int> nums;
public:
    MedianFinder() {}

    void addNum(int num) {
        nums.push_back(num);
    }

    double findMedian() {
        sort(nums.begin(), nums.end());
        int n = nums.size();
        if (n % 2 == 1)
            return nums[n / 2];
        else
            return (nums[n / 2 - 1] + nums[n / 2]) / 2.0;
    }
};
```

### Complexity
- **Time:** O(N) addNum, O(N log N) findMedian
- **Space:** O(N)

## Optimized Solution
### Code
**Python**
```python
import heapq

class MedianFinder:
    def __init__(self):
        self.max_heap = []  # Lower half (inverted for max-heap behavior)
        self.min_heap = []  # Upper half

    def addNum(self, num: int) -> None:
        heapq.heappush(self.max_heap, -num)
        heapq.heappush(self.min_heap, -heapq.heappop(self.max_heap))

        if len(self.min_heap) > len(self.max_heap):
            heapq.heappush(self.max_heap, -heapq.heappop(self.min_heap))

    def findMedian(self) -> float:
        if len(self.max_heap) > len(self.min_heap):
            return -self.max_heap[0]
        else:
            return (-self.max_heap[0] + self.min_heap[0]) / 2.0

    def __len__(self):
        return len(self.max_heap) + len(self.min_heap)

    def __repr__(self):
        all_nums = sorted([-x for x in self.max_heap] + self.min_heap)
        return f"MedianFinder({all_nums})"
```

**C++**
```cpp
class MedianFinder {
    priority_queue<int> maxHeap;  // Lower half
    priority_queue<int, vector<int>, greater<int>> minHeap;  // Upper half

public:
    MedianFinder() {}

    void addNum(int num) {
        maxHeap.push(num);
        minHeap.push(maxHeap.top());
        maxHeap.pop();

        if (minHeap.size() > maxHeap.size()) {
            maxHeap.push(minHeap.top());
            minHeap.pop();
        }
    }

    double findMedian() {
        if (maxHeap.size() > minHeap.size())
            return maxHeap.top();
        else
            return (maxHeap.top() + minHeap.top()) / 2.0;
    }
};
```

### Complexity
- **Time:** O(log N) addNum, O(1) findMedian
- **Space:** O(N)

## Key Insight
> By maintaining two heaps where the max-heap stores the lower half and min-heap stores the upper half, we can access the median in O(1) time by looking at the roots, while insertions take O(log N) to maintain heap balance.
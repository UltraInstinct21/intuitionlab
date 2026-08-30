# 215. Kth Largest Element in an Array

> **Difficulty:** Medium | **Topic:** Heap, Sorting, Divide and Conquer | **Platform:** LeetCode

---

## Problem Statement
Given an integer array `nums` and an integer `k`, return the `kth` largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element.

You must solve it in O(n) time complexity.

## Examples
**Example 1:**
```
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5
```

**Example 2:**
```
Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
Output: 4
```

## Constraints
- 1 ≤ k ≤ nums.length ≤ 10⁵
- -10⁴ ≤ nums[i] ≤ 10⁴

## Topic Tags
`Array` `Heap` `Sorting` `Divide and Conquer` `Quickselect`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N) average, O(N²) worst |
| **Space** | O(1) |

## Intuition
The kth largest element is equivalent to the (n-k+1)th smallest element. We can use a min-heap of size k to track the k largest elements, or use Quickselect algorithm which is similar to QuickSort but only recurses into one partition.

For the heap approach: maintain a min-heap of size k. Iterate through array, push elements to heap. If heap size exceeds k, pop the minimum. At the end, the root of min-heap is the kth largest.

For Quickselect: partition array around a pivot, recursively search only in the partition containing the target position.

## Approach
1. **Min-Heap Approach:** Build a min-heap of size k from first k elements. For remaining elements, if element > heap root, replace root and heapify.
2. **Quickselect Approach:** Choose pivot, partition array into elements less than and greater than pivot. Recurse into appropriate partition.
3. **Built-in Sort:** Sort array in descending order, return kth element (not optimal but works).

## Brute Force
### Approach
Sort the array in descending order and return the element at index k-1.

### Code
**Python**
```python
class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        nums.sort(reverse=True)
        return nums[k - 1]
```

**C++**
```cpp
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        sort(nums.rbegin(), nums.rend());
        return nums[k - 1];
    }
};
```

### Complexity
- **Time:** O(N log N)
- **Space:** O(1) or O(N) depending on sort implementation

## Optimized Solution
### Code
**Python**
```python
import heapq

class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        min_heap = nums[:k]
        heapq.heapify(min_heap)

        for num in nums[k:]:
            if num > min_heap[0]:
                heapq.heapreplace(min_heap, num)

        return min_heap[0]
```

**C++**
```cpp
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> minHeap(nums.begin(), nums.begin() + k);

        for (int i = k; i < nums.size(); i++) {
            if (nums[i] > minHeap.top()) {
                minHeap.pop();
                minHeap.push(nums[i]);
            }
        }

        return minHeap.top();
    }
};
```

### Complexity
- **Time:** O(N log K)
- **Space:** O(K)

## Alternative Optimized Solution (Quickselect)
### Code
**Python**
```python
import random

class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        target = len(nums) - k

        def quickselect(left, right):
            pivot_idx = random.randint(left, right)
            nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
            pivot = nums[right]
            store_idx = left

            for i in range(left, right):
                if nums[i] <= pivot:
                    nums[store_idx], nums[i] = nums[i], nums[store_idx]
                    store_idx += 1

            nums[store_idx], nums[right] = nums[right], nums[store_idx]

            if store_idx == target:
                return nums[store_idx]
            elif store_idx < target:
                return quickselect(store_idx + 1, right)
            else:
                return quickselect(left, store_idx - 1)

        return quickselect(0, len(nums) - 1)
```

**C++**
```cpp
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        int target = nums.size() - k;
        return quickselect(nums, 0, nums.size() - 1, target);
    }

private:
    int quickselect(vector<int>& nums, int left, int right, int target) {
        int pivotIdx = left + rand() % (right - left + 1);
        swap(nums[pivotIdx], nums[right]);
        int pivot = nums[right];
        int storeIdx = left;

        for (int i = left; i < right; i++) {
            if (nums[i] <= pivot) {
                swap(nums[storeIdx], nums[i]);
                storeIdx++;
            }
        }

        swap(nums[storeIdx], nums[right]);

        if (storeIdx == target)
            return nums[storeIdx];
        else if (storeIdx < target)
            return quickselect(nums, storeIdx + 1, right, target);
        else
            return quickselect(nums, left, storeIdx - 1, target);
    }
};
```

### Complexity
- **Time:** O(N) average, O(N²) worst
- **Space:** O(1)

## Key Insight
> Using a min-heap of size k ensures we only keep track of k largest elements seen so far, achieving O(N log K) time with O(K) space, which is optimal for this problem.
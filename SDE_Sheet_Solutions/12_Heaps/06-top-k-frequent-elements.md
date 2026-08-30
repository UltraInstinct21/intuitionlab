# 347. Top K Frequent Elements

> **Difficulty:** Medium | **Topic:** Heap, Hash Map, Bucket Sort | **Platform:** LeetCode

---

## Problem Statement
Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.

## Examples
**Example 1:**
```
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]
```

**Example 2:**
```
Input: nums = [1], k = 1
Output: [1]
```

## Constraints
- 1 ≤ nums.length ≤ 10⁵
- -10⁴ ≤ nums[i] ≤ 10⁴
- k is in the range [1, the number of unique elements in the array]
- It is guaranteed that the answer is unique.

## Topic Tags
`Array` `Heap` `Hash Map` `Bucket Sort` `Sorting`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N log K) or O(N) with bucket sort |
| **Space** | O(N) |

## Intuition
We need to find the k elements with highest frequency. There are several approaches:

1. **Min-Heap of size k:** Count frequencies using a hash map, then maintain a min-heap of size k. For each element, if heap size < k, push. If element's frequency > min-heap root's frequency, replace root.

2. **Bucket Sort:** Since frequencies range from 1 to N, create buckets where index represents frequency. Place elements in their frequency bucket. Then iterate from highest frequency bucket down, collecting k elements.

3. **Quickselect:** Similar to finding kth largest, but on frequency counts.

## Approach
1. Count frequency of each element using a hash map.
2. **For Min-Heap approach:** Create a min-heap of size k storing (frequency, element). Iterate through frequency map, maintain heap of top k frequent elements.
3. **For Bucket Sort approach:** Create N+1 buckets (0 to N). Place each element in bucket corresponding to its frequency. Iterate buckets from high to low, collecting elements until k are found.

## Brute Force
### Approach
Count frequencies, sort by frequency in descending order, return first k elements.

### Code
**Python**
```python
from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        count = Counter(nums)
        sorted_nums = sorted(count.keys(), key=lambda x: count[x], reverse=True)
        return sorted_nums[:k]
```

**C++**
```cpp
class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> count;
        for (int num : nums) {
            count[num]++;
        }

        vector<pair<int, int>> freq(count.begin(), count.end());
        sort(freq.begin(), freq.end(), [](const auto& a, const auto& b) {
            return a.second > b.second;
        });

        vector<int> result;
        for (int i = 0; i < k; i++) {
            result.push_back(freq[i].first);
        }
        return result;
    }
};
```

### Complexity
- **Time:** O(N log N)
- **Space:** O(N)

## Optimized Solution (Min-Heap)
### Code
**Python**
```python
import heapq
from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        count = Counter(nums)

        min_heap = []
        for num, freq in count.items():
            if len(min_heap) < k:
                heapq.heappush(min_heap, (freq, num))
            elif freq > min_heap[0][0]:
                heapq.heapreplace(min_heap, (freq, num))

        return [num for freq, num in min_heap]
```

**C++**
```cpp
class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> count;
        for (int num : nums) {
            count[num]++;
        }

        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> minHeap;

        for (auto& [num, freq] : count) {
            if (minHeap.size() < k) {
                minHeap.push({freq, num});
            } else if (freq > minHeap.top().first) {
                minHeap.pop();
                minHeap.push({freq, num});
            }
        }

        vector<int> result;
        while (!minHeap.empty()) {
            result.push_back(minHeap.top().second);
            minHeap.pop();
        }

        return result;
    }
};
```

### Complexity
- **Time:** O(N log K)
- **Space:** O(N + K)

## Optimized Solution (Bucket Sort)
### Code
**Python**
```python
from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        count = Counter(nums)
        n = len(nums)

        buckets = [[] for _ in range(n + 1)]
        for num, freq in count.items():
            buckets[freq].append(num)

        result = []
        for i in range(n, 0, -1):
            for num in buckets[i]:
                result.append(num)
                if len(result) == k:
                    return result

        return result
```

**C++**
```cpp
class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> count;
        for (int num : nums) {
            count[num]++;
        }

        int n = nums.size();
        vector<vector<int>> buckets(n + 1);

        for (auto& [num, freq] : count) {
            buckets[freq].push_back(num);
        }

        vector<int> result;
        for (int i = n; i >= 0; i--) {
            for (int num : buckets[i]) {
                result.push_back(num);
                if (result.size() == k) {
                    return result;
                }
            }
        }

        return result;
    }
};
```

### Complexity
- **Time:** O(N)
- **Space:** O(N)

## Alternative Optimized Solution (Quickselect)
### Code
**Python**
```python
import random
from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        count = Counter(nums)
        unique = list(count.keys())

        def quickselect(left, right, k_smallest):
            if left == right:
                return

            pivot_idx = random.randint(left, right)
            pivot_idx = partition(left, right, pivot_idx)

            if k_smallest == pivot_idx:
                return
            elif k_smallest < pivot_idx:
                quickselect(left, pivot_idx - 1, k_smallest)
            else:
                quickselect(pivot_idx + 1, right, k_smallest)

        def partition(left, right, pivot_idx):
            pivot_freq = count[unique[pivot_idx]]
            unique[pivot_idx], unique[right] = unique[right], unique[pivot_idx]
            store_idx = left

            for i in range(left, right):
                if count[unique[i]] < pivot_freq:
                    unique[store_idx], unique[i] = unique[i], unique[store_idx]
                    store_idx += 1

            unique[store_idx], unique[right] = unique[right], unique[store_idx]
            return store_idx

        n = len(unique)
        quickselect(0, n - 1, n - k)
        return unique[n - k:]
```

**C++**
```cpp
class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> count;
        for (int num : nums) {
            count[num]++;
        }

        vector<int> unique;
        for (auto& [num, freq] : count) {
            unique.push_back(num);
        }

        int n = unique.size();
        quickselect(unique, count, 0, n - 1, n - k);

        return vector<int>(unique.begin() + n - k, unique.end());
    }

private:
    void quickselect(vector<int>& unique, unordered_map<int, int>& count,
                     int left, int right, int k_smallest) {
        if (left == right) return;

        int pivotIdx = left + rand() % (right - left + 1);
        pivotIdx = partition(unique, count, left, right, pivotIdx);

        if (k_smallest == pivotIdx)
            return;
        else if (k_smallest < pivotIdx)
            quickselect(unique, count, left, pivotIdx - 1, k_smallest);
        else
            quickselect(unique, count, pivotIdx + 1, right, k_smallest);
    }

    int partition(vector<int>& unique, unordered_map<int, int>& count,
                  int left, int right, int pivotIdx) {
        int pivotFreq = count[unique[pivotIdx]];
        swap(unique[pivotIdx], unique[right]);
        int storeIdx = left;

        for (int i = left; i < right; i++) {
            if (count[unique[i]] < pivotFreq) {
                swap(unique[storeIdx], unique[i]);
                storeIdx++;
            }
        }

        swap(unique[storeIdx], unique[right]);
        return storeIdx;
    }
};
```

### Complexity
- **Time:** O(N) average, O(N²) worst
- **Space:** O(N)

## Key Insight
> The bucket sort approach achieves O(N) time by using frequency as bucket index, eliminating the need for sorting or heap operations while still efficiently extracting the top k frequent elements.
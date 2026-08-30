# Implement Max Heap

> **Difficulty:** Medium | **Topic:** Heap, Data Structure | **Platform:** GeeksforGeeks

---

## Problem Statement
Design a data structure that supports the following operations efficiently:
1. `insertKey(x)`: Insert a value `x` into the heap.
2. `deleteKey(i)`: Delete the element at index `i` from the heap.
3. `extractMax()`: Remove and return the maximum element from the heap.
4. `getMax()`: Return the maximum element without removing it.
5. `heapify(i)`: Restore the heap property starting from index `i`.

Implement a Max Heap using an array.

## Examples
**Example 1:**
```
Input:
insertKey(3)
insertKey(5)
insertKey(9)
insertKey(6)
getMax() → 9
extractMax() → 9
getMax() → 6
deleteKey(0)
getMax() → 5
```

## Constraints
- 1 ≤ Number of operations ≤ 10⁴
- 1 ≤ Value inserted ≤ 10⁵
- 0 ≤ Index < size of heap

## Topic Tags
`Heap` `Data Structures` `Tree`

## Expected Complexities
| | |
|---|---|
| **Time** | O(log N) per operation |
| **Space** | O(N) |

## Intuition
A Max Heap is a complete binary tree where the value of each node is greater than or equal to its children. When implemented using an array, for a node at index `i`, its left child is at `2*i + 1`, right child at `2*i + 2`, and parent at `(i-1)/2`.

The heap property must be maintained after every insertion or deletion. Insertion adds the element at the end and bubbles it up (heapify up). Deletion replaces the element with the last element and pushes it down (heapify down).

## Approach
1. Store heap elements in an array `heap[]`.
2. For `insertKey`: Add element at end, then call `heapifyUp` to restore heap property.
3. For `deleteKey`: Decrease key to infinity, extract max, then heapify.
4. For `extractMax`: Return root, replace with last element, call `heapifyDown`.
5. For `getMax`: Return root element.
6. `heapify(i)`: Compare node with children, swap with largest child if needed, recurse.

## Brute Force
### Approach
For each insertion, append to array and sort. For deletion, remove element and sort. This gives O(N log N) per operation instead of O(log N).

### Code
**Python**
```python
class MaxHeap:
    def __init__(self):
        self.heap = []

    def insertKey(self, x):
        self.heap.append(x)
        self.heap.sort(reverse=True)

    def deleteKey(self, i):
        if i < len(self.heap):
            self.heap.pop(i)
            self.heap.sort(reverse=True)

    def extractMax(self):
        if self.heap:
            return self.heap.pop(0)
        return -1

    def getMax(self):
        return self.heap[0] if self.heap else -1
```

**C++**
```cpp
class MaxHeap {
    vector<int> heap;
public:
    void insertKey(int x) {
        heap.push_back(x);
        sort(heap.rbegin(), heap.rend());
    }

    void deleteKey(int i) {
        if (i < heap.size()) {
            heap.erase(heap.begin() + i);
            sort(heap.rbegin(), heap.rend());
        }
    }

    int extractMax() {
        if (!heap.empty()) {
            int max = heap[0];
            heap.erase(heap.begin());
            return max;
        }
        return -1;
    }

    int getMax() {
        return heap.empty() ? -1 : heap[0];
    }
};
```

### Complexity
- **Time:** O(N log N) per operation (sorting)
- **Space:** O(N)

## Optimized Solution
### Code
**Python**
```python
class MaxHeap:
    def __init__(self):
        self.heap = []

    def parent(self, i):
        return (i - 1) // 2

    def leftChild(self, i):
        return 2 * i + 1

    def rightChild(self, i):
        return 2 * i + 2

    def insertKey(self, x):
        self.heap.append(x)
        i = len(self.heap) - 1
        self.heapifyUp(i)

    def heapifyUp(self, i):
        while i > 0 and self.heap[self.parent(i)] < self.heap[i]:
            self.heap[i], self.heap[self.parent(i)] = self.heap[self.parent(i)], self.heap[i]
            i = self.parent(i)

    def extractMax(self):
        if not self.heap:
            return -1
        if len(self.heap) == 1:
            return self.heap.pop()
        root = self.heap[0]
        self.heap[0] = self.heap.pop()
        self.heapifyDown(0)
        return root

    def heapifyDown(self, i):
        largest = i
        l = self.leftChild(i)
        r = self.rightChild(i)
        n = len(self.heap)

        if l < n and self.heap[l] > self.heap[largest]:
            largest = l
        if r < n and self.heap[r] > self.heap[largest]:
            largest = r

        if largest != i:
            self.heap[i], self.heap[largest] = self.heap[largest], self.heap[i]
            self.heapifyDown(largest)

    def getMax(self):
        return self.heap[0] if self.heap else -1

    def deleteKey(self, i):
        if i >= len(self.heap):
            return
        self.heap[i] = float('inf')
        self.heapifyUp(i)
        self.extractMax()

    def decreaseKey(self, i, new_val):
        self.heap[i] = new_val
        self.heapifyUp(i)
```

**C++**
```cpp
class MaxHeap {
    vector<int> heap;

    void heapifyUp(int i) {
        while (i > 0 && heap[(i - 1) / 2] < heap[i]) {
            swap(heap[i], heap[(i - 1) / 2]);
            i = (i - 1) / 2;
        }
    }

    void heapifyDown(int i) {
        int largest = i;
        int l = 2 * i + 1;
        int r = 2 * i + 2;
        int n = heap.size();

        if (l < n && heap[l] > heap[largest])
            largest = l;
        if (r < n && heap[r] > heap[largest])
            largest = r;

        if (largest != i) {
            swap(heap[i], heap[largest]);
            heapifyDown(largest);
        }
    }

public:
    void insertKey(int x) {
        heap.push_back(x);
        heapifyUp(heap.size() - 1);
    }

    int extractMax() {
        if (heap.empty()) return -1;
        if (heap.size() == 1) {
            int val = heap[0];
            heap.pop_back();
            return val;
        }
        int root = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        heapifyDown(0);
        return root;
    }

    int getMax() {
        return heap.empty() ? -1 : heap[0];
    }

    void deleteKey(int i) {
        if (i >= heap.size()) return;
        heap[i] = INT_MAX;
        heapifyUp(i);
        extractMax();
    }
};
```

### Complexity
- **Time:** O(log N) for insert, delete, extractMax; O(1) for getMax
- **Space:** O(N)

## Key Insight
> The key insight is using array-based representation where parent of index `i` is at `(i-1)/2` and children at `2i+1` and `2i+2`, enabling efficient O(log N) heap operations through bubbling up and down.
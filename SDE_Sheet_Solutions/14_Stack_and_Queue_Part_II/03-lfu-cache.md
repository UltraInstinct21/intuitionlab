# LFU Cache

> **Difficulty:** Hard | **Topic:** Hash Map, Doubly Linked List | **Platform:** LeetCode 460

---

## Problem Statement
Design and implement a Least Frequently Used (LFU) cache. Implement the LFUCache class with `get(key)` and `put(key, value)` operations. Both operations must run in O(1) average time complexity.

## Examples
**Example 1:**
```
Input:
["LFUCache", "put", "put", "get", "put", "get", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [3], [4, 4], [1], [3], [4]]
Output:
[null, null, null, 1, null, -1, 1, null, -1, 1, 4]
```

## Constraints
- 0 ≤ capacity ≤ 10^4
- 0 ≤ key ≤ 10^5
- 0 ≤ value ≤ 10^9
- At most 10^5 calls will be made to get and put

## Topic Tags
`Hash Map` `Doubly Linked List` `Design`

## Expected Complexities
| | |
|---|---|
| **Time** | O(1) for both get and put |
| **Space** | O(capacity) |

## Intuition
LFU evicts the least frequently used key, and among keys with the same frequency, the least recently used one is evicted. We maintain a map from frequency to a doubly linked list of keys, and a map from key to its node and frequency. We also track the minimum frequency.

## Approach
1. Maintain `key_to_node`: maps key to its node (storing key, value, freq).
2. Maintain `freq_to_list`: maps frequency to a doubly linked list of nodes with that frequency.
3. Track `min_freq` to know which frequency list to evict from.
4. On `get`: update frequency (move node to next frequency list), return value.
5. On `put`: if at capacity, evict LRU from `min_freq` list. Insert/update node.

## Brute Force
### Approach
Use a hash map to store frequencies and recompute on each operation.

### Code
**Python**
```python
from collections import defaultdict

class LFUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.key_to_val = {}
        self.key_to_freq = {}
        self.freq_to_keys = defaultdict(list)
        self.min_freq = 0

    def _evict(self):
        keys = self.freq_to_keys[self.min_freq]
        evict_key = keys.pop(0)
        del self.key_to_val[evict_key]
        del self.key_to_freq[evict_key]

    def get(self, key):
        if key not in self.key_to_val:
            return -1
        self._update(key)
        return self.key_to_val[key]

    def put(self, key, value):
        if self.cap == 0:
            return
        if key in self.key_to_val:
            self.key_to_val[key] = value
            self._update(key)
            return
        if len(self.key_to_val) == self.cap:
            self._evict()
        self.key_to_val[key] = value
        self.key_to_freq[key] = 1
        self.freq_to_keys[1].append(key)
        self.min_freq = 1

    def _update(self, key):
        freq = self.key_to_freq[key]
        self.freq_to_keys[freq].remove(key)
        if not self.freq_to_keys[freq] and freq == self.min_freq:
            self.min_freq += 1
        self.key_to_freq[key] = freq + 1
        self.freq_to_keys[freq + 1].append(key)
```

**C++**
```cpp
class LFUCache {
    int cap;
    int minFreq;
    unordered_map<int, int> keyToVal, keyToFreq;
    unordered_map<int, list<int>> freqToKeys;

    void evict() {
        auto& keys = freqToKeys[minFreq];
        int evictKey = keys.front();
        keys.pop_front();
        keyToVal.erase(evictKey);
        keyToFreq.erase(evictKey);
    }

    void update(int key) {
        int freq = keyToFreq[key];
        freqToKeys[freq].remove(key);
        if (freqToKeys[freq].empty() && freq == minFreq) minFreq++;
        keyToFreq[key] = freq + 1;
        freqToKeys[freq + 1].push_back(key);
    }

public:
    LFUCache(int capacity) : cap(capacity), minFreq(0) {}

    int get(int key) {
        if (keyToVal.find(key) == keyToVal.end()) return -1;
        update(key);
        return keyToVal[key];
    }

    void put(int key, int value) {
        if (cap == 0) return;
        if (keyToVal.find(key) != keyToVal.end()) {
            keyToVal[key] = value;
            update(key);
            return;
        }
        if (keyToVal.size() == cap) evict();
        keyToVal[key] = value;
        keyToFreq[key] = 1;
        freqToKeys[1].push_back(key);
        minFreq = 1;
    }
};
```

### Complexity
- **Time:** O(N) for list removal
- **Space:** O(capacity)

## Optimized Solution
### Code
**Python**
```python
from collections import defaultdict, OrderedDict

class LFUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.key_to_val = {}
        self.key_to_freq = {}
        self.freq_to_keys = defaultdict(OrderedDict)
        self.min_freq = 0

    def _evict(self):
        keys = self.freq_to_keys[self.min_freq]
        evict_key, _ = keys.popitem(last=False)
        del self.key_to_val[evict_key]
        del self.key_to_freq[evict_key]

    def get(self, key):
        if key not in self.key_to_val:
            return -1
        self._update(key)
        return self.key_to_val[key]

    def put(self, key, value):
        if self.cap == 0:
            return
        if key in self.key_to_val:
            self.key_to_val[key] = value
            self._update(key)
            return
        if len(self.key_to_val) == self.cap:
            self._evict()
        self.key_to_val[key] = value
        self.key_to_freq[key] = 1
        self.freq_to_keys[1][key] = None
        self.min_freq = 1

    def _update(self, key):
        freq = self.key_to_freq[key]
        del self.freq_to_keys[freq][key]
        if not self.freq_to_keys[freq] and freq == self.min_freq:
            self.min_freq += 1
        self.key_to_freq[key] = freq + 1
        self.freq_to_keys[freq + 1][key] = None
```

**C++**
```cpp
class LFUCache {
    int cap, minFreq;
    unordered_map<int, int> keyToVal, keyToFreq;
    unordered_map<int, list<pair<int, int>>> freqToKeys;
    unordered_map<int, list<pair<int, int>>::iterator> keyToIter;

    void evict() {
        auto& lst = freqToKeys[minFreq];
        auto it = lst.begin();
        keyToVal.erase(it->first);
        keyToFreq.erase(it->first);
        keyToIter.erase(it->first);
        lst.erase(it);
    }

    void update(int key) {
        int freq = keyToFreq[key];
        auto& lst = freqToKeys[freq];
        lst.erase(keyToIter[key]);
        if (lst.empty() && freq == minFreq) minFreq++;
        keyToFreq[key] = freq + 1;
        freqToKeys[freq + 1].emplace_back(key, keyToVal[key]);
        keyToIter[key] = prev(freqToKeys[freq + 1].end());
    }

public:
    LFUCache(int capacity) : cap(capacity), minFreq(0) {}

    int get(int key) {
        if (keyToVal.find(key) == keyToVal.end()) return -1;
        update(key);
        return keyToVal[key];
    }

    void put(int key, int value) {
        if (cap == 0) return;
        if (keyToVal.find(key) != keyToVal.end()) {
            keyToVal[key] = value;
            update(key);
            return;
        }
        if (keyToVal.size() == cap) evict();
        keyToVal[key] = value;
        keyToFreq[key] = 1;
        freqToKeys[1].emplace_back(key, value);
        keyToIter[key] = prev(freqToKeys[1].end());
        minFreq = 1;
    }
};
```

### Complexity
- **Time:** O(1) for both get and put
- **Space:** O(capacity)

## Key Insight
> Maintain a frequency-to-keys mapping with OrderedDict/list nodes, and track minimum frequency for O(1) LFU eviction.

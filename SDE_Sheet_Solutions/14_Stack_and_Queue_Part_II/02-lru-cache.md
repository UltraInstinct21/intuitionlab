# LRU Cache

> **Difficulty:** Medium | **Topic:** Hash Map, Doubly Linked List | **Platform:** LeetCode 146

---

## Problem Statement
Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with `get(key)` and `put(key, value)` operations. Both operations must run in O(1) average time complexity.

## Examples
**Example 1:**
```
Input:
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
Output:
[null, null, null, 1, null, -1, null, -1, 3, 4]
```

## Constraints
- 1 ≤ capacity ≤ 3000
- 0 ≤ key ≤ 10^4
- 0 ≤ value ≤ 10^5
- At most 2 × 10^5 calls will be made to get and put

## Topic Tags
`Hash Map` `Doubly Linked List` `Design`

## Expected Complexities
| | |
|---|---|
| **Time** | O(1) for both get and put |
| **Space** | O(capacity) |

## Intuition
We need a data structure that allows O(1) access by key and O(1) eviction of the least recently used item. A hash map combined with a doubly linked list achieves this: the hash map provides O(1) lookups, and the doubly linked list allows O(1) insertion and deletion.

## Approach
1. Use a hash map where keys map to nodes in a doubly linked list.
2. The doubly linked list maintains order: most recently used at the head, least recently used at the tail.
3. On `get`: if the key exists, move the node to the head and return the value.
4. On `put`: if the key exists, update the value and move to head. If not, insert at head; if capacity exceeded, remove the tail node.
5. Use sentinel head and tail nodes to simplify edge cases.

## Brute Force
### Approach
Use an ordered dictionary or maintain a list alongside the hash map, moving elements on each access.

### Code
**Python**
```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity

    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
```

**C++**
```cpp
class LRUCache {
    int capacity;
    list<pair<int, int>> cache;
    unordered_map<int, list<pair<int, int>>::iterator> map;
public:
    LRUCache(int capacity) : capacity(capacity) {}

    int get(int key) {
        if (map.find(key) == map.end()) return -1;
        cache.splice(cache.begin(), cache, map[key]);
        return map[key]->second;
    }

    void put(int key, int value) {
        if (map.find(key) != map.end()) {
            map[key]->second = value;
            cache.splice(cache.begin(), cache, map[key]);
            return;
        }
        if (cache.size() == capacity) {
            map.erase(cache.back().first);
            cache.pop_back();
        }
        cache.emplace_front(key, value);
        map[key] = cache.begin();
    }
};
```

### Complexity
- **Time:** O(1) average
- **Space:** O(capacity)

## Optimized Solution
### Code
**Python**
```python
class Node:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.cache = {}
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_head(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def _move_to_head(self, node):
        self._remove(node)
        self._add_to_head(node)

    def get(self, key):
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._move_to_head(node)
        return node.val

    def put(self, key, value):
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            self._move_to_head(node)
        else:
            node = Node(key, value)
            self.cache[key] = node
            self._add_to_head(node)
            if len(self.cache) > self.cap:
                lru = self.tail.prev
                self._remove(lru)
                del self.cache[lru.key]
```

**C++**
```cpp
struct Node {
    int key, val;
    Node *prev, *next;
    Node(int k = 0, int v = 0) : key(k), val(v), prev(nullptr), next(nullptr) {}
};

class LRUCache {
    int cap;
    unordered_map<int, Node*> cache;
    Node *head, *tail;

    void remove(Node* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }

    void addToHead(Node* node) {
        node->next = head->next;
        node->prev = head;
        head->next->prev = node;
        head->next = node;
    }

    void moveToHead(Node* node) {
        remove(node);
        addToHead(node);
    }

public:
    LRUCache(int capacity) : cap(capacity) {
        head = new Node();
        tail = new Node();
        head->next = tail;
        tail->prev = head;
    }

    int get(int key) {
        if (cache.find(key) == cache.end()) return -1;
        Node* node = cache[key];
        moveToHead(node);
        return node->val;
    }

    void put(int key, int value) {
        if (cache.find(key) != cache.end()) {
            cache[key]->val = value;
            moveToHead(cache[key]);
            return;
        }
        Node* node = new Node(key, value);
        cache[key] = node;
        addToHead(node);
        if (cache.size() > cap) {
            Node* lru = tail->prev;
            remove(lru);
            cache.erase(lru->key);
            delete lru;
        }
    }
};
```

### Complexity
- **Time:** O(1) for both get and put
- **Space:** O(capacity)

## Key Insight
> Combine a hash map for O(1) lookups with a doubly linked list for O(1) reordering to achieve constant-time LRU operations.

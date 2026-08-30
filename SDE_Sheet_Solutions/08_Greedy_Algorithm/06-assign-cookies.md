# Assign Cookies

> **Difficulty:** Easy | **Topic:** Greedy, Sorting, Two Pointers | **Platform:** LeetCode

---

## Problem Statement
Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie. Each child i has a greed factor g[i], which is the minimum size of a cookie that the child will be content with. Each cookie j has a size s[j]. If s[j] >= g[i], we can assign cookie j to child i, and the child will be content. Your goal is to maximize the number of content children and output the maximum number.

## Examples
**Example 1:**
```
Input: g = [1, 2, 3], s = [1, 1]
Output: 1
Explanation: Only child with greed factor 1 can be satisfied with a cookie of size 1.
```

**Example 2:**
```
Input: g = [1, 2], s = [1, 2, 3]
Output: 2
Explanation: Both children can be satisfied. Child 1 gets cookie 1, child 2 gets cookie 2.
```

## Constraints
- 1 <= g.length <= 3 * 10^4
- 1 <= s.length <= 3 * 10^4
- 1 <= g[i], s[j] <= 2^31 - 1

## Topic Tags
`Greedy` `Sorting` `Two Pointers`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n log n + m log m) |
| **Space** | O(1) |

## Intuition
To maximize the number of content children, we should use the smallest possible cookie to satisfy each child. Sort both greed factors and cookie sizes, then greedily assign the smallest sufficient cookie to each child starting from the least greedy child.

## Approach
1. Sort both the greed array (g) and the cookie size array (s).
2. Use two pointers: one for greed (i) and one for cookies (j).
3. If s[j] >= g[i], the child is satisfied. Move both pointers.
4. If s[j] < g[i], the cookie is too small. Move to the next larger cookie.
5. Return the count of satisfied children.

## Brute Force
### Approach
For each child, try all cookies to find one that satisfies them. Mark used cookies. This is O(n*m) without sorting.
### Complexity
- Time: O(n * m)
- Space: O(m) to track used cookies

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def findContentChildren(self, g: list[int], s: list[int]) -> int:
        g.sort()
        s.sort()
        
        child = 0
        cookie = 0
        
        while child < len(g) and cookie < len(s):
            if s[cookie] >= g[child]:
                child += 1
            cookie += 1
        
        return child
```

**C++**
```cpp
class Solution {
public:
    int findContentChildren(vector<int>& g, vector<int>& s) {
        sort(g.begin(), g.end());
        sort(s.begin(), s.end());
        
        int child = 0;
        int cookie = 0;
        
        while (child < g.size() && cookie < s.size()) {
            if (s[cookie] >= g[child]) {
                child++;
            }
            cookie++;
        }
        
        return child;
    }
};
```

### Complexity
- Time: O(n log n + m log m)
- Space: O(1)

## Key Insight
> Greedily satisfying the least greedy child first with the smallest sufficient cookie maximizes the total number of content children.

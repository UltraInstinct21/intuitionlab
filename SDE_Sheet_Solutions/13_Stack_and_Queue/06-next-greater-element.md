# 496. Next Greater Element I

> **Difficulty:** Medium | **Topic:** Stack, Array, Hash Map | **Platform:** LeetCode

---

## Problem Statement
The next greater element of some element `x` in an array is the first greater element that is to the right of `x` in the same array.

You are given two distinct 0-indexed integer arrays `nums1` and `nums2`, where `nums1` is a subset of `nums2`.

For each `0 ≤ i < nums1.length`, find the index `j` such that `nums1[i] == nums2[j]` and determine the next greater element of `nums2[j]` in `nums2`. If there is no next greater element, the answer for this query is `-1`.

Return an array `ans` of length `nums1.length` such that `ans[i]` is the next greater element as described above.

## Examples
**Example 1:**
```
Input: nums1 = [4,1,2], nums2 = [1,3,4,2]
Output: [-1,3,-1]

Explanation:
- The next greater element for 4 in nums2 is -1 (no element to the right is greater).
- The next greater element for 1 in nums2 is 3.
- The next greater element for 2 in nums2 is -1.
```

**Example 2:**
```
Input: nums1 = [2,4], nums2 = [1,2,3,4]
Output: [3,-1]

Explanation:
- The next greater element for 2 in nums2 is 3.
- The next greater element for 4 in nums2 is -1.
```

## Constraints
- 1 ≤ nums1.length ≤ nums2.length ≤ 1000
- 0 ≤ nums1[i], nums2[i] ≤ 10^4
- All integers in nums1 and nums2 are unique.
- The input is generated such that nums1 is a subset of nums2.

## Topic Tags
`Stack` `Array` `Hash Map` `Monotonic Stack`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) where n = len(nums2) |
| **Space** | O(n) |

## Intuition
The key idea is to precompute the next greater element for every element in `nums2` using a monotonic decreasing stack. We iterate from right to left, maintaining a stack of elements that haven't found their next greater element yet. For each element, we pop smaller elements from the stack and the top of the remaining stack is the next greater element.

## Approach
1. Use a monotonic decreasing stack to find the next greater element for each element in `nums2`.
2. Iterate `nums2` from right to left.
3. For each element, pop elements from the stack that are ≤ current element.
4. The top of the stack (if any) is the next greater element; otherwise, it's -1.
5. Store the result in a hash map.
6. For each element in `nums1`, look up the precomputed result.

## Brute Force
### Approach
For each element in `nums1`, find it in `nums2`, then scan right from that position to find the first element that is greater.

### Code
**Python**
```python
def nextGreaterElement(nums1, nums2):
    result = []
    for num in nums1:
        idx = nums2.index(num)
        found = -1
        for i in range(idx + 1, len(nums2)):
            if nums2[i] > num:
                found = nums2[i]
                break
        result.append(found)
    return result
```

**C++**
```cpp
class Solution {
public:
    vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
        vector<int> result;
        for (int num : nums1) {
            int idx = find(nums2.begin(), nums2.end(), num) - nums2.begin();
            int found = -1;
            for (int i = idx + 1; i < nums2.size(); i++) {
                if (nums2[i] > num) {
                    found = nums2[i];
                    break;
                }
            }
            result.push_back(found);
        }
        return result;
    }
};
```

### Complexity
- **Time:** O(n * m) where n = len(nums1) and m = len(nums2).
- **Space:** O(1) extra space (excluding output).

## Optimized Solution
### Code
**Python**
```python
def nextGreaterElement(nums1, nums2):
    stack = []
    nge = {}

    for num in reversed(nums2):
        while stack and stack[-1] <= num:
            stack.pop()
        nge[num] = stack[-1] if stack else -1
        stack.append(num)

    return [nge[num] for num in nums1]
```

**C++**
```cpp
class Solution {
public:
    vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
        stack<int> st;
        unordered_map<int, int> nge;

        for (int i = nums2.size() - 1; i >= 0; i--) {
            while (!st.empty() && st.top() <= nums2[i])
                st.pop();
            nge[nums2[i]] = st.empty() ? -1 : st.top();
            st.push(nums2[i]);
        }

        vector<int> result;
        for (int num : nums1)
            result.push_back(nge[num]);

        return result;
    }
};
```

### Complexity
- **Time:** O(n) where n = len(nums2) — each element pushed and popped at most once.
- **Space:** O(n) — stack and hash map.

## Key Insight
> A monotonic decreasing stack traversed from right to left efficiently precomputes the next greater element for all elements in O(n) time.

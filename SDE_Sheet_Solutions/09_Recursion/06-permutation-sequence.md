# Permutation Sequence

> **Difficulty:** Medium | **Topic:** Recursion, Math | **Platform:** LeetCode

---

## Problem Statement
The set [1, 2, 3, ..., n] contains n! unique permutations. Given n and k, return the kth permutation sequence (1-indexed).

## Examples
**Example 1:**
```
Input: n = 3, k = 3
Output: "213"
```

**Example 2:**
```
Input: n = 4, k = 9
Output: "2314"
```

## Constraints
- 1 ≤ n ≤ 9
- 1 ≤ k ≤ n!

## Topic Tags
`Recursion` `Math` `Factorial`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n^2) |
| **Space** | O(n) |

## Intuition
Instead of generating all permutations and picking the kth, we can directly compute the kth permutation using factorial-based division. For n numbers, the first digit changes every (n-1)! permutations. We find which block k falls into, pick that digit, and recurse on the remaining digits.

## Approach
1. Precompute factorials from 0! to n!
2. Create a list of available numbers [1, 2, ..., n]
3. Convert k to 0-indexed: k -= 1
4. For each position from left to right:
   - Compute `index = k // fact[n-1-i]`
   - Pick the number at that index from available list
   - Append to result, remove from available
   - Update `k = k % fact[n-1-i]`
5. Return the constructed string

## Brute Force
### Approach
Generate all permutations in lexicographic order, return the kth one.
### Code
**Python**
```python
def getPermutation(n, k):
    from itertools import permutations
    perms = list(permutations(range(1, n + 1)))
    return ''.join(map(str, perms[k - 1]))
```
**C++**
```cpp
class Solution {
  public:
    string getPermutation(int n, int k) {
        vector<int> nums;
        for (int i = 1; i <= n; i++) nums.push_back(i);
        
        int count = 1;
        do {
            if (count == k) {
                string res = "";
                for (int x : nums) res += to_string(x);
                return res;
            }
            count++;
        } while (next_permutation(nums.begin(), nums.end()));
        
        return "";
    }
};
```
### Complexity
- **Time:** O(n! * n) to generate and check
- **Space:** O(n)

## Optimized Solution
### Code
**Python**
```python
def getPermutation(n, k):
    import math
    fact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i
    
    numbers = list(range(1, n + 1))
    k -= 1  # 0-indexed
    result = []
    
    for i in range(n):
        idx = k // fact[n - 1 - i]
        result.append(str(numbers[idx]))
        numbers.pop(idx)
        k %= fact[n - 1 - i]
    
    return ''.join(result)
```
**C++**
```cpp
class Solution {
  public:
    string getPermutation(int n, int k) {
        vector<int> fact(n + 1, 1);
        for (int i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;
        
        vector<int> numbers;
        for (int i = 1; i <= n; i++) numbers.push_back(i);
        
        k--;
        string result = "";
        
        for (int i = 0; i < n; i++) {
            int idx = k / fact[n - 1 - i];
            result += to_string(numbers[idx]);
            numbers.erase(numbers.begin() + idx);
            k %= fact[n - 1 - i];
        }
        
        return result;
    }
};
```
### Complexity
- **Time:** O(n^2) due to list/erase operations
- **Space:** O(n)

## Key Insight
> Dividing k by (n-1)! tells us which digit goes first; we reduce the problem by picking that digit and recursing on the remaining positions.
# 3. Longest Substring Without Repeating Characters

> **Difficulty:** Medium | **Topic:** Hash Table, String, Sliding Window | **LeetCode:** [3](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

---

## Problem Statement

Given a string `s`, find the length of the **longest substring** without repeating characters.

---

## Examples

**Example 1:**
```
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
```

**Example 2:**
```
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
```

**Example 3:**
```
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
```

---

## Constraints

- `0 <= s.length <= 5 * 10^4`
- `s` consists of English letters, digits, symbols, and spaces.

---

## Topic Tags

`Hash Table` `String` `Sliding Window`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(min(m, n)) where m is charset size |

---

## Intuition

Use sliding window with a hash set. Expand the right pointer, and when a duplicate is found, shrink from the left until the duplicate is removed.

---

## Approach

1. Use two pointers (left, right) to define the window
2. Use a hash set to track characters in current window
3. Expand right, if duplicate found, shrink left
4. Track maximum window size

---

## Optimized Solution

### Code

**Python**
```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_set = set()
        left = 0
        max_length = 0
        
        for right in range(len(s)):
            while s[right] in char_set:
                char_set.remove(s[left])
                left += 1
            char_set.add(s[right])
            max_length = max(max_length, right - left + 1)
        
        return max_length
```

**C++**
```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_set<char> charSet;
        int left = 0, maxLength = 0;
        
        for (int right = 0; right < s.size(); right++) {
            while (charSet.count(s[right])) {
                charSet.erase(s[left]);
                left++;
            }
            charSet.insert(s[right]);
            maxLength = max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
};
```

### Complexity
- **Time:** O(n)
- **Space:** O(min(m, n)) where m is charset size

---

## Key Insight

> Use sliding window with a hash set. When a duplicate is found, shrink the window from the left until the duplicate is removed. Each character is processed at most twice.

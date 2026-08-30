# 5. Longest Palindromic Substring

> **Difficulty:** Medium | **Topic:** String, Dynamic Programming | **Platform:** LeetCode

---

## Problem Statement
Given a string `s`, return the longest palindromic substring in `s`. A substring is a contiguous sequence of characters within the string.

## Examples
**Example 1:**
```
Input: s = "babad"
Output: "bab" or "aba"
```

**Example 2:**
```
Input: s = "cbbd"
Output: "bb"
```

## Constraints
- `1 <= s.length <= 1000`
- `s` consist of only digits and English letters.

## Topic Tags
`String` `Dynamic Programming`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n^2) |
| **Space** | O(1) |

## Intuition
A palindrome reads the same forwards and backwards. For any given center, we can expand outward in both directions as long as the characters match. There are 2n-1 possible centers (n for odd-length palindromes centered on a character, and n-1 for even-length palindromes centered between two characters). By checking all centers, we can find the longest palindromic substring.

## Approach
1. Initialize variables to track the start index and maximum length of the palindrome found.
2. For each possible center position (0 to 2n-1):
   - Set left = center / 2, right = center / 2 + center % 2
   - Expand outward while left >= 0, right < n, and s[left] == s[right]
   - If the current palindrome length is greater than max, update max and start
3. Return the substring from start to start + maxLength.

## Brute Force
### Approach
Check every possible substring and verify if it is a palindrome. Track the longest one found.
### Code
**Python**
```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        n = len(s)
        max_len = 0
        start = 0
        for i in range(n):
            for j in range(i, n):
                substr = s[i:j+1]
                if substr == substr[::-1]:
                    if j - i + 1 > max_len:
                        max_len = j - i + 1
                        start = i
        return s[start:start + max_len]
```
**C++**
```cpp
class Solution {
public:
    string longestPalindrome(string s) {
        int n = s.size();
        int maxLen = 0, start = 0;
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                string sub = s.substr(i, j - i + 1);
                string rev = sub;
                reverse(rev.begin(), rev.end());
                if (sub == rev && j - i + 1 > maxLen) {
                    maxLen = j - i + 1;
                    start = i;
                }
            }
        }
        return s.substr(start, maxLen);
    }
};
```
### Complexity
- **Time:** O(n^3)
- **Space:** O(n)

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        n = len(s)
        if n == 0:
            return ""
        start, max_len = 0, 1

        def expand(left, right):
            nonlocal start, max_len
            while left >= 0 and right < n and s[left] == s[right]:
                if right - left + 1 > max_len:
                    start = left
                    max_len = right - left + 1
                left -= 1
                right += 1

        for i in range(n):
            expand(i, i)       # odd length
            expand(i, i + 1)   # even length

        return s[start:start + max_len]
```
**C++**
```cpp
class Solution {
public:
    string longestPalindrome(string s) {
        int n = s.size();
        if (n == 0) return "";
        int start = 0, maxLen = 1;

        auto expand = [&](int left, int right) {
            while (left >= 0 && right < n && s[left] == s[right]) {
                if (right - left + 1 > maxLen) {
                    start = left;
                    maxLen = right - left + 1;
                }
                left--;
                right++;
            }
        };

        for (int i = 0; i < n; i++) {
            expand(i, i);       // odd length
            expand(i, i + 1);   // even length
        }

        return s.substr(start, maxLen);
    }
};
```
### Complexity
- **Time:** O(n^2)
- **Space:** O(1)

## Key Insight
> Expand around every possible center (2n-1 centers total) to find the longest palindrome in O(n^2) time with O(1) space, avoiding the need for DP tables.

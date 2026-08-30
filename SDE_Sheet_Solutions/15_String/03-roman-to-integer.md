# 13. Roman to Integer

> **Difficulty:** Medium | **Topic:** String, Math | **Platform:** LeetCode

---

## Problem Statement
Roman numerals are represented by seven different symbols: `I`, `V`, `X`, `L`, `C`, `D`, and `M`. Given a roman numeral, convert it to an integer. Roman numerals are usually written largest to smallest from left to right. However, there are six instances where subtraction is used:
- `I` can be placed before `V` (5) and `X` (10) to make 4 and 9.
- `X` can be placed before `L` (50) and `C` (100) to make 40 and 90.
- `C` can be placed before `D` (500) and `M` (1000) to make 400 and 900.

## Examples
**Example 1:**
```
Input: s = "III"
Output: 3
```

**Example 2:**
```
Input: s = "LVIII"
Output: 58
```

**Example 3:**
```
Input: s = "MCMXCIV"
Output: 1994
```

## Constraints
- `1 <= s.length <= 15`
- `s` contains only the characters `'I'`, `'V'`, `'X'`, `'L'`, `'C'`, `'D'`, `'M'`.
- It is guaranteed that `s` is a valid roman numeral in the range `[1, 3999]`.

## Topic Tags
`String` `Math` `Hash Table`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

## Intuition
Roman numerals follow a simple rule: if a smaller value appears before a larger value, it means subtraction (e.g., IV = 4). Otherwise, values are added. We can iterate through the string, comparing each symbol's value with the next one to decide whether to add or subtract.

## Approach
1. Create a hash map mapping each Roman symbol to its integer value.
2. Iterate through the string from left to right.
3. If the current value is less than the next value, subtract it from the result.
4. Otherwise, add it to the result.
5. After the loop, add the value of the last character (since the loop doesn't process it as the "current" in the subtraction check).

## Brute Force
### Approach
Convert the roman numeral by processing each character independently, handling the subtractive cases by checking pairs.
### Code
**Python**
```python
class Solution:
    def romanToInt(self, s: str) -> int:
        roman_map = {
            'I': 1, 'V': 5, 'X': 10, 'L': 50,
            'C': 100, 'D': 500, 'M': 1000
        }
        result = 0
        for i in range(len(s)):
            if i + 1 < len(s) and roman_map[s[i]] < roman_map[s[i + 1]]:
                result -= roman_map[s[i]]
            else:
                result += roman_map[s[i]]
        return result
```
**C++**
```cpp
class Solution {
public:
    int romanToInt(string s) {
        unordered_map<char, int> romanMap = {
            {'I', 1}, {'V', 5}, {'X', 10}, {'L', 50},
            {'C', 100}, {'D', 500}, {'M', 1000}
        };
        int result = 0;
        for (int i = 0; i < s.size(); i++) {
            if (i + 1 < s.size() && romanMap[s[i]] < romanMap[s[i + 1]]) {
                result -= romanMap[s[i]];
            } else {
                result += romanMap[s[i]];
            }
        }
        return result;
    }
};
```
### Complexity
- **Time:** O(n)
- **Space:** O(1)

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def romanToInt(self, s: str) -> int:
        roman_map = {
            'I': 1, 'V': 5, 'X': 10, 'L': 50,
            'C': 100, 'D': 500, 'M': 1000
        }
        result = 0
        prev = 0
        for ch in reversed(s):
            curr = roman_map[ch]
            if curr < prev:
                result -= curr
            else:
                result += curr
            prev = curr
        return result
```
**C++**
```cpp
class Solution {
public:
    int romanToInt(string s) {
        unordered_map<char, int> romanMap = {
            {'I', 1}, {'V', 5}, {'X', 10}, {'L', 50},
            {'C', 100}, {'D', 500}, {'M', 1000}
        };
        int result = 0, prev = 0;
        for (int i = s.size() - 1; i >= 0; i--) {
            int curr = romanMap[s[i]];
            if (curr < prev) {
                result -= curr;
            } else {
                result += curr;
            }
            prev = curr;
        }
        return result;
    }
};
```
### Complexity
- **Time:** O(n)
- **Space:** O(1)

## Key Insight
> Iterating right-to-left simplifies the logic: if the current value is less than the previously seen value, it's a subtractive case; otherwise, it's additive. This avoids boundary checks for the next character.

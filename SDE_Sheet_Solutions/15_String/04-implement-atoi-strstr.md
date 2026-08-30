# 8. String to Integer (atoi)

> **Difficulty:** Medium | **Topic:** String, Math | **Platform:** LeetCode

---

## Problem Statement
Implement the `myAtoi(string s)` function, which converts a string to a 32-bit signed integer. The algorithm for `myAtoi(string s)` is as follows:
1. Ignore any leading whitespace.
2. Check if the next character is `'-'` or `'+'` to determine the sign.
3. Read digits until a non-digit character is encountered or the end of the string is reached.
4. Clamp the result to the 32-bit signed integer range `[-2^31, 2^31 - 1]`.

## Examples
**Example 1:**
```
Input: s = "42"
Output: 42
```

**Example 2:**
```
Input: s = "   -42"
Output: -42
```

**Example 3:**
```
Input: s = "4193 with words"
Output: 4193
```

**Example 4:**
```
Input: s = "words and 987"
Output: 0
```

**Example 5:**
```
Input: s = "-91283472332"
Output: -2147483648
```

## Constraints
- `0 <= s.length <= 200`
- `s` consists of English letters (lower-case and upper-case), digits (`0-9`), `' '`, `'+'`, `'-'`, and `'.'`.

## Topic Tags
`String` `Math`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

## Intuition
The problem asks us to parse a string into an integer following specific rules. The key challenge is handling all edge cases: leading whitespace, sign characters, non-numeric characters, and integer overflow. We process the string character by character, building the number as we go, and clamp to the 32-bit range when necessary.

## Approach
1. Skip leading whitespace characters.
2. Check for an optional sign character (`'+'` or `'-'`).
3. Read consecutive digit characters and build the number.
4. Stop when a non-digit is encountered or the string ends.
5. Apply the sign and clamp to `[-2^31, 2^31 - 1]`.

## Brute Force
### Approach
Use Python's built-in `int()` with a try-except block, or parse character by character while handling all edge cases.
### Code
**Python**
```python
class Solution:
    def myAtoi(self, s: str) -> int:
        INT_MIN, INT_MAX = -2**31, 2**31 - 1
        s = s.lstrip()
        if not s:
            return 0
        sign = 1
        idx = 0
        if s[idx] == '-':
            sign = -1
            idx += 1
        elif s[idx] == '+':
            idx += 1
        result = 0
        while idx < len(s) and s[idx].isdigit():
            result = result * 10 + int(s[idx])
            if sign * result < INT_MIN:
                return INT_MIN
            if sign * result > INT_MAX:
                return INT_MAX
            idx += 1
        return sign * result
```
**C++**
```cpp
class Solution {
public:
    int myAtoi(string s) {
        int i = 0, n = s.size();
        while (i < n && s[i] == ' ') i++;
        if (i == n) return 0;
        int sign = 1;
        if (s[i] == '-') { sign = -1; i++; }
        else if (s[i] == '+') { i++; }
        long result = 0;
        while (i < n && isdigit(s[i])) {
            result = result * 10 + (s[i] - '0');
            if (sign * result < INT_MIN) return INT_MIN;
            if (sign * result > INT_MAX) return INT_MAX;
            i++;
        }
        return (int)(sign * result);
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
    def myAtoi(self, s: str) -> int:
        INT_MIN, INT_MAX = -2**31, 2**31 - 1
        i, n = 0, len(s)
        while i < n and s[i] == ' ':
            i += 1
        if i == n:
            return 0
        sign = 1
        if s[i] == '-':
            sign = -1
            i += 1
        elif s[i] == '+':
            i += 1
        result = 0
        while i < n and s[i].isdigit():
            digit = int(s[i])
            if result > (INT_MAX - digit) // 10:
                return INT_MAX if sign == 1 else INT_MIN
            result = result * 10 + digit
            i += 1
        return sign * result
```
**C++**
```cpp
class Solution {
public:
    int myAtoi(string s) {
        int i = 0, n = s.size();
        while (i < n && s[i] == ' ') i++;
        if (i == n) return 0;
        int sign = 1;
        if (s[i] == '-') { sign = -1; i++; }
        else if (s[i] == '+') { i++; }
        long long result = 0;
        while (i < n && isdigit(s[i])) {
            int digit = s[i] - '0';
            if (result > (INT_MAX - digit) / 10) {
                return sign == 1 ? INT_MAX : INT_MIN;
            }
            result = result * 10 + digit;
            i++;
        }
        return (int)(sign * result);
    }
};
```
### Complexity
- **Time:** O(n)
- **Space:** O(1)

## Key Insight
> Check for overflow *before* multiplying by 10 by comparing the current result with `(INT_MAX - digit) // 10`. This avoids needing a `long long` type and works purely with 32-bit integers.

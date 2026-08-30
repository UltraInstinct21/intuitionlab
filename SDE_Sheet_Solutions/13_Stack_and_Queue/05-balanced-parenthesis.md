# 20. Valid Parentheses

> **Difficulty:** Easy | **Topic:** Stack, String | **Platform:** LeetCode

---

## Problem Statement
Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

## Examples
**Example 1:**
```
Input: s = "()"
Output: true
```

**Example 2:**
```
Input: s = "()[]{}"
Output: true
```

**Example 3:**
```
Input: s = "(]"
Output: false
```

## Constraints
- 1 ≤ s.length ≤ 10^4
- s consists of parentheses only `'()[]{}'`.

## Topic Tags
`Stack` `String` `Data Structures`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) |

## Intuition
A stack is the natural data structure for matching brackets. When we encounter an opening bracket, we push it onto the stack. When we encounter a closing bracket, we check if the top of the stack is the matching opening bracket. If not, the string is invalid.

## Approach
1. Initialize an empty stack and a mapping of closing to opening brackets.
2. Iterate through each character in the string.
3. If it's an opening bracket, push it onto the stack.
4. If it's a closing bracket, check if the stack is non-empty and the top matches. If not, return `False`.
5. After iterating, return `True` if the stack is empty.

## Brute Force
### Approach
Use a stack to track opening brackets. For each closing bracket, verify it matches the most recent unmatched opening bracket.

### Code
**Python**
```python
def isValid(s: str) -> bool:
    stack = []
    mapping = {')': '(', ']': '[', '}': '{'}

    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)

    return len(stack) == 0
```

**C++**
```cpp
class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> mapping = {{')','('},{']','[','}','{'}};

        for (char c : s) {
            if (mapping.count(c)) {
                if (st.empty() || st.top() != mapping[c])
                    return false;
                st.pop();
            } else {
                st.push(c);
            }
        }
        return st.empty();
    }
};
```

### Complexity
- **Time:** O(n) — single pass through the string.
- **Space:** O(n) — stack stores at most n/2 opening brackets.

## Optimized Solution
### Code
**Python**
```python
def isValid(s: str) -> bool:
    stack = []
    mapping = {')': '(', ']': '[', '}': '{'}

    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)

    return len(stack) == 0
```

**C++**
```cpp
class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> mapping = {{')','('},{']','[','}','{'}};

        for (char c : s) {
            if (mapping.count(c)) {
                if (st.empty() || st.top() != mapping[c])
                    return false;
                st.pop();
            } else {
                st.push(c);
            }
        }
        return st.empty();
    }
};
```

### Complexity
- **Time:** O(n).
- **Space:** O(n) — worst case all opening brackets.

## Key Insight
> A stack naturally enforces the nested bracket structure; unmatched closing brackets or leftover opening brackets indicate invalid input.

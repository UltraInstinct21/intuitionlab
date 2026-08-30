# 38. Count and Say

> **Difficulty:** Hard | **Topic:** String, Simulation | **Platform:** LeetCode

---

## Problem Statement
The count-and-say sequence is a sequence of digit strings defined by the recursive formula:
- `countAndSay(1) = "1"`
- `countAndSay(n)` is the way you would "say" the digit string from `countAndSay(n-1)`, which is then converted into a new digit string.

To determine how you "say" a digit string, split it into the minimal number of substrings such that each substring contains exactly one unique digit. Then for each substring, say the number of digits, followed by the digit. This produces a new string.

Given an integer `n`, return the `n`th term of the count-and-say sequence.

## Examples
**Example 1:**
```
Input: n = 1
Output: "1"
Explanation: This is the base case.
```

**Example 2:**
```
Input: n = 4
Output: "1211"
Explanation:
countAndSay(1) = "1"
countAndSay(2) = say "1" = one 1 = "11"
countAndSay(3) = say "11" = two 1's = "21"
countAndSay(4) = say "21" = one 2, one 1 = "1211"
```

## Constraints
- 1 ≤ n ≤ 30

## Topic Tags
`String` `Simulation` `Recursion` `Iteration`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n * m) where m is the length of the string at each step |
| **Space** | O(m) for the result string |

## Intuition
We build the sequence iteratively from "1". At each step, we read the current string left to right, counting consecutive identical characters, then append the count followed by the digit to form the next string. Since the maximum value of n is 30, the string length grows at most exponentially with a small base, keeping this manageable.

## Approach
1. Start with `result = "1"`.
2. Repeat `n - 1` times:
   - Use two pointers: `i` to track the current position and `j` to scan forward.
   - For each group of identical characters, append the count and the character to a new string.
3. Return the final result.

## Brute Force
### Approach
Recursively compute each term using the same read-and-count logic. This is essentially the same as the iterative approach but uses recursion.

### Code
**Python**
```python
def countAndSay(n):
    if n == 1:
        return "1"
    prev = countAndSay(n - 1)
    result = ""
    i = 0
    while i < len(prev):
        count = 1
        while i + count < len(prev) and prev[i + count] == prev[i]:
            count += 1
        result += str(count) + prev[i]
        i += count
    return result
```

**C++**
```cpp
string countAndSay(int n) {
    if (n == 1) return "1";
    string prev = countAndSay(n - 1);
    string result = "";
    for (int i = 0; i < prev.size(); ) {
        int count = 1;
        while (i + count < prev.size() && prev[i + count] == prev[i])
            count++;
        result += to_string(count) + prev[i];
        i += count;
    }
    return result;
}
```

### Complexity
- **Time:** O(n * m) where m is the string length at each level
- **Space:** O(n * m) for recursion stack and strings

## Optimized Solution
### Code
**Python**
```python
def countAndSay(n):
    result = "1"
    for _ in range(n - 1):
        next_result = ""
        i = 0
        while i < len(result):
            count = 1
            while i + count < len(result) and result[i + count] == result[i]:
                count += 1
            next_result += str(count) + result[i]
            i += count
        result = next_result
    return result
```

**C++**
```cpp
string countAndSay(int n) {
    string result = "1";
    for (int step = 0; step < n - 1; step++) {
        string next = "";
        for (int i = 0; i < result.size(); ) {
            int count = 1;
            while (i + count < result.size() && result[i + count] == result[i])
                count++;
            next += to_string(count) + result[i];
            i += count;
        }
        result = next;
    }
    return result;
}
```

### Complexity
- **Time:** O(n * m) where m is the maximum string length
- **Space:** O(m) for storing the current and next strings

## Key Insight
> The string length grows by at most a factor of ~1.33 per iteration (longest run of identical digits), so the total work across all iterations remains manageable even for n = 30.

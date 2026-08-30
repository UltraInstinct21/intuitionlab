# 242. Valid Anagram

> **Difficulty:** Easy | **Topic:** String, Hash Table, Sorting | **Platform:** LeetCode

---

## Problem Statement
Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise. An anagram is a word formed by rearranging the letters of another word, using all the original letters exactly once.

## Examples
**Example 1:**
```
Input: s = "anagram", t = "nagaram"
Output: true
```

**Example 2:**
```
Input: s = "rat", t = "car"
Output: false
```

## Constraints
- 1 ≤ s.length, t.length ≤ 5 × 10^4
- s and t consist of lowercase English letters

## Topic Tags
`String` `Hash-Table` `Sorting` `Counting`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

## Intuition
Two strings are anagrams if and only if they have the same character counts. We can use a frequency array (or hash map) to count occurrences of each character in `s`, then decrement for each character in `t`. If all counts are zero, they are anagrams.

## Approach
1. If `len(s) != len(t)`, return `false` immediately.
2. Create a count array of size 26 (for lowercase English letters).
3. For each character in `s`, increment its count.
4. For each character in `t`, decrement its count.
5. If any count is non-zero, return `false`.
6. Return `true`.

## Brute Force
### Approach
Sort both strings and compare them. If they are equal, they are anagrams.

### Code
**Python**
```python
def isAnagram(s, t):
    return sorted(s) == sorted(t)
```

**C++**
```cpp
bool isAnagram(string s, string t) {
    sort(s.begin(), s.end());
    sort(t.begin(), t.end());
    return s == t;
}
```

### Complexity
- **Time:** O(n log n) due to sorting
- **Space:** O(n) for the sorted strings

## Optimized Solution
### Code
**Python**
```python
def isAnagram(s, t):
    if len(s) != len(t):
        return False
    count = [0] * 26
    for c in s:
        count[ord(c) - ord('a')] += 1
    for c in t:
        count[ord(c) - ord('a')] -= 1
        if count[ord(c) - ord('a')] < 0:
            return False
    return True
```

**C++**
```cpp
bool isAnagram(string s, string t) {
    if (s.size() != t.size()) return false;
    int count[26] = {0};
    for (char c : s) count[c - 'a']++;
    for (char c : t) {
        count[c - 'a']--;
        if (count[c - 'a'] < 0) return false;
    }
    return true;
}
```

### Complexity
- **Time:** O(n)
- **Space:** O(1) (fixed 26-element array)

## Key Insight
> Since the character set is fixed (26 lowercase letters), a simple frequency array gives O(n) time with O(1) space, which is optimal.

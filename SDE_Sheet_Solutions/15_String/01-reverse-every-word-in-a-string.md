# 151. Reverse Words in a String

> **Difficulty:** Medium | **Topic:** String | **Platform:** LeetCode

---

## Problem Statement
Given an input string `s`, reverse the order of the words. A word is defined as a sequence of non-space characters. The words in `s` will be separated by at least one space. Return a string of the words in reverse order concatenated by a single space. Note that `s` may contain leading or trailing spaces and multiple spaces between two words.

## Examples
**Example 1:**
```
Input: s = "the sky is blue"
Output: "blue is sky the"
```

**Example 2:**
```
Input: s = "  hello world  "
Output: "world hello"
```

**Example 3:**
```
Input: s = "a good   example"
Output: "example good a"
```

## Constraints
- `1 <= s.length <= 10^4`
- `s` contains English letters (upper-case and lower-case), digits, and spaces `' '`.
- There is at least one word in `s`.

## Topic Tags
`String` `Two Pointers`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(n) |

## Intuition
The core idea is to split the string into individual words, then reverse the order of those words and join them back together. The tricky part is handling leading/trailing spaces and multiple spaces between words. We can either use built-in split functionality or implement our own logic to iterate through the string and extract words manually.

## Approach
1. Initialize an empty list to store words.
2. Traverse the string character by character.
3. When we encounter a non-space character and we were previously at a space (or at the start), mark the beginning of a word.
4. When we encounter a space after a word, extract the word and add it to the list.
5. After traversal, reverse the list of words.
6. Join the reversed list with single spaces.

## Brute Force
### Approach
Split the string using Python's built-in `split()` which handles multiple spaces automatically, then reverse the list and join. In C++, use a stringstream to do the same.
### Code
**Python**
```python
class Solution:
    def reverseWords(self, s: str) -> str:
        words = s.split()
        return ' '.join(reversed(words))
```
**C++**
```cpp
class Solution {
public:
    string reverseWords(string s) {
        stringstream ss(s);
        string word;
        vector<string> words;
        while (ss >> word) {
            words.push_back(word);
        }
        reverse(words.begin(), words.end());
        string result;
        for (int i = 0; i < words.size(); i++) {
            if (i > 0) result += " ";
            result += words[i];
        }
        return result;
    }
};
```
### Complexity
- **Time:** O(n)
- **Space:** O(n)

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def reverseWords(self, s: str) -> str:
        result = []
        i, n = 0, len(s)
        while i < n:
            while i < n and s[i] == ' ':
                i += 1
            if i < n:
                j = i
                while j < n and s[j] != ' ':
                    j += 1
                result.append(s[i:j])
                i = j
        result.reverse()
        return ' '.join(result)
```
**C++**
```cpp
class Solution {
public:
    string reverseWords(string s) {
        vector<string> words;
        int i = 0, n = s.size();
        while (i < n) {
            while (i < n && s[i] == ' ') i++;
            if (i < n) {
                int j = i;
                while (j < n && s[j] != ' ') j++;
                words.push_back(s.substr(i, j - i));
                i = j;
            }
        }
        reverse(words.begin(), words.end());
        string result;
        for (int k = 0; k < words.size(); k++) {
            if (k > 0) result += " ";
            result += words[k];
        }
        return result;
    }
};
```
### Complexity
- **Time:** O(n)
- **Space:** O(n)

## Key Insight
> Handle edge cases by manually scanning for words rather than relying on split, which gives full control over space handling and avoids creating intermediate string objects.

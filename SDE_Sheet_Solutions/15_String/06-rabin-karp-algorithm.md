# Rabin-Karp Algorithm (Pattern Searching)

> **Difficulty:** Hard | **Topic:** String, Pattern Matching, Hashing | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a text `txt` and a pattern `pat`, find all occurrences of the pattern in the text. The Rabin-Karp algorithm uses hashing to match the pattern with substrings of the text efficiently. It computes a hash value for the pattern and for each window of the same length in the text, comparing hashes first and only doing character comparison when hashes match (to handle hash collisions).

## Examples
**Example 1:**
```
Input: txt = "ABABDABACDABABCABAB", pat = "ABABCABAB"
Output: Pattern found at index 10
```

**Example 2:**
```
Input: txt = "AABAACAADAABAABA", pat = "AABA"
Output: Pattern found at index 0, 9, 12
```

**Example 3:**
```
Input: txt = "AAAAAA", pat = "AA"
Output: Pattern found at index 0, 1, 2, 3, 4
```

## Constraints
- `1 <= |txt| <= 10^5`
- `1 <= |pat| <= |txt|`
- Both strings contain uppercase and lowercase English letters.

## Topic Tags
`String` `Pattern Matching` `Hashing` `Rolling Hash`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n + m) average, O(nm) worst case |
| **Space** | O(1) |

## Intuition
Instead of comparing the pattern with every substring of the text (which would be O(nm)), we use a rolling hash. A hash function maps each string to a numeric value. If two strings are identical, their hashes will be equal. By computing the hash of the pattern and sliding a window over the text, we can quickly eliminate non-matching positions. When hashes match, we verify with actual character comparison to handle collisions. The rolling hash allows us to compute the next window's hash from the current one in O(1) time.

## Approach
1. Compute the hash value of the pattern.
2. Compute the hash value of the first window (of size m) in the text.
3. Slide the window one character at a time from left to right:
   - Remove the leading character and add the trailing character to update the hash in O(1).
   - If the hash matches the pattern's hash, do a character-by-character comparison to confirm.
   - If confirmed, record the index.
4. Return all found indices.

## Brute Force
### Approach
For every possible starting position in the text, compare the pattern character by character.
### Code
**Python**
```python
def search(pat, txt):
    m, n = len(pat), len(txt)
    results = []
    for i in range(n - m + 1):
        if txt[i:i+m] == pat:
            results.append(i)
    return results
```
**C++**
```cpp
vector<int> search(string pat, string txt) {
    int m = pat.size(), n = txt.size();
    vector<int> results;
    for (int i = 0; i <= n - m; i++) {
        if (txt.substr(i, m) == pat) {
            results.push_back(i);
        }
    }
    return results;
}
```
### Complexity
- **Time:** O(nm)
- **Space:** O(1)

## Optimized Solution
### Code
**Python**
```python
def search(pat, txt):
    d = 256  # number of characters in the alphabet
    q = 101  # a prime number for modulo hashing
    m, n = len(pat), len(txt)
    results = []

    if m > n:
        return results

    p_hash = 0  # hash value for pattern
    t_hash = 0  # hash value for current window
    h = 1

    # h = d^(m-1) % q
    for i in range(m - 1):
        h = (h * d) % q

    # Compute initial hash values
    for i in range(m):
        p_hash = (d * p_hash + ord(pat[i])) % q
        t_hash = (d * t_hash + ord(txt[i])) % q

    # Slide the pattern over the text
    for i in range(n - m + 1):
        if p_hash == t_hash:
            # Hash match, verify character by character
            match = True
            for j in range(m):
                if txt[i + j] != pat[j]:
                    match = False
                    break
            if match:
                results.append(i)

        # Compute hash for next window
        if i < n - m:
            t_hash = (d * (t_hash - ord(txt[i]) * h) + ord(txt[i + m])) % q
            if t_hash < 0:
                t_hash += q

    return results
```
**C++**
```cpp
vector<int> search(string pat, string txt) {
    int d = 256;   // number of characters in the alphabet
    int q = 101;   // a prime number for modulo hashing
    int m = pat.size(), n = txt.size();
    vector<int> results;

    if (m > n) return results;

    int p_hash = 0, t_hash = 0, h = 1;

    // h = d^(m-1) % q
    for (int i = 0; i < m - 1; i++)
        h = (h * d) % q;

    // Compute initial hash values
    for (int i = 0; i < m; i++) {
        p_hash = (d * p_hash + pat[i]) % q;
        t_hash = (d * t_hash + txt[i]) % q;
    }

    // Slide the pattern over the text
    for (int i = 0; i <= n - m; i++) {
        if (p_hash == t_hash) {
            bool match = true;
            for (int j = 0; j < m; j++) {
                if (txt[i + j] != pat[j]) {
                    match = false;
                    break;
                }
            }
            if (match) results.push_back(i);
        }

        // Compute hash for next window
        if (i < n - m) {
            t_hash = (d * (t_hash - txt[i] * h) + txt[i + m]) % q;
            if (t_hash < 0) t_hash += q;
        }
    }

    return results;
}
```
### Complexity
- **Time:** O(n + m) average case, O(nm) worst case (due to hash collisions)
- **Space:** O(1)

## Key Insight
> The rolling hash technique allows computing the next window's hash from the current one in O(1) by removing the contribution of the leaving character and adding the entering character. Using a prime modulus (q) minimizes hash collisions for better average-case performance.

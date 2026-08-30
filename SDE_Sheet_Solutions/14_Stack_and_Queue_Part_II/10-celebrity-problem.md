# The Celebrity Problem

> **Difficulty:** Hard | **Topic:** Stack, Two Pointers | **Platform:** LeetCode 277 / GeeksforGeeks

---

## Problem Statement
A celebrity is a person who is known to everyone but does not know anyone at a party. Given a party of n people represented by an n x n matrix `knows` where `knows[i][j] = 1` means person i knows person j, find the celebrity (if it exists). The celebrity is defined as someone who is known by everyone and knows nobody.

## Examples
**Example 1:**
```
Input: knows = [[1,1,0],[0,1,0],[0,0,1]]
Output: 1
```

**Example 2:**
```
Input: knows = [[1,1,0],[0,1,0],[1,0,1]]
Output: -1
```

## Constraints
- n == knows.length
- 2 ≤ n ≤ 100
- knows[i][j] is 0 or 1
- knows[i][i] = 1

## Topic Tags
`Stack` `Two Pointers` `Matrix`

## Expected Complexities
| | |
|---|---|
| **Time** | O(N) |
| **Space** | O(1) |

## Intuition
Use a stack to eliminate non-celebrity candidates. Push all people onto the stack, then compare pairs: if A knows B, A cannot be the celebrity; otherwise, B cannot be. After elimination, verify the candidate.

## Approach
1. Push all people onto a stack.
2. Pop two people, A and B. If A knows B, A is not the celebrity; otherwise, B is not.
3. Push the potential celebrity back.
4. After one pass, verify the remaining candidate: they must be known by everyone and know nobody.

## Brute Force
### Approach
For each person, check if they are known by everyone and know nobody.

### Code
**Python**
```python
def findCelebrity(n, knows):
    for i in range(n):
        is_celeb = True
        for j in range(n):
            if i != j and (knows(i, j) or not knows(j, i)):
                is_celeb = False
                break
        if is_celeb:
            return i
    return -1
```

**C++**
```cpp
int findCelebrity(int n, function<bool(int,int)> knows) {
    for (int i = 0; i < n; i++) {
        bool isCeleb = true;
        for (int j = 0; j < n; j++) {
            if (i != j && (knows(i, j) || !knows(j, i))) {
                isCeleb = false;
                break;
            }
        }
        if (isCeleb) return i;
    }
    return -1;
}
```

### Complexity
- **Time:** O(N^2)
- **Space:** O(1)

## Optimized Solution
### Code
**Python**
```python
def findCelebrity(n, knows):
    stack = list(range(n))
    while len(stack) > 1:
        a = stack.pop()
        b = stack.pop()
        if knows(a, b):
            stack.append(b)
        else:
            stack.append(a)
    if not stack:
        return -1
    candidate = stack.pop()
    for i in range(n):
        if i != candidate and (knows(candidate, i) or not knows(i, candidate)):
            return -1
    return candidate
```

**C++**
```cpp
int findCelebrity(int n, function<bool(int,int)> knows) {
    stack<int> st;
    for (int i = 0; i < n; i++) st.push(i);
    while (st.size() > 1) {
        int a = st.top(); st.pop();
        int b = st.top(); st.pop();
        if (knows(a, b)) st.push(b);
        else st.push(a);
    }
    if (st.empty()) return -1;
    int candidate = st.top();
    for (int i = 0; i < n; i++) {
        if (i != candidate && (knows(candidate, i) || !knows(i, candidate)))
            return -1;
    }
    return candidate;
}
```

### Complexity
- **Time:** O(N)
- **Space:** O(N) for stack, or O(1) with two-pointer approach

## Key Insight
> Use a stack to eliminate candidates by comparing pairs: only one person can be the celebrity, and each comparison eliminates one candidate.

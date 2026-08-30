# Minimum Coins (Coin Change)

> **Difficulty:** Medium | **Topic:** Greedy, Dynamic Programming, Math | **Platform:** LeetCode

---

## Problem Statement
You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1. You may assume that you have an infinite number of each kind of coin.

## Examples
**Example 1:**
```
Input: coins = [1, 5, 10, 25], amount = 30
Output: 2
Explanation: 5 + 25 = 30, minimum 2 coins.
```

**Example 2:**
```
Input: coins = [2], amount = 3
Output: -1
Explanation: Cannot make amount 3 with only coin of value 2.
```

**Example 3:**
```
Input: coins = [1], amount = 0
Output: 0
Explanation: No coins needed for amount 0.
```

## Constraints
- 1 <= coins.length <= 12
- 1 <= coins[i] <= 2^31 - 1
- 0 <= amount <= 10^4

## Topic Tags
`Greedy` `Dynamic Programming` `Math`

## Expected Complexities
| | |
|---|---|
| **Time** | O(amount * n) |
| **Space** | O(amount) |

## Intuition
For standard coin systems (like US currency: 1, 5, 10, 25), a greedy approach works: always take the largest coin possible. However, for arbitrary coin systems, we need dynamic programming. The DP approach builds up the solution by finding the minimum coins needed for each amount from 0 to the target amount.

## Approach
1. Create a DP array of size (amount + 1), initialized with infinity (amount + 1).
2. Set dp[0] = 0 (zero coins needed for zero amount).
3. For each amount i from 1 to amount:
   - For each coin in coins:
     - If coin <= i, update dp[i] = min(dp[i], dp[i - coin] + 1).
4. If dp[amount] is still infinity, return -1; otherwise return dp[amount].

## Brute Force
### Approach
Use recursion to try all possible combinations of coins. For each coin, either use it or skip it, and find the minimum.
### Complexity
- Time: O(2^n) exponential
- Space: O(amount) for recursion stack

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        
        for i in range(1, amount + 1):
            for coin in coins:
                if coin <= i:
                    dp[i] = min(dp[i], dp[i - coin] + 1)
        
        return dp[amount] if dp[amount] != float('inf') else -1
```

**C++**
```cpp
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) {
                    dp[i] = min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        
        return dp[amount] > amount ? -1 : dp[amount];
    }
};
```

### Complexity
- Time: O(amount * n)
- Space: O(amount)

## Key Insight
> For arbitrary coin systems, dynamic programming is required. Greedy only works for canonical coin systems like standard currency denominations.

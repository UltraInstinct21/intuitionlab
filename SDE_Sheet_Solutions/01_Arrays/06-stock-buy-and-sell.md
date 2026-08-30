# 121. Best Time to Buy and Sell Stock

> **Difficulty:** Easy | **Topic:** Array, Dynamic Programming | **LeetCode:** [121](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)

---

## Problem Statement

You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.

---

## Examples

**Example 1:**
```
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
```

**Example 2:**
```
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.
```

---

## Constraints

- `1 <= prices.length <= 10^5`
- `0 <= prices[i] <= 10^4`

---

## Topic Tags

`Array` `Dynamic Programming`

---

## Expected Complexities

| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Intuition

To maximize profit, we need to buy at the lowest price and sell at the highest price after that. Track the minimum price seen so far, and at each day calculate the profit if we sell today.

---

## Approach

1. Initialize `min_price` with the first price and `max_profit` with 0
2. Iterate through prices:
   - Update `min_price` if current price is lower
   - Calculate profit if selling at current price
   - Update `max_profit` if this profit is better
3. Return `max_profit`

---

## Brute Force

### Approach

Check every possible pair of buy and sell days.

### Code

**Python**
```python
class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        max_profit = 0
        
        for i in range(len(prices)):
            for j in range(i + 1, len(prices)):
                max_profit = max(max_profit, prices[j] - prices[i])
        
        return max_profit
```

**C++**
```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int maxProfit = 0;
        
        for (int i = 0; i < prices.size(); i++) {
            for (int j = i + 1; j < prices.size(); j++) {
                maxProfit = max(maxProfit, prices[j] - prices[i]);
            }
        }
        
        return maxProfit;
    }
};
```

### Complexity
- **Time:** O(n²)
- **Space:** O(1)

---

## Optimized Solution

### Approach

Single pass tracking minimum price and maximum profit.

### Code

**Python**
```python
class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        
        for price in prices:
            min_price = min(min_price, price)
            max_profit = max(max_profit, price - min_price)
        
        return max_profit
```

**C++**
```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX;
        int maxProfit = 0;
        
        for (int price : prices) {
            minPrice = min(minPrice, price);
            maxProfit = max(maxProfit, price - minPrice);
        }
        
        return maxProfit;
    }
};
```

### Complexity
- **Time:** O(n)
- **Space:** O(1)

---

## Key Insight

> Track the minimum price seen so far. At each day, the best profit from selling today is `current_price - min_price`. Update the global maximum accordingly.

# Fractional Knapsack

> **Difficulty:** Medium | **Topic:** Greedy, Sorting | **Platform:** GeeksforGeeks

---

## Problem Statement
Given weights and values of N items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack. In the fractional knapsack, we can break items for maximizing the total value of the knapsack. Return the maximum value achievable.

## Examples
**Example 1:**
```
Input: values[] = [60, 100, 120], weights[] = [10, 20, 30], W = 50
Output: 240.0
Explanation: Take item 1 (10kg, 60), item 2 (20kg, 100), and 2/3 of item 3 (20kg of 30kg, 80). Total = 60+100+80 = 240.
```

**Example 2:**
```
Input: values[] = [10, 20, 30], weights[] = [5, 10, 15], W = 100
Output: 60.0
Explanation: All items can be taken as total weight is less than capacity.
```

## Constraints
- 1 ≤ N ≤ 100
- 1 ≤ W ≤ 1000
- 1 ≤ values[i], weights[i] ≤ 1000

## Topic Tags
`Greedy` `Sorting`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n log n) |
| **Space** | O(n) |

## Intuition
In fractional knapsack, we can take fractions of items. The optimal strategy is to always take the item with the highest value-to-weight ratio first. This greedy approach ensures maximum value per unit of weight.

## Approach
1. Calculate the value-to-weight ratio for each item.
2. Sort items in decreasing order of their value-to-weight ratio.
3. Iterate through sorted items:
   - If the item fits entirely, take it completely and reduce remaining capacity.
   - If it doesn't fit entirely, take as much as possible (fraction) and stop.
4. Return the total value.

## Brute Force
### Approach
Try all possible combinations of items (subset problem) but with fractions. This becomes exponential without the greedy insight.
### Complexity
- Time: O(2^n)
- Space: O(1)

## Optimized Solution
### Code
**Python**
```python
class Solution:
    def fractionalknapsack(self, W, items, n):
        ratios = []
        for i in range(n):
            ratios.append((items[i].value / items[i].weight, items[i].weight, items[i].value))
        
        ratios.sort(reverse=True)
        
        total_value = 0.0
        
        for ratio, weight, value in ratios:
            if W >= weight:
                total_value += value
                W -= weight
            else:
                total_value += ratio * W
                break
        
        return total_value
```

**C++**
```cpp
class Solution {
public:
    double fractionalknapsack(int W, vector<Item>& items, int n) {
        vector<pair<double,int>> ratios;
        for (int i = 0; i < n; i++) {
            ratios.push_back({(double)items[i].value / items[i].weight, i});
        }
        
        sort(ratios.rbegin(), ratios.rend());
        
        double totalValue = 0.0;
        
        for (auto& p : ratios) {
            int idx = p.second;
            int weight = items[idx].weight;
            int value = items[idx].value;
            
            if (W >= weight) {
                totalValue += value;
                W -= weight;
            } else {
                totalValue += (double)value / weight * W;
                break;
            }
        }
        
        return totalValue;
    }
};
```

### Complexity
- Time: O(n log n)
- Space: O(n)

## Key Insight
> Greedily selecting items by highest value-to-weight ratio guarantees optimal value when fractions are allowed.

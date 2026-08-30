# Job Sequencing Problem

> **Difficulty:** Medium | **Topic:** Greedy, Disjoint Set, Sorting | **Platform:** GeeksforGeeks

---

## Problem Statement
Given a set of n jobs where each job i has a deadline deadline[i] and profit[i]. Each job takes one unit of time to complete. Only one job can be scheduled at a time. A job is said to be completed if it is finished before its deadline. Find the maximum profit and the number of jobs done.

## Examples
**Example 1:**
```
Input: deadlines[] = [2, 1, 2, 1, 1], profits[] = [100, 19, 27, 25, 15], n = 5
Output: [3, 127]
Explanation: Jobs done: J1, J3, J4 with profit 100+27+25 = 127 and 3 jobs completed.
```

**Example 2:**
```
Input: deadlines[] = [1, 2, 3, 3], profits[] = [50, 60, 40, 30], n = 4
Output: [2, 110]
Explanation: Jobs done: J1, J2 with profit 50+60 = 110 and 2 jobs completed.
```

## Constraints
- 1 ≤ n ≤ 10^5
- 1 ≤ deadline[i] ≤ n
- 1 ≤ profit[i] ≤ 10^5

## Topic Tags
`Greedy` `Disjoint Set` `Sorting`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n log n) |
| **Space** | O(n) |

## Intuition
We should always try to do the job with the highest profit first. For each job (sorted by decreasing profit), we try to schedule it as late as possible before its deadline. This leaves earlier slots available for other jobs with earlier deadlines.

## Approach
1. Sort all jobs in decreasing order of profit.
2. For each job, find the latest available time slot before its deadline.
3. If a slot is available, assign the job to that slot and mark it as occupied.
4. Use a Disjoint Set (Union-Find) data structure to efficiently find the latest available slot.
5. Track total profit and count of jobs done.

## Brute Force
### Approach
For each job, try to find an available slot by scanning from its deadline backwards. Without optimization, this can be O(n^2).
### Complexity
- Time: O(n^2)
- Space: O(n)

## Optimized Solution
### Code
**Python**
```python
class DisjointSet:
    def __init__(self, n):
        self.parent = list(range(n + 1))
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        self.parent[x] = y

class Solution:
    def jobSequencing(self, deadlines, profits, n):
        jobs = []
        for i in range(n):
            jobs.append((profits[i], deadlines[i]))
        
        jobs.sort(reverse=True)
        
        max_deadline = max(deadline for _, deadline in jobs)
        ds = DisjointSet(max_deadline)
        
        total_profit = 0
        count = 0
        
        for profit, deadline in jobs:
            available_slot = ds.find(deadline)
            if available_slot > 0:
                total_profit += profit
                count += 1
                ds.union(available_slot, available_slot - 1)
        
        return [count, total_profit]
```

**C++**
```cpp
class DisjointSet {
    vector<int> parent;
public:
    DisjointSet(int n) : parent(n + 1) {
        for (int i = 0; i <= n; i++) parent[i] = i;
    }
    
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }
    
    void unite(int x, int y) {
        parent[x] = y;
    }
};

class Solution {
public:
    vector<int> jobSequencing(vector<int>& deadlines, vector<int>& profits, int n) {
        vector<pair<int,int>> jobs;
        for (int i = 0; i < n; i++) {
            jobs.push_back({profits[i], deadlines[i]});
        }
        
        sort(jobs.rbegin(), jobs.rend());
        
        int maxDeadline = 0;
        for (auto& job : jobs) {
            maxDeadline = max(maxDeadline, job.second);
        }
        
        DisjointSet ds(maxDeadline);
        int totalProfit = 0, count = 0;
        
        for (auto& job : jobs) {
            int profit = job.first;
            int deadline = job.second;
            int availableSlot = ds.find(deadline);
            
            if (availableSlot > 0) {
                totalProfit += profit;
                count++;
                ds.unite(availableSlot, availableSlot - 1);
            }
        }
        
        return {count, totalProfit};
    }
};
```

### Complexity
- Time: O(n log n)
- Space: O(n)

## Key Insight
> Using Disjoint Set for slot allocation makes finding the latest available slot nearly O(1) amortized, giving overall O(n log n) complexity.

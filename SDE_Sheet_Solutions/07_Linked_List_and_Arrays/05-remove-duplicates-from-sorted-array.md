# 26. Remove Duplicates from Sorted Array

> **Difficulty:** Easy | **Topic:** Array, Two Pointers | **LeetCode:** [#26](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)

---

## Problem Statement
Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in nums.

Consider the number of unique elements of nums to be k, to get accepted, you need to do the following:
1. Change the array nums such that the first k elements of nums contain the unique elements in the order they were present in nums initially. The remaining elements of nums are not important as well as the size of nums.
2. Return k.

## Examples
**Example 1:**
```
Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
```

**Example 2:**
```
Input: nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5, nums = [0,1,2,3,4,_]
```

## Constraints
- 1 <= nums.length <= 3 * 10^4
- -100 <= nums[i] <= 100
- nums is sorted in non-decreasing order.

## Topic Tags
`Array` `Two Pointers`

## Expected Complexities
| | |
|---|---|
| **Time** | O(n) |
| **Space** | O(1) |

## Intuition
Since the array is sorted, duplicates will be adjacent. We can use a two-pointer approach where one pointer tracks the position of the last unique element, and another scans through the array.

## Approach
1. Use a pointer to track the position where the next unique element should be placed.
2. Iterate through the array, comparing each element with the previous unique element.
3. If it's different, place it at the next unique position.
4. Return the count of unique elements.

## Brute Force
### Approach
Use a set to store unique elements, then overwrite the array with the unique elements.

### Code
**Python**
```python
def removeDuplicates(nums):
    unique_elements = list(set(nums))
    unique_elements.sort()
    k = len(unique_elements)
    nums[:k] = unique_elements
    return k
```

**C++**
```cpp
int removeDuplicates(vector<int>& nums) {
    set<int> unique_elements(nums.begin(), nums.end());
    int k = unique_elements.size();
    int i = 0;
    for (int num : unique_elements) {
        nums[i++] = num;
    }
    return k;
}
```
### Complexity
- Time: O(n log n) due to sorting
- Space: O(n)

## Optimized Solution
### Code
**Python**
```python
def removeDuplicates(nums):
    if not nums:
        return 0
    
    k = 1  # Start with first element as unique
    
    for i in range(1, len(nums)):
        if nums[i] != nums[k - 1]:
            nums[k] = nums[i]
            k += 1
    
    return k
```

**C++**
```cpp
int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    
    int k = 1;  // Start with first element as unique
    
    for (int i = 1; i < nums.size(); i++) {
        if (nums[i] != nums[k - 1]) {
            nums[k] = nums[i];
            k++;
        }
    }
    
    return k;
}
```
### Complexity
- Time: O(n)
- Space: O(1)

## Key Insight
> Since the array is sorted, duplicates are adjacent. We can use a single pass to overwrite duplicates in-place with a pointer tracking the last unique position.
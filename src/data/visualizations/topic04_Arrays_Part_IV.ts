import { ProblemVisualization } from '../../types/visualization';

export const topic04Visualizations: Record<string, ProblemVisualization> = {
  '04_Arrays_Part_IV/01-two-sum': {
    type: 'array',
    steps: [
      {
        title: 'Initialize Hash Map & Process Index 0 (num = 2)',
        whatHappens:
          'Input array: [2, 7, 11, 15], Target = 9. Initialize empty hash map seen = {}. At index 0 (num=2), calculate required complement: complement = target - num = 9 - 2 = 7. 7 is not in seen. Store seen[2] = 0.',
        whyRationale:
          'Instead of checking all pairs in O(N²), a hash map allows us to check in O(1) time whether the exact complement needed to reach the target has been seen previously.',
        arrayState: [2, 7, 11, 15],
        pointers: [
          { idx: 0, label: 'i=0 (val 2)', color: '#3b82f6' }
        ],
        highlightIndices: [0],
        states: {
          i: 0,
          num: 2,
          target: 9,
          complement: 7,
          'seen.has(7)': false,
          seenMap: '{ 2: 0 }'
        },
        codeSnippet:
          'seen = {}\nfor i, num in enumerate(nums):\n    complement = target - num  # 9 - 2 = 7\n    if complement in seen:\n        return [seen[complement], i]\n    seen[num] = i  # seen = {2: 0}',
        impact: 'Time: O(N) | Space: O(N)'
      },
      {
        title: 'Process Index 1 (num = 7): Complement 2 Found in Map!',
        whatHappens:
          'At index 1 (num=7), calculate complement: 9 - 7 = 2. Check seen map: 2 exists at index 0! Return indices [seen[2], 1] = [0, 1].',
        whyRationale:
          'Because nums[0] + nums[1] = 2 + 7 = 9, the complement pair is found in a single pass of O(N) time.',
        arrayState: [2, 7, 11, 15],
        pointers: [
          { idx: 0, label: 'seen[2]=0', color: '#22c55e' },
          { idx: 1, label: 'i=1 (val 7)', color: '#22c55e' }
        ],
        highlightIndices: [0, 1],
        result: '[0, 1]',
        states: {
          i: 1,
          num: 7,
          complement: 2,
          'seen.has(2)': true,
          resultIndices: '[0, 1]'
        },
        codeSnippet:
          'complement = target - num  # 9 - 7 = 2\nif complement in seen:\n    return [seen[complement], i]  # [0, 1]',
        impact: 'Time: O(N) | Space: O(N)'
      }
    ]
  },

  '04_Arrays_Part_IV/02-4sum': {
    type: 'array',
    steps: [
      {
        title: 'Sort Array & Fix Outer Pointers: i=0 (-2), j=1 (-1)',
        whatHappens:
          'Input array: [1, 0, -1, 0, -2, 2], Target = 0. Sort array to [-2, -1, 0, 0, 1, 2]. Set outer pointer i=0 (nums[i]=-2) and j=1 (nums[j]=-1). Initialize two pointers: left=2 (nums[left]=0) and right=5 (nums[right]=2).',
        whyRationale:
          'Sorting enables the two-pointer technique for the inner search and allows skipping duplicate values to ensure unique quadruplets.',
        arrayState: [-2, -1, 0, 0, 1, 2],
        pointers: [
          { idx: 0, label: 'i (-2)', color: '#3b82f6' },
          { idx: 1, label: 'j (-1)', color: '#eab308' },
          { idx: 2, label: 'L (0)', color: '#06b6d4' },
          { idx: 5, label: 'R (2)', color: '#a855f7' }
        ],
        highlightIndices: [0, 1, 2, 5],
        states: {
          i: 0,
          'nums[i]': -2,
          j: 1,
          'nums[j]': -1,
          left: 2,
          'nums[left]': 0,
          right: 5,
          'nums[right]': 2,
          target: 0
        },
        codeSnippet:
          'nums.sort()\nfor i in range(n - 3):\n    for j in range(i + 1, n - 2):\n        left, right = j + 1, n - 1',
        impact: 'Time: O(N³) | Space: O(1)'
      },
      {
        title: 'Evaluate Sum for i=0, j=1: Total = -1 < 0 -> Advance Left',
        whatHappens:
          'Calculate total = (-2) + (-1) + 0 + 2 = -1. Since -1 < target (0), sum is too small. Increment left pointer from index 2 to 3 (nums[3]=0). Next check: -2 + -1 + 0 + 2 = -1 < 0 -> Increment left to 4 (nums[4]=1).',
        whyRationale:
          'Because the array is sorted, incrementing left increases the sum towards the target.',
        arrayState: [-2, -1, 0, 0, 1, 2],
        pointers: [
          { idx: 0, label: 'i (-2)', color: '#3b82f6' },
          { idx: 1, label: 'j (-1)', color: '#eab308' },
          { idx: 3, label: 'L (0)', color: '#06b6d4' },
          { idx: 5, label: 'R (2)', color: '#a855f7' }
        ],
        highlightIndices: [0, 1, 3, 5],
        states: {
          'nums[i]': -2,
          'nums[j]': -1,
          'nums[left]': 0,
          'nums[right]': 2,
          total: -1,
          action: 'total < 0 -> left++'
        },
        codeSnippet:
          'total = nums[i] + nums[j] + nums[left] + nums[right]\nelif total < target:\n    left += 1',
        impact: 'Time: O(N³) | Space: O(1)'
      },
      {
        title: 'Quadruplet 1 Found: [-2, -1, 1, 2] = 0!',
        whatHappens:
          'At left=4 (nums[left]=1) and right=5 (nums[right]=2): Total = (-2) + (-1) + 1 + 2 = 0 == target! Record [-2, -1, 1, 2] in result. Increment left and decrement right while skipping duplicates.',
        whyRationale:
          'A valid combination of 4 numbers summing to target 0 is identified. Advancing pointers past duplicate values avoids generating redundant quadruplets.',
        arrayState: [-2, -1, 0, 0, 1, 2],
        pointers: [
          { idx: 0, label: 'i (-2)', color: '#3b82f6' },
          { idx: 1, label: 'j (-1)', color: '#eab308' },
          { idx: 4, label: 'L (1)', color: '#22c55e' },
          { idx: 5, label: 'R (2)', color: '#22c55e' }
        ],
        highlightIndices: [0, 1, 4, 5],
        states: {
          quadruplet1: '[-2, -1, 1, 2]',
          total: 0,
          target: 0,
          foundCount: 1
        },
        codeSnippet:
          'if total == target:\n    result.append([nums[i], nums[j], nums[left], nums[right]])\n    left += 1; right -= 1',
        impact: 'Time: O(N³) | Space: O(1)'
      },
      {
        title: 'Next Iteration: i=0, j=2 (-2, 0) Finds [-2, 0, 0, 2] = 0',
        whatHappens:
          'Advance j to 2 (nums[j]=0). Set left=3 (nums[left]=0), right=5 (nums[right]=2). Total = (-2) + 0 + 0 + 2 = 0 == target! Record [-2, 0, 0, 2].',
        whyRationale:
          'Fixing different (i, j) pairs allows discovering all disjoint quadruplet families efficiently.',
        arrayState: [-2, -1, 0, 0, 1, 2],
        pointers: [
          { idx: 0, label: 'i (-2)', color: '#3b82f6' },
          { idx: 2, label: 'j (0)', color: '#eab308' },
          { idx: 3, label: 'L (0)', color: '#22c55e' },
          { idx: 5, label: 'R (2)', color: '#22c55e' }
        ],
        highlightIndices: [0, 2, 3, 5],
        states: {
          quadruplet2: '[-2, 0, 0, 2]',
          total: 0,
          foundCount: 2
        },
        codeSnippet:
          'result.append([nums[i], nums[j], nums[left], nums[right]])  # [-2, 0, 0, 2]',
        impact: 'Time: O(N³) | Space: O(1)'
      },
      {
        title: 'Iteration i=1, j=2 (-1, 0) Finds [-1, 0, 0, 1] & Completes',
        whatHappens:
          'Set i=1 (nums[i]=-1), j=2 (nums[j]=0), left=3 (0), right=4 (1). Total = (-1) + 0 + 0 + 1 = 0 == target. Record [-1, 0, 0, 1]. All combinations scanned. Return all 3 unique quadruplets.',
        whyRationale:
          'Complete search space explored with O(N³) time and zero extra space beyond the result list.',
        arrayState: [-2, -1, 0, 0, 1, 2],
        pointers: [
          { idx: 1, label: 'i (-1)', color: '#3b82f6' },
          { idx: 2, label: 'j (0)', color: '#eab308' },
          { idx: 3, label: 'L (0)', color: '#22c55e' },
          { idx: 4, label: 'R (1)', color: '#22c55e' }
        ],
        highlightIndices: [1, 2, 3, 4],
        result: '[[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]',
        states: {
          allQuadruplets: '[[-2,-1,1,2], [-2,0,0,2], [-1,0,0,1]]',
          totalFound: 3
        },
        codeSnippet: 'return result',
        impact: 'Time: O(N³) | Space: O(1)'
      }
    ]
  },

  '04_Arrays_Part_IV/03-longest-consecutive-sequence': {
    type: 'array',
    steps: [
      {
        title: 'Insert All Elements into Hash Set: O(N) Lookup Setup',
        whatHappens:
          'Input array: [100, 4, 200, 1, 3, 2]. Build hash set: num_set = {1, 2, 3, 4, 100, 200}. Initialize max_length = 0.',
        whyRationale:
          'A Hash Set allows O(1) average lookup to check whether an element is the start of a consecutive sequence (num - 1 not in set).',
        arrayState: [100, 4, 200, 1, 3, 2],
        pointers: [
          { idx: 0, label: 'set', color: '#3b82f6' }
        ],
        highlightRange: [0, 5],
        states: { 'num_set.size': 6, maxLength: 0 },
        codeSnippet:
          'num_set = set(nums)  # {1, 2, 3, 4, 100, 200}\nmax_length = 0',
        impact: 'Time: O(N) | Space: O(N)'
      },
      {
        title: 'Check 100: (100 - 1 = 99 Not in Set) -> Sequence [100], Len = 1',
        whatHappens:
          'For num = 100: 99 is not in num_set, so 100 is a sequence start. Check 101 (not in set). Sequence length = 1. max_length = max(0, 1) = 1.',
        whyRationale:
          'Only elements that have no immediate predecessor (num - 1) qualify as sequence starting points, preventing redundant checks.',
        arrayState: [100, 4, 200, 1, 3, 2],
        pointers: [
          { idx: 0, label: 'num=100 (len 1)', color: '#eab308' }
        ],
        highlightIndices: [0],
        states: { num: 100, 'num-1 in set': false, currentLen: 1, maxLength: 1 },
        codeSnippet:
          'if num - 1 not in num_set:\n    current = num; length = 1\n    max_length = max(max_length, length)  # 1',
        impact: 'Time: O(N) | Space: O(N)'
      },
      {
        title: 'Skip Non-Starting Elements: 4, 3, 2 (Predecessors Exist)',
        whatHappens:
          'For num = 4: 3 is in set -> Skip! For num = 3: 2 is in set -> Skip! For num = 2: 1 is in set -> Skip!',
        whyRationale:
          'Skipping non-starting elements guarantees that each element is traversed at most twice (once in outer loop, once in while loop), maintaining strictly O(N) linear time.',
        arrayState: [100, 4, 200, 1, 3, 2],
        pointers: [
          { idx: 1, label: '4 (skip)', color: '#6b7280' },
          { idx: 4, label: '3 (skip)', color: '#6b7280' },
          { idx: 5, label: '2 (skip)', color: '#6b7280' }
        ],
        highlightIndices: [1, 4, 5],
        states: {
          '3 in set for 4': true,
          '2 in set for 3': true,
          '1 in set for 2': true,
          status: 'Skipped to preserve O(N) time'
        },
        codeSnippet:
          'if num - 1 not in num_set:  # False for 4, 3, 2 -> skipped',
        impact: 'Time: O(N) | Space: O(N)'
      },
      {
        title: 'Check 1: Sequence Start! Expand: 1 -> 2 -> 3 -> 4 (Length = 4)',
        whatHappens:
          'For num = 1: 0 is not in set -> Start of sequence! Inner loop finds: 1+1=2 in set, 2+1=3 in set, 3+1=4 in set, 4+1=5 not in set. Sequence is [1, 2, 3, 4], length = 4. Update max_length = max(1, 4) = 4.',
        whyRationale:
          'The longest consecutive sequence is discovered and fully traversed in O(L) steps.',
        arrayState: [100, 4, 200, 1, 3, 2],
        pointers: [
          { idx: 3, label: 'start=1', color: '#22c55e' },
          { idx: 1, label: 'end=4', color: '#22c55e' }
        ],
        highlightIndices: [1, 3, 4, 5],
        result: '4',
        states: {
          start: 1,
          sequence: '[1, 2, 3, 4]',
          length: 4,
          maxLength: 4
        },
        codeSnippet:
          'while current + 1 in num_set:\n    current += 1\n    length += 1\nmax_length = max(max_length, length)  # 4',
        impact: 'Time: O(N) | Space: O(N)'
      },
      {
        title: 'Check 200 (Len = 1) & Return Final Result = 4',
        whatHappens:
          'For num = 200: 199 is not in set -> sequence [200] has length 1. max_length remains 4. Traversal complete. Return 4.',
        whyRationale:
          'All numbers checked with O(N) total operations and O(N) memory overhead.',
        arrayState: [100, 4, 200, 1, 3, 2],
        pointers: [
          { idx: 2, label: '200 (len 1)', color: '#3b82f6' }
        ],
        highlightIndices: [1, 3, 4, 5],
        result: '4',
        states: { longestSequence: '[1, 2, 3, 4]', maxLength: 4 },
        codeSnippet: 'return max_length  # 4',
        impact: 'Time: O(N) | Space: O(N)'
      }
    ]
  },

  '04_Arrays_Part_IV/04-largest-subarray-with-k-sum': {
    type: 'array',
    steps: [
      {
        title: 'Initialize Prefix Sum & Hash Map: Process i=0 (arr[0] = 10)',
        whatHappens:
          'Input array: [10, 5, 2, 7, 1, 9], k = 15. Initialize prefix_sum = 0, max_length = 0, sum_map = {}. At i=0 (arr[0]=10): prefix_sum = 10. Check if prefix_sum == k (10 == 15 False). Check prefix_sum - k = 10 - 15 = -5 in sum_map (False). Record sum_map[10] = 0.',
        whyRationale:
          'If prefix_sum[j] - prefix_sum[i] = k, then the subarray arr[i+1..j] has sum k. Storing the earliest index of each prefix sum maximizes the resulting subarray length j - i.',
        arrayState: [10, 5, 2, 7, 1, 9],
        pointers: [
          { idx: 0, label: 'i=0 (prefix 10)', color: '#3b82f6' }
        ],
        highlightIndices: [0],
        states: {
          i: 0,
          'arr[0]': 10,
          prefix_sum: 10,
          'prefix - k': -5,
          sum_map: '{ 10: 0 }',
          max_length: 0
        },
        codeSnippet:
          'prefix_sum += arr[i]  # 10\nif prefix_sum not in sum_map:\n    sum_map[prefix_sum] = i  # sum_map = {10: 0}',
        impact: 'Time: O(N) | Space: O(N)'
      },
      {
        title: 'Process i=1 (arr[1] = 5): prefix_sum = 15 == k -> max_length = 2',
        whatHappens:
          'At i=1 (arr[1]=5): prefix_sum = 10 + 5 = 15. Since prefix_sum == k (15 == 15), the subarray from start [10, 5] sums to 15. Update max_length = i + 1 = 2. Store sum_map[15] = 1.',
        whyRationale:
          'When the running prefix sum equals k directly, the valid subarray extends from the very beginning of the array (index 0) to current index i.',
        arrayState: [10, 5, 2, 7, 1, 9],
        pointers: [
          { idx: 1, label: 'i=1 (prefix 15)', color: '#eab308' }
        ],
        highlightRange: [0, 1],
        states: {
          i: 1,
          'arr[1]': 5,
          prefix_sum: 15,
          'prefix == k': true,
          max_length: 2,
          sum_map: '{ 10: 0, 15: 1 }'
        },
        codeSnippet:
          'if prefix_sum == k:\n    max_length = i + 1  # 2',
        impact: 'Time: O(N) | Space: O(N)'
      },
      {
        title: 'Process i=2 & i=3: Accumulate prefix_sum = 17 and 24',
        whatHappens:
          'At i=2 (arr[2]=2): prefix_sum = 17. 17 - 15 = 2 not in map -> store sum_map[17] = 2. At i=3 (arr[3]=7): prefix_sum = 24. 24 - 15 = 9 not in map -> store sum_map[24] = 3.',
        whyRationale:
          'Only first occurrences of prefix sums are recorded so that future matching subarrays span back as far as possible.',
        arrayState: [10, 5, 2, 7, 1, 9],
        pointers: [
          { idx: 3, label: 'i=3 (prefix 24)', color: '#3b82f6' }
        ],
        highlightRange: [0, 3],
        states: {
          i: 3,
          'arr[3]': 7,
          prefix_sum: 24,
          sum_map: '{ 10: 0, 15: 1, 17: 2, 24: 3 }',
          max_length: 2
        },
        codeSnippet:
          'if prefix_sum not in sum_map:\n    sum_map[prefix_sum] = i',
        impact: 'Time: O(N) | Space: O(N)'
      },
      {
        title: 'Process i=4 (arr[4] = 1): prefix = 25 -> Found Subarray [5, 2, 7, 1] (Len = 4)!',
        whatHappens:
          'At i=4 (arr[4]=1): prefix_sum = 24 + 1 = 25. Check prefix_sum - k = 25 - 15 = 10. 10 exists in sum_map at index 0! Subarray is arr[1..4] = [5, 2, 7, 1]. Length = 4 - 0 = 4. Update max_length = max(2, 4) = 4.',
        whyRationale:
          'Since prefix[4] - prefix[0] = 25 - 10 = 15, the slice between index 1 and 4 sums exactly to k=15.',
        arrayState: [10, 5, 2, 7, 1, 9],
        pointers: [
          { idx: 0, label: 'sum_map[10]=0', color: '#22c55e' },
          { idx: 4, label: 'i=4 (prefix 25)', color: '#22c55e' }
        ],
        highlightRange: [1, 4],
        result: '4',
        states: {
          i: 4,
          prefix_sum: 25,
          'prefix - k': 10,
          earliestIndex: 0,
          subarray: '[5, 2, 7, 1]',
          length: 4,
          max_length: 4
        },
        codeSnippet:
          'if prefix_sum - k in sum_map:\n    max_length = max(max_length, i - sum_map[prefix_sum - k])  # 4 - 0 = 4',
        impact: 'Time: O(N) | Space: O(N)'
      },
      {
        title: 'Process i=5 & Return Final Max Length = 4',
        whatHappens:
          'At i=5 (arr[5]=9): prefix_sum = 34. 34 - 15 = 19 not in map. Loop completes. Return max_length = 4.',
        whyRationale:
          'Optimal single-pass prefix sum + hash map approach resolves the problem in O(N) time and O(N) space.',
        arrayState: [10, 5, 2, 7, 1, 9],
        pointers: [
          { idx: 1, label: 'Start (1)', color: '#22c55e' },
          { idx: 4, label: 'End (4)', color: '#22c55e' }
        ],
        highlightRange: [1, 4],
        result: '4',
        states: { longestSubarray: '[5, 2, 7, 1]', sum: 15, max_length: 4 },
        codeSnippet: 'return max_length  # 4',
        impact: 'Time: O(N) | Space: O(N)'
      }
    ]
  },

  '04_Arrays_Part_IV/05-count-subarrays-with-given-xor-k': {
    type: 'array',
    steps: [
      {
        title: 'Initialize Prefix XOR & Map with Base Frequency {0: 1}',
        whatHappens:
          'Input: arr = [4, 2, 2, 6, 4], k = 6. Initialize prefix_xor = 0, count = 0, xor_map = {0: 1}. At i=0 (num=4): prefix_xor = 0 ^ 4 = 4. Check prefix_xor ^ k = 4 ^ 6 = 2 in xor_map (False). Add xor_map[4] = 1.',
        whyRationale:
          'If prefix_xor[j] ^ prefix_xor[i] = k, then the subarray arr[i+1..j] has XOR equal to k. Base frequency {0: 1} handles valid subarrays starting from index 0.',
        arrayState: [4, 2, 2, 6, 4],
        pointers: [
          { idx: 0, label: 'i=0 (prefix 4)', color: '#3b82f6' }
        ],
        highlightIndices: [0],
        states: {
          i: 0,
          num: 4,
          prefix_xor: 4,
          'prefix ^ k': 2,
          xor_map: '{ 0: 1, 4: 1 }',
          totalCount: 0
        },
        codeSnippet:
          'xor_map = {0: 1}\nprefix_xor ^= num  # 4\nif prefix_xor ^ k in xor_map:\n    count += xor_map[prefix_xor ^ k]',
        impact: 'Time: O(N) | Space: O(N)'
      },
      {
        title: 'Process i=1 (num = 2): prefix_xor = 6 -> Found Subarray [4, 2] (Count = 1)',
        whatHappens:
          'At i=1 (num=2): prefix_xor = 4 ^ 2 = 6. Check prefix_xor ^ k = 6 ^ 6 = 0 in xor_map (Found frequency 1). Subarray [4, 2] has XOR 6! Update count = 0 + 1 = 1. Update xor_map[6] = 1.',
        whyRationale:
          'Since prefix_xor ^ k = 0, the full prefix from index 0 to 1 XORs directly to k=6.',
        arrayState: [4, 2, 2, 6, 4],
        pointers: [
          { idx: 1, label: 'i=1 (prefix 6)', color: '#22c55e' }
        ],
        highlightRange: [0, 1],
        states: {
          i: 1,
          num: 2,
          prefix_xor: 6,
          'prefix ^ k': 0,
          foundSubarray: '[4, 2]',
          added: 1,
          totalCount: 1,
          xor_map: '{ 0: 1, 4: 1, 6: 1 }'
        },
        codeSnippet:
          'prefix_xor ^= num  # 6\nif prefix_xor ^ k in xor_map:  # 6 ^ 6 = 0 (in map)\n    count += xor_map[0]  # count = 1',
        impact: 'Time: O(N) | Space: O(N)'
      },
      {
        title: 'Process i=2 (num = 2): prefix_xor = 4 -> Frequency of 4 Becomes 2',
        whatHappens:
          'At i=2 (num=2): prefix_xor = 6 ^ 2 = 4. Check 4 ^ 6 = 2 (not in map). Increment frequency: xor_map[4] becomes 2.',
        whyRationale:
          'Multiple prefix points can share the same prefix XOR value, meaning subsequent matches will form multiple valid subarrays simultaneously.',
        arrayState: [4, 2, 2, 6, 4],
        pointers: [
          { idx: 2, label: 'i=2 (prefix 4)', color: '#3b82f6' }
        ],
        highlightIndices: [2],
        states: {
          i: 2,
          num: 2,
          prefix_xor: 4,
          'xor_map[4]': 2,
          totalCount: 1
        },
        codeSnippet:
          'xor_map[prefix_xor] = xor_map.get(prefix_xor, 0) + 1  # xor_map[4] = 2',
        impact: 'Time: O(N) | Space: O(N)'
      },
      {
        title: 'Process i=3 (num = 6): prefix = 2 -> Target 2^6=4 has Count 2! (Count = 3)',
        whatHappens:
          'At i=3 (num=6): prefix_xor = 4 ^ 6 = 2. Check 2 ^ 6 = 4 in xor_map. 4 exists with frequency 2! Subarrays [2, 2, 6] (indices 1..3) and [6] (index 3..3) both have XOR 6! Update count = 1 + 2 = 3. Update xor_map[2] = 1.',
        whyRationale:
          'Because two previous prefixes had XOR value 4, both prefix split points yield a valid subarray ending at index 3 with XOR 6.',
        arrayState: [4, 2, 2, 6, 4],
        pointers: [
          { idx: 3, label: 'i=3 (prefix 2)', color: '#22c55e' }
        ],
        highlightRange: [1, 3],
        states: {
          i: 3,
          num: 6,
          prefix_xor: 2,
          'prefix ^ k': 4,
          subarraysFound: '[2, 2, 6], [6]',
          added: 2,
          totalCount: 3
        },
        codeSnippet:
          'if prefix_xor ^ k in xor_map:  # 2 ^ 6 = 4 (count 2)\n    count += xor_map[4]  # count = 1 + 2 = 3',
        impact: 'Time: O(N) | Space: O(N)'
      },
      {
        title: 'Process i=4 (num = 4): prefix = 6 -> Target 6^6=0 Found (Final Count = 4)',
        whatHappens:
          'At i=4 (num=4): prefix_xor = 2 ^ 4 = 6. Check 6 ^ 6 = 0 (frequency 1). Subarray [4, 2, 2, 6, 4] has XOR 6! Update count = 3 + 1 = 4. Return total count = 4.',
        whyRationale:
          'All 4 matching subarrays ([4, 2], [2, 2, 6], [6], [4, 2, 2, 6, 4]) counted in a single linear O(N) scan.',
        arrayState: [4, 2, 2, 6, 4],
        pointers: [
          { idx: 4, label: 'i=4 (prefix 6)', color: '#22c55e' }
        ],
        highlightRange: [0, 4],
        result: '4',
        states: {
          i: 4,
          num: 4,
          prefix_xor: 6,
          allSubarraysCount: 4,
          subarrays: '[4, 2], [2, 2, 6], [6], [4, 2, 2, 6, 4]'
        },
        codeSnippet: 'return count  # 4',
        impact: 'Time: O(N) | Space: O(N)'
      }
    ]
  },

  '04_Arrays_Part_IV/06-longest-substring-without-repeating-characters': {
    type: 'string',
    steps: [
      {
        title: 'Initialize Sliding Window: left = 0, right = 0 (char "a")',
        whatHappens:
          'Input string: "abcabcbb". Initialize char_set = set(), left = 0, max_length = 0. At right = 0 (\'a\'): \'a\' is not in set. Add \'a\' to set. Window is ["a"], length = 1. Update max_length = 1.',
        whyRationale:
          'The sliding window maintains a contiguous subarray of characters with the invariant that every character in the current window is distinct.',
        chars: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
        pointers: [
          { idx: 0, label: 'L, R', color: '#3b82f6' }
        ],
        window: [0, 0],
        states: {
          left: 0,
          right: 0,
          char_set: '{"a"}',
          window: '"a"',
          max_length: 1
        },
        codeSnippet:
          'char_set = set()\nleft = 0\nfor right in range(len(s)):\n    char_set.add(s[right])  # {"a"}\n    max_length = max(max_length, right - left + 1)  # 1',
        impact: 'Time: O(N) | Space: O(min(N, M))'
      },
      {
        title: 'Expand Window to right = 2: Window = "abc" (max_length = 3)',
        whatHappens:
          'At right = 1 (\'b\'): Add \'b\' -> window "ab", len = 2. At right = 2 (\'c\'): Add \'c\' -> window "abc", len = 3. char_set = {\'a\', \'b\', \'c\'}. Update max_length = 3.',
        whyRationale:
          'As long as newly encountered characters are not in the set, the window expands rightwards.',
        chars: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
        pointers: [
          { idx: 0, label: 'L=0', color: '#3b82f6' },
          { idx: 2, label: 'R=2', color: '#22c55e' }
        ],
        window: [0, 2],
        states: {
          left: 0,
          right: 2,
          char_set: '{"a", "b", "c"}',
          window: '"abc"',
          max_length: 3
        },
        codeSnippet:
          'char_set.add(s[right])  # {"a", "b", "c"}\nmax_length = max(max_length, right - left + 1)  # 3',
        impact: 'Time: O(N) | Space: O(min(N, M))'
      },
      {
        title: 'Duplicate "a" at right = 3: Shrink Window from Left',
        whatHappens:
          'At right = 3 (\'a\'): \'a\' is already in char_set! Evict s[left]=\'a\' from char_set and increment left to 1. Now insert new \'a\'. Window becomes "bca" (length 3).',
        whyRationale:
          'When a repeating character is encountered, shrinking the left boundary until the previous occurrence is removed restores the unique character invariant.',
        chars: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
        pointers: [
          { idx: 1, label: 'L=1 (moved)', color: '#ef4444' },
          { idx: 3, label: 'R=3', color: '#eab308' }
        ],
        window: [1, 3],
        states: {
          left: 1,
          right: 3,
          duplicateChar: 'a',
          char_set: '{"b", "c", "a"}',
          window: '"bca"',
          max_length: 3
        },
        codeSnippet:
          'while s[right] in char_set:\n    char_set.remove(s[left])\n    left += 1\nchar_set.add(s[right])',
        impact: 'Time: O(N) | Space: O(min(N, M))'
      },
      {
        title: 'Slide Window Across Indices 4 & 5: Windows "cab" and "abc"',
        whatHappens:
          'At right = 4 (\'b\'): evict old \'b\' at left=1, left becomes 2 -> window "cab" (len 3). At right = 5 (\'c\'): evict old \'c\' at left=2, left becomes 3 -> window "abc" (len 3). Maximum length remains 3.',
        whyRationale:
          'The sliding window moves smoothly across recurring periods, sustaining maximum valid substring span.',
        chars: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
        pointers: [
          { idx: 3, label: 'L=3', color: '#3b82f6' },
          { idx: 5, label: 'R=5', color: '#22c55e' }
        ],
        window: [3, 5],
        states: {
          left: 3,
          right: 5,
          char_set: '{"a", "b", "c"}',
          window: '"abc"',
          max_length: 3
        },
        codeSnippet:
          'max_length = max(max_length, right - left + 1)  # max remains 3',
        impact: 'Time: O(N) | Space: O(min(N, M))'
      },
      {
        title: 'Process Trailing "bb" & Return Final Answer = 3',
        whatHappens:
          'At right = 6 & 7 (\'b\'): repeating \'b\' causes left pointer to advance to index 7. Final window is "b" (length 1). Return max_length = 3 ("abc").',
        whyRationale:
          'Each character is processed at most twice (once added by right, once removed by left), guaranteeing an optimal O(N) runtime.',
        chars: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
        pointers: [
          { idx: 7, label: 'L, R (7)', color: '#22c55e' }
        ],
        window: [7, 7],
        result: '3',
        states: {
          longestSubstring: '"abc"',
          max_length: 3
        },
        codeSnippet: 'return max_length  # 3',
        impact: 'Time: O(N) | Space: O(min(N, M))'
      }
    ]
  }
};

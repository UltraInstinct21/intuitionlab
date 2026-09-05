import { ProblemVisualization } from '../../types/visualization';

export const topic01Visualizations: Record<string, ProblemVisualization> = {
  '01_Arrays/01-set-matrix-zeroes': {
    type: 'matrix',
    steps: [
      {
        title: 'Inspect Matrix and Flag First Row & Column',
        whatHappens: 'Check whether the 0th row and 0th column originally contain any zeros before using them as marker storage.',
        whyRationale: 'Since the first row and column will store zero-markers for inner cells, we must record their initial zero state separately so we do not corrupt them.',
        codeSnippet: 'first_row_zero = any(matrix[0][j] == 0 for j in range(n))\nfirst_col_zero = any(matrix[i][0] == 0 for i in range(m))',
        grid: [
          [1, 1, 1],
          [1, 0, 1],
          [1, 1, 1]
        ],
        activeCell: [0, 0],
        highlightCells: [[0, 0], [0, 1], [0, 2], [1, 0], [2, 0]],
        states: {
          first_row_zero: false,
          first_col_zero: false,
          m: 3,
          n: 3
        },
        impact: 'Time: O(M + N) | Space: O(1)'
      },
      {
        title: 'Record Zero Markers in First Row & Column',
        whatHappens: 'Scan inner cells (1..m-1, 1..n-1). At matrix[1][1] == 0, mark row header matrix[1][0] = 0 and column header matrix[0][1] = 0.',
        whyRationale: 'Using the matrix itself as auxiliary space eliminates O(M+N) extra space, achieving true O(1) in-place marking.',
        codeSnippet: 'for i in range(1, m):\n    for j in range(1, n):\n        if matrix[i][j] == 0:\n            matrix[i][0] = 0\n            matrix[0][j] = 0',
        grid: [
          [1, 0, 1],
          [0, 0, 1],
          [1, 1, 1]
        ],
        activeCell: [1, 1],
        highlightCells: [[1, 0], [0, 1]],
        states: {
          i: 1,
          j: 1,
          'matrix[1][0]': 0,
          'matrix[0][1]': 0
        },
        impact: 'Time: O(M × N) | Space: O(1)'
      },
      {
        title: 'Apply Zeroes to Inner Subgrid Based on Markers',
        whatHappens: 'Iterate through all inner cells (1..m-1, 1..n-1). If matrix[i][0] == 0 or matrix[0][j] == 0, set matrix[i][j] = 0.',
        whyRationale: 'Any inner cell whose row marker or column marker is 0 belongs to a row or column that had an original zero.',
        codeSnippet: 'for i in range(1, m):\n    for j in range(1, n):\n        if matrix[i][0] == 0 or matrix[0][j] == 0:\n            matrix[i][j] = 0',
        grid: [
          [1, 0, 1],
          [0, 0, 0],
          [1, 0, 1]
        ],
        activeCell: [1, 2],
        highlightCells: [[1, 1], [1, 2], [2, 1]],
        states: {
          'matrix[1][2]': 0,
          'matrix[2][1]': 0,
          'matrix[2][2]': 1
        },
        impact: 'Time: O(M × N) | Space: O(1)'
      },
      {
        title: 'Finalize First Row & Column Using Flags',
        whatHappens: 'Check first_row_zero and first_col_zero. Since both are false, original row 0 and column 0 are kept intact.',
        whyRationale: 'Processing the boundary markers last ensures that marker reads for inner cells were completed before boundaries get overwritten.',
        codeSnippet: 'if first_row_zero:\n    for j in range(n): matrix[0][j] = 0\nif first_col_zero:\n    for i in range(m): matrix[i][0] = 0',
        grid: [
          [1, 0, 1],
          [0, 0, 0],
          [1, 0, 1]
        ],
        highlightCells: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
        states: {
          first_row_zero: false,
          first_col_zero: false,
          completed: true
        },
        impact: 'Time: O(M + N) | Space: O(1)'
      }
    ]
  },

  '01_Arrays/02-pascals-triangle': {
    type: 'array',
    steps: [
      {
        title: 'Initialize Row 1',
        whatHappens: 'Initialize triangle with base row [1] at index 0.',
        whyRationale: 'The base case for Pascal Triangle has 1 row containing single integer 1.',
        codeSnippet: 'result = [[1]]',
        arrayState: [1],
        pointers: [{ idx: 0, label: 'r0', color: '#6366f1' }],
        result: '[[1]]',
        states: {
          row: 0,
          current_row: '[1]'
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Generate Row 2',
        whatHappens: 'Build second row [1, 1] with boundary ones.',
        whyRationale: 'Every row starts and ends with 1. With length 2, only boundary ones exist.',
        codeSnippet: 'row = [1]\n# no intermediate elements\nrow.append(1)\nresult.append(row)',
        arrayState: [1, 1],
        pointers: [
          { idx: 0, label: 'start', color: '#0ea5e9' },
          { idx: 1, label: 'end', color: '#0ea5e9' }
        ],
        result: '[[1], [1, 1]]',
        states: {
          row: 1,
          prev_row: '[1]',
          current_row: '[1, 1]'
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Generate Row 3 by Adding Adjacent Elements',
        whatHappens: 'Compute row 3: head 1, intermediate prev[0] + prev[1] = 1 + 1 = 2, and tail 1 -> [1, 2, 1].',
        whyRationale: 'Each interior element at index j is the sum of elements at j-1 and j from the previous row.',
        codeSnippet: 'for j in range(1, i):\n    row.append(prev[j-1] + prev[j])',
        arrayState: [1, 2, 1],
        pointers: [{ idx: 1, label: '1 + 1 = 2', color: '#22c55e' }],
        highlightIndices: [1],
        result: '[[1], [1, 1], [1, 2, 1]]',
        states: {
          row: 2,
          'prev[0]+prev[1]': '1 + 1 = 2',
          current_row: '[1, 2, 1]'
        },
        impact: 'Time: O(row_length) | Space: O(1)'
      },
      {
        title: 'Generate Row 4',
        whatHappens: 'Compute row 4: [1, 1+2=3, 2+1=3, 1] -> [1, 3, 3, 1].',
        whyRationale: 'Interior additions: 1+2=3 at index 1, 2+1=3 at index 2.',
        codeSnippet: 'for j in range(1, i):\n    row.append(prev[j-1] + prev[j])',
        arrayState: [1, 3, 3, 1],
        pointers: [
          { idx: 1, label: '1+2=3', color: '#22c55e' },
          { idx: 2, label: '2+1=3', color: '#22c55e' }
        ],
        highlightIndices: [1, 2],
        result: '[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]]',
        states: {
          row: 3,
          current_row: '[1, 3, 3, 1]'
        },
        impact: 'Time: O(row_length) | Space: O(1)'
      },
      {
        title: 'Generate Row 5 & Complete Triangle',
        whatHappens: 'Compute row 5: [1, 1+3=4, 3+3=6, 3+1=4, 1] -> [1, 4, 6, 4, 1].',
        whyRationale: 'All 5 rows successfully constructed satisfying Pascal recurrence relation.',
        codeSnippet: 'result.append(row)\nreturn result',
        arrayState: [1, 4, 6, 4, 1],
        pointers: [
          { idx: 0, label: '1', color: '#6366f1' },
          { idx: 2, label: '6', color: '#f59e0b' },
          { idx: 4, label: '1', color: '#6366f1' }
        ],
        highlightIndices: [1, 2, 3],
        result: '[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]',
        states: {
          numRows: 5,
          total_rows_generated: 5
        },
        impact: 'Time: O(N²) | Space: O(N²) output'
      }
    ]
  },

  '01_Arrays/03-next-permutation': {
    type: 'array',
    steps: [
      {
        title: 'Scan from Right to Find Pivot Index',
        whatHappens: 'Scan backwards from index n-2 to find the first index i where nums[i] < nums[i+1]. At i=1, nums[1]=3 < nums[2]=5.',
        whyRationale: 'The suffix to the right of index i is in descending order (maximum permutation). To get the next lexicographical permutation, we must increase nums[i].',
        codeSnippet: 'i = n - 2\nwhile i >= 0 and nums[i] >= nums[i + 1]:\n    i -= 1',
        arrayState: [1, 3, 5, 4, 2],
        pointers: [
          { idx: 1, label: 'pivot (i=1)', color: '#ef4444' },
          { idx: 2, label: 'i+1 (5)', color: '#3b82f6' }
        ],
        highlightRange: [2, 4],
        states: {
          i: 1,
          'nums[i]': 3,
          'nums[i+1]': 5,
          descending_suffix: '[5, 4, 2]'
        },
        impact: 'Time: O(N) | Space: O(1)'
      },
      {
        title: 'Find Rightmost Successor Greater than Pivot',
        whatHappens: 'Scan backwards from n-1 to find the smallest number greater than nums[i] (3). At j=3, nums[3]=4 > 3.',
        whyRationale: 'We need the next larger value to swap with pivot so the increase is as small as possible.',
        codeSnippet: 'if i >= 0:\n    j = n - 1\n    while nums[j] <= nums[i]:\n        j -= 1',
        arrayState: [1, 3, 5, 4, 2],
        pointers: [
          { idx: 1, label: 'pivot: 3', color: '#ef4444' },
          { idx: 3, label: 'successor (j=3): 4', color: '#22c55e' }
        ],
        highlightIndices: [1, 3],
        states: {
          i: 1,
          j: 3,
          'nums[i]': 3,
          'nums[j]': 4
        },
        impact: 'Time: O(N) | Space: O(1)'
      },
      {
        title: 'Swap Pivot with Successor',
        whatHappens: 'Swap nums[1] (3) and nums[3] (4). The array becomes [1, 4, 5, 3, 2].',
        whyRationale: 'Placing the next larger element at pivot position creates a prefix strictly greater than the original.',
        codeSnippet: 'nums[i], nums[j] = nums[j], nums[i]',
        arrayState: [1, 4, 5, 3, 2],
        pointers: [
          { idx: 1, label: 'swapped: 4', color: '#22c55e' },
          { idx: 3, label: 'swapped: 3', color: '#ef4444' }
        ],
        highlightIndices: [1, 3],
        states: {
          swapped_pair: 'nums[1] <-> nums[3]',
          array_state: '[1, 4, 5, 3, 2]'
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Reverse Suffix to Minimum Ascending Order',
        whatHappens: 'Reverse the subarray from index i+1 (2) to n-1 (4). [5, 3, 2] becomes [2, 3, 5].',
        whyRationale: 'Since the suffix was descending, reversing it makes it ascending, producing the smallest possible lexicographical arrangement for the suffix.',
        codeSnippet: 'nums[i + 1:] = nums[i + 1:][::-1]',
        arrayState: [1, 4, 2, 3, 5],
        pointers: [
          { idx: 2, label: 'L', color: '#8b5cf6' },
          { idx: 4, label: 'R', color: '#8b5cf6' }
        ],
        highlightRange: [2, 4],
        result: '[1, 4, 2, 3, 5]',
        states: {
          reversed_range: '[2..4]',
          final_permutation: '[1, 4, 2, 3, 5]'
        },
        impact: 'Time: O(N) | Space: O(1)'
      }
    ]
  },

  '01_Arrays/04-kadanes-algorithm': {
    type: 'array',
    steps: [
      {
        title: 'Initialize Kadane State at Index 0',
        whatHappens: 'Set current_sum = -2 and max_sum = -2 with nums[0].',
        whyRationale: 'Kadanes algorithm maintains running maximum subarray sum ending at current index and global maximum.',
        codeSnippet: 'max_sum = nums[0]\ncurrent_sum = nums[0]',
        arrayState: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
        pointers: [{ idx: 0, label: 'curr = -2', color: '#ef4444' }],
        highlightIndices: [0],
        states: {
          i: 0,
          'nums[0]': -2,
          current_sum: -2,
          max_sum: -2
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Discard Negative Prefix and Start Fresh at Index 1',
        whatHappens: 'At index 1 (nums[1]=1), current_sum = max(1, -2 + 1) = 1. Update max_sum = 1.',
        whyRationale: 'A negative accumulated sum diminishes any future subarray, so starting a fresh subarray at nums[1] is strictly better.',
        codeSnippet: 'current_sum = max(nums[i], current_sum + nums[i])\nmax_sum = max(max_sum, current_sum)',
        arrayState: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
        pointers: [{ idx: 1, label: 'curr = 1', color: '#22c55e' }],
        highlightIndices: [1],
        states: {
          i: 1,
          'nums[1]': 1,
          current_sum: 1,
          max_sum: 1
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Absorb Index 2, Restart at Index 3',
        whatHappens: 'At index 2 (val -3, sum -2). At index 3 (nums[3]=4), current_sum = max(4, -2 + 4) = 4. Update max_sum = 4.',
        whyRationale: 'Previous running sum (-2) dragged down the total, so reset running sum to 4 at index 3.',
        codeSnippet: 'current_sum = max(nums[i], current_sum + nums[i])\nmax_sum = max(max_sum, current_sum)',
        arrayState: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
        pointers: [{ idx: 3, label: 'restart curr = 4', color: '#0ea5e9' }],
        highlightIndices: [3],
        states: {
          i: 3,
          'nums[3]': 4,
          current_sum: 4,
          max_sum: 4
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Accumulate Global Maximum Subarray [4, -1, 2, 1]',
        whatHappens: 'Traverse i=4 (-1, sum=3), i=5 (2, sum=5), i=6 (1, sum=6). max_sum reaches 6.',
        whyRationale: 'Contiguous elements [4, -1, 2, 1] yield the optimal contiguous sum of 6.',
        codeSnippet: 'current_sum = max(nums[i], current_sum + nums[i])\nmax_sum = max(max_sum, current_sum)',
        arrayState: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
        pointers: [
          { idx: 3, label: 'sub_start', color: '#22c55e' },
          { idx: 6, label: 'curr_sum = 6', color: '#22c55e' }
        ],
        highlightRange: [3, 6],
        result: 'Max Sum = 6',
        states: {
          i: 6,
          'nums[6]': 1,
          current_sum: 6,
          max_sum: 6,
          optimal_subarray: '[4, -1, 2, 1]'
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Finish Iteration & Return Maximum Sum',
        whatHappens: 'Process remaining elements i=7 (-5, sum=1) and i=8 (4, sum=5). Global max_sum remains 6.',
        whyRationale: 'No subsequent contiguous window surpasses 6. Kadanes completes in single linear pass.',
        codeSnippet: 'return max_sum',
        arrayState: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
        pointers: [{ idx: 8, label: 'end', color: '#64748b' }],
        highlightRange: [3, 6],
        result: '6',
        states: {
          max_subarray_sum: 6,
          best_range: 'indices [3..6]'
        },
        impact: 'Time: O(N) | Space: O(1)'
      }
    ]
  },

  '01_Arrays/05-sort-colors': {
    type: 'array',
    steps: [
      {
        title: 'Initialize Dutch National Flag 3 Pointers',
        whatHappens: 'Set low = 0, mid = 0, high = 5 (n-1). Array is [2, 0, 2, 1, 1, 0].',
        whyRationale: 'Maintains 3 partitions: [0..low-1] for 0s, [low..mid-1] for 1s, [high+1..n-1] for 2s.',
        codeSnippet: 'low, mid, high = 0, 0, len(nums) - 1',
        arrayState: [2, 0, 2, 1, 1, 0],
        pointers: [
          { idx: 0, label: 'low, mid', color: '#3b82f6' },
          { idx: 5, label: 'high', color: '#ef4444' }
        ],
        states: {
          low: 0,
          mid: 0,
          high: 5,
          'nums[mid]': 2
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'nums[mid] == 2: Swap with High & Decrement High',
        whatHappens: 'Swap nums[mid=0] (2) with nums[high=5] (0). Decrement high to 4. Do not increment mid.',
        whyRationale: 'The element swapped from high is unexamined, so mid must stay in place to evaluate it next.',
        codeSnippet: 'if nums[mid] == 2:\n    nums[mid], nums[high] = nums[high], nums[mid]\n    high -= 1',
        arrayState: [0, 0, 2, 1, 1, 2],
        pointers: [
          { idx: 0, label: 'low, mid', color: '#3b82f6' },
          { idx: 4, label: 'high', color: '#ef4444' }
        ],
        highlightIndices: [0, 5],
        states: {
          low: 0,
          mid: 0,
          high: 4,
          swapped: 'nums[0] <-> nums[5]'
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'nums[mid] == 0: Swap with Low & Increment Both',
        whatHappens: 'Swap nums[mid=0] (0) with nums[low=0] (0). Increment low to 1 and mid to 1.',
        whyRationale: '0 belongs in the left partition. Advancing low extends the 0s region, and advancing mid moves past the sorted 0.',
        codeSnippet: 'if nums[mid] == 0:\n    nums[low], nums[mid] = nums[mid], nums[low]\n    low += 1\n    mid += 1',
        arrayState: [0, 0, 2, 1, 1, 2],
        pointers: [
          { idx: 1, label: 'low, mid', color: '#3b82f6' },
          { idx: 4, label: 'high', color: '#ef4444' }
        ],
        highlightIndices: [0],
        states: {
          low: 1,
          mid: 1,
          high: 4
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'nums[mid] == 0: Self-Swap at Mid 1',
        whatHappens: 'At mid=1 (0), swap nums[low=1] with itself. Increment low to 2 and mid to 2.',
        whyRationale: 'The 0 is already at the low boundary, so the self-swap just extends the 0s region and advances mid.',
        codeSnippet: 'if nums[mid] == 0:\n    nums[low], nums[mid] = nums[mid], nums[low]\n    low += 1\n    mid += 1',
        arrayState: [0, 0, 2, 1, 1, 2],
        pointers: [
          { idx: 2, label: 'low, mid', color: '#3b82f6' },
          { idx: 4, label: 'high', color: '#ef4444' }
        ],
        highlightIndices: [1],
        states: {
          low: 2,
          mid: 2,
          high: 4,
          swapped: 'nums[1] <-> nums[1]'
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'nums[mid] == 2: Swap with High at Mid 2',
        whatHappens: 'At mid=2 (2), swap nums[mid=2] with nums[high=4] (1). Decrement high to 3. Do not increment mid.',
        whyRationale: 'The element swapped from high is unexamined, so mid stays to evaluate the new 1 next.',
        codeSnippet: 'if nums[mid] == 2:\n    nums[mid], nums[high] = nums[high], nums[mid]\n    high -= 1',
        arrayState: [0, 0, 1, 1, 2, 2],
        pointers: [
          { idx: 2, label: 'low, mid', color: '#3b82f6' },
          { idx: 3, label: 'high', color: '#ef4444' }
        ],
        highlightIndices: [2, 4],
        states: {
          low: 2,
          mid: 2,
          high: 3,
          swapped: 'nums[2] <-> nums[4]'
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Skip 1s and Finish Sorting',
        whatHappens: 'At mid=2 (1) -> mid=3. At mid=3 (1) -> mid=4. Since mid > high, partitioning is complete.',
        whyRationale: 'When nums[mid] == 1, it is already in the correct middle partition, so just increment mid.',
        codeSnippet: 'elif nums[mid] == 1:\n    mid += 1',
        arrayState: [0, 0, 1, 1, 2, 2],
        pointers: [
          { idx: 1, label: '0s end', color: '#22c55e' },
          { idx: 3, label: '1s end', color: '#3b82f6' },
          { idx: 5, label: '2s end', color: '#ef4444' }
        ],
        highlightRange: [0, 5],
        result: '[0, 0, 1, 1, 2, 2]',
        states: {
          low: 2,
          mid: 4,
          high: 3,
          is_sorted: true
        },
        impact: 'Time: O(N) | Space: O(1)'
      }
    ]
  },

  '01_Arrays/06-stock-buy-and-sell': {
    type: 'array',
    steps: [
      {
        title: 'Initialize Min Price and Max Profit',
        whatHappens: 'Set min_price = 7 (prices[0]) and max_profit = 0.',
        whyRationale: 'To maximize profit, we must track the lowest buy price seen before each prospective sell day.',
        codeSnippet: 'min_price = prices[0]\nmax_profit = 0',
        arrayState: [7, 1, 5, 3, 6, 4],
        pointers: [{ idx: 0, label: 'min_price = 7', color: '#3b82f6' }],
        highlightIndices: [0],
        states: {
          day: 1,
          price: 7,
          min_price: 7,
          max_profit: 0
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Day 2: Encounter New Lowest Price (1)',
        whatHappens: 'At price = 1, since 1 < min_price (7), update min_price = 1. Profit = 0.',
        whyRationale: 'Buying at price 1 will yield higher future profits than buying at price 7.',
        codeSnippet: 'min_price = min(min_price, price)\nmax_profit = max(max_profit, price - min_price)',
        arrayState: [7, 1, 5, 3, 6, 4],
        pointers: [{ idx: 1, label: 'new min = 1', color: '#22c55e' }],
        highlightIndices: [1],
        states: {
          day: 2,
          price: 1,
          min_price: 1,
          profit_today: 0,
          max_profit: 0
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Day 3: Potential Profit of 4',
        whatHappens: 'At price = 5, profit if selling today = 5 - 1 = 4. Update max_profit = 4.',
        whyRationale: '4 is greater than previous max_profit 0, establishing our first profitable transaction.',
        codeSnippet: 'max_profit = max(max_profit, price - min_price)',
        arrayState: [7, 1, 5, 3, 6, 4],
        pointers: [
          { idx: 1, label: 'buy: 1', color: '#22c55e' },
          { idx: 2, label: 'sell: 5 (+4)', color: '#f59e0b' }
        ],
        highlightIndices: [1, 2],
        states: {
          day: 3,
          price: 5,
          min_price: 1,
          profit_today: 4,
          max_profit: 4
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Day 4: Price Dip Holds Profit at 4',
        whatHappens: 'At price = 3, profit if selling today = 3 - 1 = 2. Since 2 < 4, max_profit stays 4.',
        whyRationale: 'A lower sell price cannot beat the best profit so far, so only min_price (1) carries forward.',
        codeSnippet: 'max_profit = max(max_profit, price - min_price)',
        arrayState: [7, 1, 5, 3, 6, 4],
        pointers: [
          { idx: 1, label: 'buy: 1', color: '#22c55e' },
          { idx: 3, label: 'sell: 3 (+2)', color: '#f59e0b' }
        ],
        highlightIndices: [1, 3],
        states: {
          day: 4,
          price: 3,
          min_price: 1,
          profit_today: 2,
          max_profit: 4
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Day 5: Peak Profit of 5 (Buy at 1, Sell at 6)',
        whatHappens: 'At price = 6, profit if selling today = 6 - 1 = 5. Update max_profit = 5.',
        whyRationale: 'Selling at price 6 against minimum buy price 1 yields the optimal single-transaction profit.',
        codeSnippet: 'max_profit = max(max_profit, price - min_price)',
        arrayState: [7, 1, 5, 3, 6, 4],
        pointers: [
          { idx: 1, label: 'buy: 1', color: '#22c55e' },
          { idx: 4, label: 'sell: 6 (+5)', color: '#ef4444' }
        ],
        highlightIndices: [1, 4],
        result: 'Max Profit = 5',
        states: {
          day: 5,
          price: 6,
          min_price: 1,
          profit_today: 5,
          max_profit: 5
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Final Day & Return Optimal Profit',
        whatHappens: 'Day 6 at price 4 yields profit 4 - 1 = 3 <= 5. Single pass finishes with max_profit = 5.',
        whyRationale: 'All future days evaluated; maximum achievable profit is 5.',
        codeSnippet: 'return max_profit',
        arrayState: [7, 1, 5, 3, 6, 4],
        pointers: [
          { idx: 1, label: 'best buy', color: '#22c55e' },
          { idx: 4, label: 'best sell', color: '#ef4444' }
        ],
        highlightIndices: [1, 4],
        result: '5',
        states: {
          best_buy_day: 2,
          best_sell_day: 5,
          max_profit: 5
        },
        impact: 'Time: O(N) | Space: O(1)'
      }
    ]
  }
};

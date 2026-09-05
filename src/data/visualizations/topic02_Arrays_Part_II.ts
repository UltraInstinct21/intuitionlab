import { ProblemVisualization } from '../../types/visualization';

export const topic02Visualizations: Record<string, ProblemVisualization> = {
  '02_Arrays_Part_II/01-rotate-image': {
    type: 'matrix',
    steps: [
      {
        title: 'Inspect Initial N × N Matrix',
        whatHappens: 'Matrix is initialized with dimensions 3x3: [[1, 2, 3], [4, 5, 6], [7, 8, 9]].',
        whyRationale: 'A 90° clockwise rotation can be achieved in-place in two clean steps: Transpose the matrix, then Reverse each row.',
        codeSnippet: 'n = len(matrix)',
        grid: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]
        ],
        activeCell: [0, 0],
        highlightCells: [[0, 0], [1, 1], [2, 2]],
        states: {
          n: 3,
          phase: 'Initial State'
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Step 1: Transpose Matrix (Swap across Diagonal)',
        whatHappens: 'Swap matrix[i][j] with matrix[j][i] for all i < j: (0,1)<->(1,0), (0,2)<->(2,0), (1,2)<->(2,1).',
        whyRationale: 'Transposition converts row vectors into column vectors, reflecting elements across the main diagonal.',
        codeSnippet: 'for i in range(n):\n    for j in range(i + 1, n):\n        matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]',
        grid: [
          [1, 4, 7],
          [2, 5, 8],
          [3, 6, 9]
        ],
        activeCell: [1, 1],
        highlightCells: [[0, 1], [1, 0], [0, 2], [2, 0], [1, 2], [2, 1]],
        states: {
          phase: 'Transposed',
          'matrix[0][1]': 4,
          'matrix[1][0]': 2,
          'matrix[0][2]': 7,
          'matrix[2][0]': 3
        },
        impact: 'Time: O(N²) | Space: O(1)'
      },
      {
        title: 'Step 2: Reverse Row 0',
        whatHappens: 'Reverse the first row [1, 4, 7] in-place to become [7, 4, 1].',
        whyRationale: 'Reversing horizontally places the columns into their correct rotated clockwise positions.',
        codeSnippet: 'matrix[0].reverse()',
        grid: [
          [7, 4, 1],
          [2, 5, 8],
          [3, 6, 9]
        ],
        highlightCells: [[0, 0], [0, 1], [0, 2]],
        states: {
          reversed_row_0: '[7, 4, 1]',
          pending_rows: 2
        },
        impact: 'Time: O(N) | Space: O(1)'
      },
      {
        title: 'Complete Rotation: Reverse All Remaining Rows',
        whatHappens: 'Reverse row 1 [2, 5, 8] -> [8, 5, 2] and row 2 [3, 6, 9] -> [9, 6, 3].',
        whyRationale: 'All rows are now flipped horizontally, completing the exact 90-degree clockwise in-place transformation.',
        codeSnippet: 'for r in range(1, n):\n    matrix[r].reverse()  # [8, 5, 2], [9, 6, 3]',
        grid: [
          [7, 4, 1],
          [8, 5, 2],
          [9, 6, 3]
        ],
        highlightCells: [[1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
        states: {
          rotation_complete: true,
          space_complexity: 'O(1) auxiliary'
        },
        impact: 'Time: O(N²) | Space: O(1)'
      }
    ]
  },

  '02_Arrays_Part_II/02-merge-intervals': {
    type: 'array',
    steps: [
      {
        title: 'Sort Intervals by Start Time & Initialize Result',
        whatHappens: 'Input intervals [[1,3], [2,6], [8,10], [15,18]] are sorted. Initialize result with first interval [1, 3].',
        whyRationale: 'Sorting ensures that any intervals that could potentially overlap are placed consecutively.',
        codeSnippet: 'intervals.sort()\nresult = []\nresult.append(intervals[0])',
        arrayState: ['[1, 3]', '[2, 6]', '[8, 10]', '[15, 18]'],
        pointers: [{ idx: 0, label: 'curr [1, 3]', color: '#3b82f6' }],
        highlightIndices: [0],
        result: '[[1, 3]]',
        states: {
          sorted: true,
          last_merged: '[1, 3]',
          merged_count: 1
        },
        impact: 'Time: O(N log N) | Space: O(N)'
      },
      {
        title: 'Detect Overlap with [2, 6] & Merge Intervals',
        whatHappens: 'Current interval [2,6] starts at 2 <= last interval end (3). Overlap found! Merge: new end = max(3, 6) = 6.',
        whyRationale: 'Since 2 is within [1, 3], both intervals fuse into single contiguous range [1, max(3, 6)] = [1, 6].',
        codeSnippet: 'if result[-1][1] >= interval[0]:\n    result[-1][1] = max(result[-1][1], interval[1])',
        arrayState: ['[1, 6]', '[2, 6]', '[8, 10]', '[15, 18]'],
        pointers: [
          { idx: 0, label: 'merged [1, 6]', color: '#22c55e' },
          { idx: 1, label: 'overlap [2, 6]', color: '#f59e0b' }
        ],
        highlightIndices: [0, 1],
        result: '[[1, 6]]',
        states: {
          overlap_detected: true,
          merged_interval: '[1, 6]',
          formula: 'max(3, 6) = 6'
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Non-Overlapping Interval [8, 10] -> Append to Result',
        whatHappens: 'Next interval [8, 10] starts at 8 > last merged end 6. No overlap. Append [8, 10] as new separate interval.',
        whyRationale: 'There is a gap between 6 and 8, so [8, 10] starts a completely separate merged group.',
        codeSnippet: 'else:\n    result.append(interval)',
        arrayState: ['[1, 6]', '[2, 6]', '[8, 10]', '[15, 18]'],
        pointers: [
          { idx: 0, label: '[1, 6]', color: '#64748b' },
          { idx: 2, label: 'append [8, 10]', color: '#3b82f6' }
        ],
        highlightIndices: [2],
        result: '[[1, 6], [8, 10]]',
        states: {
          overlap_detected: false,
          appended: '[8, 10]',
          merged_count: 2
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Process Final Interval [15, 18] & Return Merged List',
        whatHappens: 'Interval [15, 18] starts at 15 > 10. Append [15, 18]. All intervals processed.',
        whyRationale: 'Final non-overlapping interval set is [[1, 6], [8, 10], [15, 18]].',
        codeSnippet: 'return result',
        arrayState: ['[1, 6]', '[8, 10]', '[15, 18]'],
        pointers: [
          { idx: 0, label: 'int 1', color: '#22c55e' },
          { idx: 1, label: 'int 2', color: '#22c55e' },
          { idx: 2, label: 'int 3', color: '#22c55e' }
        ],
        highlightIndices: [0, 1, 2],
        result: '[[1, 6], [8, 10], [15, 18]]',
        states: {
          total_merged: 3,
          final_result: '[[1,6],[8,10],[15,18]]'
        },
        impact: 'Time: O(N) | Space: O(1) excluding output'
      }
    ]
  },

  '02_Arrays_Part_II/03-merge-two-sorted-arrays': {
    type: 'array',
    steps: [
      {
        title: 'Initialize 3 Pointers from the Back',
        whatHappens: 'Set i = 2 (m-1), j = 2 (n-1), k = 5 (m+n-1). nums1 has empty buffer at the back.',
        whyRationale: 'Merging backwards allows us to write largest elements directly into nums1 buffer without overwriting unread elements.',
        codeSnippet: 'i, j, k = m - 1, n - 1, m + n - 1',
        arrayState: [1, 2, 3, 0, 0, 0],
        pointers: [
          { idx: 2, label: 'i (3)', color: '#3b82f6' },
          { idx: 2, label: 'j (6)', color: '#a855f7' },
          { idx: 5, label: 'k (write)', color: '#ef4444' }
        ],
        states: {
          i: 2,
          'nums1[i]': 3,
          j: 2,
          'nums2[j]': 6,
          nums2: '[2, 5, 6]',
          k: 5
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Compare nums1[2]=3 with nums2[2]=6: Place 6 at nums1[5]',
        whatHappens: 'nums2[2] (6) > nums1[2] (3). Place 6 at nums1[5]. Decrement j to 1 and k to 4.',
        whyRationale: '6 is the largest overall element remaining, so it belongs at the very end of nums1.',
        codeSnippet: 'if nums1[i] > nums2[j]:\n    nums1[k] = nums1[i]; i -= 1\nelse:\n    nums1[k] = nums2[j]; j -= 1\nk -= 1',
        arrayState: [1, 2, 3, 0, 0, 6],
        pointers: [
          { idx: 2, label: 'i (3)', color: '#3b82f6' },
          { idx: 1, label: 'j (5)', color: '#a855f7' },
          { idx: 4, label: 'k (write)', color: '#ef4444' },
          { idx: 5, label: 'placed 6', color: '#22c55e' }
        ],
        highlightIndices: [5],
        states: {
          'placed_val': 6,
          i: 2,
          j: 1,
          'nums2[j]': 5,
          nums2: '[2, 5, 6]',
          k: 4
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Compare nums1[2]=3 with nums2[1]=5: Place 5 at nums1[4]',
        whatHappens: 'nums2[1] (5) > nums1[2] (3). Place 5 at nums1[4]. Decrement j to 0 and k to 3.',
        whyRationale: '5 is the next largest element and gets placed at index 4.',
        codeSnippet: 'nums1[k] = nums2[j]\nj -= 1\nk -= 1',
        arrayState: [1, 2, 3, 0, 5, 6],
        pointers: [
          { idx: 2, label: 'i (3)', color: '#3b82f6' },
          { idx: 0, label: 'j (2)', color: '#a855f7' },
          { idx: 3, label: 'k (write)', color: '#ef4444' }
        ],
        highlightIndices: [4],
        states: {
          placed_val: 5,
          i: 2,
          j: 0,
          'nums2[j]': 2,
          nums2: '[2, 5, 6]',
          k: 3
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Compare nums1[2]=3 with nums2[0]=2: Place 3 at nums1[3]',
        whatHappens: 'nums1[2] (3) > nums2[0] (2). Place 3 at nums1[3]. Decrement i to 1 and k to 2.',
        whyRationale: '3 from nums1 is larger than 2 from nums2, so nums1 element is moved back.',
        codeSnippet: 'nums1[k] = nums1[i]\ni -= 1\nk -= 1',
        arrayState: [1, 2, 3, 3, 5, 6],
        pointers: [
          { idx: 1, label: 'i (2)', color: '#3b82f6' },
          { idx: 0, label: 'j (2)', color: '#a855f7' },
          { idx: 2, label: 'k (write)', color: '#ef4444' },
          { idx: 3, label: 'placed 3', color: '#22c55e' }
        ],
        highlightIndices: [3],
        states: {
          placed_val: 3,
          i: 1,
          j: 0,
          'nums2[j]': 2,
          nums2: '[2, 5, 6]',
          k: 2
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Compare nums1[1]=2 with nums2[0]=2: Tie Takes nums2 (else Branch)',
        whatHappens: 'nums1[1] (2) is not greater than nums2[0] (2). The tie falls through to the else branch: take nums2[0].',
        whyRationale: 'With `>` as the comparison, equal values resolve to nums2, keeping the merge stable.',
        codeSnippet: 'if nums1[i] > nums2[j]:\n    nums1[k] = nums1[i]; i -= 1\nelse:  # tie 2 vs 2 -> take nums2\n    nums1[k] = nums2[j]; j -= 1\nk -= 1',
        arrayState: [1, 2, 3, 3, 5, 6],
        pointers: [
          { idx: 1, label: 'i (2)', color: '#3b82f6' },
          { idx: 0, label: 'j (2)', color: '#a855f7' },
          { idx: 2, label: 'k (write)', color: '#ef4444' }
        ],
        highlightIndices: [1, 2],
        states: {
          i: 1,
          'nums1[i]': 2,
          j: 0,
          'nums2[j]': 2,
          nums2: '[2, 5, 6]',
          k: 2,
          tie_break: 'else branch takes nums2'
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Drain Remaining nums2 Element & Finalize Array',
        whatHappens: 'Write nums2[0]=2 into nums1[2], then copy down the remaining nums1 elements. j is exhausted (-1). Merge complete in-place.',
        whyRationale: 'All elements from nums2 are merged. The array is fully sorted in non-decreasing order.',
        codeSnippet: 'while j >= 0:\n    nums1[k] = nums2[j]\n    j -= 1; k -= 1',
        arrayState: [1, 2, 2, 3, 5, 6],
        pointers: [
          { idx: 1, label: 'i (2)', color: '#3b82f6' },
          { idx: 0, label: 'j done', color: '#a855f7' },
          { idx: 2, label: 'k placed 2', color: '#22c55e' }
        ],
        highlightIndices: [2],
        result: '[1, 2, 2, 3, 5, 6]',
        states: {
          i: 1,
          j: -1,
          k: 1,
          is_merged: true,
          result: '[1, 2, 2, 3, 5, 6]'
        },
        impact: 'Time: O(M + N) | Space: O(1)'
      }
    ]
  },

  '02_Arrays_Part_II/04-find-the-duplicate-number': {
    type: 'array',
    steps: [
      {
        title: 'Initialize Floyd Cycle Pointers (Tortoise & Hare)',
        whatHappens: 'Array nums = [1, 3, 4, 2, 2]. Set slow = nums[0] = 1, fast = nums[0] = 1.',
        whyRationale: 'Treat array indices as nodes in a linked list where nums[i] is the next pointer. Duplicate value creates a cycle.',
        codeSnippet: 'slow = nums[0]\nfast = nums[0]',
        arrayState: [1, 3, 4, 2, 2],
        pointers: [
          { idx: 0, label: 'start (0)', color: '#64748b' },
          { idx: 1, label: 'slow/fast (1)', color: '#3b82f6' }
        ],
        highlightIndices: [0, 1],
        states: {
          slow: 1,
          fast: 1,
          phase: 'Initialization'
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Phase 1: Advance Once (slow=3, fast=2)',
        whatHappens: 'slow=nums[1]=3, fast=nums[nums[1]]=nums[3]=2. The pointers have not met yet.',
        whyRationale: 'Fast pointer moves twice as fast as slow pointer. They must collide inside the cycle formed by the duplicate.',
        codeSnippet: 'slow = nums[slow]\nfast = nums[nums[fast]]',
        arrayState: [1, 3, 4, 2, 2],
        pointers: [
          { idx: 1, label: 'slow (3)', color: '#3b82f6' },
          { idx: 3, label: 'fast (2)', color: '#ef4444' }
        ],
        highlightIndices: [1, 3],
        states: {
          slow: 3,
          fast: 2
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Phase 1: Detect Cycle Intersection',
        whatHappens: 'slow=nums[3]=2, fast=nums[nums[fast]]=nums[nums[2]]=nums[4]=2. slow == fast == 2.',
        whyRationale: 'Both pointers land on node 2 (the value 2 lives at indices 3 and 4). The meeting point proves a cycle exists.',
        codeSnippet: 'while slow != fast:\n    slow = nums[slow]\n    fast = nums[nums[fast]]',
        arrayState: [1, 3, 4, 2, 2],
        pointers: [{ idx: 3, label: 'intersection (2)', color: '#8b5cf6' }],
        highlightIndices: [3, 4],
        states: {
          slow: 2,
          fast: 2,
          cycle_detected: true
        },
        impact: 'Time: O(N) | Space: O(1)'
      },
      {
        title: 'Phase 2: Reset Slow to Start and Advance Pointers Together',
        whatHappens: 'Reset slow = nums[0] = 1 while fast remains at 2. Advance each pointer by 1 step: slow=nums[1]=3, fast=nums[2]=4.',
        whyRationale: 'By Floyd mathematical cycle properties, the distance from start to cycle entrance equals distance from intersection to cycle entrance.',
        codeSnippet: 'slow = nums[0]\nwhile slow != fast:\n    slow = nums[slow]\n    fast = nums[fast]',
        arrayState: [1, 3, 4, 2, 2],
        pointers: [
          { idx: 1, label: 'slow (3)', color: '#3b82f6' },
          { idx: 2, label: 'fast (4)', color: '#ef4444' }
        ],
        highlightIndices: [1, 2],
        states: {
          slow: 3,
          fast: 4,
          step_phase: 2
        },
        impact: 'Time: O(N) | Space: O(1)'
      },
      {
        title: 'Meet at Cycle Entrance: Duplicate Found = 2',
        whatHappens: 'Next step: slow = nums[3] = 2, fast = nums[4] = 2. Pointers meet at node 2.',
        whyRationale: 'The cycle entrance node has multiple incoming edges (duplicate index references), proving 2 is the duplicate number.',
        codeSnippet: 'return slow',
        arrayState: [1, 3, 4, 2, 2],
        pointers: [{ idx: 3, label: 'duplicate = 2', color: '#22c55e' }],
        highlightIndices: [3, 4],
        result: '2',
        states: {
          duplicate_number: 2,
          cycle_entrance: 2
        },
        impact: 'Time: O(N) | Space: O(1)'
      }
    ]
  },

  '02_Arrays_Part_II/05-find-the-repeating-and-missing-number': {
    type: 'array',
    steps: [
      {
        title: 'Calculate Actual Sum (S) and Sum of Squares (S2)',
        whatHappens: 'Input arr = [4, 3, 6, 2, 1, 1], n = 6. S = 4+3+6+2+1+1 = 17. S2 = 16+9+36+4+1+1 = 67.',
        whyRationale: 'Mathematical equations using sum and sum of squares allow finding 2 unknowns (x=repeating, y=missing) without extra space.',
        codeSnippet: 'S = sum(arr)\nS2 = sum(x * x for x in arr)',
        arrayState: [4, 3, 6, 2, 1, 1],
        pointers: [{ idx: 0, label: 'n = 6', color: '#3b82f6' }],
        highlightIndices: [4, 5],
        states: {
          n: 6,
          actual_S: 17,
          actual_S2: 67
        },
        impact: 'Time: O(N) | Space: O(1)'
      },
      {
        title: 'Compute Expected Series Sums: Sn and S2n',
        whatHappens: 'Sn = 6*7/2 = 21. S2n = 6*7*13/6 = 91. Difference diff = S - Sn = 17 - 21 = -4 (x - y = -4).',
        whyRationale: 'Since actual elements contain repeating x and missing y, S - Sn = x - y.',
        codeSnippet: 'Sn = n * (n + 1) // 2\nS2n = n * (n + 1) * (2 * n + 1) // 6\ndiff = S - Sn  # x - y',
        arrayState: [4, 3, 6, 2, 1, 1],
        pointers: [{ idx: 4, label: 'x (repeating)', color: '#ef4444' }],
        states: {
          expected_Sn: 21,
          expected_S2n: 91,
          'x - y (diff)': -4
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Calculate Sum of Squares Difference to Find x + y',
        whatHappens: 'S2 - S2n = 67 - 91 = -24 = (x² - y²) = (x - y)(x + y). Therefore, x + y = -24 / -4 = 6.',
        whyRationale: 'Algebraic factoring x² - y² = (x - y)(x + y) gives the second linear equation.',
        codeSnippet: 'sum_xy = (S2 - S2n) // diff  # (x² - y²) / (x - y) = x + y',
        arrayState: [4, 3, 6, 2, 1, 1],
        pointers: [
          { idx: 4, label: 'x=1', color: '#ef4444' },
          { idx: 5, label: 'x=1', color: '#ef4444' }
        ],
        highlightIndices: [4, 5],
        states: {
          'x - y': -4,
          'x + y': 6,
          diff_S2: -24
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Solve Linear System for Repeating (x) and Missing (y)',
        whatHappens: 'x = (diff + sum_xy) // 2 = (-4 + 6) // 2 = 1. y = sum_xy - x = 6 - 1 = 5.',
        whyRationale: 'Adding the two equations cancels y to solve x; substituting back yields y.',
        codeSnippet: 'x = (diff + sum_xy) // 2  # repeating\ny = sum_xy - x           # missing\nreturn [x, y]',
        arrayState: [4, 3, 6, 2, 1, 1],
        pointers: [{ idx: 4, label: 'Repeating: 1', color: '#ef4444' }],
        result: 'Repeating = 1, Missing = 5',
        states: {
          repeating_x: 1,
          missing_y: 5
        },
        impact: 'Time: O(N) | Space: O(1)'
      }
    ]
  },

  '02_Arrays_Part_II/06-inversion-of-array': {
    type: 'array',
    steps: [
      {
        title: 'Divide Array into Left & Right Subarrays',
        whatHappens: 'Input arr = [2, 4, 1, 3, 5]. mid = (0 + 4) // 2 = 2. Divide into Left = [2, 4, 1] and Right = [3, 5].',
        whyRationale: 'Modified Merge Sort counts inversions during the merge step in O(N log N) time.',
        codeSnippet: 'mid = (left + right) // 2\ninv_count += mergeSort(arr, temp, left, mid)\ninv_count += mergeSort(arr, temp, mid + 1, right)',
        arrayState: [2, 4, 1, 3, 5],
        pointers: [
          { idx: 0, label: 'Left [2, 4, 1]', color: '#3b82f6' },
          { idx: 3, label: 'Right [3, 5]', color: '#8b5cf6' }
        ],
        highlightRange: [0, 4],
        states: {
          left: 0,
          mid: 2,
          right: 4,
          inversion_count: 0
        },
        impact: 'Time: O(log N) recursion depth | Space: O(N)'
      },
      {
        title: 'Sort Left Half [2, 4, 1] -> [1, 2, 4] (+2 Inversions)',
        whatHappens: 'Merging sorted sub-halves [2, 4] and [1]: 1 is smaller than both 2 and 4, so place 1 first, then 2, then 4.',
        whyRationale: 'Left sub-half [2, 4] is sorted, so if arr[i] > arr[j], all elements from i to mid form inversions with arr[j]. inv += (mid - i + 1) = (1 - 0 + 1) = 2 (pairs (2,1), (4,1)).',
        codeSnippet: 'if arr[i] > arr[j]:\n    temp[k] = arr[j]\n    inv_count += (mid - i + 1)\n    j += 1',
        arrayState: [1, 2, 4, 3, 5],
        pointers: [
          { idx: 1, label: 'i (2)', color: '#3b82f6' },
          { idx: 0, label: 'j (1)', color: '#ef4444' }
        ],
        highlightIndices: [0, 1, 2],
        states: {
          'arr[i]': 2,
          'arr[j]': 1,
          inversions_added: 2,
          running_inversions: 2
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Merge Step 2: 4 > 3 (+1 Inversion)',
        whatHappens: 'Left half [1, 2, 4] contributes 1 and 2 freely (both < 3). Comparing 4 with 3: 4 > 3 -> place 3, adding 1 inversion for pair (4, 3).',
        whyRationale: 'Element 4 from the left partition is greater than 3 from the right partition.',
        codeSnippet: 'inv_count += (mid - i + 1) # 2 - 2 + 1 = 1',
        arrayState: [1, 2, 3, 4, 5],
        pointers: [
          { idx: 3, label: 'i (4)', color: '#3b82f6' },
          { idx: 2, label: 'j (3)', color: '#ef4444' }
        ],
        highlightIndices: [2, 3],
        states: {
          'arr[i]': 4,
          'arr[j]': 3,
          inversions_added: 1,
          running_inversions: 3
        },
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Merge Complete & Total Inversion Count Returned',
        whatHappens: 'Remaining element 5 is appended. Total inversions = 3 (pairs (2,1), (4,1), (4,3)).',
        whyRationale: 'Entire array is now sorted [1, 2, 3, 4, 5] and all cross-inversions have been counted in O(N log N).',
        codeSnippet: 'return inv_count',
        arrayState: [1, 2, 3, 4, 5],
        pointers: [
          { idx: 0, label: 'sorted', color: '#22c55e' },
          { idx: 4, label: 'sorted', color: '#22c55e' }
        ],
        highlightRange: [0, 4],
        result: 'Inversion Count = 3',
        states: {
          total_inversions: 3,
          sorted_array: '[1, 2, 3, 4, 5]'
        },
        impact: 'Time: O(N log N) | Space: O(N)'
      }
    ]
  }
};

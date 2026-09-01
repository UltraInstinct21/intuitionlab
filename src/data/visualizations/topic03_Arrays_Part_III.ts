import { ProblemVisualization } from '../../types/visualization';

export const topic03Visualizations: Record<string, ProblemVisualization> = {
  '03_Arrays_Part_III/01-search-in-a-2d-matrix': {
    type: 'matrix',
    steps: [
      {
        title: 'Virtual 1D Binary Search: Range [0, 11]',
        whatHappens:
          'Treat the 3×4 matrix as a virtual 1D array of 12 elements [0..11]. Compute mid = (0 + 11) // 2 = 5. Map to 2D coordinates: row = 5 // 4 = 1, col = 5 % 4 = 1. Value at matrix[1][1] is 11. Target is 3.',
        whyRationale:
          'Since each row is sorted and the first element of each row is strictly greater than the last element of the previous row, the entire matrix behaves as a single continuous sorted array of size M×N.',
        grid: [
          [1, 3, 5, 7],
          [10, 11, 16, 20],
          [23, 30, 34, 60]
        ],
        activeCell: [1, 1],
        highlightCells: [
          [0, 0], [0, 1], [0, 2], [0, 3],
          [1, 0], [1, 1], [1, 2], [1, 3],
          [2, 0], [2, 1], [2, 2], [2, 3]
        ],
        states: {
          lo: 0,
          hi: 11,
          mid: 5,
          row: 1,
          col: 1,
          'matrix[1][1]': 11,
          target: 3,
          action: '11 > 3 -> Search Left Half'
        },
        codeSnippet:
          'mid = (lo + hi) // 2  # 5\nval = matrix[mid // n][mid % n]  # matrix[1][1] = 11\nif val > target:\n    hi = mid - 1  # hi = 4',
        impact: 'Time: O(log(M × N)) | Space: O(1)'
      },
      {
        title: 'Search Left Half: Range [0, 4], Mid = 2',
        whatHappens:
          'Search range shrinks to [0, 4]. Compute mid = (0 + 4) // 2 = 2. Map coordinates: row = 2 // 4 = 0, col = 2 % 4 = 2. Value at matrix[0][2] is 5. Compare 5 > 3.',
        whyRationale:
          'Since matrix[0][2] = 5 is greater than target 3, all elements from index 2 to 4 are guaranteed to be greater than 3. Eliminate the right sub-range by setting hi = mid - 1 = 1.',
        grid: [
          [1, 3, 5, 7],
          [10, 11, 16, 20],
          [23, 30, 34, 60]
        ],
        activeCell: [0, 2],
        highlightCells: [
          [0, 0], [0, 1], [0, 2], [0, 3],
          [1, 0]
        ],
        states: {
          lo: 0,
          hi: 4,
          mid: 2,
          row: 0,
          col: 2,
          'matrix[0][2]': 5,
          target: 3,
          action: '5 > 3 -> hi = 1'
        },
        codeSnippet:
          'mid = (lo + hi) // 2  # 2\nval = matrix[0][2]  # 5\nelif val > target:\n    hi = mid - 1  # hi = 1',
        impact: 'Time: O(log(M × N)) | Space: O(1)'
      },
      {
        title: 'Search Range [0, 1], Mid = 0',
        whatHappens:
          'Search range is now [0, 1]. Compute mid = (0 + 1) // 2 = 0. Map coordinates: row = 0 // 4 = 0, col = 0 % 4 = 0. Value at matrix[0][0] is 1. Compare 1 < 3.',
        whyRationale:
          'Because matrix[0][0] = 1 is less than target 3, the target cannot be at index 0 or to its left. Narrow the search range to the right by setting lo = mid + 1 = 1.',
        grid: [
          [1, 3, 5, 7],
          [10, 11, 16, 20],
          [23, 30, 34, 60]
        ],
        activeCell: [0, 0],
        highlightCells: [[0, 0], [0, 1]],
        states: {
          lo: 0,
          hi: 1,
          mid: 0,
          row: 0,
          col: 0,
          'matrix[0][0]': 1,
          target: 3,
          action: '1 < 3 -> lo = 1'
        },
        codeSnippet:
          'mid = (lo + hi) // 2  # 0\nval = matrix[0][0]  # 1\nelif val < target:\n    lo = mid + 1  # lo = 1',
        impact: 'Time: O(log(M × N)) | Space: O(1)'
      },
      {
        title: 'Exact Match Found: matrix[0][1] == 3',
        whatHappens:
          'Search range is [1, 1]. Compute mid = (1 + 1) // 2 = 1. Map coordinates: row = 1 // 4 = 0, col = 1 % 4 = 1. Value at matrix[0][1] is 3. 3 == target 3. Return True!',
        whyRationale:
          'Binary search successfully pinpoints the target element in O(log(M × N)) time without allocating any auxiliary matrix or array structures.',
        grid: [
          [1, 3, 5, 7],
          [10, 11, 16, 20],
          [23, 30, 34, 60]
        ],
        activeCell: [0, 1],
        highlightCells: [[0, 1]],
        states: {
          lo: 1,
          hi: 1,
          mid: 1,
          row: 0,
          col: 1,
          'matrix[0][1]': 3,
          target: 3,
          result: 'Found target 3 at row 0, col 1'
        },
        codeSnippet:
          'if val == target:\n    return True  # Found at matrix[0][1]',
        impact: 'Time: O(log(M × N)) | Space: O(1)'
      }
    ]
  },

  '03_Arrays_Part_III/02-powx-n': {
    type: 'array',
    steps: [
      {
        title: 'Initialize Fast Binary Exponentiation: x = 2.0, n = 10',
        whatHappens:
          'To calculate 2.0¹⁰, initialize product accumulator ans = 1.0, current base x = 2.0, and power n = 10. Exponent 10 in binary is (1010)₂ = 2³ + 2¹ = 8 + 2.',
        whyRationale:
          'Iterative binary exponentiation decomposes the exponent into powers of 2. Each step either multiplies ans by current base (if power is odd) or squares the base and halves the power (if power is even).',
        arrayState: ['Base x: 2.0', 'Exponent n: 10', 'ans: 1.0', 'Bit: 0 (Even)'],
        pointers: [
          { idx: 0, label: 'x=2.0', color: '#3b82f6' },
          { idx: 1, label: 'n=10', color: '#eab308' },
          { idx: 2, label: 'ans=1.0', color: '#22c55e' }
        ],
        states: { x: 2.0, n: 10, ans: 1.0, isOdd: false },
        codeSnippet:
          'ans = 1.0\n# n = 10 is even -> square x and halve n\nx = x * x  # x becomes 4.0\nn = n // 2  # n becomes 5',
        impact: 'Time: O(log N) | Space: O(1)'
      },
      {
        title: 'Step 1: n = 5 (Odd) -> Accumulate ans = 1.0 × 4.0 = 4.0',
        whatHappens:
          'Current state: x = 4.0, n = 5. Since n = 5 is odd (n % 2 == 1), multiply accumulator: ans = ans × x = 1.0 × 4.0 = 4.0. Then square base: x = 4.0 × 4.0 = 16.0, and halve exponent: n = 5 // 2 = 2.',
        whyRationale:
          'When n is odd, xⁿ = x × (x²)^((n-1)/2). We extract one factor of x into ans, leaving an even exponent (n-1) to be halved.',
        arrayState: ['Base x: 16.0', 'Exponent n: 2', 'ans: 4.0', 'Bit: 1 (Odd)'],
        pointers: [
          { idx: 0, label: 'x=16.0', color: '#3b82f6' },
          { idx: 1, label: 'n=2', color: '#eab308' },
          { idx: 2, label: 'ans=4.0', color: '#22c55e' }
        ],
        states: { x: 16.0, n: 2, ans: 4.0, isOdd: true },
        codeSnippet:
          'if n % 2 == 1:\n    ans = ans * x  # ans = 4.0\nx = x * x  # x = 16.0\nn = n // 2  # n = 2',
        impact: 'Time: O(log N) | Space: O(1)'
      },
      {
        title: 'Step 2: n = 2 (Even) -> Square Base x = 16² = 256.0',
        whatHappens:
          'Current state: x = 16.0, n = 2. Since n is even, ans remains 4.0. Square base: x = 16.0 × 16.0 = 256.0. Halve exponent: n = 2 // 2 = 1.',
        whyRationale:
          'For an even exponent, no multiplication with ans is needed. Squaring the base prepares for the next binary power 2³ = 8.',
        arrayState: ['Base x: 256.0', 'Exponent n: 1', 'ans: 4.0', 'Bit: 0 (Even)'],
        pointers: [
          { idx: 0, label: 'x=256.0', color: '#3b82f6' },
          { idx: 1, label: 'n=1', color: '#eab308' },
          { idx: 2, label: 'ans=4.0', color: '#22c55e' }
        ],
        states: { x: 256.0, n: 1, ans: 4.0, isOdd: false },
        codeSnippet:
          '# n = 2 is even\nx = x * x  # x = 256.0\nn = n // 2  # n = 1',
        impact: 'Time: O(log N) | Space: O(1)'
      },
      {
        title: 'Step 3: n = 1 (Odd) -> Final Multiplication ans = 4.0 × 256.0 = 1024.0',
        whatHappens:
          'Current state: x = 256.0, n = 1. Since n = 1 is odd, multiply accumulator: ans = ans × x = 4.0 × 256.0 = 1024.0. Exponent becomes n // 2 = 0.',
        whyRationale:
          'The final bit of exponent 10 is processed. The accumulator now contains 2² × 2⁸ = 2¹⁰ = 1024.0.',
        arrayState: ['Base x: 256.0', 'Exponent n: 0', 'ans: 1024.0', 'Bit: 1 (Odd)'],
        pointers: [
          { idx: 2, label: 'ans=1024.0', color: '#22c55e' }
        ],
        states: { x: 256.0, n: 0, ans: 1024.0, isOdd: true },
        codeSnippet:
          'if n % 2 == 1:\n    ans = ans * x  # 4.0 * 256.0 = 1024.0\nn = n // 2  # n = 0',
        impact: 'Time: O(log N) | Space: O(1)'
      },
      {
        title: 'Complete: Return Final Result 1024.0',
        whatHappens:
          'Exponent n reaches 0. The while loop terminates and the function returns ans = 1024.0.',
        whyRationale:
          'Instead of 10 linear multiplications, binary exponentiation computes 2¹⁰ in only 4 logarithmic steps.',
        arrayState: ['Input: 2.0^10', 'Result: 1024.0', 'Multiplications: 4', 'Status: Complete'],
        pointers: [
          { idx: 1, label: 'Final: 1024.0', color: '#22c55e' }
        ],
        result: '1024.0',
        states: { base: 2.0, power: 10, result: 1024.0 },
        codeSnippet: 'return ans  # 1024.0',
        impact: 'Time: O(log N) | Space: O(1)'
      }
    ]
  },

  '03_Arrays_Part_III/03-majority-element': {
    type: 'array',
    steps: [
      {
        title: 'Initialize Boyer-Moore Voting: candidate = 2, count = 1',
        whatHappens:
          'Input array: [2, 2, 1, 1, 1, 2, 2] (size N=7). Majority threshold is > 7 // 2 = 3. Initialize candidate = nums[0] = 2, count = 1.',
        whyRationale:
          'Boyer-Moore maintains a current candidate and net vote balance. When a candidate appears more than N/2 times, it cannot be completely cancelled out by all other elements combined.',
        arrayState: [2, 2, 1, 1, 1, 2, 2],
        pointers: [
          { idx: 0, label: 'i=0 (Cand: 2)', color: '#3b82f6' }
        ],
        highlightIndices: [0],
        states: { i: 0, 'nums[i]': 2, candidate: 2, count: 1 },
        codeSnippet:
          'candidate = nums[0]  # 2\ncount = 1',
        impact: 'Time: O(N) | Space: O(1)'
      },
      {
        title: 'Index 1: Matching Element -> count Increments to 2',
        whatHappens:
          'Scan index 1: nums[1] = 2 matches candidate (2). Increment count: count = 1 + 1 = 2.',
        whyRationale:
          'Matching elements cast affirmative votes, increasing the candidate lead.',
        arrayState: [2, 2, 1, 1, 1, 2, 2],
        pointers: [
          { idx: 1, label: 'i=1 (Vote +1)', color: '#22c55e' }
        ],
        highlightIndices: [0, 1],
        states: { i: 1, 'nums[i]': 2, candidate: 2, count: 2 },
        codeSnippet:
          'if nums[i] == candidate:\n    count += 1  # count = 2',
        impact: 'Time: O(N) | Space: O(1)'
      },
      {
        title: 'Indices 2 & 3: Differing Elements [1, 1] Cancel Votes -> count = 0',
        whatHappens:
          'Scan index 2: nums[2] = 1 != 2 -> count decrements to 1. Scan index 3: nums[3] = 1 != 2 -> count decrements to 0.',
        whyRationale:
          'Differing elements cancel out candidate votes pairwise. When count reaches 0, the prefix [2, 2, 1, 1] has zero net majority and can be safely discarded.',
        arrayState: [2, 2, 1, 1, 1, 2, 2],
        pointers: [
          { idx: 3, label: 'i=3 (count=0)', color: '#ef4444' }
        ],
        highlightIndices: [2, 3],
        states: { i: 3, 'nums[i]': 1, candidate: 2, count: 0 },
        codeSnippet:
          'else:\n    count -= 1  # count drops to 0 at i=3',
        impact: 'Time: O(N) | Space: O(1)'
      },
      {
        title: 'Index 4: count == 0 -> Adopt New Candidate 1',
        whatHappens:
          'Scan index 4: nums[4] = 1. Since count == 0, select nums[4] as new candidate = 1 and reset count = 1.',
        whyRationale:
          'A neutralized prefix leaves the remaining suffix guaranteed to contain the majority element with even greater relative proportion.',
        arrayState: [2, 2, 1, 1, 1, 2, 2],
        pointers: [
          { idx: 4, label: 'i=4 (New Cand: 1)', color: '#eab308' }
        ],
        highlightIndices: [4],
        states: { i: 4, 'nums[i]': 1, candidate: 1, count: 1 },
        codeSnippet:
          'elif count == 0:\n    candidate = nums[i]  # candidate = 1\n    count = 1',
        impact: 'Time: O(N) | Space: O(1)'
      },
      {
        title: 'Indices 5 & 6: Elements [2, 2] Overcome Candidate -> Final Result = 2',
        whatHappens:
          'Scan index 5: nums[5] = 2 != 1 -> count decrements to 0. Scan index 6: nums[6] = 2, count is 0 -> candidate becomes 2, count = 1. Loop completes. Return candidate 2.',
        whyRationale:
          'Because 2 appears 4 times out of 7 (> 3.5), it survives all cancellations and remains as the final candidate.',
        arrayState: [2, 2, 1, 1, 1, 2, 2],
        pointers: [
          { idx: 6, label: 'i=6 (Final Cand: 2)', color: '#22c55e' }
        ],
        highlightIndices: [5, 6],
        result: '2',
        states: { i: 6, 'nums[i]': 2, candidate: 2, count: 1, majorityElement: 2 },
        codeSnippet: 'return candidate  # 2',
        impact: 'Time: O(N) | Space: O(1)'
      }
    ]
  },

  '03_Arrays_Part_III/04-majority-element-ii': {
    type: 'array',
    steps: [
      {
        title: 'Initialize 2 Candidates & Process [1, 1, 1]',
        whatHappens:
          'Input: [1, 1, 1, 3, 3, 2, 2, 2] (size N=8). Threshold: > 8 // 3 = 2 occurrences. Initialize candidate1=None, count1=0, candidate2=None, count2=0. Process first 3 elements (all 1s): candidate1 becomes 1 with count1 = 3.',
        whyRationale:
          'At most 2 distinct elements can appear strictly more than ⌊N/3⌋ times. We extend Boyer-Moore to maintain 2 candidate slots simultaneously.',
        arrayState: [1, 1, 1, 3, 3, 2, 2, 2],
        pointers: [
          { idx: 2, label: 'i=2 (cand1=1, cnt1=3)', color: '#3b82f6' }
        ],
        highlightIndices: [0, 1, 2],
        states: { cand1: 1, cnt1: 3, cand2: 'None', cnt2: 0, threshold: 2 },
        codeSnippet:
          'for num in nums:\n    if candidate1 == num: count1 += 1\n    elif count1 == 0: candidate1, count1 = num, 1',
        impact: 'Time: O(N) | Space: O(1)'
      },
      {
        title: 'Process [3, 3] at Indices 3 & 4: cand2 = 3, count2 = 2',
        whatHappens:
          'Process index 3 (num=3): Does not match cand1(1). Since count2 == 0, set candidate2 = 3, count2 = 1. Process index 4 (num=3): Matches cand2, increment count2 to 2.',
        whyRationale:
          'Both candidate slots are now filled: candidate1=1 (count 3) and candidate2=3 (count 2).',
        arrayState: [1, 1, 1, 3, 3, 2, 2, 2],
        pointers: [
          { idx: 4, label: 'i=4 (cand2=3, cnt2=2)', color: '#eab308' }
        ],
        highlightIndices: [3, 4],
        states: { cand1: 1, cnt1: 3, cand2: 3, cnt2: 2 },
        codeSnippet:
          'elif candidate2 == num: count2 += 1\nelif count2 == 0: candidate2, count2 = num, 1',
        impact: 'Time: O(N) | Space: O(1)'
      },
      {
        title: 'Process 2 at Indices 5 & 6: Triplet Cancellations',
        whatHappens:
          'At index 5 (num=2): Matches neither cand1(1) nor cand2(3). Decrement both: count1=2, count2=1. At index 6 (num=2): Decrement both again: count1=1, count2=0.',
        whyRationale:
          'When an element differs from both candidates, a triplet of 3 distinct elements is formed and cancelled, reducing both counts by 1 without altering the relative majority.',
        arrayState: [1, 1, 1, 3, 3, 2, 2, 2],
        pointers: [
          { idx: 6, label: 'i=6 (cnt2=0)', color: '#ef4444' }
        ],
        highlightIndices: [5, 6],
        states: { cand1: 1, cnt1: 1, cand2: 3, cnt2: 0 },
        codeSnippet:
          'else:\n    count1 -= 1\n    count2 -= 1',
        impact: 'Time: O(N) | Space: O(1)'
      },
      {
        title: 'Process 2 at Index 7: candidate2 Replaced by 2',
        whatHappens:
          'At index 7 (num=2): count2 is 0, so candidate2 becomes 2 with count2 = 1. Candidates after Pass 1: candidate1 = 1, candidate2 = 2.',
        whyRationale:
          'Pass 1 completes identifying the only two potential candidates that could exceed ⌊N/3⌋ frequency.',
        arrayState: [1, 1, 1, 3, 3, 2, 2, 2],
        pointers: [
          { idx: 7, label: 'i=7 (cand2=2)', color: '#22c55e' }
        ],
        highlightIndices: [7],
        states: { cand1: 1, cnt1: 1, cand2: 2, cnt2: 1 },
        codeSnippet:
          'elif count2 == 0:\n    candidate2, count2 = num, 1',
        impact: 'Time: O(N) | Space: O(1)'
      },
      {
        title: 'Pass 2 Verification: Confirm Frequencies > 2 -> Result = [1, 2]',
        whatHappens:
          'Verify candidate frequencies across entire array: count(1) = 3 (> 2) -> Valid! count(2) = 3 (> 2) -> Valid! Return [1, 2].',
        whyRationale:
          'Boyer-Moore guarantees that any true majority element will be among the candidates, but an O(N) verification pass is necessary to confirm they actually exceed N/3.',
        arrayState: [1, 1, 1, 3, 3, 2, 2, 2],
        pointers: [
          { idx: 0, label: 'Cand1: 1 (Freq: 3)', color: '#22c55e' },
          { idx: 5, label: 'Cand2: 2 (Freq: 3)', color: '#22c55e' }
        ],
        highlightIndices: [0, 1, 2, 5, 6, 7],
        result: '[1, 2]',
        states: { threshold: 2, freq_1: 3, freq_2: 3, result: '[1, 2]' },
        codeSnippet:
          'result = []\nif nums.count(cand1) > threshold: result.append(cand1)\nif nums.count(cand2) > threshold: result.append(cand2)\nreturn result',
        impact: 'Time: O(N) | Space: O(1)'
      }
    ]
  },

  '03_Arrays_Part_III/05-grid-unique-paths': {
    type: 'matrix',
    steps: [
      {
        title: 'Initialize DP Grid: Base Cases (Row 0 & Col 0 = 1)',
        whatHappens:
          'For a 3×3 grid, initialize dp table where dp[0][c] = 1 for all columns and dp[r][0] = 1 for all rows. The robot starts at (0, 0).',
        whyRationale:
          'The robot can only move Right or Down. To reach any cell along the first row requires only Right moves (1 way). To reach any cell along the first column requires only Down moves (1 way).',
        grid: [
          [1, 1, 1],
          [1, 0, 0],
          [1, 0, 0]
        ],
        activeCell: [0, 0],
        highlightCells: [
          [0, 0], [0, 1], [0, 2],
          [1, 0], [2, 0]
        ],
        states: {
          'dp[0][0..2]': 1,
          'dp[0..2][0]': 1,
          formula: 'dp[r][c] = dp[r-1][c] + dp[r][c-1]'
        },
        codeSnippet:
          'dp = [[1] * n for _ in range(m)]',
        impact: 'Time: O(M × N) | Space: O(M × N)'
      },
      {
        title: 'Compute Cell (1,1): dp[1][1] = dp[0][1] + dp[1][0] = 2',
        whatHappens:
          'To reach cell (1, 1), robot can arrive from Top cell (0, 1) [1 path] or Left cell (1, 0) [1 path]. dp[1][1] = 1 + 1 = 2.',
        whyRationale:
          'The number of unique paths to (r, c) is the sum of unique paths to the cell directly above it and the cell directly to its left.',
        grid: [
          [1, 1, 1],
          [1, 2, 0],
          [1, 0, 0]
        ],
        activeCell: [1, 1],
        highlightCells: [[0, 1], [1, 0]],
        states: { r: 1, c: 1, fromTop: 1, fromLeft: 1, 'dp[1][1]': 2 },
        codeSnippet:
          'dp[r][c] = dp[r-1][c] + dp[r][c-1]  # dp[1][1] = 1 + 1 = 2',
        impact: 'Time: O(M × N) | Space: O(M × N)'
      },
      {
        title: 'Compute Cell (1,2): dp[1][2] = dp[0][2] + dp[1][1] = 3',
        whatHappens:
          'To reach cell (1, 2), robot arrives from Top (0, 2) [1 path] or Left (1, 1) [2 paths]. dp[1][2] = 1 + 2 = 3.',
        whyRationale:
          'Adding independent incoming paths computes the total routes reaching (1, 2).',
        grid: [
          [1, 1, 1],
          [1, 2, 3],
          [1, 0, 0]
        ],
        activeCell: [1, 2],
        highlightCells: [[0, 2], [1, 1]],
        states: { r: 1, c: 2, fromTop: 1, fromLeft: 2, 'dp[1][2]': 3 },
        codeSnippet:
          'dp[1][2] = dp[0][2] + dp[1][1]  # 1 + 2 = 3',
        impact: 'Time: O(M × N) | Space: O(M × N)'
      },
      {
        title: 'Compute Cell (2,1): dp[2][1] = dp[1][1] + dp[2][0] = 3',
        whatHappens:
          'To reach cell (2, 1), robot arrives from Top (1, 1) [2 paths] or Left (2, 0) [1 path]. dp[2][1] = 2 + 1 = 3.',
        whyRationale:
          'Symmetric path computation along row 2 fills the grid progressively.',
        grid: [
          [1, 1, 1],
          [1, 2, 3],
          [1, 3, 0]
        ],
        activeCell: [2, 1],
        highlightCells: [[1, 1], [2, 0]],
        states: { r: 2, c: 1, fromTop: 2, fromLeft: 1, 'dp[2][1]': 3 },
        codeSnippet:
          'dp[2][1] = dp[1][1] + dp[2][0]  # 2 + 1 = 3',
        impact: 'Time: O(M × N) | Space: O(M × N)'
      },
      {
        title: 'Compute Bottom-Right Cell (2,2): dp[2][2] = 3 + 3 = 6',
        whatHappens:
          'To reach target destination (2, 2), robot arrives from Top (1, 2) [3 paths] or Left (2, 1) [3 paths]. dp[2][2] = 3 + 3 = 6. Return 6 unique paths!',
        whyRationale:
          'The combinatorial formula C(m+n-2, m-1) = C(4, 2) = (4 × 3)/(2 × 1) = 6 confirms the exact DP result.',
        grid: [
          [1, 1, 1],
          [1, 2, 3],
          [1, 3, 6]
        ],
        activeCell: [2, 2],
        highlightCells: [[1, 2], [2, 1], [2, 2]],
        states: { r: 2, c: 2, fromTop: 3, fromLeft: 3, uniquePaths: 6 },
        codeSnippet:
          'return dp[m-1][n-1]  # 6',
        impact: 'Time: O(M × N) | Space: O(M × N)'
      }
    ]
  },

  '03_Arrays_Part_III/06-reverse-pairs': {
    type: 'array',
    steps: [
      {
        title: 'Divide & Conquer: Split Array into Sorted Halves',
        whatHappens:
          'Input array: [1, 3, 2, 3, 1]. A reverse pair is (i, j) where i < j and nums[i] > 2 × nums[j]. Split array at mid=1 into Left=[1, 3] and Right=[2, 3, 1]. Recursively sort both subarrays.',
        whyRationale:
          'Modified Merge Sort allows counting cross-boundary reverse pairs between two sorted subarrays in linear O(N) time per recursion level.',
        arrayState: [1, 3, 2, 3, 1],
        pointers: [
          { idx: 0, label: 'L_start', color: '#3b82f6' },
          { idx: 1, label: 'mid', color: '#eab308' },
          { idx: 4, label: 'R_end', color: '#22c55e' }
        ],
        highlightRange: [0, 4],
        states: { left: 0, mid: 1, right: 4, totalCount: 0 },
        codeSnippet:
          'mid = (left + right) // 2\ncount = mergeSort(arr, left, mid) + mergeSort(arr, mid + 1, right)',
        impact: 'Time: O(N log N) | Space: O(N)'
      },
      {
        title: 'Sorted Subarrays: Left = [1, 3], Right = [1, 2, 3]',
        whatHappens:
          'Both halves are sorted: Left subarray [1, 3] (indices 0..1) and Right subarray [1, 2, 3] (indices 2..4). Now count reverse pairs across halves where arr[i] > 2 × arr[j].',
        whyRationale:
          'Because both halves are sorted in ascending order, as pointer i increases, pointer j only moves forward, allowing two-pointer linear counting.',
        arrayState: [1, 3, 1, 2, 3],
        pointers: [
          { idx: 0, label: 'i=0 (val 1)', color: '#3b82f6' },
          { idx: 2, label: 'j=2 (val 1)', color: '#22c55e' }
        ],
        highlightRange: [0, 4],
        states: {
          i: 0,
          'arr[i]': 1,
          j: 2,
          'arr[j]': 1,
          condition: '1 > 2 * 1 (False)',
          currentPairs: 0
        },
        codeSnippet:
          'j = mid + 1\nfor i in range(left, mid + 1):\n    while j <= right and arr[i] > 2 * arr[j]:\n        j += 1\n    count += j - (mid + 1)',
        impact: 'Time: O(N log N) | Space: O(N)'
      },
      {
        title: 'Two-Pointer Count: i=1 (val 3) Finds Reverse Pair (3, 1)',
        whatHappens:
          'For i=1 (arr[i]=3): Check j=2 (arr[j]=1): 3 > 2 × 1 is True -> j advances to 3 (arr[j]=2). Check j=3: 3 > 2 × 2 = 4 is False -> Stop. Add j - (mid + 1) = 3 - 2 = 1 reverse pair. (Pair: nums[1]=3 > 2 × nums[4]=1).',
        whyRationale:
          'All elements in the right half from index (mid+1) up to j-1 satisfy arr[i] > 2 × arr[j].',
        arrayState: [1, 3, 1, 2, 3],
        pointers: [
          { idx: 1, label: 'i=1 (val 3)', color: '#3b82f6' },
          { idx: 3, label: 'j=3 (val 2)', color: '#22c55e' }
        ],
        highlightIndices: [1, 2],
        states: {
          i: 1,
          'arr[i]': 3,
          j: 3,
          pairsAdded: 1,
          totalReversePairs: 2
        },
        codeSnippet:
          'while j <= right and arr[i] > 2 * arr[j]:\n    j += 1  # j moves from 2 to 3\ncount += j - (mid + 1)  # adds 1 pair',
        impact: 'Time: O(N log N) | Space: O(N)'
      },
      {
        title: 'Merge Sorted Halves into [1, 1, 2, 3, 3] & Complete',
        whatHappens:
          'Merge Left [1, 3] and Right [1, 2, 3] into a single sorted array [1, 1, 2, 3, 3]. Subarray reverse pairs (1 from Right half [2, 3, 1] + 1 from cross-merge) sum to total count = 2.',
        whyRationale:
          'The merged array preserves the sorted property for higher levels of recursion while achieving optimal O(N log N) overall runtime.',
        arrayState: [1, 1, 2, 3, 3],
        pointers: [
          { idx: 0, label: 'sorted[0]', color: '#22c55e' },
          { idx: 4, label: 'sorted[4]', color: '#22c55e' }
        ],
        highlightRange: [0, 4],
        result: '2',
        states: { finalArray: '[1, 1, 2, 3, 3]', totalReversePairs: 2 },
        codeSnippet:
          '# Standard merge step\nwhile i <= mid and j <= right:\n    # merge into temp...\nreturn count  # 2',
        impact: 'Time: O(N log N) | Space: O(N)'
      }
    ]
  }
};

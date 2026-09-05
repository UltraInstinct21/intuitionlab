import { ProblemVisualization } from '../../types/visualization';

export const topic24Visualizations: Record<string, ProblemVisualization> = {
  '24_Graph_Part_II/01-dijkstra-algorithm': {
    type: 'graph',
    steps: [
      {
        title: 'Initialize Dijkstra: Source Node k = 2 with Distance 0',
        whatHappens: 'Network of 4 nodes. Source k = 2. dist = {2:0, 1:∞, 3:∞, 4:∞}. Push (dist=0, node=2) into min-heap priority queue.',
        whyRationale: 'Dijkstra\'s algorithm greedily expands the unvisited vertex with the smallest tentative distance first, using a min-heap to guarantee optimal time complexity.',
        nodes: [
          { id: 2, label: '2 (Src:0)', x: 60, y: 100, status: 'active' },
          { id: 1, label: '1 (∞)', x: 160, y: 40, status: 'default' },
          { id: 3, label: '3 (∞)', x: 160, y: 160, status: 'default' },
          { id: 4, label: '4 (∞)', x: 260, y: 100, status: 'default' }
        ],
        edges: [
          [2, 1, 'w=1'], [2, 3, 'w=1'], [3, 4, 'w=1']
        ],
        activeNodeId: 2,
        visitedIds: [2],
        queueOrStack: ['(0, 2)'],
        states: {
          'dist[2]': 0,
          'dist[1,3,4]': '∞',
          minHeap: '[(0, 2)]',
          source: 2
        },
        codeSnippet: 'dist = {}\nmin_heap = [(0, k)]',
        impact: 'Time: O(1) | Space: O(V + E)'
      },
      {
        title: 'Pop (0, 2) & Relax Edges 2 -> 1 (w=1) and 2 -> 3 (w=1)',
        whatHappens: 'Pop (0, 2). Lock dist[2] = 0. Relax outgoing edge (2->1, w=1) -> push (1, 1). Relax (2->3, w=1) -> push (1, 3). Min-heap: [(1, 1), (1, 3)].',
        whyRationale: 'Shortest distance to direct neighbors 1 and 3 improves from infinity to dist[2] + w = 0 + 1 = 1.',
        nodes: [
          { id: 2, label: '2 (d:0)', x: 60, y: 100, status: 'visited' },
          { id: 1, label: '1 (d:1)', x: 160, y: 40, status: 'active' },
          { id: 3, label: '3 (d:1)', x: 160, y: 160, status: 'active' },
          { id: 4, label: '4 (∞)', x: 260, y: 100, status: 'default' }
        ],
        edges: [
          [2, 1, 'w=1 (relaxed)'], [2, 3, 'w=1 (relaxed)'], [3, 4, 'w=1']
        ],
        activeNodeId: 2,
        visitedIds: [2, 1, 3],
        queueOrStack: ['(1, 1)', '(1, 3)'],
        states: {
          'dist[1]': 1,
          'dist[3]': 1,
          'w(2→1)': 1,
          'w(2→3)': 1,
          'w(3→4)': 1,
          relaxedEdges: '[(2→1, w=1), (2→3, w=1)]',
          minHeap: '[(1, 1), (1, 3)]'
        },
        codeSnippet: 'd, node = heapq.heappop(min_heap)\nfor neighbor, weight in graph[node]:\n    heapq.heappush(min_heap, (d + weight, neighbor))',
        impact: 'Time: O(log V) per heap push'
      },
      {
        title: 'Pop (1, 1) [Finalized] & Pop (1, 3) -> Relax 3 -> 4 (w=1)',
        whatHappens: 'Pop (1, 1) -> dist[1]=1 finalized (no outgoing edges). Pop (1, 3) -> dist[3]=1 finalized. Relax edge (3->4, w=1): new dist = 1 + 1 = 2 -> push (2, 4).',
        whyRationale: 'Because edge weights are non-negative, any distance popped from min-heap is guaranteed to be the true shortest path.',
        nodes: [
          { id: 2, label: '2 (d:0)', x: 60, y: 100, status: 'visited' },
          { id: 1, label: '1 (d:1)', x: 160, y: 40, status: 'visited' },
          { id: 3, label: '3 (d:1)', x: 160, y: 160, status: 'visited' },
          { id: 4, label: '4 (d:2)', x: 260, y: 100, status: 'active' }
        ],
        edges: [
          [2, 1, 'w=1'], [2, 3, 'w=1'], [3, 4, 'w=1 (relaxed)']
        ],
        activeNodeId: 3,
        visitedIds: [2, 1, 3, 4],
        queueOrStack: ['(2, 4)'],
        states: {
          'dist[4]': 2,
          minHeap: '[(2, 4)]',
          finalized: '[2, 1, 3]'
        },
        codeSnippet: 'if neighbor not in dist:\n    heapq.heappush(min_heap, (d + weight, neighbor))',
        impact: 'Time: O(E log V)'
      },
      {
        title: 'Pop (2, 4) & Return Maximum Signal Delay: 2',
        whatHappens: 'Pop (2, 4) -> dist[4]=2 finalized. All n=4 nodes reached. The network delay is max(dist.values()) = max(0, 1, 1, 2) = 2.',
        whyRationale: 'All nodes have received the signal. The bottleneck time when the last node (node 4) receives the signal is 2.',
        nodes: [
          { id: 2, label: '2 (d:0)', x: 60, y: 100, status: 'target' },
          { id: 1, label: '1 (d:1)', x: 160, y: 40, status: 'target' },
          { id: 3, label: '3 (d:1)', x: 160, y: 160, status: 'target' },
          { id: 4, label: '4 (d:2)', x: 260, y: 100, status: 'target' }
        ],
        edges: [
          [2, 1], [2, 3], [3, 4]
        ],
        activeNodeId: 4,
        visitedIds: [2, 1, 3, 4],
        queueOrStack: [],
        states: {
          allDistances: '{1:1, 2:0, 3:1, 4:2}',
          maxDistance: 2,
          result: 2
        },
        codeSnippet: 'return max(dist.values()) if len(dist) == n else -1',
        impact: 'Total Time: O(E log V) | Total Space: O(V + E)'
      }
    ]
  },

  '24_Graph_Part_II/02-shortest-path-in-binary-maze': {
    type: 'matrix',
    steps: [
      {
        title: 'Verify Start Cell (0,0) & Enqueue with Distance 1',
        whatHappens: 'Matrix 3x3. Check grid[0][0] == 0 and grid[2][2] == 0. Valid start! Enqueue (r=0, c=0, dist=1). visited = {(0,0)}.',
        whyRationale: 'If start or destination cell has obstacle (1), clear path is impossible (-1). Path length counts visited cells including start and end.',
        grid: [
          ['0(S)', 0, 0],
          [1, 1, 0],
          [1, 1, '0(E)']
        ],
        activeCell: [0, 0],
        highlightCells: [[0, 0]],
        states: {
          startCell: '(0,0)',
          distance: 1,
          queue: '[(0, 0, 1)]'
        },
        codeSnippet: 'if grid[0][0] == 1 or grid[n-1][n-1] == 1: return -1\nqueue = deque([(0, 0, 1)])',
        impact: 'Time: O(1) | Space: O(N^2)'
      },
      {
        title: 'Explore 8-Directional Neighbors from (0,0)',
        whatHappens: 'Pop (0,0, dist=1). Explore 8 directions. (0,1) is clear (0). Diagonal (1,1) is blocked (1). Enqueue (0,1, dist=2).',
        whyRationale: '8-directional BFS considers orthogonal and diagonal neighbors. Blocked 1s are pruned.',
        grid: [
          ['0(vis)', '0(d:2)', 0],
          [1, 1, 0],
          [1, 1, 0]
        ],
        activeCell: [0, 1],
        highlightCells: [[0, 1]],
        states: {
          popped: '(0,0)',
          enqueued: '[(0,1, dist=2)]',
          blockedNeighbors: '[(1,0)=1, (1,1)=1]'
        },
        codeSnippet: 'for dr, dc in directions:\n    nr, nc = r + dr, c + dc\n    if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0 and (nr, nc) not in visited:\n        visited.add((nr, nc))\n        queue.append((nr, nc, dist + 1))',
        impact: 'Time: O(1) (8 checks)'
      },
      {
        title: 'Step from (0,1): Reach (0,2) and Diagonal (1,2) with Distance 3',
        whatHappens: 'Pop (0,1, dist=2). Unvisited clear neighbors: Right (0,2, dist=3) and Down-Right diagonal (1,2, dist=3). Queue = [(0,2, 3), (1,2, 3)].',
        whyRationale: 'Diagonal step from (0,1) directly reaches (1,2), bypassing the wall of 1s in columns 0 and 1.',
        grid: [
          ['0(vis)', '0(vis)', '0(d:3)'],
          [1, 1, '0(d:3)'],
          [1, 1, 0]
        ],
        activeCell: [1, 2],
        highlightCells: [[0, 2], [1, 2]],
        states: {
          queue: '[(0,2, 3), (1,2, 3)]',
          currentDist: 3
        },
        codeSnippet: 'queue.append((nr, nc, dist + 1))',
        impact: 'Time: O(1)'
      },
      {
        title: 'Step from (1,2): Reach Target (2,2) with Distance 4',
        whatHappens: 'Pop (0,2, dist=3) -> all 8 neighbors visited/blocked, nothing new. Pop (1,2, dist=3). Neighbor (2,2) is the bottom-right destination (n-1, n-1). Next distance = 3 + 1 = 4. Return 4 immediately!',
        whyRationale: 'BFS guarantees the first time (n-1, n-1) is dequeued/reached gives the strictly shortest clear path length.',
        grid: [
          ['0(vis)', '0(vis)', '0'],
          [1, 1, '0(vis)'],
          [1, 1, '0(d:4)*']
        ],
        activeCell: [2, 2],
        highlightCells: [[0, 0], [0, 1], [1, 2], [2, 2]],
        states: {
          targetReached: '(2,2)',
          shortestPathLength: 4,
          path: '(0,0) -> (0,1) -> (1,2) -> (2,2)'
        },
        codeSnippet: 'if r == n - 1 and c == n - 1:\n    return dist',
        impact: 'Total Time: O(N^2) | Total Space: O(N^2)'
      }
    ]
  },

  '24_Graph_Part_II/03-path-with-minimum-effort': {
    type: 'matrix',
    steps: [
      {
        title: 'Initialize Min-Effort Table with Start (0,0) Effort 0',
        whatHappens: 'Grid 3x3 heights: [[1,2,2],[3,8,2],[5,3,5]]. dist table initialized to ∞, dist[0][0] = 0. Push (effort=0, r=0, c=0) to min-heap.',
        whyRationale: 'Effort is defined as the maximum absolute difference between consecutive cells on a path. We seek to minimize this maximum (Minimax shortest path).',
        grid: [
          ['1(0)', 2, 2],
          [3, 8, 2],
          [5, 3, 5]
        ],
        activeCell: [0, 0],
        highlightCells: [[0, 0]],
        states: {
          'dist[0][0]': 0,
          'dist[others]': '∞',
          minHeap: '[(0, 0, 0)]'
        },
        codeSnippet: 'dist = [[float("inf")] * n for _ in range(m)]\ndist[0][0] = 0\nheap = [(0, 0, 0)]',
        impact: 'Time: O(1) | Space: O(M × N)'
      },
      {
        title: 'Pop (0,0,0) & Relax Neighbors: Right (0,1) and Down (1,0)',
        whatHappens: 'Pop (0, 0, 0). Right neighbor (0,1): diff = |2-1| = 1 -> effort = max(0, 1) = 1. Down neighbor (1,0): diff = |3-1| = 2 -> effort = max(0, 2) = 2. Push both.',
        whyRationale: 'The effort along an edge is max(current_path_effort, height_difference).',
        grid: [
          ['1', '2(e:1)', 2],
          ['3(e:2)', 8, 2],
          [5, 3, 5]
        ],
        activeCell: [0, 1],
        highlightCells: [[0, 1], [1, 0]],
        states: {
          'dist[0][1]': 1,
          'dist[1][0]': 2,
          minHeap: '[(1, 0, 1), (2, 1, 0)]'
        },
        codeSnippet: 'new_effort = max(effort, abs(heights[nr][nc] - heights[r][c]))\nif new_effort < dist[nr][nc]:\n    dist[nr][nc] = new_effort\n    heapq.heappush(heap, (new_effort, nr, nc))',
        impact: 'Time: O(log(M × N))'
      },
      {
        title: 'Pop (1, 0, 1) -> (1, 0, 2): Top-Row Plateaus Relaxed at Effort 1',
        whatHappens: 'Pop (1, 0, 1) = cell (0,1) eff 1: move to (0,2) -> diff = |2-2| = 0, effort = max(1, 0) = 1; (1,1)=8 -> effort = max(1, 6) = 6, push (6, 1, 1). Pop (1, 0, 2) = cell (0,2) eff 1: move to (1,2) -> diff = |2-2| = 0, effort = max(1, 0) = 1. Push (1, 1, 2).',
        whyRationale: 'Traveling through the top-right plateau [1, 2, 2, 2] incurs zero extra effort above 1, completely avoiding the peak of 8 at (1,1).',
        grid: [
          ['1', '2', '2(e:1)'],
          [3, '8(e:6)', '2(e:1)'],
          [5, 3, 5]
        ],
        activeCell: [1, 2],
        highlightCells: [[0, 0], [0, 1], [0, 2], [1, 2]],
        states: {
          'dist[0][2]': 1,
          'dist[1][2]': 1,
          'dist[1][1]': 6,
          minHeap: '[(1, 1, 2), (2, 1, 0), (6, 1, 1)]'
        },
        codeSnippet: 'effort, r, c = heapq.heappop(heap) # (1, 0, 1) -> cell (0,1)\nnew_effort = max(effort, abs(heights[nr][nc] - heights[r][c])) # max(1, 0) = 1',
        impact: 'Time: O(log(M × N))'
      },
      {
        title: 'Pop (1,2) at Effort 1: Destination First Seen at 3; Pop (1,0) at Effort 2',
        whatHappens: 'Pop (1, 1, 2) = cell (1,2) eff 1: (2,2)=5 -> diff = |5-2| = 3, effort = max(1, 3) = 3, push (3, 2, 2). Pop (2, 1, 0) = cell (1,0) eff 2: (2,0)=5 -> diff = |5-3| = 2, effort = max(2, 2) = 2, push (2, 2, 0); (1,1)=8 effort improves 6 -> max(2, 5) = 5.',
        whyRationale: 'The destination is first reached at effort 3 via the top route, but a cheaper left-column entry (effort 2) is still in the heap, so Dijkstra must continue.',
        grid: [
          ['1', 2, 2],
          ['3', '8(e:5)', 2],
          ['5(e:2)', 3, '5(e:3)']
        ],
        activeCell: [1, 0],
        highlightCells: [[2, 2], [2, 0], [1, 1]],
        states: {
          'dist[2][2]': 3,
          'dist[2][0]': 2,
          'dist[1][1]': '5 (improved from 6)',
          minHeap: '[(2, 2, 0), (3, 2, 2), (5, 1, 1)]'
        },
        codeSnippet: 'effort, r, c = heapq.heappop(heap) # (1, 1, 2) -> cell (1,2)\nnew = max(1, abs(5 - 2)) # dst effort 3\n# pop (2, 1, 0) -> cell (1,0): dist[2][0] = max(2, 2) = 2',
        impact: 'Time: O(log(M × N))'
      },
      {
        title: 'Walk (2,0) -> (2,1) -> Destination Improves 3 -> 2: Minimum Effort 2',
        whatHappens: 'Pop (2, 2, 0) = cell (2,0) eff 2: (2,1)=3 -> diff = |3-5| = 2, effort = max(2, 2) = 2, push (2, 2, 1). Pop (2, 2, 1) = cell (2,1) eff 2: (2,2)=5 -> diff = |5-3| = 2, effort = max(2, 2) = 2 < 3, update dist[2][2] = 2. Pop (2, 2, 2) = destination -> return 2.',
        whyRationale: 'Popping the destination guarantees optimality: every remaining heap entry has effort >= 2, so no unseen path can beat it. Bottom route diffs are all 2: |3-1|, |5-3|, |3-5|, |5-3|.',
        grid: [
          ['1', 2, 2],
          ['3', 8, 2],
          ['5', '3', '5(e:2)*']
        ],
        activeCell: [2, 2],
        highlightCells: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
        states: {
          optimalPath: '[1 -> 3 -> 5 -> 3 -> 5]',
          maxAbsoluteDiff: 2,
          minEffort: 2
        },
        codeSnippet: 'if r == m - 1 and c == n - 1:\n    return effort # (2, 2, 2) -> 2',
        impact: 'Total Time: O(M × N log(M × N)) | Total Space: O(M × N)'
      }
    ]
  },

  '24_Graph_Part_II/04-cheapest-flights-within-k-stops': {
    type: 'graph',
    steps: [
      {
        title: 'Initialize Bellman-Ford: Source 0 with k=1 Stop Allowed',
        whatHappens: 'n=4 cities, src=0, dst=3, k=1 stop. dist = [0:0, 1:∞, 2:∞, 3:∞]. We will perform at most k + 1 = 2 relaxation iterations.',
        whyRationale: 'At most k intermediate stops means any valid path uses at most k+1 edges. Exactly k+1 Bellman-Ford rounds guarantee optimal cost with <= k stops.',
        nodes: [
          { id: 0, label: '0 (Src:0)', x: 60, y: 100, status: 'active' },
          { id: 1, label: '1 (∞)', x: 160, y: 40, status: 'default' },
          { id: 2, label: '2 (∞)', x: 160, y: 160, status: 'default' },
          { id: 3, label: '3 (∞)', x: 260, y: 100, status: 'default' }
        ],
        edges: [
          [0, 1, '100'], [1, 2, '100'], [2, 0, '100'], [1, 3, '600'], [2, 3, '200']
        ],
        activeNodeId: 0,
        visitedIds: [0],
        states: {
          'dist[0]': 0,
          'dist[1..3]': '∞',
          kStopsAllowed: 1,
          maxEdgeHops: 2
        },
        codeSnippet: 'dist = [float("inf")] * n\ndist[src] = 0',
        impact: 'Time: O(1) | Space: O(V)'
      },
      {
        title: 'Iteration 1 (0 Stops / 1 Edge): Relax Flight 0 -> 1',
        whatHappens: 'Using dist snapshot from round 0: Flight 0->1 costs 100 -> temp[1] = 100. All other flights start from ∞. Update dist = [0, 100, ∞, ∞].',
        whyRationale: 'Using a cloned snapshot of `dist` prevents updates within the same round from chaining across multiple hops.',
        nodes: [
          { id: 0, label: '0 (0)', x: 60, y: 100, status: 'visited' },
          { id: 1, label: '1 (100)', x: 160, y: 40, status: 'active' },
          { id: 2, label: '2 (∞)', x: 160, y: 160, status: 'default' },
          { id: 3, label: '3 (∞)', x: 260, y: 100, status: 'default' }
        ],
        edges: [
          [0, 1, '100 (USED)'], [1, 2, '100'], [2, 0, '100'], [1, 3, '600'], [2, 3, '200']
        ],
        activeNodeId: 1,
        visitedIds: [0, 1],
        states: {
          'dist[1]': 100,
          'dist[2,3]': '∞',
          iteration: '1 of 2'
        },
        codeSnippet: 'temp = dist[:]\nfor u, v, w in flights:\n    if dist[u] != INF and dist[u] + w < temp[v]:\n        temp[v] = dist[u] + w\ndist = temp',
        impact: 'Time: O(E)'
      },
      {
        title: 'Iteration 2 (1 Stop / 2 Edges): Relax 1 -> 2 and 1 -> 3',
        whatHappens: 'From node 1 (cost 100): Flight 1->2 (cost 100) -> temp[2] = 200. Flight 1->3 (cost 600) -> temp[3] = 700. Update dist = [0, 100, 200, 700].',
        whyRationale: 'Both 0->1->2 (cost 200) and 0->1->3 (cost 700) use exactly 1 stop (2 edges), which meets the k=1 stop constraint.',
        nodes: [
          { id: 0, label: '0 (0)', x: 60, y: 100, status: 'visited' },
          { id: 1, label: '1 (100)', x: 160, y: 40, status: 'visited' },
          { id: 2, label: '2 (200)', x: 160, y: 160, status: 'active' },
          { id: 3, label: '3 (700)', x: 260, y: 100, status: 'active' }
        ],
        edges: [
          [0, 1], [1, 2, '100 (p:200)'], [2, 0], [1, 3, '600 (p:700)'], [2, 3, '200']
        ],
        activeNodeId: 3,
        visitedIds: [0, 1, 2, 3],
        states: {
          'dist[2]': 200,
          'dist[3]': 700,
          iteration: '2 of 2 (Complete)'
        },
        codeSnippet: 'temp[3] = min(temp[3], dist[1] + 600) # 100 + 600 = 700',
        impact: 'Time: O(E)'
      },
      {
        title: 'Stop After k+1 Iterations: Enforce k=1 Stop Constraint',
        whatHappens: 'Iterations finish. Flight 2->3 would cost 200 + 200 = 400, but requires 3 edges (2 stops > k=1). Therefore, cheapest valid route is 0 -> 1 -> 3 costing 700.',
        whyRationale: 'Halting after k+1 rounds strictly prevents paths with more than k stops from being considered.',
        nodes: [
          { id: 0, label: '0', x: 60, y: 100, status: 'target' },
          { id: 1, label: '1', x: 160, y: 40, status: 'target' },
          { id: 2, label: '2 (400 invalid: 2 stops)', x: 160, y: 160, status: 'eliminated' },
          { id: 3, label: '3 (BEST: 700)', x: 260, y: 100, status: 'target' }
        ],
        edges: [
          [0, 1, 'path'], [1, 3, 'path (700)'], [1, 2], [2, 3, 'exceeds k']
        ],
        activeNodeId: 3,
        visitedIds: [0, 1, 3],
        activePath: [0, 1, 3],
        states: {
          cheapestPriceWithinKStops: 700,
          pathTaken: '0 -> 1 -> 3 (1 stop)',
          cheaperRejectedPath: '0 -> 1 -> 2 -> 3 (2 stops > k=1)'
        },
        codeSnippet: 'return dist[dst] if dist[dst] != INF else -1',
        impact: 'Total Time: O(K × E) | Total Space: O(V)'
      }
    ]
  },

  '24_Graph_Part_II/05-network-delay-time': {
    type: 'graph',
    steps: [
      {
        title: 'Start Signal Propagation from Source Node k = 2',
        whatHappens: 'n=4 nodes. Signal starts at k=2 at time t=0. dist = {2:0, 1:∞, 3:∞, 4:∞}. Min-heap: [(0, 2)].',
        whyRationale: 'The network delay is the time when the last node receives the signal, which equals max(shortest_distance_to_all_nodes).',
        nodes: [
          { id: 2, label: '2 (t=0)', x: 60, y: 100, status: 'active' },
          { id: 1, label: '1 (t=∞)', x: 160, y: 40, status: 'default' },
          { id: 3, label: '3 (t=∞)', x: 160, y: 160, status: 'default' },
          { id: 4, label: '4 (t=∞)', x: 260, y: 100, status: 'default' }
        ],
        edges: [
          [2, 1, '1'], [2, 3, '1'], [3, 4, '2']
        ],
        activeNodeId: 2,
        visitedIds: [2],
        queueOrStack: ['(0, 2)'],
        states: {
          'dist[2]': 0,
          'dist[1,3,4]': '∞',
          source: 2,
          activeHeap: '[(0, 2)]'
        },
        codeSnippet: 'graph = defaultdict(list)\nfor u, v, w in times: graph[u].append((v, w))\nmin_heap = [(0, k)]',
        impact: 'Time: O(1) | Space: O(V + E)'
      },
      {
        title: 'Broadcast Signal from Node 2: Nodes 1 and 3 Receive at t = 1',
        whatHappens: 'Pop (0, 2). Node 2 broadcasts along edge 2->1 (delay 1) -> push (1, 1). Along 2->3 (delay 1) -> push (1, 3). dist = {2:0, 1:1, 3:1}.',
        whyRationale: 'Both nodes 1 and 3 receive the transmitted signal simultaneously at timestamp t = 1.',
        nodes: [
          { id: 2, label: '2 (t=0)', x: 60, y: 100, status: 'visited' },
          { id: 1, label: '1 (t=1)', x: 160, y: 40, status: 'active' },
          { id: 3, label: '3 (t=1)', x: 160, y: 160, status: 'active' },
          { id: 4, label: '4 (t=∞)', x: 260, y: 100, status: 'default' }
        ],
        edges: [
          [2, 1, 't=1'], [2, 3, 't=1'], [3, 4, '2']
        ],
        activeNodeId: 2,
        visitedIds: [2, 1, 3],
        queueOrStack: ['(1, 1)', '(1, 3)'],
        states: {
          'dist[1]': 1,
          'dist[3]': 1,
          'w(2→1)': 1,
          'w(2→3)': 1,
          'w(3→4)': 2,
          reachedNodes: '[2, 1, 3]'
        },
        codeSnippet: 'for neighbor, weight in graph[node]:\n    if neighbor not in dist:\n        heapq.heappush(min_heap, (d + weight, neighbor))',
        impact: 'Time: O(log V)'
      },
      {
        title: 'Node 3 Relays Signal to Node 4: Receives at t = dist[3] + w = 1 + 2 = 3',
        whatHappens: 'Pop (1, 1) [no outgoing]. Pop (1, 3) -> relays signal along edge 3->4 (delay 2). Node 4 receives signal at t = 1 + 2 = 3. Push (3, 4).',
        whyRationale: 'Node 4 receives the signal after the accumulated transmission delay through node 3.',
        nodes: [
          { id: 2, label: '2 (t=0)', x: 60, y: 100, status: 'visited' },
          { id: 1, label: '1 (t=1)', x: 160, y: 40, status: 'visited' },
          { id: 3, label: '3 (t=1)', x: 160, y: 160, status: 'visited' },
          { id: 4, label: '4 (t=3)', x: 260, y: 100, status: 'active' }
        ],
        edges: [
          [2, 1], [2, 3], [3, 4, 't=3']
        ],
        activeNodeId: 3,
        visitedIds: [2, 1, 3, 4],
        queueOrStack: ['(3, 4)'],
        states: {
          'dist[4]': 3,
          currentTime: 3,
          minHeap: '[(3, 4)]'
        },
        codeSnippet: 'd, node = heapq.heappop(min_heap) # (1, 3)\nheapq.heappush(min_heap, (d + w, 4)) # 1 + 2 = 3',
        impact: 'Time: O(log V)'
      },
      {
        title: 'All Nodes Reached: Network Delay Time = max(dist) = 3',
        whatHappens: 'Pop (3, 4). len(dist) == n (4 == 4). All nodes have received the signal. The maximum delay is max(dist.values()) = 3.',
        whyRationale: 'Because every node is reachable and the slowest node received the signal at t=3, the total network delay is 3.',
        nodes: [
          { id: 2, label: '2 (t=0)', x: 60, y: 100, status: 'target' },
          { id: 1, label: '1 (t=1)', x: 160, y: 40, status: 'target' },
          { id: 3, label: '3 (t=1)', x: 160, y: 160, status: 'target' },
          { id: 4, label: '4 (t=3:MAX)', x: 260, y: 100, status: 'target' }
        ],
        edges: [
          [2, 1, 'path'], [2, 3, 'path'], [3, 4, 'path']
        ],
        activeNodeId: 4,
        visitedIds: [2, 1, 3, 4],
        queueOrStack: [],
        states: {
          finalDistances: '{1:1, 2:0, 3:1, 4:3}',
          allNodesReached: true,
          result: 3
        },
        codeSnippet: 'if len(dist) != n: return -1\nreturn max(dist.values())',
        impact: 'Total Time: O(E log V) | Total Space: O(V + E)'
      }
    ]
  },

  '24_Graph_Part_II/06-bellman-ford-algorithm': {
    type: 'graph',
    steps: [
      {
        title: 'Initialize Bellman-Ford: dist[src]=0, All Others ∞',
        whatHappens: 'V=5 nodes, src=0. Edges with negative weights present (e.g., 0->1:-1, 4->3:-3). dist = [0:0, 1:∞, 2:∞, 3:∞, 4:∞]. We will perform V-1 = 4 relaxation passes.',
        whyRationale: 'Dijkstra fails on graphs with negative weights. Bellman-Ford correctly handles negative weights by iteratively relaxing all edges V-1 times.',
        nodes: [
          { id: 0, label: '0 (Src:0)', x: 40, y: 100, status: 'active' },
          { id: 1, label: '1 (∞)', x: 110, y: 40, status: 'default' },
          { id: 4, label: '4 (∞)', x: 180, y: 40, status: 'default' },
          { id: 3, label: '3 (∞)', x: 260, y: 40, status: 'default' },
          { id: 2, label: '2 (∞)', x: 180, y: 160, status: 'default' }
        ],
        edges: [
          [0, 1, '-1'], [0, 2, '4'], [1, 2, '3'], [1, 3, '2'], [4, 3, '-3'], [1, 4, '2'], [3, 2, '5'], [3, 1, '1']
        ],
        activeNodeId: 0,
        visitedIds: [0],
        states: {
          'dist[0]': 0,
          'dist[1..4]': '∞',
          requiredPasses: 'V-1 = 4 passes'
        },
        codeSnippet: 'dist = [float("inf")] * V\ndist[src] = 0',
        impact: 'Time: O(1) | Space: O(V)'
      },
      {
        title: 'Pass 1 of 4: Relax Edges from Node 0 and Node 1',
        whatHappens: 'Relax 0->1 (w=-1) -> dist[1] = -1. Relax 0->2 (w=4) -> dist[2] = 4. Relax 1->3 (w=2) -> dist[3] = -1+2 = 1. Relax 1->4 (w=2) -> dist[4] = -1+2 = 1. Relax 1->2 (w=3) -> dist[2] = min(4, -1+3) = 2.',
        whyRationale: 'In pass 1, shortest paths using at most 1 or 2 edges are discovered.',
        nodes: [
          { id: 0, label: '0 (0)', x: 40, y: 100, status: 'visited' },
          { id: 1, label: '1 (-1)', x: 110, y: 40, status: 'visited' },
          { id: 4, label: '4 (1)', x: 180, y: 40, status: 'active' },
          { id: 3, label: '3 (1)', x: 260, y: 40, status: 'active' },
          { id: 2, label: '2 (2)', x: 180, y: 160, status: 'visited' }
        ],
        edges: [
          [0, 1, '-1 (✓)'], [0, 2], [1, 2, '3 (✓)'], [1, 3, '2 (✓)'], [4, 3, '-3'], [1, 4, '2 (✓)'], [3, 2], [3, 1]
        ],
        activeNodeId: 1,
        visitedIds: [0, 1, 2, 3, 4],
        states: {
          pass: 1,
          'dist': '[0, -1, 2, 1, 1]',
          updated: true
        },
        codeSnippet: 'for u, v, w in edges:\n    if dist[u] != INF and dist[u] + w < dist[v]:\n        dist[v] = dist[u] + w',
        impact: 'Time: O(E)'
      },
      {
        title: 'Pass 2 of 4: Negative Edge 4 -> 3 (w = -3) Further Reduces dist[3]',
        whatHappens: 'Relax edge 4->3 (w=-3): dist[4] + (-3) = 1 - 3 = -2 < dist[3] (1)! Update dist[3] = -2. All other edges checked.',
        whyRationale: 'The negative weight edge 4->3 significantly lowers the cost to reach node 3 via path 0 -> 1 -> 4 -> 3.',
        nodes: [
          { id: 0, label: '0 (0)', x: 40, y: 100, status: 'visited' },
          { id: 1, label: '1 (-1)', x: 110, y: 40, status: 'visited' },
          { id: 4, label: '4 (1)', x: 180, y: 40, status: 'visited' },
          { id: 3, label: '3 (-2!)', x: 260, y: 40, status: 'active' },
          { id: 2, label: '2 (2)', x: 180, y: 160, status: 'visited' }
        ],
        edges: [
          [0, 1], [0, 2], [1, 2], [1, 3], [4, 3, '-3 (RELAXED: -2)'], [1, 4], [3, 2], [3, 1]
        ],
        activeNodeId: 3,
        visitedIds: [0, 1, 2, 3, 4],
        states: {
          pass: 2,
          'dist[3]': '-2 (Improved from 1)',
          'dist': '[0, -1, 2, -2, 1]'
        },
        codeSnippet: 'dist[3] = dist[4] + (-3) # 1 - 3 = -2',
        impact: 'Time: O(E)'
      },
      {
        title: 'Passes 3 & 4 (Stabilization) + Pass 5 (Negative Cycle Check)',
        whatHappens: 'Passes 3 and 4 produce no further updates -> dist array is stabilized at [0, -1, 2, -2, 1]. Run 5th pass: no edge can be relaxed further -> No negative cycle exists. Return dist.',
        whyRationale: 'If any distance could still improve during the V-th iteration, a negative cycle would be present. Since none improves, the distances are proven optimal.',
        nodes: [
          { id: 0, label: '0 (0)', x: 40, y: 100, status: 'target' },
          { id: 1, label: '1 (-1)', x: 110, y: 40, status: 'target' },
          { id: 4, label: '4 (1)', x: 180, y: 40, status: 'target' },
          { id: 3, label: '3 (-2)', x: 260, y: 40, status: 'target' },
          { id: 2, label: '2 (2)', x: 180, y: 160, status: 'target' }
        ],
        edges: [
          [0, 1, 'path'], [1, 4, 'path'], [4, 3, 'path'], [1, 2, 'path'], [0, 2], [3, 2], [3, 1]
        ],
        activeNodeId: 0,
        visitedIds: [0, 1, 2, 3, 4],
        states: {
          'distAfterPass3': '[0, -1, 2, -2, 1] (no change)',
          'distAfterPass4': '[0, -1, 2, -2, 1] (no change)',
          edgesRelaxedInPasses3And4: 'none',
          finalDistances: '[0, -1, 2, -2, 1]',
          negativeCycleDetected: false,
          result: '[0, -1, 2, -2, 1]'
        },
        codeSnippet: '# 5th pass: negative cycle check\nfor u, v, w in edges:\n    if dist[u] + w < dist[v]: return [-1] * V\nreturn dist',
        impact: 'Total Time: O(V × E) | Total Space: O(V)'
      }
    ]
  }
};

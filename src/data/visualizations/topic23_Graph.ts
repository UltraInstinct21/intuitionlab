import { ProblemVisualization } from '../../types/visualization';

export const topic23Visualizations: Record<string, ProblemVisualization> = {
  '23_Graph/01-clone-graph': {
    type: 'graph',
    steps: [
      {
        title: 'Start DFS at Root Node 1 & Create Clone(1)',
        whatHappens: 'Visit starting Node 1. Create a clone node Clone(1) with val=1. Record mapping cloned[1] = 1\'. Prepare to visit neighbors [2, 4].',
        whyRationale: 'A hash map (cloned) tracks original -> clone mappings, preventing cycles from causing infinite loops and ensuring nodes are duplicated only once.',
        nodes: [
          { id: 1, label: '1 (Orig)', x: 70, y: 60, status: 'active' },
          { id: 2, label: '2', x: 270, y: 60, status: 'default' },
          { id: 3, label: '3', x: 270, y: 160, status: 'default' },
          { id: 4, label: '4', x: 70, y: 160, status: 'default' },
          { id: "1'", label: "1' (Copy)", x: 170, y: 60, status: 'active' }
        ],
        edges: [
          [1, 2], [2, 3], [3, 4], [4, 1]
        ],
        activeNodeId: 1,
        visitedIds: [1],
        queueOrStack: ['DFS(1)'],
        states: {
          currentNode: 1,
          'clonedMap': '{ 1: 1\' }',
          pendingNeighbors: '[2, 4]'
        },
        codeSnippet: 'if original in cloned: return cloned[original]\nclone = Node(original.val)\ncloned[original] = clone',
        impact: 'Time: O(1) | Space: O(V) for hash map'
      },
      {
        title: 'DFS Traversal to Node 2 & Node 3',
        whatHappens: 'Recurse into Node 2: create Clone(2) (cloned[2]=2\'). Link edge 1\' <-> 2\'. Recurse into Node 3: create Clone(3) (cloned[3]=3\'). Link edge 2\' <-> 3\'.',
        whyRationale: 'DFS explores deep along edges first. Each new unvisited node is cloned and connected to its caller\'s clone in the adjacency list.',
        nodes: [
          { id: 1, label: '1', x: 70, y: 60, status: 'visited' },
          { id: 2, label: '2', x: 270, y: 60, status: 'visited' },
          { id: 3, label: '3 (Orig)', x: 270, y: 160, status: 'active' },
          { id: 4, label: '4', x: 70, y: 160, status: 'default' },
          { id: "1'", label: "1'", x: 140, y: 60, status: 'visited' },
          { id: "2'", label: "2'", x: 200, y: 60, status: 'visited' },
          { id: "3'", label: "3'", x: 200, y: 160, status: 'active' }
        ],
        edges: [
          [1, 2], [2, 3], [3, 4], [4, 1],
          ["1'", "2'", 'copy'], ["2'", "3'", 'copy']
        ],
        activeNodeId: 3,
        visitedIds: [1, 2, 3],
        activePath: [1, 2, 3],
        queueOrStack: ['DFS(1)', 'DFS(2)', 'DFS(3)'],
        states: {
          currentNode: 3,
          'clonedMap': '{ 1: 1\', 2: 2\', 3: 3\' }',
          activeStack: '[1 -> 2 -> 3]'
        },
        codeSnippet: 'for neighbor in original.neighbors:\n    clone.neighbors.append(dfs(neighbor))',
        impact: 'Time: O(V + E) | Space: O(V) stack depth'
      },
      {
        title: 'DFS to Node 4 & Encounter Already Cloned Neighbor 1',
        whatHappens: 'Visit Node 4: create Clone(4) (cloned[4]=4\'). Link 3\' <-> 4\'. For neighbor 1 of Node 4, lookup in cloned map -> returns existing 1\' without recursing.',
        whyRationale: 'Since 1 is already in `cloned`, DFS immediately returns `cloned[1]`, breaking the cycle and wiring edge 4\' -> 1\'.',
        nodes: [
          { id: 1, label: '1 (Cached)', x: 70, y: 60, status: 'visited' },
          { id: 2, label: '2', x: 270, y: 60, status: 'visited' },
          { id: 3, label: '3', x: 270, y: 160, status: 'visited' },
          { id: 4, label: '4 (Orig)', x: 70, y: 160, status: 'active' },
          { id: "1'", label: "1'", x: 140, y: 60, status: 'visited' },
          { id: "2'", label: "2'", x: 200, y: 60, status: 'visited' },
          { id: "3'", label: "3'", x: 200, y: 160, status: 'visited' },
          { id: "4'", label: "4'", x: 140, y: 160, status: 'active' }
        ],
        edges: [
          [1, 2], [2, 3], [3, 4], [4, 1],
          ["1'", "2'", 'copy'], ["2'", "3'", 'copy'], ["3'", "4'", 'copy'], ["4'", "1'", 'copy']
        ],
        activeNodeId: 4,
        visitedIds: [1, 2, 3, 4],
        queueOrStack: ['DFS(1)', 'DFS(2)', 'DFS(3)', 'DFS(4)'],
        states: {
          currentNode: 4,
          'clonedMap[1]': '1\' (Exists)',
          'cyclePrevented': true
        },
        codeSnippet: 'if original in cloned:\n    return cloned[original]',
        impact: 'Time: O(1) hash lookup prevents infinite recursion'
      },
      {
        title: 'Deep Copy Complete & Return Root Clone',
        whatHappens: 'All DFS calls unwind. Every node (1, 2, 3, 4) has an independent cloned counterpart (1\', 2\', 3\', 4\') with identical adjacency connections. Return Clone(1).',
        whyRationale: 'The returned graph is an exact isomorphic deep copy; no node references point to the original graph.',
        nodes: [
          { id: "1'", label: "1' (Root)", x: 90, y: 60, status: 'target' },
          { id: "2'", label: "2'", x: 250, y: 60, status: 'target' },
          { id: "3'", label: "3'", x: 250, y: 160, status: 'target' },
          { id: "4'", label: "4'", x: 90, y: 160, status: 'target' }
        ],
        edges: [
          ["1'", "2'"], ["2'", "3'"], ["3'", "4'"], ["4'", "1'"]
        ],
        activeNodeId: "1'",
        visitedIds: ["1'", "2'", "3'", "4'"],
        states: {
          totalClonedNodes: 4,
          isDeepCopy: true,
          returnedNode: "1'"
        },
        codeSnippet: 'return dfs(node)',
        impact: 'Total Time: O(V + E) | Total Space: O(V)'
      }
    ]
  },

  '23_Graph/02-flood-fill': {
    type: 'matrix',
    steps: [
      {
        title: 'Initialize Flood Fill at (sr=1, sc=1)',
        whatHappens: 'Check starting pixel (1, 1). Original color = 1, target newColor = 2. Since originalColor != newColor, initiate DFS/BFS traversal.',
        whyRationale: 'If originalColor == newColor, flood fill would do nothing and could trigger infinite loops without visited tracking. Early exit check is required.',
        grid: [
          [1, 1, 1],
          [1, 1, 0],
          [1, 0, 1]
        ],
        activeCell: [1, 1],
        highlightCells: [[1, 1]],
        states: {
          sr: 1,
          sc: 1,
          originalColor: 1,
          newColor: 2
        },
        codeSnippet: 'originalColor = image[sr][sc]\nif originalColor == newColor: return image',
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Recolor Center (1,1) -> 2 & Expand 4 Directions',
        whatHappens: 'Set image[1][1] = 2. Explore 4 adjacent neighbors: Up (0,1), Down (2,1 is 0 - stop), Left (1,0 is 1), Right (1,2 is 0 - stop).',
        whyRationale: 'Changing the color directly in the image array serves as an in-place visited marker.',
        grid: [
          [1, 1, 1],
          [1, 2, 0],
          [1, 0, 1]
        ],
        activeCell: [1, 1],
        highlightCells: [[0, 1], [1, 0]],
        states: {
          'image[1][1]': 2,
          activeNeighbors: '[(0,1), (1,0)]',
          ignoredNeighbors: '[(2,1)=0, (1,2)=0]'
        },
        codeSnippet: 'image[i][j] = newColor\ndfs(i-1, j); dfs(i+1, j)\ndfs(i, j-1); dfs(i, j+1)',
        impact: 'Time: O(1) per pixel'
      },
      {
        title: 'Fill Upper Row (0,1), (0,0), (0,2) with Color 2',
        whatHappens: 'DFS moves to (0,1) -> sets to 2. Expands to left (0,0) -> sets to 2. Expands to right (0,2) -> sets to 2.',
        whyRationale: 'All these pixels share the original color 1 and form a connected component in the top row.',
        grid: [
          [2, 2, 2],
          [1, 2, 0],
          [1, 0, 1]
        ],
        activeCell: [0, 1],
        highlightCells: [[0, 0], [0, 1], [0, 2]],
        states: {
          coloredPixels: 4,
          currentRegion: 'Row 0'
        },
        codeSnippet: 'if image[i][j] == originalColor:\n    image[i][j] = newColor',
        impact: 'Time: O(1) per step'
      },
      {
        title: 'Fill Left Column (1,0) and (2,0) with Color 2',
        whatHappens: 'DFS continues to (1,0) -> 2, then down to (2,0) -> 2. Note: pixel (2,2) remains 1 because water/0 at (2,1) and (1,2) blocks connection.',
        whyRationale: 'Flood fill only affects 4-directionally connected pixels with the matching starting color.',
        grid: [
          [2, 2, 2],
          [2, 2, 0],
          [2, 0, 1]
        ],
        activeCell: [2, 0],
        highlightCells: [[1, 0], [2, 0]],
        states: {
          'image[2][0]': 2,
          'isolatedPixel(2,2)': 'remains 1 (disconnected)'
        },
        codeSnippet: 'dfs(sr, sc)\nreturn image',
        impact: 'Time: O(M × N) | Space: O(M × N) call stack'
      }
    ]
  },

  '23_Graph/03-number-of-islands': {
    type: 'matrix',
    steps: [
      {
        title: 'Start Grid Scan: Discover Island 1 at (0,0)',
        whatHappens: 'Scan row-by-row. At (0,0), encounter land \'1\'. Increment islandCount = 1. Launch DFS to sink all connected land of this island.',
        whyRationale: 'Every unvisited \'1\' represents the root of a new connected component. Sinking visited land to \'0\' prevents recounting.',
        grid: [
          ['1', '1', '0', '0', '0'],
          ['1', '1', '0', '0', '0'],
          ['0', '0', '1', '0', '0'],
          ['0', '0', '0', '1', '1']
        ],
        activeCell: [0, 0],
        highlightCells: [[0, 0], [0, 1], [1, 0], [1, 1]],
        states: {
          islandCount: 1,
          currentPos: '(0,0)',
          action: 'Found new island'
        },
        codeSnippet: 'if grid[i][j] == "1":\n    count += 1\n    dfs(i, j)',
        impact: 'Time: O(1) | Space: O(1)'
      },
      {
        title: 'Sink Island 1 via DFS (Mark 1s to 0s)',
        whatHappens: 'DFS visits and marks (0,0), (0,1), (1,0), (1,1) from \'1\' to \'0\'. Island 1 is completely submerged.',
        whyRationale: 'Mutating land cells to \'0\' eliminates the need for an auxiliary O(M*N) visited boolean grid.',
        grid: [
          ['0', '0', '0', '0', '0'],
          ['0', '0', '0', '0', '0'],
          ['0', '0', '1', '0', '0'],
          ['0', '0', '0', '1', '1']
        ],
        activeCell: [1, 1],
        highlightCells: [[0, 0], [0, 1], [1, 0], [1, 1]],
        states: {
          islandCount: 1,
          island1Size: 4,
          submergedCells: '[(0,0),(0,1),(1,0),(1,1)]'
        },
        codeSnippet: 'grid[i][j] = "0"\nfor di, dj in [(-1,0),(1,0),(0,-1),(0,1)]:\n    dfs(i+di, j+dj)',
        impact: 'Time: O(size of island 1)'
      },
      {
        title: 'Resume Scan: Discover Island 2 at (2,2)',
        whatHappens: 'Continue grid scan until cell (2,2) with value \'1\'. Increment islandCount = 2. DFS sinks cell (2,2) to \'0\'.',
        whyRationale: 'Cell (2,2) has no adjacent land in any 4-direction, making it an isolated single-cell island.',
        grid: [
          ['0', '0', '0', '0', '0'],
          ['0', '0', '0', '0', '0'],
          ['0', '0', '0', '0', '0'],
          ['0', '0', '0', '1', '1']
        ],
        activeCell: [2, 2],
        highlightCells: [[2, 2]],
        states: {
          islandCount: 2,
          currentPos: '(2,2)',
          island2Size: 1
        },
        codeSnippet: 'if grid[i][j] == "1":\n    count += 1\n    dfs(i, j)',
        impact: 'Time: O(1)'
      },
      {
        title: 'Discover Island 3 at (3,3) & Complete Grid Traversal',
        whatHappens: 'Scan reaches (3,3) (\'1\'). Increment islandCount = 3. DFS sinks (3,3) and (3,4) to \'0\'. Grid scan completes with no remaining 1s.',
        whyRationale: 'All grid cells have been scanned. Exactly 3 independent connected components were discovered and counted.',
        grid: [
          ['0', '0', '0', '0', '0'],
          ['0', '0', '0', '0', '0'],
          ['0', '0', '0', '0', '0'],
          ['0', '0', '0', '0', '0']
        ],
        activeCell: [3, 4],
        highlightCells: [[3, 3], [3, 4]],
        states: {
          totalIslands: 3,
          gridTraversed: true,
          result: 3
        },
        codeSnippet: 'return count',
        impact: 'Total Time: O(M × N) | Space: O(M × N) worst-case recursion'
      }
    ]
  },

  '23_Graph/04-number-of-distinct-islands': {
    type: 'matrix',
    steps: [
      {
        title: 'Explore First Island at (0,0) & Record Relative Shape',
        whatHappens: 'Find land at (0,0). Run DFS relative to start (0,0): down to (1,0) (offset +1, 0) and right to (0,1) (offset 0, +1). Shape path = "0,0:1,0:0,1". Add to set.',
        whyRationale: 'Translating cell coordinates relative to the island\'s top-left origin gives an invariant signature for identical island shapes.',
        grid: [
          ['1', '1', '0', '1', '1'],
          ['1', '0', '0', '0', '0'],
          ['0', '0', '0', '0', '1'],
          ['1', '1', '0', '1', '1']
        ],
        activeCell: [0, 0],
        highlightCells: [[0, 0], [0, 1], [1, 0]],
        states: {
          shape1: '(0,0),(0,1),(1,0)',
          distinctSetSize: 1,
          uniqueShapes: '["L-shape-down"]'
        },
        codeSnippet: 'path.append((i - start_i, j - start_j))\ndistinct_islands.add(tuple(path))',
        impact: 'Time: O(island size) | Space: O(island size)'
      },
      {
        title: 'Explore Second Island at (0,3) (Horizontal 1x2)',
        whatHappens: 'Find land at (0,3). DFS covers (0,3) and (0,4). Relative offsets: [(0,0), (0,1)]. Shape is a horizontal 1x2 bar. Add to distinct set.',
        whyRationale: 'Offsets [(0,0), (0,1)] do not match the L-shape in the set, so set size increments to 2.',
        grid: [
          ['0', '0', '0', '1', '1'],
          ['0', '0', '0', '0', '0'],
          ['0', '0', '0', '0', '1'],
          ['1', '1', '0', '1', '1']
        ],
        activeCell: [0, 3],
        highlightCells: [[0, 3], [0, 4]],
        states: {
          shape2: '(0,0),(0,1)',
          distinctSetSize: 2,
          uniqueShapes: '["L-shape", "H-bar"]'
        },
        codeSnippet: 'if shape not in distinct_islands:\n    distinct_islands.add(shape)',
        impact: 'Time: O(1) set insertion'
      },
      {
        title: 'Explore Third Island at (2,4) & Duplicate Island at (3,3)',
        whatHappens: 'At (2,4), single dot [(0,0)] added (count=3). At (3,3), find horizontal 1x2 bar: offsets [(0,0), (0,1)]. This signature is ALREADY in the set!',
        whyRationale: 'Because [(0,0), (0,1)] already exists in the hash set from island 2, the duplicate translated shape is ignored.',
        grid: [
          ['0', '0', '0', '0', '0'],
          ['0', '0', '0', '0', '0'],
          ['0', '0', '0', '0', '1'],
          ['1', '1', '0', '1', '1']
        ],
        activeCell: [3, 3],
        highlightCells: [[3, 3], [3, 4]],
        states: {
          duplicateFound: 'Horizontal bar (3,3)-(3,4)',
          distinctSetSize: 3,
          isDuplicate: true
        },
        codeSnippet: 'distinct_islands.add(path) # Set deduplicates identical shapes',
        impact: 'Time: O(k) hashing'
      },
      {
        title: 'Traversal Complete: Return Number of Distinct Island Shapes',
        whatHappens: 'Grid scan finishes. Total unique island shapes in set = 3 (L-shape, Horizontal-bar, Single-dot). Return 3.',
        whyRationale: 'Rotations/reflections are not considered identical per problem constraints; only pure translations are grouped.',
        grid: [
          ['0', '0', '0', '0', '0'],
          ['0', '0', '0', '0', '0'],
          ['0', '0', '0', '0', '0'],
          ['0', '0', '0', '0', '0']
        ],
        activeCell: [3, 4],
        highlightCells: [],
        states: {
          distinctIslandsCount: 3,
          result: 3
        },
        codeSnippet: 'return len(distinct_islands)',
        impact: 'Total Time: O(M × N) | Total Space: O(M × N)'
      }
    ]
  },

  '23_Graph/05-bfs-of-graph': {
    type: 'graph',
    steps: [
      {
        title: 'Initialize BFS Queue with Source Node 0',
        whatHappens: 'Mark node 0 as visited (visited[0] = true). Enqueue 0 into queue. BFS result list is currently empty [].',
        whyRationale: 'BFS begins at a specified source vertex and uses a FIFO queue to guarantee level-by-level exploration.',
        nodes: [
          { id: 0, label: '0 (Src)', x: 170, y: 40, status: 'active' },
          { id: 1, label: '1', x: 90, y: 110, status: 'default' },
          { id: 2, label: '2', x: 250, y: 110, status: 'default' },
          { id: 3, label: '3', x: 90, y: 180, status: 'default' },
          { id: 4, label: '4', x: 250, y: 180, status: 'default' }
        ],
        edges: [
          [0, 1], [0, 2], [1, 3], [2, 4]
        ],
        activeNodeId: 0,
        visitedIds: [0],
        queueOrStack: [0],
        states: {
          queue: '[0]',
          visited: '[0: true, 1: false, 2: false, 3: false, 4: false]',
          bfsResult: '[]'
        },
        codeSnippet: 'queue = deque([0])\nvisited[0] = True\nresult = []',
        impact: 'Time: O(1) | Space: O(V)'
      },
      {
        title: 'Dequeue Node 0 & Enqueue Level 1 Neighbors [1, 2]',
        whatHappens: 'Pop 0 from queue and append to result [0]. Check neighbors of 0: nodes 1 and 2 are unvisited. Mark both visited and enqueue.',
        whyRationale: 'All direct neighbors of node 0 belong to depth level 1 and must be processed before any depth level 2 nodes.',
        nodes: [
          { id: 0, label: '0', x: 170, y: 40, status: 'visited' },
          { id: 1, label: '1 (L1)', x: 90, y: 110, status: 'active' },
          { id: 2, label: '2 (L1)', x: 250, y: 110, status: 'active' },
          { id: 3, label: '3', x: 90, y: 180, status: 'default' },
          { id: 4, label: '4', x: 250, y: 180, status: 'default' }
        ],
        edges: [
          [0, 1], [0, 2], [1, 3], [2, 4]
        ],
        activeNodeId: 0,
        visitedIds: [0, 1, 2],
        queueOrStack: [1, 2],
        states: {
          popped: 0,
          queue: '[1, 2]',
          bfsResult: '[0]'
        },
        codeSnippet: 'node = queue.popleft()\nresult.append(node)\nfor neighbor in adj[node]:\n    if not visited[neighbor]: queue.append(neighbor)',
        impact: 'Time: O(deg(0))'
      },
      {
        title: 'Process Level 1: Dequeue Node 1 & Enqueue Node 3',
        whatHappens: 'Pop 1 from queue -> result = [0, 1]. Neighbor 0 is already visited. Unvisited neighbor 3 is marked visited and enqueued.',
        whyRationale: 'FIFO order ensures node 2 (also at level 1) is next in line to be dequeued before level 2 neighbor 3.',
        nodes: [
          { id: 0, label: '0', x: 170, y: 40, status: 'visited' },
          { id: 1, label: '1', x: 90, y: 110, status: 'visited' },
          { id: 2, label: '2', x: 250, y: 110, status: 'active' },
          { id: 3, label: '3 (L2)', x: 90, y: 180, status: 'active' },
          { id: 4, label: '4', x: 250, y: 180, status: 'default' }
        ],
        edges: [
          [0, 1], [0, 2], [1, 3], [2, 4]
        ],
        activeNodeId: 1,
        visitedIds: [0, 1, 2, 3],
        queueOrStack: [2, 3],
        states: {
          popped: 1,
          queue: '[2, 3]',
          bfsResult: '[0, 1]'
        },
        codeSnippet: 'visited[neighbor] = True\nqueue.append(neighbor)',
        impact: 'Time: O(deg(1))'
      },
      {
        title: 'Process Node 2 & Enqueue Level 2 Neighbor 4',
        whatHappens: 'Pop 2 -> result = [0, 1, 2]. Unvisited neighbor 4 is marked visited and added to queue. Queue now contains level 2 nodes [3, 4].',
        whyRationale: 'Level 1 is now fully processed. Queue strictly contains level 2 vertices.',
        nodes: [
          { id: 0, label: '0', x: 170, y: 40, status: 'visited' },
          { id: 1, label: '1', x: 90, y: 110, status: 'visited' },
          { id: 2, label: '2', x: 250, y: 110, status: 'visited' },
          { id: 3, label: '3', x: 90, y: 180, status: 'active' },
          { id: 4, label: '4 (L2)', x: 250, y: 180, status: 'active' }
        ],
        edges: [
          [0, 1], [0, 2], [1, 3], [2, 4]
        ],
        activeNodeId: 2,
        visitedIds: [0, 1, 2, 3, 4],
        queueOrStack: [3, 4],
        states: {
          popped: 2,
          queue: '[3, 4]',
          bfsResult: '[0, 1, 2]'
        },
        codeSnippet: 'result.append(node)',
        impact: 'Time: O(deg(2))'
      },
      {
        title: 'Dequeue Level 2 Nodes (3, 4) & Complete BFS',
        whatHappens: 'Pop 3 -> append to result. Pop 4 -> append to result. Neither has unvisited neighbors. Queue is empty. Return [0, 1, 2, 3, 4].',
        whyRationale: 'Every reachable vertex has been visited exactly once in non-decreasing order of shortest distance from source 0.',
        nodes: [
          { id: 0, label: '0', x: 170, y: 40, status: 'target' },
          { id: 1, label: '1', x: 90, y: 110, status: 'target' },
          { id: 2, label: '2', x: 250, y: 110, status: 'target' },
          { id: 3, label: '3', x: 90, y: 180, status: 'target' },
          { id: 4, label: '4', x: 250, y: 180, status: 'target' }
        ],
        edges: [
          [0, 1], [0, 2], [1, 3], [2, 4]
        ],
        activeNodeId: 4,
        visitedIds: [0, 1, 2, 3, 4],
        queueOrStack: [],
        states: {
          finalBFSOrder: '[0, 1, 2, 3, 4]',
          queue: '[] (Empty)'
        },
        codeSnippet: 'return result',
        impact: 'Total Time: O(V + E) | Total Space: O(V)'
      }
    ]
  },

  '23_Graph/06-detect-cycle-in-directed-graph': {
    type: 'graph',
    steps: [
      {
        title: 'Initialize 3-Color States & Start DFS at Node 0',
        whatHappens: 'Colors: 0=WHITE (unvisited), 1=GRAY (currently on recursion stack), 2=BLACK (fully processed). Start DFS at node 0 -> mark color[0] = GRAY.',
        whyRationale: 'In a directed graph, a cycle exists if and only if a back-edge points to an ancestor currently on the recursion call stack (GRAY).',
        nodes: [
          { id: 0, label: '0 (GRAY)', x: 50, y: 100, status: 'active' },
          { id: 1, label: '1 (WHITE)', x: 130, y: 100, status: 'default' },
          { id: 2, label: '2 (WHITE)', x: 230, y: 50, status: 'default' },
          { id: 3, label: '3 (WHITE)', x: 230, y: 150, status: 'default' }
        ],
        edges: [
          [0, 1, '→'], [1, 2, '→'], [2, 3, '→'], [3, 1, '→']
        ],
        activeNodeId: 0,
        visitedIds: [0],
        queueOrStack: ['dfs(0)'],
        states: {
          'color[0]': 'GRAY (In Stack)',
          'color[1..3]': 'WHITE',
          activeStack: '[0]'
        },
        codeSnippet: 'color[node] = GRAY\nfor neighbor in adj[node]:\n    if color[neighbor] == GRAY: return True',
        impact: 'Time: O(1) | Space: O(V)'
      },
      {
        title: 'Traverse 0 -> 1 -> 2: Mark Nodes GRAY',
        whatHappens: 'From 0, visit neighbor 1 (color[1]=GRAY). From 1, visit neighbor 2 (color[2]=GRAY). Current recursion stack is [0, 1, 2].',
        whyRationale: 'All 3 vertices are actively being processed simultaneously along the current directed exploration path.',
        nodes: [
          { id: 0, label: '0 (GRAY)', x: 50, y: 100, status: 'visited' },
          { id: 1, label: '1 (GRAY)', x: 130, y: 100, status: 'visited' },
          { id: 2, label: '2 (GRAY)', x: 230, y: 50, status: 'active' },
          { id: 3, label: '3 (WHITE)', x: 230, y: 150, status: 'default' }
        ],
        edges: [
          [0, 1, '→'], [1, 2, '→'], [2, 3, '→'], [3, 1, '→']
        ],
        activeNodeId: 2,
        visitedIds: [0, 1, 2],
        activePath: [0, 1, 2],
        queueOrStack: ['dfs(0)', 'dfs(1)', 'dfs(2)'],
        states: {
          activeStack: '[0 -> 1 -> 2]',
          nextNeighbor: '3'
        },
        codeSnippet: 'if color[neighbor] == WHITE:\n    if dfs(neighbor): return True',
        impact: 'Time: O(1) per edge'
      },
      {
        title: 'Traverse 2 -> 3: Mark Node 3 GRAY',
        whatHappens: 'From 2, visit neighbor 3. Mark color[3] = GRAY. Stack is [0, 1, 2, 3]. Node 3 inspects its outgoing edges: edge 3 -> 1.',
        whyRationale: 'Node 3 will now check neighbor 1. We must verify the color state of node 1.',
        nodes: [
          { id: 0, label: '0 (GRAY)', x: 50, y: 100, status: 'visited' },
          { id: 1, label: '1 (GRAY)', x: 130, y: 100, status: 'visited' },
          { id: 2, label: '2 (GRAY)', x: 230, y: 50, status: 'visited' },
          { id: 3, label: '3 (GRAY)', x: 230, y: 150, status: 'active' }
        ],
        edges: [
          [0, 1, '→'], [1, 2, '→'], [2, 3, '→'], [3, 1, '→']
        ],
        activeNodeId: 3,
        visitedIds: [0, 1, 2, 3],
        activePath: [0, 1, 2, 3],
        queueOrStack: ['dfs(0)', 'dfs(1)', 'dfs(2)', 'dfs(3)'],
        states: {
          activeStack: '[0 -> 1 -> 2 -> 3]',
          evaluatingEdge: '3 -> 1'
        },
        codeSnippet: 'color[node] = GRAY',
        impact: 'Time: O(1)'
      },
      {
        title: 'Back-Edge Detected: Neighbor 1 is GRAY -> Cycle Found!',
        whatHappens: 'Node 3 examines neighbor 1: color[1] == GRAY (active in current recursion stack!). This back-edge closes the cycle 1 -> 2 -> 3 -> 1. Return True.',
        whyRationale: 'Re-encountering a GRAY vertex proves that a path exists from node 1 back to node 1 through directed edges.',
        nodes: [
          { id: 0, label: '0', x: 50, y: 100, status: 'visited' },
          { id: 1, label: '1 (CYCLE)', x: 130, y: 100, status: 'target' },
          { id: 2, label: '2 (CYCLE)', x: 230, y: 50, status: 'target' },
          { id: 3, label: '3 (CYCLE)', x: 230, y: 150, status: 'target' }
        ],
        edges: [
          [0, 1, '→'], [1, 2, 'cycle'], [2, 3, 'cycle'], [3, 1, 'BACK-EDGE']
        ],
        activeNodeId: 1,
        visitedIds: [1, 2, 3],
        activePath: [1, 2, 3, 1],
        states: {
          'color[1]': 'GRAY (Cycle Trigger)',
          cyclePath: '1 -> 2 -> 3 -> 1',
          hasCycle: true
        },
        codeSnippet: 'if color[neighbor] == GRAY:\n    return True  # Cycle detected!',
        impact: 'Total Time: O(V + E) | Total Space: O(V)'
      }
    ]
  },

  '23_Graph/07-detect-cycle-in-undirected-graph': {
    type: 'graph',
    steps: [
      {
        title: 'Start DFS at Node 0 with parent = -1',
        whatHappens: 'Mark node 0 as visited (visited[0]=true). Recursion call dfs(node=0, parent=-1). Explore neighbors of 0 (node 1).',
        whyRationale: 'In undirected graphs, tracking the immediate parent prevents falsely identifying the bidirectional edge back to the caller as a cycle.',
        nodes: [
          { id: 0, label: '0 (p:-1)', x: 50, y: 100, status: 'active' },
          { id: 1, label: '1', x: 120, y: 100, status: 'default' },
          { id: 2, label: '2', x: 190, y: 50, status: 'default' },
          { id: 3, label: '3', x: 270, y: 100, status: 'default' },
          { id: 4, label: '4', x: 190, y: 150, status: 'default' }
        ],
        edges: [
          [0, 1], [1, 2], [2, 3], [3, 4], [4, 1]
        ],
        activeNodeId: 0,
        visitedIds: [0],
        queueOrStack: ['dfs(0, -1)'],
        states: {
          currentNode: 0,
          parent: -1,
          visited: '[0: T, 1: F, 2: F, 3: F, 4: F]'
        },
        codeSnippet: 'visited[node] = True\nfor neighbor in adj[node]:\n    if not visited[neighbor]: dfs(neighbor, node)',
        impact: 'Time: O(1) | Space: O(V)'
      },
      {
        title: 'Traverse 0 -> 1 -> 2 -> 3 along DFS Path',
        whatHappens: 'DFS advances: dfs(1, parent=0) -> dfs(2, parent=1) -> dfs(3, parent=2). Mark 1, 2, 3 as visited. Stack depth = 4.',
        whyRationale: 'Each step ignores the edge leading back to the immediate parent vertex while exploring new unvisited vertices.',
        nodes: [
          { id: 0, label: '0', x: 50, y: 100, status: 'visited' },
          { id: 1, label: '1 (p:0)', x: 120, y: 100, status: 'visited' },
          { id: 2, label: '2 (p:1)', x: 190, y: 50, status: 'visited' },
          { id: 3, label: '3 (p:2)', x: 270, y: 100, status: 'active' },
          { id: 4, label: '4', x: 190, y: 150, status: 'default' }
        ],
        edges: [
          [0, 1], [1, 2], [2, 3], [3, 4], [4, 1]
        ],
        activeNodeId: 3,
        visitedIds: [0, 1, 2, 3],
        activePath: [0, 1, 2, 3],
        queueOrStack: ['dfs(0,-1)', 'dfs(1,0)', 'dfs(2,1)', 'dfs(3,2)'],
        states: {
          currentNode: 3,
          parent: 2,
          activePath: '0-1-2-3'
        },
        codeSnippet: 'if not visited[neighbor]:\n    if dfs(neighbor, node): return True',
        impact: 'Time: O(1) per node'
      },
      {
        title: 'DFS Advances to Node 4: dfs(4, parent=3)',
        whatHappens: 'From 3, visit unvisited neighbor 4 (visited[4]=true, parent=3). Node 4 checks its neighbors: [3, 1]. Neighbor 3 is the parent (ignored).',
        whyRationale: 'Neighbor 3 is skipped because 3 is node 4\'s parent. Now node 4 evaluates neighbor 1.',
        nodes: [
          { id: 0, label: '0', x: 50, y: 100, status: 'visited' },
          { id: 1, label: '1', x: 120, y: 100, status: 'visited' },
          { id: 2, label: '2', x: 190, y: 50, status: 'visited' },
          { id: 3, label: '3', x: 270, y: 100, status: 'visited' },
          { id: 4, label: '4 (p:3)', x: 190, y: 150, status: 'active' }
        ],
        edges: [
          [0, 1], [1, 2], [2, 3], [3, 4], [4, 1]
        ],
        activeNodeId: 4,
        visitedIds: [0, 1, 2, 3, 4],
        activePath: [1, 2, 3, 4],
        queueOrStack: ['dfs(1,0)', 'dfs(2,1)', 'dfs(3,2)', 'dfs(4,3)'],
        states: {
          currentNode: 4,
          parent: 3,
          evaluatingNeighbor: 1
        },
        codeSnippet: 'elif neighbor != parent:\n    return True',
        impact: 'Time: O(1)'
      },
      {
        title: 'Neighbor 1 Visited & 1 != Parent (3) -> Cycle Detected!',
        whatHappens: 'Node 4 inspects neighbor 1: visited[1] == true AND neighbor 1 != parent 3. A second distinct path connects 4 to 1. Cycle 1-2-3-4-1 confirmed!',
        whyRationale: 'Meeting an already visited vertex that is NOT our parent means an alternate path exists in the undirected graph, forming a cycle.',
        nodes: [
          { id: 0, label: '0', x: 50, y: 100, status: 'visited' },
          { id: 1, label: '1 (Cycle)', x: 120, y: 100, status: 'target' },
          { id: 2, label: '2 (Cycle)', x: 190, y: 50, status: 'target' },
          { id: 3, label: '3 (Cycle)', x: 270, y: 100, status: 'target' },
          { id: 4, label: '4 (Cycle)', x: 190, y: 150, status: 'target' }
        ],
        edges: [
          [0, 1], [1, 2, 'cycle'], [2, 3, 'cycle'], [3, 4, 'cycle'], [4, 1, 'CYCLE-EDGE']
        ],
        activeNodeId: 4,
        visitedIds: [1, 2, 3, 4],
        activePath: [1, 2, 3, 4, 1],
        states: {
          cycleFound: true,
          cycleMembers: '[1, 2, 3, 4]',
          result: true
        },
        codeSnippet: 'elif neighbor != parent:\n    return True  # Undirected cycle found',
        impact: 'Total Time: O(V + E) | Total Space: O(V)'
      }
    ]
  },

  '23_Graph/08-topological-sort': {
    type: 'graph',
    steps: [
      {
        title: 'Calculate In-Degrees & Enqueue In-Degree 0 Nodes',
        whatHappens: 'Graph with 6 nodes. In-degrees: {0:2, 1:2, 2:1, 3:1, 4:0, 5:0}. Nodes 4 and 5 have in-degree 0 (no prerequisites). Push into queue = [4, 5].',
        whyRationale: 'Kahn\'s algorithm processes vertices with 0 in-degree first because they have zero unresolved dependencies.',
        nodes: [
          { id: 5, label: '5 (in:0)', x: 60, y: 50, status: 'active' },
          { id: 4, label: '4 (in:0)', x: 60, y: 150, status: 'active' },
          { id: 2, label: '2 (in:1)', x: 150, y: 50, status: 'default' },
          { id: 0, label: '0 (in:2)', x: 150, y: 150, status: 'default' },
          { id: 3, label: '3 (in:1)', x: 250, y: 50, status: 'default' },
          { id: 1, label: '1 (in:2)', x: 250, y: 150, status: 'default' }
        ],
        edges: [
          [5, 0, '→'], [5, 2, '→'], [4, 0, '→'], [4, 1, '→'], [2, 3, '→'], [3, 1, '→']
        ],
        activeNodeId: 4,
        visitedIds: [4, 5],
        queueOrStack: [4, 5],
        states: {
          inDegrees: '{0:2, 1:2, 2:1, 3:1, 4:0, 5:0}',
          queue: '[4, 5]',
          topoOrder: '[]'
        },
        codeSnippet: 'in_degree = [0] * V\nfor i in range(V): for v in adj[i]: in_degree[v] += 1\nqueue = deque([i for i in range(V) if in_degree[i] == 0])',
        impact: 'Time: O(V + E) | Space: O(V)'
      },
      {
        title: 'Process Node 4 & Node 5: Decrement Dependent In-Degrees',
        whatHappens: 'Pop 4 -> topo = [4]. Decr inDegree[0] (2->1), inDegree[1] (2->1). Pop 5 -> topo = [4, 5]. Decr inDegree[0] (1->0 -> push 0), inDegree[2] (1->0 -> push 2).',
        whyRationale: 'Removing completed tasks satisfies dependencies for downstream nodes, reducing their in-degree to 0.',
        nodes: [
          { id: 5, label: '5', x: 60, y: 50, status: 'visited' },
          { id: 4, label: '4', x: 60, y: 150, status: 'visited' },
          { id: 2, label: '2 (in:0)', x: 150, y: 50, status: 'active' },
          { id: 0, label: '0 (in:0)', x: 150, y: 150, status: 'active' },
          { id: 3, label: '3 (in:1)', x: 250, y: 50, status: 'default' },
          { id: 1, label: '1 (in:1)', x: 250, y: 150, status: 'default' }
        ],
        edges: [
          [5, 0, '✓'], [5, 2, '✓'], [4, 0, '✓'], [4, 1, '✓'], [2, 3, '→'], [3, 1, '→']
        ],
        activeNodeId: 5,
        visitedIds: [4, 5, 0, 2],
        queueOrStack: [0, 2],
        states: {
          topoOrder: '[4, 5]',
          queue: '[0, 2]',
          'inDegree[0]': 0,
          'inDegree[2]': 0
        },
        codeSnippet: 'in_degree[neighbor] -= 1\nif in_degree[neighbor] == 0:\n    queue.append(neighbor)',
        impact: 'Time: O(deg(4) + deg(5))'
      },
      {
        title: 'Process Node 0 & Node 2: Unlock Node 3',
        whatHappens: 'Pop 0 (no outgoing edges) -> topo = [4, 5, 0]. Pop 2 -> topo = [4, 5, 0, 2]. Decrement inDegree[3] (1 -> 0). Enqueue 3 into queue = [3].',
        whyRationale: 'Node 2 was the only prerequisite for node 3, so node 3 is now ready for processing.',
        nodes: [
          { id: 5, label: '5', x: 60, y: 50, status: 'visited' },
          { id: 4, label: '4', x: 60, y: 150, status: 'visited' },
          { id: 2, label: '2', x: 150, y: 50, status: 'visited' },
          { id: 0, label: '0', x: 150, y: 150, status: 'visited' },
          { id: 3, label: '3 (in:0)', x: 250, y: 50, status: 'active' },
          { id: 1, label: '1 (in:1)', x: 250, y: 150, status: 'default' }
        ],
        edges: [
          [5, 0], [5, 2], [4, 0], [4, 1], [2, 3, '✓'], [3, 1, '→']
        ],
        activeNodeId: 2,
        visitedIds: [4, 5, 0, 2, 3],
        queueOrStack: [3],
        states: {
          topoOrder: '[4, 5, 0, 2]',
          queue: '[3]',
          'inDegree[3]': 0
        },
        codeSnippet: 'node = queue.popleft()\nresult.append(node)',
        impact: 'Time: O(1)'
      },
      {
        title: 'Process Node 3 & Node 1: Complete Valid Topological Sort',
        whatHappens: 'Pop 3 -> topo = [4, 5, 0, 2, 3]. Decr inDegree[1] (1 -> 0 -> push 1). Pop 1 -> topo = [4, 5, 0, 2, 3, 1]. All 6 vertices sorted!',
        whyRationale: 'Every edge u -> v satisfies u appearing before v in the output array. Return [4, 5, 0, 2, 3, 1].',
        nodes: [
          { id: 5, label: '5', x: 60, y: 50, status: 'target' },
          { id: 4, label: '4', x: 60, y: 150, status: 'target' },
          { id: 2, label: '2', x: 150, y: 50, status: 'target' },
          { id: 0, label: '0', x: 150, y: 150, status: 'target' },
          { id: 3, label: '3', x: 250, y: 50, status: 'target' },
          { id: 1, label: '1', x: 250, y: 150, status: 'target' }
        ],
        edges: [
          [5, 0], [5, 2], [4, 0], [4, 1], [2, 3], [3, 1]
        ],
        activeNodeId: 1,
        visitedIds: [5, 4, 2, 0, 3, 1],
        queueOrStack: [],
        states: {
          finalTopologicalOrder: '[4, 5, 0, 2, 3, 1]',
          validDAG: true
        },
        codeSnippet: 'return result',
        impact: 'Total Time: O(V + E) | Total Space: O(V)'
      }
    ]
  },

  '23_Graph/09-course-schedule': {
    type: 'graph',
    steps: [
      {
        title: 'Construct Dependency Graph & In-Degree Counts',
        whatHappens: '4 courses (0..3). Prerequisites: 0->1, 0->2, 1->3, 2->3. In-degrees: {0:0, 1:1, 2:1, 3:2}. Course 0 has 0 prerequisites -> enqueue 0.',
        whyRationale: 'Course schedule is solvable if and only if the prerequisite graph is a DAG (no cycle). Kahn\'s BFS will verify this.',
        nodes: [
          { id: 0, label: '0 (in:0)', x: 60, y: 100, status: 'active' },
          { id: 1, label: '1 (in:1)', x: 160, y: 50, status: 'default' },
          { id: 2, label: '2 (in:1)', x: 160, y: 150, status: 'default' },
          { id: 3, label: '3 (in:2)', x: 260, y: 100, status: 'default' }
        ],
        edges: [
          [0, 1, '→'], [0, 2, '→'], [1, 3, '→'], [2, 3, '→']
        ],
        activeNodeId: 0,
        visitedIds: [0],
        queueOrStack: [0],
        states: {
          inDegrees: '{0:0, 1:1, 2:1, 3:2}',
          queue: '[0]',
          coursesTaken: 0
        },
        codeSnippet: 'for course, prereq in prerequisites:\n    adj[prereq].append(course)\n    in_degree[course] += 1',
        impact: 'Time: O(V + E) | Space: O(V + E)'
      },
      {
        title: 'Take Course 0: Unlock Courses 1 & 2',
        whatHappens: 'Pop 0 -> coursesTaken = 1. Decrement inDegree[1] (1->0) and inDegree[2] (1->0). Both courses 1 and 2 are ready -> push to queue = [1, 2].',
        whyRationale: 'Completing course 0 satisfies prerequisites for both course 1 and course 2.',
        nodes: [
          { id: 0, label: '0 (Done)', x: 60, y: 100, status: 'visited' },
          { id: 1, label: '1 (Ready)', x: 160, y: 50, status: 'active' },
          { id: 2, label: '2 (Ready)', x: 160, y: 150, status: 'active' },
          { id: 3, label: '3 (in:2)', x: 260, y: 100, status: 'default' }
        ],
        edges: [
          [0, 1, '✓'], [0, 2, '✓'], [1, 3, '→'], [2, 3, '→']
        ],
        activeNodeId: 0,
        visitedIds: [0, 1, 2],
        queueOrStack: [1, 2],
        states: {
          coursesTaken: 1,
          queue: '[1, 2]',
          'inDegree[1]': 0,
          'inDegree[2]': 0
        },
        codeSnippet: 'for next_course in adj[course]:\n    in_degree[next_course] -= 1\n    if in_degree[next_course] == 0: queue.append(next_course)',
        impact: 'Time: O(deg(0))'
      },
      {
        title: 'Take Courses 1 & 2: Unlock Final Course 3',
        whatHappens: 'Pop 1 (coursesTaken = 2), decr inDegree[3] (2->1). Pop 2 (coursesTaken = 3), decr inDegree[3] (1->0 -> push 3). Queue = [3].',
        whyRationale: 'Both prerequisites for course 3 are now complete, bringing inDegree[3] to 0.',
        nodes: [
          { id: 0, label: '0', x: 60, y: 100, status: 'visited' },
          { id: 1, label: '1', x: 160, y: 50, status: 'visited' },
          { id: 2, label: '2', x: 160, y: 150, status: 'visited' },
          { id: 3, label: '3 (Ready)', x: 260, y: 100, status: 'active' }
        ],
        edges: [
          [0, 1], [0, 2], [1, 3, '✓'], [2, 3, '✓']
        ],
        activeNodeId: 2,
        visitedIds: [0, 1, 2, 3],
        queueOrStack: [3],
        states: {
          coursesTaken: 3,
          queue: '[3]',
          'inDegree[3]': 0
        },
        codeSnippet: 'course = queue.popleft()\ncount += 1',
        impact: 'Time: O(1)'
      },
      {
        title: 'Take Course 3 & Confirm All Courses Can Be Finished',
        whatHappens: 'Pop 3 -> coursesTaken = 4. Queue is empty. coursesTaken == numCourses (4 == 4). No deadlocks or cycles. Return True.',
        whyRationale: 'Since the total number of processed nodes equals numCourses, a topological ordering exists and all courses can be completed.',
        nodes: [
          { id: 0, label: '0', x: 60, y: 100, status: 'target' },
          { id: 1, label: '1', x: 160, y: 50, status: 'target' },
          { id: 2, label: '2', x: 160, y: 150, status: 'target' },
          { id: 3, label: '3', x: 260, y: 100, status: 'target' }
        ],
        edges: [
          [0, 1], [0, 2], [1, 3], [2, 3]
        ],
        activeNodeId: 3,
        visitedIds: [0, 1, 2, 3],
        queueOrStack: [],
        states: {
          coursesTaken: 4,
          numCourses: 4,
          canFinishAll: true
        },
        codeSnippet: 'return count == numCourses',
        impact: 'Total Time: O(V + E) | Total Space: O(V + E)'
      }
    ]
  },

  '23_Graph/10-shortest-path-in-undirected-graph': {
    type: 'graph',
    steps: [
      {
        title: 'Initialize Distances with -1 & Enqueue Source Node 0',
        whatHappens: 'Distances: dist = [0: 0, 1: -1, 2: -1, 3: -1, 4: -1]. Source S=0, Destination D=4. Enqueue 0 into queue = [0].',
        whyRationale: 'Unweighted graphs have equal edge weights (w=1). BFS naturally discovers the shortest path to every node in order of edge count.',
        nodes: [
          { id: 0, label: '0 (d:0)', x: 50, y: 100, status: 'active' },
          { id: 1, label: '1 (d:-1)', x: 130, y: 40, status: 'default' },
          { id: 2, label: '2 (d:-1)', x: 130, y: 160, status: 'default' },
          { id: 3, label: '3 (d:-1)', x: 230, y: 40, status: 'default' },
          { id: 4, label: '4 (d:-1)', x: 250, y: 150, status: 'default' }
        ],
        edges: [
          [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4]
        ],
        activeNodeId: 0,
        visitedIds: [0],
        queueOrStack: [0],
        states: {
          'dist[0]': 0,
          'dist[1..4]': -1,
          queue: '[0]',
          target: 4
        },
        codeSnippet: 'distances = [-1] * V\ndistances[S] = 0\nqueue = deque([S])',
        impact: 'Time: O(1) | Space: O(V)'
      },
      {
        title: 'Explore Neighbors of Node 0: Set dist[1]=1, dist[2]=1',
        whatHappens: 'Pop 0. Explore neighbors 1 and 2: dist[1] = 0 + 1 = 1, dist[2] = 0 + 1 = 1. Enqueue both -> queue = [1, 2].',
        whyRationale: 'Level 1 discovery sets distance = dist[parent] + 1 for all unvisited neighbors.',
        nodes: [
          { id: 0, label: '0 (d:0)', x: 50, y: 100, status: 'visited' },
          { id: 1, label: '1 (d:1)', x: 130, y: 40, status: 'active' },
          { id: 2, label: '2 (d:1)', x: 130, y: 160, status: 'active' },
          { id: 3, label: '3 (d:-1)', x: 230, y: 40, status: 'default' },
          { id: 4, label: '4 (d:-1)', x: 250, y: 150, status: 'default' }
        ],
        edges: [
          [0, 1, 'd=1'], [0, 2, 'd=1'], [1, 2], [1, 3], [2, 4], [3, 4]
        ],
        activeNodeId: 0,
        visitedIds: [0, 1, 2],
        queueOrStack: [1, 2],
        states: {
          'dist[1]': 1,
          'dist[2]': 1,
          queue: '[1, 2]'
        },
        codeSnippet: 'for neighbor in adj[node]:\n    if distances[neighbor] == -1:\n        distances[neighbor] = distances[node] + 1\n        queue.append(neighbor)',
        impact: 'Time: O(deg(0))'
      },
      {
        title: 'Explore from Node 1: Set dist[3] = 2',
        whatHappens: 'Pop 1. Neighbor 0 and 2 are already visited (dist != -1). Unvisited neighbor 3 gets dist[3] = dist[1] + 1 = 2. Enqueue 3 -> queue = [2, 3].',
        whyRationale: 'Existing distances are locked upon first visit, guaranteeing minimum distance.',
        nodes: [
          { id: 0, label: '0', x: 50, y: 100, status: 'visited' },
          { id: 1, label: '1', x: 130, y: 40, status: 'visited' },
          { id: 2, label: '2 (d:1)', x: 130, y: 160, status: 'active' },
          { id: 3, label: '3 (d:2)', x: 230, y: 40, status: 'active' },
          { id: 4, label: '4 (d:-1)', x: 250, y: 150, status: 'default' }
        ],
        edges: [
          [0, 1], [0, 2], [1, 2], [1, 3, 'd=2'], [2, 4], [3, 4]
        ],
        activeNodeId: 1,
        visitedIds: [0, 1, 2, 3],
        queueOrStack: [2, 3],
        states: {
          'dist[3]': 2,
          queue: '[2, 3]'
        },
        codeSnippet: 'distances[neighbor] = distances[node] + 1',
        impact: 'Time: O(deg(1))'
      },
      {
        title: 'Explore from Node 2: Reach Destination 4 with dist=2',
        whatHappens: 'Pop 2. Explore neighbor 4: dist[4] = dist[2] + 1 = 2. Target 4 reached along path 0 -> 2 -> 4. Return shortest distance 2.',
        whyRationale: 'The first time destination node 4 is discovered during BFS, its distance is strictly minimal.',
        nodes: [
          { id: 0, label: '0', x: 50, y: 100, status: 'target' },
          { id: 1, label: '1', x: 130, y: 40, status: 'visited' },
          { id: 2, label: '2', x: 130, y: 160, status: 'target' },
          { id: 3, label: '3', x: 230, y: 40, status: 'visited' },
          { id: 4, label: '4 (TARGET)', x: 250, y: 150, status: 'target' }
        ],
        edges: [
          [0, 1], [0, 2, 'path'], [1, 2], [1, 3], [2, 4, 'path'], [3, 4]
        ],
        activeNodeId: 4,
        visitedIds: [0, 1, 2, 3, 4],
        activePath: [0, 2, 4],
        queueOrStack: [3, 4],
        states: {
          'dist[4]': 2,
          shortestPath: '0 -> 2 -> 4',
          result: 2
        },
        codeSnippet: 'return distances[D]',
        impact: 'Total Time: O(V + E) | Total Space: O(V)'
      }
    ]
  },

  '23_Graph/11-word-ladder': {
    type: 'graph',
    steps: [
      {
        title: 'Initialize BFS from beginWord "hit" with Length 1',
        whatHappens: 'beginWord = "hit", endWord = "cog". Dictionary wordSet = {"hot","dot","dog","lot","log","cog"}. Push ("hit", length=1) to queue. visited = {"hit"}.',
        whyRationale: 'We model word transformations as an unweighted graph where an edge exists between words differing by exactly 1 character.',
        nodes: [
          { id: 'hit', label: 'hit (L1)', x: 40, y: 100, status: 'active' },
          { id: 'hot', label: 'hot', x: 100, y: 100, status: 'default' },
          { id: 'dot', label: 'dot', x: 170, y: 50, status: 'default' },
          { id: 'lot', label: 'lot', x: 170, y: 150, status: 'default' },
          { id: 'dog', label: 'dog', x: 240, y: 50, status: 'default' },
          { id: 'log', label: 'log', x: 240, y: 150, status: 'default' },
          { id: 'cog', label: 'cog', x: 300, y: 100, status: 'default' }
        ],
        edges: [
          ['hit', 'hot'], ['hot', 'dot'], ['hot', 'lot'], ['dot', 'dog'], ['lot', 'log'], ['dog', 'cog'], ['log', 'cog']
        ],
        activeNodeId: 'hit',
        visitedIds: ['hit'],
        queueOrStack: ['(hit, 1)'],
        states: {
          currentWord: 'hit',
          length: 1,
          queue: '[("hit", 1)]',
          target: 'cog'
        },
        codeSnippet: 'queue = deque([(beginWord, 1)])\nvisited = {beginWord}',
        impact: 'Time: O(1) | Space: O(N)'
      },
      {
        title: 'Transform "hit" -> "hot" (Length 2)',
        whatHappens: 'Pop ("hit", 1). Mutate characters at indices 0..2 through [a-z]. "hot" matches wordSet. Enqueue ("hot", 2). visited = {"hit", "hot"}.',
        whyRationale: 'Generating 26 * word_length candidate variations per word is much faster (O(26*M)) than comparing against all N words (O(N*M)).',
        nodes: [
          { id: 'hit', label: 'hit', x: 40, y: 100, status: 'visited' },
          { id: 'hot', label: 'hot (L2)', x: 100, y: 100, status: 'active' },
          { id: 'dot', label: 'dot', x: 170, y: 50, status: 'default' },
          { id: 'lot', label: 'lot', x: 170, y: 150, status: 'default' },
          { id: 'dog', label: 'dog', x: 240, y: 50, status: 'default' },
          { id: 'log', label: 'log', x: 240, y: 150, status: 'default' },
          { id: 'cog', label: 'cog', x: 300, y: 100, status: 'default' }
        ],
        edges: [
          ['hit', 'hot', 'h*t'], ['hot', 'dot'], ['hot', 'lot'], ['dot', 'dog'], ['lot', 'log'], ['dog', 'cog'], ['log', 'cog']
        ],
        activeNodeId: 'hot',
        visitedIds: ['hit', 'hot'],
        queueOrStack: ['(hot, 2)'],
        states: {
          popped: 'hit',
          discovered: 'hot',
          length: 2
        },
        codeSnippet: 'for i in range(len(word)):\n    for c in "abcdefghijklmnopqrstuvwxyz":\n        next_word = word[:i] + c + word[i+1:]',
        impact: 'Time: O(26 × M) per word'
      },
      {
        title: 'Transform "hot" -> "dot" and "lot" (Length 3)',
        whatHappens: 'Pop ("hot", 2). Valid transformations: "dot" and "lot". Enqueue ("dot", 3) and ("lot", 3). Mark both visited.',
        whyRationale: 'BFS branches out concurrently across all valid 1-letter shifts at depth level 3.',
        nodes: [
          { id: 'hit', label: 'hit', x: 40, y: 100, status: 'visited' },
          { id: 'hot', label: 'hot', x: 100, y: 100, status: 'visited' },
          { id: 'dot', label: 'dot (L3)', x: 170, y: 50, status: 'active' },
          { id: 'lot', label: 'lot (L3)', x: 170, y: 150, status: 'active' },
          { id: 'dog', label: 'dog', x: 240, y: 50, status: 'default' },
          { id: 'log', label: 'log', x: 240, y: 150, status: 'default' },
          { id: 'cog', label: 'cog', x: 300, y: 100, status: 'default' }
        ],
        edges: [
          ['hit', 'hot'], ['hot', 'dot', '*ot'], ['hot', 'lot', '*ot'], ['dot', 'dog'], ['lot', 'log'], ['dog', 'cog'], ['log', 'cog']
        ],
        activeNodeId: 'hot',
        visitedIds: ['hit', 'hot', 'dot', 'lot'],
        queueOrStack: ['(dot, 3)', '(lot, 3)'],
        states: {
          queue: '[("dot", 3), ("lot", 3)]',
          depth: 3
        },
        codeSnippet: 'if next_word in wordSet and next_word not in visited:\n    visited.add(next_word)\n    queue.append((next_word, length + 1))',
        impact: 'Time: O(M^2 × 26)'
      },
      {
        title: 'Transform to "dog" & "log" (Length 4)',
        whatHappens: 'Pop "dot" -> enqueues ("dog", 4). Pop "lot" -> enqueues ("log", 4). Level 4 nodes queued.',
        whyRationale: 'Moving closer to "cog" along both parallel transformation branches.',
        nodes: [
          { id: 'hit', label: 'hit', x: 40, y: 100, status: 'visited' },
          { id: 'hot', label: 'hot', x: 100, y: 100, status: 'visited' },
          { id: 'dot', label: 'dot', x: 170, y: 50, status: 'visited' },
          { id: 'lot', label: 'lot', x: 170, y: 150, status: 'visited' },
          { id: 'dog', label: 'dog (L4)', x: 240, y: 50, status: 'active' },
          { id: 'log', label: 'log (L4)', x: 240, y: 150, status: 'active' },
          { id: 'cog', label: 'cog', x: 300, y: 100, status: 'default' }
        ],
        edges: [
          ['hit', 'hot'], ['hot', 'dot'], ['hot', 'lot'], ['dot', 'dog', 'do*'], ['lot', 'log', 'lo*'], ['dog', 'cog'], ['log', 'cog']
        ],
        activeNodeId: 'dog',
        visitedIds: ['hit', 'hot', 'dot', 'lot', 'dog', 'log'],
        queueOrStack: ['(dog, 4)', '(log, 4)'],
        states: {
          queue: '[("dog", 4), ("log", 4)]',
          depth: 4
        },
        codeSnippet: 'queue.append((next_word, length + 1))',
        impact: 'Time: O(M^2 × 26)'
      },
      {
        title: 'Reach endWord "cog" & Return Shortest Length 5',
        whatHappens: 'Pop ("dog", 4). Transforming "dog" yields next_word = "cog" (endWord!). Return transformation sequence length = 4 + 1 = 5 ("hit"->"hot"->"dot"->"dog"->"cog").',
        whyRationale: 'BFS guarantees the first time endWord is reached yields the minimum number of transformation steps.',
        nodes: [
          { id: 'hit', label: 'hit', x: 40, y: 100, status: 'target' },
          { id: 'hot', label: 'hot', x: 100, y: 100, status: 'target' },
          { id: 'dot', label: 'dot', x: 170, y: 50, status: 'target' },
          { id: 'lot', label: 'lot', x: 170, y: 150, status: 'visited' },
          { id: 'dog', label: 'dog', x: 240, y: 50, status: 'target' },
          { id: 'log', label: 'log', x: 240, y: 150, status: 'visited' },
          { id: 'cog', label: 'cog (TARGET)', x: 300, y: 100, status: 'target' }
        ],
        edges: [
          ['hit', 'hot', 'path'], ['hot', 'dot', 'path'], ['hot', 'lot'], ['dot', 'dog', 'path'], ['lot', 'log'], ['dog', 'cog', 'path'], ['log', 'cog']
        ],
        activeNodeId: 'cog',
        visitedIds: ['hit', 'hot', 'dot', 'dog', 'cog'],
        activePath: ['hit', 'hot', 'dot', 'dog', 'cog'],
        states: {
          word: 'cog',
          endWord: 'cog',
          shortestLadderLength: 5
        },
        codeSnippet: 'if word == endWord:\n    return length',
        impact: 'Total Time: O(N × M^2 × 26) | Total Space: O(N × M)'
      }
    ]
  },

  '23_Graph/12-word-ladder-ii': {
    type: 'graph',
    steps: [
      {
        title: 'Level-by-Level BFS: Track Predecessor Parent Map',
        whatHappens: 'BFS level 1: "hit" -> "hot". parents["hot"] = ["hit"]. BFS level 2: "hot" -> "dot" and "lot". parents["dot"]=["hot"], parents["lot"]=["hot"].',
        whyRationale: 'To retrieve ALL optimal paths (not just length), we record all parents at the shortest level before adding words to the visited set.',
        nodes: [
          { id: 'hit', label: 'hit (L1)', x: 40, y: 100, status: 'visited' },
          { id: 'hot', label: 'hot (L2)', x: 100, y: 100, status: 'visited' },
          { id: 'dot', label: 'dot (L3)', x: 170, y: 50, status: 'active' },
          { id: 'lot', label: 'lot (L3)', x: 170, y: 150, status: 'active' },
          { id: 'dog', label: 'dog', x: 240, y: 50, status: 'default' },
          { id: 'log', label: 'log', x: 240, y: 150, status: 'default' },
          { id: 'cog', label: 'cog', x: 300, y: 100, status: 'default' }
        ],
        edges: [
          ['hit', 'hot'], ['hot', 'dot'], ['hot', 'lot'], ['dot', 'dog'], ['lot', 'log'], ['dog', 'cog'], ['log', 'cog']
        ],
        activeNodeId: 'hot',
        visitedIds: ['hit', 'hot', 'dot', 'lot'],
        states: {
          'parents["hot"]': '["hit"]',
          'parents["dot"]': '["hot"]',
          'parents["lot"]': '["hot"]'
        },
        codeSnippet: 'parents[next_word].append(word)\nlevel_visited.add(next_word)',
        impact: 'Time: O(N × M^2) | Space: O(N × M)'
      },
      {
        title: 'BFS Level 3: Discover "dog" and "log"',
        whatHappens: 'From "dot" -> "dog" (parents["dog"] = ["dot"]). From "lot" -> "log" (parents["log"] = ["lot"]). Batch update visited at end of level.',
        whyRationale: 'Deferring visited set updates until the end of the entire BFS level permits multiple valid parent links to be recorded.',
        nodes: [
          { id: 'hit', label: 'hit', x: 40, y: 100, status: 'visited' },
          { id: 'hot', label: 'hot', x: 100, y: 100, status: 'visited' },
          { id: 'dot', label: 'dot', x: 170, y: 50, status: 'visited' },
          { id: 'lot', label: 'lot', x: 170, y: 150, status: 'visited' },
          { id: 'dog', label: 'dog (L4)', x: 240, y: 50, status: 'active' },
          { id: 'log', label: 'log (L4)', x: 240, y: 150, status: 'active' },
          { id: 'cog', label: 'cog', x: 300, y: 100, status: 'default' }
        ],
        edges: [
          ['hit', 'hot'], ['hot', 'dot'], ['hot', 'lot'], ['dot', 'dog'], ['lot', 'log'], ['dog', 'cog'], ['log', 'cog']
        ],
        activeNodeId: 'dog',
        visitedIds: ['hit', 'hot', 'dot', 'lot', 'dog', 'log'],
        states: {
          'parents["dog"]': '["dot"]',
          'parents["log"]': '["lot"]',
          levelSize: 2
        },
        codeSnippet: 'visited.update(level_visited)',
        impact: 'Time: O(N × M^2)'
      },
      {
        title: 'BFS Level 4: "cog" Reached via BOTH "dog" and "log"',
        whatHappens: '"dog" transitions to "cog" AND "log" transitions to "cog". parents["cog"] = ["dog", "log"]. Target reached; stop further BFS expansion.',
        whyRationale: 'Both branches reach the target "cog" at the exact same minimal depth (level 5), generating 2 shortest paths.',
        nodes: [
          { id: 'hit', label: 'hit', x: 40, y: 100, status: 'visited' },
          { id: 'hot', label: 'hot', x: 100, y: 100, status: 'visited' },
          { id: 'dot', label: 'dot', x: 170, y: 50, status: 'visited' },
          { id: 'lot', label: 'lot', x: 170, y: 150, status: 'visited' },
          { id: 'dog', label: 'dog', x: 240, y: 50, status: 'visited' },
          { id: 'log', label: 'log', x: 240, y: 150, status: 'visited' },
          { id: 'cog', label: 'cog (Target)', x: 300, y: 100, status: 'target' }
        ],
        edges: [
          ['hit', 'hot'], ['hot', 'dot'], ['hot', 'lot'], ['dot', 'dog'], ['lot', 'log'], ['dog', 'cog', 'branch1'], ['log', 'cog', 'branch2']
        ],
        activeNodeId: 'cog',
        visitedIds: ['hit', 'hot', 'dot', 'lot', 'dog', 'log', 'cog'],
        states: {
          'parents["cog"]': '["dog", "log"]',
          targetFound: true
        },
        codeSnippet: 'if next_word == endWord: found = True\nparents[next_word].append(word)',
        impact: 'Time: O(1)'
      },
      {
        title: 'DFS Backtracking from "cog" to "hit" Reconstructs All Paths',
        whatHappens: 'Backtrack recursively from "cog" through parents map: Path 1: cog <- dog <- dot <- hot <- hit. Path 2: cog <- log <- lot <- hot <- hit. Reverse both.',
        whyRationale: 'DFS on the constructed parent DAG recovers all shortest transformation sequences without exploring dead ends.',
        nodes: [
          { id: 'hit', label: 'hit', x: 40, y: 100, status: 'target' },
          { id: 'hot', label: 'hot', x: 100, y: 100, status: 'target' },
          { id: 'dot', label: 'dot', x: 170, y: 50, status: 'target' },
          { id: 'lot', label: 'lot', x: 170, y: 150, status: 'target' },
          { id: 'dog', label: 'dog', x: 240, y: 50, status: 'target' },
          { id: 'log', label: 'log', x: 240, y: 150, status: 'target' },
          { id: 'cog', label: 'cog', x: 300, y: 100, status: 'target' }
        ],
        edges: [
          ['hit', 'hot', 'path'], ['hot', 'dot', 'p1'], ['hot', 'lot', 'p2'], ['dot', 'dog', 'p1'], ['lot', 'log', 'p2'], ['dog', 'cog', 'p1'], ['log', 'cog', 'p2']
        ],
        activeNodeId: 'cog',
        visitedIds: ['hit', 'hot', 'dot', 'lot', 'dog', 'log', 'cog'],
        states: {
          totalShortestPaths: 2,
          path1: '["hit","hot","dot","dog","cog"]',
          path2: '["hit","hot","lot","log","cog"]'
        },
        codeSnippet: 'def dfs(word, path):\n    if word == beginWord: result.append(path[::-1])\n    for p in parents[word]: dfs(p, path + [p])',
        impact: 'Total Time: O(N × M^2 + #Paths × M) | Space: O(N × M)'
      }
    ]
  }
};

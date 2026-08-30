# 💡 IntuitionLab — Interactive SDE Sheet Notebook & Visualizer

An interactive algorithmic notebook and study companion for the **Striver's SDE Sheet (191 Problems)**. Built with a tactile schoolyard cream-paper aesthetic, step-by-step interactive diagram engines, dual-language code viewers (Python 3 & C++), and deep first-principles intuition.

---

## 🌟 Features

* **191 Complete Solutions across 27 Topics:**
  * Arrays, Linked Lists, Trees, BSTs, Graphs, Dynamic Programming, Backtracking, Heaps, Stacks & Queues, Tries, and Greedy Algorithms.
* **Interactive Step-by-Step Visualizers:**
  * **Matrix Markers:** In-place boundary checks, marker updates, and inner cell zeroing.
  * **Dutch National Flag:** 3-pointer partition for 0s, 1s, and 2s with live boundary badges.
  * **Kadane's Algorithm:** Contiguous running sum vs. start-fresh window visualizer.
  * **Linked List Reversal:** Pointer flip sequence (`prev`, `curr`, `next`).
  * **Tree & Graph Traversals:** Interactive Inorder, Preorder, Postorder, and BFS/DFS with call stack tracking.
  * **DP Tables:** 2D grid computation with dependency cell highlights.
  * **Interval Merging & Stack Engines:** Visual push/pop and overlapping boundary checkers.
* **Granular Step Explanation Engine (`StepCard`):**
  * Every single step includes **Action Description**, **Algorithmic Rationale**, **Live Variable State Tracker**, and **Executing Code Line Mapping**.
* **Canonical `class Solution` Architecture:**
  * Clean, interview-ready Python 3 and C++ source code with separate helper member functions.
* **Progress Tracking & Scratchpad:**
  * Mark problems as solved (with confetti animation), toggle bookmarks, filter by difficulty, search in real-time, and auto-save personal notes per problem.
* **Keyboard Shortcuts:**
  * `→` Next Problem | `←` Previous Problem | `S` Toggle Solved | `B` Bookmark | `R` Random Problem

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite 6, TypeScript, Tailwind CSS, Radix UI primitives, Lucide Icons, GSAP, Canvas Confetti.
* **Backend:** Node.js, Express, CORS.
* **Data Pipeline:** Automated markdown parser generating structured JSON datasets (`scripts/parse_solutions.cjs`).

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/intuitionlab.git
cd intuitionlab
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
> Opens the frontend on `http://localhost:3000`.

### 3. Run Backend (Optional)
```bash
cd backend
npm install
npm start
```
> Backend runs on `http://localhost:4000`.

### 4. Build for Production
```bash
npm run build
```

---

## 📄 License
MIT License. Created with ❤️ for aspiring software engineers.

# IntuitionLab: Interactive SDE Sheet Notebook & Visualizer

An interactive algorithmic notebook and study companion for the **Striver's SDE Sheet (191 Problems)**. Built with a tactile schoolyard cream-paper aesthetic, step-by-step interactive diagram engines, dual-language code viewers (Python 3 & C++), deep first-principles intuition, Supabase Authentication, 250-character notes sync, and a role-based Admin Panel.

---

## 🌟 Features

* **191 Complete Solutions across 27 Topics:**
  * Arrays, Linked Lists, Trees, BSTs, Graphs, Dynamic Programming, Backtracking, Heaps, Stacks & Queues, Tries, and Greedy Algorithms.
* **Interactive Step-by-Step Visualizers:**
  * Auto-fitting Tree & BST SVGs, Linked List memory cards with colored pointer badges, 2D Matrix markers, Dutch National Flag, Kadane's, DP Tables, and Graph traversals.
* **Dual-Language Code Viewer:**
  * Synchronized approach switcher (Brute Force, Better, Optimal) with top-to-bottom vertical line numbering.
* **Supabase Auth & Cloud Notes (Max 250 Characters):**
  * Sign in / sign up with Supabase Auth.
  * Real-time character countdown counter with visual warnings and cloud persistence.
* **Superadmin Control Center:**
  * Live user management, 1-click role switcher (`user` <-> `admin`), system analytics KPI metrics, maintenance mode toggle, and announcement banner controls.
* **API Rate Limiting:**
  * Multi-tiered rate limiters protecting authentication, notes saving, and admin operations.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite 6, TypeScript, Tailwind CSS, Radix UI primitives, Lucide Icons, Canvas Confetti.
* **Backend:** Node.js, Express, TypeScript (`server/src/`), Helmet, CORS, Morgan, Express-Rate-Limit.
* **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Auth JWT).
* **Hosting:** Vercel (Frontend & Serverless) + Supabase (Database & Auth).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### 3. Run Supabase Migrations
Open **SQL Editor** in your Supabase project and execute [`supabase/migrations/01_initial_schema.sql`](supabase/migrations/01_initial_schema.sql).

### 4. Run Development Servers
```bash
# Frontend (Port 3000)
npm run dev

# Backend Server (Port 5000)
npm run server
```

### 5. Build for Production
```bash
npm run build
```

---

## 📄 License
MIT License. Created with ❤️ for aspiring software engineers.

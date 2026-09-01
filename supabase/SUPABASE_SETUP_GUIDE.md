# 🛠️ Supabase Setup & Configuration Guide for IntuitionLab

This guide walks you through setting up your **Supabase** backend for authentication, user profiles, 250-character notes sync, and the admin panel.

---

## 📋 Table of Contents
1. [Create Supabase Project](#1-create-supabase-project)
2. [Run Database Schema Migrations](#2-run-database-schema-migrations)
3. [Retrieve API Keys](#3-retrieve-api-keys)
4. [Configure Environment Variables](#4-configure-environment-variables)
5. [Promoting Your First User to Admin](#5-promoting-your-first-user-to-admin)
6. [Authentication Settings](#6-authentication-settings)
7. [Testing the Setup](#7-testing-the-setup)

---

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **"New project"** and select your organization.
3. Fill in the details:
   - **Name:** `intuitionlab` (or your preferred name)
   - **Database Password:** Generate a secure password and save it.
   - **Region:** Choose the region closest to your users.
4. Click **"Create new project"** and wait ~1 minute for provisioning.

---

## 2. Run Database Schema Migrations

1. In the Supabase Dashboard, click on **"SQL Editor"** (terminal icon in the left sidebar).
2. Click **"New query"**.
3. Open [`supabase/migrations/01_initial_schema.sql`](file:///D:/coding/New%20folder/supabase/migrations/01_initial_schema.sql) from this repository.
4. Copy the entire contents and paste them into the SQL Editor.
5. Click **"Run"** (or `Ctrl+Enter`).
6. You should see `Success. No rows returned`.

> **What this creates:**
> - `public.profiles`: Stores user email, username, role (`'user'` or `'admin'`).
> - `public.problem_notes`: Stores problem notes with a strict database-level `CHECK (char_length(content) <= 250)` limit.
> - `public.user_progress`: Tracks solved and bookmarked problems.
> - `public.system_settings`: Stores admin settings (maintenance mode, announcement banner).
> - **Triggers:** Automatically creates a profile record whenever a user signs up.
> - **Row Level Security (RLS):** Ensures users can only access their own private notes.

---

## 3. Retrieve API Keys

1. In your Supabase Dashboard, navigate to **Project Settings** (gear icon) -> **API**.
2. Locate the following keys:
   - **Project URL:** `https://your-project-id.supabase.co`
   - **Project API Keys:**
     - `anon` `public` key: Used by the React frontend and client.
     - `service_role` `secret` key: Used **ONLY** by the Express backend (`server/`). Never expose this in the browser!

---

## 4. Configure Environment Variables

Create or update `.env` in the root directory (and `server/.env` if running backend independently):

```env
# ==========================================
# Frontend Supabase Config (Client-Safe)
# ==========================================
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ==========================================
# Backend Server Config (Keep Secret!)
# ==========================================
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 5. Promoting Your First User to Admin

To unlock the **Admin Dashboard** (`[✦ Admin Panel]` button in the top navigation):

1. Launch IntuitionLab and create an account via the **Sign In / Sign Up** modal in the top right.
2. In Supabase Dashboard, go to **SQL Editor** and run:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

3. Refresh your app. You will see the **[✦ Admin Panel]** button appear in the top header.

---

## 6. Authentication Settings

In the Supabase Dashboard, go to **Authentication** -> **Providers**:

- **Email:** Enabled by default.
- *(Optional)* **Confirm email:** If testing locally, you can disable **"Confirm email"** in **Authentication -> Email Auth** to allow instant sign-in without waiting for email verification links.
- *(Optional)* **Google / GitHub OAuth:** Follow the Supabase OAuth guide to enable 1-click social logins.

---

## 7. Testing the Setup

### Start the Frontend:
```bash
npm run dev
```
Open [http://localhost:3000/](http://localhost:3000/)

### Start the Backend Server:
```bash
npm run server
```
Server runs on [http://localhost:5000/](http://localhost:5000/)

### Verify Health Endpoint:
```bash
curl http://localhost:5000/api/v1/health
```
Response:
```json
{
  "status": "healthy",
  "supabaseConnected": true,
  "uptime": 12.4
}
```

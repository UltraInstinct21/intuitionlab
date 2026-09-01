# 🛠️ Supabase Setup & Configuration Guide for IntuitionLab

This guide walks you through setting up your **Supabase** backend for authentication, user profiles, 250-character notes sync, and the admin panel.

---

## 📋 Table of Contents
1. [Create Supabase Project](#1-create-supabase-project)
2. [Run Database Schema Migrations](#2-run-database-schema-migrations)
3. [Disable Email Confirmation (Allow Instant Login)](#3-disable-email-confirmation-allow-instant-login)
4. [Retrieve API Keys](#4-retrieve-api-keys)
5. [Configure Environment Variables](#5-configure-environment-variables)
6. [Promoting Your First User to Admin](#6-promoting-your-first-user-to-admin)
7. [Testing the Setup](#7-testing-the-setup)

---

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **"New project"** and select your organization.
3. Fill in the details:
   - **Name:** `intuitionlab`
   - **Database Password:** Generate a secure password and save it.
   - **Region:** Choose the region closest to your users.
4. Click **"Create new project"** and wait ~1 minute for provisioning.

---

## 2. Run Database Schema Migrations

1. In the Supabase Dashboard, click on **"SQL Editor"** (terminal icon `>_` in the left sidebar).
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

## 3. Disable Email Confirmation (Allow Instant Login)

> [!IMPORTANT]
> **Why you are not receiving emails:**  
> Supabase's default shared email service has strict rate limits. To let users sign up and log in **instantly** without waiting for confirmation emails:

1. In Supabase Dashboard, click **Authentication** (the user icon in the left sidebar).
2. Click **Providers** ➔ Click on **Email** to expand it.
3. Scroll down and **Toggle OFF "Confirm email"**.
4. Click **"Save"**.

### ⚡ To confirm any existing accounts that are already stuck:
Go to **SQL Editor** and run:
```sql
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email_confirmed_at IS NULL;
```
Now all existing users can sign in immediately with their password!

---

## 4. Retrieve API Keys

1. In your Supabase Dashboard, navigate to **Project Settings** (gear icon ⚙️) -> **API**.
2. Locate the following keys:
   - **Project URL:** `https://your-project-id.supabase.co`
   - **Project API Keys:**
     - `anon` `public` key: Used by the React frontend and client.
     - `service_role` `secret` key: Used **ONLY** by the Express backend (`server/`). Never expose this in the browser!

---

## 5. Configure Environment Variables

Create or update `.env` in the root directory (and add to Vercel Environment Variables):

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

## 6. Promoting Your First User to Admin

To unlock the **Admin Dashboard** (`[✦ Admin Panel]` button in the top navigation):

1. Create an account in your app via the **Sign In / Create Account** modal.
2. In Supabase Dashboard, go to **SQL Editor** and run:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

3. Refresh your app. You will see the **[✦ Admin Panel]** button appear in the top header.

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

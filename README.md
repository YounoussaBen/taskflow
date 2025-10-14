# TaskFlow – Role-Based Task Management App

A lightweight task management app built with **Next.js 15 + TypeScript**, showcasing **Role-Based Access Control (RBAC)** with three user roles: Admin, Manager, and Member.
Developed for the **Infusi Take-Home Assignment**.

---

### 🚀 Quick Start

**Requirements:** Node.js 20+ or Bun 1.0+

```bash
git clone https://github.com/YounoussaBen/taskflow
cd taskflow
bun install
bun dev
```

Visit **[http://localhost:3000](http://localhost:3000)**

---

### 🔐 Demo Accounts

| Role    | Email                                               | Password |
| ------- | --------------------------------------------------- | -------- |
| Admin   | [admin@taskflow.com](mailto:admin@taskflow.com)     | 123456   |
| Manager | [manager@taskflow.com](mailto:manager@taskflow.com) | 123456   |
| Member  | [member@taskflow.com](mailto:member@taskflow.com)   | 123456   |

---

### 📋 Features

- Authentication with route protection
- Full **RBAC enforcement** (UI + API)
- CRUD operations on projects and tasks
- Admin panel with role management and analytics
- Responsive and modern UI (Tailwind + Radix)
- Loading, empty, and error states handled cleanly

---

### 👥 Role Permissions

| Action                   | Admin | Manager           | Member         |
| ------------------------ | ----- | ----------------- | -------------- |
| View all projects        | ✅    | ✅                | ✅             |
| Create/edit/delete tasks | ✅    | ✅ (own projects) | ❌             |
| Mark tasks as done       | ✅    | ✅                | ✅ (own tasks) |
| Manage user roles        | ✅    | ❌                | ❌             |
| Access Admin Panel       | ✅    | ❌                | ❌             |

---

### ⚙️ RBAC Overview

The RBAC logic is enforced across **middleware**, **API routes**, and **UI components**.

Flow:

```
User login → Role validation → Route/API guard → Action allowed or blocked
```

Example:
A Manager can only modify tasks belonging to their own projects. A Member can update only their assigned task’s status.

---

### 📊 Admin Panel

Accessible only to Admins at `/admin`.
Includes:

- User list with role update controls
- Analytics: tasks done vs. pending

---

### 🧩 Tech Stack

Next.js 15 • TypeScript • Tailwind CSS • Radix UI • Lucide Icons • Bun runtime

---

### ✅ Assignment Checklist

**Question 1 – Authentication & Role Access**

- Login with seed users
- Protected `/dashboard` and `/tasks`
- Admin link visible only to admin

**Question 2 – Projects & Tasks**

- CRUD tasks
- Role restrictions enforced
- Loading and error states

**Question 3 – Admin Panel**

- `/admin` page
- Role editing
- Task analytics

---

**Deployed on Vercel** — [https://infusitaskflow.vercel.app](https://infusitaskflow.vercel.app)

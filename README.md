# 🛠️ FixItNow — On-Demand Household & Commercial Service Platform (Frontend)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/SSLCommerz-Payment_Gateway-009688?style=for-the-badge" alt="SSLCommerz" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

FixItNow is a high-performance, full-stack enabled web application for discovering, booking, and managing verified professional technician services (Electrical, Plumbing, AC Servicing, Cleaning, and Appliance Maintenance).

---

## 📌 Table of Contents
- [✨ Key Features](#-key-features)
  - [👥 Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
  - [🎨 UI/UX & Design Architecture](#-uiux--design-architecture)
- [💻 Tech Stack](#-tech-stack)
- [📂 Project Directory Structure](#-project-directory-structure)
- [⚙️ Environment Variables](#️-environment-variables)
- [🚀 Getting Started & Local Setup](#-getting-started--local-setup)
- [🔑 Demo Credentials](#-demo-credentials)
- [📄 License](#-license)

---

## ✨ Key Features

### 👥 Role-Based Access Control (RBAC)
- **Customer Portal:**
  - Search & filter services by category, price range, and technician name.
  - Book services with instant time slot scheduling, custom delivery notes, and location tracking.
  - Online payments via **SSLCommerz** sandbox payment gateway or Cash on Delivery.
  - Rate completed bookings (1 to 5 Stars) with custom reviews.
  - Submit applications to become a verified technician directly from the Navbar.

- **Technician Portal:**
  - Dedicated Technician Dashboard and Sidebar Navigation.
  - Manage personal services: Add new services (`/dashboard/services/add`), view detailed specs (`/dashboard/my-services/[id]`), edit, and delete services under Admin-defined categories.
  - Monitor job requests, track active bookings (`IN_PROGRESS`, `COMPLETED`, `ACCEPTED`), and view customer feedback (`/dashboard/reviews`).

- **Admin Portal:**
  - Master Platform Administration dashboard.
  - **User Management (`/dashboard/users`)**: Search, filter, ban, or reactivate user accounts.
  - **Category Management (`/dashboard/categories`)**: Create, edit, and manage service categories.
  - **Technician Applications (`/dashboard/applications`)**: Review, approve, or reject user requests to become verified technicians in a responsive Table view.
  - **Master Services & Bookings (`/dashboard/services`, `/dashboard/bookings`)**: Full oversight of platform services and customer orders.

---

### 🎨 UI/UX & Design Architecture
- **Uniform Section Headers:** Consistent header badges, icons, `Space Grotesk` typography, and sub-descriptions across all landing page sections.
- **Infinite Marquee Ticker:** Seamless corporate client marquee animation displaying enterprise brands served by FixItNow (scrolls Left to Right with hover pause).
- **Full-Width Background Containers:** 100% full-width background color containers (`#FAF8F5`) responsive across ultra-wide monitors and mobile devices.
- **Universal Table Pagination:** Reusable `Pagination` component integrated across all dashboard tables (Users, Categories, Master Services, Technician Services, Applications, Bookings, Reviews).

---

## 💻 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16** | App Router, Server Actions, Dynamic Routing & Turbopack |
| **TypeScript** | Strict Type Safety across API payloads and Components |
| **Tailwind CSS** | Custom styling, glassmorphism, responsive grid & flexbox |
| **Lucide React** | Modern vector icon set |
| **SSLCommerz** | Online payment gateway integration |
| **Cookies & JWT** | Secure authentication session management |

---

## 📂 Project Directory Structure

```
FixItNow-Frontend/
├── src/
│   ├── actions/                  # Next.js Server Actions (Auth, Services, Bookings, Admin, Reviews)
│   ├── app/                      # App Router Pages & Layouts
│   │   ├── (withcommonlayout)/   # Public Pages (Home, Services, Categories, Technicians)
│   │   └── (withoutcommonlayout)/# Dashboard Pages (Services, My Services, Users, Applications, Bookings, Reviews)
│   ├── components/
│   │   ├── home/                 # Homepage Sections (Banner, Categories, PopularServices, TrustedCompanies, WhyChooseUs, HowItWorks, FAQ)
│   │   ├── layout/               # Sidebar & Topbar Admin/Technician Layouts
│   │   ├── modules/              # Admin, Technician & Public Feature Modules
│   │   └── share/                # Reusable UI (Navbar, Footer, Pagination)
│   ├── lib/                      # Base fetch API handlers & Cookie utilities
│   └── types/                    # TypeScript interfaces & types
├── public/                       # Static Assets & Icons
├── .env.local                    # Environment configuration
└── README.md                     # Documentation
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_BASE_API=http://localhost:5000/api
```

---

## 🚀 Getting Started & Local Setup

### 1. Clone Repository
```bash
git clone https://github.com/Rafi570/FixItNow-Frontend.git
cd FixItNow-Frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to test the application.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Technician** | `hasan.cse570@gmail.com` | `Rafi570@` | Add/Edit/Delete own Services, View Reviews & Bookings |
| **Admin** | `admin@fixitnow.com` | `Admin123@` | Full Admin Dashboard, Manage Users, Categories, Applications |
| **Customer** | `rahim.customer@gmail.com` | `Rafi570@` | Book Services, Pay via SSLCommerz, Submit Reviews |

---

## 📄 License
This project is created for demonstration and educational purposes.

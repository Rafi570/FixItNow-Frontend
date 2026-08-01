# 🛠️ FixItNow — On-Demand Household & Commercial Service Platform

A modern, responsive, full-stack enabled web application for discovering, booking, and managing verified professional technician services (Electrical, Plumbing, AC Servicing, Cleaning, and Appliance Maintenance).

---

## 🌟 Key Features & Highlights

### 👥 Role-Based Access Control (RBAC) & User Capabilities
- **Customer Role:**
  - Browse and filter services by categories, price range, and assigned technicians.
  - Book services with instant time slot scheduling, custom delivery notes, and location tracking.
  - Complete payments online via **SSLCommerz** sandbox gateway or Cash on Service.
  - Submit ratings (1–5 stars) and detailed reviews for completed bookings.
  - Apply to become a verified technician directly from the Navbar modal.

- **Technician Role:**
  - Dedicated **Technician Dashboard** and Sidebar Navigation.
  - Manage individual services: Create, view details (`/dashboard/my-services/[id]`), edit, and delete services under Admin-defined categories.
  - View incoming booking status (`IN_PROGRESS`, `COMPLETED`, `ACCEPTED`).
  - Monitor customer reviews and ratings in a dedicated **Service Reviews Table** (`/dashboard/reviews`).

- **Admin Role:**
  - Master Platform Administration dashboard.
  - **User Management (`/dashboard/users`)**: Search, filter, ban, or reactivate user accounts.
  - **Category Management (`/dashboard/categories`)**: Create and manage service categories.
  - **Technician Applications (`/dashboard/applications`)**: Review, approve, or reject user requests to become verified technicians.
  - **Master Services & Bookings**: Monitor and update all system-wide services and bookings.

---

### 🎨 Design System & UI/UX Excellence
- **Uniform Section Headers:** Consistent header badges, icons, Space Grotesk typography, and sub-descriptions across all landing page sections.
- **Infinite Marquee Ticker:** Seamless corporate client marquee animation displaying enterprise brands served by FixItNow.
- **Full-Width Layouts:** 100% full-width background color containers (`#FAF8F5`) responsive across all screen resolutions.
- **Universal Table Pagination:** Reusable `Pagination` component integrated across all dashboard tables (Users, Categories, Master Services, Technician Services, Applications, Bookings, Reviews).

---

## 💻 Technology Stack

- **Framework:** Next.js 16 (App Router & Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Lucide React Icons
- **State Management & Async:** Server Actions & React State
- **Payment Gateway:** SSLCommerz Integration
- **Build System:** Next.js Turbopack

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
│   │   ├── layout/               # Sidebar & Topbar Admin Layouts
│   │   ├── modules/              # Admin, Technician & Public Feature Modules
│   │   └── share/                # Reusable UI (Navbar, Footer, Pagination)
│   ├── lib/                      # Base fetch API handlers & Cookie utilities
│   └── types/                    # TypeScript interfaces & types
├── public/                       # Static Assets & Icons
├── .env.local                    # Environment configuration
└── README.md                     # Documentation
```

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** or **yarn**

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_BASE_API=http://localhost:5000/api
```

### 3. Installation
Install project dependencies:

```bash
npm install
```

### 4. Run Development Server
Launch the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🔑 Demo Test Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Technician** | `hasan.cse570@gmail.com` | `Rafi570@` |
| **Admin** | `admin@fixitnow.com` | `Admin123@` |
| **Customer** | `rahim.customer@gmail.com` | `Rafi570@` |

---

## 📄 License
This project is created for demonstration and educational purposes.

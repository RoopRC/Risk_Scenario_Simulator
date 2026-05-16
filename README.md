# 🛡️ Risk Scenario Simulator

> **Enterprise-Grade Risk Management Platform** — Java Backend · MySQL · React + Vite · JWT Auth · AI-Powered Analysis · Real-Time SSE Reporting
watch demo here:https://www.youtube.com/watch?v=7FPDjn6HZIY
---

## 📑 Table of Contents

- [Problem Statement](#-problem-statement)
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [System Architecture](#️-system-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Default Accounts](#-default-accounts)
- [API Reference](#-api-reference)
- [Frontend Pages](#️-frontend-pages)
- [Database Schema](#️-database-schema)
- [Authentication Flow](#-authentication-flow)
- [AI-Powered Features](#-ai-powered-features)
- [Design System](#-design-system)
- [Scripts Reference](#-scripts-reference)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🎯 Problem Statement

### The Challenge

In today's rapidly evolving business landscape, organizations face a growing array of risks — from **cybersecurity threats** and **regulatory compliance failures** to **operational disruptions** and **financial fraud**. Despite their critical nature, most enterprises still rely on **fragmented, manual processes** (spreadsheets, email threads, periodic audits) to manage these risks.

**Core pain points include:**

| # | Challenge | Impact |
|---|---|---|
| 1 | **Lack of Centralization** | Risk data scattered across departments; no single source of truth |
| 2 | **Delayed Response Times** | Manual reporting cycles create dangerous blind spots for critical risks |
| 3 | **Inconsistent Assessment** | Different teams use different scoring methods, leading to misaligned priorities |
| 4 | **No Data-Driven Insights** | Inability to identify patterns, correlations, and emerging trends |
| 5 | **Poor Accountability** | No role-based access, audit trail, or ownership tracking |
| 6 | **Resource-Intensive Reporting** | Hours of manual data aggregation for executive summaries |

### Our Solution

The **Risk Scenario Simulator** transforms risk management from a reactive, fragmented process into a **proactive, centralized, and intelligent discipline** by providing:

- 📍 **Centralized risk database** with consistent categorization and scoring
- 📊 **Interactive dashboards** with heat maps, trend lines, and distribution charts
- 🤖 **AI-powered analysis** for automated descriptions, recommendations, and querying
- ⚡ **Real-time SSE streaming** for instant executive report generation
- 🔐 **Role-based access control** with JWT authentication and audit trails
- 📄 **One-click exports** — CSV data dumps and professionally formatted PDF reports

---

## 📖 Overview

The **Risk Scenario Simulator** is a full-stack web application for organizations to **identify, track, analyze, and mitigate** risk scenarios across multiple operational domains. It combines a centralized dashboard for monitoring risk metrics, an AI-assisted analysis engine, and real-time streaming reports.

**Architecture at a glance:**
- **Backend** — Lightweight Java HTTP server (`com.sun.net.httpserver`) with MySQL via JDBC and a custom connection pool
- **Frontend** — React 18 SPA built with Vite 5, styled with TailwindCSS 3, visualized with Recharts

---

## ✨ Key Features

### Core Risk Management
- ✅ Full **CRUD Operations** — Create, Read, Update, Delete risk scenarios
- ✅ **Server-side Pagination & Sorting** — Configurable page size, sortable by risk score, cost, or date
- ✅ **Advanced Filtering** — Filter by status (`OPEN`, `CRITICAL`, `IN_PROGRESS`, `MITIGATED`, `CLOSED`), category, keyword search
- ✅ **Risk Detail View** — Comprehensive view with all metadata and AI analysis

### Authentication & Authorization
- 🔐 **JWT Authentication** — HMAC-SHA256 signed tokens with 24-hour expiry
- 🔐 **Role-Based Access** — Three roles: `ADMIN`, `MANAGER`, `VIEWER`
- 🔐 **Auto Token Verification** — Session restore on app reload; auto-redirect on expiry
- 🔐 **Protected Routes** — All application routes require valid authentication

### AI-Powered Analysis
- 🤖 **AI Describe** — Auto-generated risk narratives based on data attributes
- 🤖 **AI Recommend** — Prioritized actions: Immediate, Short-Term, Long-Term
- 🤖 **AI Query** — Natural-language questions about specific risks
- 🤖 **AI Insights** — Deep-dive impact analysis with severity scoring, business consequences, and mitigation solutions

### Analytics & Reporting
- 📊 **Dashboard KPIs** — Total risks, open risks, critical alerts, average score, total exposure
- 📊 **Visual Breakdowns** — Pie charts (status), bar charts (category), line charts (monthly trends)
- 📊 **Risk Heat Map** — 5×5 impact × likelihood matrix
- 📊 **Risk Comparison** — Side-by-side metric comparison
- 📊 **SSE Report Streaming** — Real-time AI executive report generation
- 📊 **CSV & PDF Export** — One-click data export with jsPDF formatting

### Premium UI/UX
- 🎨 **Dark Theme** — Deep navy (`#0a0e1a`) with emerald (`#10b981`) accents
- 🎨 **Responsive Design** — Desktop, tablet, and mobile optimized
- 🎨 **Micro-Animations** — fadeInUp, slideIn, pulseGlow, shimmer effects
- 🎨 **Toast Notifications** — Real-time feedback via react-hot-toast
- 🎨 **Collapsible Sidebar** — Icon-based navigation with active route highlighting

---

## 🛠️ Tech Stack

```
┌──────────────────────────────────────────────────────────────────────┐
│                      RISK SCENARIO SIMULATOR                        │
├──────────────┬───────────────────┬──────────────┬───────────────────┤
│   FRONTEND   │     BACKEND       │   DATABASE   │   DEV TOOLS       │
├──────────────┼───────────────────┼──────────────┼───────────────────┤
│ React 18     │ Java 11+          │ MySQL 8.0+   │ Maven 3.x         │
│ Vite 5       │ HttpServer (JDK)  │              │ npm / Node 18+    │
│ TailwindCSS 3│ JDBC              │              │ Concurrently      │
│ Recharts     │ org.json          │              │ ESLint            │
│ Axios        │ HMAC-SHA256 JWT   │              │ PostCSS           │
│ React Router │ Connection Pool   │              │ Autoprefixer      │
│ jsPDF        │ SSE Streaming     │              │ Git / GitHub      │
└──────────────┴───────────────────┴──────────────┴───────────────────┘
```

### Backend Dependencies

| Technology | Version | Purpose |
|---|---|---|
| **Java** | 11+ | Server-side logic |
| **com.sun.net.httpserver** | JDK built-in | Lightweight HTTP server (zero external frameworks) |
| **MySQL** | 8.0+ | Relational database with ACID transactions |
| **mysql-connector-java** | 8.0.33 | JDBC driver for MySQL |
| **org.json** | 20230227 | JSON serialization/deserialization |
| **Maven** | 3.x | Build automation & dependency management |
| **Maven Shade Plugin** | 3.5.0 | Executable fat JAR packaging |
| **Maven Exec Plugin** | 3.1.0 | Direct application execution |

### Frontend Dependencies

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.2 | Component-based UI framework |
| **Vite** | 5.0 | Build tool with HMR & dev proxy |
| **TailwindCSS** | 3.4 | Utility-first CSS framework |
| **React Router DOM** | 6.22 | Client-side routing |
| **Axios** | 1.6 | HTTP client with interceptors |
| **Recharts** | 2.10 | Data visualization (Pie, Bar, Line charts) |
| **jsPDF** | 4.2 | Client-side PDF generation |
| **jspdf-autotable** | 5.0 | Table formatting for PDFs |
| **react-hot-toast** | 2.4 | Toast notification system |
| **date-fns** | 3.2 | Date utility library |

### Security Stack

| Technology | Purpose |
|---|---|
| **JWT (HMAC-SHA256)** | Stateless authentication tokens (24h expiry) |
| **Bearer Token Auth** | Standard HTTP authorization scheme |
| **CORS Middleware** | Cross-Origin Resource Sharing on all endpoints |
| **Prepared Statements** | SQL injection prevention via parameterized queries |
| **Axios Interceptors** | Auto token attachment & 401 handling |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client (Browser)                  │
│  React 18 + Vite + TailwindCSS + Recharts           │
│  Port: 5173                                         │
└──────────────────────┬──────────────────────────────┘
                       │  HTTP (Axios) / SSE
                       │  Vite Proxy: /api → :8080
                       │              /auth → :8080
┌──────────────────────▼──────────────────────────────┐
│               Java HTTP Server                       │
│  com.sun.net.httpserver.HttpServer | Port: 8080      │
│  ┌────────────────────────────────────────────────┐  │
│  │  Handlers:                                     │  │
│  │  • AuthLoginHandler    → POST /auth/login      │  │
│  │  • AuthVerifyHandler   → GET  /auth/verify     │  │
│  │  • RisksAndAIHandler   → CRUD /api/risks/*     │  │
│  │  • StatsHandler        → GET  /api/stats       │  │
│  │  • ExportHandler       → GET  /api/export/csv  │  │
│  │  • ReportStreamHandler → GET  /api/reports/*   │  │
│  └────────────────────────────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                  │
│  │  JWT Auth     │  │  CORS Layer  │                  │
│  │  (HMAC-SHA256)│  │  (Allow *)   │                  │
│  └──────────────┘  └──────────────┘                  │
│  ┌────────────────────────────────────────────────┐  │
│  │  ConnectionPool (10 connections, BlockingQueue) │  │
│  └───────────────────────┬────────────────────────┘  │
└──────────────────────────┼──────────────────────────┘
                           │ JDBC
┌──────────────────────────▼──────────────────────────┐
│                MySQL Database                        │
│  Database: risk_simulator_db                         │
│  Tables: users, risks | Port: 3306                   │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
risk-scenario-simulator/
├── src/main/java/
│   └── BackendDb.java              # Complete Java backend (single file)
│       ├── CORSHandler             # Cross-origin headers
│       ├── JWTHandler              # Token generation & verification
│       ├── AuthLoginHandler        # POST /auth/login
│       ├── AuthVerifyHandler       # GET /auth/verify
│       ├── RisksAndAIHandler       # CRUD + AI endpoints
│       ├── StatsHandler            # Dashboard statistics
│       ├── ExportHandler           # CSV export
│       ├── ReportStreamHandler     # SSE streaming reports
│       └── ConnectionPool          # Custom JDBC pool (BlockingQueue)
├── Frontend/
│   ├── src/
│   │   ├── main.jsx                # React entry point
│   │   ├── App.jsx                 # Root component with routing
│   │   ├── index.css               # Global styles & animations
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx     # Auth state management
│   │   ├── services/
│   │   │   └── api.js              # Axios client + interceptors
│   │   ├── pages/
│   │   │   ├── Login.jsx           # JWT login page
│   │   │   ├── Dashboard.jsx       # KPI cards + charts
│   │   │   ├── RiskList.jsx        # Paginated risk table
│   │   │   ├── RiskDetail.jsx      # Risk detail + AI panel
│   │   │   ├── RiskFormPage.jsx    # Create/Edit risk form
│   │   │   ├── Analytics.jsx       # Charts & analytics
│   │   │   ├── Reports.jsx         # SSE streaming + PDF export
│   │   │   └── Settings.jsx        # User preferences
│   │   ├── components/
│   │   │   ├── layout/             # Layout, Sidebar, Navbar
│   │   │   ├── common/             # ProtectedRoute, Badge, Loading, ErrorBoundary
│   │   │   ├── dashboard/          # Charts, KPICard, HeatMap, Comparison
│   │   │   └── risks/              # AIPanel, AIInsights, RiskForm, RiskTable, Filters
│   │   ├── hooks/                  # useDebounce, useLocalStorage
│   │   └── utils/                  # formatters, validators, pdfGenerators
│   ├── vite.config.js              # Vite config with API proxy
│   ├── tailwind.config.js          # TailwindCSS theme
│   └── package.json                # Frontend dependencies
├── pom.xml                         # Maven build config
├── package.json                    # Root scripts (dev, server, client)
├── setup.sql                       # Database schema + seed users
├── seed-80-risks.sql               # 80 risk scenarios seed data
├── .env.example                    # Environment template
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Verify |
|---|---|---|
| **Java JDK** | 11+ | `java -version` |
| **Apache Maven** | 3.x | `mvn -version` |
| **MySQL Server** | 8.0+ | `mysql --version` |
| **Node.js** | 18+ | `node -v` |
| **npm** | 9+ | `npm -v` |

### Step 1 — Clone the Repository

```bash
git clone https://github.com/RoopRC/risk-scenario-simulator.git
cd risk-scenario-simulator
```

### Step 2 — Database Setup

```bash
# Create database, tables, and default users
mysql -u root -p < setup.sql

# Seed 80 risk scenarios
mysql -u root -p risk_simulator_db < seed-80-risks.sql
```

### Step 3 — Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=risk_simulator_db
DB_PORT=3306
PORT=8080
JWT_SECRET=your-secret-key-for-jwt
```

### Step 4 — Backend Setup

```bash
mvn clean install      # Install dependencies & compile
mvn exec:java          # Start the backend server
```

Expected output:
```
🚀 Backend running on http://localhost:8080
📦 Connected to MySQL Database: risk_simulator_db
🔐 Authentication enabled with JWT
```

### Step 5 — Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend starts at **http://localhost:5173** with Vite proxying `/api` and `/auth` to port 8080.

### Step 6 — Run Both Together

```bash
npm run dev    # From project root — runs backend + frontend concurrently
```

---

## 👤 Default Accounts

| Username | Password | Role | Permissions |
|---|---|---|---|
| `admin` | `admin123` | **ADMIN** | Full CRUD access on all risks |
| `manager` | `manager123` | **MANAGER** | Create & edit risks; view all data |
| `viewer` | `viewer123` | **VIEWER** | Read-only access |

---

## 📡 API Reference

> All endpoints except `/auth/login` require `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Login → returns JWT token |
| `GET` | `/auth/verify` | Verify token & get user info |

### Risk CRUD

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/risks` | List risks (paginated, filterable, sortable) |
| `GET` | `/api/risks/:id` | Get single risk by ID |
| `POST` | `/api/risks` | Create new risk |
| `PUT` | `/api/risks/:id` | Update existing risk |
| `DELETE` | `/api/risks/:id` | Delete a risk |

**Pagination Parameters:** `page` (default: 0), `size` (default: 10), `search`, `status`, `category`, `sortBy`, `sortDir`

### AI Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/risks/:id/ai/describe` | Generate AI risk description |
| `POST` | `/api/risks/:id/ai/recommend` | Get prioritized action recommendations |
| `POST` | `/api/risks/:id/ai/query` | Ask natural-language questions |
| `POST` | `/api/risks/:id/ai/insights` | Deep-dive impact analysis & solutions |

### Statistics & Export

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats` | Dashboard statistics & breakdowns |
| `GET` | `/api/export/csv` | Export all risks as CSV file |
| `GET` | `/api/reports/stream` | SSE streaming executive report |

---

## 🖥️ Frontend Pages

| Page | Route | Description |
|---|---|---|
| **Login** | `/login` | JWT authentication with credentials form |
| **Dashboard** | `/dashboard` | KPI cards, trend charts, status breakdown, heat map |
| **Risk List** | `/risks` | Paginated table with search, filters, sorting |
| **Risk Detail** | `/risks/:id` | Full risk view with AI analysis & insights panels |
| **Create Risk** | `/risks/new` | Risk creation form with validation |
| **Edit Risk** | `/risks/:id/edit` | Edit existing risk scenario |
| **Analytics** | `/analytics` | Category breakdown, risk comparison, charts |
| **Reports** | `/reports` | SSE streaming AI report + PDF/CSV export |
| **Settings** | `/settings` | Profile, appearance, notification preferences |

---

## 🗄️ Database Schema

### `users` Table

| Column | Type | Constraints |
|---|---|---|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL |
| `password` | VARCHAR(255) | NOT NULL |
| `name` | VARCHAR(100) | NOT NULL |
| `email` | VARCHAR(100) | — |
| `role` | ENUM('ADMIN','MANAGER','VIEWER') | DEFAULT 'VIEWER' |
| `createdAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| `updatedAt` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

### `risks` Table

| Column | Type | Constraints |
|---|---|---|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT |
| `title` | VARCHAR(255) | NOT NULL |
| `description` | TEXT | — |
| `category` | VARCHAR(50) | — |
| `riskScore` | DECIMAL(3,1) | — |
| `impact` | VARCHAR(20) | — |
| `likelihood` | VARCHAR(20) | — |
| `status` | VARCHAR(20) | — |
| `mitigationPlan` | TEXT | — |
| `projectedCost` | INT | — |
| `createdBy` | INT | FOREIGN KEY → users(id) |
| `createdAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| `updatedAt` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

---

## 🔐 Authentication Flow

```
1. User enters credentials on /login
2. Frontend sends POST /auth/login
3. Backend validates against MySQL users table
4. Backend generates JWT (HMAC-SHA256, 24h expiry) with claims: {id, username, role, name}
5. Frontend stores token in localStorage
6. Axios interceptor attaches "Bearer <token>" to all subsequent requests
7. On app reload, AuthContext calls GET /auth/verify to restore session
8. On 401 response, interceptor clears token and redirects to /login
```

---

## 🤖 AI-Powered Features

The backend includes a simulated AI engine generating contextual analysis based on actual risk data attributes:

| Feature | Endpoint | Output |
|---|---|---|
| **Describe** | `/ai/describe` | Narrative analysis based on score, impact, likelihood, category, cost |
| **Recommend** | `/ai/recommend` | 3 prioritized actions: IMMEDIATE (HIGH), SHORT_TERM (MEDIUM), LONG_TERM (LOW) |
| **Query** | `/ai/query` | Context-aware answers to natural-language questions |
| **Insights** | `/ai/insights` | Deep analysis: severity scoring, business consequences, mitigation solutions, timeline |

**Response metadata includes:** `confidence`, `model_used` (llama-3.3-70b), `tokens_used`, `response_time_ms`, `cached`

**AI Insights provides category-specific analysis for:** Cybersecurity, Financial, Infrastructure, Operational, Compliance, and Strategic risks — with tailored consequences and solution recommendations for each.

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `navy-900` | `#0a0e1a` | Primary background |
| `navy-800` | `#0f1628` | Surface background |
| `navy-700` | `#162d47` | Card backgrounds |
| `accent` | `#10b981` | Primary emerald accent |
| `teal` | `#06b6d4` | Secondary accent |
| `secondary` | `#a855f7` | Purple highlights |
| `danger` | `#ef4444` | Error states |
| `warning` | `#f97316` | Warning states |
| `text-primary` | `#f8fafc` | Primary text |
| `text-muted` | `#94a3b8` | Muted text |

**Typography:** Inter (Google Fonts)
**Animations:** fadeInUp, fadeIn, slideInLeft, pulseGlow, shimmer

---

## 📜 Scripts Reference

### Root `package.json`

| Script | Description |
|---|---|
| `npm run server` | Build and run Java backend |
| `npm run server:build` | Build backend JAR only |
| `npm run client` | Start frontend dev server |
| `npm run dev` | Full-stack development mode (both servers) |

### Frontend `package.json`

| Script | Description |
|---|---|
| `npm run dev` | Vite dev server on port 5173 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |

---

## ❓ Troubleshooting

| Issue | Solution |
|---|---|
| **Backend "Connection refused"** | Ensure MySQL is running; verify `.env` credentials; check database exists |
| **Frontend proxy errors** | Start backend on port 8080 before frontend; check `vite.config.js` proxy |
| **JWT token issues** | Keep `JWT_SECRET` consistent; clear `localStorage` for stale tokens |
| **MySQL driver not found** | Run `mvn clean install`; verify `mysql-connector-java` in `pom.xml` |
| **Port already in use** | Change `PORT` in `.env` (backend) or `server.port` in `vite.config.js` (frontend) |

---

## 📄 License

MIT License

Copyright (c) 2026 Roopa Chinchewadi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
---

<p align="center">
  <b>Built with ❤️ for Enterprise Risk Management</b><br>
  <i>Risk Scenario Simulator — Identify · Analyze · Mitigate</i>
</p>

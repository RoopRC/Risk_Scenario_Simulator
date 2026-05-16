# 🛡️ Risk Scenario Simulator

> An enterprise-grade **Risk Management Platform** featuring a Java backend with MySQL persistence, a React + Vite frontend with a premium dark-themed UI, JWT-based authentication, AI-powered risk analysis, real-time SSE report streaming, and comprehensive analytics dashboards.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Database Setup (MySQL)](#2-database-setup-mysql)
  - [3. Environment Configuration](#3-environment-configuration)
  - [4. Backend Setup (Java)](#4-backend-setup-java)
  - [5. Frontend Setup (React)](#5-frontend-setup-react)
  - [6. Run Both Together](#6-run-both-together)
- [Default User Accounts](#default-user-accounts)
- [API Reference](#api-reference)
- [Frontend Pages & Components](#frontend-pages--components)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [AI-Powered Features](#ai-powered-features)
- [Design System](#design-system)
- [Scripts Reference](#scripts-reference)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

The **Risk Scenario Simulator** is a full-stack web application designed for organizations to identify, track, analyze, and mitigate risk scenarios across multiple operational domains. It provides a centralized dashboard for monitoring risk metrics, an AI-assisted analysis engine for generating descriptions and recommendations, and real-time streaming reports.

The application follows a **client-server architecture**:
- **Backend**: A lightweight Java HTTP server (using `com.sun.net.httpserver`) connected to MySQL via JDBC with a custom connection pool.
- **Frontend**: A React 18 SPA built with Vite, styled with TailwindCSS 3, and featuring Recharts for data visualization.

---

## Features

### Core Risk Management
- ✅ **CRUD Operations** — Create, Read, Update, and Delete risk scenarios
- ✅ **Pagination & Sorting** — Server-side pagination with configurable page size, sortable by risk score, cost, or date
- ✅ **Advanced Filtering** — Filter by status (OPEN, CRITICAL, IN_PROGRESS, MITIGATED, CLOSED), category, and keyword search
- ✅ **Risk Detail View** — Detailed view of individual risk scenarios with all metadata

### Authentication & Authorization
- 🔐 **JWT Authentication** — Secure login with HMAC-SHA256 signed JSON Web Tokens (24-hour expiry)
- 🔐 **Role-Based Access** — Three roles: `ADMIN`, `MANAGER`, `VIEWER`
- 🔐 **Token Verification** — Auto-verification on app load; auto-redirect on expiry
- 🔐 **Protected Routes** — All application routes require valid authentication

### AI-Powered Analysis
- 🤖 **AI Describe** — Auto-generated risk descriptions based on risk data attributes
- 🤖 **AI Recommend** — Prioritized action recommendations (Immediate, Short-Term, Long-Term)
- 🤖 **AI Query** — Ask natural-language questions about specific risks

### Analytics & Reporting
- 📊 **Dashboard KPIs** — Total risks, open risks, critical alerts, average risk score, total exposure
- 📊 **Status & Category Breakdowns** — Pie charts and bar charts for distribution analysis
- 📊 **Monthly Trend Lines** — Line charts showing risk count over time
- 📊 **Risk Heat Map** — Visual impact × likelihood matrix
- 📊 **Risk Comparison** — Side-by-side comparison of risk metrics
- 📊 **SSE Report Streaming** — Real-time streaming executive report generation via Server-Sent Events
- 📊 **CSV Export** — Download all risk data as a CSV file
- 📊 **PDF Export** — Client-side PDF report generation via jsPDF

### UI/UX
- 🎨 **Premium Dark Theme** — Deep navy (#0a0e1a) color palette with emerald accents
- 🎨 **Responsive Design** — Fully responsive across desktop, tablet, and mobile
- 🎨 **Micro-Animations** — Fade-in, slide-in, pulse-glow, and shimmer effects
- 🎨 **Toast Notifications** — Real-time feedback using react-hot-toast
- 🎨 **Sidebar Navigation** — Collapsible sidebar with icon-based navigation
- 🎨 **Settings Page** — User profile, appearance, notification, and security preferences

---

## Tech Stack

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

### 🔷 Why These Technologies?

**Java 11+** was chosen as the backend language for its strong typing, mature ecosystem, and enterprise-grade reliability. Instead of using a heavyweight framework like Spring Boot, the project uses Java's built-in `com.sun.net.httpserver.HttpServer` — a lightweight, zero-dependency HTTP server that ships with the JDK itself. This keeps the backend lean and fast while still supporting RESTful API patterns, CORS handling, and concurrent request processing via a thread pool.

**MySQL 8.0** serves as the relational database, providing ACID-compliant transactions, foreign key constraints between `users` and `risks` tables, and powerful aggregation queries used for dashboard statistics. The backend connects via the official `mysql-connector-java` JDBC driver and manages connections through a custom `ConnectionPool` implementation built on Java's `BlockingQueue` — maintaining up to 10 reusable connections for high throughput.

**React 18** powers the frontend as a component-based UI library, enabling a modular architecture where each page (Dashboard, Risk List, Analytics, etc.) and widget (KPI cards, charts, heat maps) is an isolated, reusable component. **Vite 5** replaces traditional bundlers like Webpack with near-instant Hot Module Replacement (HMR) during development and also acts as a reverse proxy — forwarding `/api` and `/auth` requests from the frontend (port 5173) to the Java backend (port 8080) during development.

**TailwindCSS 3** provides a utility-first approach to styling, enabling the premium dark theme (`#0a0e1a` navy palette with emerald `#10b981` accents) without writing custom CSS files. Combined with custom keyframe animations (fadeInUp, pulseGlow, shimmer), it delivers a polished, enterprise-grade look. **Recharts** is used for all data visualizations — including pie charts for status distribution, bar charts for category breakdown, and line charts for monthly risk trends.

**Authentication** is handled via a custom **JWT (JSON Web Token)** implementation using **HMAC-SHA256** signing. Tokens are generated server-side with a 24-hour expiry and include user claims (id, username, role, name). On the frontend, **Axios interceptors** automatically attach the `Bearer` token to every API request and redirect to the login page on 401 responses. All database queries use **Prepared Statements** to prevent SQL injection attacks.

**Maven** manages the entire Java build lifecycle — from dependency resolution to creating an executable fat JAR via the Shade Plugin. On the frontend side, **npm** handles package management, while **Concurrently** enables running both the Java backend and Vite dev server with a single `npm run dev` command.

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Java** | 11+ | Core programming language for server-side logic |
| **com.sun.net.httpserver** | JDK built-in | Lightweight HTTP server (no external framework needed) |
| **MySQL** | 8.0+ | Relational database for persistent data storage |
| **mysql-connector-java** | 8.0.33 | JDBC driver for MySQL connectivity |
| **org.json** | 20230227 | JSON serialization and deserialization |
| **jjwt (jsonwebtoken)** | 0.11.5 | JWT library (manual HMAC-SHA256 implementation used) |
| **Maven** | 3.x | Build automation, dependency management, packaging |
| **Maven Shade Plugin** | 3.5.0 | Creates executable fat JAR with all dependencies |
| **Maven Exec Plugin** | 3.1.0 | Runs the application directly via `mvn exec:java` |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.2 | Component-based UI framework |
| **Vite** | 5.0 | Next-gen build tool with HMR and dev proxy |
| **TailwindCSS** | 3.4 | Utility-first CSS framework for rapid styling |
| **React Router DOM** | 6.22 | Declarative client-side routing and navigation |
| **Axios** | 1.6 | Promise-based HTTP client with interceptors |
| **Recharts** | 2.10 | React charting library (Pie, Bar, Line, Area charts) |
| **jsPDF** | 4.2 | Client-side PDF document generation |
| **jspdf-autotable** | 5.0 | Auto-formatted table plugin for jsPDF |
| **react-hot-toast** | 2.4 | Lightweight toast notification system |
| **date-fns** | 3.2 | Modern JavaScript date utility library |

### DevOps & Tooling
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | JavaScript runtime for frontend tooling |
| **npm** | 9+ | Package manager for frontend dependencies |
| **Concurrently** | 9.2 | Run backend + frontend servers simultaneously |
| **PostCSS** | 8.4 | CSS transformation pipeline (used by Tailwind) |
| **Autoprefixer** | 10.4 | Auto-adds vendor prefixes for CSS compatibility |
| **ESLint** | — | JavaScript/React linting and code quality |
| **Git** | — | Version control |
| **GitHub** | — | Remote repository hosting & CI/CD workflows |

### Security
| Technology | Purpose |
|---|---|
| **JWT (JSON Web Tokens)** | Stateless authentication tokens (24h expiry) |
| **HMAC-SHA256** | Cryptographic signing algorithm for JWT |
| **Bearer Token Auth** | Standard HTTP authorization header scheme |
| **CORS Middleware** | Cross-Origin Resource Sharing headers on all endpoints |
| **Prepared Statements** | SQL injection prevention via parameterized queries |
| **Axios Interceptors** | Auto token attachment & 401 response handling |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client (Browser)                  │
│  React 18 + Vite + TailwindCSS + Recharts           │
│  Port: 5173                                         │
└──────────────────────┬──────────────────────────────┘
                       │  HTTP (Axios) / SSE
                       │  Vite Dev Proxy: /api → :8080
                       │                  /auth → :8080
┌──────────────────────▼──────────────────────────────┐
│               Java HTTP Server                       │
│  com.sun.net.httpserver.HttpServer                   │
│  Port: 8080                                         │
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
│  │  JWT Handler  │  │  CORS Handler │                 │
│  │  (HMAC-SHA256)│  │  (Allow *)    │                 │
│  └──────────────┘  └──────────────┘                  │
│  ┌────────────────────────────────────────────────┐  │
│  │  ConnectionPool (10 connections, BlockingQueue) │  │
│  └───────────────────────┬────────────────────────┘  │
└──────────────────────────┼──────────────────────────┘
                           │ JDBC
┌──────────────────────────▼──────────────────────────┐
│                MySQL Database                        │
│  Database: risk_simulator_db                         │
│  Tables: users, risks                                │
│  Port: 3306                                          │
└─────────────────────────────────────────────────────┘
```

---

## Project Structure

```
risk-scenario-simulator/
├── src/
│   └── main/
│       └── java/
│           └── BackendDb.java          # Complete Java backend (single file)
├── Frontend/
│   ├── src/
│   │   ├── main.jsx                    # React entry point
│   │   ├── App.jsx                     # Root component with routing
│   │   ├── index.css                   # Global styles
│   │   ├── App.css                     # App-level styles
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx         # Authentication state management
│   │   ├── services/
│   │   │   └── api.js                  # Axios API client + interceptors
│   │   ├── pages/
│   │   │   ├── Login.jsx               # Login page
│   │   │   ├── Dashboard.jsx           # Main dashboard with KPIs
│   │   │   ├── RiskList.jsx            # Paginated risk table with filters
│   │   │   ├── RiskDetail.jsx          # Individual risk detail view
│   │   │   ├── RiskFormPage.jsx        # Create/Edit risk form
│   │   │   ├── Analytics.jsx           # Charts and analytics
│   │   │   ├── Reports.jsx             # SSE streaming report + PDF export
│   │   │   └── Settings.jsx            # User preferences
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx          # Main layout wrapper
│   │   │   │   ├── Sidebar.jsx         # Side navigation
│   │   │   │   └── Navbar.jsx          # Top navigation bar
│   │   │   ├── common/
│   │   │   │   ├── ProtectedRoute.jsx  # Auth route guard
│   │   │   │   ├── Badge.jsx           # Status/priority badges
│   │   │   │   ├── EmptyState.jsx      # Empty state placeholder
│   │   │   │   ├── ErrorBoundary.jsx   # React error boundary
│   │   │   │   ├── LoadingSpinner.jsx  # Loading indicator
│   │   │   │   ├── LoadingSkeleton.jsx # Skeleton loading state
│   │   │   │   └── NotificationCenter.jsx # Notification dropdown
│   │   │   ├── dashboard/
│   │   │   │   ├── Charts.jsx          # Pie/Bar/Line chart components
│   │   │   │   ├── KPICard.jsx         # Key metric display card
│   │   │   │   ├── RiskComparison.jsx  # Risk comparison widget
│   │   │   │   ├── RiskHeatMap.jsx     # Impact × Likelihood heat map
│   │   │   │   └── StatisticsCard.jsx  # Statistics display card
│   │   │   └── risks/
│   │   │       ├── AIPanel.jsx         # AI analysis panel
│   │   │       ├── AdvancedFilters.jsx # Advanced filter panel
│   │   │       ├── RiskFilters.jsx     # Basic filter bar
│   │   │       ├── RiskForm.jsx        # Risk form component
│   │   │       ├── RiskTable.jsx       # Risk data table
│   │   │       └── StatusBadge.jsx     # Status badge component
│   │   ├── hooks/
│   │   │   ├── useDebounce.js          # Debounce hook for search
│   │   │   └── useLocalStorage.js      # LocalStorage persistence hook
│   │   └── utils/
│   │       ├── formatters.js           # Number/date formatting utilities
│   │       ├── validators.js           # Form validation utilities
│   │       └── pdfGenerators.js        # PDF report generation logic
│   ├── index.html                      # HTML entry point
│   ├── package.json                    # Frontend dependencies
│   ├── vite.config.js                  # Vite config with API proxy
│   ├── tailwind.config.js             # TailwindCSS theme configuration
│   └── postcss.config.js             # PostCSS config
├── pom.xml                            # Maven build config
├── package.json                       # Root scripts (dev, server, client)
├── setup.sql                          # Database schema + seed users
├── risks-insert.sql                   # Risk seed data
├── seed-80-risks.sql                  # Extended 80-risk seed data
├── .env.example                       # Environment template
├── .env                               # Environment variables (gitignored)
└── README.md                          # This file
```

---

## Prerequisites

Ensure the following are installed on your system:

| Requirement | Version | Check Command |
|---|---|---|
| **Java JDK** | 11 or higher | `java -version` |
| **Apache Maven** | 3.x | `mvn -version` |
| **MySQL Server** | 8.0+ | `mysql --version` |
| **Node.js** | 18+ | `node -v` |
| **npm** | 9+ | `npm -v` |

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/RoopRC/risk-scenario-simulator.git
cd risk-scenario-simulator
```

### 2. Database Setup (MySQL)

Start your MySQL server and run the schema setup:

```bash
mysql -u root -p < setup.sql
```

This creates:
- Database `risk_simulator_db`
- `users` table with 3 default accounts
- `risks` table with foreign key to users

Then seed risk data:

```bash
mysql -u root -p risk_simulator_db < seed-80-risks.sql
```

### 3. Environment Configuration

Copy the example env file and fill in your MySQL credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=risk_simulator_db
DB_PORT=3306

# Server Configuration
PORT=8080

# JWT Secret Key
JWT_SECRET=your-secret-key-for-jwt
```

For the frontend, create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:8080
```

### 4. Backend Setup (Java)

```bash
# Install dependencies and compile
mvn clean install

# Run the backend server
mvn exec:java
```

You should see:

```
🚀 Backend running on http://localhost:8080
📦 Connected to MySQL Database: risk_simulator_db
🔐 Authentication enabled with JWT
```

### 5. Frontend Setup (React)

```bash
cd Frontend
npm install
npm run dev
```

The frontend starts at **http://localhost:5173**. The Vite dev server proxies `/api` and `/auth` requests to the Java backend at port 8080.

### 6. Run Both Together

From the project root:

```bash
npm run dev
```

This uses `concurrently` to:
1. Build the Java backend JAR (`mvn clean package`)
2. Start the backend (`java -jar target/backend.jar`)
3. Start the frontend dev server (`cd Frontend && npm run dev`)

---

## Default User Accounts

| Username | Password | Role | Permissions |
|---|---|---|---|
| `admin` | `admin123` | ADMIN | Full access — create, edit, delete risks |
| `manager` | `manager123` | MANAGER | Create, edit risks; view all data |
| `viewer` | `viewer123` | VIEWER | Read-only access to all data |

---

## API Reference

All API endpoints (except `/auth/login`) require a valid JWT token in the `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/login` | Login with username/password | ❌ |
| `GET` | `/auth/verify` | Verify JWT token & get user info | ✅ |

**POST /auth/login** — Request:
```json
{ "username": "admin", "password": "admin123" }
```
Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "id": 1,
  "username": "admin",
  "name": "Admin User",
  "role": "ADMIN",
  "email": "admin@risksim.com"
}
```

### Risks CRUD

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/risks` | List risks (paginated) |
| `GET` | `/api/risks/:id` | Get risk by ID |
| `POST` | `/api/risks` | Create new risk |
| `PUT` | `/api/risks/:id` | Update existing risk |
| `DELETE` | `/api/risks/:id` | Delete a risk |

**GET /api/risks** — Query Parameters:
| Param | Default | Description |
|---|---|---|
| `page` | `0` | Page number (zero-indexed) |
| `size` | `10` | Page size |
| `search` | — | Search in title and description |
| `status` | — | Filter by status |
| `category` | — | Filter by category |
| `sortBy` | `id` | Sort column (`riskScore`, `projectedCost`, `createdAt`) |
| `sortDir` | `asc` | Sort direction (`asc` or `desc`) |

Response:
```json
{
  "content": [ { "id": 1, "title": "...", "riskScore": 8.5, ... } ],
  "pageable": { "pageNumber": 0, "pageSize": 10 },
  "totalElements": 80,
  "totalPages": 8
}
```

### AI Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/risks/:id/ai/describe` | Generate AI description |
| `POST` | `/api/risks/:id/ai/recommend` | Get AI recommendations |
| `POST` | `/api/risks/:id/ai/query` | Ask a question about a risk |

### Statistics & Export

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats` | Dashboard statistics |
| `GET` | `/api/export/csv` | Export all risks as CSV |
| `GET` | `/api/reports/stream` | SSE streaming executive report |

---

## Frontend Pages & Components

### Pages

| Page | Route | Description |
|---|---|---|
| **Login** | `/login` | JWT authentication with credentials form |
| **Dashboard** | `/dashboard` | KPI cards, trend charts, status breakdown, heat map |
| **Risk List** | `/risks` | Paginated table with search, filters, sorting |
| **Risk Detail** | `/risks/:id` | Full risk view with AI analysis panel |
| **Create Risk** | `/risks/new` | Risk creation form with validation |
| **Edit Risk** | `/risks/:id/edit` | Edit existing risk scenario |
| **Analytics** | `/analytics` | Category breakdown, risk comparison, charts |
| **Reports** | `/reports` | SSE streaming AI report + PDF export |
| **Settings** | `/settings` | Profile, appearance, notification preferences |

### Key Components

- **Layout** — Sidebar + Navbar + Content area with responsive design
- **Sidebar** — Collapsible icon navigation with active route highlighting
- **AIPanel** — Interactive AI analysis with Describe, Recommend, and Query tabs
- **RiskHeatMap** — 5×5 matrix mapping impact vs. likelihood
- **RiskComparison** — Radar-style metric comparison between risks
- **Charts** — Recharts-powered pie, bar, and line visualizations

---

## Database Schema

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

## Authentication Flow

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

## AI-Powered Features

The backend includes a simulated AI engine that generates contextual analysis based on the risk's actual data attributes. Each endpoint returns structured metadata mimicking a real LLM integration:

- **Describe** — Generates a narrative analysis based on risk score, impact, likelihood, category, and projected cost
- **Recommend** — Returns 3 prioritized actions: IMMEDIATE (HIGH), SHORT_TERM (MEDIUM), LONG_TERM (LOW)
- **Query** — Accepts a natural-language question and returns a context-aware answer

Response metadata includes: `confidence`, `model_used` (llama-3.3-70b), `tokens_used`, `response_time_ms`, and `cached` fields.

---

## Design System

The frontend uses a custom dark theme built on TailwindCSS:

| Token | Value | Usage |
|---|---|---|
| `navy-900` | `#0a0e1a` | Primary background |
| `navy-800` | `#0f1628` | Surface/body background |
| `navy-700` | `#162d47` | Card backgrounds |
| `accent` | `#10b981` | Primary emerald accent |
| `teal` | `#06b6d4` | Secondary accent |
| `secondary` | `#a855f7` | Purple highlights |
| `danger` | `#ef4444` | Error states |
| `warning` | `#f97316` | Warning states |
| `text-primary` | `#f8fafc` | Primary text |
| `text-muted` | `#94a3b8` | Muted/secondary text |

**Typography**: Inter (Google Fonts)  
**Animations**: fadeInUp, fadeIn, slideInLeft, pulseGlow, shimmer

---

## Scripts Reference

### Root `package.json`

| Script | Command | Description |
|---|---|---|
| `npm run server` | `mvn clean install && mvn exec:java` | Build and run Java backend |
| `npm run server:build` | `mvn clean package` | Build backend JAR only |
| `npm run client` | `cd Frontend && npm run dev` | Start frontend dev server |
| `npm run dev` | Build JAR + run both concurrently | Full-stack development mode |

### Frontend `package.json`

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `vite` | Start dev server on port 5173 |
| `npm run build` | `vite build` | Production build to `dist/` |
| `npm run preview` | `vite preview` | Preview production build |

---

## Troubleshooting

### Backend won't start — "Connection refused"
- Ensure MySQL is running: `net start mysql` (Windows) or `sudo systemctl start mysql` (Linux)
- Verify credentials in `.env` match your MySQL setup
- Check that database `risk_simulator_db` exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Frontend proxy errors
- Ensure the Java backend is running on port 8080 before starting the frontend
- Check `Frontend/vite.config.js` proxy configuration points to correct backend port

### JWT Token issues
- Ensure `JWT_SECRET` is the same across server restarts
- Clear `localStorage` in the browser if you get persistent 401 errors
- Check browser DevTools → Application → Local Storage for stale tokens

### MySQL driver not found
- Run `mvn clean install` to download dependencies
- Verify `mysql-connector-java` is in `pom.xml`

### Port already in use
- Backend: Change `PORT` in `.env` (default: 8080)
- Frontend: Change `server.port` in `Frontend/vite.config.js` (default: 5173)

---

## License

ISC

---

<p align="center">
  <b>Built with ❤️ for Enterprise Risk Management</b><br>
  <i>Risk Scenario Simulator — Identify, Analyze, Mitigate</i>
</p>
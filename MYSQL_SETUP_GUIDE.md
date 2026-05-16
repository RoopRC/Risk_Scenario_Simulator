# MySQL Integration Guide - Risk Scenario Simulator

## Overview
This guide will help you set up MySQL Workbench to manage risk data for your Risk Scenario Simulator project. Instead of mock in-memory data, you'll have persistent database storage.

---

## **PHASE 1: PREREQUISITES**

### 1. Install MySQL Server & Workbench
- Download MySQL Community Server from [mysql.com](https://dev.mysql.com/downloads/mysql/)
- Download MySQL Workbench from [mysql.com/workbench](https://dev.mysql.com/downloads/workbench/)
- Install both (Workbench is the GUI tool to manage MySQL)

### 2. Verify Installation
- Open MySQL Workbench
- Create a new connection to `localhost` with default port `3306`
- Default user is `root` with no password (or your custom password if set during installation)

---

## **PHASE 2: DATABASE SETUP**

### Step 1: Create Database Schema

**In MySQL Workbench:**
1. Click on **File → New Query Tab**
2. Copy and paste this SQL script:

```sql
CREATE DATABASE IF NOT EXISTS risk_simulator_db;
USE risk_simulator_db;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role ENUM('ADMIN', 'MANAGER', 'VIEWER') DEFAULT 'VIEWER',
  email VARCHAR(100) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risks table
CREATE TABLE risks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT NOT NULL,
  category ENUM('Infrastructure', 'Cybersecurity', 'Financial', 'Operational', 'Compliance', 'Strategic') NOT NULL,
  riskScore DECIMAL(3,1) NOT NULL,
  impact ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
  likelihood ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
  status ENUM('OPEN', 'IN_PROGRESS', 'MITIGATED', 'CLOSED', 'CRITICAL') NOT NULL,
  mitigationPlan LONGTEXT NOT NULL,
  projectedCost INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  createdBy INT,
  FOREIGN KEY (createdBy) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_risks_status ON risks(status);
CREATE INDEX idx_risks_category ON risks(category);
CREATE INDEX idx_risks_title ON risks(title);

-- Insert seed users
INSERT INTO users (username, password, name, role, email) VALUES 
('admin', 'admin123', 'Admin User', 'ADMIN', 'admin@risksim.com'),
('manager', 'manager123', 'Manager User', 'MANAGER', 'manager@risksim.com'),
('viewer', 'viewer123', 'Viewer User', 'VIEWER', 'viewer@risksim.com');
```

3. Click **Execute** (or press Ctrl+Enter)
4. You should see success messages in the Output panel

### Step 2: Verify Database Creation

In MySQL Workbench:
- Left panel: Refresh or check that `risk_simulator_db` appears
- Click on it to expand and see the `users` and `risks` tables

---

## **PHASE 3: ADD INITIAL RISK DATA**

### Option A: Insert Data via SQL (Recommended for Initial Setup)

Run this SQL in MySQL Workbench to insert sample risks:

```sql
USE risk_simulator_db;

INSERT INTO risks (title, description, category, riskScore, impact, likelihood, status, mitigationPlan, projectedCost, createdBy) VALUES
('Regional Data Center Power Failure', 'Primary data center in US-East experiencing intermittent power supply issues due to aging UPS infrastructure. Risk of cascading failures across dependent microservices.', 'Infrastructure', 8.5, 'CRITICAL', 'MEDIUM', 'OPEN', 'Deploy redundant UPS systems and implement automatic failover to US-West region within 30 seconds.', 250000, 1),
('SQL Injection in Legacy API Gateway', 'Penetration testing revealed SQL injection vulnerability in the v1 authentication endpoint. Attacker could extract user credentials and session tokens.', 'Cybersecurity', 9.2, 'CRITICAL', 'HIGH', 'CRITICAL', 'Implement parameterized queries, deploy WAF rules, and schedule emergency patch for v1 API gateway.', 85000, 1),
('Currency Exchange Rate Volatility', 'Exposure to EUR/USD fluctuations impacting Q2 revenue projections by approximately 4.2%. Hedging strategy needs immediate review.', 'Financial', 6.8, 'HIGH', 'MEDIUM', 'IN_PROGRESS', 'Engage treasury team to implement forward contracts covering 80% of projected EUR exposure for Q2-Q3.', 180000, 1),
('Supply Chain Semiconductor Shortage', 'Critical chip shortage affecting production of IoT sensor modules. Lead times extended from 8 to 22 weeks.', 'Operational', 7.5, 'HIGH', 'HIGH', 'OPEN', 'Diversify supplier base across 3 regions. Negotiate priority allocation with existing vendors.', 420000, 1),
('GDPR Data Retention Non-Compliance', 'Audit revealed customer PII retained beyond 36-month regulatory limit in 3 legacy databases. Potential fine up to 4% of annual revenue.', 'Compliance', 8.0, 'CRITICAL', 'MEDIUM', 'IN_PROGRESS', 'Implement automated data purge pipeline. Deploy retention policy enforcement across all databases by Q2.', 150000, 1);
```

### Option B: Insert via Frontend Interface (After Backend Setup)

Once your backend is running, you can use the frontend UI to add risks:
1. Login with credentials (admin/admin123)
2. Navigate to Dashboard → Add Risk
3. Fill in the form and submit

---

## **PHASE 4: BACKEND SETUP**

### Step 1: Install Dependencies

```bash
# Navigate to your project root
cd "c:\Users\lenov\OneDrive\Desktop\CampusPe\..Internship Project\risk-scenario-simulator"

# Install new packages
npm install
```

### Step 2: Create `.env` File

Create a `.env` file in the root directory with your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=risk_simulator_db
DB_PORT=3306
JWT_SECRET=your-secret-key-for-jwt
PORT=8080
```

**Note:** If you set a password during MySQL installation, update `DB_PASSWORD` accordingly.

### Step 3: Switch to Database Backend

**Option A: Use Database Backend**
```bash
npm run server-db
```

**Option B: Start Both Frontend & Backend with DB**
```bash
npm run dev-db
```

**Option C: Keep Original Mock Backend**
```bash
npm run server   # This uses mock-backend.js (no database)
npm run dev      # This starts both mock backend and frontend
```

---

## **PHASE 5: MANAGE DATA IN MySQL WORKBENCH**

### Add New Risk Data

1. Open MySQL Workbench
2. Click **File → New Query Tab**
3. Run an INSERT query:

```sql
INSERT INTO risks (title, description, category, riskScore, impact, likelihood, status, mitigationPlan, projectedCost, createdBy) 
VALUES 
('New Risk Title', 'Risk description here', 'Infrastructure', 7.5, 'HIGH', 'MEDIUM', 'OPEN', 'Mitigation plan details', 100000, 1);
```

### View All Risks

```sql
SELECT * FROM risks;
```

### View Risks by Status

```sql
SELECT * FROM risks WHERE status = 'OPEN';
SELECT * FROM risks WHERE status = 'CRITICAL';
```

### View Risks by Category

```sql
SELECT * FROM risks WHERE category = 'Cybersecurity';
SELECT * FROM risks WHERE category = 'Financial';
```

### Update Risk

```sql
UPDATE risks 
SET status = 'IN_PROGRESS', updatedAt = CURRENT_TIMESTAMP 
WHERE id = 1;
```

### Delete Risk

```sql
DELETE FROM risks WHERE id = 1;
```

### Get Statistics

```sql
SELECT 
  COUNT(*) as total_risks,
  SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END) as open_risks,
  SUM(CASE WHEN status = 'CRITICAL' THEN 1 ELSE 0 END) as critical_risks,
  ROUND(AVG(riskScore), 2) as avg_risk_score,
  SUM(projectedCost) as total_exposure
FROM risks;
```

---

## **PHASE 6: TROUBLESHOOTING**

### ❌ Error: "Connect ECONNREFUSED 127.0.0.1:3306"
**Solution:** MySQL server is not running
- On **Windows**: Open Services (services.msc) and start "MySQL80" or "MySQL"
- Or open MySQL Workbench and verify connection

### ❌ Error: "Access denied for user 'root'@'localhost'"
**Solution:** Wrong password in `.env` file
- Verify your MySQL root password
- Update `DB_PASSWORD` in `.env`

### ❌ Error: "Unknown database 'risk_simulator_db'"
**Solution:** Database was not created
- Run the database creation SQL script again in MySQL Workbench

### ❌ Frontend still showing old mock data
**Solution:** Backend is running the old mock backend
- Stop the server (Ctrl+C)
- Run `npm run server-db` instead of `npm run server`

### ❌ Can't add/update risks through frontend
**Solution:** Check backend logs
- Look for error messages in terminal where `npm run server-db` is running
- Verify all fields are filled correctly in the form

---

## **SUMMARY: QUICK START**

```bash
# 1. Create database (run once in MySQL Workbench)
# Use the SQL script from PHASE 2, STEP 1

# 2. Install dependencies
npm install

# 3. Create .env file with your MySQL credentials

# 4. Start backend with database
npm run server-db

# 5. In another terminal, start frontend
cd Frontend
npm run dev

# 6. Access at http://localhost:5173
# Login with: admin / admin123
```

---

## **NEXT STEPS**

✅ **What you can now do:**
- Add risks through the web interface
- Manage risks directly in MySQL Workbench
- Export risks as CSV
- Track risk metrics and statistics
- Use the AI panel to analyze risks
- Generate reports

✅ **Optional Enhancements:**
- Add authentication with password hashing (bcrypt)
- Add audit logging for risk changes
- Implement risk history/changelog
- Add email notifications for critical risks
- Create backup/restore procedures

---

For questions or issues, check the terminal output for detailed error messages!

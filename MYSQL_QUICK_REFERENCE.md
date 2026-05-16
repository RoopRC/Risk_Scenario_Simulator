# MySQL Workbench Quick Reference

## Common Operations for Risk Management

### 📊 VIEW ALL RISKS
```sql
SELECT id, title, category, riskScore, impact, likelihood, status, projectedCost, createdAt 
FROM risks 
ORDER BY riskScore DESC;
```

### 🔴 VIEW CRITICAL RISKS ONLY
```sql
SELECT * FROM risks 
WHERE status = 'CRITICAL' 
ORDER BY riskScore DESC;
```

### 📈 VIEW OPEN RISKS
```sql
SELECT * FROM risks 
WHERE status = 'OPEN' 
ORDER BY riskScore DESC;
```

### 🏷️ RISKS BY CATEGORY
```sql
SELECT category, COUNT(*) as count, ROUND(AVG(riskScore), 2) as avg_score
FROM risks 
GROUP BY category 
ORDER BY avg_score DESC;
```

### 💰 HIGHEST COST RISKS
```sql
SELECT title, category, riskScore, projectedCost 
FROM risks 
ORDER BY projectedCost DESC 
LIMIT 10;
```

### ✅ COMPLETED/MITIGATED RISKS
```sql
SELECT * FROM risks 
WHERE status IN ('MITIGATED', 'CLOSED') 
ORDER BY updatedAt DESC;
```

---

## ➕ ADD NEW RISK

### Infrastructure Risk
```sql
INSERT INTO risks (title, description, category, riskScore, impact, likelihood, status, mitigationPlan, projectedCost, createdBy) 
VALUES (
  'Server Downtime Risk',
  'Potential server failures affecting service availability',
  'Infrastructure',
  7.5,
  'HIGH',
  'MEDIUM',
  'OPEN',
  'Implement redundant servers and automated failover',
  200000,
  1
);
```

### Cybersecurity Risk
```sql
INSERT INTO risks (title, description, category, riskScore, impact, likelihood, status, mitigationPlan, projectedCost, createdBy) 
VALUES (
  'Unauthorized Access',
  'Risk of unauthorized access to sensitive data',
  'Cybersecurity',
  8.5,
  'CRITICAL',
  'MEDIUM',
  'OPEN',
  'Implement MFA and access controls',
  150000,
  1
);
```

### Financial Risk
```sql
INSERT INTO risks (title, description, category, riskScore, impact, likelihood, status, mitigationPlan, projectedCost, createdBy) 
VALUES (
  'Budget Overrun',
  'Project costs exceeding allocated budget',
  'Financial',
  6.0,
  'MEDIUM',
  'MEDIUM',
  'IN_PROGRESS',
  'Implement strict cost monitoring and controls',
  50000,
  1
);
```

### Operational Risk
```sql
INSERT INTO risks (title, description, category, riskScore, impact, likelihood, status, mitigationPlan, projectedCost, createdBy) 
VALUES (
  'Process Failure',
  'Key operational processes may fail',
  'Operational',
  5.5,
  'MEDIUM',
  'LOW',
  'OPEN',
  'Document and automate processes',
  100000,
  1
);
```

### Compliance Risk
```sql
INSERT INTO risks (title, description, category, riskScore, impact, likelihood, status, mitigationPlan, projectedCost, createdBy) 
VALUES (
  'Regulatory Violation',
  'Non-compliance with industry regulations',
  'Compliance',
  8.0,
  'CRITICAL',
  'LOW',
  'IN_PROGRESS',
  'Conduct audit and implement required controls',
  300000,
  1
);
```

### Strategic Risk
```sql
INSERT INTO risks (title, description, category, riskScore, impact, likelihood, status, mitigationPlan, projectedCost, createdBy) 
VALUES (
  'Market Competition',
  'New competitors entering market',
  'Strategic',
  6.5,
  'HIGH',
  'MEDIUM',
  'OPEN',
  'Develop competitive differentiation strategy',
  500000,
  1
);
```

---

## ✏️ UPDATE RISKS

### Change Risk Status
```sql
UPDATE risks 
SET status = 'IN_PROGRESS', updatedAt = CURRENT_TIMESTAMP 
WHERE id = 1;
```

### Change Risk Score
```sql
UPDATE risks 
SET riskScore = 8.5, updatedAt = CURRENT_TIMESTAMP 
WHERE id = 1;
```

### Update Mitigation Plan
```sql
UPDATE risks 
SET mitigationPlan = 'New mitigation strategy here', updatedAt = CURRENT_TIMESTAMP 
WHERE id = 1;
```

### Close a Risk
```sql
UPDATE risks 
SET status = 'CLOSED', updatedAt = CURRENT_TIMESTAMP 
WHERE id = 1;
```

### Mark as Mitigated
```sql
UPDATE risks 
SET status = 'MITIGATED', updatedAt = CURRENT_TIMESTAMP 
WHERE id = 1;
```

---

## 🗑️ DELETE RISKS

### Delete Single Risk
```sql
DELETE FROM risks WHERE id = 1;
```

### Delete All CLOSED Risks
```sql
DELETE FROM risks WHERE status = 'CLOSED';
```

### Delete All Risks (⚠️ USE WITH CAUTION)
```sql
DELETE FROM risks;
```

---

## 📊 STATISTICS & ANALYTICS

### Overall Dashboard Stats
```sql
SELECT 
  COUNT(*) as total_risks,
  SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END) as open_risks,
  SUM(CASE WHEN status = 'CRITICAL' THEN 1 ELSE 0 END) as critical_risks,
  SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress,
  SUM(CASE WHEN status = 'MITIGATED' THEN 1 ELSE 0 END) as mitigated,
  SUM(CASE WHEN status = 'CLOSED' THEN 1 ELSE 0 END) as closed,
  ROUND(AVG(riskScore), 2) as avg_risk_score,
  SUM(projectedCost) as total_exposure,
  MAX(riskScore) as max_risk_score,
  MIN(riskScore) as min_risk_score
FROM risks;
```

### Risks by Impact Level
```sql
SELECT impact, COUNT(*) as count, ROUND(AVG(riskScore), 2) as avg_score
FROM risks 
GROUP BY impact 
ORDER BY 
  CASE impact 
    WHEN 'CRITICAL' THEN 1 
    WHEN 'HIGH' THEN 2 
    WHEN 'MEDIUM' THEN 3 
    WHEN 'LOW' THEN 4 
  END;
```

### Risks by Likelihood
```sql
SELECT likelihood, COUNT(*) as count, ROUND(AVG(riskScore), 2) as avg_score
FROM risks 
GROUP BY likelihood;
```

### High-Risk Scenarios (Score >= 7)
```sql
SELECT title, category, riskScore, impact, likelihood, status 
FROM risks 
WHERE riskScore >= 7 
ORDER BY riskScore DESC;
```

### Recent Risk Changes (Last 7 Days)
```sql
SELECT title, status, riskScore, updatedAt 
FROM risks 
WHERE updatedAt >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
ORDER BY updatedAt DESC;
```

### Risk Distribution by Category
```sql
SELECT 
  category,
  COUNT(*) as count,
  SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END) as open,
  SUM(CASE WHEN status = 'CRITICAL' THEN 1 ELSE 0 END) as critical,
  ROUND(AVG(riskScore), 2) as avg_score,
  SUM(projectedCost) as total_cost
FROM risks 
GROUP BY category 
ORDER BY total_cost DESC;
```

---

## 👥 USER MANAGEMENT

### View All Users
```sql
SELECT id, username, name, role, email, createdAt FROM users;
```

### Add New User
```sql
INSERT INTO users (username, password, name, role, email) 
VALUES ('newuser', 'password123', 'New User', 'VIEWER', 'newuser@risksim.com');
```

### Change User Role
```sql
UPDATE users 
SET role = 'MANAGER' 
WHERE username = 'viewer';
```

### Change User Password
```sql
UPDATE users 
SET password = 'newpassword123' 
WHERE username = 'admin';
```

---

## 🔧 DATABASE MAINTENANCE

### Check Database Size
```sql
SELECT 
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'risk_simulator_db';
```

### Check Table Records
```sql
SELECT table_name, table_rows 
FROM information_schema.tables 
WHERE table_schema = 'risk_simulator_db';
```

### Export Data to CSV (use MySQL Workbench Export feature)
1. Right-click on `risks` table
2. Select "Export Table Data"
3. Choose CSV format and location

### Backup Database
```bash
# Run in command prompt
mysqldump -u root -p risk_simulator_db > backup_risks.sql
# Enter password when prompted
```

### Restore Database
```bash
# Run in command prompt
mysql -u root -p risk_simulator_db < backup_risks.sql
# Enter password when prompted
```

---

## 💡 TIPS

- **Always use WHERE clause** to avoid unintended updates/deletes
- **Test SELECT queries first** before UPDATE/DELETE
- **Use LIMIT clause** for large result sets
- **Create regular backups** of your database
- **Use transactions** for complex multi-step operations
- **Index frequently searched columns** for better performance

# ☕ Java Backend Setup Guide

Your backend has been successfully converted from JavaScript/Node.js to **pure Java** with MySQL!

## Prerequisites

### 1. Install Java Development Kit (JDK 11+)
- Download from [oracle.com](https://www.oracle.com/java/technologies/downloads/) or [adoptopenjdk.net](https://adoptopenjdk.net/)
- Verify installation:
  ```bash
  java -version
  ```

### 2. Install Maven 3.8+
- Download from [maven.apache.org](https://maven.apache.org/download.cgi)
- Verify installation:
  ```bash
  mvn -version
  ```

### 3. MySQL Database (Already Configured)
- Ensure MySQL is running on `localhost:3306`
- Database: `risk_simulator_db`
- Your existing `.env` file is still used for configuration

---

## 🚀 Quick Start

### Step 1: Build the Java Backend
```bash
mvn clean package
```

This will:
- Download all dependencies
- Compile the Java code
- Create `target/backend.jar` (executable JAR file)

### Step 2: Run the Backend
```bash
java -jar target/backend.jar
```

Or use the npm script:
```bash
npm run server
```

### Step 3: Run Frontend + Backend
```bash
npm run dev
```

---

## 📁 Project Structure

```
risk-scenario-simulator/
├── backend-db.java          ← Main backend code
├── pom.xml                  ← Maven configuration
├── .env                     ← Database credentials
├── package.json             ← Updated with Java scripts
├── target/
│   └── backend.jar          ← Compiled executable (after build)
└── Frontend/                ← React frontend (unchanged)
```

---

## 🔧 Configuration

Your `.env` file already has the required variables:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=risk_simulator_db
DB_PORT=3306
JWT_SECRET=your-secret-key-for-jwt
PORT=8080
```

---

## ✅ What's Included

### Java Backend Features:
- ✓ **HTTP Server**: Built-in Java HttpServer (no Spring Boot)
- ✓ **MySQL Connection Pool**: 10 concurrent connections
- ✓ **JWT Authentication**: HMAC-SHA256 token verification
- ✓ **CORS Enabled**: For frontend communication
- ✓ **All Endpoints**:
  - Authentication (`/auth/login`, `/auth/verify`)
  - CRUD Operations (`/api/risks`)
  - Statistics (`/api/stats`)
  - Export (`/api/export/csv`)
  - AI Features (`/api/risks/:id/ai/*`)
  - Streaming Reports (`/api/reports/stream`)

### Dependencies:
- `mysql-connector-java` - MySQL driver
- `org.json` - JSON processing
- `jjwt` - JWT library (optional, using manual HMAC)

---

## 📝 Available Commands

| Command | Description |
|---------|-------------|
| `npm run server` | Build and run the Java backend |
| `npm run server:build` | Just build (creates JAR) |
| `npm run client` | Run React frontend only |
| `npm run dev` | Run both backend & frontend |
| `mvn clean` | Remove build files |
| `mvn compile` | Just compile code |

---

## 🐛 Troubleshooting

### Issue: "MySQL Driver not found"
```bash
# Reinstall dependencies
mvn clean install
```

### Issue: "Port 8080 already in use"
```bash
# Change PORT in .env file
PORT=8081 npm run server
```

### Issue: "Database connection refused"
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `.env`
- Ensure `risk_simulator_db` exists

---

## 🔄 Switching Back to JavaScript (if needed)
```bash
npm install
npm run server
```

---

**Backend is now running with pure Java + MySQL!** 🎉

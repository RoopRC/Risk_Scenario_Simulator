-- Create database
CREATE DATABASE IF NOT EXISTS risk_simulator_db;
USE risk_simulator_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  role ENUM('ADMIN', 'MANAGER', 'VIEWER') DEFAULT 'VIEWER',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create risks table
CREATE TABLE IF NOT EXISTS risks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  riskScore DECIMAL(3, 1),
  impact VARCHAR(20),
  likelihood VARCHAR(20),
  status VARCHAR(20),
  mitigationPlan TEXT,
  projectedCost INT,
  createdBy INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(id)
);

-- Insert default users
INSERT INTO users (username, password, name, email, role) VALUES
('admin', 'admin123', 'Admin User', 'admin@risksim.com', 'ADMIN'),
('manager', 'manager123', 'Manager User', 'manager@risksim.com', 'MANAGER'),
('viewer', 'viewer123', 'Viewer User', 'viewer@risksim.com', 'VIEWER');

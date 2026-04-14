-- ==========================================
-- SQL CRASH COURSE: INITIALIZATION DB SCRIPT
-- Compatible with MySQL, PostgreSQL, SQLite
-- ==========================================

-- 1. Clean up existing tables if this is run multiple times
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

-- 2. Create the Corporate Architecture (Tables)
CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  region VARCHAR(50),
  signup_date DATE
);

CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  category VARCHAR(100),
  margin DECIMAL(5, 2)
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT,
  product_id INT,
  revenue INT,
  order_date DATE,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 3. Insert the Mock SaaS Data
INSERT INTO customers (id, name, region, signup_date) VALUES 
  (101, 'TechFlow Corp', 'NA', '2023-01-15'),
  (102, 'BrightSun LLC', 'EMEA', '2023-03-22'),
  (103, 'Apex Consulting', 'APAC', '2023-06-10'),
  (104, 'Vertex Media', 'NA', '2023-08-05');

INSERT INTO products (id, name, category, margin) VALUES 
  (501, 'Base License', 'Software', 0.85),
  (502, 'Pro License', 'Software', 0.90),
  (503, 'Cloud Storage', 'Hosting', 0.45),
  (504, 'Priority Tech', 'Support', 0.35);

INSERT INTO orders (id, customer_id, product_id, revenue, order_date) VALUES 
  (1001, 101, 502, 15000, '2024-02-01'),
  (1002, 102, 501, 5000, '2024-02-05'),
  (1003, 101, 503, 2000, '2024-02-10'),
  (1004, 103, 502, 15000, '2024-02-15'),
  (1005, 104, 504, 1000, '2024-02-20');

-- 4. Test Queries to ensure connection bounds
-- SELECT * FROM orders;
-- SELECT c.name, SUM(o.revenue) as Total_Revenue FROM orders o JOIN customers c ON o.customer_id = c.id GROUP BY c.name;

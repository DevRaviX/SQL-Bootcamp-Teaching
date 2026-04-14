import alasql from 'alasql';

export const initDatabase = () => {
  // Clear any existing tables
  alasql('DROP TABLE IF EXISTS customers');
  alasql('DROP TABLE IF EXISTS products');
  alasql('DROP TABLE IF EXISTS orders');

  // Create Tables
  alasql(`
    CREATE TABLE customers (
      id INT,
      name STRING,
      region STRING,
      signup_date STRING
    )
  `);

  alasql(`
    CREATE TABLE products (
      id INT,
      name STRING,
      category STRING,
      margin FLOAT
    )
  `);

  alasql(`
    CREATE TABLE orders (
      id INT,
      customer_id INT,
      product_id INT,
      revenue INT,
      order_date STRING
    )
  `);

  // Insert Mock Data
  alasql(`INSERT INTO customers VALUES 
    (101, 'TechFlow Corp', 'NA', '2023-01-15'),
    (102, 'BrightSun LLC', 'EMEA', '2023-03-22'),
    (103, 'Apex Consulting', 'APAC', '2023-06-10'),
    (104, 'Vertex Media', 'NA', '2023-08-05')
  `);

  alasql(`INSERT INTO products VALUES 
    (501, 'Base License', 'Software', 0.85),
    (502, 'Pro License', 'Software', 0.90),
    (503, 'Cloud Storage', 'Hosting', 0.45),
    (504, 'Priority Tech', 'Support', 0.35)
  `);

  alasql(`INSERT INTO orders VALUES 
    (1001, 101, 502, 15000, '2024-02-01'),
    (1002, 102, 501, 5000, '2024-02-05'),
    (1003, 101, 503, 2000, '2024-02-10'),
    (1004, 103, 502, 15000, '2024-02-15'),
    (1005, 104, 504, 1000, '2024-02-20')
  `);

  console.log("Mock Database initialized completely in AlaSQL.");
};

export const executeQuery = (query) => {
  try {
    const res = alasql(query);
    return { data: res, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

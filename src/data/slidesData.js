export const slides = [
  {
    id: 1,
    title: "The Hook: Excel vs. SQL",
    bullets: [
      "The Limit: Excel taps out at 1,048,576 rows. Modern data breaks it instantly.",
      "The Risk: Frozen screens, crashed memory, and siloed decision-making.",
      "The Reality: If your insights rely on manual VLOOKUPs, your company is losing money."
    ],
    analogy: "Excel is a custom spreadsheet on a clipboard. A database is a mechanized Amazon fulfillment center.",
    speakerNotes: "Welcome to Complete SQL. We're starting here because everyone has crashed Excel before. Over a million rows, Excel is a liability. We're here because business decisions today require crunching 50 million rows before your morning coffee.",
    image: "/excel_crash_1776186861211.png"
  },
  {
    id: 2,
    title: "What is a Database?",
    bullets: [
      "A centralized, highly structured vault for corporate data.",
      "Separates storage from analysis, meaning there is only 'One Source of Truth'.",
      "Process tens of millions of records in milliseconds securely."
    ],
    analogy: "A database isn't a spreadsheet; it's a reinforced corporate filing system managed by robotic librarians.",
    speakerNotes: "A database is where the raw data lives. It's the central nervous system of any enterprise.",
    image: "/what_is_db_1776188195266.png"
  },
  {
    id: 3,
    title: "Architecture: Tables & Keys",
    bullets: [
      "Tables: Databases are just collections of specific Tables (e.g. Customers, Orders).",
      "Primary Key (PK): A unique identifier for every single row (like a SSN).",
      "Foreign Key (FK): A reference connecting one table's row to another."
    ],
    analogy: "Primary Key is your Passport ID. Foreign Key is writing that Passport ID on a flight manifest so they are linked.",
    speakerNotes: "To ensure data isn't duplicated, we separate it into tables. Primary keys and foreign keys are the glue that holds these tables together.",
    image: "/db_keys_1776188210871.png"
  },
  {
    id: 4,
    title: "DDL: Creating a Database",
    bullets: [
      "Data Definition Language (DDL) is used to structure the environment.",
      "First step: CREATE the database to hold your tables.",
      "Syntax is explicit, simple, and plain English."
    ],
    codeSnippet: "CREATE DATABASE EnterpriseDB;",
    analogy: "You can't store files without buying the filing cabinet first.",
    speakerNotes: "Before we do anything, we build the house. CREATE DATABASE tells the server to section off memory for our project.",
    image: "/db_creation_1776188485717.png"
  },
  {
    id: 5,
    title: "DDL: Deleting & Renaming",
    bullets: [
      "DROP DATABASE: Permanently deletes the entire database and all tables. Highly dangerous.",
      "ALTER DATABASE / RENAME: Modifies the existing database name.",
      "Enterprise software usually restricts DROP commands to administrators."
    ],
    codeSnippet: "DROP DATABASE LegacyDB;\n\nALTER DATABASE CurrentDB \nRENAME TO NewDB;",
    analogy: "Dropping a database is like detonating the building; there is usually no undo button.",
    speakerNotes: "DROP is terrifying and powerful. In a real company, only highly privileged engineers can execute a DROP.",
    image: "/db_delete_1776188501759.png"
  },
  {
    id: 6,
    title: "DDL: Creating a Table",
    bullets: [
      "Once the DB is created, we CREATE TABLE to structure the columns.",
      "You must enforce Data Types (INT for numbers, VARCHAR/STRING for text).",
      "You must specify the Primary Key constraints."
    ],
    codeSnippet: "CREATE TABLE employees (\n  id INT PRIMARY KEY,\n  name VARCHAR(50),\n  salary INT\n);",
    analogy: "Creating a table is like designing a strict web-form. You decide exactly what fields are allowed.",
    speakerNotes: "This is where structure happens. Notice we assign 'INT' for numbers—the database will physically reject a word being put into a salary column.",
    image: "/table_creation_1776188518664.png"
  },
  {
    id: 7,
    title: "DML: Inserting Data",
    bullets: [
      "Data Manipulation Language (DML) writes actual facts into the tables.",
      "INSERT INTO pushes new rows one by one, or in massive batches.",
      "Order of values must match the order of columns."
    ],
    codeSnippet: "INSERT INTO employees (id, name, salary) \nVALUES (101, 'Alice', 95000),\n       (102, 'Bob', 82000);",
    analogy: "INSERT is submitting a filled-out form into the filing cabinet.",
    speakerNotes: "Now we have the cabinet, we are loading the files in. Modern apps run INSERT statements thousands of times a second.",
    image: "/data_insert_1776188227901.png"
  },
  {
    id: 8,
    title: "DML: Updating & Deleting Rows",
    bullets: [
      "UPDATE: Changes existing values (e.g. promoting an employee).",
      "DELETE: Removes a row completely.",
      "CRITICAL: Always use a 'WHERE' clause, otherwise you update/delete the entire table!"
    ],
    codeSnippet: "UPDATE employees \nSET salary = 100000 \nWHERE id = 101;\n\nDELETE FROM employees \nWHERE id = 102;",
    analogy: "UPDATE is crossing out the old address. DELETE is shredding that single piece of paper.",
    speakerNotes: "If you run UPDATE without a WHERE clause, everyone in the company gets that salary. Always double check your WHERE!",
    image: "/row_update_1776188571675.png"
  },
  {
    id: 9,
    title: "DQL: The SQL Grammar (Find Data)",
    bullets: [
      "Data Query Language (DQL): Looking at data safely without modifying it.",
      "SELECT: Which columns do I want?",
      "FROM: Which table holds them?",
      "WHERE: What conditions must be met?"
    ],
    codeSnippet: "SELECT name, salary \nFROM employees \nWHERE salary > 90000;",
    analogy: "Ordering a custom coffee: SELECT (espresso) FROM (Starbucks) WHERE (milk = oat).",
    speakerNotes: "This covers 80% of what a manager does. You aren't writing data; you are analyzing it.",
    image: "/sql_grammar_1776186945805.png"
  },
  {
    id: 10,
    title: "Ordering and Enforcing Limits",
    bullets: [
      "ORDER BY: Sorts results chronologically, alphabetically, or numerically.",
      "DESC (Descending) or ASC (Ascending).",
      "LIMIT: Chops off the results at a certain number (e.g. Top 5 deals)."
    ],
    codeSnippet: "SELECT name, salary \nFROM employees \nORDER BY salary DESC \nLIMIT 5;",
    analogy: "ORDER BY is organizing your hand of cards. LIMIT is only playing the top 3 cards.",
    speakerNotes: "When you have 50 million rows, do not query all of them. Use LIMIT 5 to see a sample, or combine with ORDER to get a 'Top 10' leaderboard.",
    image: "/order_limit_1776188587046.png"
  },
  {
    id: 11,
    title: "Aggregation: Basic Math",
    bullets: [
      "Databases instantly compute math across billions of rows.",
      "MAX() and MIN() find the edges.",
      "SUM() tallies the total, AVG() gets the mean, COUNT() gets the volume."
    ],
    codeSnippet: "SELECT \n  COUNT(*) as total_staff, \n  MAX(salary) as highest_paid, \n  SUM(salary) as total_payroll \nFROM employees;",
    analogy: "Instead of reading every receipt, you just ask the cashier for the total sum of the register.",
    speakerNotes: "You don't export to Excel to find the sum. You make the massive supercomputer do the addition before the data ever gets to you.",
    image: "/basic_aggregation_1776188604168.png"
  },
  {
    id: 12,
    title: "Aggregation: The GROUP BY Pivot",
    bullets: [
      "If you need totals categorized by a dimension (e.g. Revenue by Region).",
      "GROUP BY is the exact equivalent of an Excel Pivot Table.",
      "It collapses millions of rows into distinct categories instantly."
    ],
    codeSnippet: "SELECT region, SUM(salary) as total_payroll \nFROM employees \nGROUP BY region;",
    analogy: "Sorting a giant pile of Lego bricks by color, and then weighing each distinct colored pile.",
    speakerNotes: "Every time a colleague says 'We need a Pivot Table', I want your brain to scream 'GROUP BY'. It is exactly the same concept.",
    image: "/excel_vs_sql_1776186893865.png"
  },
  {
    id: 13,
    title: "The Magic of JOINs",
    bullets: [
      "Connecting disconnected tables using their Primary and Foreign keys.",
      "JOIN matches rows physically horizontally.",
      "It is millions of times faster than dragging an Excel VLOOKUP formula down."
    ],
    codeSnippet: "SELECT customers.name, orders.revenue \nFROM orders \nJOIN customers \n  ON orders.customer_id = customers.id;",
    analogy: "Matching a Passport ID (Table A) to a Boarding Pass (Table B) to find out who bought the first-class ticket.",
    speakerNotes: "If GROUP BY is the Pivot Table, JOIN is VLOOKUP on steroids. Real companies spread data across 100 tables; JOINS bring them together.",
    image: "/sql_joins_1776186962359.png"
  },
  {
    id: 14,
    title: "Live Command Center Sandbox",
    bullets: [
      "Let's put down the slides and enter the live terminal.",
      "We will CREATE new architecture, INSERT data streams, and query LIVE.",
      "Witness how syntax compilation errors are nothing to fear."
    ],
    analogy: "Stepping out of the flight simulator and taking the real controls of the corporate jet.",
    speakerNotes: "Let's switch inputs. I'm going to jump into the console. Let's do this live.",
    image: "/sql_robot_1776186876822.png"
  }
];

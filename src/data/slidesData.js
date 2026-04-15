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
    speakerNotes: `OPENING — set the energy high. Don't start with theory. Start with pain.

Ask the room: "How many of you have had Excel freeze on you in the middle of something important?" — pause for hands. Then say "Every single one of you just described a business risk."

KEY POINTS TO HIT:
• Excel's hard row limit is 1,048,576. That sounds like a lot until you realize a mid-sized e-commerce company processes that many orders in a single weekend. The tool literally cannot hold your business data.
• The hidden cost isn't just the frozen screen — it's the decisions made on incomplete data. When your analyst exports 100,000 rows because "Excel can't handle more," your strategy is built on a sample, not the truth.
• VLOOKUPs are a symptom. They exist because data is fragmented across 12 different spreadsheets owned by 12 different people. That is the real problem.
• The analogy lands well here: Excel is you personally walking through a warehouse with a clipboard, counting boxes by hand. A database is that same warehouse running with barcodes, conveyor belts, and automated tracking — processing 10,000 items per second while you watch.

TONE: Confident, slightly provocative. You're not insulting Excel — you're upgrading their mental model.

TIMING: ~2 minutes. Don't rush this — let the pain points land.

TRANSITION: "So if Excel is a clipboard, what does the filing system actually look like? That's a database."`,
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
    speakerNotes: `GOAL: Replace the fuzzy word "database" with a concrete mental model.

Most people in the room hear "database" and think of something vague and technical. Your job is to make it tangible.

KEY POINTS TO HIT:
• A database is not just "a big Excel file." It is a structured system with rules, relationships, and permissions baked in. The structure is what makes it fast and reliable.
• "One Source of Truth" is the most important phrase on this slide. In companies running on spreadsheets, you have Finance's version of revenue, Sales' version of revenue, and Operations' version — and they all disagree. A database eliminates that. There is one number. Everyone sees it.
• The speed is genuinely hard to believe until you see it. We're talking about filtering 50 million customer records in under half a second. No spreadsheet can touch that.
• Security and permissions: in a database, you can give the marketing team read-only access to customer names and emails, while blocking them from seeing salary data. You cannot do that with a shared Excel file on SharePoint.
• The "robotic librarians" analogy: imagine a library where the librarians never sleep, never make filing errors, know exactly where every book is, and can retrieve any 10,000 books simultaneously in under a second. That is what a database engine is.

AUDIENCE ENGAGEMENT: "Has anyone here ever been in a meeting where two departments had different numbers for the same metric? That's a spreadsheet problem. Databases solve it."

TIMING: ~2 minutes.

TRANSITION: "Now — how does a database actually organize information? It uses Tables, and Tables have a very specific structure."`,
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
    speakerNotes: `GOAL: Make the concept of relational data feel completely logical — not technical.

This is where you explain WHY data is split across multiple tables instead of one giant sheet. This concept is called "normalization" but you don't need to use that word.

KEY POINTS TO HIT:
• Why separate tables? Imagine if you stored the customer's full address on every single order they ever placed. If they move, you'd have to update 200 rows. With a separate Customers table, you update one row and every linked order automatically reflects the new address. That's the power of separation.
• Primary Key: every row needs a unique ID. Think of it like a Social Security Number — it's the one thing that makes each record unambiguously distinct. Even if two customers are named "John Smith", they have different IDs: 1001 and 1002.
• Foreign Key: this is where the "relationship" in "relational database" comes from. The Orders table doesn't store the customer's name. It stores their ID. When you want the name, you use the ID to look it up in the Customers table. This is how you connect data without duplicating it.
• The passport analogy is very strong: your passport has a unique ID (your passport number). When you board a flight, the manifest doesn't contain your full biography — it just references your passport number. One lookup, and they have everything about you.

DRAW ON WHITEBOARD (if available): A simple two-box diagram: Customers table (ID, Name, Email) pointing with an arrow to Orders table (OrderID, CustomerID, Amount). Show how CustomerID is the link.

TIMING: ~2-3 minutes. This is a foundational concept — don't rush it.

TRANSITION: "Now we know what a database looks like structurally. Let's talk about how to actually BUILD one. That's where SQL comes in — and we start with DDL."`,
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
    speakerNotes: `GOAL: Introduce the concept of SQL commands as plain-English instructions. Demystify the code.

KEY POINTS TO HIT:
• SQL stands for Structured Query Language. But don't get hung up on the name. The key word is "Language" — it's a language you use to talk to a database. And unlike Python or Java, it reads almost like English.
• DDL — Data Definition Language — is the category of commands that BUILD the structure. Think of it as the construction phase. You're not moving any furniture yet; you're building the building.
• The first command is CREATE DATABASE. Three words. That's it. You type that into a terminal, hit enter, and the database exists. The server allocates memory, sets up the file system, and it's ready to receive data.
• Point at the code: "Look at this. No symbols, no curly braces, no semicolons everywhere. It says CREATE DATABASE and then the name you want. It's almost insultingly simple."
• The filing cabinet analogy: before you can store a single document, you need the cabinet itself. CREATE DATABASE is buying the cabinet. Everything else — the drawers, the folders, the files — comes after.

MENTION: There are different "flavors" of databases — MySQL, PostgreSQL, Microsoft SQL Server, Oracle. The syntax for CREATE DATABASE is nearly identical across all of them. What you learn today transfers everywhere.

TIMING: ~1.5 minutes.

TRANSITION: "Of course, once you've built the building, you sometimes need to renovate it — or tear it down entirely. Let's talk about that."`,
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
    speakerNotes: `GOAL: Create respect (and healthy fear) for destructive SQL commands. Make this memorable.

This is one of the slides where a story lands extremely well.

KEY POINTS TO HIT:
• DROP DATABASE is one of the most powerful and dangerous commands in SQL. It doesn't move the database to a Trash folder. It doesn't ask "Are you sure?" twice. In most configurations, it executes immediately and the data is gone.
• Real incident (tell this if you have it, or use this story): In 2017, a cloud provider accidentally deleted their own production infrastructure with a single mistyped command. It took 18 hours of recovery and cost millions. This was not a junior developer — this was a senior engineer.
• In enterprise environments, DROP commands are almost always restricted to Database Administrators (DBAs). Normal users, analysts, and even most developers don't have DROP permissions. This is by design.
• ALTER DATABASE is the safe version of change. You're not destroying anything — you're renaming or modifying configuration. It's like changing the label on the filing cabinet.
• The detonation analogy is the one to emphasize: you don't detonate a building to rearrange the furniture. DROP is reserved for when you truly intend to permanently destroy. In 15 years of database work, most engineers will use DROP fewer than 10 times — and always with extreme caution.

PAUSE for effect after: "There is usually no undo button." Let that sit.

TIMING: ~2 minutes.

TRANSITION: "Okay — now that the database exists and we haven't dropped it, let's build the tables inside it."`,
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
    speakerNotes: `GOAL: Explain data types as ENFORCEMENT, not just description. This is a huge insight for non-technical audiences.

KEY POINTS TO HIT:
• CREATE TABLE is where you define the schema — the blueprint. You're deciding: what columns exist, what type of data each column holds, and what rules apply.
• Data Types are the critical concept here. When you declare salary as INT (integer), you're not just labeling it — you're telling the database to REJECT anything that isn't a whole number. Try to insert "seventy thousand dollars" into that column and the database throws an error. This is data validation at the infrastructure level.
• Compare this to Excel: in Excel, you can type "N/A" into a salary cell and Excel accepts it without complaint. Now your SUM formula breaks and nobody knows why. A database would have rejected that entry on arrival.
• VARCHAR(50) for name means text, up to 50 characters. The number in brackets is the maximum length — another form of constraint. If someone tries to enter a 200-character name, it gets rejected or truncated.
• The web form analogy is excellent here: when you fill out a sign-up form online, the form won't accept letters in a phone number field, and it won't let you submit without an email address. That's exactly what CREATE TABLE does — it's a permanent form definition for every row of data.
• PRIMARY KEY: notice that id is marked as PRIMARY KEY. This means the database will enforce uniqueness automatically. No two employees can have the same ID. You don't have to check it yourself — the database handles it.

POINT AT CODE: Walk through each line. "id INT PRIMARY KEY — this is the unique identifier, must be a whole number, must be unique. name VARCHAR(50) — text, maximum 50 characters. salary INT — whole number, no text allowed."

TIMING: ~2.5 minutes. This is a dense but critical slide.

TRANSITION: "The table exists and the schema is defined. Now we actually put data into it. That's DML — Data Manipulation Language."`,
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
    speakerNotes: `GOAL: Show how data enters the system, and connect it to real-world scale.

KEY POINTS TO HIT:
• DML is the "working" category of SQL. Where DDL builds the structure, DML populates it. INSERT, UPDATE, DELETE — these are the commands that manipulate the actual data inside the tables.
• INSERT INTO is how every piece of data enters the database. Every time a customer places an order on Amazon, an INSERT runs. Every time someone logs into an app, an INSERT fires to record the session. This command is executing billions of times per day across all systems worldwide.
• The batch syntax is powerful — notice you can insert multiple rows in a single command by separating the value sets with commas. This is vastly more efficient than inserting one row at a time. Real data migrations often insert millions of rows in a single batch operation.
• The order of values must match the order of columns exactly. If you declare columns as (id, name, salary), you must provide values in that exact sequence. (101, 'Alice', 95000) — number, text, number. Swap them and the database either throws an error or stores corrupted data.
• The filing cabinet analogy: you've designed the form (CREATE TABLE), and now Alice has filled it out and submitted it. INSERT is the act of taking that completed form and placing it in the correct drawer of the cabinet.
• At this point, we have a table with two employees. But in the real world, an HR database might receive thousands of INSERT operations every day — new hires, contractors, temporary staff.

TIMING: ~1.5 minutes.

TRANSITION: "Data goes in via INSERT. But the world changes — employees get promoted, some leave the company. How do we update or remove that data? That's UPDATE and DELETE."`,
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
    speakerNotes: `GOAL: Deliver the WHERE clause lesson in a way that they will NEVER forget. This is one of the most important safety lessons in SQL.

This slide has the most memorable "horror story" potential of the entire course. Use it.

KEY POINTS TO HIT:
• UPDATE is how you modify existing data. Alice got promoted — her salary changes from 95,000 to 100,000. You don't delete her row and re-insert it. You UPDATE the specific column.
• DELETE removes a row entirely. Bob left the company — his row goes away. The data is gone (unless you have backups or use soft-delete patterns, but that's advanced).
• THE CRITICAL WARNING — say this slowly and clearly: "If you run UPDATE employees SET salary = 100000 — with NO WHERE clause — every single employee in the table now makes 100,000. The CEO, the intern, the receptionist. All of them. Instantly." Pause. Let that sink in.
• Same for DELETE: "DELETE FROM employees with no WHERE clause — every row. Gone. The entire workforce, deleted. In one command."
• This is not a hypothetical. It happens. Junior developers who are nervous, moving fast, or working at 2am have accidentally run unfiltered UPDATE and DELETE commands on production databases. Companies have lost critical data this way.
• The WHERE clause is your precision instrument. WHERE id = 101 means "apply this operation ONLY to the row where id equals 101." Without it, the operation applies to every row.
• Best practice: before running any UPDATE or DELETE in production, first run the equivalent SELECT with the same WHERE clause. If the SELECT returns the right rows, you know your WHERE is correct. THEN run the UPDATE or DELETE.

DRAMATIC PAUSE after the warning. Then continue: "The WHERE clause is the most important two-word phrase in SQL. Write it before anything else."

TIMING: ~2.5 minutes. This slide deserves emphasis.

TRANSITION: "Now — we've been building and manipulating data. The whole reason we do any of this is to QUERY it — to ask questions and get answers. That's DQL."`,
    image: "/row_update_1776188571653.png"
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
    speakerNotes: `GOAL: Make SELECT/FROM/WHERE feel completely natural. This is the most-used syntax in SQL — build confidence here.

KEY POINTS TO HIT:
• DQL — Data Query Language — is the category your audience will use 90% of the time. Analysts, managers, data scientists — most of their SQL is SELECT statements. They're reading data, not modifying it. This is safe. SELECT cannot damage anything.
• The grammar is the key insight on this slide: SQL has a very consistent sentence structure. SELECT (what you want) FROM (where it lives) WHERE (the condition). Once you internalize this pattern, you can read almost any SQL query.
• Walk through the code example: "Give me the name and salary columns FROM the employees table WHERE the salary is greater than 90,000." Read it in English. It makes perfect sense.
• WHY SELECT specific columns and not SELECT *? Because in a real table, you might have 80 columns — employee ID, name, salary, department, hire date, address, emergency contact, performance review scores... You rarely need all of them. Selecting only what you need is more efficient and keeps your results clean.
• The coffee analogy is accessible to everyone: "SELECT espresso FROM Starbucks WHERE milk = oat." You're not asking for the entire menu. You're specifying exactly what you want. SQL works the same way.
• Compound WHERE clauses: you can add AND/OR to make conditions more precise. WHERE salary > 90000 AND department = 'Engineering'. This is the foundation of business reporting.

PAUSE and ask: "What question would YOU most want to ask your company's data right now? Think about it — because by the end of today, you'll know how to ask it."

TIMING: ~2 minutes.

TRANSITION: "SELECT, FROM, WHERE — that's the core. Now let's talk about organizing and limiting those results."`,
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
    speakerNotes: `GOAL: Show how ORDER BY and LIMIT unlock instant business rankings and top-N reports.

KEY POINTS TO HIT:
• ORDER BY is how you sort. ASC means smallest to largest (A to Z, earliest to latest). DESC means largest to smallest (Z to A, latest to earliest). The query on screen says "give me employees, sorted by salary from highest to lowest, and show only the top 5." That's your Top 5 Earners report — in one query.
• Business applications: Top 10 customers by revenue. Bottom 5 products by margin. Most recent 20 support tickets. The combination of ORDER BY + LIMIT gives you instant ranked lists from any dataset.
• Without LIMIT, a query on a 50-million-row table returns 50 million rows to your screen. That would crash your reporting tool and take minutes. LIMIT 5 says: "I only need a sample. Stop after 5." Always use LIMIT when exploring unfamiliar data.
• LIMIT is also how you paginate results in an application. "Show me page 1 of results" is LIMIT 10 OFFSET 0. "Show me page 2" is LIMIT 10 OFFSET 10. Every app you've ever used that shows "Page 1 of 47" is using this exact mechanism.
• The card hand analogy: after you deal a hand of cards (ORDER BY sorts them), you don't play all 13 — you pick the best 3. LIMIT is that selection process.

PRACTICAL MOMENT: "Think about your weekly reports. How many of them are just 'show me the top 10 of something'? Every single one of those is a SELECT with an ORDER BY and a LIMIT."

TIMING: ~1.5 minutes.

TRANSITION: "Ranking and limiting is powerful. But what if we don't want individual rows — what if we want aggregate numbers? Totals, averages, maximums? That's aggregation."`,
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
    speakerNotes: `GOAL: Show that aggregate functions are the database equivalent of Excel formulas — but running on 100 million rows instantly.

KEY POINTS TO HIT:
• Aggregate functions compute a single value from many rows. They collapse the entire table (or a subset) into summary statistics. This is statistical analysis at enterprise scale.
• COUNT(*) counts rows. COUNT(*) FROM orders gives you the total number of orders. Ever. Instantly. No matter if it's 100 rows or 100 billion rows.
• SUM(salary) adds up every salary in the table — total payroll. MAX(salary) finds the single highest-paid employee. MIN(salary) finds the lowest. AVG(salary) gives you the mean.
• The "AS" keyword is aliasing — giving your result a readable label. COUNT(*) as total_staff means the output column is labeled "total_staff" instead of "COUNT(*)". This makes your reports readable without postprocessing.
• Business relevance: "Your CFO wants total payroll cost. Your HR director wants average salary by department. Your board wants total revenue for Q3. All of these are single aggregate queries. Each one runs in milliseconds."
• Compare to Excel: in Excel, you'd export the data, clean it, build a formula, and worry about the formula range not capturing new rows. In SQL, you run one query and the answer is always current, always complete.
• The cash register analogy: imagine manually reading every single receipt ever printed in a store versus just asking the POS system "what's today's total?" The answer is the same; the effort is incomparable.

TIMING: ~2 minutes.

TRANSITION: "But what if we don't want ONE total — we want the total broken down BY something? Revenue by region. Headcount by department. That's GROUP BY, and it's one of the most powerful tools in SQL."`,
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
    speakerNotes: `GOAL: Make GROUP BY click by connecting it directly to Pivot Tables — something everyone in the room has used.

This is one of the highest-impact slides for a business audience. Nail it.

KEY POINTS TO HIT:
• Every time someone in your company says "I need a pivot table," the underlying operation is GROUP BY. They are mathematically identical. The difference is that GROUP BY runs on a database with 500 million rows in the time it takes Excel to open the file.
• What does GROUP BY do? It takes all your rows and groups them by a shared value. All rows where region = 'APAC' become one group. All rows where region = 'EMEA' become another group. Then it applies the aggregate function (SUM, COUNT, AVG) to each group separately.
• The query on screen: "Give me each distinct region, and the SUM of salaries for all employees in that region." The result is one row per region, with the total payroll for that region. That's a Pivot Table.
• You can GROUP BY multiple columns: GROUP BY region, department gives you payroll broken down by every combination of region AND department. That would be a nested pivot table in Excel.
• The Lego analogy: imagine 10 million colored Lego bricks dumped in a pile. GROUP BY sorts them into separate piles by color. SUM(salary) then weighs each pile. You get one number per color. That's the output.
• HAVING clause (bonus if you have time): you can filter AFTER grouping using HAVING. WHERE filters before aggregation; HAVING filters after. HAVING SUM(salary) > 500000 means "only show me regions where total payroll exceeds half a million."

ASK THE ROOM: "How many of you have built a pivot table in the last month?" (hands up) "You've essentially been writing GROUP BY queries by hand. Today you're learning to do it in code — which means you can automate it."

TIMING: ~2.5 minutes.

TRANSITION: "We've been working with one table. But real databases have dozens of tables. The data you need is almost always split across multiple tables. To combine them, you use JOINs."`,
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
    speakerNotes: `GOAL: Make JOINs feel logical and inevitable — not scary. Connect it to VLOOKUP, which they know.

JOINs are often seen as the "hard" part of SQL. Your job is to make them feel like the obvious solution to an obvious problem.

KEY POINTS TO HIT:
• Set up the problem first: "I have an Orders table. It has customer_id, revenue, order date. I have a Customers table. It has customer id, name, region, email. If I want a report that shows the customer NAME next to their ORDER REVENUE — I need to connect these two tables. That connection is a JOIN."
• How it works: the ON clause defines the matching condition. ON orders.customer_id = customers.id says "match every row in Orders to the row in Customers where these two values are equal." The result is a new, combined row with columns from both tables.
• The VLOOKUP comparison is critical for this audience: "Every VLOOKUP you've ever written is a manual JOIN. You wrote a formula that looked up a value from one sheet in another sheet. You then dragged that formula down 10,000 rows, waited for Excel to calculate it, and prayed it didn't break when you added new data. A JOIN does the same thing, for any number of rows, in milliseconds, and it never breaks."
• Types of JOINs (mention briefly): INNER JOIN returns only rows that have a match in BOTH tables. LEFT JOIN returns all rows from the left table, even if there's no match in the right table (useful for finding customers who never placed an order). RIGHT JOIN, FULL JOIN — these exist but INNER and LEFT cover 95% of use cases.
• Real-world scale: large enterprise databases have 50, 100, sometimes 500 tables. A single business intelligence query might JOIN 10 or 15 tables together. SQL handles this seamlessly. Excel would crash.
• The passport analogy: airline security has your passport details in one system and your boarding pass in another. The JOIN is the moment they match your passport ID to your boarding pass ID to confirm it's really you, and that you bought a first-class seat.

ENERGY: This is near the end of the content slides. Keep energy up. "You now know everything you need to know to query any database in the world."

TIMING: ~2.5 minutes.

TRANSITION: "We've covered everything in theory. Now let's stop talking about it and actually DO it. Let me switch to the live terminal."`,
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
    speakerNotes: `GOAL: Transition confidently to the live demo. Set expectations so the audience is excited, not anxious.

KEY POINTS TO HIT:
• Frame the transition: "Everything you've seen so far has been diagrams and code snippets. In the next section, we're going to run LIVE SQL against a real in-memory database. You're going to see actual results appear in real time."
• Normalize errors: "I will almost certainly make a typo at some point. That's intentional. I want you to see that SQL errors are not explosions — they're just messages that tell you exactly what went wrong. They're helpful. Don't fear them."
• What we're working with: "In the sandbox, we have three tables already loaded: Customers (4 companies), Products (4 SKUs), and Orders (5 transactions). We're going to query this data, manipulate it, and show you what real SQL workflows look like."
• Set the pace: "We'll start simple — SELECT * FROM each table so we know what we're working with. Then we'll build up to JOINs, aggregations, and finally demonstrate a GROUP BY that answers a real business question: which customer is our most valuable?"
• The flight simulator analogy: "Everything we've done on these slides is the simulator — controlled, safe, illustrative. What I'm about to show you is the real cockpit. The controls work the same way. The only difference is the data is live."
• DEMO FLOW SUGGESTIONS:
  1. Start: SELECT * FROM customers; — show them the data
  2. SELECT * FROM orders; — show the revenue data
  3. JOIN: SELECT c.name, o.revenue FROM orders o JOIN customers c ON o.customer_id = c.id;
  4. AGGREGATE: SELECT c.name, SUM(o.revenue) as Total FROM orders o JOIN customers c ON o.customer_id = c.id GROUP BY c.name ORDER BY Total DESC;
  5. DML: INSERT a new customer, then query to show they're there
  6. Error demo: run a query with a typo — show the error is helpful, not scary
  7. RESET: use [↺ RESET DB] if you've mutated anything

ENERGY: This is the climax of the session. Bring enthusiasm. "Let's go."

TIMING: This slide is just the intro — the actual demo runs 5-10 minutes.`,
    image: "/sql_robot_1776186876822.png"
  }
];

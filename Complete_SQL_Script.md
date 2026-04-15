# Complete SQL Course — Full Presenter Script

> **How to use this script:** This is your word-for-word guide. Text in *italics* is stage direction. Text in **[brackets]** is an audience interaction cue. Each slide has an estimated time. Total runtime: ~45–55 minutes including live demo.

---

## PRE-SESSION SETUP CHECKLIST

- [ ] Dev server running (`npm run dev`)
- [ ] Click **Present** → drag audience window to projector → confirm fullscreen
- [ ] Presenter view open on your laptop
- [ ] Database verified: run `SELECT * FROM customers` in demo to confirm tables exist
- [ ] Water nearby
- [ ] Phone on silent

---

## OPENING (Before Slide 1)

*Walk to the front. Wait for the room to settle. Make eye contact. Don't start until you have silence.*

"Before we get into anything — I want to ask you a question."

*Pause.*

"How many of you have had Excel completely freeze on you, right in the middle of something you needed urgently?"

*[Pause for hands — most will go up. Smile.]*

"That's not a software bug. That's a warning sign. Today, we're going to talk about what's on the other side of that warning."

*Advance to Slide 1.*

---

## SLIDE 1 — The Hook: Excel vs. SQL
**Estimated time: 2 minutes**

"Let me tell you what that freeze actually means."

"Excel has a hard limit. One million, forty-eight thousand, five hundred and seventy-six rows. That sounds enormous — until you realise that a mid-sized e-commerce company processes more orders than that in a single weekend."

*Pause.*

"So what happens? Your analyst exports 'as much as Excel can handle' — maybe a hundred thousand rows — and builds a report on that. Meanwhile, the other nine hundred thousand rows of data are invisible. Your strategy, your decisions, your projections — all built on an incomplete picture."

"That is not a small problem. That is a structural risk."

"And it gets worse. In most companies, 'the data' lives in a dozen different spreadsheets, owned by a dozen different people, on a dozen different laptops. Finance has their version of revenue. Sales has theirs. Operations has another. They never agree in a meeting because they literally have different numbers."

"The analogy I use: Excel is you, personally, walking through a warehouse with a clipboard, counting boxes by hand. A database is that same warehouse running with barcodes, conveyor belts, robotic sorters and automated inventory — processing ten thousand items per second while you have your morning coffee."

"That's the gap we're closing today."

---

## SLIDE 2 — What is a Database?
**Estimated time: 2 minutes**

"So — what actually IS a database? Because I've noticed that word gets used everywhere and means nothing concrete in most people's minds."

"A database is a centralised, structured vault. It's not a big spreadsheet. It has rules. It has relationships. It has permissions. And crucially — it enforces all of those things automatically, so humans can't accidentally break them."

"The phrase I want you to take away from this slide is: **One Source of Truth**."

"Think about your last leadership meeting. Was there a moment where someone said 'well, our numbers show X' and someone else said 'that's strange, ours show Y'? That happens when your data lives in spreadsheets. When it lives in a database, there is exactly one number. It doesn't matter which department accesses it — they all see the same figure because there is only one figure."

"Speed is the other thing. We're talking about filtering fifty million customer records in under half a second. Querying a billion rows of transaction history and getting an answer in two seconds. No spreadsheet — no matter how powerful the laptop — can do that."

*[Pause]* "Has anyone here been in a meeting where two departments had different revenue numbers for the same quarter?"

*[Wait for responses — usually strong reaction.]*

"Spreadsheet problem. Database solves it permanently."

---

## SLIDE 3 — Architecture: Tables & Keys
**Estimated time: 2.5 minutes**

"Now let's look inside the database. What's actually in there?"

"A database is a collection of Tables. Think of it like a set of purpose-built spreadsheet tabs — but with strict rules. You have a Customers table. An Orders table. A Products table. Each one holds a specific type of information."

"Here's the key insight: we separate data into different tables NOT to make things complicated, but to avoid duplication. Let me give you an example."

"If I store Alice's full address in every single order she ever places, and she moves house — I now have to update two hundred rows. But if her address lives in ONE row of the Customers table, and the Orders table just references her ID — I update one row and every order she ever placed automatically reflects her new address. That's the power of separation."

"Now — Primary Key. Every row in every table needs a unique identifier. Think of it exactly like a Social Security Number or a Passport Number. It's the one thing that makes each record unambiguously distinct. Even if two customers are both named John Smith, they have different IDs: 1001 and 1002. No confusion."

"Foreign Key is where the relationship comes in. The Orders table doesn't store the customer's full name and address. It stores their ID — their Primary Key from the Customers table. That stored ID is called a Foreign Key. It's a reference. A pointer."

"The passport analogy: your passport has a unique ID. When you board a flight, the manifest doesn't contain your biography — it references your passport number. One lookup, and they have everything they need. That's exactly how Foreign Keys work."

---

## SLIDE 4 — DDL: Creating a Database
**Estimated time: 1.5 minutes**

"Now we're going to start writing actual SQL. And I want you to notice something as we go: this language was designed to be readable by humans. You do not need to be a programmer to understand it."

"SQL has three main categories of commands. We're starting with DDL — Data Definition Language. These are the commands that BUILD the structure. You're not moving any data yet. You're constructing the environment."

"The very first thing you do when starting a new database project is — create the database."

*[Point at code on screen]*

"Three words. CREATE DATABASE and then whatever you want to name it. That's it. You type that, hit enter, and the database exists. The server allocates memory for it, sets up the file system, and it's ready."

"The analogy: before you can store a single document, you need the cabinet to store it in. CREATE DATABASE is buying the cabinet."

"One important note — there are different database systems: MySQL, PostgreSQL, Microsoft SQL Server, Oracle, SQLite. The syntax for 90% of what we're covering today is nearly identical across all of them. What you're learning is transferable everywhere."

---

## SLIDE 5 — DDL: Deleting & Renaming
**Estimated time: 2 minutes**

"Now let's talk about two commands on opposite ends of the danger spectrum."

"ALTER DATABASE lets you rename or reconfigure a database. It's safe, it's reversible, and it's the kind of thing you do when a project gets renamed. Low stakes."

"DROP DATABASE is something else entirely."

*[Pause for effect.]*

"DROP DATABASE does not move your data to a trash folder. It does not ask for confirmation twice. In most database systems, you type it and hit enter, and the database — along with every single table and every single row of data inside it — is gone. Permanently."

"This is not a hypothetical risk. In 2017, a major cloud provider — not a small company, a well-resourced engineering team — accidentally deleted a portion of their own production infrastructure with a single mistyped command. Recovery took eighteen hours. The incident made international news."

"In enterprise environments, DROP commands are almost always restricted to Database Administrators — the most senior, most trusted people on the technical team. Even most experienced engineers don't have DROP permissions on production systems."

*[Pause]* "Dropping a database is like detonating the building. You only do it when you are absolutely, one hundred percent certain the building needs to come down."

"The key lesson: learn DROP exists, understand what it does, and then hope you never actually need to use it in production."

---

## SLIDE 6 — DDL: Creating a Table
**Estimated time: 2.5 minutes**

"Okay — the database exists. Now we build the tables inside it. This is CREATE TABLE, and it's where something very important happens: data enforcement."

"When you CREATE TABLE, you define the schema — the blueprint. You decide: what columns exist, what type of data each column holds, and what rules apply."

*[Point at code]*

"Look at this. We have three columns. id is INT — an integer. name is VARCHAR, which means text, up to fifty characters. salary is INT."

"Now here's the critical thing I want you to understand: these aren't just labels. They're constraints. When you declare salary as INT, you're telling the database to **reject** anything that isn't a whole number. Try to insert the text 'seventy thousand dollars' into that column — the database throws an error. Entry rejected."

"Compare that to Excel. In Excel, you can type 'N/A' or 'TBD' into a salary cell and Excel accepts it without complaint. Your SUM formula then silently fails, and nobody notices until the CFO asks why payroll is short by three positions."

"A database doesn't let that happen. It catches the bad data at the door."

"The web form analogy lands really well here: when you fill out a sign-up form online, it won't accept letters in a phone number field, and it won't let you submit without an email. That form is enforcing a schema. CREATE TABLE does the same thing — permanently, for every row of data that ever enters that table."

"And PRIMARY KEY — notice id is marked PRIMARY KEY. This means the database will enforce uniqueness automatically. No two employees can share the same ID. You don't have to check it yourself. The database handles it."

---

## SLIDE 7 — DML: Inserting Data
**Estimated time: 1.5 minutes**

"The table exists. The schema is defined. Now we put actual data into it."

"We've moved from DDL — building the structure — to DML: Data Manipulation Language. These are the commands that interact with the actual data inside the tables. INSERT, UPDATE, DELETE."

"INSERT INTO is how data enters. Every. Single. Time."

"Every time a customer places an order on any e-commerce platform — INSERT. Every time someone creates an account anywhere — INSERT. Every time your phone sends a location ping to an app — INSERT. This command is executing billions of times per day, across every digital system on earth."

*[Point at code]*

"Notice the syntax. INSERT INTO employees — which table. Then the column names in brackets. Then VALUES — the actual data. The values must be in the same order as the columns you listed."

"And see how we're inserting two rows in one command? That's a batch insert. You can insert a thousand rows in a single statement. Real data migrations insert millions of rows in one operation."

"The filing cabinet analogy: you've designed the form — that was CREATE TABLE. Alice has filled it out. INSERT is sliding that completed form into the correct drawer."

---

## SLIDE 8 — DML: Updating & Deleting Rows
**Estimated time: 2.5 minutes**

"Data changes. Employees get promoted. Customers move. Orders get cancelled. We need to modify existing rows. That's UPDATE and DELETE."

"UPDATE is straightforward: you specify the table, the column to change, the new value, and — THIS IS THE CRITICAL PART — which rows to apply it to."

*[Point at code]* "WHERE id = 101. That WHERE clause is doing everything. It's the precision instrument that says: apply this change ONLY to this specific row."

*[Pause. Change tone to serious.]*

"I need you to really hear what I'm about to say."

"If you run UPDATE employees SET salary = 100000 — with no WHERE clause — every single employee in this table now earns one hundred thousand. The CEO. The intern. The security guard. All of them. In one command. Instantly."

*[Pause. Let it land.]*

"Same for DELETE. DELETE FROM employees with no WHERE clause — every row. Gone. Your entire workforce, deleted. One command."

"This is not theoretical. It happens to experienced developers under pressure, working late, distracted. Companies have lost critical data this way. It's one of the most common and most expensive SQL accidents."

*[Pause]*

"Here is the rule I want you to memorise: **Before you run any UPDATE or DELETE, run the equivalent SELECT with the same WHERE clause first.** If the SELECT returns the right rows, you know your WHERE is correct. THEN — and only then — run the UPDATE or DELETE."

"The WHERE clause is your most important safety tool in SQL."

---

## SLIDE 9 — DQL: The SQL Grammar
**Estimated time: 2 minutes**

"Everything we've done so far — CREATE, INSERT, UPDATE, DELETE — those all modify the database. Now we get to the category most of you will use ninety percent of the time."

"DQL. Data Query Language. Reading data. Asking questions. Getting answers."

"And the most beautiful thing about SELECT? It cannot damage anything. SELECT is read-only. You can run it as many times as you want, on any data, and the database is completely unchanged. This is your safe playground."

"The grammar is simple and it's consistent. Say it with me:"

*[Say slowly]* "**SELECT** — what columns do I want. **FROM** — which table do they live in. **WHERE** — what conditions must be met."

*[Point at code]* "Read this in plain English: give me the name and salary, from the employees table, where salary is greater than ninety thousand. That is a SQL query. That is also a sentence."

"That simplicity is intentional. SQL was designed in the 1970s to be readable by business users, not just engineers. Fifty years later, it's still the most widely used data language in the world because of that."

"You can add AND and OR to your WHERE clause for compound conditions. WHERE salary > 90000 AND department = 'Engineering'. You can chain as many conditions as you need."

*[Engage the room]* "What question would you most want to ask your company's data right now? Take ten seconds and think about it."

*[Pause for actual thinking time]*

"By the end of this session, you'll know exactly how to write that query."

---

## SLIDE 10 — Ordering and Enforcing Limits
**Estimated time: 1.5 minutes**

"SELECT, FROM, WHERE gives you the data. Now let's talk about organising it."

"ORDER BY is sorting. You can sort any column, in either direction. ASC — ascending — means smallest to largest, A to Z, earliest to latest. DESC — descending — means the opposite."

*[Point at code]* "This query says: give me names and salaries, ordered by salary from highest to lowest, and stop after the first five results. That is your Top Five Earners report. One query."

"LIMIT is one of the most important habits to build as a SQL writer. When you're exploring an unfamiliar table, always start with LIMIT 10. You don't know how many rows are in that table. It could be a hundred million. Without LIMIT, your query tries to return ALL of them — which will overwhelm your screen, your tool, and potentially the server."

"LIMIT 10 says: I just want a sample. Show me ten rows and stop. Fast, safe, efficient."

"Business applications: Top ten customers by revenue — ORDER BY revenue DESC LIMIT 10. Five most recent support tickets — ORDER BY created_at DESC LIMIT 5. Bottom three products by margin — ORDER BY margin ASC LIMIT 3. Each one is three words added to a basic SELECT statement."

---

## SLIDE 11 — Aggregation: Basic Math
**Estimated time: 2 minutes**

"So far every query has returned individual rows. Now we're going to ask the database to do maths — and return a single computed answer."

"Aggregate functions take many rows and compute one result. They're the database equivalent of Excel's SUM, AVERAGE, MAX, MIN, and COUNT formulas — except they run on a billion rows instead of ten thousand cells, and they run in milliseconds."

*[Point at code]*

"COUNT(*) — count every row in the table. How many employees do we have? One query, instant answer."

"SUM(salary) — add up every salary. Total payroll cost for the entire company. One query."

"MAX(salary) — find the single highest salary. One query."

"The 'AS' keyword is aliasing — it gives your result column a readable name. COUNT(*) AS total_staff means the output says 'total_staff' instead of 'COUNT(*)'. Much nicer in a report."

"Think about your most common reporting requests: total revenue for the quarter, average order value, number of new customers this month, highest single transaction amount. Every single one of those is a one-line aggregate query."

"The cash register analogy: imagine manually reading every receipt ever printed versus asking the POS system 'what's the total?' Same answer. Incomparable effort."

---

## SLIDE 12 — Aggregation: GROUP BY
**Estimated time: 2.5 minutes**

"Aggregate functions give us ONE number for the whole table. But what if we want that number broken down by a category? Revenue per region. Headcount per department. Average salary per job title."

"That's GROUP BY. And I want to say something directly:"

*[Pause for emphasis]*

"**Every Pivot Table you have ever built in Excel is a GROUP BY query.**"

"They are mathematically identical operations. The difference is execution. Excel's Pivot Table chokes above a few hundred thousand rows and requires manual refresh. GROUP BY runs on five hundred million rows in under two seconds and always returns current data."

*[Point at code]* "Read this query: give me the region, and the SUM of salaries for that region, grouped by region. The database takes every row, puts each one in a 'pile' based on its region value — APAC pile, EMEA pile, NA pile — and then computes the SUM for each pile. You get one row per region, with the total payroll for that region."

"You can group by multiple columns. GROUP BY region, department gives you total payroll for every combination of region and department. In Excel, that's a nested pivot table that takes ten minutes to build and breaks every time you refresh. In SQL, it's two words."

*[Ask the room]* "How many of you have built a pivot table in the last month?"

*[Wait for hands]*

"You've been writing GROUP BY queries by hand. From today, you know how to write them directly."

---

## SLIDE 13 — The Magic of JOINs
**Estimated time: 2.5 minutes**

"We've been working with one table at a time. But real databases have dozens of tables — sometimes hundreds. And the data you need for any given question is almost always spread across multiple tables."

"JOINs are how you combine them."

"Let me set up the problem. I have an Orders table: it has order ID, customer ID, revenue, and date. I have a Customers table: it has customer ID, name, region, email. If I want a report that shows the customer NAME next to their ORDER REVENUE — I need to connect these two tables. The bridge between them is the customer ID — the Foreign Key we talked about earlier."

*[Point at code]* "ON orders.customer_id = customers.id. That's the join condition. 'Match every row in Orders to the row in Customers where these two IDs are equal.' The result is a new combined row with data from both tables."

"Now — the VLOOKUP comparison. I have to say this because everyone in this room has written a VLOOKUP at some point."

"A VLOOKUP is a manual JOIN. You wrote a formula that looked up a value from one sheet in another sheet. You dragged that formula down ten thousand rows. You waited for Excel to calculate it. You worried every time you added new rows that the formula range was still correct. You had to re-do it whenever the source data changed."

"A JOIN does exactly the same thing, for any number of rows, in milliseconds, and it's part of the query — so it's always current, always correct, and never breaks."

*[Build to the close]* "Real enterprise databases have fifty, a hundred, sometimes five hundred tables. A single business intelligence dashboard might involve joins across fifteen different tables. SQL handles all of it. This is the language of enterprise data."

---

## SLIDE 14 — Live Command Center Sandbox
**Estimated time: 1 minute (then switch to Live Demo mode)**

"We've covered the full spectrum: how databases are structured, how to build them, how to populate them, how to query them, how to aggregate and join them."

"Now we stop talking about it."

*[Pause. Smile.]*

"In the next section, we're running live SQL against a real in-memory database. You're going to see actual results appear in real time. I'm going to make at least one typo — intentionally — so you can see that SQL errors are not explosions. They're helpful messages that tell you exactly what went wrong."

"Think of the last thirteen slides as the flight simulator. This is the real cockpit. The controls work exactly the same way."

*[Click the Live Demo toggle in presenter view]*

"Let's go."

---

## LIVE DEMO SCRIPT
**Estimated time: 8–12 minutes**

*[Switch to Live Demo in presenter view. The audience window transitions to the live terminal.]*

---

### ACT 1 — Explore the Data (2 min)

"First thing I always do when working with a database: understand what's in it."

*[Type and execute:]*
```sql
SELECT * FROM customers;
```

"Four companies. TechFlow Corp, BrightSun, Apex Consulting, Vertex Media. Each has an ID, a name, a region, and a signup date."

*[Execute:]*
```sql
SELECT * FROM orders;
```

"Five orders. Notice — the orders table doesn't store the customer NAME. It stores the customer ID. That's the Foreign Key relationship we talked about. Order 1001 was placed by customer 101. Who is customer 101? We saw that just now — TechFlow Corp."

*[Execute:]*
```sql
SELECT * FROM products;
```

"Four products: Base License, Pro License, Cloud Storage, and Priority Support. Each has a margin — the profit percentage."

---

### ACT 2 — The JOIN (2 min)

"Now let's combine the tables. The most common business question: which customer placed which order?"

*[Type and execute:]*
```sql
SELECT customers.name, orders.revenue
FROM orders
JOIN customers
  ON orders.customer_id = customers.id;
```

"There it is. Customer names from the Customers table, revenue figures from the Orders table — joined on the customer ID. That VLOOKUP you used to do manually, running instantly across every row."

---

### ACT 3 — Aggregation + JOIN (2 min)

"Now let's answer the real business question: who is our most valuable customer?"

*[Type and execute:]*
```sql
SELECT 
  c.name as Client,
  SUM(o.revenue) as Total_Revenue
FROM orders o
JOIN customers c 
  ON o.customer_id = c.id
GROUP BY c.name
ORDER BY Total_Revenue DESC;
```

"Look at that. TechFlow Corp is our top client — they account for seventeen thousand in revenue across two orders. We got there with one query: a JOIN, a GROUP BY, and an ORDER BY."

"In Excel, this would have been: export the data, add a VLOOKUP column, build a pivot table, sort it, format it. Fifteen minutes minimum. Here: ten seconds to type, instant results."

---

### ACT 4 — DML Live (2 min)

"Now let's modify data. Apex Consulting just signed an expanded contract."

*[Type and execute:]*
```sql
UPDATE orders 
SET revenue = 20000 
WHERE id = 1004;

SELECT * FROM orders;
```

"Order 1004 — Apex's order — is now twenty thousand. One command. Now let's verify they're still our number two client by re-running the revenue report."

*[Re-run the GROUP BY query from Act 3]*

"Perfect. Apex moved up."

---

### ACT 5 — Intentional Error (1 min)

"Now I'm going to deliberately make a mistake."

*[Type with a typo:]*
```sql
SELCT name FROM customers;
```

"I've misspelled SELECT. Watch what happens."

*[Execute]*

"The database gives me a syntax error. It tells me exactly what went wrong and roughly where. It's not a crash. It's not data loss. It's a helpful message. Fix the typo, run again — works perfectly."

"This is something I want you to internalize: SQL errors are your friend. They're the database being helpful. Every developer — junior or senior — writes syntax errors. The skill isn't avoiding them. It's reading the error message and fixing them quickly."

---

### ACT 6 — CLOSING QUERY (1 min)

*[Run a final clean query to end on a high note:]*
```sql
SELECT 
  c.name as Client,
  c.region as Region,
  COUNT(o.id) as Orders,
  SUM(o.revenue) as Total_Revenue,
  AVG(o.revenue) as Avg_Order_Value
FROM orders o
JOIN customers c 
  ON o.customer_id = c.id
GROUP BY c.name, c.region
ORDER BY Total_Revenue DESC;
```

"Name, region, number of orders, total revenue, average order value — per customer, sorted by value. This is a complete client performance dashboard. Built in SQL, running in under a second."

"Six months ago, building this in Excel would have taken your analyst half a day. Now you know how to write it yourself in five minutes."

---

## CLOSING (After Demo)
**Estimated time: 2 minutes**

*[Stop the Live Demo. Optional: return to slide view or stay on terminal.]*

"Let's recap what we covered today."

"You now understand how databases work: tables, primary keys, foreign keys, and why data is structured the way it is."

"You know the three categories of SQL commands: DDL to build the structure, DML to manipulate data, DQL to query it."

"You've seen SELECT, FROM, WHERE, ORDER BY, LIMIT, COUNT, SUM, AVG, MAX, GROUP BY, and JOIN — the core vocabulary of SQL."

"And you've seen it work live, on real data, answering real business questions."

*[Pause.]*

"SQL is fifty years old. It runs inside every major company on earth. Every data pipeline, every dashboard, every reporting system — at some level, SQL is running underneath it."

"The gap between someone who understands SQL and someone who doesn't is the gap between asking the data a question and waiting three days for someone else to answer it for you."

*[Final pause. Look at the room.]*

"You closed that gap today."

"Thank you."

---

## Q&A CHEAT SHEET

**"What's the difference between SQL and Python for data?"**
SQL is for extracting and transforming data that lives in a database. Python is better for statistical analysis, machine learning, and complex data manipulation once you have the data out. Most data workflows use both: SQL to get the data, Python to analyse it.

**"Which database should I learn first?"**
PostgreSQL is the best starting point — it's free, open-source, and follows the SQL standard closely. MySQL is equally valid. If your company uses a specific system (SQL Server, Oracle, BigQuery), start with that one since you'll use it daily.

**"What about NoSQL databases?"**
NoSQL (MongoDB, Cassandra, DynamoDB) stores data differently — as documents or key-value pairs instead of tables. It's optimised for specific use cases like real-time applications and unstructured data. For business analytics and reporting, SQL databases are still the dominant tool.

**"How long does it take to become proficient?"**
SELECT, FROM, WHERE, GROUP BY, and JOIN cover 90% of analytical SQL. With focused practice — an hour a day for a month — most people reach practical proficiency. Advanced topics like window functions, CTEs, and query optimisation take longer, but you don't need those to start getting value.

**"Can I run SQL on my company's database without IT permissions?"**
You need read access granted by your IT or data engineering team. Request a read-only role — this prevents you from accidentally modifying data. Most companies have a process for this; it's a completely standard request.

**"Is the data in today's demo real?"**
No — it's a mock dataset running in memory in the browser. Nothing persists after you close the session. It's safe to experiment freely.

---

*End of script.*

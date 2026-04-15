const PptxGenJS = require("pptxgenjs");
const path = require("path");

const slides = [
  {
    id: 1,
    title: "The Hook: Excel vs. SQL",
    bullets: [
      "The Limit: Excel taps out at 1,048,576 rows. Modern data breaks it instantly.",
      "The Risk: Frozen screens, crashed memory, and siloed decision-making.",
      "The Reality: If your insights rely on manual VLOOKUPs, your company is losing money."
    ],
    analogy: "Excel is a custom spreadsheet on a clipboard. A database is a mechanized Amazon fulfillment center.",
    speakerNotes: "Welcome to Complete SQL. We're starting here because everyone has crashed Excel before. Over a million rows, Excel is a liability. We're here because business decisions today require crunching 50 million rows before your morning coffee."
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
    speakerNotes: "A database is where the raw data lives. It's the central nervous system of any enterprise."
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
    speakerNotes: "To ensure data isn't duplicated, we separate it into tables. Primary keys and foreign keys are the glue that holds these tables together."
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
    speakerNotes: "Before we do anything, we build the house. CREATE DATABASE tells the server to section off memory for our project."
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
    speakerNotes: "DROP is terrifying and powerful. In a real company, only highly privileged engineers can execute a DROP."
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
    speakerNotes: "This is where structure happens. Notice we assign 'INT' for numbers—the database will physically reject a word being put into a salary column."
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
    speakerNotes: "Now we have the cabinet, we are loading the files in. Modern apps run INSERT statements thousands of times a second."
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
    speakerNotes: "If you run UPDATE without a WHERE clause, everyone in the company gets that salary. Always double check your WHERE!"
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
    speakerNotes: "This covers 80% of what a manager does. You aren't writing data; you are analyzing it."
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
    speakerNotes: "When you have 50 million rows, do not query all of them. Use LIMIT 5 to see a sample, or combine with ORDER to get a 'Top 10' leaderboard."
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
    speakerNotes: "You don't export to Excel to find the sum. You make the massive supercomputer do the addition before the data ever gets to you."
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
    speakerNotes: "Every time a colleague says 'We need a Pivot Table', I want your brain to scream 'GROUP BY'. It is exactly the same concept."
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
    speakerNotes: "If GROUP BY is the Pivot Table, JOIN is VLOOKUP on steroids. Real companies spread data across 100 tables; JOINS bring them together."
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
    speakerNotes: "Let's switch inputs. I'm going to jump into the console. Let's do this live."
  }
];

(async () => {
  try {
    console.log("Generating PPTX...");
    const pres = new PptxGenJS();
    pres.author = 'Complete SQL Course';
    pres.layout = 'LAYOUT_16x9';

    slides.forEach((s, idx) => {
      const slide = pres.addSlide();
      slide.background = { color: "0B0F19" };

      // Slide number badge (top-right)
      slide.addText(`${s.id} / ${slides.length}`, {
        x: 8.8, y: 0.15, w: 1.0, h: 0.3,
        fontSize: 10, color: "64748b", align: 'right', fontFace: "Inter"
      });

      // Title
      slide.addText(s.title, {
        x: 0.4, y: 0.3, w: 5.6, h: 0.8,
        fontSize: 28, color: "3B82F6", bold: true, fontFace: "Inter"
      });

      // Bullets
      if (s.bullets && s.bullets.length > 0) {
        const bulletData = s.bullets.map(b => ({
          text: `  ${b}`,
          options: { bullet: { indent: 10 }, color: "F3F4F6", fontSize: 14, fontFace: "Inter", breakLine: true, paraSpaceAfter: 8 }
        }));
        slide.addText(bulletData, {
          x: 0.4, y: 1.3, w: 5.5, h: 2.5,
          valign: "top"
        });
      }

      // Code snippet
      if (s.codeSnippet) {
        slide.addText(s.codeSnippet, {
          x: 0.4, y: 3.95, w: 5.5, h: 1.4,
          fontSize: 11, color: "10B981", fontFace: "Courier New",
          fill: { color: "000000" }, margin: 10, valign: "top"
        });
      }

      // Analogy box
      const analogyY = s.codeSnippet ? 5.5 : 4.0;
      slide.addShape(pres.ShapeType.rect, {
        x: 0.4, y: analogyY, w: 5.5, h: 0.9,
        fill: { color: "0F1E3D", transparency: 20 },
        line: { color: "3B82F6", width: 3, dashType: "solid" }
      });
      slide.addText(`BUSINESS ANALOGY`, {
        x: 0.5, y: analogyY + 0.05, w: 5.3, h: 0.2,
        fontSize: 8, color: "3B82F6", bold: true, fontFace: "Inter",
        charSpacing: 3
      });
      slide.addText(`"${s.analogy}"`, {
        x: 0.5, y: analogyY + 0.28, w: 5.3, h: 0.55,
        fontSize: 11, color: "94A3B8", italic: true, fontFace: "Inter", wrap: true
      });

      // Speaker notes
      if (s.speakerNotes) {
        slide.addNotes(s.speakerNotes);
      }

      // Progress bar at bottom
      const progressW = (s.id / slides.length) * 10;
      slide.addShape(pres.ShapeType.rect, {
        x: 0, y: 7.42, w: 10, h: 0.08,
        fill: { color: "1E293B" }, line: { color: "1E293B" }
      });
      slide.addShape(pres.ShapeType.rect, {
        x: 0, y: 7.42, w: progressW, h: 0.08,
        fill: { color: "3B82F6" }, line: { color: "3B82F6" }
      });
    });

    const outputPath = path.join(__dirname, "Complete_SQL_Presentation.pptx");
    await pres.writeFile({ fileName: outputPath });
    console.log(`PPTX saved to: ${outputPath}`);
    process.exit(0);
  } catch (e) {
    console.error("PPTX generation failed:", e);
    process.exit(1);
  }
})();

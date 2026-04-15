import React, { useState, useEffect } from 'react';
import { Play, Database, AlertCircle, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { executeQuery, initDatabase } from '../utils/databaseSetup';
import { motion } from 'framer-motion';

import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';

const customStyles = `
/* Prism Premium Syntax Highlighting */
.token.keyword { color: #c678dd; font-weight: bold; text-transform: uppercase; text-shadow: 0 0 8px rgba(198, 120, 221, 0.4); }
.token.string { color: #98c379; }
.token.number { color: #d19a66; }
.token.function { color: #61afef; font-weight: 600; }
.token.boolean { color: #d19a66; }
.token.operator, .token.punctuation { color: #8ab4f8; }

.console-editor-container {
  font-family: 'JetBrains Mono', 'Fira Code', 'Menlo', monospace;
  font-size: 1.25rem;
  line-height: 1.6;
  caret-color: var(--accent);
}

.console-editor-container textarea {
  outline: none !important;
}

.shortcut-btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #94a3b8;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.shortcut-btn:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.5);
  color: #fff;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
}
`;

const SQLDemo = () => {
  const [query, setQuery] = useState("SELECT \n  c.name as Client,\n  SUM(o.revenue) as Total_Revenue\nFROM orders o\nJOIN customers c \n  ON o.customer_id = c.id\nGROUP BY c.name\nORDER BY Total_Revenue DESC;");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ time: 0, rows: 0 });

  useEffect(() => {
    initDatabase();
    handleRunQuery();
  }, []);

  const handleRunQuery = (overrideQuery = query) => {
    const t0 = performance.now();
    const { data, error: err } = executeQuery(overrideQuery);
    const t1 = performance.now();
    const executionTime = (t1 - t0).toFixed(2);

    if (err) {
      setError(err);
      setResults([]);
      setStats({ time: executionTime, rows: 0 });
    } else {
      setError(null);
      let finalData = data;

      // Handle multi-statement execution arrays returned by AlaSQL
      if (Array.isArray(data)) {
        const isMultiStatement = data.some(item => Array.isArray(item) || typeof item === 'number');
        if (isMultiStatement) {
          const lastSelect = [...data].reverse().find(item => Array.isArray(item));
          if (lastSelect) {
            finalData = lastSelect; // Show the last SELECT result
          } else {
            finalData = data[data.length - 1]; // fallback to last numeric result
          }
        }
      }

      if (typeof finalData === 'number') {
         setResults([{ "Result": "Success", "Rows Affected": finalData }]);
         setStats({ time: executionTime, rows: finalData });
      } else if (Array.isArray(finalData)) {
         setResults(finalData);
         setStats({ time: executionTime, rows: finalData.length });
      } else {
         setResults([]);
         setStats({ time: executionTime, rows: 0 });
      }
    }
  };

  const loadExample = (sqlCode) => {
    setQuery(sqlCode);
    setTimeout(() => {
       handleRunQuery(sqlCode);
    }, 50);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleRunQuery();
    }
  };

  return (
    <div className="sql-demo-layout" style={{ display: 'flex', height: '100%', padding: '24px', gap: '24px' }}>
      <style>{customStyles}</style>

      {/* Editor Pane (Left Side) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-pane" 
        style={{ flex: 1.2, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)' }}
      >
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.4)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
                   <Database size={18} color="#3b82f6" />
                </div>
                <div>
                   <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Terminal</h2>
                   <span style={{ fontSize: '0.8rem', color: '#64748b', letterSpacing: '0.05em' }}>DATABASE REPL SERVER : ONLINE</span>
                </div>
              </div>
              <button className="btn primary" onClick={() => handleRunQuery()} style={{ padding: '10px 20px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none', boxShadow: '0 4px 15px rgba(59,130,246,0.4)' }}>
                <Play size={18} fill="currentColor" /> Execute Script (Cmd+Enter)
              </button>
           </div>
           
           <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
             <button className="shortcut-btn" onClick={() => loadExample("CREATE TABLE staff (\n  id INT PRIMARY KEY,\n  name STRING\n);\nINSERT INTO staff VALUES \n  (1, 'CEO'),\n  (2, 'VP');\n\nSELECT * FROM staff;")}>[+] CREATE & INSERT</button>
             <button className="shortcut-btn" onClick={() => loadExample("UPDATE orders \nSET revenue = 99999 \nWHERE id = 1001;\n\nSELECT * FROM orders;")}>[~] UPDATE</button>
             <button className="shortcut-btn" onClick={() => loadExample("DELETE FROM customers \nWHERE id = 104;\n\nSELECT * FROM customers;")}>[-] DELETE</button>
             <button className="shortcut-btn" onClick={() => loadExample("SELECT \n  category,\n  MAX(margin) as max_margin,\n  AVG(margin) as avg_margin,\n  SUM(margin) as total_margin\nFROM products \nGROUP BY category;")}>[ƒ] AGGREGATE</button>
           </div>
        </div>
        
        <div style={{ flex: 1, position: 'relative', overflowY: 'auto', background: '#09090b', padding: '10px 0' }}>
           <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '50px', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '24px', opacity: 0.5 }}>
              {Array.from({ length: query.split('\n').length }, (_, i) => (
                <div key={i} style={{ fontSize: '0.9rem', marginBottom: '8.5px', color: '#64748b', fontFamily: 'monospace' }}>{i + 1}</div>
              ))}
           </div>
           <div style={{ marginLeft: '50px' }}>
              <Editor
                value={query}
                onValueChange={code => setQuery(code)}
                highlight={code => Prism.highlight(code, Prism.languages.sql, 'sql')}
                padding={24}
                className="console-editor-container"
                onKeyDown={handleKeyDown}
                placeholder="-- Input corporate database query here..."
              />
           </div>
        </div>
      </motion.div>

      {/* Results Pane (Right Side) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-pane" 
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ChevronRight size={16} color="var(--accent)" />
            <span style={{ fontWeight: 600, color: '#f8fafc', letterSpacing: '0.05em' }}>OUTPUT RUNNER</span>
          </div>
          
          {!error && (
             <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--success)' }}>
               <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> Affected Rows: {stats.rows}</span>
               <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> Exec: {stats.time}ms</span>
             </div>
          )}
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '0', background: 'rgba(0,0,0,0.2)' }}>
          {error ? (
            <div style={{ padding: '32px', color: '#ff4d4f', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
              <AlertCircle size={48} strokeWidth={1.5} />
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ marginBottom: '8px', fontWeight: 700, fontSize: '1.5rem', textShadow: '0 0 10px rgba(255,77,79,0.5)' }}>Compilation Syntax Error</h3>
                <p style={{ fontFamily: 'monospace', lineHeight: 1.5, background: 'rgba(255,77,79,0.1)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #ff4d4f' }}>{error}</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <table style={{ background: 'transparent' }}>
              <thead style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                <tr>
                  {Object.keys(results[0]).map(key => (
                    <th key={key} style={{ padding: '16px 20px', color: '#8ab4f8' }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} style={{ padding: '12px 20px', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                        {val !== null && typeof val === 'object' ? JSON.stringify(val) : (val !== null ? val.toString() : <span style={{color: '#64748b'}}>NULL</span>)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
             <div style={{ padding: '40px', color: '#64748b', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <Database size={48} opacity={0.2} />
              <div style={{ fontSize: '1.2rem' }}>Engine ready. Awaiting instructions.</div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SQLDemo;

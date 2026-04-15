import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Square, Layers, Terminal, Play, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { slides } from '../data/slidesData';
import SlideContent from './SlideContent';
import { executeQuery, initDatabase } from '../utils/databaseSetup';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';

const CHANNEL = 'sql-presentation';

// Shared shortcut presets for the live demo
const DEMO_SHORTCUTS = [
  { label: '[+] CREATE & INSERT', sql: "CREATE TABLE staff (\n  id INT PRIMARY KEY,\n  name STRING\n);\nINSERT INTO staff VALUES \n  (1, 'CEO'),\n  (2, 'VP');\n\nSELECT * FROM staff;" },
  { label: '[~] UPDATE', sql: "UPDATE orders \nSET revenue = 99999 \nWHERE id = 1001;\n\nSELECT * FROM orders;" },
  { label: '[-] DELETE', sql: "DELETE FROM customers \nWHERE id = 104;\n\nSELECT * FROM customers;" },
  { label: '[ƒ] AGGREGATE', sql: "SELECT \n  category,\n  MAX(margin) as max_margin,\n  AVG(margin) as avg_margin,\n  SUM(margin) as total_margin\nFROM products \nGROUP BY category;" },
  { label: '[⋈] JOIN', sql: "SELECT \n  c.name as Client,\n  SUM(o.revenue) as Total_Revenue\nFROM orders o\nJOIN customers c \n  ON o.customer_id = c.id\nGROUP BY c.name\nORDER BY Total_Revenue DESC;" },
  { label: '[↺] RESET DB', sql: null }, // special: re-init
];

const PresenterView = ({ onStop }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [view, setView] = useState('slides'); // 'slides' | 'demo'

  // Demo state
  const [demoQuery, setDemoQuery] = useState("SELECT \n  c.name as Client,\n  SUM(o.revenue) as Total_Revenue\nFROM orders o\nJOIN customers c \n  ON o.customer_id = c.id\nGROUP BY c.name\nORDER BY Total_Revenue DESC;");
  const [demoResults, setDemoResults] = useState([]);
  const [demoError, setDemoError] = useState(null);
  const [demoStats, setDemoStats] = useState({ time: '0', rows: 0 });
  const [demoInitialized, setDemoInitialized] = useState(false);

  const channelRef = useRef(null);

  // BroadcastChannel setup
  useEffect(() => {
    channelRef.current = new BroadcastChannel(CHANNEL);
    const timer = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => {
      channelRef.current?.close();
      clearInterval(timer);
    };
  }, []);

  // Keep onmessage handler fresh (needs current slideIndex + view to respond to REQUEST_STATE)
  useEffect(() => {
    if (!channelRef.current) return;
    channelRef.current.onmessage = (e) => {
      if (e.data.type === 'REQUEST_STATE') {
        channelRef.current.postMessage({
          type: 'STATE_RESPONSE',
          slideIndex,
          view,
          demoState: view === 'demo'
            ? { query: demoQuery, results: demoResults, error: demoError, time: demoStats.time }
            : null,
        });
      }
    };
  }, [slideIndex, view, demoQuery, demoResults, demoError, demoStats]);

  const goTo = useCallback((index) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    setSlideIndex(clamped);
    channelRef.current?.postMessage({ type: 'SLIDE_CHANGE', index: clamped });
  }, []);

  const switchView = (newView) => {
    if (newView === 'demo' && !demoInitialized) {
      initDatabase();
      setDemoInitialized(true);
    }
    setView(newView);
    channelRef.current?.postMessage({ type: 'VIEW_CHANGE', view: newView });
  };

  // Stop presentation: broadcast end, close audience window via onStop
  const handleStop = () => {
    channelRef.current?.postMessage({ type: 'PRESENTATION_END' });
    channelRef.current?.close();
    onStop();
  };

  // Keyboard nav (only in slides view)
  useEffect(() => {
    const handleKey = (e) => {
      if (view !== 'slides') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(slideIndex + 1);
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(slideIndex - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [slideIndex, view, goTo]);

  // ── Demo execution ──
  const runDemo = useCallback((overrideQuery) => {
    const q = overrideQuery ?? demoQuery;
    const t0 = performance.now();
    const { data, error } = executeQuery(q);
    const time = (performance.now() - t0).toFixed(2);

    if (error) {
      setDemoError(error);
      setDemoResults([]);
      setDemoStats({ time, rows: 0 });
      channelRef.current?.postMessage({ type: 'DEMO_SYNC', query: q, results: null, error, time });
      return;
    }

    let finalData = data;
    if (Array.isArray(data)) {
      const isMulti = data.some(item => Array.isArray(item) || typeof item === 'number');
      if (isMulti) {
        const lastSelect = [...data].reverse().find(item => Array.isArray(item));
        finalData = lastSelect ?? data[data.length - 1];
      }
    }

    let rows = [];
    if (typeof finalData === 'number') {
      rows = [{ Result: 'Success', 'Rows Affected': finalData }];
    } else if (Array.isArray(finalData)) {
      rows = finalData;
    }

    setDemoError(null);
    setDemoResults(rows);
    setDemoStats({ time, rows: rows.length });
    channelRef.current?.postMessage({ type: 'DEMO_SYNC', query: q, results: rows, error: null, time });
  }, [demoQuery]);

  const loadShortcut = (item) => {
    if (item.sql === null) {
      // Reset DB
      initDatabase();
      const msg = "-- Database reset. All tables restored to default.";
      setDemoQuery(msg);
      setDemoResults([]);
      setDemoError(null);
      setDemoStats({ time: '0', rows: 0 });
      channelRef.current?.postMessage({ type: 'DEMO_SYNC', query: msg, results: [], error: null, time: '0' });
      return;
    }
    setDemoQuery(item.sql);
    setTimeout(() => runDemo(item.sql), 30);
  };

  const handleDemoKey = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runDemo();
  };

  // ── Computed values ──
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');
  const currentSlide = slides[slideIndex];
  const nextSlide = slides[slideIndex + 1];

  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: '#07090f', color: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* ── TOP BAR ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 20px', borderBottom: '1px solid rgba(99,102,241,0.15)',
        background: 'rgba(0,0,0,0.5)', flexShrink: 0, gap: '12px'
      }}>
        {/* Left: label + slide counter + timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Presenter View</div>
          {view === 'slides' && (
            <div className="slide-counter-badge">
              {String(slideIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>
          )}
          <div style={{ fontSize: '1.6rem', fontVariantNumeric: 'tabular-nums', fontWeight: 800, color: '#f59e0b', textShadow: '0 0 16px rgba(245,158,11,0.5)', letterSpacing: '0.06em' }}>
            {minutes}:{seconds}
          </div>
        </div>

        {/* Center: view toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '3px', border: '1px solid rgba(99,102,241,0.2)' }}>
          <button
            onClick={() => switchView('slides')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit', transition: 'all 0.2s',
              background: view === 'slides' ? '#6366f1' : 'transparent',
              color: view === 'slides' ? 'white' : '#94a3b8',
              boxShadow: view === 'slides' ? '0 2px 12px rgba(99,102,241,0.5)' : 'none',
            }}
          >
            <Layers size={15} /> Slides
          </button>
          <button
            onClick={() => switchView('demo')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit', transition: 'all 0.2s',
              background: view === 'demo' ? '#10b981' : 'transparent',
              color: view === 'demo' ? 'white' : '#94a3b8',
              boxShadow: view === 'demo' ? '0 2px 12px rgba(16,185,129,0.4)' : 'none',
            }}
          >
            <Terminal size={15} /> Live Demo
          </button>
        </div>

        {/* Right: Stop */}
        <button
          onClick={handleStop}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '7px 18px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.4)',
            background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer',
            fontWeight: 700, fontSize: '0.85rem', fontFamily: 'inherit', transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
        >
          <Square size={14} fill="currentColor" /> Stop Presentation
        </button>
      </div>

      {/* ── MAIN BODY ── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '60% 40%', overflow: 'hidden' }}>

        {/* ─── LEFT COLUMN ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', gap: '12px', borderRight: '1px solid rgba(99,102,241,0.12)', overflow: 'hidden' }}>

          {view === 'slides' ? (
            <>
              {/* Current slide preview */}
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', minHeight: 0 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slideIndex}
                    initial={{ opacity: 0, y: 16, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: '100%' }}
                  >
                    <SlideContent s={currentSlide} isPrint={false} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slide nav */}
              <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                <button className="btn" onClick={() => goTo(slideIndex - 1)} disabled={slideIndex === 0} style={{ flex: 1, justifyContent: 'center' }}>
                  <ChevronLeft size={18} /> Previous
                </button>
                <button className="btn present" onClick={() => goTo(slideIndex + 1)} disabled={slideIndex === slides.length - 1} style={{ flex: 1, justifyContent: 'center' }}>
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </>
          ) : (
            /* ── DEMO VIEW: SQL EDITOR ── */
            <>
              {/* Shortcut strip */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', flexShrink: 0 }}>
                {DEMO_SHORTCUTS.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => loadShortcut(item)}
                    style={{
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#94a3b8', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem',
                      fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.04em', fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)'; e.currentTarget.style.color = '#a5b4fc'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Editor */}
              <div style={{ flex: 1, background: '#09090b', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '0.08em', fontWeight: 600, textTransform: 'uppercase' }}>SQL Terminal</span>
                  <button
                    onClick={() => runDemo()}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px',
                      background: 'linear-gradient(135deg, #6366f1, #3b82f6)', border: 'none', color: 'white',
                      cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'inherit',
                      boxShadow: '0 2px 12px rgba(99,102,241,0.4)',
                    }}
                  >
                    <Play size={13} fill="white" /> Execute (⌘↩)
                  </button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
                  <Editor
                    value={demoQuery}
                    onValueChange={setDemoQuery}
                    highlight={code => Prism.highlight(code, Prism.languages.sql, 'sql')}
                    padding={16}
                    onKeyDown={handleDemoKey}
                    style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '1rem', lineHeight: 1.6, caretColor: '#6366f1', minHeight: '100%' }}
                  />
                </div>
              </div>

              {/* Results status bar */}
              <div style={{ flexShrink: 0, height: '32px', display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '4px' }}>
                {demoError ? (
                  <span style={{ color: '#f87171', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={13} /> {demoError.slice(0, 80)}{demoError.length > 80 ? '…' : ''}
                  </span>
                ) : demoResults.length > 0 && (
                  <span style={{ color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={13} /> {demoStats.rows} rows</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> {demoStats.time}ms</span>
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', gap: '14px', overflowY: 'auto' }}>

          {view === 'slides' ? (
            <>
              {/* Next slide preview */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Up Next</div>
                {nextSlide ? (
                  <div style={{ height: '200px', overflow: 'hidden', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(15,20,40,0.8)', position: 'relative' }}>
                    <div style={{ transform: 'scale(0.40)', transformOrigin: 'top left', width: '250%', pointerEvents: 'none', opacity: 0.75 }}>
                      <SlideContent s={nextSlide} isPrint={false} />
                    </div>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(7,9,15,0.7) 100%)' }} />
                  </div>
                ) : (
                  <div style={{ height: '200px', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                    END OF DECK
                  </div>
                )}
              </div>

              {/* Speaker notes */}
              <div style={{ background: 'rgba(15,20,40,0.85)', border: '1px solid rgba(99,102,241,0.18)', borderLeft: '4px solid #6366f1', borderRadius: '10px', padding: '16px', flex: 1, overflowY: 'auto' }}>
                <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>Speaker Notes</div>
                <p style={{ color: '#e2e8f0', lineHeight: 1.75, fontSize: '0.9rem' }}>{currentSlide.speakerNotes}</p>
              </div>
            </>
          ) : (
            /* Demo mode right column: query broadcast preview + results preview */
            <>
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontSize: '0.65rem', color: '#10b981', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Broadcasting to Audience</div>
                <div style={{ background: '#000', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.25)', padding: '14px', maxHeight: '160px', overflowY: 'auto' }}>
                  <pre style={{ color: '#10b981', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', whiteSpace: 'pre-wrap', margin: 0 }}>
                    {demoQuery || '-- no query yet'}
                  </pre>
                </div>
              </div>

              {/* Results preview */}
              <div style={{ flex: 1, background: 'rgba(15,20,40,0.85)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase', flexShrink: 0 }}>
                  Results Preview
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {demoError ? (
                    <div style={{ padding: '16px', color: '#f87171', fontSize: '0.8rem', fontFamily: 'monospace' }}>{demoError}</div>
                  ) : demoResults.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(99,102,241,0.1)' }}>
                          {Object.keys(demoResults[0]).map(k => (
                            <th key={k} style={{ padding: '8px 12px', color: '#8ab4f8', fontWeight: 600, textAlign: 'left', fontSize: '0.7rem', letterSpacing: '0.05em' }}>{k}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {demoResults.slice(0, 8).map((row, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            {Object.values(row).map((val, j) => (
                              <td key={j} style={{ padding: '6px 12px', fontFamily: 'monospace', color: '#e2e8f0' }}>
                                {val !== null && val !== undefined ? String(val) : <span style={{ color: '#475569' }}>NULL</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: '20px', color: '#334155', textAlign: 'center', fontSize: '0.85rem' }}>Run a query to see results</div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── Dot navigation (always visible) ── */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Jump To Slide</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {slides.map((s, i) => (
                <button
                  key={i}
                  title={`${i + 1}. ${s.title}`}
                  onClick={() => { goTo(i); if (view === 'demo') switchView('slides'); }}
                  style={{
                    width: '26px', height: '26px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                    background: i === slideIndex && view === 'slides' ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)',
                    color: i === slideIndex && view === 'slides' ? '#a5b4fc' : '#475569',
                    fontSize: '0.68rem', fontWeight: 700, transition: 'all 0.15s',
                    boxShadow: i === slideIndex && view === 'slides' ? '0 0 8px rgba(99,102,241,0.6)' : 'none',
                    outline: i === slideIndex && view === 'slides' ? '1px solid rgba(99,102,241,0.5)' : 'none',
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Prism styles */}
      <style>{`
        .token.keyword { color: #c678dd; font-weight: bold; }
        .token.string  { color: #98c379; }
        .token.number  { color: #d19a66; }
        .token.function { color: #61afef; font-weight: 600; }
        .token.operator, .token.punctuation { color: #8ab4f8; }
      `}</style>
    </div>
  );
};

export default PresenterView;

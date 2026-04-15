import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slides } from '../data/slidesData';
import SlideContent from './SlideContent';

const CHANNEL = 'sql-presentation';

const AudienceView = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [view, setView] = useState('slides');          // 'slides' | 'demo'
  const [demoState, setDemoState] = useState(null);    // { query, results, error, time }
  const [ended, setEnded] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(true);

  useEffect(() => {
    // Auto fullscreen
    document.documentElement.requestFullscreen?.()
      .then(() => setShowFullscreenPrompt(false))
      .catch(() => {});

    const channel = new BroadcastChannel(CHANNEL);

    channel.onmessage = (e) => {
      const { type } = e.data;

      if (type === 'SLIDE_CHANGE') {
        setSlideIndex(e.data.index);
        setShowFullscreenPrompt(false);
      } else if (type === 'VIEW_CHANGE') {
        setView(e.data.view);
      } else if (type === 'DEMO_SYNC') {
        setDemoState({ query: e.data.query, results: e.data.results, error: e.data.error, time: e.data.time });
      } else if (type === 'PRESENTATION_END') {
        setEnded(true);
      } else if (type === 'STATE_RESPONSE') {
        setSlideIndex(e.data.slideIndex);
        setView(e.data.view);
        if (e.data.demoState) setDemoState(e.data.demoState);
        setShowFullscreenPrompt(false);
      }
    };

    // Ask presenter for current state (handles late-open audience window)
    channel.postMessage({ type: 'REQUEST_STATE' });

    return () => channel.close();
  }, []);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.()
      .then(() => setShowFullscreenPrompt(false))
      .catch(() => {});
  };

  const progressPercent = ((slideIndex + 1) / slides.length) * 100;

  // ── ENDED SCREEN ──
  if (ended) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: 'var(--bg-gradient)', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', position: 'relative' }}>
        <div className="aurora-layer" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
        >
          <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🎓</div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, background: 'linear-gradient(135deg, #818cf8, #6366f1, #60a5fa)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', marginBottom: '12px' }}>
            Thank You
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#94a3b8', letterSpacing: '0.05em' }}>Presentation complete</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: 'var(--bg-gradient)', backgroundColor: 'var(--bg-color)', position: 'relative' }}>
      <div className="aurora-layer" />

      <AnimatePresence mode="wait">

        {/* ── SLIDES VIEW ── */}
        {view === 'slides' && (
          <motion.div
            key={`slides-${slideIndex}`}
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, scale: 1.02, filter: 'blur(4px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}
          >
            <div style={{ width: '96%', maxWidth: '1440px' }}>
              <SlideContent s={slides[slideIndex]} isPrint={false} />
            </div>
          </motion.div>
        )}

        {/* ── LIVE DEMO VIEW ── */}
        {view === 'demo' && (
          <motion.div
            key="demo"
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '48px 64px', gap: '32px', zIndex: 1 }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 12px #10b981', animation: 'pulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#10b981' }}>
                Live SQL Terminal
              </span>
            </div>

            {!demoState ? (
              /* Waiting state */
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#334155' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#334155', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <span style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.05em' }}>Waiting for presenter…</span>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', gap: '40px', overflow: 'hidden', minHeight: 0 }}>

                {/* Left: SQL query display */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase' }}>Query</div>
                  <div style={{ background: '#000', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.3)', padding: '28px 32px', flex: 1, overflow: 'auto', boxShadow: '0 0 40px rgba(16,185,129,0.08)' }}>
                    <pre style={{ color: '#10b981', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '1.5rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {demoState.query}
                    </pre>
                  </div>
                </div>

                {/* Right: Results */}
                <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase' }}>Results</div>
                    {!demoState.error && demoState.results && (
                      <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                        <span>{demoState.results.length} rows</span>
                        <span>{demoState.time}ms</span>
                      </div>
                    )}
                  </div>

                  {demoState.error ? (
                    <div style={{ flex: 1, background: 'rgba(239,68,68,0.08)', borderRadius: '16px', border: '1px solid rgba(239,68,68,0.3)', padding: '28px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '2rem' }}>⚠️</span>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f87171', marginBottom: '8px' }}>Syntax Error</div>
                        <pre style={{ color: '#fca5a5', fontFamily: 'monospace', fontSize: '1rem', whiteSpace: 'pre-wrap' }}>{demoState.error}</pre>
                      </div>
                    </div>
                  ) : demoState.results && demoState.results.length > 0 ? (
                    <div style={{ flex: 1, overflow: 'auto', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(15,20,40,0.8)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: 'rgba(99,102,241,0.12)', position: 'sticky', top: 0 }}>
                            {Object.keys(demoState.results[0]).map(k => (
                              <th key={k} style={{ padding: '16px 20px', color: '#8ab4f8', fontWeight: 700, textAlign: 'left', fontSize: '0.9rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{k}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {demoState.results.map((row, i) => (
                            <motion.tr
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04, duration: 0.2 }}
                              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                            >
                              {Object.values(row).map((val, j) => (
                                <td key={j} style={{ padding: '14px 20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', color: '#e2e8f0' }}>
                                  {val !== null && val !== undefined ? String(val) : <span style={{ color: '#334155' }}>NULL</span>}
                                </td>
                              ))}
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ flex: 1, borderRadius: '16px', border: '1px solid rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                      Query executed — no rows returned
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar — always visible at bottom */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '6px', background: 'rgba(0,0,0,0.3)', zIndex: 10 }}>
        <motion.div
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.35 }}
          className="progress-bar-fill"
          style={{ height: '100%' }}
        />
      </div>

      {/* Fullscreen fallback */}
      {showFullscreenPrompt && (
        <div
          onClick={enterFullscreen}
          style={{ position: 'fixed', inset: 0, background: 'rgba(6,8,16,0.92)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '3.5rem' }}>⛶</div>
          <p style={{ fontSize: '1.5rem', color: '#f8fafc', fontWeight: 700 }}>Click to enter fullscreen</p>
          <p style={{ color: '#94a3b8' }}>Move this window to the projector display</p>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
};

export default AudienceView;

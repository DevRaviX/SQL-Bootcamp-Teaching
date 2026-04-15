const SlideContent = ({ s, isPrint }) => (
  <div
    className={isPrint ? 'pdf-slide-node' : 'glass-pane slide-content-row'}
    style={{
      width: isPrint ? '1920px' : '95%',
      height: isPrint ? '1080px' : 'auto',
      maxWidth: isPrint ? 'none' : '1300px',
      padding: isPrint ? '80px' : '40px',
      display: 'flex',
      flexDirection: 'row',
      gap: '60px',
      maxHeight: isPrint ? 'none' : '85vh',
      overflowY: isPrint ? 'hidden' : 'auto',
      background: isPrint ? '#0B0F19' : 'transparent',
      border: isPrint ? 'none' : '',
      position: isPrint ? 'relative' : 'static',
      marginBottom: isPrint ? '20px' : '0',
      boxSizing: 'border-box'
    }}
  >
    {/* Left column: title, bullets, code, analogy */}
    <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
      <h1 style={{
        fontSize: isPrint ? '3.5rem' : '2.2rem',
        fontWeight: 900,
        marginBottom: isPrint ? '40px' : '24px',
        wordWrap: 'break-word',
        lineHeight: 1.3,
        background: isPrint
          ? undefined
          : 'linear-gradient(135deg, #818cf8 0%, #6366f1 40%, #60a5fa 100%)',
        backgroundClip: isPrint ? undefined : 'text',
        WebkitBackgroundClip: isPrint ? undefined : 'text',
        color: isPrint ? '#6366f1' : 'transparent',
        filter: isPrint ? undefined : 'drop-shadow(0 0 24px rgba(99,102,241,0.45))',
      }}>
        {s.title}
      </h1>

      <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: isPrint ? '30px' : '20px', minHeight: '150px' }}>
        {s.bullets.map((b, i) => (
          <li key={i} style={{ fontSize: isPrint ? '1.8rem' : '1.2rem', lineHeight: '1.5', display: 'flex', gap: '16px', alignItems: 'flex-start', color: '#f3f4f6' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              flexShrink: 0,
              marginTop: '9px',
              background: isPrint ? '#6366f1' : 'linear-gradient(135deg, #6366f1, #06b6d4)',
              boxShadow: isPrint ? 'none' : '0 0 8px rgba(99,102,241,0.7)',
              display: 'inline-block'
            }} />
            <span style={{ flex: 1 }}>{b}</span>
          </li>
        ))}
      </ul>

      {s.codeSnippet && (
        <div style={{ marginTop: '30px', background: '#000', padding: '24px', borderRadius: '12px', borderLeft: '6px solid #10b981' }}>
          <pre style={{ color: '#10b981', fontSize: isPrint ? '1.5rem' : '1.1rem', margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            <code>{s.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Analogy box — gold accent */}
      <div style={{
        marginTop: 'auto',
        padding: '30px',
        background: isPrint ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.07)',
        borderLeft: '6px solid #f59e0b',
        borderRadius: '0 12px 12px 0',
        boxShadow: isPrint ? 'none' : 'inset 0 0 30px rgba(245,158,11,0.04)'
      }}>
        <strong style={{
          display: 'block',
          marginBottom: '12px',
          color: '#f59e0b',
          textTransform: 'uppercase',
          fontSize: isPrint ? '1.2rem' : '0.8rem',
          letterSpacing: '0.08em'
        }}>
          Business Analogy
        </strong>
        <span style={{ fontSize: isPrint ? '1.5rem' : '1.1rem', fontStyle: 'italic', lineHeight: 1.5, color: '#cbd5e1' }}>
          "{s.analogy}"
        </span>
      </div>
    </div>

    {/* Right column: image */}
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {s.image && (
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: isPrint
            ? 'none'
            : '0 0 0 1px rgba(99,102,241,0.25), 0 30px 60px rgba(0,0,0,0.6), 0 0 60px rgba(99,102,241,0.12)',
          position: 'relative'
        }}>
          <img
            src={s.image}
            alt="Visual aid"
            style={{ width: '100%', height: 'auto', maxHeight: isPrint ? '800px' : '500px', objectFit: 'contain', background: 'var(--bg-color)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(11,15,25,0) 0%, rgba(11,15,25,0.4) 100%)', pointerEvents: 'none' }} />
        </div>
      )}
    </div>
  </div>
);

export default SlideContent;

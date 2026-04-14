import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageSquareCode } from 'lucide-react';
import { slides } from '../data/slidesData';

const SlideDeck = ({ onNotesToggle, currentSlideObj, slideIndex, setSlideIndex }) => {

  const nextSlide = useCallback(() => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(prev => prev + 1);
    }
  }, [slideIndex, setSlideIndex]);

  const prevSlide = useCallback(() => {
    if (slideIndex > 0) {
      setSlideIndex(prev => prev - 1);
    }
  }, [slideIndex, setSlideIndex]);

  useEffect(() => {
     currentSlideObj(slides[slideIndex]);
  }, [slideIndex, currentSlideObj]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slide = slides[slideIndex];
  const progressPercent = ((slideIndex + 1) / slides.length) * 100;

  // Single Slide Renderer (Re-used for both UI and Print Views)
  const SlideContent = ({ s, isPrint }) => (
    <div style={{
       width: isPrint ? '100%' : '95%', 
       maxWidth: isPrint ? 'none' : '1300px', 
       padding: '40px', 
       display: 'flex', 
       flexDirection: 'row', 
       gap: '40px', 
       maxHeight: isPrint ? 'none' : '85vh',
       overflowY: isPrint ? 'visible' : 'auto',
       marginTop: isPrint ? '0' : '20px',
       pageBreakAfter: 'always', // Force page breaks in PDF print
       background: isPrint ? '#0B0F19' : 'transparent', // dark bg for PDF mapping
       border: isPrint ? 'none' : ''
    }}
    className={isPrint ? 'print-page' : 'glass-pane'}>
      {/* Left text column */}
      <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#3b82f6', marginBottom: '24px', wordWrap: 'break-word', lineHeight: 1.3 }}>
          {s.title}
        </h1>
        
        <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '150px' }}>
           {s.bullets.map((b, i) => (
              <li key={i} style={{ fontSize: '1.2rem', lineHeight: '1.5', display: 'flex', gap: '12px', color: '#f3f4f6' }}>
                <span style={{ color: '#3b82f6' }}>•</span> 
                <span style={{ flex: 1 }}>{b}</span>
              </li>
           ))}
        </ul>

        {s.codeSnippet && (
          <div style={{ marginTop: '20px', background: '#000', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
            <pre style={{ color: '#10b981', fontSize: '1.1rem', margin: 0, fontFamily: 'monospace', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
              <code>{s.codeSnippet}</code>
            </pre>
          </div>
        )}

        <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid #3b82f6', borderRadius: '0 8px 8px 0' }}>
           <strong style={{ display: 'block', marginBottom: '8px', color: '#3b82f6', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Business Analogy</strong>
           <span style={{ fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.5, color: '#94a3b8' }}>"{s.analogy}"</span>
        </div>
      </div>
      
      {/* Right Image column */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {s.image && (
          <div style={{ 
              width: '100%',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: isPrint ? 'none' : '0 20px 40px rgba(0,0,0,0.4)',
              position: 'relative'
            }}>
            <img src={s.image} alt="Visual aid" style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain', background: 'var(--bg-color)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(11,15,25,0) 0%, rgba(11,15,25,0.4) 100%)', pointerEvents: 'none' }} />
          </div>
        )}

        {!s.image && (
          <div style={{ width: '100%', height: '100%', minHeight: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }} />
        )}
      </div>
    </div>
  );


  return (
    <div className="slide-deck-container" style={{ position: 'relative', padding: '20px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      
      {/* Global CSS overriding browser print to hide UI controls & force colors */}
      <style>{`
        @media print {
          body { background-color: #0B0F19 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .interactive-deck { display: none !important; }
          .header, .btn, .notes-panel, .shortcut-btn { display: none !important; }
          .slide-deck-container { padding: 0 !important; overflow: visible !important; height: auto !important; }
          .print-layout { display: block !important; }
          @page { size: landscape; margin: 0; }
        }
        @media screen {
          .print-layout { display: none !important; }
        }
      `}</style>

      {/* PRINT LAYOUT (Hidden on screen, maps all 14 slides to PDF format natively) */}
      <div className="print-layout">
         {slides.map(s => <SlideContent key={s.id} s={s} isPrint={true} /> )}
      </div>

      {/* INTERACTIVE UI LAYOUT (Hidden on print) */}
      <div className="interactive-deck" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.05)' }}>
           <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
              style={{ height: '100%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }}
           />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
             key={slide.id}
             initial={{ opacity: 0, x: 20, scale: 0.98 }}
             animate={{ opacity: 1, x: 0, scale: 1 }}
             exit={{ opacity: 0, x: -20, scale: 0.98 }}
             transition={{ duration: 0.5, ease: "easeOut" }}
             style={{ display: 'flex', width: '100%', justifyContent: 'center' }}
          >
             <SlideContent s={slide} isPrint={false} />
          </motion.div>
        </AnimatePresence>

        <div style={{ display: 'flex', gap: '24px', marginTop: '24px', alignItems: 'center' }}>
          <button className="btn" onClick={prevSlide} disabled={slideIndex === 0}>
            <ChevronLeft size={20} /> Previous
          </button>
          <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 600 }}>
             {slideIndex + 1} / {slides.length}
          </div>
          <button className="btn primary" onClick={nextSlide} disabled={slideIndex === slides.length - 1}>
            Next <ChevronRight size={20} />
          </button>
          
          <button className="btn" style={{ marginLeft: '40px' }} onClick={onNotesToggle}>
             <MessageSquareCode size={20} /> Speaker Notes (Left/Right Arrows)
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideDeck;

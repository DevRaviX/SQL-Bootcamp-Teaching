import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageSquareCode } from 'lucide-react';
import { slides } from '../data/slidesData';
import SlideContent from './SlideContent';

const SlideDeck = ({ onNotesToggle, currentSlideObj, slideIndex, setSlideIndex, isExportingPDF }) => {

  const nextSlide = useCallback(() => {
    if (slideIndex < slides.length - 1) setSlideIndex(prev => prev + 1);
  }, [slideIndex, setSlideIndex]);

  const prevSlide = useCallback(() => {
    if (slideIndex > 0) setSlideIndex(prev => prev - 1);
  }, [slideIndex, setSlideIndex]);

  useEffect(() => {
    currentSlideObj(slides[slideIndex]);
  }, [slideIndex, currentSlideObj]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isExportingPDF) return;
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isExportingPDF]);

  const slide = slides[slideIndex];
  const progressPercent = ((slideIndex + 1) / slides.length) * 100;

  return (
    <div
      className="slide-deck-container"
      style={{ position: 'relative', padding: '20px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      {/* Ambient aurora layer */}
      <div className="aurora-layer" />

      {/* Hidden PDF export container — only mounted during export */}
      {isExportingPDF && (
        <div id="pdf-export-container" style={{ width: '1920px', position: 'absolute', top: 0, left: '-9999px', background: '#0B0F19' }}>
          {slides.map(s => <SlideContent key={s.id} s={s} isPrint={true} />)}
        </div>
      )}

      {/* INTERACTIVE UI */}
      <div className="interactive-deck" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

        {/* Progress bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'rgba(255,255,255,0.04)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
            className="progress-bar-fill"
            style={{ height: '100%' }}
          />
        </div>

        {/* Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, scale: 1.02, filter: 'blur(4px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', width: '100%', justifyContent: 'center' }}
          >
            <SlideContent s={slide} isPrint={false} />
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '24px', marginTop: '24px', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          <button className="btn" onClick={prevSlide} disabled={slideIndex === 0}>
            <ChevronLeft size={20} /> Previous
          </button>

          <div className="slide-counter-badge">
            {String(slideIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </div>

          <button className="btn primary" onClick={nextSlide} disabled={slideIndex === slides.length - 1}>
            Next <ChevronRight size={20} />
          </button>

          <button className="btn" style={{ marginLeft: '40px' }} onClick={onNotesToggle}>
            <MessageSquareCode size={20} /> Speaker Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideDeck;

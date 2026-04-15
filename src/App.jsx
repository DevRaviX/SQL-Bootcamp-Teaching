import { useState, useRef, useEffect } from 'react';
import { Presentation, Terminal, LayoutDashboard, FileText, Download, Printer, Loader2, Monitor } from 'lucide-react';
import SlideDeck from './components/SlideDeck';
import SQLDemo from './components/SQLDemo';
import PresenterView from './components/PresenterView';
import { motion, AnimatePresence } from 'framer-motion';
import { slides } from './data/slidesData';
import pptxgen from "pptxgenjs";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function App() {
  const [view, setView] = useState('slides');
  const [showNotes, setShowNotes] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  // Presenter mode — no navigation, just a state swap
  const [isPresenting, setIsPresenting] = useState(false);
  const audienceWindowRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartPresentation = () => {
    // Open a clean audience window for the projector
    const aw = window.open(
      `${window.location.origin}${window.location.pathname}?mode=audience`,
      'sql-audience',
      'width=1920,height=1080'
    );
    audienceWindowRef.current = aw;
    setIsPresenting(true);
  };

  const handleStopPresentation = () => {
    audienceWindowRef.current?.close();
    audienceWindowRef.current = null;
    setIsPresenting(false);
  };

  // Markdown Export
  const handleDownloadHandout = () => {
    let content = "# Complete SQL Course: Business Executive Handout\n\n";
    slides.forEach(s => {
      content += `## ${s.id}. ${s.title}\n`;
      s.bullets.forEach(b => { content += `- ${b}\n`; });
      if (s.codeSnippet) { content += `\n\`\`\`sql\n${s.codeSnippet}\n\`\`\`\n`; }
      if (s.analogy) { content += `\n*Executive Analogy*: ${s.analogy}\n`; }
      content += `\n---\n\n`;
    });
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Complete_SQL_Executive_Handout.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  // PPTX Export
  const handleDownloadPPTX = () => {
    let pres = new pptxgen();
    pres.author = 'Complete SQL Course';
    pres.layout = 'LAYOUT_16x9';
    slides.forEach(s => {
      let slide = pres.addSlide();
      slide.background = { color: "0B0F19" };
      slide.addText(s.title || "SQL Overview", { x: 0.5, y: 0.5, w: "90%", h: 1, fontSize: 32, color: "6366F1", bold: true, fontFace: "Inter" });
      if (s.bullets && s.bullets.length > 0) {
        const bulletData = s.bullets.map(b => ({ text: b, options: { bullet: true, color: "F3F4F6", fontSize: 18, fontFace: "Inter" } }));
        slide.addText(bulletData, { x: 0.5, y: 1.8, w: "45%", h: 3, valign: "top", color: "F3F4F6", lineHeight: 1.5 });
      }
      if (s.codeSnippet) {
        slide.addText(s.codeSnippet, { x: 0.5, y: 5.0, w: "45%", h: 1.5, fontSize: 14, color: "10B981", fontFace: "Courier New", fill: { color: "000000" }, margin: 10 });
      }
      if (s.image) {
        slide.addImage({ path: window.location.origin + s.image, x: "52%", y: 1.8, w: "43%", h: 4.7, sizing: { type: 'contain' } });
      }
      if (s.speakerNotes) { slide.addNotes(s.speakerNotes); }
    });
    pres.writeFile({ fileName: "Complete_SQL_Presentation.pptx" });
    setShowDownloadMenu(false);
  };

  // PDF Export
  const handleDownloadPDFNative = async () => {
    setShowDownloadMenu(false);
    setIsExportingPDF(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    try {
      const container = document.getElementById('pdf-export-container');
      const images = Array.from(container.querySelectorAll('img'));
      await Promise.all(
        images.map(img =>
          img.complete
            ? Promise.resolve()
            : new Promise(res => { img.onload = res; img.onerror = res; })
        )
      );
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1920, 1080] });
      const slideNodes = document.querySelectorAll('.pdf-slide-node');
      for (let i = 0; i < slideNodes.length; i++) {
        const canvas = await html2canvas(slideNodes[i], { scale: 1, backgroundColor: '#0B0F19', logging: false, useCORS: true });
        if (i > 0) pdf.addPage([1920, 1080]);
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 1920, 1080);
      }
      pdf.save("Complete_SQL_Presentation.pdf");
    } catch (e) {
      console.error("PDF Generation failed:", e);
      alert("Could not generate PDF locally. Please try PPTX export.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  // ── Presenter mode: swap the whole app UI ──
  if (isPresenting) {
    return <PresenterView onStop={handleStopPresentation} />;
  }

  return (
    <div className="app-container">
      <header className="header" style={{ opacity: isExportingPDF ? 0.5 : 1, pointerEvents: isExportingPDF ? 'none' : 'all' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LayoutDashboard color="var(--accent)" />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.05em' }}>Complete SQL</h1>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Download dropdown */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              className="btn"
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              title="Download Options"
              style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}
            >
              {isExportingPDF ? <Loader2 size={20} className="spinner" /> : <Download size={20} />}
            </button>
            <AnimatePresence>
              {showDownloadMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '12px',
                    background: '#0B0F19', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.8)', padding: '8px', minWidth: '220px', zIndex: 100,
                    display: 'flex', flexDirection: 'column', gap: '4px'
                  }}
                >
                  <div style={{ padding: '8px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Download Format</div>
                  <button className="dropdown-item" onClick={handleDownloadPPTX}><Presentation size={16} /> PPTX & Google Slides</button>
                  <button className="dropdown-item" onClick={handleDownloadPDFNative}><Printer size={16} /> Real Native PDF</button>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
                  <button className="dropdown-item" onClick={handleDownloadHandout}><FileText size={16} /> Markdown Handout (.md)</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Present — opens audience window, current window becomes presenter */}
          <button className="btn present" onClick={handleStartPresentation} title="Open projector window + switch to presenter mode">
            <Monitor size={18} /> Present
          </button>

          <button className={`btn ${view === 'slides' ? 'primary' : ''}`} onClick={() => setView('slides')}>
            <Presentation size={18} /> Slides
          </button>
          <button className={`btn ${view === 'demo' ? 'primary' : ''}`} onClick={() => setView('demo')}>
            <Terminal size={18} /> Live SQL Demo
          </button>
        </div>
      </header>

      <style>{`
        .dropdown-item { display:flex; align-items:center; gap:12px; padding:10px 12px; width:100%; background:transparent; border:none; color:#f8fafc; border-radius:8px; cursor:pointer; transition:all 0.2s; font-size:0.9rem; font-family:inherit; text-align:left; }
        .dropdown-item:hover { background:rgba(99,102,241,0.18); color:#a5b4fc; }
        @keyframes spin { 100% { transform:rotate(360deg); } }
        .spinner { animation:spin 1s linear infinite; }
      `}</style>

      <main className="main-content">
        {view === 'slides' ? (
          <SlideDeck
            onNotesToggle={() => setShowNotes(!showNotes)}
            currentSlideObj={setCurrentSlide}
            slideIndex={slideIndex}
            setSlideIndex={setSlideIndex}
            isExportingPDF={isExportingPDF}
          />
        ) : (
          <SQLDemo />
        )}

        <AnimatePresence>
          {showNotes && currentSlide && view === 'slides' && !isExportingPDF && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="notes-panel glass-pane"
            >
              <h3>Speaker Notes — Slide {currentSlide.id}</h3>
              <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '12px' }}>
                <p>{currentSlide.speakerNotes}</p>
              </div>
              <button className="btn" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }} onClick={() => setShowNotes(false)}>
                Hide Notes
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;

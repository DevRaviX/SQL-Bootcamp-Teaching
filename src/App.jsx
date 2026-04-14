import React, { useState, useRef, useEffect } from 'react';
import { Presentation, Terminal, LayoutDashboard, FileText, Download, FileImage, Presentation as SlidesIcon, Printer } from 'lucide-react';
import SlideDeck from './components/SlideDeck';
import SQLDemo from './components/SQLDemo';
import { motion, AnimatePresence } from 'framer-motion';
import { slides } from './data/slidesData'; 
import pptxgen from "pptxgenjs";

function App() {
  const [view, setView] = useState('slides'); 
  const [showNotes, setShowNotes] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0); 
  
  // State for Dropdown
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  // Native blob export for students to keep (Markdown)
  const handleDownloadHandout = () => {
    let content = "# Complete SQL Course: Business Executive Handout\n\n";
    slides.forEach(s => {
      content += `## ${s.id}. ${s.title}\n`;
      s.bullets.forEach(b => {
        content += `- ${b}\n`;
      });
      if (s.codeSnippet) {
        content += `\n\`\`\`sql\n${s.codeSnippet}\n\`\`\`\n`;
      }
      if (s.analogy) {
        content += `\n*Executive Analogy*: ${s.analogy}\n`;
      }
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

  // Generate Native PowerPoint (PPTX) format
  const handleDownloadPPTX = () => {
    let pres = new pptxgen();
    pres.author = 'Complete SQL Course';
    pres.company = 'SQL Bootcamp';
    pres.layout = 'LAYOUT_16x9';

    slides.forEach(s => {
      let slide = pres.addSlide();
      slide.background = { color: "0B0F19" }; 

      slide.addText(s.title || "SQL Overview", { 
         x: 0.5, y: 0.5, w: "90%", h: 1, 
         fontSize: 32, color: "3B82F6", bold: true, fontFace: "Inter" 
      });

      if (s.bullets && s.bullets.length > 0) {
        const bulletData = s.bullets.map(b => ({ text: b, options: { bullet: true, color: "F3F4F6", fontSize: 18, fontFace: "Inter" } }));
        slide.addText(bulletData, { x: 0.5, y: 1.8, w: "45%", h: 3, valign: "top", color: "F3F4F6", lineHeight: 1.5 });
      }

      if (s.codeSnippet) {
         slide.addText(s.codeSnippet, { 
            x: 0.5, y: 5.0, w: "45%", h: 1.5, 
            fontSize: 14, color: "10B981", fontFace: "Courier New", fill: { color: "000000" }, margin: 10 
         });
      }

      if (s.image) {
        slide.addImage({ path: window.location.origin + s.image, x: "52%", y: 1.8, w: "43%", h: 4.7, sizing: {type: 'contain'} });
      }

      if (s.speakerNotes) {
        slide.addNotes(s.speakerNotes);
      }
    });

    pres.writeFile({ fileName: "Complete_SQL_Presentation.pptx" });
    setShowDownloadMenu(false);
  };

  const handleDownloadPDF = () => {
    // Relying on native browser Print-To-PDF which correctly maps the exact React UI frame
    window.print();
    setShowDownloadMenu(false);
  };


  return (
    <div className="app-container">
      {/* Top Navigation */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LayoutDashboard color="var(--accent)" />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.05em' }}>Complete SQL</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          
          {/* Download Dropdown Component */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button 
              className="btn" 
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              title="Download Options"
              style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}
            >
              <Download size={20} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showDownloadMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '12px',
                    background: '#0B0F19',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
                    padding: '8px',
                    minWidth: '220px',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ padding: '8px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Download Format</div>
                  
                  <button className="dropdown-item" onClick={handleDownloadPPTX}>
                    <SlidesIcon size={16} /> PPTX & Google Slides
                  </button>
                  <button className="dropdown-item" onClick={handleDownloadPDF}>
                    <Printer size={16} /> PDF Document
                  </button>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
                  <button className="dropdown-item" onClick={handleDownloadHandout}>
                    <FileText size={16} /> Markdown Handout (.md)
                  </button>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            className={`btn ${view === 'slides' ? 'primary' : ''}`}
            onClick={() => setView('slides')}
          >
            <Presentation size={18} /> Slides
          </button>
          <button 
            className={`btn ${view === 'demo' ? 'primary' : ''}`}
            onClick={() => setView('demo')}
          >
            <Terminal size={18} /> Live SQL Demo
          </button>
        </div>
      </header>

      {/* Embedded CSS for dropdown items to keep styling isolated */}
      <style>{`
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          width: 100%;
          background: transparent;
          border: none;
          color: #f8fafc;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
          font-family: inherit;
          text-align: left;
        }
        .dropdown-item:hover {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
        }
      `}</style>

      {/* Main Content Area */}
      <main className="main-content">
        {view === 'slides' ? (
          <SlideDeck 
             onNotesToggle={() => setShowNotes(!showNotes)} 
             currentSlideObj={setCurrentSlide} 
             slideIndex={slideIndex}
             setSlideIndex={setSlideIndex}
          />
        ) : (
          <SQLDemo />
        )}

        {/* Speaker Notes Floating Panel */}
        <AnimatePresence>
          {showNotes && currentSlide && view === 'slides' && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="notes-panel glass-pane"
            >
              <h3>Speaker Notes (Slide {currentSlide.id})</h3>
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

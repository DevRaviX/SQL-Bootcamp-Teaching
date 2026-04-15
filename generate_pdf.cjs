const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    try {
        console.log("Launching Chromium Engine...");
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        await page.setViewport({ width: 1920, height: 1080 });
        console.log("Connecting to Vite Localhost...");
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

        console.log("Injecting Custom Print Overrides...");
        await page.evaluate(() => {
            const style = document.createElement('style');
            style.innerHTML = `
                @media print {
                    @page { size: 19.2in 10.8in; margin: 0; }
                    body { 
                        -webkit-print-color-adjust: exact !important; 
                        print-color-adjust: exact !important; 
                        background: #0B0F19 !important; 
                    }
                    .header, .interactive-deck, .notes-panel { display: none !important; }
                    #pdf-export-container {
                        display: block !important;
                        position: relative !important;
                        left: 0 !important;
                        width: 1920px !important;
                        background: #0B0F19 !important;
                    }
                    .pdf-slide-node {
                        page-break-after: always !important;
                        position: relative !important;
                        width: 1920px !important;
                        height: 1080px !important;
                        overflow: hidden !important;
                    }
                }
            `;
            document.head.appendChild(style);
        });

        const outputPath = path.join(__dirname, 'Complete_SQL_Presentation.pdf');
        console.log("Synthesizing Native File...");

        await page.pdf({
            path: outputPath,
            printBackground: true,
            width: '19.2in',   // Hard-forcing physical landscape bounds
            height: '10.8in',  // Hard-forcing physical landscape bounds
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });

        console.log(`Successfully dropped PDF into root: ${outputPath}`);
        await browser.close();
        process.exit(0);
    } catch (e) {
        console.error("Fatal exception during PDF generation:", e);
        process.exit(1);
    }
})();

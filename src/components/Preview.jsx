import React, { useEffect, useRef } from 'react';
import { renderHTML } from '../utils/htmlRenderer';

export default function Preview({ blocks, selectedBlockId, onSelectBlock }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const html = renderHTML(blocks);
    const doc = iframeRef.current.contentDocument;
    
    const fullHTML = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        
        <!-- WET Framework CSS -->
        <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/css/wet-boew.min.css">
        <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/css/theme.min.css">
        
        <!-- WET Print CSS -->
        <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/css/print.css" media="print">
        
        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/assets/favicon.ico">
        
        <title>Page Preview</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
            margin: 0;
            padding: 20px;
          }
          main {
            max-width: 1200px;
            margin: 0 auto;
          }
          [data-block-id] { 
            position: relative;
            outline: 2px dashed rgba(0, 102, 204, 0.3);
            outline-offset: 2px;
            cursor: pointer;
            transition: outline 0.2s;
          }
          [data-block-id]:hover { 
            outline: 2px solid #0066cc;
            outline-offset: 2px;
            background-color: rgba(0, 102, 204, 0.02);
          }
          [data-block-selected] { 
            outline: 2px solid #0066cc !important;
            background-color: rgba(0, 102, 204, 0.05) !important;
          }
        </style>
      </head>
      <body>
        <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" class="container">
          ${html}
        </main>
        
        <!-- WET Framework JS -->
        <script src="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/js/wet-boew.min.js"></script>
        <script src="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/js/theme.min.js"></script>
        
        <script>
          // Listen for clicks on editable blocks
          document.querySelectorAll('[data-block-id]').forEach(el => {
            el.addEventListener('click', function(e) {
              e.stopPropagation();
              const blockId = this.getAttribute('data-block-id');
              window.parent.postMessage({ 
                type: 'selectBlock', 
                blockId: blockId 
              }, '*');
            });
          });
          
          // Trigger WET initialization after content loads
          if (window.wb) {
            window.wb.ready.then(() => {
              console.log('WET framework initialized');
            });
          }
        </script>
      </body>
      </html>`;
    
    doc.open();
    doc.write(fullHTML);
    doc.close();

    // Listen for messages from iframe
    const handleMessage = (e) => {
      if (e.data.type === 'selectBlock') {
        onSelectBlock(e.data.blockId);
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };

  }, [blocks, selectedBlockId, onSelectBlock]);

  return (
    <div className="preview-wrapper">
      <iframe 
        ref={iframeRef} 
        title="Page Preview" 
        className="preview-iframe"
        sandbox="allow-same-origin allow-scripts allow-popups"
      />
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';

export default function HtmlPlayer({ htmlCode, title = "Reproductor de Código HTML" }) {
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(800);

  // Unescape HTML entities if needed
  const getRawHtml = (str) => {
    if (!str) return '';
    let code = str.trim();
    if (code.includes('&lt;') || code.includes('&gt;')) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(code, 'text/html');
        code = doc.body.textContent || code;
      } catch (e) {
        console.warn("Error decoding HTML entities:", e);
      }
    }
    return code;
  };

  const rawHtml = getRawHtml(htmlCode);

  // Construct complete HTML document with automatic height calculation and scrolling enabled
  const fullDocument = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; }
          html, body {
            margin: 0;
            padding: 20px;
            background-color: #030304;
            color: #ffffff;
            font-family: 'Outfit', 'Plus Jakarta Sans', sans-serif;
            -webkit-font-smoothing: antialiased;
            overflow-x: hidden;
            overflow-y: auto !important;
            min-height: 100vh;
          }
          /* Custom scrollbar inside iframe */
          ::-webkit-scrollbar { width: 10px; }
          ::-webkit-scrollbar-track { background: #030304; }
          ::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 5px; }
        </style>
      </head>
      <body>
        ${rawHtml}
        <script>
          function notifyHeight() {
            try {
              const bodyH = document.body.scrollHeight || 0;
              const docH = document.documentElement.scrollHeight || 0;
              const maxH = Math.max(bodyH, docH, document.body.offsetHeight || 0);
              window.parent.postMessage({ type: 'HTML_PLAYER_RESIZE', height: maxH + 40 }, '*');
            } catch(e) {}
          }
          window.addEventListener('load', notifyHeight);
          window.addEventListener('resize', notifyHeight);
          document.addEventListener('DOMContentLoaded', notifyHeight);
          setInterval(notifyHeight, 800);
        </script>
      </body>
    </html>
  `;

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'HTML_PLAYER_RESIZE') {
        if (event.data.height && event.data.height > 200) {
          setIframeHeight(Math.max(event.data.height, 500));
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div 
      className="html-player-container"
      style={{
        width: '100%',
        background: '#030304',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
        marginBottom: '24px'
      }}
    >
      <iframe
        ref={iframeRef}
        srcDoc={fullDocument}
        title="Live HTML Code Player Render"
        style={{
          width: '100%',
          height: `${iframeHeight}px`,
          border: 'none',
          background: '#030304',
          transition: 'height 0.3s ease'
        }}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}

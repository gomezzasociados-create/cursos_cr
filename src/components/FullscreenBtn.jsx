import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function FullscreenBtn({ targetSelector = '#theoryContainer' }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFS = !!document.fullscreenElement;
      setIsFullscreen(isFS);
      if (isFS) {
        document.body.style.overflow = 'auto';
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    const targetEl = document.querySelector(targetSelector) || document.querySelector('.roadmap-wrapper') || document.documentElement;

    if (!document.fullscreenElement) {
      if (targetEl.requestFullscreen) {
        targetEl.requestFullscreen().catch(err => {
          console.error("Error activando pantalla completa:", err);
        });
      } else if (targetEl.webkitRequestFullscreen) {
        targetEl.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  return (
    <button 
      onClick={toggleFullscreen} 
      className="gold-btn"
      title="Proyectar clase en Pantalla Completa"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.95rem',
        padding: '10px 18px',
        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)'
      }}
    >
      {isFullscreen ? (
        <>
          <Minimize2 size={18} />
          <span>Salir de Pantalla Completa</span>
        </>
      ) : (
        <>
          <Maximize2 size={18} />
          <span>📺 Proyectar Clase (Pantalla Completa)</span>
        </>
      )}
    </button>
  );
}

import React from 'react';
import { PlayCircle, ShieldCheck, Tv } from 'lucide-react';

function getEmbedUrl(url) {
  if (!url) return '';
  let str = url.trim();
  const ytMatch = str.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return str;
}

export default function VideoGrid({ videos = [], phaseTitle = "Primera Clase" }) {
  if (!videos || videos.length === 0) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '30px' }}>
        <p style={{ color: '#a0a0a0' }}>No hay videos tutoriales asignados para esta clase aún.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '30px', marginBottom: '40px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        marginBottom: '20px',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        paddingBottom: '12px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Tv style={{ color: '#FFDF73' }} size={24} />
          <h3 style={{ margin: 0, color: '#FFDF73', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
            VIDEOS TUTORIALES PRIMERA CLASE
          </h3>
        </div>
        <span className="badge-gold" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <ShieldCheck size={14} /> CDN Streaming Optimizado (Zero Lag)
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px'
      }}>
        {videos.map((vid) => {
          const embedUrl = getEmbedUrl(vid.url);
          return (
            <div 
              key={vid.id} 
              className="glass-panel"
              style={{
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                background: 'linear-gradient(180deg, rgba(20, 20, 20, 0.9), rgba(10, 10, 10, 0.95))',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                <div style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: '12px',
                  backgroundColor: '#000',
                  marginBottom: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={vid.title || "Video Tutorial"}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 0
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      flexDirection: 'column',
                      color: '#a0a0a0'
                    }}>
                      <PlayCircle size={40} style={{ color: '#D4AF37', marginBottom: '8px' }} />
                      <span>URL no válida</span>
                    </div>
                  )}
                </div>

                <h4 style={{ margin: '0 0 6px 0', color: '#ffffff', fontSize: '1.1rem', fontWeight: '700' }}>
                  {vid.title || "Video Tutorial sin Título"}
                </h4>
                {vid.description && (
                  <p style={{ margin: 0, color: '#aaa', fontSize: '0.88rem', lineHeight: '1.4' }}>
                    {vid.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

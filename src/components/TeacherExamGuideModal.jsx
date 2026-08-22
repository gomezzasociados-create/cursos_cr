import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, Search, X, HelpCircle, Award, Sparkles } from 'lucide-react';

export default function TeacherExamGuideModal({ initialPhase = 1, onClose }) {
  const [selectedPhase, setSelectedPhase] = useState(initialPhase);
  const [guideData, setGuideData] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchGuideData();
  }, []);

  const fetchGuideData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/teacher/exams-guide');
      const data = await res.json();
      if (res.ok && data.guide) {
        setGuideData(data.guide);
      }
    } catch (err) {
      console.error("Error al obtener la guía de exámenes:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestions = guideData[selectedPhase] || [];
  const filteredQuestions = currentQuestions.filter(q => 
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.options.some(opt => opt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.88)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      zIndex: 99999,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        background: 'linear-gradient(160deg, #181404 0%, #08080c 100%)',
        border: '2px solid #FFDF73',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '960px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 70px rgba(212, 175, 55, 0.35)',
        color: '#ffffff',
        overflow: 'hidden'
      }}>

        {/* HEADER MODAL */}
        <div style={{
          padding: '24px 30px',
          borderBottom: '1px solid rgba(212,175,55,0.3)',
          background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(10,10,10,0.9) 100%)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <span className="badge-gold">
              <Sparkles size={13} /> SOLUCIONARIO OFICIAL PARA EL MAESTRO
            </span>
            <h2 style={{ margin: '6px 0 2px 0', color: '#FFDF73', fontSize: '1.8rem', fontWeight: '900' }}>
              📖 Guía Maestra de Exámenes con Respuestas Correctas
            </h2>
            <p style={{ margin: 0, color: '#d0d0d0', fontSize: '0.95rem' }}>
              Consulta las 20 preguntas y respuestas clave de cada fase para resolver dudas en clase presencial.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="gold-btn-outline"
            style={{ padding: '8px 14px', borderRadius: '50%', width: '42px', height: '42px', justifyContent: 'center' }}
            title="Cerrar Guía"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTROL DE SELECCIÓN DE FASE Y BÚSQUEDA */}
        <div style={{
          padding: '18px 30px',
          background: 'rgba(12, 12, 16, 0.95)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          {/* Selector de Fase */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: '#FFDF73', fontWeight: '800', fontSize: '0.9rem', marginRight: '6px' }}>
              Seleccionar Fase:
            </span>
            {[1, 2, 3, 4, 5].map((pNum) => (
              <button
                key={pNum}
                onClick={() => setSelectedPhase(pNum)}
                className={selectedPhase === pNum ? 'gold-btn' : 'gold-btn-outline'}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Fase {pNum}
              </button>
            ))}
          </div>

          {/* Buscador de Preguntas */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#FFDF73' }} />
            <input
              type="text"
              placeholder="Buscar pregunta o palabra clave..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '20px',
                background: '#050505',
                border: '1px solid rgba(212,175,55,0.4)',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* LISTADO DE 20 PREGUNTAS CON RESPUESTAS RESALTADAS */}
        <div style={{
          padding: '24px 30px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#FFDF73', fontSize: '1.2rem', fontWeight: 'bold' }}>
              Cargando solucionario oficial...
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 0', color: '#aaa' }}>
              No se encontraron preguntas que coincidan con la búsqueda.
            </div>
          ) : (
            filteredQuestions.map((q, index) => {
              const correctIdx = q.correctAnswer || 0;
              return (
                <div 
                  key={q.id || index}
                  style={{
                    background: 'linear-gradient(180deg, rgba(20,20,25,0.9) 0%, rgba(10,10,14,0.95) 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '18px',
                    padding: '20px 24px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.6)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #FFDF73 0%, #D4AF37 100%)',
                        color: '#000',
                        fontWeight: '900',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem'
                      }}>
                        PREGUNTA {index + 1} DE 20
                      </span>
                      <span style={{ color: '#81c784', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={15} /> Respuesta Correcta: Opción {q.correctAnswerLetter}
                      </span>
                    </div>
                  </div>

                  <h4 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: '800', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                    {q.question}
                  </h4>

                  {/* Opciones con la respuesta correcta destacada en Neón Esmeralda */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === correctIdx;
                      return (
                        <div
                          key={optIdx}
                          style={{
                            padding: '12px 18px',
                            borderRadius: '12px',
                            border: isCorrect ? '2px solid #81c784' : '1px solid rgba(255,255,255,0.08)',
                            background: isCorrect ? 'rgba(46, 125, 50, 0.25)' : 'rgba(5, 5, 8, 0.6)',
                            color: isCorrect ? '#ffffff' : '#b0b0b0',
                            fontWeight: isCorrect ? '800' : '400',
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: isCorrect ? '0 0 15px rgba(76,175,80,0.3)' : 'none'
                          }}
                        >
                          <span style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: isCorrect ? '#81c784' : 'rgba(255,255,255,0.1)',
                            color: isCorrect ? '#000' : '#aaa',
                            display: 'flex',
                            alignItems: 'center',
                            justify: 'center',
                            fontSize: '0.85rem',
                            fontWeight: '900',
                            flexShrink: 0
                          }}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>

                          <span style={{ flex: 1 }}>{opt}</span>

                          {isCorrect && (
                            <span style={{
                              background: '#81c784',
                              color: '#000',
                              fontSize: '0.75rem',
                              fontWeight: '900',
                              padding: '3px 10px',
                              borderRadius: '20px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              ✓ CLAVE CORRECTA
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* FOOTER MODAL */}
        <div style={{
          padding: '16px 30px',
          borderTop: '1px solid rgba(212,175,55,0.2)',
          background: '#050505',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.85rem', color: '#a0a0a0' }}>
            Fase {selectedPhase} • Total {currentQuestions.length} Preguntas Evaluadas
          </span>

          <button onClick={onClose} className="gold-btn">
            Entendido / Cerrar Guía
          </button>
        </div>

      </div>
    </div>
  );
}

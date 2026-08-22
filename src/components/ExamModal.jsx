import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle, FileText, XCircle, Award, Sparkles, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ExamModal({ phaseId, phaseTitle, onClose, onSubmitExam, isSubmitting }) {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [examResult, setExamResult] = useState(null);

  useEffect(() => {
    fetchExam();
  }, [phaseId]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/exams/${phaseId}`);
      const data = await res.json();
      setQuestions(data.questions || data || []);
    } catch (err) {
      console.error("Error cargando examen:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qId, optionIdx) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleSubmit = async () => {
    const totalQ = questions.length;
    const answeredQ = Object.keys(userAnswers).length;

    if (answeredQ < totalQ) {
      if (!confirm(`Has respondido ${answeredQ} de ${totalQ} preguntas. ¿Deseas enviar tu examen de todas formas?`)) {
        return;
      }
    }

    const result = await onSubmitExam(phaseId, userAnswers);
    if (result) {
      setExamResult(result);
    }
  };

  const totalQuestions = questions.length || 20;
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

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
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        background: 'linear-gradient(160deg, #161204 0%, #060608 100%)',
        border: '2px solid #FFDF73',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 70px rgba(212, 175, 55, 0.35)',
        color: '#ffffff',
        overflow: 'hidden'
      }}>
        
        {/* HEADER EXAMEN ULTRA MODERNO */}
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
            <span className="badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={13} /> EVALUACIÓN DE DOMINIO TÉCNICO • 20 PREGUNTAS
            </span>
            <h2 style={{ margin: '6px 0 2px 0', color: '#FFDF73', fontSize: '1.8rem', fontWeight: '900' }}>
              Examen de Evaluación • Fase {phaseId}
            </h2>
            <p style={{ margin: 0, color: '#d0d0d0', fontSize: '0.95rem' }}>
              {phaseTitle} • Completa las 20 preguntas para registrar tu evaluación.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="gold-btn-outline"
            style={{ padding: '8px 14px', borderRadius: '50%', width: '42px', height: '42px', justifyContent: 'center' }}
            title="Cerrar Examen"
          >
            ✕
          </button>
        </div>

        {/* BARRA DE PROGRESO NEÓN DORADA */}
        {!examResult && !loading && (
          <div style={{ background: '#050505', padding: '12px 30px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.85rem' }}>
              <span style={{ color: '#FFDF73', fontWeight: 'bold' }}>
                Progreso de Respuestas: {answeredCount} de {totalQuestions} completadas
              </span>
              <span style={{ color: '#81c784', fontWeight: '900' }}>
                {progressPercent}% Completado
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #D4AF37 0%, #FFDF73 100%)',
                borderRadius: '10px',
                transition: 'width 0.3s ease',
                boxShadow: '0 0 12px #FFDF73'
              }} />
            </div>
          </div>
        )}

        {/* CUERPO DEL MODAL EXAMEN */}
        <div style={{ padding: '24px 30px', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#FFDF73', fontSize: '1.2rem', fontWeight: 'bold' }}>
              Cargando cuestionario de 20 preguntas...
            </div>
          ) : examResult ? (
            /* DISPLAY RESULTADOS IMPACTANTE */
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFDF73, #D4AF37)',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                margin: '0 auto 20px auto',
                boxShadow: '0 0 35px rgba(212,175,55,0.6)'
              }}>
                <Award size={48} />
              </div>

              <h3 style={{ fontSize: '2.2rem', color: '#FFDF73', margin: '0 0 10px 0', fontWeight: '900' }}>
                ¡Examen Entregado Exitosamente!
              </h3>
              <p style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '24px' }}>
                Puntuación obtenida: <strong style={{ color: '#81c784', fontSize: '1.5rem' }}>{examResult.score} / {examResult.totalQuestions} aciertos</strong>
              </p>

              <div className="premium-box" style={{ textAlign: 'left', margin: '24px 0', padding: '24px', borderRadius: '18px' }}>
                <div className="premium-box-title" style={{ fontSize: '1.3rem' }}>📌 Estado de la Evaluación</div>
                <p className="box-text" style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0 }}>
                  {examResult.autoAdvanced ? (
                    <span style={{ color: '#81c784', fontWeight: 'bold' }}>
                      ✅ Modalidad Alumno Virtual: Has aprobado el examen y avanzado automáticamente a la siguiente fase.
                    </span>
                  ) : (
                    <span style={{ color: '#ffb74d', fontWeight: 'bold' }}>
                      ⏳ Modalidad Alumno Presencial: Tu evaluación ha sido enviada al maestro. Tu pantalla avanzará sincrónicamente en tiempo real cuando el maestro active la Siguiente Fase.
                    </span>
                  )}
                </p>
              </div>

              <button onClick={onClose} className="gold-btn" style={{ marginTop: '16px', padding: '14px 32px', fontSize: '1.05rem' }}>
                Entendido / Cerrar Examen
              </button>
            </div>
          ) : (
            /* LISTA DE 20 PREGUNTAS ULTRA MODERNAS */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {questions.map((q, qIndex) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                return (
                  <div 
                    key={q.id || qIndex}
                    style={{
                      background: isAnswered ? 'linear-gradient(180deg, rgba(24, 20, 8, 0.9) 0%, rgba(10,10,12,0.95) 100%)' : 'linear-gradient(180deg, rgba(18, 18, 22, 0.9) 0%, rgba(8, 8, 10, 0.95) 100%)',
                      border: isAnswered ? '1px solid #FFDF73' : '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '20px',
                      padding: '22px 26px',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #FFDF73 0%, #D4AF37 100%)',
                        color: '#000',
                        fontWeight: '900',
                        padding: '4px 14px',
                        borderRadius: '20px',
                        fontSize: '0.85rem'
                      }}>
                        PREGUNTA {qIndex + 1} DE {totalQuestions}
                      </span>
                      {isAnswered ? (
                        <span style={{ color: '#81c784', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={15} /> Respondida
                        </span>
                      ) : (
                        <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Pendiente</span>
                      )}
                    </div>

                    <p style={{ fontWeight: '800', color: '#ffffff', fontSize: '1.2rem', marginBottom: '18px', lineHeight: '1.5' }}>
                      {q.question}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                      {q.options.map((opt, optIndex) => {
                        const isSelected = userAnswers[q.id] === optIndex;
                        return (
                          <button
                            key={optIndex}
                            onClick={() => handleOptionSelect(q.id, optIndex)}
                            style={{
                              textAlign: 'left',
                              padding: '14px 20px',
                              borderRadius: '14px',
                              border: isSelected ? '2px solid #FFDF73' : '1px solid rgba(255,255,255,0.1)',
                              background: isSelected ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(20,20,20,0.9) 100%)' : 'rgba(10,10,14,0.7)',
                              color: isSelected ? '#ffffff' : '#d4d4d4',
                              fontWeight: isSelected ? '800' : '500',
                              cursor: 'pointer',
                              transition: 'all 0.25s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              boxShadow: isSelected ? '0 0 20px rgba(212,175,55,0.35)' : 'none'
                            }}
                          >
                            <span style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              background: isSelected ? 'linear-gradient(135deg, #FFDF73, #D4AF37)' : 'rgba(255,255,255,0.12)',
                              color: isSelected ? '#000' : '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justify: 'center',
                              fontSize: '0.9rem',
                              fontWeight: '900',
                              flexShrink: 0
                            }}>
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span style={{ flex: 1, fontSize: '1rem', lineHeight: '1.4' }}>{opt}</span>
                            {isSelected && (
                              <Check size={18} style={{ color: '#FFDF73' }} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER BAR EXAMEN */}
        {!examResult && (
          <div style={{
            padding: '18px 30px',
            borderTop: '1px solid rgba(212,175,55,0.3)',
            background: '#050505',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-gold" style={{ fontSize: '0.85rem' }}>
                Respondidas: {answeredCount} de {totalQuestions}
              </span>
            </div>

            <button 
              onClick={handleSubmit} 
              className="gold-btn"
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.7 : 1, padding: '14px 32px', fontSize: '1rem' }}
            >
              {isSubmitting ? 'Enviando Examen...' : '🚀 Enviar Examen de 20 Preguntas'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

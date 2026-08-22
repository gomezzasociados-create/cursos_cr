import React, { useState, useEffect } from 'react';
import TheorySection from '../components/TheorySection.jsx';
import VideoGrid from '../components/VideoGrid.jsx';
import ExamModal from '../components/ExamModal.jsx';
import { GraduationCap, Award, CheckCircle, Clock, Lock, Sparkles, AlertCircle, MessageSquare, Tv } from 'lucide-react';

function formatEmbedUrl(url) {
  if (!url) return '';
  let str = url.trim();
  const ytMatch = str.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return str;
}

export default function StudentView({ user, state, socket, onRefreshState }) {
  const isVirtual = user?.role === 'Alumno Virtual';
  
  const [userPhase, setUserPhase] = useState(user?.currentPhase || state.currentPhasePresencial || 1);
  const [examSubmitted, setExamSubmitted] = useState(user?.examSubmitted || false);
  const [waitingApproval, setWaitingApproval] = useState(user?.waitingApproval || false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);
  const [notification, setNotification] = useState(null);

  const phaseObj = state.phases?.find(p => p.id === userPhase) || state.phases?.[0];
  const welcomeMessage = state.welcomeStudentsMessage || "¡Bienvenido(a) a la clase! Recuerda seguir atentamente las explicaciones del maestro y presentar tus evaluaciones al concluir cada fase.";
  
  const welcomeVideoRaw = state.welcomeStudentsVideoUrl || state.welcomeVideoUrl || "https://www.youtube.com/watch?v=3lB9dP4HRPA";
  const welcomeVideoUrl = formatEmbedUrl(welcomeVideoRaw);

  useEffect(() => {
    if (!isVirtual) {
      setUserPhase(state.currentPhasePresencial || 1);
    }
  }, [state.currentPhasePresencial, isVirtual]);

  useEffect(() => {
    if (!socket) return;

    socket.on('welcome_settings_updated', () => {
      if (onRefreshState) onRefreshState();
    });

    socket.on('phase_advanced', (data) => {
      if (!isVirtual) {
        setUserPhase(data.newPhase);
        setExamSubmitted(false);
        setWaitingApproval(false);
        setNotification({
          title: "🎉 ¡Fase Desbloqueada!",
          msg: `Tu maestro ha avanzado la clase a la Fase ${data.newPhase}. La nueva teoría y videos están disponibles.`
        });
        onRefreshState();
      }
    });

    socket.on('virtual_student_advanced', (data) => {
      if (isVirtual && data.studentId === user?.id) {
        setUserPhase(data.newPhase);
        setExamSubmitted(false);
        setWaitingApproval(false);
        setNotification({
          title: "⚡ ¡Fase Avanzada Automáticamente!",
          msg: `Has pasado a la Fase ${data.newPhase} exitosamente.`
        });
      }
    });

    return () => {
      socket.off('welcome_settings_updated');
      socket.off('phase_advanced');
      socket.off('virtual_student_advanced');
    };
  }, [socket, isVirtual, user]);

  const handleSubmitExam = async (phaseId, answers) => {
    try {
      setIsSubmittingExam(true);
      const res = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user?.id || 'u_presencial_1',
          phaseId,
          answers
        })
      });

      const data = await res.json();

      if (res.ok) {
        setExamSubmitted(true);
        if (data.autoAdvanced) {
          setUserPhase(data.newPhase);
          setWaitingApproval(false);
        } else {
          setWaitingApproval(true);
        }
        return data;
      } else {
        alert(data.error || "Error al enviar examen");
        return null;
      }
    } catch (err) {
      alert("Error de conexión al enviar examen");
      return null;
    } finally {
      setIsSubmittingExam(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>

      {/* Real-time Notification Banner */}
      {notification && (
        <div style={{
          background: 'linear-gradient(135deg, #1b5e20 0%, #0d0d0d 100%)',
          border: '1px solid #4CAF50',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#fff',
          boxShadow: '0 8px 24px rgba(76, 175, 80, 0.2)'
        }}>
          <div>
            <strong style={{ color: '#81c784', fontSize: '1.1rem' }}>{notification.title}</strong>
            <p style={{ margin: '4px 0 0 0', color: '#e0e0e0' }}>{notification.msg}</p>
          </div>
          <button 
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 0, color: '#aaa', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(160deg, #141004 0%, #080808 100%)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge-gold">
              FRONTEND • SESIÓN DE {isVirtual ? 'ALUMNO VIRTUAL' : 'ALUMNO PRESENCIAL'}
            </span>
            <span className="badge-green">
              {isVirtual ? 'Autodesbloqueo Automático' : 'Sincronizado vía WebSocket'}
            </span>
          </div>
          <h2 style={{ margin: '4px 0 4px 0', color: '#FFDF73', fontSize: '2rem', fontWeight: '900' }}>
            Bienvenido(a), {user?.name || 'Alumno(a)'}
          </h2>
          <p style={{ margin: 0, color: '#a0a0a0', fontSize: '0.95rem' }}>
            {isVirtual 
              ? 'Modalidad Virtual: Presenta el examen de 20 preguntas para avanzar automáticamente de fase.'
              : 'Modalidad Presencial: Presenta tu examen. Tu pantalla se actualizará en tiempo real cuando el maestro apruebe la fase.'}
          </p>
        </div>

        <div style={{
          background: 'rgba(212, 175, 55, 0.1)',
          border: '1px solid #D4AF37',
          padding: '14px 22px',
          borderRadius: '14px',
          textAlign: 'right'
        }}>
          <span style={{ fontSize: '0.85rem', color: '#a0a0a0', display: 'block' }}>Tu Fase Actual</span>
          <strong style={{ color: '#FFDF73', fontSize: '1.5rem', fontWeight: '900' }}>
            Fase {userPhase} de {state.phases?.length || 5}
          </strong>
        </div>
      </div>

      {/* --- VIDEO DE BIENVENIDA A LOS ALUMNOS (CONFIGURADO POR ADMIN) --- */}
      {welcomeVideoUrl && (
        <div className="glass-panel" style={{
          marginBottom: '32px',
          background: 'linear-gradient(160deg, #181404 0%, #080808 100%)',
          border: '1px solid #FFDF73',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Tv size={24} style={{ color: '#FFDF73' }} />
            <h3 style={{ margin: 0, color: '#FFDF73', fontSize: '1.4rem', fontWeight: '800' }}>
              🎥 VIDEO DE BIENVENIDA A LA CLASE DE LOS ALUMNOS
            </h3>
          </div>

          <div style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            borderRadius: '14px',
            border: '2px solid rgba(212, 175, 55, 0.4)',
            backgroundColor: '#000'
          }}>
            <iframe
              src={welcomeVideoUrl}
              title="Video de Bienvenida Alumnos"
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
          </div>
        </div>
      )}

      {/* --- MENSAJE DE BIENVENIDA ALUMNOS (CONFIGURADO POR ADMIN) --- */}
      {welcomeMessage && (
        <div className="glass-panel" style={{
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(10,10,10,0.8) 100%)',
          borderLeft: '4px solid #FFDF73',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <MessageSquare size={28} style={{ color: '#FFDF73', flexShrink: 0 }} />
          <div>
            <strong style={{ color: '#FFDF73', fontSize: '1.05rem', display: 'block', marginBottom: '2px' }}>
              Mensaje de Bienvenida a Alumnos
            </strong>
            <p style={{ margin: 0, color: '#e0e0e0', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {welcomeMessage}
            </p>
          </div>
        </div>
      )}

      {/* Progress Phase Navigation Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '32px'
      }}>
        {state.phases?.map((ph) => {
          const isUnlocked = ph.id <= userPhase;
          const isCurrent = ph.id === userPhase;
          return (
            <div 
              key={ph.id}
              style={{
                background: isCurrent ? 'linear-gradient(135deg, #261f07 0%, #0d0d0d 100%)' : 'rgba(15,15,15,0.7)',
                border: isCurrent ? '2px solid #FFDF73' : isUnlocked ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '14px',
                opacity: isUnlocked ? 1 : 0.4,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: isUnlocked ? '#D4AF37' : '#666' }}>
                  FASE {ph.id}
                </span>
                {isUnlocked ? (
                  <CheckCircle size={14} style={{ color: '#81c784' }} />
                ) : (
                  <Lock size={14} style={{ color: '#666' }} />
                )}
              </div>
              <strong style={{ display: 'block', fontSize: '0.9rem', color: isCurrent ? '#FFDF73' : '#fff' }}>
                {ph.subtitle}
              </strong>
            </div>
          );
        })}
      </div>

      {/* Status Warning Banner for Presencial waiting approval */}
      {!isVirtual && waitingApproval && (
        <div style={{
          background: 'rgba(255, 152, 0, 0.15)',
          border: '1px solid #ffb74d',
          borderRadius: '14px',
          padding: '18px 24px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          color: '#ffb74d'
        }}>
          <Clock size={28} />
          <div>
            <strong style={{ fontSize: '1.1rem', display: 'block' }}>
              Estado Actual: Esperando aprobación del maestro
            </strong>
            <span style={{ fontSize: '0.9rem', color: '#e0e0e0' }}>
              Has entregado tu examen de 20 preguntas para la Fase {userPhase}. En cuanto el maestro presione "Siguiente Fase" en el panel presencial, tu pantalla avanzará automáticamente sin refrescar la página.
            </span>
          </div>
        </div>
      )}

      {/* --- CONTENT DISPLAY: THEORY & VIDEOS --- */}
      <div style={{ marginBottom: '40px' }}>
        <TheorySection showFullscreenBtn={false} customHtml={phaseObj?.theoryHtml} />
      </div>

      <div style={{ marginBottom: '50px' }}>
        <VideoGrid videos={phaseObj?.videos || []} phaseTitle={phaseObj?.title || `Fase ${userPhase}`} />
      </div>

      {/* --- EXAM ACTION PANEL --- */}
      <div className="glass-panel" style={{
        textAlign: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 105%)',
        border: '1px solid #FFDF73'
      }}>
        <Award size={48} style={{ color: '#FFDF73', marginBottom: '12px' }} />
        <h3 style={{ margin: '0 0 10px 0', color: '#FFDF73', fontSize: '1.6rem', fontWeight: '800' }}>
          Evaluación de la Fase {userPhase} (20 Preguntas)
        </h3>
        <p style={{ color: '#a0a0a0', maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
          Demuestra tu dominio técnico presentando el cuestionario correspondiente a la fase actual.
        </p>

        <button
          onClick={() => setShowExamModal(true)}
          className="gold-btn"
          style={{ padding: '16px 36px', fontSize: '1.1rem' }}
        >
          {examSubmitted ? '✍️ Reevaluar / Ver Examen de 20 Preguntas' : '✍️ Rendir Examen de 20 Preguntas'}
        </button>
      </div>

      {showExamModal && (
        <ExamModal
          phaseId={userPhase}
          phaseTitle={phaseObj?.subtitle || `Fase ${userPhase}`}
          onClose={() => setShowExamModal(false)}
          onSubmitExam={handleSubmitExam}
          isSubmitting={isSubmittingExam}
        />
      )}

    </div>
  );
}

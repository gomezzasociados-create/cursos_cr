import React, { useState, useEffect } from 'react';
import TheorySection from '../components/TheorySection.jsx';
import VideoGrid from '../components/VideoGrid.jsx';
import ExamModal from '../components/ExamModal.jsx';
import TeacherExamGuideModal from '../components/TeacherExamGuideModal.jsx';
import { Award, ChevronRight, RefreshCw, Send, CheckCircle2, Clock, Users, ArrowRight, Tv, BookOpen, UserPlus, Mail, Edit, Trash2, X, Save, ArrowLeft, RotateCcw, FastForward } from 'lucide-react';

function formatEmbedUrl(url) {
  if (!url) return '';
  let str = url.trim();
  const ytMatch = str.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return str;
}

export default function TeacherView({ user, state, socket, onRefreshState }) {
  const currentPhaseId = state.currentPhasePresencial || 1;
  const currentPhaseObj = state.phases?.find(p => p.id === currentPhaseId) || state.phases?.[0];
  const maxPhases = state.phases ? state.phases.length : 5;

  const [students, setStudents] = useState([]);
  const [whatsappToast, setWhatsappToast] = useState(null);
  
  // Teacher Name State
  const [teacherName, setTeacherName] = useState(user?.name || state?.teacherName || "Maestra Elena Gomez");

  // New Student Input Fields State
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentWhatsapp, setNewStudentWhatsapp] = useState('');
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  // Edit Student Modal State
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Exam Guide & Take Exam Modals
  const [showExamGuideModal, setShowExamGuideModal] = useState(false);
  const [showTakeExamModal, setShowTakeExamModal] = useState(false);
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);

  const welcomeVideoUrl = formatEmbedUrl(state.welcomeTeacherVideoUrl || "https://www.youtube.com/watch?v=3lB9dP4HRPA");

  useEffect(() => {
    if (user?.name) setTeacherName(user.name);
    else if (state?.teacherName) setTeacherName(state.teacherName);
  }, [user, state]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('exam_submitted_presencial', (data) => {
      fetchStudents();
      setWhatsappToast({
        title: "✍️ Nuevo Examen Entregado",
        msg: `El alumno presencial '${data.studentName}' ha completado el examen de la Fase ${data.phaseId} con puntaje ${data.score}/20.`
      });
    });

    socket.on('users_updated', () => {
      fetchStudents();
    });

    return () => {
      socket.off('exam_submitted_presencial');
      socket.off('users_updated');
    };
  }, [socket]);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok) {
        const presenciales = data.filter(u => u.role === 'Alumno Presencial');
        setStudents(presenciales);
      }
    } catch (err) {
      console.error("Error al obtener alumnos presenciales:", err);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudentName.trim()) {
      alert("Por favor ingresa el nombre del alumno(a).");
      return;
    }

    try {
      setIsAddingStudent(true);
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStudentName.trim(),
          email: newStudentEmail.trim() || undefined,
          whatsapp: newStudentWhatsapp.trim() || '+52 5500000000',
          role: 'Alumno Presencial'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWhatsappToast({
          title: `✅ Alumno(a) Registrado(a)`,
          msg: `Se ha ingresado exitosamente a '${newStudentName}' en la lista presencial.`
        });
        setNewStudentName('');
        setNewStudentEmail('');
        setNewStudentWhatsapp('');
        fetchStudents();
      } else {
        alert(data.error || "Error al registrar alumno");
      }
    } catch (err) {
      alert("Error de conexión al registrar alumno");
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    if (!editingStudent || !editingStudent.name.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }

    try {
      setIsSavingEdit(true);
      const res = await fetch(`/api/admin/users/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingStudent.name.trim(),
          email: editingStudent.email.trim(),
          whatsapp: editingStudent.whatsapp.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWhatsappToast({
          title: "✏️ Alumno(a) Actualizado(a)",
          msg: `Los datos de '${editingStudent.name}' fueron guardados con éxito.`
        });
        setEditingStudent(null);
        fetchStudents();
      } else {
        alert(data.error || "Error al actualizar alumno");
      }
    } catch (err) {
      alert("Error de conexión al guardar cambios");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteStudent = async (studentId, name) => {
    if (!confirm(`¿Estás seguro(a) de eliminar permanentemente a '${name}' de la lista de alumnos presenciales?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${studentId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWhatsappToast({
          title: "🗑️ Alumno(a) Eliminado(a)",
          msg: `El alumno(a) '${name}' fue retirado de la lista.`
        });
        fetchStudents();
      } else {
        alert(data.error || "Error al eliminar alumno");
      }
    } catch (err) {
      alert("Error de conexión al eliminar alumno");
    }
  };

  const handleSendCredentials = async (studentId, name, whatsapp, email) => {
    try {
      const studentEmailText = email ? `\n📌 *Correo:* ${email}` : '';
      const msg = `🎉 *BIENVENIDO(A) A LA CLASE PRESENCIAL*
----------------------------------------
Hola *${name}*, tu cuenta de acceso a la plataforma es:
📌 *URL:* http://localhost:8083
📌 *Usuario / ID:* ${studentId}${studentEmailText}
📌 *Contraseña por defecto:* presencial123

¡Conéctate desde tu dispositivo móvil para seguir la clase!`;

      const encodedMsg = encodeURIComponent(msg);
      const waUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodedMsg}`;

      setWhatsappToast({
        title: `✅ Credenciales Generadas para ${name}`,
        msg: `Mensaje de WhatsApp preparado exitosamente. Se ha abierto la ventana de envío.`,
        preview: msg
      });

      window.open(waUrl, '_blank');
    } catch (err) {
      alert("Error al preparar mensaje de WhatsApp");
    }
  };

  // Phase Navigation Handlers
  const handleNextPhase = async () => {
    try {
      const res = await fetch('/api/teacher/next-phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (res.ok) {
        setWhatsappToast({
          title: "🚀 Siguiente Fase Activada",
          msg: data.message
        });
        onRefreshState();
        fetchStudents();
      } else {
        alert(data.error || "Error al avanzar a la siguiente fase");
      }
    } catch (err) {
      alert("Error de conexión al avanzar de fase");
    }
  };

  const handlePrevPhase = async () => {
    try {
      const res = await fetch('/api/teacher/prev-phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (res.ok) {
        setWhatsappToast({
          title: "⬅️ Fase Anterior Activada",
          msg: data.message
        });
        onRefreshState();
        fetchStudents();
      } else {
        alert(data.error || "Error al regresar de fase");
      }
    } catch (err) {
      alert("Error de conexión al regresar de fase");
    }
  };

  const handleResetCourse = async () => {
    if (!confirm("🔄 ¿Estás seguro(a) de REINICIAR EL CURSO a la Fase 1?\n\nEsta opción es para cuando terminas todas las fases e inicias una NUEVA CLASE con nuevos alumnos.")) {
      return;
    }

    try {
      const res = await fetch('/api/teacher/reset-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (res.ok) {
        setWhatsappToast({
          title: "🔄 Curso Reiniciado a Fase 1",
          msg: "El curso se ha reiniciado con éxito. ¡Listo para comenzar una nueva clase con nuevos alumnos!"
        });
        onRefreshState();
        fetchStudents();
      } else {
        alert(data.error || "Error al reiniciar el curso");
      }
    } catch (err) {
      alert("Error de conexión al reiniciar el curso");
    }
  };

  const handleSubmitTeacherExam = async (phaseId, answers) => {
    try {
      setIsSubmittingExam(true);
      const res = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user?.id || 'u_teacher',
          phaseId,
          answers
        })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      alert("Error de conexión al enviar examen");
      return null;
    } finally {
      setIsSubmittingExam(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Toast Notification */}
      {whatsappToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'linear-gradient(135deg, #1b5e20 0%, #0d0d0d 100%)',
          border: '1px solid #4CAF50',
          borderRadius: '16px',
          padding: '20px',
          color: '#ffffff',
          maxWidth: '450px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, color: '#81c784', fontSize: '1.05rem', fontWeight: '800' }}>
              {whatsappToast.title}
            </h4>
            <button 
              onClick={() => setWhatsappToast(null)}
              style={{ background: 'none', border: 0, color: '#aaa', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#e0e0e0' }}>{whatsappToast.msg}</p>
          {whatsappToast.preview && (
            <pre style={{
              background: '#050505',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#81c784',
              whiteSpace: 'pre-wrap',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              margin: 0
            }}>
              {whatsappToast.preview}
            </pre>
          )}
        </div>
      )}

      {/* Header Panel Con Botones de Navegación de Fase & Reinicio */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <span className="badge-gold">BACKEND • SESIÓN DE MAESTRO(A)</span>
          <h2 style={{ margin: '8px 0 4px 0', color: '#FFDF73', fontSize: '2rem', fontWeight: '900' }}>
            Bienvenido(a), {teacherName}
          </h2>
          <p style={{ margin: 0, color: '#a0a0a0', fontSize: '1rem' }}>
            Imparte el módulo, proyecta la teoría a pantalla completa y controla el avance de las fases.
          </p>
        </div>

        {/* CONTROLES DIRECTOS DE NAVEGACIÓN Y REINICIO DE FASE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          <div style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid #D4AF37',
            padding: '10px 18px',
            borderRadius: '16px',
            textAlign: 'right'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#a0a0a0', display: 'block' }}>Fase Actual de la Clase</span>
            <strong style={{ color: '#FFDF73', fontSize: '1.35rem', fontWeight: '900' }}>
              Fase {currentPhaseId} de {maxPhases}: {currentPhaseObj?.subtitle || 'Recepción'}
            </strong>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button
              onClick={handlePrevPhase}
              disabled={currentPhaseId <= 1}
              className="gold-btn-outline"
              style={{
                fontSize: '0.82rem',
                padding: '7px 14px',
                opacity: currentPhaseId <= 1 ? 0.4 : 1,
                cursor: currentPhaseId <= 1 ? 'not-allowed' : 'pointer'
              }}
              title="Regresar a la fase anterior"
            >
              <ArrowLeft size={14} /> Fase Anterior
            </button>

            <button
              onClick={handleNextPhase}
              disabled={currentPhaseId >= maxPhases}
              className="green-btn"
              style={{
                fontSize: '0.85rem',
                padding: '7px 16px',
                opacity: currentPhaseId >= maxPhases ? 0.5 : 1,
                cursor: currentPhaseId >= maxPhases ? 'not-allowed' : 'pointer'
              }}
              title="Avanzar a la siguiente fase"
            >
              🚀 Siguiente Fase <ArrowRight size={14} />
            </button>

            <button
              onClick={handleResetCourse}
              style={{
                background: 'rgba(255, 152, 0, 0.15)',
                color: '#ffb74d',
                border: '1px solid #ffb74d',
                borderRadius: '30px',
                padding: '7px 14px',
                cursor: 'pointer',
                fontWeight: '900',
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Reiniciar el curso a la Fase 1 para una nueva clase"
            >
              <RotateCcw size={14} /> Reiniciar Curso
            </button>
          </div>
        </div>
      </div>

      {/* --- VIDEO DE BIENVENIDA DEL MAESTRO (CONFIGURADO POR ADMIN) --- */}
      {welcomeVideoUrl && (
        <div className="glass-panel" style={{
          marginBottom: '40px',
          background: 'linear-gradient(160deg, #181404 0%, #080808 100%)',
          border: '1px solid #FFDF73',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Tv size={24} style={{ color: '#FFDF73' }} />
            <h3 style={{ margin: 0, color: '#FFDF73', fontSize: '1.4rem', fontWeight: '800' }}>
              🎥 VIDEO DE BIENVENIDA A LA CLASE DE LA MAESTRA ({teacherName})
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
              title="Video de Bienvenida Maestro"
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

      {/* --- SECCIÓN A: TEORÍA INTEGRADA --- */}
      <div style={{ marginBottom: '40px' }}>
        <TheorySection showFullscreenBtn={true} customHtml={currentPhaseObj?.theoryHtml} />
      </div>

      {/* --- VIDEOS TUTORIALES DE LA FASE ACTUAL --- */}
      <div style={{ marginBottom: '40px' }}>
        <VideoGrid videos={currentPhaseObj?.videos || []} phaseTitle={currentPhaseObj?.subtitle || `Fase ${currentPhaseId}`} />
      </div>

      {/* --- CONTROL DE ALUMNOS PRESENCIALES EN VIVO (CON BOTONES FASE ANTERIOR, SIGUIENTE Y REINICIO) --- */}
      <div className="glass-panel" style={{ marginBottom: '40px', background: 'linear-gradient(160deg, #1a1505 0%, #080808 100%)', border: '1.5px solid #FFDF73' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#FFDF73', fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={24} /> Control de Alumnos Presenciales en Vivo ({students.length})
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#a0a0a0', fontSize: '0.9rem' }}>
              Ingresa, edita o elimina alumnos, envía credenciales por WhatsApp y controla las fases del curso.
            </p>
          </div>

          {/* BOTONES DE FASE ANTERIOR, SIGUIENTE FASE Y REINICION DEL CURSO */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={fetchStudents} className="gold-btn-outline" style={{ fontSize: '0.85rem' }}>
              <RefreshCw size={14} /> Actualizar Lista
            </button>

            <button
              onClick={handlePrevPhase}
              disabled={currentPhaseId <= 1}
              className="gold-btn-outline"
              style={{
                fontSize: '0.85rem',
                opacity: currentPhaseId <= 1 ? 0.4 : 1,
                cursor: currentPhaseId <= 1 ? 'not-allowed' : 'pointer'
              }}
              title="Regresar a la fase anterior"
            >
              <ArrowLeft size={14} /> Fase Anterior
            </button>

            <button
              onClick={handleNextPhase}
              disabled={currentPhaseId >= maxPhases}
              className="green-btn"
              style={{
                padding: '12px 20px',
                fontSize: '0.95rem',
                opacity: currentPhaseId >= maxPhases ? 0.5 : 1,
                cursor: currentPhaseId >= maxPhases ? 'not-allowed' : 'pointer'
              }}
            >
              🚀 Aprobar & Avanzar a Fase {currentPhaseId + 1}
            </button>

            <button
              onClick={handleResetCourse}
              style={{
                background: 'rgba(255, 152, 0, 0.15)',
                color: '#ffb74d',
                border: '1px solid #ffb74d',
                borderRadius: '30px',
                padding: '10px 18px',
                cursor: 'pointer',
                fontWeight: '900',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Reiniciar el curso a la Fase 1 para una nueva clase"
            >
              <RotateCcw size={15} /> Reiniciar Curso (Nueva Clase)
            </button>
          </div>
        </div>

        {/* --- FORMULARIO DE INGRESO MANUAL DE ALUMNO(A) --- */}
        <form onSubmit={handleAddStudent} style={{
          background: 'rgba(0, 0, 0, 0.75)',
          border: '1px solid rgba(212, 175, 55, 0.45)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'flex-end'
        }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', color: '#FFDF73', fontSize: '0.85rem', fontWeight: '800', marginBottom: '6px' }}>
              👤 Nombre del Alumno(a):
            </label>
            <input
              type="text"
              placeholder="Ej. Camila Torres"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: '#09090c',
                border: '1.5px solid #D4AF37',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ flex: '1 1 220px' }}>
            <label style={{ display: 'block', color: '#FFDF73', fontSize: '0.85rem', fontWeight: '800', marginBottom: '6px' }}>
              ✉️ Correo Electrónico (Email):
            </label>
            <input
              type="email"
              placeholder="Ej. camila@gmail.com"
              value={newStudentEmail}
              onChange={(e) => setNewStudentEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: '#09090c',
                border: '1.5px solid #D4AF37',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', color: '#FFDF73', fontSize: '0.85rem', fontWeight: '800', marginBottom: '6px' }}>
              📱 WhatsApp (con lada):
            </label>
            <input
              type="text"
              placeholder="Ej. +52 5511112233"
              value={newStudentWhatsapp}
              onChange={(e) => setNewStudentWhatsapp(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: '#09090c',
                border: '1.5px solid #D4AF37',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isAddingStudent}
              className="gold-btn"
              style={{ padding: '12px 24px', fontSize: '0.95rem', whiteSpace: 'nowrap' }}
            >
              <UserPlus size={18} /> {isAddingStudent ? 'Registrando...' : '➕ Registrar Alumno(a)'}
            </button>
          </div>
        </form>

        {/* Student list table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ffffff', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.3)', textAlign: 'left', color: '#FFDF73' }}>
                <th style={{ padding: '12px' }}>Alumno Presencial</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>WhatsApp</th>
                <th style={{ padding: '12px' }}>Fase Actual</th>
                <th style={{ padding: '12px' }}>Estado Examen (20 Preg)</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Acciones & Credenciales</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st) => (
                <tr key={st.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{st.name}</td>
                  <td style={{ padding: '12px', color: '#aaa', fontSize: '0.85rem' }}>{st.email || 'Sin email'}</td>
                  <td style={{ padding: '12px', color: '#aaa' }}>{st.whatsapp || '+52 ...'}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge-gold">Fase {st.currentPhase || 1}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {st.examSubmitted ? (
                      <span style={{ color: '#81c784', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                        <CheckCircle2 size={16} /> Entregado (Esperando Pase)
                      </span>
                    ) : (
                      <span style={{ color: '#ffb74d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={16} /> En estudio / Pendiente
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <button
                        onClick={() => setEditingStudent({ id: st.id, name: st.name, email: st.email || '', whatsapp: st.whatsapp || '' })}
                        className="gold-btn-outline"
                        style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                        title="Editar datos del alumno"
                      >
                        <Edit size={14} /> Editar
                      </button>

                      <button
                        onClick={() => handleDeleteStudent(st.id, st.name)}
                        style={{
                          background: 'rgba(244, 67, 54, 0.15)',
                          color: '#ff5252',
                          border: '1px solid #ff5252',
                          borderRadius: '30px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          fontWeight: '800',
                          fontSize: '0.8rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Eliminar alumno de la lista"
                      >
                        <Trash2 size={14} /> Eliminar
                      </button>

                      <button
                        onClick={() => handleSendCredentials(st.id, st.name, st.whatsapp || '+525500000000', st.email)}
                        className="gold-btn-outline"
                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      >
                        <Send size={12} /> WhatsApp
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL PARA EDITAR DATOS DEL ALUMNO --- */}
      {editingStudent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          zIndex: 99999,
          padding: '16px'
        }}>
          <div className="glass-panel" style={{
            background: 'linear-gradient(160deg, #181404 0%, #08080c 100%)',
            border: '2px solid #FFDF73',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '520px',
            padding: '30px',
            boxShadow: '0 25px 70px rgba(212, 175, 55, 0.4)',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#FFDF73', fontSize: '1.4rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit size={20} /> Editar Alumno(a) Presencial
              </h3>
              <button 
                onClick={() => setEditingStudent(null)}
                style={{ background: 'none', border: 0, color: '#aaa', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateStudent}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#FFDF73', fontSize: '0.85rem', fontWeight: '800', marginBottom: '6px' }}>
                  👤 Nombre Completo:
                </label>
                <input
                  type="text"
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#09090c',
                    border: '1.5px solid #D4AF37',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#FFDF73', fontSize: '0.85rem', fontWeight: '800', marginBottom: '6px' }}>
                  ✉️ Correo Electrónico:
                </label>
                <input
                  type="email"
                  value={editingStudent.email}
                  onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#09090c',
                    border: '1.5px solid #D4AF37',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#FFDF73', fontSize: '0.85rem', fontWeight: '800', marginBottom: '6px' }}>
                  📱 WhatsApp (con lada):
                </label>
                <input
                  type="text"
                  value={editingStudent.whatsapp}
                  onChange={(e) => setEditingStudent({ ...editingStudent, whatsapp: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#09090c',
                    border: '1.5px solid #D4AF37',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="gold-btn-outline"
                  style={{ padding: '10px 20px' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="gold-btn"
                  style={{ padding: '10px 24px' }}
                >
                  <Save size={16} /> {isSavingEdit ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PANEL DE EVALUACIÓN / EXAMEN DE LA FASE AL FINAL DE LA PÁGINA --- */}
      <div className="glass-panel" style={{
        textAlign: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 105%)',
        border: '1px solid #FFDF73',
        marginBottom: '40px'
      }}>
        <Award size={48} style={{ color: '#FFDF73', marginBottom: '12px' }} />
        <h3 style={{ margin: '0 0 10px 0', color: '#FFDF73', fontSize: '1.6rem', fontWeight: '800' }}>
          Evaluación de la Fase {currentPhaseId} (20 Preguntas)
        </h3>
        <p style={{ color: '#a0a0a0', maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
          Prueba o proyecta el cuestionario de evaluación interactivo de 20 preguntas correspondiente a esta fase o consulta la guía con respuestas.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowTakeExamModal(true)}
            className="gold-btn"
            style={{ padding: '16px 36px', fontSize: '1.1rem' }}
          >
            ✍️ Rendir / Probar Examen
          </button>

          <button
            onClick={() => setShowExamGuideModal(true)}
            className="gold-btn-outline"
            style={{ padding: '16px 32px', fontSize: '1.1rem' }}
          >
            <BookOpen size={20} /> 📖 Guía con Respuestas
          </button>
        </div>
      </div>

      {/* --- MODAL PARA RENDIR EL EXAMEN INTERACTIVO --- */}
      {showTakeExamModal && (
        <ExamModal
          phaseId={currentPhaseId}
          phaseTitle={currentPhaseObj?.subtitle || `Fase ${currentPhaseId}`}
          onClose={() => setShowTakeExamModal(false)}
          onSubmitExam={handleSubmitTeacherExam}
          isSubmitting={isSubmittingExam}
        />
      )}

      {/* --- MODAL GUÍA DE EXÁMENES CON RESPUESTAS CORRECTAS PARA LA MAESTRA --- */}
      {showExamGuideModal && (
        <TeacherExamGuideModal
          initialPhase={currentPhaseId}
          onClose={() => setShowExamGuideModal(false)}
        />
      )}

    </div>
  );
}

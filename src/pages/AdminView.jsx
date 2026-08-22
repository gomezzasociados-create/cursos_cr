import React, { useState, useEffect } from 'react';
import { 
  BookOpen, PlusCircle, Trash2, Edit3, Save, Video, Plus, DollarSign, 
  Users, RefreshCw, CheckCircle, Tv, MessageSquare, AlertCircle, FileText, Image as ImageIcon, Tag, UserCheck,
  Library, FolderPlus, Code, Copy, Sparkles, X, FileCode, Check, Eye
} from 'lucide-react';

export default function AdminView({ state, onRefreshState }) {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor', 'courses', 'welcome', 'sales', 'users'
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState(state?.courses || []);
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'c_masaje_1');
  const [selectedPhaseId, setSelectedPhaseId] = useState(1);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Forms State
  const [editPhaseForm, setEditPhaseForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    theoryHtml: ''
  });

  const [newCourseForm, setNewCourseForm] = useState({
    title: '',
    category: 'Capacitación Profesional',
    price: 99,
    originalPrice: 199,
    badge: 'NUEVO',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
    welcomeTeacherVideoUrl: 'https://www.youtube.com/watch?v=3lB9dP4HRPA'
  });

  const [showNewCourseModal, setShowNewCourseModal] = useState(false);

  // Edit Course Modal State
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [editCourseForm, setEditCourseForm] = useState({
    id: '',
    title: '',
    category: '',
    price: 0,
    originalPrice: 0,
    badge: '',
    description: '',
    imageUrl: ''
  });

  // Edit User / Teacher State
  const [teacherNameInput, setTeacherNameInput] = useState(state?.teacherName || "Maestra Elena Gomez");
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserForm, setEditUserForm] = useState({
    id: '',
    name: '',
    email: '',
    role: ''
  });

  const [welcomeForm, setWelcomeForm] = useState({
    welcomeTeacherVideoUrl: '',
    welcomeStudentsMessage: '',
    welcomeStudentsVideoUrl: ''
  });

  const [newVideoForm, setNewVideoForm] = useState({
    title: '',
    url: '',
    duration: '10:00',
    provider: 'YouTube CDN'
  });

  const [showNewPhaseModal, setShowNewPhaseModal] = useState(false);
  const [newPhaseData, setNewPhaseData] = useState({
    title: '',
    subtitle: '',
    description: ''
  });

  // BIBLIOTECA DE CÓDIGO HTML DE FASES STATE
  const [htmlLibrary, setHtmlLibrary] = useState([]);
  const [showHtmlLibraryModal, setShowHtmlLibraryModal] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  useEffect(() => {
    fetchAdminData();
    fetchHtmlLibrary();
  }, []);

  useEffect(() => {
    if (state && state.courses && state.courses.length > 0) {
      setCourses(state.courses);
    }
    if (state && state.teacherName) {
      setTeacherNameInput(state.teacherName);
    }
  }, [state]);

  const currentCourseObj = courses.find(c => c.id === selectedCourseId) || courses[0];
  const activeCoursePhases = currentCourseObj?.phases || [];
  const currentSelectedPhase = activeCoursePhases.find(p => p.id === selectedPhaseId) || activeCoursePhases[0];

  useEffect(() => {
    if (currentSelectedPhase) {
      setEditPhaseForm({
        title: currentSelectedPhase.title || '',
        subtitle: currentSelectedPhase.subtitle || '',
        description: currentSelectedPhase.description || '',
        theoryHtml: currentSelectedPhase.theoryHtml || ''
      });
    }
  }, [selectedCourseId, selectedPhaseId, courses]);

  useEffect(() => {
    if (currentCourseObj) {
      setWelcomeForm({
        welcomeTeacherVideoUrl: currentCourseObj.welcomeTeacherVideoUrl || '',
        welcomeStudentsMessage: currentCourseObj.welcomeStudentsMessage || '',
        welcomeStudentsVideoUrl: currentCourseObj.welcomeStudentsVideoUrl || ''
      });
    }
  }, [selectedCourseId, courses]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [resSales, resUsers, resState, resCourses] = await Promise.all([
        fetch('/api/admin/sales'),
        fetch('/api/admin/users'),
        fetch('/api/state'),
        fetch('/api/courses')
      ]);

      const salesData = await resSales.json();
      const usersData = await resUsers.json();
      const stateData = await resState.json();
      const coursesData = await resCourses.json();

      setSales(salesData || []);
      setUsers(usersData || []);
      if (stateData && stateData.teacherName) {
        setTeacherNameInput(stateData.teacherName);
      }
      if (coursesData && coursesData.length > 0) {
        setCourses(coursesData);
      } else if (stateData.courses) {
        setCourses(stateData.courses);
      }
    } catch (err) {
      console.error("Error al obtener datos de administrador:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHtmlLibrary = async () => {
    try {
      const res = await fetch('/api/admin/html-library');
      if (res.ok) {
        const data = await res.json();
        setHtmlLibrary(data || []);
      }
    } catch (err) {
      console.error("Error al cargar biblioteca HTML:", err);
    }
  };

  const handleSaveToLibrary = async (e) => {
    e.preventDefault();
    if (!editPhaseForm.theoryHtml || !editPhaseForm.theoryHtml.trim()) {
      alert("No hay código HTML para guardar. Escribe o pega código en el editor primero.");
      return;
    }

    if (!templateTitle.trim()) {
      alert("Ingresa un título para identificar la plantilla en la biblioteca.");
      return;
    }

    try {
      setIsSavingTemplate(true);
      const res = await fetch('/api/admin/html-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: templateTitle.trim(),
          description: templateDesc.trim() || `Plantilla creada para Fase ${selectedPhaseId}`,
          htmlCode: editPhaseForm.theoryHtml
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: `Plantilla '${templateTitle}' guardada en la Biblioteca de HTML con éxito.` });
        setShowSaveTemplateModal(false);
        setTemplateTitle('');
        setTemplateDesc('');
        fetchHtmlLibrary();
      } else {
        alert(data.error || "Error al guardar plantilla en la biblioteca");
      }
    } catch (err) {
      alert("Error de conexión al guardar en la biblioteca");
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleLoadTemplateToPhase = (template) => {
    if (!template || !template.htmlCode) return;
    if (editPhaseForm.theoryHtml && editPhaseForm.theoryHtml.trim()) {
      if (!confirm(`¿Deseas reemplazar el código HTML actual de la Fase ${selectedPhaseId} con la plantilla '${template.title}'?`)) {
        return;
      }
    }

    setEditPhaseForm(prev => ({
      ...prev,
      theoryHtml: template.htmlCode
    }));

    setMsg({
      type: 'success',
      text: `📥 Plantilla '${template.title}' cargada exitosamente en la Fase ${selectedPhaseId}. Recuerda presionar 'Guardar Cambios de la Fase' para aplicarla.`
    });

    setShowHtmlLibraryModal(false);
  };

  const handleDeleteTemplate = async (templateId, title) => {
    if (!confirm(`¿Estás seguro(a) de eliminar permanentemente la plantilla '${title}' de la biblioteca?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/html-library/${templateId}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMsg({ type: 'success', text: `Plantilla '${title}' eliminada de la biblioteca.` });
        fetchHtmlLibrary();
      } else {
        alert(data.error || "Error al eliminar plantilla");
      }
    } catch (err) {
      alert("Error de conexión al eliminar plantilla");
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setMsg(null);

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourseForm)
      });

      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Curso '${data.course.title}' creado exitosamente.` });
        setShowNewCourseModal(false);
        setNewCourseForm({
          title: '',
          category: 'Capacitación Profesional',
          price: 99,
          originalPrice: 199,
          badge: 'NUEVO',
          description: '',
          imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
          welcomeTeacherVideoUrl: 'https://www.youtube.com/watch?v=3lB9dP4HRPA'
        });
        if (onRefreshState) onRefreshState();
        fetchAdminData();
      } else {
        setMsg({ type: 'error', text: data.error || "Error al crear curso" });
      }
    } catch (err) {
      setMsg({ type: 'error', text: "Error de conexión al crear curso" });
    }
  };

  const handleOpenEditCourse = (course) => {
    if (!course) return;
    setEditCourseForm({
      id: course.id,
      title: course.title || '',
      category: course.category || '',
      price: course.price || 0,
      originalPrice: course.originalPrice || 0,
      badge: course.badge || '',
      description: course.description || '',
      imageUrl: course.imageUrl || ''
    });
    setShowEditCourseModal(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setMsg(null);

    try {
      const res = await fetch(`/api/admin/courses/${editCourseForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCourseForm)
      });

      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Curso '${data.course.title}' actualizado exitosamente.` });
        setShowEditCourseModal(false);
        if (onRefreshState) onRefreshState();
        fetchAdminData();
      } else {
        setMsg({ type: 'error', text: data.error || "Error al actualizar curso" });
      }
    } catch (err) {
      setMsg({ type: 'error', text: "Error de conexión al actualizar curso" });
    }
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!confirm(`¿Estás seguro(a) de eliminar permanentemente el curso '${courseTitle}'?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Curso '${courseTitle}' eliminado.` });
        if (onRefreshState) onRefreshState();
        fetchAdminData();
      } else {
        setMsg({ type: 'error', text: data.error || "Error al eliminar curso" });
      }
    } catch (err) {
      setMsg({ type: 'error', text: "Error de conexión al eliminar curso" });
    }
  };

  const handleAddPhase = async (e) => {
    e.preventDefault();
    if (!newPhaseData.title.trim()) {
      alert("El título de la fase es obligatorio");
      return;
    }

    try {
      const res = await fetch(`/api/admin/courses/${selectedCourseId}/phases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPhaseData)
      });

      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Fase '${data.phase.title}' agregada exitosamente.` });
        setShowNewPhaseModal(false);
        setNewPhaseData({ title: '', subtitle: '', description: '' });
        if (onRefreshState) onRefreshState();
        fetchAdminData();
      } else {
        setMsg({ type: 'error', text: data.error || "Error al crear la fase" });
      }
    } catch (err) {
      setMsg({ type: 'error', text: "Error de conexión al crear fase" });
    }
  };

  const handleDeletePhase = async (phaseId) => {
    if (!confirm(`¿Estás seguro(a) de eliminar la Fase ${phaseId}?`)) return;

    try {
      const res = await fetch(`/api/admin/courses/${selectedCourseId}/phases/${phaseId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Fase ${phaseId} eliminada.` });
        setSelectedPhaseId(1);
        if (onRefreshState) onRefreshState();
        fetchAdminData();
      } else {
        setMsg({ type: 'error', text: data.error || "Error al eliminar fase" });
      }
    } catch (err) {
      setMsg({ type: 'error', text: "Error de conexión al eliminar fase" });
    }
  };

  const handleSavePhase = async (e) => {
    e.preventDefault();
    setMsg(null);

    try {
      const res = await fetch(`/api/admin/courses/${selectedCourseId}/phases/${selectedPhaseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPhaseForm)
      });

      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Fase ${selectedPhaseId} guardada con éxito. Actualizado en vivo.` });
        if (onRefreshState) onRefreshState();
        fetchAdminData();
      } else {
        setMsg({ type: 'error', text: data.error || "Error al actualizar fase" });
      }
    } catch (err) {
      setMsg({ type: 'error', text: "Error de conexión al actualizar fase" });
    }
  };

  const handleSaveWelcome = async (e) => {
    e.preventDefault();
    setMsg(null);

    try {
      const res = await fetch(`/api/admin/courses/${selectedCourseId}/welcome`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(welcomeForm)
      });

      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Videos e instrucciones de bienvenida guardados con éxito.` });
        if (onRefreshState) onRefreshState();
        fetchAdminData();
      } else {
        setMsg({ type: 'error', text: data.error || "Error al guardar bienvenida" });
      }
    } catch (err) {
      setMsg({ type: 'error', text: "Error de conexión al guardar bienvenida" });
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!newVideoForm.title || !newVideoForm.url) {
      alert("Por favor completa el título y la URL del video.");
      return;
    }

    try {
      const res = await fetch(`/api/admin/courses/${selectedCourseId}/phases/${selectedPhaseId}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideoForm)
      });

      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Video '${newVideoForm.title}' agregado exitosamente a la Fase ${selectedPhaseId}.` });
        setNewVideoForm({ title: '', url: '', duration: '10:00', provider: 'YouTube CDN' });
        if (onRefreshState) onRefreshState();
        fetchAdminData();
      } else {
        setMsg({ type: 'error', text: data.error || "Error al agregar video" });
      }
    } catch (err) {
      setMsg({ type: 'error', text: "Error de conexión al agregar video" });
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!confirm("¿Deseas eliminar este video tutorial de la fase?")) return;

    try {
      const res = await fetch(`/api/admin/courses/${selectedCourseId}/phases/${selectedPhaseId}/videos/${videoId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: "Video eliminado de la fase." });
        if (onRefreshState) onRefreshState();
        fetchAdminData();
      } else {
        setMsg({ type: 'error', text: data.error || "Error al eliminar video" });
      }
    } catch (err) {
      setMsg({ type: 'error', text: "Error de conexión al eliminar video" });
    }
  };

  const handleOpenEditUser = (u) => {
    setEditUserForm({
      id: u.id,
      name: u.name || '',
      email: u.email || '',
      role: u.role || 'Alumno Presencial'
    });
    setShowEditUserModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/users/${editUserForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUserForm)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Usuario '${editUserForm.name}' actualizado.` });
        setShowEditUserModal(false);
        fetchAdminData();
      } else {
        alert(data.error || "Error al actualizar usuario");
      }
    } catch (err) {
      alert("Error de conexión al actualizar usuario");
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!confirm(`¿Estás seguro de eliminar al usuario '${name}'?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Usuario '${name}' eliminado.` });
        fetchAdminData();
      } else {
        alert(data.error || "Error al eliminar usuario");
      }
    } catch (err) {
      alert("Error de conexión al eliminar usuario");
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Header Panel Administrador */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <span className="badge-gold">PANEL DE CONTROL GENERAL</span>
          <h2 style={{ margin: '8px 0 4px 0', color: '#FFDF73', fontSize: '2rem', fontWeight: '900' }}>
            ⚙️ Administración Global de la Plataforma
          </h2>
          <p style={{ margin: 0, color: '#a0a0a0', fontSize: '1rem' }}>
            Gestiona cursos, edita el código HTML de las fases, organiza la biblioteca de plantillas y administra ventas y usuarios.
          </p>
        </div>

        <button onClick={fetchAdminData} className="gold-btn-outline" style={{ fontSize: '0.85rem' }}>
          <RefreshCw size={14} /> Refrescar Datos
        </button>
      </div>

      {/* Navegación por Pestañas del Administrador */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('editor')}
          className={activeTab === 'editor' ? 'gold-btn' : 'gold-btn-outline'}
          style={{ padding: '12px 24px', fontSize: '0.9rem' }}
        >
          <BookOpen size={16} /> Mapeo de Fases, HTML & Videos
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={activeTab === 'courses' ? 'gold-btn' : 'gold-btn-outline'}
          style={{ padding: '12px 24px', fontSize: '0.9rem' }}
        >
          <PlusCircle size={16} /> Catálogo de Cursos ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('welcome')}
          className={activeTab === 'welcome' ? 'gold-btn' : 'gold-btn-outline'}
          style={{ padding: '12px 24px', fontSize: '0.9rem' }}
        >
          <Tv size={16} /> Videos & Bienvenida del Maestro
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={activeTab === 'sales' ? 'gold-btn' : 'gold-btn-outline'}
          style={{ padding: '12px 24px', fontSize: '0.9rem' }}
        >
          <DollarSign size={16} /> Registro de Ventas ({sales.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={activeTab === 'users' ? 'gold-btn' : 'gold-btn-outline'}
          style={{ padding: '12px 24px', fontSize: '0.9rem' }}
        >
          <Users size={16} /> Usuarios ({users.length})
        </button>
      </div>

      {msg && (
        <div style={{
          padding: '12px 20px',
          borderRadius: '12px',
          marginBottom: '20px',
          background: msg.type === 'error' ? 'rgba(244,67,54,0.15)' : 'rgba(76,175,80,0.15)',
          border: msg.type === 'error' ? '1px solid #f44336' : '1px solid #4caf50',
          color: msg.type === 'error' ? '#ef5350' : '#81c784',
          fontWeight: 'bold',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} style={{ background: 'none', border: 0, color: 'inherit', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* --- TAB: GESTOR DE FASES, HTML, BIBLIOTECA Y VIDEOS --- */}
      {activeTab === 'editor' && (
        <div>
          {/* Active course selector & Rename Button */}
          <div style={{
            marginBottom: '24px',
            background: 'linear-gradient(160deg, #1c1605 0%, #08080a 100%)',
            padding: '20px 24px',
            borderRadius: '20px',
            border: '1px solid #D4AF37',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#FFDF73', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>
                ✦ Curso Activo Seleccionado para Editar:
              </span>
              <h3 style={{ margin: '4px 0 0 0', color: '#ffffff', fontSize: '1.5rem', fontWeight: '900' }}>
                {currentCourseObj?.title}
              </h3>
            </div>
            
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleOpenEditCourse(currentCourseObj)}
                className="gold-btn"
                style={{ fontSize: '0.9rem', padding: '10px 20px' }}
                title="Editar Nombre del Curso"
              >
                <Edit3 size={16} /> ✏️ Editar Nombre del Curso
              </button>

              <select
                value={selectedCourseId}
                onChange={e => {
                  setSelectedCourseId(e.target.value);
                  setSelectedPhaseId(1);
                }}
                style={{
                  padding: '10px 18px',
                  borderRadius: '30px',
                  background: '#030303',
                  border: '1px solid #FFDF73',
                  color: '#FFDF73',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  outline: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(212,175,55,0.2)'
                }}
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ color: '#FFDF73', fontWeight: '900', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Fases del Curso:
              </span>
              {activeCoursePhases.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPhaseId(p.id)}
                  className={selectedPhaseId === p.id ? 'gold-btn' : 'gold-btn-outline'}
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  Fase {p.id}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNewPhaseModal(true)}
              className="green-btn"
              style={{ padding: '10px 20px', fontSize: '0.88rem' }}
            >
              <PlusCircle size={16} /> + Agregar Nueva Fase
            </button>
          </div>

          {currentSelectedPhase && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
              
              {/* Formulario Edición de Teoría HTML de la Fase + BIBLIOTECA DE HTML */}
              <div className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <h4 style={{ margin: 0, color: '#FFDF73', fontSize: '1.2rem', fontWeight: '800' }}>
                    📝 Teoría & HTML • Fase {currentSelectedPhase.id}
                  </h4>
                  {activeCoursePhases.length > 1 && (
                    <button
                      onClick={() => handleDeletePhase(currentSelectedPhase.id)}
                      style={{ background: 'none', border: '1px solid #ef5350', color: '#ef5350', borderRadius: '14px', padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: '700' }}
                    >
                      Eliminar Fase
                    </button>
                  )}
                </div>

                {/* BOTONES DE LA BIBLIOTECA DE CÓDIGO HTML */}
                <div style={{
                  background: 'rgba(212, 175, 55, 0.08)',
                  border: '1.5px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: '16px',
                  padding: '14px',
                  marginBottom: '16px',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <strong style={{ color: '#FFDF73', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Library size={18} /> Biblioteca de Código HTML
                    </strong>
                    <span style={{ color: '#aaa', fontSize: '0.78rem', display: 'block' }}>
                      Guarda diseños HTML como plantillas o carga código de la biblioteca directamente en esta fase.
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setShowHtmlLibraryModal(true)}
                      className="gold-btn"
                      style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                      title="Ver plantillas guardadas en la biblioteca"
                    >
                      <Library size={15} /> 📚 Biblioteca ({htmlLibrary.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!editPhaseForm.theoryHtml || !editPhaseForm.theoryHtml.trim()) {
                          alert("Escribe o pega código HTML en el editor antes de guardarlo en la biblioteca.");
                          return;
                        }
                        setTemplateTitle(`Diseño HTML - Fase ${currentSelectedPhase.id}`);
                        setTemplateDesc(`Plantilla creada para ${currentSelectedPhase.subtitle || 'Fase ' + currentSelectedPhase.id}`);
                        setShowSaveTemplateModal(true);
                      }}
                      className="gold-btn-outline"
                      style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                      title="Guardar el HTML actual como una plantilla reutilizable"
                    >
                      <FolderPlus size={15} /> 💾 Guardar como Plantilla
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSavePhase} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0a0a0', marginBottom: '4px' }}>Título de la Fase</label>
                    <input
                      type="text"
                      value={editPhaseForm.title}
                      onChange={e => setEditPhaseForm({ ...editPhaseForm, title: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#050505', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0a0a0', marginBottom: '4px' }}>Subtítulo de la Fase</label>
                    <input
                      type="text"
                      value={editPhaseForm.subtitle}
                      onChange={e => setEditPhaseForm({ ...editPhaseForm, subtitle: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#050505', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0a0a0', marginBottom: '4px' }}>Descripción Corta</label>
                    <input
                      type="text"
                      value={editPhaseForm.description}
                      onChange={e => setEditPhaseForm({ ...editPhaseForm, description: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#050505', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <label style={{ fontSize: '0.8rem', color: '#a0a0a0' }}>Código HTML de la Teoría</label>
                      <span style={{ fontSize: '0.75rem', color: '#81c784' }}>Sincroniza Live</span>
                    </div>
                    <textarea
                      rows={14}
                      value={editPhaseForm.theoryHtml}
                      onChange={e => setEditPhaseForm({ ...editPhaseForm, theoryHtml: e.target.value })}
                      placeholder="Pega o edita el código HTML puro con estilos CSS aquí..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        background: '#030303',
                        border: '1px solid rgba(212,175,55,0.4)',
                        color: '#81c784',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        lineHeight: 1.4
                      }}
                    />
                  </div>

                  {/* Vista Previa en Vivo del HTML Puro Renderizado */}
                  {editPhaseForm.theoryHtml && (
                    <div style={{ marginTop: '12px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#FFDF73', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                        👁️ Vista Previa en Vivo del HTML Renderizado Puro con CSS:
                      </span>
                      <div 
                        style={{
                          background: '#020202',
                          border: '1px solid #D4AF37',
                          borderRadius: '14px',
                          padding: '16px',
                          maxHeight: '350px',
                          overflowY: 'auto'
                        }}
                        dangerouslySetInnerHTML={{ __html: editPhaseForm.theoryHtml }}
                      />
                    </div>
                  )}

                  <button type="submit" className="gold-btn" style={{ padding: '14px', fontSize: '1rem', marginTop: '10px' }}>
                    <Save size={18} /> Guardar Cambios de la Fase (Live)
                  </button>
                </form>
              </div>

              {/* Gestión de URLs de Videos de la Fase */}
              <div className="glass-panel">
                <h4 style={{ margin: '0 0 16px 0', color: '#FFDF73', fontSize: '1.2rem', fontWeight: '800' }}>
                  🎥 Reproductores & URLs de Videos • Fase {currentSelectedPhase.id}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  {currentSelectedPhase.videos?.map((vid, idx) => (
                    <div key={vid.id || idx} style={{ background: '#050505', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>{vid.title}</strong>
                        <span style={{ color: '#a0a0a0', fontSize: '0.75rem' }}>{vid.url}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteVideo(vid.id)}
                        style={{ background: 'none', border: 0, color: '#ef5350', cursor: 'pointer' }}
                        title="Eliminar video"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddVideo} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#FFDF73', fontWeight: 'bold' }}>+ Agregar Nuevo Video Tutorial a esta Fase:</span>
                  <input
                    type="text"
                    required
                    placeholder="Título del video"
                    value={newVideoForm.title}
                    onChange={e => setNewVideoForm({ ...newVideoForm, title: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', background: '#050505', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="URL de YouTube"
                    value={newVideoForm.url}
                    onChange={e => setNewVideoForm({ ...newVideoForm, url: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', background: '#050505', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }}
                  />
                  <button type="submit" className="gold-btn-outline" style={{ padding: '10px', fontSize: '0.9rem' }}>
                    <Plus size={16} /> Guardar Video en la Fase
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>
      )}

      {/* --- TAB: CATÁLOGO DE CURSOS --- */}
      {activeTab === 'courses' && (
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#FFDF73', fontSize: '1.4rem', fontWeight: '800' }}>
              📚 Catálogo Global de Cursos
            </h3>
            <button onClick={() => setShowNewCourseModal(true)} className="gold-btn" style={{ fontSize: '0.9rem' }}>
              <PlusCircle size={16} /> + Crear Nuevo Curso
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {courses.map(c => (
              <div key={c.id} style={{ background: '#050505', border: '1px solid #D4AF37', borderRadius: '16px', padding: '16px' }}>
                <img src={c.imageUrl} alt={c.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px', marginBottom: '12px' }} />
                <h4 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '1.1rem' }}>{c.title}</h4>
                <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0 0 12px 0' }}>{c.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#FFDF73', fontWeight: 'bold' }}>${c.price} USD</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => handleOpenEditCourse(c)} className="gold-btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      <Edit3 size={14} /> Editar
                    </button>
                    {courses.length > 1 && (
                      <button onClick={() => handleDeleteCourse(c.id, c.title)} style={{ background: 'none', border: '1px solid #ef5350', color: '#ef5350', borderRadius: '20px', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB: VIDEOS DE BIENVENIDA --- */}
      {activeTab === 'welcome' && (
        <div className="glass-panel" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#FFDF73', fontSize: '1.4rem', fontWeight: '800' }}>
            🎥 Configuración de Videos de Bienvenida ({currentCourseObj?.title})
          </h3>
          <form onSubmit={handleSaveWelcome} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: '#FFDF73', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
                URL del Video de Bienvenida para la Maestra (/teacher):
              </label>
              <input
                type="text"
                value={welcomeForm.welcomeTeacherVideoUrl}
                onChange={e => setWelcomeForm({ ...welcomeForm, welcomeTeacherVideoUrl: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#050505', border: '1px solid #D4AF37', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#FFDF73', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
                Mensaje de Bienvenida para Alumnos Presenciales:
              </label>
              <input
                type="text"
                value={welcomeForm.welcomeStudentsMessage}
                onChange={e => setWelcomeForm({ ...welcomeForm, welcomeStudentsMessage: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#050505', border: '1px solid #D4AF37', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#FFDF73', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
                URL del Video de Bienvenida para Alumnos Presenciales (/student):
              </label>
              <input
                type="text"
                value={welcomeForm.welcomeStudentsVideoUrl}
                onChange={e => setWelcomeForm({ ...welcomeForm, welcomeStudentsVideoUrl: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#050505', border: '1px solid #D4AF37', color: '#fff' }}
              />
            </div>
            <button type="submit" className="gold-btn" style={{ padding: '14px', fontSize: '1rem', marginTop: '10px' }}>
              <Save size={18} /> Guardar Videos de Bienvenida
            </button>
          </form>
        </div>
      )}

      {/* --- TAB: VENTAS --- */}
      {activeTab === 'sales' && (
        <div className="glass-panel">
          <h3 style={{ margin: '0 0 16px 0', color: '#FFDF73', fontSize: '1.4rem', fontWeight: '800' }}>
            💳 Historial de Ventas E-Commerce ({sales.length})
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #D4AF37', color: '#FFDF73', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Cliente</th>
                  <th style={{ padding: '12px' }}>Correo</th>
                  <th style={{ padding: '12px' }}>Curso Adquirido</th>
                  <th style={{ padding: '12px' }}>Monto</th>
                  <th style={{ padding: '12px' }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{s.name}</td>
                    <td style={{ padding: '12px', color: '#aaa' }}>{s.email}</td>
                    <td style={{ padding: '12px' }}>{s.courseTitle}</td>
                    <td style={{ padding: '12px', color: '#81c784', fontWeight: 'bold' }}>${s.amount} USD</td>
                    <td style={{ padding: '12px', color: '#aaa', fontSize: '0.8rem' }}>{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB: USUARIOS --- */}
      {activeTab === 'users' && (
        <div className="glass-panel">
          <h3 style={{ margin: '0 0 16px 0', color: '#FFDF73', fontSize: '1.4rem', fontWeight: '800' }}>
            👥 Usuarios Registrados ({users.length})
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #D4AF37', color: '#FFDF73', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Nombre</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Rol</th>
                  <th style={{ padding: '12px' }}>WhatsApp</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{u.name}</td>
                    <td style={{ padding: '12px', color: '#aaa' }}>{u.email}</td>
                    <td style={{ padding: '12px' }}><span className="badge-gold">{u.role}</span></td>
                    <td style={{ padding: '12px', color: '#aaa' }}>{u.whatsapp || 'N/A'}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button onClick={() => handleOpenEditUser(u)} className="gold-btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem', marginRight: '6px' }}>
                        <Edit3 size={12} /> Editar
                      </button>
                      <button onClick={() => handleDeleteUser(u.id, u.name)} style={{ background: 'none', border: '1px solid #ef5350', color: '#ef5350', borderRadius: '14px', padding: '4px 10px', fontSize: '0.78rem', cursor: 'pointer' }}>
                        <Trash2 size={12} /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL 1: BIBLIOTECA DE CÓDIGO HTML --- */}
      {showHtmlLibraryModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px'
        }}>
          <div className="glass-panel" style={{
            background: 'linear-gradient(160deg, #181404 0%, #08080c 100%)',
            border: '2px solid #FFDF73', borderRadius: '24px', width: '100%', maxWidth: '850px',
            maxHeight: '85vh', overflowY: 'auto', padding: '30px', boxShadow: '0 25px 70px rgba(212,175,55,0.4)', color: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(212,175,55,0.3)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#FFDF73', fontSize: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Library size={24} /> 📚 Biblioteca de Plantillas HTML de Fases ({htmlLibrary.length})
              </h3>
              <button onClick={() => setShowHtmlLibraryModal(false)} style={{ background: 'none', border: 0, color: '#aaa', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px' }}>
              Selecciona cualquier plantilla guardada para cargar su código directamente en la **Fase {selectedPhaseId}** del curso activo.
            </p>

            {htmlLibrary.length === 0 ? (
              <div style={{ textTransform: 'center', padding: '40px', color: '#a0a0a0', border: '1px dashed #D4AF37', borderRadius: '16px' }}>
                <Code size={40} style={{ color: '#FFDF73', marginBottom: '10px' }} />
                <p>No tienes plantillas guardadas en la biblioteca aún.</p>
                <p style={{ fontSize: '0.85rem' }}>Escribe código HTML en el editor de la fase y presiona <strong>'💾 Guardar como Plantilla'</strong>.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
                {htmlLibrary.map((tmpl) => (
                  <div key={tmpl.id} style={{
                    background: '#040406',
                    border: '1.5px solid rgba(212,175,55,0.4)',
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h4 style={{ margin: 0, color: '#FFDF73', fontSize: '1.05rem', fontWeight: '800' }}>
                          {tmpl.title}
                        </h4>
                        <span style={{ fontSize: '0.7rem', background: 'rgba(255,223,115,0.15)', color: '#FFDF73', padding: '2px 8px', borderRadius: '10px' }}>
                          {tmpl.createdAt}
                        </span>
                      </div>
                      <p style={{ color: '#ccc', fontSize: '0.82rem', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                        {tmpl.description}
                      </p>
                      
                      {/* Code preview block */}
                      <pre style={{
                        background: '#010101',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        fontSize: '0.75rem',
                        color: '#81c784',
                        maxHeight: '90px',
                        overflow: 'hidden',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        margin: '0 0 14px 0'
                      }}>
                        {tmpl.htmlCode}
                      </pre>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                      <button
                        onClick={() => handleDeleteTemplate(tmpl.id, tmpl.title)}
                        style={{
                          background: 'rgba(244, 67, 54, 0.15)',
                          color: '#ff5252',
                          border: '1px solid #ff5252',
                          borderRadius: '20px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '700'
                        }}
                      >
                        <Trash2 size={13} /> Eliminar
                      </button>

                      <button
                        onClick={() => handleLoadTemplateToPhase(tmpl)}
                        className="green-btn"
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        <FileCode size={14} /> 📥 Cargar en Fase {selectedPhaseId}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setShowHtmlLibraryModal(false)} className="gold-btn-outline" style={{ padding: '10px 24px' }}>
                Cerrar Biblioteca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: GUARDAR HTML ACTUAL EN LA BIBLIOTECA --- */}
      {showSaveTemplateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px'
        }}>
          <div className="glass-panel" style={{
            background: 'linear-gradient(160deg, #181404 0%, #08080c 100%)',
            border: '2px solid #FFDF73', borderRadius: '24px', width: '100%', maxWidth: '550px',
            padding: '30px', boxShadow: '0 25px 70px rgba(212,175,55,0.4)', color: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#FFDF73', fontSize: '1.4rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderPlus size={22} /> Guardar HTML en la Biblioteca
              </h3>
              <button onClick={() => setShowSaveTemplateModal(false)} style={{ background: 'none', border: 0, color: '#aaa', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveToLibrary}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#FFDF73', fontSize: '0.85rem', fontWeight: '800', marginBottom: '6px' }}>
                  🏷️ Título de la Plantilla:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Plantilla Masaje Descontracturante 4K"
                  value={templateTitle}
                  onChange={(e) => setTemplateTitle(e.target.value)}
                  style={{
                    width: '100%', padding: '12px', background: '#09090c',
                    border: '1.5px solid #D4AF37', borderRadius: '10px', color: '#fff', fontSize: '0.95rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#FFDF73', fontSize: '0.85rem', fontWeight: '800', marginBottom: '6px' }}>
                  📝 Descripción Breve:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Estructura con 5 cuadros de protocolo de pudor y aromaterapia"
                  value={templateDesc}
                  onChange={(e) => setTemplateDesc(e.target.value)}
                  style={{
                    width: '100%', padding: '12px', background: '#09090c',
                    border: '1.5px solid #D4AF37', borderRadius: '10px', color: '#fff', fontSize: '0.95rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#a0a0a0', fontSize: '0.8rem', marginBottom: '4px' }}>
                  Vista Previa del Código a Guardar:
                </label>
                <pre style={{
                  background: '#020202', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '10px',
                  padding: '10px', fontSize: '0.78rem', color: '#81c784', maxHeight: '110px', overflow: 'hidden'
                }}>
                  {editPhaseForm.theoryHtml}
                </pre>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowSaveTemplateModal(false)} className="gold-btn-outline" style={{ padding: '10px 20px' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={isSavingTemplate} className="gold-btn" style={{ padding: '10px 24px' }}>
                  <Save size={16} /> {isSavingTemplate ? 'Guardando...' : 'Guardar en Biblioteca'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE NUEVO CURSO --- */}
      {showNewCourseModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px' }}>
          <div className="glass-panel" style={{ background: '#09090d', border: '2px solid #FFDF73', borderRadius: '24px', width: '100%', maxWidth: '600px', padding: '30px', color: '#fff' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#FFDF73', fontSize: '1.4rem' }}>+ Crear Nuevo Curso</h3>
            <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="text" required placeholder="Título del Curso" value={newCourseForm.title} onChange={e => setNewCourseForm({ ...newCourseForm, title: e.target.value })} style={{ padding: '12px', background: '#000', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }} />
              <input type="text" placeholder="Categoría" value={newCourseForm.category} onChange={e => setNewCourseForm({ ...newCourseForm, category: e.target.value })} style={{ padding: '12px', background: '#000', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="number" placeholder="Precio USD" value={newCourseForm.price} onChange={e => setNewCourseForm({ ...newCourseForm, price: parseFloat(e.target.value) })} style={{ flex: 1, padding: '12px', background: '#000', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }} />
                <input type="number" placeholder="Precio Original USD" value={newCourseForm.originalPrice} onChange={e => setNewCourseForm({ ...newCourseForm, originalPrice: parseFloat(e.target.value) })} style={{ flex: 1, padding: '12px', background: '#000', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }} />
              </div>
              <input type="text" placeholder="Insignia / Badge (ej: NUEVO)" value={newCourseForm.badge} onChange={e => setNewCourseForm({ ...newCourseForm, badge: e.target.value })} style={{ padding: '12px', background: '#000', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }} />
              <textarea placeholder="Descripción del Curso" value={newCourseForm.description} onChange={e => setNewCourseForm({ ...newCourseForm, description: e.target.value })} style={{ padding: '12px', background: '#000', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }} />
              <input type="text" placeholder="URL de Imagen de Portada" value={newCourseForm.imageUrl} onChange={e => setNewCourseForm({ ...newCourseForm, imageUrl: e.target.value })} style={{ padding: '12px', background: '#000', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }} />
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowNewCourseModal(false)} className="gold-btn-outline" style={{ padding: '10px 20px' }}>Cancelar</button>
                <button type="submit" className="gold-btn" style={{ padding: '10px 24px' }}>Guardar Curso</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE EDITAR NOMBRE DE CURSO --- */}
      {showEditCourseModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px' }}>
          <div className="glass-panel" style={{ background: '#09090d', border: '2px solid #FFDF73', borderRadius: '24px', width: '100%', maxWidth: '600px', padding: '30px', color: '#fff' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#FFDF73', fontSize: '1.4rem' }}>✏️ Editar Datos del Curso</h3>
            <form onSubmit={handleUpdateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="text" required placeholder="Título del Curso" value={editCourseForm.title} onChange={e => setEditCourseForm({ ...editCourseForm, title: e.target.value })} style={{ padding: '12px', background: '#000', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }} />
              <input type="text" placeholder="Categoría" value={editCourseForm.category} onChange={e => setEditCourseForm({ ...editCourseForm, category: e.target.value })} style={{ padding: '12px', background: '#000', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }} />
              <textarea placeholder="Descripción del Curso" value={editCourseForm.description} onChange={e => setEditCourseForm({ ...editCourseForm, description: e.target.value })} style={{ padding: '12px', background: '#000', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }} />
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowEditCourseModal(false)} className="gold-btn-outline" style={{ padding: '10px 20px' }}>Cancelar</button>
                <button type="submit" className="gold-btn" style={{ padding: '10px 24px' }}>Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE AGREGAR NUEVA FASE --- */}
      {showNewPhaseModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px' }}>
          <div className="glass-panel" style={{ background: '#09090d', border: '2px solid #FFDF73', borderRadius: '24px', width: '100%', maxWidth: '500px', padding: '30px', color: '#fff' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#FFDF73', fontSize: '1.4rem' }}>+ Agregar Nueva Fase al Curso</h3>
            <form onSubmit={handleAddPhase} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="text" required placeholder="Ej. FASE 6 • PROTOCOLO DE SEGUIMIENTO" value={newPhaseData.title} onChange={e => setNewPhaseData({ ...newPhaseData, title: e.target.value })} style={{ padding: '12px', background: '#000', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }} />
              <input type="text" placeholder="Subtítulo (ej. Cierre Operativo y Re-venta)" value={newPhaseData.subtitle} onChange={e => setNewPhaseData({ ...newPhaseData, subtitle: e.target.value })} style={{ padding: '12px', background: '#000', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }} />
              <textarea placeholder="Descripción Corta" value={newPhaseData.description} onChange={e => setNewPhaseData({ ...newPhaseData, description: e.target.value })} style={{ padding: '12px', background: '#000', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }} />
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowNewPhaseModal(false)} className="gold-btn-outline" style={{ padding: '10px 20px' }}>Cancelar</button>
                <button type="submit" className="green-btn" style={{ padding: '10px 24px' }}>Crear Fase</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE EDITAR USUARIO --- */}
      {showEditUserModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px' }}>
          <div className="glass-panel" style={{ background: '#09090d', border: '2px solid #FFDF73', borderRadius: '24px', width: '100%', maxWidth: '500px', padding: '30px', color: '#fff' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#FFDF73', fontSize: '1.4rem' }}>✏️ Editar Datos de Usuario</h3>
            <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="text" required placeholder="Nombre Completo" value={editUserForm.name} onChange={e => setEditUserForm({ ...editUserForm, name: e.target.value })} style={{ padding: '12px', background: '#000', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }} />
              <input type="email" placeholder="Correo Electrónico" value={editUserForm.email} onChange={e => setEditUserForm({ ...editUserForm, email: e.target.value })} style={{ padding: '12px', background: '#000', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }} />
              <select value={editUserForm.role} onChange={e => setEditUserForm({ ...editUserForm, role: e.target.value })} style={{ padding: '12px', background: '#000', border: '1px solid #D4AF37', borderRadius: '8px', color: '#fff' }}>
                <option value="Maestro">Maestro</option>
                <option value="Alumno Presencial">Alumno Presencial</option>
                <option value="Alumno Virtual">Alumno Virtual</option>
                <option value="Administrador">Administrador</option>
              </select>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowEditUserModal(false)} className="gold-btn-outline" style={{ padding: '10px 20px' }}>Cancelar</button>
                <button type="submit" className="gold-btn" style={{ padding: '10px 24px' }}>Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

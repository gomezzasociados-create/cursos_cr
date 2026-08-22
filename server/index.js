import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static frontend dist folder
const clientDistPath = path.join(__dirname, '../dist');
app.use(express.static(clientDistPath));

function formatEmbedUrl(url) {
  if (!url) return '';
  let str = url.trim();
  const ytMatch = str.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return str;
}

// IN-MEMORY DATABASE & DATA STORE
const store = {
  currentPhasePresencial: 1,
  courses: [
    {
      id: "c_masaje_1",
      title: "MasterClass: Técnica de Atención & Neuroventas en Spa",
      category: "Estética & Bienestar",
      price: 149.00,
      originalPrice: 299.00,
      badge: "MÁS VENDIDO",
      description: "El manual operativo definitivo para terapeutas y masajistas. Domina la recepción, diagnóstico clínico, neuroventas y la arquitectura sensorial extrema.",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
      welcomeTeacherVideoUrl: formatEmbedUrl("https://www.youtube.com/watch?v=3lB9dP4HRPA"),
      welcomeStudentsMessage: "¡Bienvenidas a la clase presencial en vivo! Sigan la teoría y los videos paso a paso.",
      welcomeStudentsVideoUrl: formatEmbedUrl("https://www.youtube.com/watch?v=3lB9dP4HRPA"),
      phases: [
        {
          id: 1,
          title: "FASE 1 • RECEPCIÓN",
          subtitle: "Bienvenida y Anclaje Espacial",
          description: "Los primeros 30 segundos presenciales que determinan el valor percibido del servicio.",
          theoryHtml: "",
          videos: [
            {
              id: "v1_1",
              title: "Protocolo de Recepción 4K",
              url: formatEmbedUrl("https://www.youtube.com/watch?v=3lB9dP4HRPA"),
              duration: "08:45",
              provider: "YouTube CDN",
              quality: "1080p HLS"
            }
          ]
        },
        {
          id: 2,
          title: "FASE 2 • DIAGNÓSTICO",
          subtitle: "Lectura Emocional y Entrevista Clínica",
          description: "Cómo descubrir el verdadero dolor del cliente antes de pasar a la camilla.",
          theoryHtml: "",
          videos: []
        },
        {
          id: 3,
          title: "FASE 3 • ATMÓSFERA",
          subtitle: "Arquitectura Sensorial Extrema",
          description: "Mapeo detallado de los 5 sentidos para inducir estados alfa cerebrales.",
          theoryHtml: "",
          videos: []
        },
        {
          id: 4,
          title: "FASE 4 • CABINA",
          subtitle: "Coreografía del Contacto y Privacidad",
          description: "Cómo navegar la sesión garantizando máximo confort, pudor y resultados.",
          theoryHtml: "",
          videos: []
        },
        {
          id: 5,
          title: "FASE 5 • DESPEDIDA SENSORIAL",
          subtitle: "El Aterrizaje del Sistema Nervioso",
          description: "Cómo devolverlos a la realidad suavemente para entregarlos al área de cierre.",
          theoryHtml: "",
          videos: []
        }
      ]
    }
  ],
  users: [
    {
      id: "u_admin",
      name: "Administrador General",
      email: "admin@gomezz.space",
      password: "admin",
      role: "Admin",
      courseId: "c_masaje_1",
      currentPhase: 1
    },
    {
      id: "u_teacher",
      name: "Maestra Elena Gomez",
      email: "maestro@gomezz.space",
      password: "maestro",
      role: "Maestro",
      courseId: "c_masaje_1",
      currentPhase: 1
    },
    {
      id: "u_pres_1",
      name: "Camila Torres",
      email: "camila.presencial@gomezz.space",
      password: "presencial123",
      whatsapp: "+52 5511112233",
      role: "Alumno Presencial",
      courseId: "c_masaje_1",
      currentPhase: 1,
      examSubmitted: false
    },
    {
      id: "u_pres_2",
      name: "Mateo Lopez",
      email: "mateo@gmail.com",
      password: "presencial123",
      whatsapp: "+52 5522223344",
      role: "Alumno Presencial",
      courseId: "c_masaje_1",
      currentPhase: 1,
      examSubmitted: false
    },
    {
      id: "u_virt_1",
      name: "Sofia Ramirez",
      email: "sofia.virtual@gomezz.space",
      password: "virtual123",
      role: "Alumno Virtual",
      courseId: "c_masaje_1",
      currentPhase: 1
    }
  ],
  sales: [
    {
      id: "sale_1",
      name: "Lucia Fernandez",
      email: "lucia@gmail.com",
      courseTitle: "MasterClass: Técnica de Atención & Neuroventas en Spa",
      amount: 149.00,
      date: new Date().toLocaleDateString('es-ES')
    }
  ],
  htmlLibrary: [
    {
      id: "lib_template_1",
      title: "📘 Plantilla Oficial: Técnica de Atención & Neuroventas",
      description: "Estructura completa de 5 Fases con cajas de lenguaje corporal, Indagación F.O.R.D. y protocolo de pudor.",
      htmlCode: `<div className="header-section"><h2>Módulo 1: Técnica de Atención & Neuroventas</h2><p className="header-desc">El manual operativo definitivo.</p></div>`,
      createdAt: new Date().toLocaleDateString('es-ES')
    },
    {
      id: "lib_template_2",
      title: "💆 Plantilla SPA: Arquitectura Sensorial & Draping",
      description: "Diseño especializado con caja de luces binaurales, aromaterapia neuro-olfativa y micro-chequeos.",
      htmlCode: `<div className="premium-box"><div className="premium-box-title">🧠 Manipulación Ambiental Positiva</div><p className="box-text">Camilla a 36.5°C y música binaural Solfeggio.</p></div>`,
      createdAt: new Date().toLocaleDateString('es-ES')
    }
  ],
  exams: {
    1: [
      { id: 1, question: "¿En cuántos segundos el cerebro del cliente toma una decisión subconsciente sobre tu profesionalismo?", options: ["A) 7 segundos", "B) 30 segundos", "C) 2 minutos", "D) 5 minutos"], correctAnswer: 0 },
      { id: 2, question: "¿Por qué debes romper la barrera del mostrador al recibir al cliente?", options: ["A) Porque el mostrador crea una relación 'Cajero-Cliente' en lugar de 'Anfitrión-Invitado'", "B) Para revisar la ficha física", "C) Porque es más rápido", "D) Para que no vea el área de caja"], correctAnswer: 0 },
      { id: 3, question: "¿Qué puntos abarca el Triángulo de la Mirada para transmitir atención profunda sin intimidar?", options: ["A) Ojo izquierdo, ojo derecho y puente de la nariz", "B) Labios y mentón", "C) Manos y rostro", "D) Manos y pies"], correctAnswer: 0 },
      { id: 4, question: "¿Cuál es el objetivo de hablar un 20% más lento y en tono más bajo que el cliente?", options: ["A) Obligar a sus neuronas espejo a calmarse y sincronizar la energía", "B) Evitar que escuche las demás cabinas", "C) Demostrar superioridad técnica", "D) Ahorrar energía vocal"], correctAnswer: 0 },
      { id: 5, question: "¿Qué efecto psicológico tiene el Ritual de Descompresión con toallita tibia Oshibori?", options: ["A) 'Limpia' el estrés y la carga del exterior", "B) Desinfecta solamente", "C) Perfuma la recepción", "D) Mantiene entretenido al cliente"], correctAnswer: 0 },
      { id: 6, question: "¿Cómo se debe reformular un retraso en la atención?", options: ["A) 'Gracias por tu paciencia, estoy preparando tu cabina para que esté perfecta'", "B) 'Perdón por la demora, estuve ocupada'", "C) 'El cliente anterior llegó tarde'", "D) 'No te preocupes, ya casi termino'"], correctAnswer: 0 },
      { id: 7, question: "En la técnica F.O.R.D., ¿qué significa la letra 'O'?", options: ["A) Ocupación (Occupation)", "B) Opinión", "C) Objetivos", "D) Observación"], correctAnswer: 0 },
      { id: 8, question: "En la técnica F.O.R.D., ¿qué significa la letra 'D'?", options: ["A) Deseos / Sueños (Dreams)", "B) Dolores físico-musculares", "C) Diagnóstico preliminar", "D) Dinero disponible"], correctAnswer: 0 },
      { id: 9, question: "¿Cuál es la proporción ideal de escucha activa en la entrevista inicial?", options: ["A) El cliente habla el 80% del tiempo y la terapeuta el 20%", "B) La terapeuta habla el 80%", "C) 50% y 50%", "D) Hablan al mismo tiempo"], correctAnswer: 0 },
      { id: 10, question: "¿Cómo responder ante una inseguridad corporal expuesta por la paciente?", options: ["A) Validar con neutralidad absoluta asegurando que su cuerpo es normal", "B) Decir 'Estás perfecta' aunque sea falso", "C) Confirmar que sí se nota", "D) Cambiar de tema inmediatamente"], correctAnswer: 0 },
      { id: 11, question: "¿A qué temperatura debe mantenerse la camilla antes del contacto?", options: ["A) Temperatura corporal (36.5°C)", "B) 20°C", "C) 45°C", "D) A temperatura ambiente fría"], correctAnswer: 0 },
      { id: 12, question: "¿Qué tipo de audio está PROHIBIDO durante la sesión sensorial?", options: ["A) Música comercial con letras/voz", "B) Frecuencias Solfeggio 432Hz", "C) Sonidos orgánicos binaurales", "D) Cuencos tibetanos"], correctAnswer: 0 },
      { id: 13, question: "¿Qué iluminación se debe usar cuando la paciente está boca arriba?", options: ["A) Penumbra indirecta con lámparas de sal o velas", "B) Luz blanca de techo directa", "C) Luz fluorescente", "D) Oscuridad 100% sin visibilidad"], correctAnswer: 0 },
      { id: 14, question: "¿Qué aroma neuro-olfativo promueve la relajación inmediata?", options: ["A) Lavanda francesa y bergamota", "B) Eucalipto mentolado fuerte", "C) Alcohol etílico", "D) Perfumes sintéticos cítricos"], correctAnswer: 0 },
      { id: 15, question: "¿Qué debe hacer la terapeuta obligatoriamente antes del primer contacto físico?", options: ["A) Friccionar sus palmas durante 15 segundos para calentar sus manos", "B) Usar guantes quirúrgicos fríos", "C) Soplar sobre el cliente", "D) Aplicar alcohol helado"], correctAnswer: 0 },
      { id: 16, question: "En el Protocolo de Pudor (Draping), ¿cuánta superficie corporal se descubre?", options: ["A) Solo la zona exacta que se va a trabajar en ese momento", "B) Todo el cuerpo para mayor comodidad", "C) La mitad del cuerpo", "D) Nada, se trabaja sobre la ropa"], correctAnswer: 0 },
      { id: 17, question: "¿Cómo realizar la transición cuando el cliente debe darse la vuelta?", options: ["A) Levantar la sábana en carpa visual y girar la mirada hacia la pared", "B) Mirar fijamente para ayudarlo", "C) Salir de la habitación por 10 minutos", "D) Quitar la sábana por completo"], correctAnswer: 0 },
      { id: 18, question: "¿En qué momento se realiza el micro-chequeo de presión?", options: ["A) A los 3 minutos del inicio de la maniobra", "B) Cada 30 segundos durante toda la hora", "C) Únicamente al finalizar la sesión", "D) No se realiza chequeo"], correctAnswer: 0 },
      { id: 19, question: "Durante el masaje, si necesitas aplicar más producto, ¿cuál es la regla de oro?", options: ["A) Mantener siempre una mano en contacto continuo con el cuerpo", "B) Quitar ambas manos de golpe", "C) Secar al cliente primero", "D) Dar un aplauso informativo"], correctAnswer: 0 },
      { id: 20, question: "¿Con qué detalle gustativo se cierra la despedida sensorial en recepción?", options: ["A) Infusión aromática o té matcha", "B) Agua fría de grifo", "C) Café concentrado", "D) Ningún refresco"], correctAnswer: 0 }
    ]
  }
};

// --- AUTHENTICATION API ---
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Correo y contraseña requeridos" });
  }

  const cleanEmail = email.trim().toLowerCase();
  
  // Find user by email or by role/preset
  let user = store.users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
  
  if (!user && role) {
    user = store.users.find(u => (u.role === role || (role === 'Admin' && u.role === 'Admin')) && u.password === password);
  }

  if (!user) {
    // Check if role is Admin with default fallback
    if (cleanEmail === 'admin@gomezz.space' && password === 'admin') {
      user = store.users.find(u => u.role === 'Admin');
    } else if (cleanEmail === 'maestro@gomezz.space' && password === 'maestro') {
      user = store.users.find(u => u.role === 'Maestro');
    }
  }

  if (!user) {
    return res.status(401).json({ error: "Credenciales o rol incorrectos. Revisa tu correo y contraseña." });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      whatsapp: user.whatsapp,
      courseId: user.courseId,
      currentPhase: user.currentPhase || 1
    }
  });
});

// --- SYSTEM STATE & COURSES APIs ---
app.get('/api/state', (req, res) => {
  const activeCourse = store.courses[0];
  const teacherUser = store.users.find(u => u.role === 'Maestro');

  res.json({
    currentPhasePresencial: store.currentPhasePresencial,
    teacherName: teacherUser ? teacherUser.name : "Maestra Elena Gomez",
    courses: store.courses,
    welcomeTeacherVideoUrl: activeCourse?.welcomeTeacherVideoUrl || '',
    welcomeStudentsMessage: activeCourse?.welcomeStudentsMessage || '',
    welcomeStudentsVideoUrl: activeCourse?.welcomeStudentsVideoUrl || '',
    phases: activeCourse?.phases || []
  });
});

app.get('/api/courses', (req, res) => {
  res.json(store.courses);
});

// Admin Courses Management
app.get('/api/admin/courses', (req, res) => {
  res.json(store.courses);
});

app.post('/api/admin/courses', (req, res) => {
  const { title, category, price, originalPrice, badge, description, imageUrl, welcomeTeacherVideoUrl } = req.body;
  if (!title) {
    return res.status(400).json({ error: "El título del curso es obligatorio" });
  }

  const newCourse = {
    id: "c_" + Date.now(),
    title,
    category: category || "Capacitación Profesional",
    price: price ? parseFloat(price) : 99.00,
    originalPrice: originalPrice ? parseFloat(originalPrice) : 199.00,
    badge: badge || "NUEVO",
    description: description || "Descripción del nuevo curso.",
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
    welcomeTeacherVideoUrl: formatEmbedUrl(welcomeTeacherVideoUrl || "https://www.youtube.com/watch?v=3lB9dP4HRPA"),
    welcomeStudentsMessage: "¡Bienvenida a la clase!",
    welcomeStudentsVideoUrl: formatEmbedUrl("https://www.youtube.com/watch?v=3lB9dP4HRPA"),
    phases: [
      { id: 1, title: "FASE 1 • RECEPCIÓN", subtitle: "Bienvenida y Anclaje", description: "Fase de bienvenida.", theoryHtml: "", videos: [] }
    ]
  };

  store.courses.push(newCourse);
  io.emit('courses_updated', { message: `Nuevo curso '${title}' creado`, courses: store.courses });
  res.json({ success: true, course: newCourse });
});

app.put('/api/admin/courses/:id', (req, res) => {
  const courseId = req.params.id;
  const course = store.courses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ error: "Curso no encontrado" });

  const { title, category, price, originalPrice, badge, description, imageUrl } = req.body;
  if (title !== undefined) course.title = title;
  if (category !== undefined) course.category = category;
  if (price !== undefined) course.price = parseFloat(price);
  if (originalPrice !== undefined) course.originalPrice = parseFloat(originalPrice);
  if (badge !== undefined) course.badge = badge;
  if (description !== undefined) course.description = description;
  if (imageUrl !== undefined) course.imageUrl = imageUrl;

  io.emit('courses_updated', { message: `Curso '${course.title}' actualizado`, courses: store.courses });
  res.json({ success: true, course });
});

app.delete('/api/admin/courses/:id', (req, res) => {
  const courseId = req.params.id;
  const idx = store.courses.findIndex(c => c.id === courseId);
  if (idx === -1) return res.status(404).json({ error: "Curso no encontrado" });

  const deleted = store.courses.splice(idx, 1)[0];
  io.emit('courses_updated', { message: `Curso '${deleted.title}' eliminado`, courses: store.courses });
  res.json({ success: true, message: "Curso eliminado" });
});

// Phase Management
app.post('/api/admin/courses/:courseId/phases', (req, res) => {
  const course = store.courses.find(c => c.id === req.params.courseId) || store.courses[0];
  if (!course) return res.status(404).json({ error: "Curso no encontrado" });

  const { title, subtitle, description } = req.body;
  const newPhaseId = course.phases.length + 1;
  const newPhase = {
    id: newPhaseId,
    title: title || `FASE ${newPhaseId}`,
    subtitle: subtitle || `Subtítulo Fase ${newPhaseId}`,
    description: description || `Descripción de la Fase ${newPhaseId}`,
    theoryHtml: "",
    videos: []
  };

  course.phases.push(newPhase);
  io.emit('phases_updated', { message: `Nueva fase creada`, phases: course.phases });
  res.json({ success: true, phase: newPhase });
});

app.delete('/api/admin/courses/:courseId/phases/:phaseId', (req, res) => {
  const course = store.courses.find(c => c.id === req.params.courseId) || store.courses[0];
  if (!course) return res.status(404).json({ error: "Curso no encontrado" });

  const phaseId = parseInt(req.params.phaseId, 10);
  const idx = course.phases.findIndex(p => p.id === phaseId);
  if (idx === -1) return res.status(404).json({ error: "Fase no encontrada" });

  course.phases.splice(idx, 1);
  io.emit('phases_updated', { message: `Fase ${phaseId} eliminada`, phases: course.phases });
  res.json({ success: true, message: "Fase eliminada" });
});

// Phase Videos Management
app.post('/api/admin/courses/:courseId/phases/:phaseId/videos', (req, res) => {
  const course = store.courses.find(c => c.id === req.params.courseId) || store.courses[0];
  const phaseId = parseInt(req.params.phaseId, 10);
  const phase = course?.phases.find(p => p.id === phaseId);

  if (!phase) return res.status(404).json({ error: "Fase no encontrada" });

  const { title, url, duration, provider } = req.body;
  const newVid = {
    id: "v_" + Date.now(),
    title: title || "Video Tutorial",
    url: formatEmbedUrl(url),
    duration: duration || "10:00",
    provider: provider || "YouTube CDN"
  };

  phase.videos.push(newVid);
  io.emit('phases_updated', { message: "Video agregado", phases: course.phases });
  res.json({ success: true, video: newVid });
});

app.delete('/api/admin/courses/:courseId/phases/:phaseId/videos/:videoId', (req, res) => {
  const course = store.courses.find(c => c.id === req.params.courseId) || store.courses[0];
  const phaseId = parseInt(req.params.phaseId, 10);
  const phase = course?.phases.find(p => p.id === phaseId);

  if (!phase) return res.status(404).json({ error: "Fase no encontrada" });

  const idx = phase.videos.findIndex(v => v.id === req.params.videoId);
  if (idx === -1) return res.status(404).json({ error: "Video no encontrado" });

  phase.videos.splice(idx, 1);
  io.emit('phases_updated', { message: "Video eliminado", phases: course.phases });
  res.json({ success: true, message: "Video eliminado" });
});

// Welcome Videos Management
app.put('/api/admin/courses/:courseId/welcome', (req, res) => {
  const course = store.courses.find(c => c.id === req.params.courseId) || store.courses[0];
  if (!course) return res.status(404).json({ error: "Curso no encontrado" });

  const { welcomeTeacherVideoUrl, welcomeStudentsMessage, welcomeStudentsVideoUrl } = req.body;
  if (welcomeTeacherVideoUrl !== undefined) course.welcomeTeacherVideoUrl = formatEmbedUrl(welcomeTeacherVideoUrl);
  if (welcomeStudentsMessage !== undefined) course.welcomeStudentsMessage = welcomeStudentsMessage;
  if (welcomeStudentsVideoUrl !== undefined) course.welcomeStudentsVideoUrl = formatEmbedUrl(welcomeStudentsVideoUrl);

  io.emit('courses_updated', { message: "Videos de bienvenida actualizados", courses: store.courses });
  res.json({ success: true, message: "Videos de bienvenida actualizados", course });
});

// BIBLIOTECA DE CÓDIGO HTML ENDPOINTS
app.get('/api/admin/html-library', (req, res) => {
  res.json(store.htmlLibrary);
});

app.post('/api/admin/html-library', (req, res) => {
  const { title, description, htmlCode } = req.body;
  if (!htmlCode) {
    return res.status(400).json({ error: "El código HTML es obligatorio" });
  }

  const newTemplate = {
    id: "lib_" + Date.now(),
    title: title || `Plantilla HTML (${new Date().toLocaleTimeString('es-ES')})`,
    description: description || "Plantilla guardada en la biblioteca de fases.",
    htmlCode,
    createdAt: new Date().toLocaleDateString('es-ES')
  };

  store.htmlLibrary.unshift(newTemplate);
  io.emit('html_library_updated', { message: `Nueva plantilla '${newTemplate.title}' guardada`, library: store.htmlLibrary });
  res.json({ success: true, message: "Plantilla guardada exitosamente", template: newTemplate, library: store.htmlLibrary });
});

app.delete('/api/admin/html-library/:id', (req, res) => {
  const libId = req.params.id;
  const idx = store.htmlLibrary.findIndex(t => t.id === libId);
  if (idx === -1) return res.status(404).json({ error: "Plantilla no encontrada" });

  const deleted = store.htmlLibrary.splice(idx, 1)[0];
  io.emit('html_library_updated', { message: `Plantilla '${deleted.title}' eliminada`, library: store.htmlLibrary });
  res.json({ success: true, message: "Plantilla eliminada", library: store.htmlLibrary });
});

// Update Phase HTML & Titles
app.put('/api/admin/courses/:courseId/phases/:phaseId', (req, res) => {
  const courseId = req.params.courseId;
  const phaseId = parseInt(req.params.phaseId, 10);
  const course = store.courses.find(c => c.id === courseId) || store.courses[0];

  if (!course) return res.status(404).json({ error: "Curso no encontrado" });

  const phase = course.phases.find(p => p.id === phaseId);
  if (!phase) return res.status(404).json({ error: "Fase no encontrada" });

  const { title, subtitle, description, theoryHtml } = req.body;
  if (title !== undefined) phase.title = title;
  if (subtitle !== undefined) phase.subtitle = subtitle;
  if (description !== undefined) phase.description = description;
  if (theoryHtml !== undefined) phase.theoryHtml = theoryHtml;

  io.emit('phases_updated', { message: `Fase ${phaseId} actualizada`, phases: course.phases });
  res.json({ success: true, message: `Fase ${phaseId} actualizada con éxito`, phase });
});

// Sales Management
app.get('/api/admin/sales', (req, res) => {
  res.json(store.sales);
});

// User Management
app.get('/api/admin/users', (req, res) => {
  res.json(store.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    whatsapp: u.whatsapp,
    courseId: u.courseId,
    currentPhase: u.currentPhase
  })));
});

app.post('/api/admin/users', (req, res) => {
  const { name, whatsapp, role, email } = req.body;
  if (!name) {
    return res.status(400).json({ error: "El nombre del alumno es obligatorio" });
  }

  const autoId = "u_pres_" + Date.now();
  const newStudent = {
    id: autoId,
    name,
    email: email || `${autoId}@clase.com`,
    password: 'presencial123',
    role: role || 'Alumno Presencial',
    whatsapp: whatsapp || '',
    courseId: store.courses[0]?.id || 'c_1',
    currentPhase: store.currentPhasePresencial || 1,
    examSubmitted: false
  };

  store.users.push(newStudent);
  io.emit('users_updated', { message: `Nuevo alumno '${name}' registrado`, users: store.users });
  res.json({ success: true, message: `Alumno '${name}' registrado con éxito`, user: newStudent });
});

app.put('/api/admin/users/:id', (req, res) => {
  const userId = req.params.id;
  const user = store.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  const { name, email, whatsapp, role } = req.body;
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (whatsapp !== undefined) user.whatsapp = whatsapp;
  if (role !== undefined) user.role = role;

  io.emit('users_updated', { message: `Usuario ${user.name} actualizado`, users: store.users });
  res.json({ success: true, message: "Usuario actualizado", user });
});

app.delete('/api/admin/users/:id', (req, res) => {
  const userId = req.params.id;
  const index = store.users.findIndex(u => u.id === userId);
  if (index === -1) return res.status(404).json({ error: "Usuario no encontrado" });

  const deletedUser = store.users.splice(index, 1)[0];
  io.emit('users_updated', { message: `Usuario '${deletedUser.name}' eliminado`, users: store.users });
  res.json({ success: true, message: "Usuario eliminado" });
});

// Teacher Phase Controls
app.post('/api/teacher/next-phase', (req, res) => {
  const activeCourse = store.courses[0];
  const maxPhases = activeCourse?.phases ? activeCourse.phases.length : 5;

  if (store.currentPhasePresencial >= maxPhases) {
    return res.status(400).json({ error: `Ya te encuentras en la última fase (Fase ${maxPhases}). Puedes reiniciar el curso si inicias una nueva clase.` });
  }

  store.currentPhasePresencial = store.currentPhasePresencial + 1;

  const presenciales = store.users.filter(u => u.role === 'Alumno Presencial');
  presenciales.forEach(u => {
    u.currentPhase = store.currentPhasePresencial;
    u.examSubmitted = false;
  });

  io.emit('phase_advanced', {
    newPhase: store.currentPhasePresencial,
    message: `¡El Maestro ha avanzado el curso a la Fase ${store.currentPhasePresencial}!`
  });

  res.json({ success: true, newPhase: store.currentPhasePresencial });
});

app.post('/api/teacher/prev-phase', (req, res) => {
  if (store.currentPhasePresencial <= 1) {
    return res.status(400).json({ error: "Ya te encuentras en la Fase 1." });
  }

  store.currentPhasePresencial = store.currentPhasePresencial - 1;

  const presenciales = store.users.filter(u => u.role === 'Alumno Presencial');
  presenciales.forEach(u => {
    u.currentPhase = store.currentPhasePresencial;
    u.examSubmitted = false;
  });

  io.emit('phase_advanced', {
    newPhase: store.currentPhasePresencial,
    message: `El Maestro ha regresado el curso a la Fase ${store.currentPhasePresencial}.`
  });

  res.json({ success: true, newPhase: store.currentPhasePresencial });
});

app.post('/api/teacher/reset-course', (req, res) => {
  store.currentPhasePresencial = 1;

  const presenciales = store.users.filter(u => u.role === 'Alumno Presencial');
  presenciales.forEach(u => {
    u.currentPhase = 1;
    u.examSubmitted = false;
  });

  io.emit('phase_advanced', {
    newPhase: 1,
    message: "¡El Maestro ha reiniciado el curso a la Fase 1 para una nueva clase!"
  });

  res.json({ success: true, newPhase: 1 });
});

// Teacher exam guide solver
app.get('/api/teacher/exams-guide', (req, res) => {
  res.json({ guide: store.exams });
});

// Exam questions endpoint
app.get('/api/exams/:phaseId', (req, res) => {
  const phaseId = parseInt(req.params.phaseId, 10);
  const questions = store.exams[phaseId] || store.exams[1];
  res.json(questions);
});

app.post('/api/exams/submit', (req, res) => {
  const { studentId, phaseId, answers } = req.body;
  const student = store.users.find(u => u.id === studentId);
  const examQuestions = store.exams[phaseId] || store.exams[1];
  
  let score = 0;
  answers.forEach((ans, idx) => {
    if (examQuestions[idx] && ans === examQuestions[idx].correctAnswer) {
      score++;
    }
  });

  if (student) {
    student.examSubmitted = true;
  }

  io.emit('exam_submitted_presencial', {
    studentId,
    studentName: student ? student.name : 'Alumno',
    phaseId,
    score
  });

  res.json({ success: true, score, totalQuestions: examQuestions.length });
});

// E-Commerce Checkout Endpoint
app.post('/api/ecommerce/checkout', (req, res) => {
  const { name, email, cardName, cardNumber, courseId, courseTitle, amount } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Nombre y Correo son obligatorios" });
  }

  const selectedCourse = store.courses.find(c => c.id === courseId) || store.courses[0];
  const itemPrice = amount ? parseFloat(amount) : (selectedCourse ? selectedCourse.price : 149.00);
  const itemTitle = courseTitle || (selectedCourse ? selectedCourse.title : "MasterClass: Técnica de Atención & Neuroventas");

  const autoPassword = "virt" + Math.floor(1000 + Math.random() * 9000);
  const newVirtualStudent = {
    id: "u_virtual_" + Date.now(),
    name,
    email,
    password: autoPassword,
    role: "Alumno Virtual",
    courseId: selectedCourse ? selectedCourse.id : "c_masaje_1",
    currentPhase: 1
  };

  store.users.push(newVirtualStudent);

  const newSale = {
    id: "sale_" + Date.now(),
    name,
    email,
    courseTitle: itemTitle,
    amount: itemPrice,
    date: new Date().toLocaleDateString('es-ES')
  };

  store.sales.push(newSale);

  res.json({
    success: true,
    message: "¡Compra realizada con éxito!",
    credentials: {
      id: newVirtualStudent.id,
      email: newVirtualStudent.email,
      password: autoPassword,
      role: "Alumno Virtual"
    },
    user: newVirtualStudent
  });
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log(`[WebSocket] Cliente conectado: ${socket.id}`);

  const activeCourse = store.courses[0];
  socket.emit('initial_state', {
    currentCourseId: activeCourse?.id || "c_1",
    currentPhasePresencial: store.currentPhasePresencial,
    teacherName: store.users.find(u => u.role === 'Maestro')?.name || "Maestra Elena Gomez",
    courses: store.courses
  });

  socket.on('disconnect', () => {
    console.log(`[WebSocket] Cliente desconectado: ${socket.id}`);
  });
});

// Catch-all SPA router fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html><body style="background:#000;color:#fff;font-family:sans-serif;padding:40px;">
          <h2>Servidor Backend Híbrido en http://localhost:8083</h2>
        </body></html>
      `);
    }
  });
});

const PORT = process.env.PORT || 8083;
httpServer.listen(PORT, () => {
  console.log(`🚀 [Plataforma Híbrida] Servidor Backend escuchando en http://localhost:${PORT}`);
});

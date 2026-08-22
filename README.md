# 🚀 Plataforma Educativa Híbrida — Gomez Systems AI Architecture

Plataforma Web interactiva e interconectada en tiempo real (WebSockets + Express + React + Vite) para capacitación presencial y virtual en **Técnica de Atención & Neuroventas en Spa**.

---

## 🌟 Características Principales

1. **Sesión de Maestro(a) (`/teacher`)**:
   - Proyección de teoría en formato **100% Pantalla Completa sin distracciones**.
   - **Control de Fases en Tiempo Real**: Botones de `🚀 Siguiente Fase`, `⬅️ Fase Anterior` y `🔄 Reiniciar Curso (Nueva Clase)`.
   - **Gestión de Alumnos Presenciales**: Alta manual (Nombre, Email, WhatsApp), edición `✏️` y eliminación `🗑️`.
   - Enlace directo a envío de credenciales por WhatsApp.

2. **Panel de Administración (`/admin`)**:
   - **Mapeo de Fases, HTML y Videos**: Editor interactivo del código HTML puro con vista previa en vivo.
   - **📚 Biblioteca de Código HTML**: Catálogo para guardar diseños de fases como plantillas reutilizables y cargarlas en cualquier fase o curso.
   - **Gestión de Cursos y Ventas**: Catálogo global, edición de precios y registro e-commerce.

3. **Sesión de Alumno Presencial y Virtual (`/student`)**:
   - Sincronización en vivo cuando el maestro avanza de fase.
   - **Examen de 20 Preguntas por Fase**: Cuestionarios interactivos con calificación automática.

4. **Tienda E-Commerce (`/ecommerce`)**:
   - Checkout interactivo para venta directa de cursos a alumnos virtuales con generación automática de contraseña.

---

## 🛠️ Tecnologías

- **Frontend**: React 18, Vite 5, Lucide Icons, Vanilla CSS (High-Contrast Theme system)
- **Backend**: Node.js, Express, Socket.io (WebSockets)
- **Despliegue**: Docker Multi-Stage, EasyPanel / n8n (`bot.gomezz.space`)

---

## 🚀 Despliegue en EasyPanel vía GitHub

### 1. Inicializar Repositorio local (Git)
```bash
git init
git add .
git commit -m "feat: Plataforma Educativa Hibrida lista para EasyPanel"
```

### 2. Vincular con GitHub en IntelliJ IDEA
1. Abre esta carpeta en **IntelliJ IDEA**.
2. Ve a **VCS / Git -> Share Project on GitHub** o agrega la dirección remota:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/plataforma-educativa-hibrida.git
   git branch -M main
   git push -u origin main
   ```

### 3. Configurar en EasyPanel (`bot.gomezz.space`)
1. Inicia sesión en tu panel de **EasyPanel**.
2. Crea un **Nuevo Servicio -> App (Application)**.
3. Selecciona la fuente: **GitHub**.
4. Ingresa el repositorio `TU_USUARIO/plataforma-educativa-hibrida` y la rama `main`.
5. En el método de construcción (*Build Method*), selecciona **Dockerfile**.
6. En la pestaña **Environment / Variables**:
   - `PORT`: `8083` (o `3000`)
   - `NODE_ENV`: `production`
7. Presiona **Deploy**. ¡Tu aplicación estará en vivo!

---
© 2026 Gomez Systems AI Architecture • Antigravity Engine

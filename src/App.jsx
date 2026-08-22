import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Navbar from './components/Navbar.jsx';
import PortalLoginView from './pages/PortalLoginView.jsx';
import TeacherView from './pages/TeacherView.jsx';
import StudentView from './pages/StudentView.jsx';
import EcommerceView from './pages/EcommerceView.jsx';
import AdminView from './pages/AdminView.jsx';

export default function App() {
  const [activeView, setActiveView] = useState('portal'); // 'portal', 'session', 'ecommerce'
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('app_theme') || 'elegante';
    } catch (e) {
      return 'elegante';
    }
  });

  const [systemState, setSystemState] = useState({
    currentPhasePresencial: 1,
    phases: []
  });

  useEffect(() => {
    try {
      document.body.className = theme === 'spa' ? 'theme-spa' : 'theme-elegante';
      localStorage.setItem('app_theme', theme);
    } catch (e) {}
  }, [theme]);

  useEffect(() => {
    fetchSystemState();

    let newSocket = null;
    try {
      const socketUrl = window.location.origin || '';
      newSocket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true
      });

      newSocket.on('connect', () => {
        console.log('[WebSocket] Conectado al servidor en tiempo real');
        setWsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('[WebSocket] Desconectado');
        setWsConnected(false);
      });

      newSocket.on('phase_advanced', () => {
        fetchSystemState();
      });

      newSocket.on('phases_updated', () => {
        fetchSystemState();
      });

      newSocket.on('courses_updated', () => {
        fetchSystemState();
      });

      setSocket(newSocket);
    } catch (err) {
      console.warn("WebSocket initialization warning:", err);
    }

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  const fetchSystemState = async () => {
    try {
      const res = await fetch('/api/state');
      const data = await res.json();
      setSystemState(data);
    } catch (err) {
      console.error("Error al obtener estado del servidor:", err);
    }
  };

  const handleToggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    setActiveView('session');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('portal');
  };

  const handleDirectLoginVirtual = (credentials) => {
    const newUserObj = {
      id: "u_virtual_" + Date.now(),
      name: credentials.email.split('@')[0],
      email: credentials.email,
      role: 'Alumno Virtual',
      currentPhase: 1
    };

    setCurrentUser(newUserObj);
    setActiveView('session');
  };

  return (
    <div style={{ minHeight: '100vh', transition: 'all 0.4s ease' }}>
      
      {/* Top Navbar con Botón Super Slim de Modo Elegante vs Modo Spa */}
      <Navbar
        activeRole={currentUser ? currentUser.role : (activeView === 'ecommerce' ? 'E-Commerce' : 'Portal')}
        wsConnected={wsConnected}
        user={currentUser}
        onLogout={handleLogout}
        onGoHome={() => setActiveView('portal')}
        onGoEcommerce={() => setActiveView('ecommerce')}
        currentTheme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main View Router */}
      <main style={{ paddingBottom: '60px' }}>
        
        {activeView === 'portal' && (
          <PortalLoginView
            currentTheme={theme}
            onLoginSuccess={handleLoginSuccess}
            onGoEcommerce={() => setActiveView('ecommerce')}
          />
        )}

        {activeView === 'ecommerce' && (
          <EcommerceView
            currentTheme={theme}
            onDirectLoginVirtual={handleDirectLoginVirtual}
          />
        )}

        {activeView === 'session' && currentUser && currentUser.role === 'Maestro' && (
          <TeacherView
            currentTheme={theme}
            state={systemState}
            socket={socket}
            onRefreshState={fetchSystemState}
          />
        )}

        {activeView === 'session' && currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Administrador') && (
          <AdminView
            currentTheme={theme}
            state={systemState}
            onRefreshState={fetchSystemState}
          />
        )}

        {activeView === 'session' && currentUser && (currentUser.role === 'Alumno Presencial' || currentUser.role === 'Alumno Virtual') && (
          <StudentView
            currentTheme={theme}
            user={currentUser}
            state={systemState}
            socket={socket}
            onRefreshState={fetchSystemState}
          />
        )}

      </main>

      {/* Global Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '20px 14px',
        borderTop: theme === 'spa' ? '1px solid rgba(255, 64, 129, 0.3)' : '1px solid rgba(212, 175, 55, 0.2)',
        background: theme === 'spa' ? '#08030e' : '#070707',
        color: theme === 'spa' ? '#e1bee7' : '#a0a0a0',
        fontSize: '0.85rem',
        transition: 'all 0.4s ease'
      }}>
        <p style={{ margin: 0 }}>
          © 2026 Plataforma Educativa Híbrida • Gomez Systems AI Architecture. Servidor en Puerto 8083. Sincronización en Tiempo Real Activa.
        </p>
      </footer>

    </div>
  );
}

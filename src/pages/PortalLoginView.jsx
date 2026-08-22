import React, { useState } from 'react';
import { Shield, Sparkles, GraduationCap, ShoppingBag, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function PortalLoginView({ onLoginSuccess, onGoEcommerce }) {
  const [role, setRole] = useState('Maestro');
  const [email, setEmail] = useState('maestro@gomezz.space');
  const [password, setPassword] = useState('maestro');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const presets = {
    'Admin': { email: 'admin@gomezz.space', pass: 'admin', label: 'Administrador General' },
    'Maestro': { email: 'maestro@gomezz.space', pass: 'maestro', label: 'Maestra Elena Gomez' },
    'Alumno Presencial': { email: 'camila.presencial@gomezz.space', pass: 'presencial123', label: 'Camila Torres (Presencial)' },
    'Alumno Virtual': { email: 'sofia.virtual@gomezz.space', pass: 'virtual123', label: 'Sofia Ramirez (Virtual)' }
  };

  const handleSelectRole = (r) => {
    setRole(r);
    setEmail(presets[r].email);
    setPassword(presets[r].pass);
    setErrorMsg(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data.user);
      } else {
        setErrorMsg(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setErrorMsg("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '20px',
      background: 'radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.12) 0%, transparent 60%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px',
        alignItems: 'center'
      }}>
        
        {/* Left Column: Branding Presentation */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)', marginBottom: '16px' }}>
            <Sparkles size={16} style={{ color: '#FFDF73' }} />
            <span style={{ color: '#FFDF73', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              PORTAL DE ACCESO UNIFICADO
            </span>
          </div>

          <h1 style={{ fontSize: '2.8rem', fontWeight: '900', color: '#FFDF73', margin: '0 0 16px 0', lineHeight: 1.1, textTransform: 'uppercase', textShadow: '0 2px 20px rgba(212, 175, 55, 0.3)' }}>
            Plataforma Educativa Híbrida
          </h1>

          <p style={{ color: '#d4d4d4', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Sistema interconectado de capacitación profesional en <strong>Atención & Neuroventas</strong> con sincronización en tiempo real vía WebSockets.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e0e0e0', fontSize: '0.95rem' }}>
              <CheckCircle2 size={18} style={{ color: '#81c784' }} /> Acceso con credenciales para Maestro(a) y Administrador.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e0e0e0', fontSize: '0.95rem' }}>
              <CheckCircle2 size={18} style={{ color: '#81c784' }} /> Control de avance y proyección a pantalla completa.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e0e0e0', fontSize: '0.95rem' }}>
              <CheckCircle2 size={18} style={{ color: '#81c784' }} /> Evaluación de 20 preguntas por fase e inicio de sesión de alumnos.
            </div>
          </div>

          <button
            onClick={onGoEcommerce}
            className="gold-btn-outline"
            style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: '1rem' }}
          >
            <ShoppingBag size={18} /> Ir a la Tienda E-Commerce (Comprar Curso Virtual)
          </button>
        </div>

        {/* Right Column: Unified Login Box */}
        <div className="glass-panel" style={{
          padding: '36px 28px',
          borderRadius: '24px',
          border: '1px solid #FFDF73',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(212, 175, 55, 0.15)',
          background: 'linear-gradient(160deg, #141004 0%, #050505 100%)'
        }}>
          <h2 style={{ margin: '0 0 8px 0', color: '#FFDF73', fontSize: '1.6rem', fontWeight: '800' }}>
            Iniciar Sesión
          </h2>
          <p style={{ margin: '0 0 20px 0', color: '#a0a0a0', fontSize: '0.85rem' }}>
            Selecciona tu perfil de usuario e ingresa tus credenciales de acceso.
          </p>

          {/* Role selector tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => handleSelectRole('Maestro')}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: role === 'Maestro' ? '1px solid #FFDF73' : '1px solid rgba(255,255,255,0.1)',
                background: role === 'Maestro' ? 'rgba(212,175,55,0.2)' : 'rgba(0,0,0,0.4)',
                color: role === 'Maestro' ? '#FFDF73' : '#a0a0a0',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              👩‍🏫 Maestro(a)
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('Admin')}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: role === 'Admin' ? '1px solid #FFDF73' : '1px solid rgba(255,255,255,0.1)',
                background: role === 'Admin' ? 'rgba(212,175,55,0.2)' : 'rgba(0,0,0,0.4)',
                color: role === 'Admin' ? '#FFDF73' : '#a0a0a0',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              🛡️ Admin
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('Alumno Presencial')}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: role === 'Alumno Presencial' ? '1px solid #FFDF73' : '1px solid rgba(255,255,255,0.1)',
                background: role === 'Alumno Presencial' ? 'rgba(212,175,55,0.2)' : 'rgba(0,0,0,0.4)',
                color: role === 'Alumno Presencial' ? '#FFDF73' : '#a0a0a0',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              🎓 Presencial
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('Alumno Virtual')}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: role === 'Alumno Virtual' ? '1px solid #FFDF73' : '1px solid rgba(255,255,255,0.1)',
                background: role === 'Alumno Virtual' ? 'rgba(212,175,55,0.2)' : 'rgba(0,0,0,0.4)',
                color: role === 'Alumno Virtual' ? '#FFDF73' : '#a0a0a0',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              💻 Virtual
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0a0a0', marginBottom: '4px' }}>
                Correo Electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 38px',
                    borderRadius: '10px',
                    background: '#050505',
                    border: '1px solid rgba(212,175,55,0.3)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
                <User size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#FFDF73' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0a0a0', marginBottom: '4px' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 38px',
                    borderRadius: '10px',
                    background: '#050505',
                    border: '1px solid rgba(212,175,55,0.3)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#FFDF73' }} />
              </div>
            </div>

            {errorMsg && (
              <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(244,67,54,0.15)', border: '1px solid #f44336', color: '#ef5350', fontSize: '0.85rem' }}>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="gold-btn"
              disabled={loading}
              style={{ width: '100%', padding: '14px', marginTop: '6px', justifyContent: 'center' }}
            >
              {loading ? 'Ingresando...' : `Ingresar como ${role}`} <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick preset notice */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', color: '#888', textAlign: 'center' }}>
            💡 Credencial activa precargada para <strong>{presets[role].label}</strong>
          </div>
        </div>

      </div>
    </div>
  );
}

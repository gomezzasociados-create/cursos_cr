import React from 'react';
import { User, Radio, LogOut, Home, ShoppingBag, Sparkles, Heart } from 'lucide-react';

export default function Navbar({ activeRole, wsConnected, user, onLogout, onGoHome, onGoEcommerce, currentTheme = 'elegante', onToggleTheme }) {
  return (
    <header style={{
      background: currentTheme === 'spa' 
        ? 'linear-gradient(180deg, #1d0a33 0%, #0b0414 100%)' 
        : 'linear-gradient(180deg, #0d0d0d 0%, #030303 100%)',
      borderBottom: currentTheme === 'spa' 
        ? '1px solid rgba(255, 64, 129, 0.4)' 
        : '1px solid rgba(212, 175, 55, 0.3)',
      padding: '10px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: currentTheme === 'spa' 
        ? '0 4px 25px rgba(255, 64, 129, 0.25)' 
        : '0 4px 20px rgba(0, 0, 0, 0.8)',
      transition: 'all 0.4s ease'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={onGoHome}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: currentTheme === 'spa' 
              ? 'linear-gradient(135deg, #ff4081 0%, #7c4dff 50%, #FFDF73 100%)' 
              : 'linear-gradient(135deg, #D4AF37 0%, #FFDF73 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: currentTheme === 'spa' ? '#ffffff' : '#000000',
            fontWeight: '900',
            fontSize: '1.15rem',
            boxShadow: currentTheme === 'spa' 
              ? '0 0 15px rgba(255, 64, 129, 0.5)' 
              : '0 0 15px rgba(212, 175, 55, 0.4)'
          }}>
            7T
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: '900',
                color: currentTheme === 'spa' ? '#ff77a9' : '#FFDF73',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                Plataforma Educativa Híbrida
              </h1>
              {wsConnected && (
                <span title="Sincronización en tiempo real vía WebSockets activa" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  color: '#81c784',
                  background: 'rgba(76, 175, 80, 0.15)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(76, 175, 80, 0.3)'
                }}>
                  <Radio size={12} className="animate-pulse" /> WebSocket Live
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: currentTheme === 'spa' ? '#e1bee7' : '#a0a0a0' }}>
              Atención & Neuroventas • Sistema Interconectado
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* SUPER SLIM THEME SWITCHER BUTTON */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: currentTheme === 'spa' ? 'rgba(255, 64, 129, 0.18)' : 'rgba(212, 175, 55, 0.12)',
            border: currentTheme === 'spa' ? '1px solid #ff4081' : '1px solid #D4AF37',
            borderRadius: '20px',
            padding: '2px',
            height: '32px'
          }}>
            <button
              onClick={() => onToggleTheme && onToggleTheme('elegante')}
              style={{
                background: currentTheme === 'elegante' 
                  ? 'linear-gradient(135deg, #D4AF37 0%, #FFDF73 100%)' 
                  : 'transparent',
                color: currentTheme === 'elegante' ? '#000000' : '#FFDF73',
                border: 0,
                padding: '3px 10px',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                height: '26px',
                transition: 'all 0.3s ease',
                boxShadow: currentTheme === 'elegante' ? '0 0 10px rgba(212, 175, 55, 0.5)' : 'none'
              }}
            >
              <Sparkles size={12} /> Modo Elegante
            </button>

            <button
              onClick={() => onToggleTheme && onToggleTheme('spa')}
              style={{
                background: currentTheme === 'spa' 
                  ? 'linear-gradient(135deg, #ff4081 0%, #7c4dff 50%, #FFDF73 100%)' 
                  : 'transparent',
                color: currentTheme === 'spa' ? '#ffffff' : '#ff77a9',
                border: 0,
                padding: '3px 10px',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                height: '26px',
                transition: 'all 0.3s ease',
                boxShadow: currentTheme === 'spa' ? '0 0 12px rgba(255, 64, 129, 0.6)' : 'none'
              }}
            >
              <Heart size={12} /> Modo Spa
            </button>
          </div>

          <button
            onClick={onGoHome}
            style={{
              background: 'transparent',
              color: currentTheme === 'spa' ? '#e1bee7' : '#d4d4d4',
              border: currentTheme === 'spa' ? '1px solid rgba(255, 64, 129, 0.3)' : '1px solid rgba(212, 175, 55, 0.3)',
              padding: '5px 10px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Home size={14} /> Portada
          </button>

          <button
            onClick={onGoEcommerce}
            style={{
              background: activeRole === 'E-Commerce' 
                ? (currentTheme === 'spa' ? 'linear-gradient(135deg, #ff4081, #7c4dff)' : 'linear-gradient(135deg, #D4AF37 0%, #FFDF73 100%)') 
                : 'transparent',
              color: activeRole === 'E-Commerce' 
                ? '#fff' 
                : (currentTheme === 'spa' ? '#ff77a9' : '#FFDF73'),
              border: currentTheme === 'spa' ? '1px solid #ff4081' : '1px solid #D4AF37',
              padding: '5px 10px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShoppingBag size={14} /> Tienda E-Commerce
          </button>

          {/* User Active Session Pill & Logout */}
          {user && (
            <div style={{
              background: currentTheme === 'spa' ? 'rgba(255, 64, 129, 0.15)' : 'rgba(212, 175, 55, 0.1)',
              border: currentTheme === 'spa' ? '1px solid rgba(255, 64, 129, 0.4)' : '1px solid rgba(212, 175, 55, 0.3)',
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem'
            }}>
              <User size={14} style={{ color: currentTheme === 'spa' ? '#ff77a9' : '#FFDF73' }} />
              <span style={{ fontWeight: '700', color: '#ffffff' }}>{user.name}</span>
              <span className="badge-gold" style={{ fontSize: '0.7rem' }}>{user.role}</span>
              <button
                onClick={onLogout}
                style={{ background: 'none', border: 0, color: '#ef5350', cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: '4px' }}
                title="Cerrar Sesión"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

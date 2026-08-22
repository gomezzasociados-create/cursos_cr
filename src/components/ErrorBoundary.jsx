import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught Error in React Component Tree:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#030303',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '600px',
            background: '#0d0d0d',
            border: '2px solid #ef5350',
            borderRadius: '20px',
            padding: '36px 28px',
            boxShadow: '0 10px 40px rgba(239, 83, 80, 0.3)'
          }}>
            <h2 style={{ color: '#ef5350', margin: '0 0 12px 0', fontSize: '1.8rem' }}>
              ⚠️ Ocurrió un error en la aplicación
            </h2>
            <p style={{ color: '#ccc', fontSize: '1rem', marginBottom: '20px' }}>
              {this.state.error?.message || "Error inesperado durante la carga de la vista."}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #FFDF73 0%, #D4AF37 100%)',
                color: '#000',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '24px',
                fontWeight: '900',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              🔄 Recargar Aplicación
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

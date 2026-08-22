import React, { useState, useEffect } from 'react';
import { ShoppingBag, ShieldCheck, Sparkles, Check, CreditCard, Lock, Mail, Star, ArrowRight, Zap, BookOpen, Tag } from 'lucide-react';

export default function EcommerceView({ onDirectLoginVirtual }) {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', cardNumber: '4242 •••• •••• 4242', exp: '12/28', cvc: '888' });
  const [loading, setLoading] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await fetch('/api/courses');
      const data = await res.json();
      setCourses(data || []);
    } catch (err) {
      console.error("Error al obtener catálogo de cursos:", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleOpenCheckout = (course) => {
    setSelectedCourse(course);
    setCheckoutResult(null);
    setShowCheckout(true);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ecommerce/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          cardNumber: form.cardNumber,
          courseId: selectedCourse?.id,
          courseTitle: selectedCourse?.title,
          amount: selectedCourse?.price
        })
      });

      const data = await res.json();
      if (res.ok) {
        setCheckoutResult(data);
      } else {
        alert(data.error || "Error en el pago");
      }
    } catch (err) {
      alert("Error procesando pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '30px 16px', color: '#fff' }}>
      
      {/* Header Banner */}
      <div style={{
        textAlign: 'center',
        padding: '50px 20px',
        background: 'radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
        borderRadius: '24px',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        marginBottom: '40px'
      }}>
        <span className="badge-gold" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
          ✨ TIENDA E-COMMERCE • CATÁLOGO DE CURSOS PROFESIONALES
        </span>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '900', color: '#FFDF73', margin: '16px 0', letterSpacing: '1px', textTransform: 'uppercase', textShadow: '0 2px 20px rgba(212, 175, 55, 0.4)' }}>
          Catálogo Oficial de Capacitación Híbrida
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#d4d4d4', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
          Selecciona tu curso de especialización. Al inscribirte, se creará tu perfil de <strong>Alumno Virtual</strong> con acceso inmediato a la plataforma interactiva.
        </p>
      </div>

      {/* DYNAMIC MULTI-COURSE CATALOG GRID */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ color: '#FFDF73', fontSize: '1.6rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={24} /> Cursos Disponibles en la Plataforma ({courses.length})
          </h2>
          <span className="badge-green">Matriculación Automática en 1 Clic</span>
        </div>

        {loadingCourses ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#FFDF73' }}>
            Cargando catálogo de cursos...
          </div>
        ) : courses.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#a0a0a0' }}>No hay cursos publicados en la tienda en este momento.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '28px'
          }}>
            {courses.map((course) => (
              <div 
                key={course.id}
                className="glass-panel"
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  background: 'linear-gradient(180deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.98) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                  position: 'relative'
                }}
              >
                {/* Course Cover Poster */}
                <div style={{
                  height: '200px',
                  backgroundImage: `url(${course.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  borderBottom: '1px solid rgba(212,175,55,0.3)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <span className="badge-gold" style={{ background: '#D4AF37', color: '#000', fontWeight: 'bold' }}>
                      {course.badge || 'DESTACADO'}
                    </span>
                    <span className="badge-green">
                      {course.category}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 10px 0', color: '#FFDF73', fontSize: '1.35rem', fontWeight: '800', lineHeight: 1.3 }}>
                      {course.title}
                    </h3>
                    <p style={{ color: '#a0a0a0', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                      {course.description}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: '#a0a0a0', display: 'block' }}>Inversión Única</span>
                        <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFDF73' }}>
                          ${course.price.toFixed(2)} USD
                        </span>
                        {course.originalPrice > course.price && (
                          <span style={{ fontSize: '0.85rem', color: '#888', textDecoration: 'line-through', marginLeft: '8px' }}>
                            ${course.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="badge-gold" style={{ fontSize: '0.75rem' }}>
                        {course.phasesCount || 5} Fases con Examen
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenCheckout(course)}
                      className="gold-btn"
                      style={{ width: '100%', padding: '14px', justifyContent: 'center' }}
                    >
                      Inscribirme Ahora (Acceso Inmediato) <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CHECKOUT MODAL */}
      {showCheckout && selectedCourse && (
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
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0a0a0a',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '550px',
            padding: '30px',
            boxShadow: '0 20px 50px rgba(212, 175, 55, 0.3)'
          }}>
            
            {checkoutResult ? (
              /* SUCCESS STATE */
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(76,175,80,0.2)', border: '2px solid #4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#81c784' }}>
                  <Check size={32} />
                </div>
                <h3 style={{ color: '#FFDF73', fontSize: '1.6rem', margin: '0 0 8px 0' }}>
                  ¡Compra Exitosa y Alumno Matriculado!
                </h3>
                <p style={{ color: '#e0e0e0', fontSize: '0.95rem', marginBottom: '20px' }}>
                  Has adquirido <strong>{selectedCourse.title}</strong>. Se generaron tus credenciales de <strong>Alumno Virtual</strong>.
                </p>

                <div style={{
                  background: '#050505',
                  border: '1px solid rgba(76, 175, 80, 0.4)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'left',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#81c784', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    <Mail size={16} /> CORREO ENVIADO VÍA AUTOMATIZACIÓN
                  </div>
                  <pre style={{ color: '#d4d4d4', fontSize: '0.8rem', whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'monospace' }}>
                    {checkoutResult.emailContent}
                  </pre>
                </div>

                <button 
                  onClick={() => {
                    setShowCheckout(false);
                    onDirectLoginVirtual(checkoutResult.credentials);
                  }}
                  className="gold-btn"
                  style={{ width: '100%', padding: '14px' }}
                >
                  🚀 Entrar como Alumno Virtual a tu Curso
                </button>
              </div>
            ) : (
              /* FORM STATE */
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '12px' }}>
                  <div>
                    <span className="badge-gold">PASARELA DE PAGO STRIPE</span>
                    <h3 style={{ margin: '4px 0 0 0', color: '#FFDF73', fontSize: '1.2rem', fontWeight: '800' }}>
                      {selectedCourse.title}
                    </h3>
                  </div>
                  <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 0, color: '#a0a0a0', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                </div>

                <div style={{ background: 'rgba(212,175,55,0.1)', padding: '12px', borderRadius: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#fff' }}>Total a pagar:</span>
                  <strong style={{ fontSize: '1.4rem', color: '#FFDF73' }}>${selectedCourse.price.toFixed(2)} USD</strong>
                </div>

                <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0a0a0', marginBottom: '4px' }}>Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Ej. Valeria Mendoza"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#050505', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0a0a0', marginBottom: '4px' }}>Correo Electrónico (Recibirás tus credenciales)</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="valeria@ejemplo.com"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#050505', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0a0a0', marginBottom: '4px' }}>Tarjeta de Crédito / Débito</label>
                    <input
                      type="text"
                      required
                      value={form.cardNumber}
                      onChange={e => setForm({ ...form, cardNumber: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#050505', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0a0a0', marginBottom: '4px' }}>Vencimiento</label>
                      <input
                        type="text"
                        value={form.exp}
                        onChange={e => setForm({ ...form, exp: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#050505', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0a0a0', marginBottom: '4px' }}>CVC</label>
                      <input
                        type="text"
                        value={form.cvc}
                        onChange={e => setForm({ ...form, cvc: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#050505', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="gold-btn" disabled={loading} style={{ width: '100%', padding: '14px', marginTop: '10px' }}>
                    {loading ? 'Procesando Pago Seguro...' : `Pagar $${selectedCourse.price.toFixed(2)} USD y Recibir Acceso`}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

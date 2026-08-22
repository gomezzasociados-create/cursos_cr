import React, { useState } from 'react';
import HtmlPlayer from './HtmlPlayer.jsx';
import { Eye, EyeOff, Type, Monitor, Layout, BookOpen, Maximize2, X } from 'lucide-react';

function renderUnescapedHtml(htmlString) {
  if (!htmlString) return '';
  let str = htmlString.trim();
  
  if (str.includes('&lt;') || str.includes('&gt;')) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(str, 'text/html');
      str = doc.body.textContent || str;
    } catch (e) {
      console.warn("Error decoding HTML entities:", e);
    }
  }
  return str;
}

export default function TheorySection({ showFullscreenBtn = true, customHtml = null }) {
  const [allOpen, setAllOpen] = useState(false);
  const [fontSizeMode, setFontSizeMode] = useState('grande'); // 'normal' | 'grande' | 'gigante'
  const [renderMode, setRenderMode] = useState('direct'); // 'direct' | 'player'
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);

  const cleanHtml = renderUnescapedHtml(customHtml);

  const toggleAllAccordions = () => {
    const detailsElements = document.querySelectorAll('#theoryContainer details.tech-card, #fullscreenTheoryModal details.tech-card');
    const newState = !allOpen;
    setAllOpen(newState);

    detailsElements.forEach((el) => {
      if (newState) {
        el.setAttribute('open', 'true');
      } else {
        el.removeAttribute('open');
      }
    });
  };

  const getContainerClass = () => {
    if (fontSizeMode === 'gigante') return 'roadmap-container fz-gigante';
    if (fontSizeMode === 'grande') return 'roadmap-container fz-grande';
    return 'roadmap-container';
  };

  const openFullscreenProjection = () => {
    setShowFullscreenModal(true);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const closeFullscreenProjection = () => {
    setShowFullscreenModal(false);
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="roadmap-wrapper" id="theoryContainer" style={{ width: '100%', maxWidth: '100%' }}>
      <div className={getContainerClass()} style={{ width: '100%', maxWidth: '100%' }}>
        
        {/* TARJETA ACORDEÓN MAESTRA GRANDE Y BONITA (INICIA CERRADA POR DEFECTO) */}
        <details className="master-accordion-card" style={{ width: '100%' }}>
          <summary className="master-accordion-header" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', width: '100%' }}>
              <div>
                <span className="fx-tag" style={{ marginBottom: '8px' }}>
                  <BookOpen size={14} /> SECCIÓN A • TEORÍA INTEGRADA Y PANTALLA COMPLETA
                </span>
                <h3 style={{ margin: '8px 0 4px 0', fontSize: '2rem', fontWeight: '900', color: '#ffffff', letterSpacing: '0.5px' }}>
                  📘 Módulo de Teoría & Manual Operativo
                </h3>
                <p style={{ margin: 0, color: '#d0d0d0', fontSize: '1.1rem' }}>
                  Haz clic aquí para abrir la tarjeta de teoría y ver todo el manual operativo.
                </p>
              </div>

              <div className="master-toggle-icon" title="Abrir / Plegar Sección A">
                ▼
              </div>
            </div>
          </summary>

          <div className="master-accordion-body" style={{ width: '100%' }}>
            
            {/* BARRA DE CONTROLES FX & TAMAÑO DE LETRA GIGANTE */}
            <div className="fx-toolbar" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span className="fx-tag">
                  <span className="fx-dot"></span> CONTROLES DE LECTURA 4K
                </span>
                <span style={{ fontSize: '0.9rem', color: '#e0e0e0', fontWeight: '600' }}>
                  Modo Maestro & Alumnos
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                
                {/* Toggle de Modo de Vista */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid #D4AF37',
                  borderRadius: '12px',
                  padding: '3px'
                }}>
                  <button
                    onClick={() => setRenderMode('direct')}
                    style={{
                      background: renderMode === 'direct' ? '#D4AF37' : 'transparent',
                      color: renderMode === 'direct' ? '#000' : '#FFDF73',
                      border: 0,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Layout size={13} /> Vista Directa HD
                  </button>
                  <button
                    onClick={() => setRenderMode('player')}
                    style={{
                      background: renderMode === 'player' ? '#D4AF37' : 'transparent',
                      color: renderMode === 'player' ? '#000' : '#FFDF73',
                      border: 0,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Monitor size={13} /> Reproductor HTML
                  </button>
                </div>

                {/* Selector de Tamaño de Letra */}
                {renderMode === 'direct' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid #D4AF37',
                    borderRadius: '12px',
                    padding: '3px'
                  }}>
                    <span style={{ color: '#FFDF73', fontSize: '0.8rem', fontWeight: '800', padding: '0 6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Type size={13} /> Letra:
                    </span>
                    <button
                      onClick={() => setFontSizeMode('normal')}
                      style={{
                        background: fontSizeMode === 'normal' ? '#D4AF37' : 'transparent',
                        color: fontSizeMode === 'normal' ? '#000' : '#fff',
                        border: 0,
                        padding: '3px 8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '800',
                        fontSize: '0.78rem'
                      }}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => setFontSizeMode('grande')}
                      style={{
                        background: fontSizeMode === 'grande' ? '#D4AF37' : 'transparent',
                        color: fontSizeMode === 'grande' ? '#000' : '#fff',
                        border: 0,
                        padding: '3px 8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '800',
                        fontSize: '0.78rem'
                      }}
                    >
                      Grande (24px)
                    </button>
                    <button
                      onClick={() => setFontSizeMode('gigante')}
                      style={{
                        background: fontSizeMode === 'gigante' ? '#FFDF73' : 'transparent',
                        color: fontSizeMode === 'gigante' ? '#000' : '#fff',
                        border: 0,
                        padding: '3px 8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '900',
                        fontSize: '0.78rem',
                        boxShadow: fontSizeMode === 'gigante' ? '0 0 10px #FFDF73' : 'none'
                      }}
                    >
                      GIGANTE (32px)
                    </button>
                  </div>
                )}

                {renderMode === 'direct' && (
                  <button
                    onClick={toggleAllAccordions}
                    className="gold-btn-outline"
                    style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                  >
                    {allOpen ? <EyeOff size={15} /> : <Eye size={15} />}
                    {allOpen ? 'Plegar Todo' : 'Desplegar Todo'}
                  </button>
                )}

                {showFullscreenBtn && (
                  <button
                    onClick={openFullscreenProjection}
                    className="gold-btn"
                    style={{ fontSize: '0.9rem', padding: '10px 18px' }}
                  >
                    <Maximize2 size={16} /> 📺 Proyectar Clase (Pantalla Completa)
                  </button>
                )}
              </div>
            </div>

            {/* SI ESTÁ ACTIVO EL MODO REPRODUCTOR HTML */}
            {renderMode === 'player' ? (
              <HtmlPlayer 
                htmlCode={cleanHtml || `
                  <div style="padding: 20px; font-family: sans-serif; color: #fff; width: 100%;">
                    <h2 style="color: #FFDF73;">Módulo 1: Técnica de Atención & Neuroventas</h2>
                    <p>Carga el código HTML desde el Admin para ejecutarlo en vivo.</p>
                  </div>
                `}
                title="Sección A • Reproductor HTML en Vivo Canvas" 
              />
            ) : (
              /* MODO VISTA DIRECTA IMPACTANTE CON LETRAS GIGANTES Y TARJETAS ACORDEÓN EN ANCHO COMPLETO */
              <div style={{ width: '100%' }}>
                {cleanHtml && cleanHtml.length > 0 ? (
                  <div style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: cleanHtml }} />
                ) : (
                  <>
                    {/* HERO HEADER */}
                    <div className="header-section" style={{ width: '100%' }}>
                      <h2>Módulo 1: Técnica de Atención & Neuroventas</h2>
                      <p className="header-desc" style={{ width: '100%', maxWidth: '100%' }}>
                        El manual operativo definitivo. Transforma la visita presencial en una experiencia inmersiva combinando psicología, neuroventas y una ejecución técnica impecable.
                      </p>
                    </div>
                    
                    {/* LAS 5 FASES CON ACORDEÓN DE ALTO IMPACTO EN ANCHO COMPLETO */}
                    <div className="phases-grid" style={{ width: '100%' }}>
                      
                      {/* FASE 1: RECEPCIÓN */}
                      <details className="tech-card" style={{ width: '100%' }}>
                        <summary className="tech-header" style={{ width: '100%' }}>
                          <div className="phase-top">
                            <div className="phase-number">FASE 1 • RECEPCIÓN</div>
                            <div className="toggle-icon">▼</div>
                          </div>
                          <div className="phase-title">Bienvenida y Anclaje Espacial</div>
                          <div className="phase-desc">Los primeros 30 segundos presenciales que determinan el valor percibido del servicio.</div>
                        </summary>
                        <div className="tech-body" style={{ width: '100%' }}>
                          <div className="intro-text">
                            "El cerebro humano toma una decisión subconsciente sobre tu profesionalismo en los primeros 7 segundos de verte. Tu recepción es tu portada."
                          </div>
                          
                          <div className="premium-box">
                            <div className="premium-box-title">🤝 Lenguaje Corporal de Alto Nivel</div>
                            <p className="box-text">La forma en que te mueves transmite si eres un masajista promedio o un terapeuta premium.</p>
                            <ul className="premium-list">
                              <li><span className="highlight-gold">Ruptura de Barreras:</span> Nunca saludes detrás de un mostrador. Sal a recibirla al área de espera. El mostrador crea una relación "Cajero-Cliente", salir crea una relación "Anfitrión-Invitado".</li>
                              <li><span className="highlight-gold">El Triángulo de la Mirada:</span> Al hablar, mira ojo izquierdo, ojo derecho y el puente de la nariz. Esto demuestra atención profunda sin ser intimidante.</li>
                              <li><span className="highlight-gold">Sincronización de Ritmo:</span> Las pacientes llegan con la "energía de la calle" (tráfico, estrés). Háblales un 20% más lento y en un tono más bajo de normal para obligar a sus neuronas espejo a calmarse.</li>
                            </ul>
                          </div>

                          <div className="premium-box">
                            <div className="premium-box-title">⏱️ Manejo Magistral de Tiempos</div>
                            <p className="box-text">El tiempo en un Spa se percibe diferente. Un minuto de espera sola se siente como diez.</p>
                            <ul className="premium-list">
                              <li><span className="highlight-gold">El Ritual de Descompresión:</span> Tan pronto cruza la puerta, ofrece una toallita tibia oshibori para limpiarse las manos. Psicológicamente, esto "limpia" el estrés del exterior.</li>
                              <li><span className="highlight-gold">Si vas retrasada (Plan de Crisis):</span> Nunca digas "Perdón por el retraso". Di: <span className="highlight-white">"Gracias por tu paciencia, estoy terminando de preparar tu cabina para que esté perfecta."</span> Cámbialo de una falla tuya a un beneficio para ella.</li>
                            </ul>
                          </div>

                          <details className="inner-modal">
                            <summary className="inner-btn">💪 Ejercicio Práctico: El Espejo Mudo</summary>
                            <div className="modal-content-box">
                              <strong style={{ color: '#81c784', fontSize: '1.3rem', display: 'block', marginBottom: '14px' }}>Coreografía de Bienvenida</strong>
                              <p style={{ marginBottom: '16px' }}>Este ejercicio calibra tu lenguaje corporal sin usar palabras.</p>
                              <div className="exercise-step"><strong>Paso 1:</strong> Finge que un cliente entra por la puerta. Levántate, camina hacia el cliente imaginario sin cruzar los brazos.</div>
                              <div className="exercise-step"><strong>Paso 2:</strong> Practica la "Sonrisa Duchenne" (la sonrisa genuina que arruga las esquinas de los ojos).</div>
                              <div className="exercise-step"><strong>Paso 3:</strong> Extiende el brazo con la palma hacia arriba (gesto de apertura) para indicarle dónde sentarse. <em>Nunca apuntes con el dedo índice.</em></div>
                            </div>
                          </details>
                        </div>
                      </details>

                      {/* FASE 2: DIAGNÓSTICO */}
                      <details className="tech-card" style={{ width: '100%' }}>
                        <summary className="tech-header" style={{ width: '100%' }}>
                          <div className="phase-top">
                            <div className="phase-number">FASE 2 • DIAGNÓSTICO</div>
                            <div className="toggle-icon">▼</div>
                          </div>
                          <div className="phase-title">Lectura Emocional y Entrevista Clínica</div>
                          <div className="phase-desc">Cómo descubrir el verdadero dolor del cliente antes de pasar a la camilla.</div>
                        </summary>
                        <div className="tech-body" style={{ width: '100%' }}>
                          <div className="intro-text">
                            "Nadie compra un masaje reductor porque quiere un masaje. Lo compran porque quieren ponerse ese vestido en verano sin sentir vergüenza. Descubre el motivo real."
                          </div>
                          
                          <div className="premium-box">
                            <div className="premium-box-title">🗣️ Técnica de Indagación F.O.R.D.</div>
                            <p className="box-text">Mientras llenan la ficha clínica, no hagas un interrogatorio policial. Usa conversación estructurada sobre:</p>
                            <ul className="premium-list">
                              <li><span className="highlight-gold">Familia (Family):</span> "¿Tienes hijos pequeños? Debes cargar mucho peso, eso explica la tensión lumbar."</li>
                              <li><span className="highlight-gold">Ocupación (Occupation):</span> "¿Trabajas en oficina? El sedentarismo retiene líquidos, vamos a enfocar el drenaje ahí."</li>
                              <li><span className="highlight-gold">Recreación (Recreation):</span> "¿Haces algún deporte? Necesitaremos estiramientos específicos."</li>
                              <li><span className="highlight-gold">Deseos (Dreams):</span> "¿Tienes algún evento importante pronto? Perfecto, dejaremos tu piel radiante para esa fecha."</li>
                            </ul>
                          </div>

                          <div className="premium-box">
                            <div className="premium-box-title">🛡️ Manejo de Inseguridades y Confidencialidad</div>
                            <p className="box-text">Las cabinas de Spa son confesionarios. El cliente se desnudará física y emocionalmente.</p>
                            <ul className="premium-list">
                              <li><span className="highlight-gold">Neutralidad Absoluta:</span> Si la paciente dice "Tengo demasiada celulitis", jamás digas "Sí, un poco" ni "Estás perfecta" (se siente falso). Responde: <span className="highlight-white">"Tu cuerpo es completamente normal. Mi trabajo hoy es ayudarte a liberar esa toxina, relájate."</span></li>
                              <li><span className="highlight-gold">Escucha Activa 80/20:</span> El cliente habla el 80% del tiempo. Tú guías con preguntas abiertas y tomas notas minuciosas.</li>
                            </ul>
                          </div>

                          <details className="inner-modal">
                            <summary className="inner-btn">💪 Ejercicio Práctico: Roleplay F.O.R.D.</summary>
                            <div className="modal-content-box">
                              <strong style={{ color: '#81c784', fontSize: '1.3rem', display: 'block', marginBottom: '14px' }}>Técnica de Pregunta Puente</strong>
                              <div className="exercise-step"><strong>Pregunta:</strong> "¿Qué zona de tu cuerpo ha sentido más la tensión en estas últimas dos semanas?"</div>
                              <div className="exercise-step"><strong>Reacción:</strong> Valida sin juzgar y anota el punto exacto de contractura en el mapa anatómico.</div>
                            </div>
                          </details>
                        </div>
                      </details>

                      {/* FASE 3: ATMÓSFERA */}
                      <details className="tech-card" style={{ width: '100%' }}>
                        <summary className="tech-header" style={{ width: '100%' }}>
                          <div className="phase-top">
                            <div className="phase-number">FASE 3 • ATMÓSFERA</div>
                            <div className="toggle-icon">▼</div>
                          </div>
                          <div className="phase-title">Arquitectura Sensorial Extrema</div>
                          <div className="phase-desc">Mapeo detallado de los 5 sentidos para inducir estados alfa cerebrales.</div>
                        </summary>
                        <div className="tech-body" style={{ width: '100%' }}>
                          <div className="intro-text">
                            "Si tocas a un cliente estresado, tu masaje será doloroso y deficiente. La cabina debe relajarlo antes de que le pongas un dedo encima."
                          </div>
                          
                          <div className="premium-box">
                            <div className="premium-box-title">🧠 Manipulación Ambiental Positiva</div>
                            <ul className="premium-list">
                              <li><span className="highlight-gold">Termorregulación (Tacto):</span> La camilla siempre debe estar a temperatura corporal (36.5°C). Las manos de la terapeuta JAMÁS deben tocar al cliente frías.</li>
                              <li><span className="highlight-gold">Frecuencias Acústicas (Oído):</span> Prohibido música comercial con voz. Usa frecuencias Solfeggio (432Hz o 528Hz) y sonidos orgánicos binaurales.</li>
                              <li><span className="highlight-gold">Coreografía de Luces (Vista):</span> Usa lámparas de sal del Himalaya o velas indirectas. Cuando el cliente está boca arriba, debe ver penumbra absoluta.</li>
                              <li><span className="highlight-gold">Aromaterapia Neuro-Olfativa (Olfato):</span> Difusión de lavanda francesa y bergama a nivel molecular.</li>
                            </ul>
                          </div>

                          <details className="inner-modal">
                            <summary className="inner-btn">💪 Check de Bioseguridad y Clima</summary>
                            <div className="modal-content-box">
                              <div className="exercise-step"><strong>Calentamiento de Manos:</strong> Fricciona tus palmas vigorosamente durante 15 segundos antes del primer contacto.</div>
                            </div>
                          </details>
                        </div>
                      </details>

                      {/* FASE 4: CABINA */}
                      <details className="tech-card" style={{ width: '100%' }}>
                        <summary className="tech-header" style={{ width: '100%' }}>
                          <div className="phase-top">
                            <div className="phase-number">FASE 4 • CABINA</div>
                            <div className="toggle-icon">▼</div>
                          </div>
                          <div className="phase-title">Coreografía del Contacto y Privacidad</div>
                          <div className="phase-desc">Cómo navegar la sesión garantizando máximo confort, pudor y resultados.</div>
                        </summary>
                        <div className="tech-body" style={{ width: '100%' }}>
                          <div className="intro-text">
                            "Un toque dudoso genera desconfianza; un toque firme, seguro y profesional genera sumisión absoluta al tratamiento."
                          </div>
                          
                          <div className="premium-box">
                            <div className="premium-box-title">🔒 El Protocolo del Pudor (Draping)</div>
                            <ul className="premium-list">
                              <li><span className="highlight-gold">Cobertura Quirúrgica:</span> Solo se descubre la zona exacta que se va a trabajar. El resto del cuerpo permanece envuelto.</li>
                              <li><span className="highlight-gold">Transiciones Suaves:</span> Al pedirle que se dé la vuelta, levanta la sábana grande para crear una "carpa" visual y gira tu mirada hacia la pared.</li>
                            </ul>
                          </div>

                          <div className="premium-box">
                            <div className="premium-box-title">⚖️ Comunicación Silenciosa</div>
                            <ul className="premium-list">
                              <li><span className="highlight-gold">Micro-Chequeos:</span> A los 3 minutos haz una única pregunta: <span className="highlight-white">"Cris, del 1 al 10, ¿qué tan cómoda sientes la presión?"</span> Una vez ajustada, guarda silencio.</li>
                              <li><span className="highlight-gold">Contacto Continuo:</span> Si necesitas agarrar más aceite, mantén SIEMPRE una mano sobre el cuerpo del cliente.</li>
                            </ul>
                          </div>
                        </div>
                      </details>

                      {/* FASE 5: DESPEDIDA SENSORIAL */}
                      <details className="tech-card" style={{ width: '100%' }}>
                        <summary className="tech-header" style={{ width: '100%' }}>
                          <div className="phase-top">
                            <div className="phase-number">FASE 5 • DESPEDIDA SENSORIAL</div>
                            <div className="toggle-icon">▼</div>
                          </div>
                          <div className="phase-title">El Aterrizaje del Sistema Nervioso</div>
                          <div className="phase-desc">Cómo devolverlos a la realidad suavemente para entregarlos al área de cierre.</div>
                        </summary>
                        <div className="tech-body" style={{ width: '100%' }}>
                          <div className="intro-text">
                            "La atención no termina cuando dejas de masajear. Termina cuando el cliente sale por la puerta sintiendo que estuvo en otro planeta."
                          </div>
                          
                          <div className="premium-box">
                            <div className="premium-box-title">🌅 Transición al Estado Consciente</div>
                            <ul className="premium-list">
                              <li><span className="highlight-gold">Toque de Anclaje Final:</span> Termina con una compresión firme en los hombros. Habla en voz muy baja: <span className="highlight-white">"Con esto concluimos la sesión de hoy. Tómate tu tiempo. Te espero afuera con tu infusión."</span></li>
                              <li><span className="highlight-gold">El Sello Gustativo:</span> Al salir de la cabina, ofrécele agua infusionada con romero o un té matcha. El sabor exótico cierra la experiencia y la prepara para la técnica de Ventas en recepción.</li>
                            </ul>
                          </div>
                        </div>
                      </details>

                    </div>
                  </>
                )}
              </div>
            )}

          </div>
        </details>

      </div>

      {/* --- MODO PRESENTACIÓN IMPECABLE (100% ANCHO DE LA PANTALLA, SOLO TEXTO GIGANTE, SIN DISTRACCIONES) --- */}
      {showFullscreenModal && (
        <div 
          className="no-scrollbar"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000000',
            zIndex: 999999999,
            overflowY: 'scroll',
            overflowX: 'hidden',
            boxSizing: 'border-box',
            padding: '40px 30px 180px 30px'
          }}
        >
          {/* BOTÓN DISCRETO FLOTANTE DE SALIDA */}
          <button
            onClick={closeFullscreenProjection}
            className="discrete-exit-btn"
            style={{
              position: 'fixed',
              top: '20px',
              right: '24px',
              background: 'rgba(212, 175, 55, 0.2)',
              color: '#FFDF73',
              border: '1px solid #D4AF37',
              borderRadius: '30px',
              padding: '8px 18px',
              cursor: 'pointer',
              fontWeight: '900',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              zIndex: 9999999999,
              backdropFilter: 'blur(10px)'
            }}
          >
            <X size={16} /> Salir de Presentación
          </button>

          {/* LIENZO 100% ANCHO DE LA PANTALLA CON TEXTO Y CONTENIDO TEÓRICO EN TAMAÑO GIGANTE */}
          <div style={{ width: '100%', maxWidth: '100%' }}>
            {cleanHtml && cleanHtml.length > 0 ? (
              <div 
                className="fz-gigante"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
                style={{ color: '#ffffff', fontSize: '2.2rem', lineHeight: '2.1', width: '100%' }}
              />
            ) : (
              <div className="fz-gigante" style={{ width: '100%' }}>
                <div className="header-section" style={{ marginBottom: '60px', width: '100%' }}>
                  <h2 style={{ fontSize: '4.2rem', color: '#FFDF73', marginBottom: '24px' }}>
                    Módulo 1: Técnica de Atención & Neuroventas
                  </h2>
                  <p className="header-desc" style={{ fontSize: '2rem', color: '#e0e0e0', width: '100%', maxWidth: '100%' }}>
                    El manual operativo definitivo. Transforma la visita presencial en una experiencia inmersiva combinando psicología, neuroventas y una ejecución técnica impecable.
                  </p>
                </div>

                <div className="phases-grid" style={{ gap: '40px', width: '100%' }}>
                  
                  {/* FASE 1 */}
                  <details className="tech-card" open={true} style={{ width: '100%' }}>
                    <summary className="tech-header" style={{ width: '100%' }}>
                      <div className="phase-top">
                        <div className="phase-number" style={{ fontSize: '1.4rem' }}>FASE 1 • RECEPCIÓN</div>
                      </div>
                      <div className="phase-title" style={{ fontSize: '3rem', color: '#FFDF73' }}>Bienvenida y Anclaje Espacial</div>
                      <div className="phase-desc" style={{ fontSize: '1.8rem' }}>Los primeros 30 segundos presenciales que determinan el valor percibido del servicio.</div>
                    </summary>
                    <div className="tech-body" style={{ width: '100%' }}>
                      <div className="intro-text" style={{ fontSize: '2.2rem' }}>
                        "El cerebro humano toma una decisión subconsciente sobre tu profesionalismo en los primeros 7 segundos de verte. Tu recepción es tu portada."
                      </div>
                      
                      <div className="premium-box" style={{ width: '100%' }}>
                        <div className="premium-box-title" style={{ fontSize: '2.2rem' }}>🤝 Lenguaje Corporal de Alto Nivel</div>
                        <ul className="premium-list" style={{ width: '100%' }}>
                          <li><span className="highlight-gold">Ruptura de Barreras:</span> Nunca saludes detrás de un mostrador. Sal a recibirla al área de espera. El mostrador crea una relación "Cajero-Cliente", salir crea una relación "Anfitrión-Invitado".</li>
                          <li><span className="highlight-gold">El Triángulo de la Mirada:</span> Al hablar, mira ojo izquierdo, ojo derecho y el puente de la nariz. Esto demuestra atención profunda sin ser intimidante.</li>
                          <li><span className="highlight-gold">Sincronización de Ritmo:</span> Las pacientes llegan con la "energía de la calle" (tráfico, estrés). Háblales un 20% más lento y en un tono más bajo de normal para obligar a sus neuronas espejo a calmarse.</li>
                        </ul>
                      </div>

                      <div className="premium-box" style={{ width: '100%' }}>
                        <div className="premium-box-title" style={{ fontSize: '2.2rem' }}>⏱️ Manejo Magistral de Tiempos</div>
                        <ul className="premium-list" style={{ width: '100%' }}>
                          <li><span className="highlight-gold">El Ritual de Descompresión:</span> Tan pronto cruza la puerta, ofrece una toallita tibia oshibori para limpiarse las manos. Psicológicamente, esto "limpia" el estrés del exterior.</li>
                          <li><span className="highlight-gold">Si vas retrasada (Plan de Crisis):</span> Nunca digas "Perdón por el retraso". Di: <span className="highlight-white">"Gracias por tu paciencia, estoy terminando de preparar tu cabina para que esté perfecta."</span> Cámbialo de una falla tuya a un beneficio para ella.</li>
                        </ul>
                      </div>
                    </div>
                  </details>

                  {/* FASE 2 */}
                  <details className="tech-card" open={true} style={{ width: '100%' }}>
                    <summary className="tech-header" style={{ width: '100%' }}>
                      <div className="phase-top">
                        <div className="phase-number" style={{ fontSize: '1.4rem' }}>FASE 2 • DIAGNÓSTICO</div>
                      </div>
                      <div className="phase-title" style={{ fontSize: '3rem', color: '#FFDF73' }}>Lectura Emocional y Entrevista Clínica</div>
                      <div className="phase-desc" style={{ fontSize: '1.8rem' }}>Cómo descubrir el verdadero dolor del cliente antes de pasar a la camilla.</div>
                    </summary>
                    <div className="tech-body" style={{ width: '100%' }}>
                      <div className="intro-text" style={{ fontSize: '2.2rem' }}>
                        "Nadie compra un masaje reductor porque quiere un masaje. Lo compran porque quieren ponerse ese vestido en verano sin sentir vergüenza. Descubre el motivo real."
                      </div>
                      
                      <div className="premium-box" style={{ width: '100%' }}>
                        <div className="premium-box-title" style={{ fontSize: '2.2rem' }}>🗣️ Técnica de Indagación F.O.R.D.</div>
                        <ul className="premium-list" style={{ width: '100%' }}>
                          <li><span className="highlight-gold">Familia (Family):</span> "¿Tienes hijos pequeños? Debes cargar mucho peso, eso explica la tensión lumbar."</li>
                          <li><span className="highlight-gold">Ocupación (Occupation):</span> "¿Trabajas en oficina? El sedentarismo retiene líquidos, vamos a enfocar el drenaje ahí."</li>
                          <li><span className="highlight-gold">Recreación (Recreation):</span> "¿Haces algún deporte? Necesitaremos estiramientos específicos."</li>
                          <li><span className="highlight-gold">Deseos (Dreams):</span> "¿Tienes algún evento importante pronto? Perfecto, dejaremos tu piel radiante para esa fecha."</li>
                        </ul>
                      </div>
                    </div>
                  </details>

                  {/* FASE 3 */}
                  <details className="tech-card" open={true} style={{ width: '100%' }}>
                    <summary className="tech-header" style={{ width: '100%' }}>
                      <div className="phase-top">
                        <div className="phase-number" style={{ fontSize: '1.4rem' }}>FASE 3 • ATMÓSFERA</div>
                      </div>
                      <div className="phase-title" style={{ fontSize: '3rem', color: '#FFDF73' }}>Arquitectura Sensorial Extrema</div>
                    </summary>
                    <div className="tech-body" style={{ width: '100%' }}>
                      <div className="intro-text" style={{ fontSize: '2.2rem' }}>
                        "Si tocas a un cliente estresado, tu masaje será doloroso y deficiente. La cabina debe relajarlo antes de que le pongas un dedo encima."
                      </div>
                    </div>
                  </details>

                  {/* FASE 4 */}
                  <details className="tech-card" open={true} style={{ width: '100%' }}>
                    <summary className="tech-header" style={{ width: '100%' }}>
                      <div className="phase-top">
                        <div className="phase-number" style={{ fontSize: '1.4rem' }}>FASE 4 • CABINA</div>
                      </div>
                      <div className="phase-title" style={{ fontSize: '3rem', color: '#FFDF73' }}>Coreografía del Contacto y Privacidad</div>
                    </summary>
                    <div className="tech-body" style={{ width: '100%' }}>
                      <div className="intro-text" style={{ fontSize: '2.2rem' }}>
                        "Un toque dudoso genera desconfianza; un toque firme, seguro y profesional genera sumisión absoluta al tratamiento."
                      </div>
                    </div>
                  </details>

                  {/* FASE 5 */}
                  <details className="tech-card" open={true} style={{ width: '100%' }}>
                    <summary className="tech-header" style={{ width: '100%' }}>
                      <div className="phase-top">
                        <div className="phase-number" style={{ fontSize: '1.4rem' }}>FASE 5 • DESPEDIDA SENSORIAL</div>
                      </div>
                      <div className="phase-title" style={{ fontSize: '3rem', color: '#FFDF73' }}>El Aterrizaje del Sistema Nervioso</div>
                    </summary>
                    <div className="tech-body" style={{ width: '100%' }}>
                      <div className="intro-text" style={{ fontSize: '2.2rem' }}>
                        "La atención no termina cuando dejas de masajear. Termina cuando el cliente sale por la puerta sintiendo que estuvo en otro planeta."
                      </div>
                    </div>
                  </details>

                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

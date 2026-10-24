import React, { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  favoritos: number[];
}

interface HeaderProps {
  usuario: Usuario | null;
  favoritos: number[];
  onAbrirLogin: () => void;
  onCerrarSesion: () => void;
  onMostrarFavoritos: () => void;
  onMostrarTodos: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  usuario, 
  favoritos,
  onAbrirLogin, 
  onCerrarSesion, 
  onMostrarFavoritos,
  onMostrarTodos
}) => {
  const [tema, setTema] = useState<string>('light');

  useEffect(() => {
    const temaGuardado = localStorage.getItem('theme') || 'light';
    setTema(temaGuardado);
    document.documentElement.setAttribute('data-theme', temaGuardado);
  }, []);

  const toggleTema = () => {
    const nuevoTema = tema === 'light' ? 'dark' : 'light';
    setTema(nuevoTema);
    document.documentElement.setAttribute('data-theme', nuevoTema);
    localStorage.setItem('theme', nuevoTema);
  };

   const probarNotificacion = async () => {
    try {
      // Solicitar permisos para Android 13+
      const permiso = await LocalNotifications.requestPermissions();
      if (permiso.display !== 'granted') {
        alert('Necesitas dar permisos de notificación en tu teléfono.');
        return;
      }

      // Programar notificación con 2 segundos de retraso
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Glosario TI',
            body: '¡Nuevo término agregado! Revisa las últimas actualizaciones.',
            id: 1,
            schedule: { at: new Date(Date.now() + 1000 * 2) }
          }
        ]
      });
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      alert('Error al enviar la notificación');
    }
  };

  return (
    <header id="header" role="banner">
      <div className="logo">
        <img src="/img/logo-192x192.png" alt="Glosario TI Logo" className="logo-img" />
        Glosario TI
      </div>
      <nav role="navigation" aria-label="Menú principal">
        <ul>
          <li><a href="#glosario" onClick={onMostrarTodos}>Inicio</a></li>
          
          {usuario ? (
            <>
              <li>
                <button onClick={onMostrarFavoritos} className="favoritos-btn">
                  ★ Favoritos ({favoritos.length})
                </button>
              </li>
              
              {/* BOTÓN PARA LA EVIDENCIA DE NOTIFICACIÓN */}
              <li>
                <button 
                  onClick={probarNotificacion} 
                  style={{ 
                    background: '#eab308', 
                    color: '#fff', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '6px', 
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  🔔 Notificar
                </button>
              </li>

              <li className="user-info">
                <span>👤 {usuario.nombre}</span>
                <button onClick={onCerrarSesion} className="logout-btn">
                  Salir
                </button>
              </li>
            </>
          ) : (
            <li>
              <button onClick={onAbrirLogin} className="login-btn">
                🔐 Iniciar Sesión
              </button>
            </li>
          )}
          
          <li>
            <button 
              id="theme-toggle" 
              aria-label="Cambiar tema"
              onClick={toggleTema}
            >
              {tema === 'light' ? '🌙' : '☀️'}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
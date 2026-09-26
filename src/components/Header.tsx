import React, { useState, useEffect } from 'react';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
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
              <li className="user-info">
                <span>👤 {usuario.nombre}</span>
                <button onClick={onCerrarSesion} className="logout-btn">
                  Cerrar Sesión
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
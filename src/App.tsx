import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import Buscador from './components/Buscador';
import Filtros from './components/Filtros';
import TerminoCard from './components/TerminoCard';
import Modal from './components/Modal';
import Login from './components/Login';

interface Termino {
  id: number;
  concepto: string;
  definicionCorta: string;
  definicionLarga: string;
  ejemplos: string[];
  imagen: string;
  categorias: string[];
}

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  favoritos: number[];
}

const API_URL = 'https://glosario-ti-backend.onrender.com/api';

function App() {
  const [terminos, setTerminos] = useState<Termino[]>([]);
  const [terminosFiltrados, setTerminosFiltrados] = useState<Termino[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [terminoModal, setTerminoModal] = useState<Termino | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado de autenticación
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [mostrandoSoloFavoritos, setMostrandoSoloFavoritos] = useState(false);

  // Cargar términos y sesión al inicio
  useEffect(() => {
    cargarTerminos();
    
    const tokenGuardado = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado);
      const user = JSON.parse(usuarioGuardado);
      setUsuario(user);
      setFavoritos(user.favoritos || []);
    }
  }, []);

  const cargarTerminos = async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await axios.get(`${API_URL}/terminos`);
      setTerminos(response.data);
      setCargando(false);
    } catch (error) {
      console.error('Error cargando términos:', error);
      setError('No se pudieron cargar los términos. Verifica que el backend esté ejecutándose.');
      setCargando(false);
    }
  };

  // Filtrar términos
  useEffect(() => {
    let resultados = terminos;

    // Filtro de favoritos
    if (mostrandoSoloFavoritos) {
      resultados = resultados.filter(t => favoritos.includes(t.id));
    }

    // Filtro por categoría
    if (categoriaActiva !== 'Todas') {
      resultados = resultados.filter(termino => 
        termino.categorias && termino.categorias.includes(categoriaActiva)
      );
    }

    // Filtro por búsqueda
    if (busqueda) {
      const lowerBusqueda = busqueda.toLowerCase();
      resultados = resultados.filter(termino =>
        termino.concepto.toLowerCase().includes(lowerBusqueda) ||
        termino.definicionCorta.toLowerCase().includes(lowerBusqueda) ||
        (termino.categorias && termino.categorias.some(cat => 
          cat.toLowerCase().includes(lowerBusqueda)
        ))
      );
    }

    setTerminosFiltrados(resultados);
  }, [terminos, categoriaActiva, busqueda, mostrandoSoloFavoritos, favoritos]);

  const handleLogin = (user: Usuario, userToken: string) => {
    setUsuario(user);
    setToken(userToken);
    setFavoritos(user.favoritos || []);
  };

  const handleCerrarSesion = () => {
    setUsuario(null);
    setToken(null);
    setFavoritos([]);
    setMostrandoSoloFavoritos(false);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    alert('👋 Sesión cerrada');
  };

  const handleToggleFavorito = async (terminoId: number) => {
    if (!usuario || !token) {
      alert('⚠️ Debes iniciar sesión para guardar favoritos');
      return;
    }

    try {
      const esFavorito = favoritos.includes(terminoId);
      const method = esFavorito ? 'delete' : 'post';
      
      await axios({
        method,
        url: `${API_URL}/favoritos/${terminoId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      let nuevosFavoritos;
      if (esFavorito) {
        nuevosFavoritos = favoritos.filter(id => id !== terminoId);
      } else {
        nuevosFavoritos = [...favoritos, terminoId];
      }
      
      // Actualizar AMBOS estados
      setFavoritos(nuevosFavoritos);
      
      const usuarioActualizado = { ...usuario, favoritos: nuevosFavoritos };
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      
    } catch (error) {
      console.error('Error al modificar favorito:', error);
      alert('❌ Error al modificar favorito');
    }
  };

  const handleMostrarFavoritos = () => {
    if (!usuario) return;
    setMostrandoSoloFavoritos(true);
    setCategoriaActiva('Todas');
    setBusqueda('');
  };

  const handleMostrarTodos = () => {
    setMostrandoSoloFavoritos(false);
  };

  const eliminarTermino = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este término?')) {
      try {
        await axios.delete(`${API_URL}/terminos/${id}`);
        setTerminos(terminos.filter(t => t.id !== id));
        alert('✅ Término eliminado correctamente');
      } catch (error) {
        console.error('Error eliminando término:', error);
        alert('❌ Error al eliminar el término');
      }
    }
  };

  if (cargando) {
    return (
      <div className="cargando">
        <div>⏳ Cargando términos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={cargarTerminos} className="retry-btn">
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <Header 
        usuario={usuario}
        favoritos={favoritos}
        onAbrirLogin={() => setMostrarLogin(true)}
        onCerrarSesion={handleCerrarSesion}
        onMostrarFavoritos={handleMostrarFavoritos}
        onMostrarTodos={handleMostrarTodos}
      />
      
      <main id="main-content">
        <section id="glosario" aria-labelledby="glosario-titulo">
          <h2 id="glosario-titulo">
            {mostrandoSoloFavoritos ? '★ Mis Favoritos' : 'Glosario de Términos TI'}
          </h2>
          
          {!mostrandoSoloFavoritos && (
            <>
              <Buscador busqueda={busqueda} setBusqueda={setBusqueda} />
              <Filtros categoriaActiva={categoriaActiva} setCategoriaActiva={setCategoriaActiva} />
            </>
          )}

          <div className="grid-cards">
            {terminosFiltrados.length === 0 ? (
              <div className="no-results">
                <p>
                  {mostrandoSoloFavoritos 
                    ? 'No tienes favoritos guardados aún' 
                    : `No se encontraron términos que coincidan con "${busqueda}"`
                  }
                </p>
                <button 
                  onClick={() => {
                    setBusqueda('');
                    setCategoriaActiva('Todas');
                    setMostrandoSoloFavoritos(false);
                  }} 
                  className="clear-search-btn"
                >
                  Ver todos los términos
                </button>
              </div>
            ) : (
              terminosFiltrados.map(termino => (
                <TerminoCard 
                  key={termino.id}
                  termino={termino}
                  onVerMas={setTerminoModal}
                  onEliminar={eliminarTermino}
                  onToggleFavorito={handleToggleFavorito}
                  esFavorito={favoritos.includes(termino.id)}
                  estaLogueado={!!usuario}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {terminoModal && (
        <Modal termino={terminoModal} onCerrar={() => setTerminoModal(null)} />
      )}

      {mostrarLogin && (
        <Login onLogin={handleLogin} onClose={() => setMostrarLogin(false)} />
      )}
    </div>
  );
}

export default App;
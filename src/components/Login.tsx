import React, { useState } from 'react';
import axios from 'axios';

// ✅ URL del backend en producción (Render)
const API_URL = 'https://glosario-ti-backend.onrender.com/api';

interface LoginProps {
  onLogin: (usuario: any, token: string) => void;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onClose }) => {
  const [esRegistro, setEsRegistro] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const endpoint = esRegistro ? '/auth/registro' : '/auth/login';
      const response = await axios.post(
        `${API_URL}${endpoint}`,  // ← Usa la variable
        formData
      );

      if (esRegistro) {
        alert('✅ Registro exitoso. Ahora puedes iniciar sesión.');
        setEsRegistro(false);
        setFormData({ ...formData, nombre: '' });
      } else {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        onLogin(response.data.usuario, response.data.token);
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error de conexión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-contenido login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cerrar" onClick={onClose} aria-label="Cerrar">
          &times;
        </button>
        
        <h2>{esRegistro ? '📝 Registro' : '🔐 Iniciar Sesión'}</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {esRegistro && (
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                placeholder="Tu nombre"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button type="submit" disabled={cargando} className="submit-btn">
            {cargando ? '⏳ Procesando...' : (esRegistro ? 'Registrarse' : 'Iniciar Sesión')}
          </button>
        </form>

        <button 
          className="toggle-btn"
          onClick={() => {
            setEsRegistro(!esRegistro);
            setError('');
          }}
        >
          {esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
  );
};

export default Login;
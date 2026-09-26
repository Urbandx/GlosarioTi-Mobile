import React from 'react';

interface Termino {
  id: number;
  concepto: string;
  definicionCorta: string;
  definicionLarga: string;
  ejemplos: string[];
  imagen: string;
  categorias: string[];
}

interface TerminoCardProps {
  termino: Termino;
  onVerMas: (termino: Termino) => void;
  onEliminar: (id: number) => void;
  onToggleFavorito: (id: number) => void;
  esFavorito: boolean;
  estaLogueado: boolean;
}

const TerminoCard: React.FC<TerminoCardProps> = ({ 
  termino, 
  onVerMas, 
  onEliminar,
  onToggleFavorito,
  esFavorito,
  estaLogueado
}) => {
  const handleFavorito = () => {
    if (!estaLogueado) {
      alert('⚠️ Debes iniciar sesión para guardar favoritos');
      return;
    }
    onToggleFavorito(termino.id);
  };

  return (
    <article className="card">
      <img src={termino.imagen} alt={termino.concepto} loading="lazy" />
      <h3>{termino.concepto}</h3>
      <p>{termino.definicionCorta}</p>
      
      <button className="ver-mas-btn" onClick={() => onVerMas(termino)}>
        Ver más
      </button>
      
      <button 
        className={`fav-btn ${esFavorito ? 'favorito' : ''}`}
        onClick={handleFavorito}
        aria-label={`Marcar ${termino.concepto} como favorito`}
        title={estaLogueado ? (esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos') : 'Inicia sesión para guardar favoritos'}
      >
        {esFavorito ? '★' : '☆'}
      </button>

      <button 
        className="eliminar-btn"
        onClick={() => onEliminar(termino.id)}
        title="Eliminar término"
        aria-label={`Eliminar ${termino.concepto}`}
      >
        🗑️
      </button>
    </article>
  );
};

export default TerminoCard;
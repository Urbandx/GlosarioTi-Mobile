import React from 'react';

interface FiltrosProps {
  categoriaActiva: string;
  setCategoriaActiva: (categoria: string) => void;
}

const Filtros: React.FC<FiltrosProps> = ({ categoriaActiva, setCategoriaActiva }) => {
  const categorias = ['Todas', 'Web', 'Backend', 'Frontend', 'Programación', 'Redes', 'Infraestructura', 'Seguridad', 'Otros'];

  return (
    <div id="filtros">
      {categorias.map(categoria => (
        <button
          key={categoria}
          data-cat={categoria}
          className={categoriaActiva === categoria ? 'active' : ''}
          onClick={() => setCategoriaActiva(categoria)}
        >
          {categoria}
        </button>
      ))}
    </div>
  );
};

export default Filtros;
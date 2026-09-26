import React from 'react';

interface BuscadorProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
}

const Buscador: React.FC<BuscadorProps> = ({ busqueda, setBusqueda }) => {
  return (
    <div className="buscador-container">
      <label htmlFor="buscador" className="sr-only">Buscar término</label>
      <input 
        type="search" 
        id="buscador"
        placeholder="Buscar término…" 
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
    </div>
  );
};

export default Buscador;
import React, { useEffect } from 'react';

interface Termino {
  id: number;
  concepto: string;
  definicionCorta: string;
  definicionLarga: string;
  ejemplos: string[];
  imagen: string;
  categorias: string[];
}

interface ModalProps {
  termino: Termino | null;
  onCerrar: () => void;
}

const Modal: React.FC<ModalProps> = ({ termino, onCerrar }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCerrar]);

  if (!termino) return null;

  return (
    <div className="modal active" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
      <div className="modal-contenido">
        <button className="cerrar" onClick={onCerrar} aria-label="Cerrar modal">
          &times;
        </button>
        <h2 id="modal-titulo">{termino.concepto}</h2>
        <p>{termino.definicionLarga}</p>
        <h4>Ejemplos:</h4>
        <pre>{termino.ejemplos.join('\n')}</pre>
      </div>
    </div>
  );
};

export default Modal;
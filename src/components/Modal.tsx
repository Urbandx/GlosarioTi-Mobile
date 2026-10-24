import React, { useEffect } from 'react';
// Importamos la API nativa de Text-to-Speech
import { TextToSpeech } from '@capacitor-community/text-to-speech';

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

  // Función que consume la API del sistema operativo para leer el texto
  const leerDefinicion = async () => {
    try {
      await TextToSpeech.speak({
        text: `${termino.concepto}. ${termino.definicionLarga}`,
        lang: 'es-ES', // Voz en español
        rate: 1.0,     // Velocidad normal
        pitch: 1.0,    // Tono normal
      });
    } catch (error) {
      console.error('Error al usar Text-to-Speech', error);
      alert('La síntesis de voz no está disponible en este dispositivo.');
    }
  };

  return (
    <div className="modal active" role="dialog" aria-modal="true">
      <div className="modal-contenido">
        <button className="cerrar" onClick={onCerrar} aria-label="Cerrar modal">
          &times;
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>{termino.concepto}</h2>
          
          {/* Botón de API de Terceros (TTS) */}
          <button 
            onClick={leerDefinicion}
            style={{ 
              background: '#2563eb', 
              color: 'white', 
              border: 'none', 
              padding: '8px 12px', 
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            title="Escuchar definición"
          >
            🔊 Escuchar
          </button>
        </div>

        <p style={{ marginTop: '15px' }}>{termino.definicionLarga}</p>
        <h4>Ejemplos:</h4>
        <pre>{termino.ejemplos.join('\n')}</pre>
      </div>
    </div>
  );
};

export default Modal;
import React from 'react';

const Compra = ({ onBack }) => {
  return (
    <div className="compra-page">
      <h1>Gracias por su compra</h1>
      <button onClick={onBack}>Volver a productos</button>
    </div>
  );
};

export default Compra;

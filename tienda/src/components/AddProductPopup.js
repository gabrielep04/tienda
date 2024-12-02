import React from 'react';
import './AddProductPopup.css';

const AddProductPopup = ({ newProduct, setNewProduct, onSaveProduct, onClose, isEditing }) => {
    return (
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Precio"
            value={newProduct.price}
            min="0"
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={newProduct.quantity}
            min="1"
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          />
          <textarea
            placeholder="Descripción"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Proveedor"
            value={newProduct.proveedor}
            onChange={(e) => setNewProduct({ ...newProduct, proveedor: e.target.value })}
          />
          <input
            type="text"
            placeholder="Categoría"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
          <input
            type="text"
            placeholder="URL de la Imagen"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          />
          <div className="popup-buttons">
            <button onClick={onSaveProduct}>{isEditing ? 'Guardar' : 'Agregar'}</button>
            <button onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default AddProductPopup;
  
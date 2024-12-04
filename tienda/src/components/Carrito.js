import React, { useState, useEffect } from 'react';
import { getCartItems, deleteCartItem, updateCartItem, getProducts } from '../utils/db.js';
import './Carrito.css';

const Carrito = ({ user, onBack, updateCart }) => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const items = await getCartItems();
      const allProducts = await getProducts();
      setCartItems(items.filter((item) => item.userId === user.id)); // Filtra por usuario
      setProducts(allProducts);
    };
    fetchCartItems();
  }, [user]);

  const handleRemove = async (id) => {
    const itemToReset = cartItems.find((item) => item.id === id);
    if (itemToReset) {
      await updateCartItem({ ...itemToReset, quantity: 1 });
    }

    await deleteCartItem(id);
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    updateCart(updatedItems); // Sincroniza con el estado global
  };

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1 || isNaN(newQuantity)) 
        newQuantity = 1; // Evitar cantidades menores a 1

    const item = cartItems.find((item) => item.id === id);
    if (!item) return;
  
    const product = await getProducts(); // Obtén los productos de la base de datos
    const productInDB = product.find((p) => p.id === id);
  
    if (productInDB && newQuantity > productInDB.quantity) {
      alert(`No puedes añadir más de ${productInDB.quantity} unidades de este producto.`);
      newQuantity = productInDB.quantity; // Limita la cantidad al stock disponible
    }

    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    updateCart(updatedItems);

    // Actualizar en IndexedDB
    const updatedItem = updatedItems.find((item) => item.id === id);
    await updateCartItem(updatedItem);
  };

  return (
    <div className="cart-page">
      <h1>Tu Carrito</h1>
      <button onClick={onBack}>Volver</button>
      {cartItems.length === 0 ? (
        <p>No tienes productos en el carrito.</p>
      ) : (
        <ul className="cart-list">
         {cartItems.map((item) => {
            const productInDB = products.find((p) => p.id === item.id); // Obtén el producto correspondiente
            const maxQuantity = productInDB?.quantity || 1; // Establece el máximo basado en el inventario

            return (
              <li key={item.id} className="cart-item">
                <img
                  src={item.image || '../public/default-placeholder.png'}
                  alt={item.name}
                />
                <div>
                  <h3>{item.name}</h3>
                  <p>Precio: ${item.price}</p>
                  <div className="quantity-controls">
                    <label>Cantidad:</label>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      max={maxQuantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
                <button onClick={() => handleRemove(item.id)}>Eliminar</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Carrito;

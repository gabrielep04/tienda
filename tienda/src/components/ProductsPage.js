import React, { useState, useEffect } from 'react';
import { getProducts } from '../utils/db.js'; // Asumiendo que `db.js` contiene las funciones de IndexedDB
import AdminProductsPage from './AdminProductsPage'; // Importar el componente AdminProductsPage
import './ProductsPage.css';

const ProductsPage = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState('products'); // Estado para controlar la vista
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const dbProducts = await getProducts();
      setProducts(dbProducts);
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return view === 'products' ? ( // Renderiza según el valor de 'view'
    <div className="products-page">
      <header className="navbar">
        <div className="logo">Tienda</div>
        <input
          type="text"
          className="search-bar"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="user-profile">
          <span
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="user-name"
          >
            {user?.username}
          </span>
          {isMenuOpen && (
            <div className="dropdown-menu">
              {user?.role === 'admin' && (
                <button onClick={() => setView('admin-products')}>Productos</button>
              )}
              <button onClick={onLogout}>Cerrar sesión</button>
            </div>
          )}
        </div>
        <div className="cart">
          <span>Carrito ({cartItems.length})</span>
        </div>
      </header>
      <main className="product-list">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image || '../public/default-placeholder.png'} // Ruta predeterminada si no hay imagen
              alt={product.name}
              className="product-image"
              onError={(e) => { e.target.src = '/default-placeholder.png'; }}
            />
            <h3>{product.name}</h3>
            <p>Precio: ${product.price}</p>
            <button onClick={() => addToCart(product)}>Agregar al carrito</button>
          </div>
        ))}
      </main>
    </div>
  ) : (
    <AdminProductsPage
      user={user}
      onBack={() => setView('products')} // Cambia la vista de vuelta a 'products'
    />
  );
};

export default ProductsPage;

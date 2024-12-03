import React, { useState, useEffect } from 'react';
import { getProducts } from '../utils/db.js'; 
import AdminProductsPage from './AdminProductsPage'; 
import './ProductsPage.css';

const ProductsPage = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState('products'); // Estado para controlar la vista
  const [products, setProducts] = useState([]);

  // Estados para los filtros
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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

  // Lógica de filtrado
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category ? product.category === category : true;
    const matchesMinPrice = minPrice ? product.price >= parseFloat(minPrice) : true;
    const matchesMaxPrice = maxPrice ? product.price <= parseFloat(maxPrice) : true;
    return (
      matchesSearch &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  return view === 'products' ? ( // Renderiza según el valor de 'view'
    <div className="products-page">
      <header className="navbar">
        <h1 className="logo">Shopsmart</h1>

      {/* Controles de filtros */}
        <div className="filters-section">
          <input
            type="text"
            className="filter-input search-bar"
            placeholder="🔍 Buscar productos..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {[...new Set(products.map((p) => p.category))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="price-filters">
            <input
              type="number"
              className="filter-input"
              placeholder="💵 Mínimo"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              className="filter-input"
              placeholder="💵 Máximo"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
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

import React, { useState } from 'react';
import AdminProductsPage from './AdminProductsPage';
import './ProductsPage.css';

const ProductsPage = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState('products'); // Vista actual: 'products' o 'admin-products'
  const [products] = useState([
    {
      id: 1,
      name: 'Producto 1',
      price: 20,
      description: 'Descripción del producto 1',
      author: 'Admin1',
      dateCreated: '2024-12-02',
      category: 'Electrónica',
    },
    {
      id: 2,
      name: 'Producto 2',
      price: 50,
      description: 'Descripción del producto 2',
      author: 'Admin2',
      dateCreated: '2024-12-01',
      category: 'Hogar',
    },
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cambia a la vista de administración de productos
  const handleAdminProducts = () => {
    setView('admin-products');
  };

  return view === 'products' ? (
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
                <button onClick={handleAdminProducts}>Productos</button>
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
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Categoría: {product.category}</p>
            <p>Creado por: {product.author}</p>
            <p>Fecha: {product.dateCreated}</p>
            <button onClick={() => addToCart(product)}>Agregar al carrito</button>
          </div>
        ))}
      </main>
    </div>
  ) : (
    <AdminProductsPage
      user={user}
      onBack={() => setView('products')} // Vuelve a la vista principal
    />
  );
};

export default ProductsPage;

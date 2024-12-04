import React, { useState, useEffect } from 'react';
import { getProducts, addToCartInDB, getCartItems, updateCartItem } from '../utils/db.js'; 
import AdminProductsPage from './AdminProductsPage'; 
import ProductPopup from './ProductPopup';
import Carrito from './Carrito.js';
import Compra from './Compra.js';
import './ProductsPage.css';

const ProductsPage = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState('products'); // Estado para controlar la vista
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para el producto seleccionado
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);


  // Estados para los filtros
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const dbProducts = await getProducts();
      setProducts(dbProducts);
  
      // Generar productos aleatorios solo una vez
      const shuffled = [...dbProducts].sort(() => 0.5 - Math.random());
      setRecommendedProducts(shuffled.slice(0, 4)); // 4 productos recomendados
      setBestSellingProducts(shuffled.slice(4, 8)); // Otros 4 productos
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      const items = await getCartItems();
      setCartItems(items.filter(item => item.userId === user.id)); // Filtra por usuario
    };
    fetchCartItems();
  }, [user]);
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const updateCart = (updatedItems) => {
    setCartItems(updatedItems);
  };  

  const addToCart = async (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id && item.userId === user.id);
  
    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > product.quantity) {
        alert(`No puedes añadir más de ${product.quantity} unidades de este producto.`);
        return;
      }
      const updatedItem = { ...existingItem, quantity: newQuantity };
      await updateCartItem(updatedItem);
      setCartItems((prev) =>
        prev.map((item) => (item.id === product.id ? updatedItem : item))
      );
    } else {
      if (product.quantity < 1) {
        alert("Este producto no tiene stock disponible.");
        return;
      }
      const newItem = { ...product, userId: user.id, quantity: 1 };
      await addToCartInDB(newItem);
      setCartItems((prev) => [...prev, newItem]);
    }
  };

  const precio = (precio) => {
    if (precio > 1000000)
      return "1.000.000";
    else
      return precio;
  };

  // Productos filtrados
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category ? product.category === category : true;
    const matchesMinPrice = minPrice ? product.price >= parseFloat(minPrice) : true;
    const matchesMaxPrice = maxPrice ? product.price <= parseFloat(maxPrice) : true;
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  const handleProductChange = (updatedProducts) => {
    setProducts(updatedProducts);
  
    // Regenerar secciones de productos
    const shuffled = [...updatedProducts].sort(() => 0.5 - Math.random());
    setRecommendedProducts(shuffled.slice(0, 4)); // 4 productos recomendados
    setBestSellingProducts(shuffled.slice(4, 8)); // Otros 4 productos
  };
  

// Función para verificar si hay filtros activos
const areFiltersActive = () => {
  return (
    searchTerm.trim() !== '' || 
    category !== '' || 
    minPrice !== '' || 
    maxPrice !== ''
  );
};

// Evaluar si ocultar las secciones basadas en los filtros
const showRecommendations = !areFiltersActive();

const handleCheckout = () => {
  setView('checkout'); // Cambiar a la vista de compra
};

const handleBackToProducts = () => {
  setView('products');
};

return view === 'products' ? (
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
        <button onClick={() => setView('cart')}>
          Carrito ({cartItems.length})
        </button>
      </div>
    </header>

    {/* Mostrar productos recomendados y más vendidos solo si no hay filtros */}
    {showRecommendations && (
      <>
        {/* Zona de Productos Recomendados */}
        <section className="recommended-products">
          <h2>Recomendados para ti</h2>
          <div className="product-list">
            {recommendedProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image || '../public/default-placeholder.png'}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => { e.target.src = '/default-placeholder.png'; }}
                />
                <h3>{product.name}</h3>
                <p>Precio: ${precio(product.price)}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  disabled={product.quantity === 0}
                  className={product.quantity === 0 ? 'disabled-button' : 'add-to-cart-button'}
                >
                  {product.quantity === 0 ? 'Agotado' : 'Agregar al carrito'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Zona de Productos Más Vendidos */}
        <section className="best-selling-products">
          <h2>Más Vendidos</h2>
          <div className="product-list">
            {bestSellingProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image || '../public/default-placeholder.png'}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => { e.target.src = '/default-placeholder.png'; }}
                />
                <h3>{product.name}</h3>
                <p>Precio: ${precio(product.price)}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  disabled={product.quantity === 0}
                  className={product.quantity === 0 ? 'disabled-button' : 'add-to-cart-button'}
                >
                  {product.quantity === 0 ? 'Agotado' : 'Agregar al carrito'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </>
    )}

    {/* Lista de todos los productos */}
    <h2 className="productos-todos">Todo lo que tenemos para ti</h2>
    <main className="product-list">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="product-card"
          onClick={() => setSelectedProduct(product)}
        >
          <img
            src={product.image || '../public/default-placeholder.png'}
            alt={product.name}
            className="product-image"
            onError={(e) => { e.target.src = '/default-placeholder.png'; }}
          />
          <h3>{product.name}</h3>
          <p>Precio: ${precio(product.price)}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            disabled={product.quantity === 0}
            className={product.quantity === 0 ? 'disabled-button' : 'add-to-cart-button'}
          >
            {product.quantity === 0 ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      ))}
    </main>
    {selectedProduct && (
      <ProductPopup
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />
    )}
  </div>
) : view === 'cart' ? (
  <Carrito user={user} onBack={() => setView('products')} updateCart={updateCart} updatedProducts={products} onProductChange={handleProductChange} onCheckout={handleCheckout}/>
) : view === 'checkout' ? (
  <Compra onBack={handleBackToProducts}/>
) : (
  <AdminProductsPage
    user={user}
    onBack={() => setView('products')}
    onProductChange={handleProductChange}
  />
);
}

export default ProductsPage;

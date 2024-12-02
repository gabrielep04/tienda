import React, { useState, useEffect } from 'react';
import './AdminProductsPage.css';
import { addProduct, getProducts, initDB, deleteProduct, updateProduct } from '../utils/db.js';

const AdminProductsPage = ({ onBack, user }) => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    author: user?.username || 'Desconocido', // Autor por defecto
    proveedor: '',
    category: '',
    image: '',
    dateCreated: new Date().toISOString().split('T')[0], // Fecha actual
  });

  // Cargar productos al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      await initDB();
      const dbProducts = await getProducts();
      setProducts(dbProducts);
    };
    fetchProducts();
  }, []);

  // Agregar producto
  const handleAddProduct = async () => {
    const productWithDefaults = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      quantity: parseInt(newProduct.quantity, 10),
    };
    await addProduct(productWithDefaults);
    const updatedProducts = await getProducts();
    setProducts(updatedProducts);
    setNewProduct({
      name: '',
      price: '',
      quantity: '',
      description: '',
      author: user?.username || 'Desconocido',
      proveedor: '',
      category: '',
      image: '',
      dateCreated: new Date().toISOString().split('T')[0],
    });
  };

  // Editar producto
  const handleEditProduct = async (id) => {
    const productToUpdate = products.find((product) => product.id === id);
    const updatedName = prompt('Editar nombre del producto:', productToUpdate.name);
    if (updatedName) {
      const updatedProduct = { ...productToUpdate, name: updatedName };
      await updateProduct(updatedProduct);
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    const updatedProducts = await getProducts();
    setProducts(updatedProducts);
  };

  return (
    <div className="admin-products-page">
      <header>
        <button onClick={onBack}>Volver</button>
        <h1>Gestión de Productos</h1>
      </header>
      <div>
        <h2>Agregar Producto</h2>
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
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
        />
        <input
          type="text"
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
        <button onClick={handleAddProduct}>Agregar Producto</button>
      </div>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Categoría: {product.category}</p>
            <p>Cantidad: {product.quantity}</p>
            <p>Proveedor: {product.proveedor}</p>
            <p>Creado por: {product.author}</p>
            <p>Fecha: {product.dateCreated}</p>
            <button onClick={() => handleEditProduct(product.id)}>Editar</button>
            <button onClick={() => handleDeleteProduct(product.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductsPage;

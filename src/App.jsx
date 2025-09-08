import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ id: null, name: "", price: "" });
  const [productToDelete, setProductToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products'));
    if (savedProducts && savedProducts.length > 0) {
      setProducts(savedProducts);
    } else {
      setProducts([
        { id: 1757236679491, name: "Laptop", price: 75000 },
        { id: 1757236679442, name: "Phone", price: 30000 },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentProduct({ id: null, name: "", price: "" });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setIsEditMode(true);
    setCurrentProduct({...product});
    setShowModal(true);
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const saveProduct = () => {
    const { id, name, price } = currentProduct;

    if (name.trim() === "" || price === "" || price <= 0) {
      alert("Please enter valid name and price (price must be greater than 0)");
      return;
    }

    if (isEditMode) {
      setProducts(products.map((p) => 
        (p.id === id ? { ...p, name: name.trim(), price: Number(price) } : p)
      ));
    } else {
      const newId = Date.now();
      setProducts([...products, { id: newId, name: name.trim(), price: Number(price) }]);
    }

    setShowModal(false);
  };

  const deleteProduct = () => {
    setProducts(products.filter((p) => p.id !== productToDelete.id));
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1>Product Management</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Product
        </button>
      </header>

      <div className="table-responsive">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => openEditModal(p)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => confirmDelete(p)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-products">
                  No products found. Add your first product!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{isEditMode ? "Edit Product" : "Add New Product"}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="productName">Product Name</label>
                <input
                  id="productName"
                  type="text"
                  placeholder="Enter product name"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="productPrice">Price (₹)</label>
                <input
                  id="productPrice"
                  type="number"
                  min="1"
                  placeholder="Enter price"
                  value={currentProduct.price}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveProduct}>
                {isEditMode ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
              <button 
                className="close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>"{productToDelete?.name}"</strong>?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={deleteProduct}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
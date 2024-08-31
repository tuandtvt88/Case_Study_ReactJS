import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin_page.css';
import logo from './loginadmin.png';

export function Admin_page() {
    const [products, setProducts] = useState([]);
    const [productFormVisible, setProductFormVisible] = useState(false);
    const [formValues, setFormValues] = useState({
        id: '',
        name: '',
        price: '',
        quantity: '',
        category: '',
        imageUrl: '',
        images: []
    });
    const [cartCount, setCartCount] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = '/';
        } else {
            renderProductTable();
            fetchCartCount();
        }
    }, []);

    const fetchCartCount = () => {
        axios.get('http://localhost:3000/carts/count')
            .then(response => {
                setCartCount(response.data.count);
            })
            .catch(error => {
                console.error('Error fetching cart count:', error);
            });
    };

    const logout = () => {
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/';
    };

    const renderProductTable = () => {
        axios.get('http://localhost:3000/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error loading products:', error);
                alert('Failed to load products. Please try again.');
            });
    };

    const showProductForm = () => {
        setProductFormVisible(true);
        setFormValues({
            id: '',
            name: '',
            price: '',
            quantity: '',
            category: '',
            imageUrl: '',
            images: []
        });
    };

    const editProduct = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        setFormValues({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            category: product.category,
            imageUrl: product.imageUrl,
            images: product.images || []
        });
        setProductFormVisible(true);
    };

    const deleteProduct = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            axios.delete(`http://localhost:3000/products/${productId}`)
                .then(() => {
                    renderProductTable();
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                    alert('Failed to delete the product. Please try again.');
                });
        }
    };

    const handleProductFormSubmit = (e) => {
        e.preventDefault();

        const { id, name, price, quantity, category, imageUrl, images } = formValues;

        const productData = { name, price, quantity, category, imageUrl, images };

        if (id) {
            axios.put(`http://localhost:3000/products/${id}`, productData)
                .then(() => {
                    renderProductTable();
                    setProductFormVisible(false);
                })
                .catch(error => {
                    console.error('Error updating product:', error);
                    alert('Failed to update the product. Please try again.');
                });
        } else {
            axios.post('http://localhost:3000/products', productData)
                .then(() => {
                    renderProductTable();
                    setProductFormVisible(false);
                })
                .catch(error => {
                    console.error('Error adding product:', error);
                    alert('Failed to add the product. Please try again.');
                });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const imagesArray = Array.from(e.target.files).map(file => URL.createObjectURL(file));
        setFormValues({
            ...formValues,
            images: imagesArray
        });
    };

    const handleCancel = () => {
        setProductFormVisible(false);
        setFormValues({
            id: '',
            name: '',
            price: '',
            quantity: '',
            category: '',
            imageUrl: '',
            images: []
        });
    };

    const openHomeInNewTab = () => {
        window.open('/home', '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="admin-page">
            <div className="sidebar">
                <img src={logo} alt="Admin Dashboard Banner" className="logo"/>
                <a href="#"><i className="fas fa-user-circle"></i> Profile</a>
                <a href="#"><i className="fas fa-tools"></i> Settings</a>
                <div className="footer-buttons">
                    <button className="btn btn-primary" onClick={openHomeInNewTab}>
                        <i className="fas fa-home"></i> Home
                    </button>
                    <button className="btn btn-secondary" onClick={logout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>

            <div className="main-content">
                <div className="cart-notification">
                    <i className="fas fa-shopping-cart cart-icon"></i>
                    <span className="cart-count">Cart: {cartCount} items</span>
                </div>

                <h2>QUẢN LÝ SẢN PHẨM</h2>
                <button className="btn btn-primary mb-3" onClick={showProductForm}>Add New Product</button>

                {productFormVisible && (
                    <form onSubmit={handleProductFormSubmit}>
                        <input type="hidden" name="id" value={formValues.id} />
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={formValues.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Price:</label>
                            <input
                                type="number"
                                name="price"
                                className="form-control"
                                value={formValues.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Quantity:</label>
                            <input
                                type="number"
                                name="quantity"
                                className="form-control"
                                value={formValues.quantity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Category:</label>
                            <input
                                type="text"
                                name="category"
                                className="form-control"
                                value={formValues.category}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Image URL:</label>
                            <input
                                type="text"
                                name="imageUrl"
                                className="form-control"
                                value={formValues.imageUrl}
                                onChange={handleInputChange}
                            />
                        </div>
                        {formValues.imageUrl && (
                            <img
                                id="imagePreview"
                                src={formValues.imageUrl}
                                alt="Image Preview"
                                style={{ display: 'block', width: '100px', height: '100px' }}
                            />
                        )}
                        <div className="form-group">
                            <label>Upload Images:</label>
                            <input
                                type="file"
                                name="images"
                                className="form-control"
                                onChange={handleImageChange}
                                multiple
                            />
                        </div>
                        {formValues.images.length > 0 && (
                            <div className="image-preview">
                                {formValues.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Preview ${index}`}
                                        style={{ width: '100px', height: '100px', marginRight: '10px' }}
                                    />
                                ))}
                            </div>
                        )}
                        <div className="form-actions">
                            <button type="submit" className="btn btn-success">OK</button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancel} style={{ marginLeft: '10px' }}>
                                CANCEL
                            </button>
                        </div>
                    </form>
                )}

                <div id="productTable" className="table-responsive">
                    {products.length === 0 ? (
                        <p>No products available.</p>
                    ) : (
                        <table className="table table-striped table-hover">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Category</th>
                                <th>Images</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.category}</td>
                                    <td>
                                        {product.images && product.images.length > 0 && (
                                            <img
                                                src={product.images[0]} // Display the first image
                                                alt={product.name}
                                                style={{ width: '100px', height: '100px' }}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => editProduct(product.id)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => deleteProduct(product.id)} style={{ marginLeft: '10px' }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Admin_page;

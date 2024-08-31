import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import logoNIKE from './logoNIKE.png';

export function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        updateAuthUI();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchName, searchCategory, products]);

    useEffect(() => {
        if (isLoggedIn) {
            updateCartCount();
        } else {
            setCartCount(0);
        }
    }, [isLoggedIn]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/products');
            console.log('Fetched Products:', response.data);
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:3000/categories');
            console.log('Fetched Categories:', response.data);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const updateAuthUI = () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const username = localStorage.getItem('loggedInUser');

        setIsLoggedIn(isLoggedIn);
        setUsername(username || '');

        if (isLoggedIn) {
            document.getElementById('welcomeMessage').textContent = `Welcome, ${username}!`;
            document.getElementById('login-link').style.display = 'none';
            document.getElementById('register-link').style.display = 'none';
            document.getElementById('logout-btn').style.display = 'inline-block';
        } else {
            document.getElementById('welcomeMessage').textContent = '';
            document.getElementById('login-link').style.display = 'inline-block';
            document.getElementById('register-link').style.display = 'inline-block';
            document.getElementById('logout-btn').style.display = 'none';
        }
    };

    const filterProducts = () => {
        const filtered = products.filter(product => {
            const matchesName = product.name.toLowerCase().includes(searchName.toLowerCase());
            const matchesCategory = searchCategory ? product.category === searchCategory : true;
            return matchesName && matchesCategory;
        });
        console.log('Filtered Products:', filtered);
        setFilteredProducts(filtered);
    };

    const updateCartCount = async () => {
        try {
            const loggedInUser = localStorage.getItem('loggedInUser');
            const response = await axios.get('http://localhost:3000/carts');
            const cart = response.data.find(c => c.user === loggedInUser);

            if (cart) {
                const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(totalQuantity);
            } else {
                setCartCount(0);
            }
        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
    };

    const addToCart = async (productId) => {
        if (!isLoggedIn) {
            alert('Please log in to add items to your cart.');
            navigate('/loginuser');
            return;
        }

        const loggedInUser = localStorage.getItem('loggedInUser');

        try {
            const productResponse = await axios.get(`http://localhost:3000/products/${productId}`);
            const product = productResponse.data;

            const cartResponse = await axios.get(`http://localhost:3000/carts?user=${loggedInUser}`);
            let cart = cartResponse.data.find(c => c.user === loggedInUser);

            if (!cart) {
                cart = {
                    user: loggedInUser,
                    total: 0,
                    products: [],
                };
            }

            let cartItem = cart.products.find(item => item.id === productId);
            if (cartItem) {
                cartItem.quantity++;
            } else {
                cartItem = {
                    id: productId,
                    name: product.name,
                    quantity: 1,
                    price: product.price,
                };
                cart.products.push(cartItem);
            }

            cart.total = cart.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            if (cart.id) {
                await axios.put(`http://localhost:3000/carts/${cart.id}`, cart);
            } else {
                await axios.post('http://localhost:3000/carts', cart);
            }

            updateCartCount();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loggedInUser');
        setIsLoggedIn(false);
        setUsername('');
        setCartCount(0);
        navigate('/home'); // Redirect to the home page after logout
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container d-flex justify-content-center">
                    <Link className="navbar-brand" to="/home">
                        <img src={logoNIKE} alt="Nike Logo" style={{ height: '60px' }} />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item form-inline">
                                <input type="text" id="searchName" className="form-control" placeholder="Search by name" onChange={(e) => setSearchName(e.target.value)} />
                            </li>
                            <li className="nav-item form-inline">
                                <select id="searchCategory" className="form-control" onChange={(e) => setSearchCategory(e.target.value)}>
                                    <option value="">All Categories</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link" id="welcomeMessage">{username ? `Welcome, ${username}!` : ''}</span>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/loginuser" id="login-link" style={{ display: isLoggedIn ? 'none' : 'inline-block' }}>
                                    Login
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png"
                                        alt="LoginAdmin Icon"
                                        style={{ height: '24px', marginLeft: '10px' }}
                                    />
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register" id="register-link" style={{ display: isLoggedIn ? 'none' : 'inline-block' }}>Register</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/carts" id="cart-link">
                                    Cart <span id="cartCount" className="badge bg-secondary">{cartCount}</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-danger" id="logout-btn" style={{ display: isLoggedIn ? 'inline-block' : 'none' }} onClick={logout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <h2>GIÀY CHÍNH HÃNG</h2>
                <div className="row" id="product-list">
                    {filteredProducts.length === 0 ? (
                        <p>No products found</p>
                    ) : (
                        filteredProducts.map((product) => (
                            <div className="col-md-4 mb-4" key={product.id}>
                                <div className="card">
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[0] : 'default-image.png'}
                                        className="card-img-top"
                                        alt={product.name}
                                        onError={(e) => e.target.src = 'default-image.png'}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">Price: ${product.price}</p>
                                        <p className="card-text">Quantity: {product.quantity}</p>
                                        <p className="card-text">Category: {product.category}</p>
                                        <button className="btn btn-primary add-to-cart-btn" onClick={() => addToCart(product.id)}>
                                            Add to Cart
                                        </button>
                                        <Link to={`/detail/${product.id}`} className="btn btn-secondary mt-2">View Details</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logoNIKE from "./logoNIKE.png";

const Carts = () => {
    const [cart, setCart] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderConfirmation, setOrderConfirmation] = useState('');

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            alert('Please log in to view your cart.');
            window.location.href = '/loginuser';
            return;
        }
        renderCart();
    }, []);

    const renderCart = async () => {
        try {
            const loggedInUser = localStorage.getItem('loggedInUser');
            const response = await fetch(`http://localhost:3000/carts?user=${loggedInUser}`);

            if (!response.ok) {
                throw new Error('Failed to fetch cart data');
            }

            const cartData = await response.json();
            const userCart = cartData.find(cart => cart.user === loggedInUser);

            if (userCart) {
                setCart(userCart);
                calculateTotalPrice(userCart.products);
            } else {
                setCart({ products: [] });
            }
        } catch (error) {
            console.error('Error fetching cart:', error.message);
        }
    };

    const addToCart = async (productId, quantity) => {
        try {
            const loggedInUser = localStorage.getItem('loggedInUser');
            const response = await fetch(`http://localhost:3000/carts?user=${loggedInUser}`);

            if (!response.ok) {
                throw new Error('Failed to fetch cart data');
            }

            const cartData = await response.json();
            const userCart = cartData.find(cart => cart.user === loggedInUser);

            if (userCart) {
                const productInCart = userCart.products.find(p => p.id === productId);

                if (productInCart) {
                    // Update quantity if product already in cart
                    await fetch(`http://localhost:3000/carts/${userCart.id}/products/${productId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ quantity: productInCart.quantity + parseInt(quantity) }),
                    });
                } else {
                    // Add new product to cart
                    await fetch(`http://localhost:3000/carts/${userCart.id}/products`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            productId,
                            quantity: parseInt(quantity)
                        }),
                    });
                }

                renderCart();
            } else {
                console.error('User cart not found.');
            }
        } catch (error) {
            console.error('Error updating cart:', error.message);
        }
    };


    const updateQuantity = async (productId, quantity) => {
        if (!cart?.id) {
            console.error('Cart ID is missing.');
            return;
        }

        console.log('Cart ID:', cart.id);
        console.log('Product ID:', productId);

        try {
            const response = await fetch(`http://localhost:3000/carts/${cart.id}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: parseInt(quantity) }),
            });

            if (response.ok) {
                renderCart();
            } else {
                console.error('Error updating quantity:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating quantity:', error.message);
        }
    };


    const calculateTotalPrice = (products) => {
        const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
        setTotalPrice(total);
    };

    if (!cart) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <Link className="navbar-brand" to="/home">
                        <img src={logoNIKE} alt="Nike Logo" style={{ height: '60px' }} />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/carts">Cart <span id="cartCount" className="badge bg-secondary">0</span></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <h2 className="mb-4">Your Cart</h2>
                <div id="cartList" className="row">
                    {(cart.products?.length > 0) ? cart.products.map(product => (
                        <div className="col-md-4 cart-item" key={product.id}>
                            <div className="card">
                                <img src={product.image || 'default-image.png'} className="card-img-top img-fluid" alt={product.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">Price: ${parseFloat(product.price).toFixed(2)}</p>
                                    <div className="input-group mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={product.quantity}
                                            min="1"
                                            onChange={(e) => updateQuantity(product.id, e.target.value)}
                                        />
                                        {/* Button to add more of the same product */}
                                        <button className="btn btn-primary"
                                                onClick={() => addToCart(product.id, product.quantity)}>Add More
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : <p>Your cart is empty</p>}
                </div>
                <div className="cart-summary mt-4">
                    <p>Total Price: ${totalPrice.toFixed(2)}</p>
                    <div className="order-confirmation">{orderConfirmation}</div>
                </div>
            </div>
        </div>
    );
};

export default Carts;

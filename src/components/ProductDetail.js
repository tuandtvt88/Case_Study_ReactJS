import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import logoNIKE from './logoNIKE.png';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
                navigate('/home'); // Redirect to home if product not found
            }
        };

        fetchProduct();
    }, [id, navigate]);

    if (!product) return <p>Loading...</p>;

    const price = !isNaN(Number(product.price)) ? Number(product.price).toFixed(2) : 'N/A';

    // Function to handle adding the product to the cart
    const addToCart = async () => {
        try {
            // Assuming the cart API expects the product ID and quantity
            await axios.post('http://localhost:3000/carts', {
                productId: product.id,
                quantity: 1, // You can customize this to allow selecting quantity
            });
            alert('Product added to cart!');
        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('Failed to add product to cart.');
        }
    };

    return (
        <div className="container mt-4">
            <Link to="/home">
                <img src={logoNIKE} alt="Nike Logo" style={{ height: '60px' }} />
            </Link>
            <h1>{product.name}</h1>
            <div className="row">
                <div className="col-md-6">
                    <div id="productImages" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {product.images && product.images.length > 0 ? (
                                product.images.map((image, index) => (
                                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                        <img
                                            src={image || 'default-image.png'}
                                            className="d-block w-100"
                                            alt={`Image ${index + 1}`}
                                            style={{ maxHeight: '400px', objectFit: 'cover' }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="carousel-item active">
                                    <img
                                        src="default-image.png"
                                        className="d-block w-100"
                                        alt="Default"
                                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#productImages" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#productImages" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
                <div className="col-md-6">
                    <h3>${price}</h3>
                    <p>{product.description || 'No description available'}</p>
                    <p>Category: {product.category || 'No category'}</p>
                    <p>Quantity Available: {product.quantity || 'No quantity available'}</p>
                    <button className="btn btn-primary" onClick={addToCart}>Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;

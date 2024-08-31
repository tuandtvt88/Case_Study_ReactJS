import React from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

export function LoginUser() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        onSubmit: values => {
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Check if the user exists and the password matches
            const user = users.find(user => user.username === values.username && user.password === values.password);
            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('loggedInUser', values.username); // Save username
                alert('Login successful!');
                navigate('/home');
            } else {
                alert('Invalid username or password!');
            }
        }
    });

    return (
        <div className="login-container d-flex align-items-center justify-content-center">
            <div className="login-card p-4 shadow-lg rounded">
                <h2 className="text-center mb-4">Welcome Back!</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
                <div className="mt-3 text-center">
                    <a href="/register" className="text-decoration-none">Don't have an account? Register here</a>
                </div>
            </div>
        </div>
    );
}

export default LoginUser;

import React from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

export function Register() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        onSubmit: values => {
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Check if the username already exists
            const existingUser = users.find(user => user.username === values.username);
            if (existingUser) {
                alert('Username already exists!');
                return;
            }

        
            users.push(values);
            localStorage.setItem('users', JSON.stringify(users));

            // Log the user in
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('loggedInUser', values.username);
            alert('Registration successful!');
            navigate('/loginuser');
        }
    });

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <h2 className="text-center">Register</h2>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
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
                            <label htmlFor="password" className="form-label">Password</label>
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
                        <button type="submit" className="btn btn-primary w-100">Register</button>
                    </form>
                    <div className="mt-3 text-center">
                        <a href="/loginuser">Already have an account? Login here</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;

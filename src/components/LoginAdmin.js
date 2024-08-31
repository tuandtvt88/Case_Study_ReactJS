import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import './LoginAdmin.css'; // Import custom CSS for additional styling

function LoginAdmin() {
    const [usn, setUsn] = useState('');
    const [pwd, setPwd] = useState('');
    const navigate = useNavigate();

    const getDataUsn = (event) => {
        setUsn(event.target.value);
    };

    const getDataPwd = (event) => {
        setPwd(event.target.value);
    };

    const submit = () => {
        if (usn === "admin" && pwd === "admin") {
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/admin'); // Navigate to the Admin page
        } else {
            alert('Username or password is incorrect');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card card mx-auto mt-5 p-4">
                <h2 className="card-title text-center">Admin Login</h2>
                <div className="card-body">
                    <p>User và password để demo là: admin/admin </p>
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Username"
                        value={usn}
                        onChange={getDataUsn}
                    />
                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Password"
                        value={pwd}
                        onChange={getDataPwd}
                    />
                    <button
                        className="btn btn-primary w-100"
                        onClick={submit}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginAdmin;

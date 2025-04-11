import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Password from '../components/Password'
import { validEmail } from '../utils/errorHandler';
import axiosInstance from '../utils/axiosInstance.js';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validEmail(email)) {
            setError('Please enter a valid email address!');
            return;
        }
        if (!password) {
            setError('Please enter a password!');
            return;
        }
        setError("")
        
        try {
            const response = await axiosInstance.post('server/auth/login', {
                email,
                password,
            });

            if (response.data && response.data.access_token) {
                localStorage.setItem('access_token', response.data.access_token);
                navigate('/');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
            else {
                setError('Something went wrong. Please try again later.');
            }
        }
    };

  return (
    <>
    <div class="login-wrapper">
        <div class="login-box">
            <form onSubmit={handleSubmit}>
                <h4 class="login-title">Login</h4>
                <input
                    type="text"
                    placeholder="Email"
                    class="input-box"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Password value={password} onChange={(e) => setPassword(e.target.value)}/>
                {error && <p class="error-text">{error}</p>}
                <button type="submit" class="btn-primary">Login</button>
                <p class="signup-text">
                    Not registered yet?{' '}
                    <Link to="/signup" class="signup-link">Create an account</Link>
                </p>
            </form>
        </div>
    </div>
    </>
  )
}

export default Login
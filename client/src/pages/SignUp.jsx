import React, { useState } from 'react'
import Password from '../components/Password'
import { Link, useNavigate } from 'react-router-dom';
import { validEmail } from '../utils/errorHandler';
import axiosInstance from '../utils/axiosInstance';
import '../styles/SignUp.css'

const SignUp = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!name) {
            setError('Please enter a username!');
            return;
        }
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
            const response = await axiosInstance.post('server/auth/signup', {
                name,
                email,
                password,
            });

            if (response.data && response.data.error) {
                setError(response.data.message);
                return;
            }

            navigate('/login');
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
    <div class="signup-wrapper">
        <div div class="signup-box">
            <form onSubmit={handleSubmit}>
                <h4 class="signup-title">Sign Up</h4>
                <input
                    type="text"
                    placeholder="Username"
                    class="input-box"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Email"
                    class="input-box"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Password value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <p class="error-text">{error}</p>}
                <button type="submit" class="btn-primary">Create Account</button>
                <p class="login-text">
                    Already have an account?{' '}
                <Link to="/login" class="login-link">Login</Link>
                </p>
            </form>
    </div>
</div>

    </>
  )
}

export default SignUp
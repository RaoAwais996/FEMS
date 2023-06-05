import React, { useState } from 'react';
import { auth } from '../firebase';
import './SignIn.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const SignIn = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('employee'); // Default user type is 'employee'
  const navigate = useNavigate(); // Hook for navigation

  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      await auth.signInWithEmailAndPassword(email, password);
      // Sign-in successful
      console.log('User signed in');
      // Pass the user type to the parent component
      onSignIn(userType);
      navigate('/home')
    } catch (error) {
      // Handle sign-in error
      console.error('Error signing in:', error);
      alert('Error signing in with email and password');
    }
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  return (
      <div className="Auth-form-container d-flex justify-content-center align-items-center">
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>Email address</label>
            <br />
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <br />
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
          <br />

            <label>User Type</label>
            <br />
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                value="employee"
                checked={userType === 'employee'}
                onChange={handleUserTypeChange}
              />
              <label className="form-check-label">Employee</label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                value="hr"
                checked={userType === 'hr'}
                onChange={handleUserTypeChange}
              />
              <label className="form-check-label">HR</label>
            </div>
          </div>
          <div className="d-grid gap-2 mt-3">
            <br />
            <button type="submit" className="btn btn-primary" onClick={handleSignIn}>
              Sign In
            </button>
          </div>
          <p className="forgot-password text-right mt-2"></p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;

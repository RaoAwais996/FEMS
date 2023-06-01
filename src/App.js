import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn.js';
import HomeHeader from './components/HomeHeader.js';
import CalendarTable from './components/CalendarTable.js';
import AddEmployeeForm from './components/AddEmployeeForm.js'; // Add this import
import EmployeesManagement from './components/EmployeesManagement.js'; // Add this import
import { auth } from './firebase';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already signed in
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
      } else {
        // User is signed out
        setUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup the listener when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignIn = async (email, password, navigate) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      // Sign-in successful
      console.log('User signed in');
      navigate('/signin'); // Navigate to '/signin' route after successful sign-in
    } catch (error) {
      // Handle sign-in error
      console.error('Error signing in:', error);
    }
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              isLoading ? (
                <p>Loading..........</p>
              ) : user ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
          <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
          <Route path="/home" element={<div><HomeHeader /><CalendarTable /></div>} />
          <Route path="/home/addemployee" element={<AddEmployeeForm />} /> {/* Add this route */}
          <Route path="/home/manageemployees" element={<EmployeesManagement />} /> {/* Add this route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

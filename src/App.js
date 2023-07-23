import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn.js';
import HomeHeader from './components/HomeHeader.js';
import CalendarTable from './components/CalendarTable.js';
import AddEmployeeForm from './components/AddEmployeeForm.js';
import EmployeesManagement from './components/EmployeesManagement.js';
import { auth } from './firebase';
import UpdateEmployee from './components/UpdateEmployee.js';
import Header from "./components/Appbar.js";
import AppBar from "./components/Appbar.js";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState('employee'); // Default user type is 'employee'
  const [email, setemail] = useState(''); 

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

  const handleSignIn = (type,email) => {
    setUserType(type);
    setemail(email);
    // try {
    //   await auth.signInWithEmailAndPassword(email, password);
    //   // Sign-in successful
    //   console.log('User signed in');
    //   navigate('/home');
    // } catch (error) {
    //   // Handle sign-in error
    //   console.error('Error signing in:', error);
    // }
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
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
                <Navigate to="/signin" replace />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
          <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
          <Route
            path="/home"
            element={
              <div>
                <AppBar></AppBar>
                <br></br>
                <br></br>
                <div style={{display:'flex',flexDirection:'column',justifyContent:'space-evenly',alignItems:'center',marginRight:'30px',marginBottom:'100px'}}>
                  <HomeHeader />
                  <br></br>
                  <CalendarTable userType={localStorage.getItem('userType')} useremail={localStorage.getItem('email')} />
                </div>
              </div>
            }
          />
          <Route path="/home/addemployee" element={<AddEmployeeForm />} />
          <Route path="/home/manageemployees" element={
            <>
            <AppBar></AppBar>
            <EmployeesManagement />
            </>
          } />
          <Route path="/home/manageemployees/update/:employeeId" element={<UpdateEmployee />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

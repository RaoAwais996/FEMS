import React, { useState } from 'react';
import './AddEmployeeForm.css';
import { useNavigate } from 'react-router-dom';

import { db } from '../firebase';

const saveEmployee = (employeeData) => {
  // Generate a unique ID for the employee document
  const employeeId = db.collection('employees').doc().id;

  // Create a new document in the 'employees' collection with the generated ID
  db.collection('employees')
    .doc(employeeId)
    .set(employeeData)
    .then(() => {
      console.log('Employee saved successfully!');
      alert('Employee saved successfully!');
    })
    .catch((error) => {
      console.error('Error saving employee:', error);
      alert('Error saving employee. Please try again later.');
    });
};

const AddEmployeeForm = ({ onAddEmployee }) => {
  const navigate = useNavigate(); // Hook for navigation
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'role':
        setRole(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Create an employee object with the form data
      const employee = {
        firstName,
        lastName,
        email,
        password,
        role,
      };
      // Pass the employee object to the parent component
      saveEmployee(employee);
      // Reset the input fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setRole('');
      setErrors({});
      navigate('/home'); // Navigate to '/home' when Cancel button is clicked
    } else {
      setErrors(validationErrors);
    }
  };

  const handleCancel = () => {
    navigate('/home'); // Navigate to '/home' when Cancel button is clicked
  };

  const validateForm = () => {
    const errors = {};
    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Invalid email format';
    }
    if (!password.trim()) {
      errors.password = 'Password is required';
    }
    if (!role.trim()) {
      errors.role = 'Role is required';
    }
    return errors;
  };

  const isValidEmail = (email) => {
    // Basic email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <form className="add-employee-form" onSubmit={handleSubmit}>
      <div className='hello'>
      <h2>Add Employee</h2>
      </div>
      <div className="form-group">
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={firstName}
          onChange={handleInputChange}
          placeholder="Enter first name"
        />
        {errors.firstName && <span className="error">{errors.firstName}</span>}
      </div>
      <div className="form-group">
        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={lastName}
          onChange={handleInputChange}
          placeholder="Enter last name"
        />
        {errors.lastName && <span className="error">{errors.lastName}</span>}
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          onChange={handleInputChange}
          value={email}
          placeholder="Enter email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleInputChange}
          placeholder="Enter password"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      <div className="form-group">
        <label>Role:</label>
        <input
          type="text"
          name="role"
          value={role}
          onChange={handleInputChange}
          placeholder="Enter role"
        />
        {errors.role && <span className="error">{errors.role}</span>}
      </div>
      <button type="submit">Add Employee</button>
      
      <button type="button" className="cancelbutton" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
};

export default AddEmployeeForm;

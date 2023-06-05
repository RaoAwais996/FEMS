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
  const [employeeName, setEmployeeName] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'employeeName':
        setEmployeeName(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'gender':
        setGender(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phoneNumber':
        setPhoneNumber(value);
        break;
      case 'country':
        setCountry(value);
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
        name: employeeName,
        password: password,
        gender: gender,
        email: email,
        phoneNumber: phoneNumber,
        country: country,
      };
      // Pass the employee object to the parent component
      
       saveEmployee(employee);
      // Reset the input fields
      setEmployeeName('');
      setPassword('');
      setGender('');
      setEmail('');
      setPhoneNumber('');
      setCountry('');
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
    if (!employeeName.trim()) {
      errors.employeeName = 'Employee name is required';
    }
    if (!password.trim()) {
      errors.password = 'Password is required';
    }
    if (!gender.trim()) {
      errors.gender = 'Gender is required';
    }
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Invalid email format';
    }
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }
    if (!country.trim()) {
      errors.country = 'Country is required';
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
            <br></br>
            <br></br>
            <br></br>
            <br></br>
      <h2>Add Employee</h2>
      <br></br>

      <div className="form-group">
        <label>Employee Name:</label>
        <input
          type="text"
          name="employeeName"
          value={employeeName}
          onChange={handleInputChange}
          placeholder="Enter employee name"
        />
        {errors.employeeName && <span className="error">{errors.employeeName}</span>}
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
        <label>Gender:</label>
        <input
          type="text"
          name="gender"
          value={gender}
          onChange={handleInputChange}
          placeholder="Enter gender"
        />
        {errors.gender && <span className="error">{errors.gender}</span>}
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          placeholder="Enter email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label>Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          value={phoneNumber}
          onChange={handleInputChange}
          placeholder="Enter phone number"
        />
        {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
      </div>
      <div className="form-group">
        <label>Country:</label>
        <input
          type="text"
          name="country"
          value={country}
          onChange={handleInputChange}
          placeholder="Enter country"
        />
        {errors.country && <span className="error">{errors.country}</span>}
      </div>
      <button type="submit">Add Employee</button>
      <br></br>
      <button type="button" onClick={handleCancel}>Cancel</button> 

    </form>
  );
};

export default AddEmployeeForm;

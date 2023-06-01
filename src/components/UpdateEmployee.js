import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './UpdateEmploye.css'

const UpdateEmployee = ({ onUpdateEmployee }) => {
  const { employeeId } = useParams();

  const [employee, setEmployee] = useState(null);
  const [employeeName, setEmployeeName] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Fetch the employee data based on the ID
    const fetchEmployee = async () => {
      try {
        const employeeDoc = await db.collection('employees').doc(employeeId).get();
        if (employeeDoc.exists) {
          const employeeData = employeeDoc.data();
          setEmployee(employeeData);
          setEmployeeName(employeeData.name);
          setPassword(employeeData.password);
          setGender(employeeData.gender);
          setEmail(employeeData.email);
          setPhoneNumber(employeeData.phoneNumber);
          setCountry(employeeData.country);
        } else {
          console.log('Employee not found');
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };

    fetchEmployee();
  }, [employeeId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Update the employee object with the form data
      const updatedEmployee = {
        ...employee,
        name: employeeName,
        password: password,
        gender: gender,
        email: email,
        phoneNumber: phoneNumber,
        country: country,
      };

      // Update the employee document in the 'employees' collection
      await db
        .collection('employees')
        .doc(employeeId)
        .update(updatedEmployee)
        .then(() => {
          console.log('Employee updated successfully!');
          alert("Employee updated successfully!");
        })
        .catch((error) => {
          console.error('Error updating employee:', error);
        });
    } else {
      setErrors(validationErrors);
    }
    navigate("/home/manageemployees");
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

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
 

    <form className="update-employee-form" onSubmit={handleSubmit}>
      <br></br>
      <h2>Update Employee</h2>

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
          type="text"
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

      <div className="form-group">
        <button type="submit">Update</button>
      </div>
    </form>
  );
};

export default UpdateEmployee;


// import React, { useContext, useState } from 'react';
// import { db } from '../firebase';
// import { EmployeeContext } from './EmployeeContext';

// const UpdateEmployee = () => {
//   const { selectedEmployee, updateEmployee, resetSelectedEmployee } = useContext(EmployeeContext);

//   const [employeeName, setEmployeeName] = useState(selectedEmployee ? selectedEmployee.name : '');
//   const [password, setPassword] = useState(selectedEmployee ? selectedEmployee.password : '');
//   const [gender, setGender] = useState(selectedEmployee ? selectedEmployee.gender : '');
//   const [email, setEmail] = useState(selectedEmployee ? selectedEmployee.email : '');
//   const [phoneNumber, setPhoneNumber] = useState(selectedEmployee ? selectedEmployee.phoneNumber : '');
//   const [country, setCountry] = useState(selectedEmployee ? selectedEmployee.country : '');
//   const [errors, setErrors] = useState({});

//   const handleUpdateEmployee = async (e) => {
//     e.preventDefault();

//     // Perform validation
//     if (!employeeName || !password || !gender || !email || !phoneNumber || !country) {
//       setErrors({ general: 'Please fill in all fields' });
//       return;
//     }

//     try {
//       if (!selectedEmployee) {
//         // Handle case when selectedEmployee is not defined
//         console.error('No employee selected');
//         setErrors({ general: 'No employee selected' });
//         return;
//       }

//       // Update the employee in the database
//       await db.collection('employees').doc(selectedEmployee.id).update({
//         name: employeeName,
//         password,
//         gender,
//         email,
//         phoneNumber,
//         country,
//       });

//       // Update the selected employee in the context
//       const updatedEmployee = {
//         id: selectedEmployee.id,
//         name: employeeName,
//         password,
//         gender,
//         email,
//         phoneNumber,
//         country,
//       };
//       updateEmployee(updatedEmployee);

//       // Reset the form and errors
//       setEmployeeName('');
//       setPassword('');
//       setGender('');
//       setEmail('');
//       setPhoneNumber('');
//       setCountry('');
//       setErrors({});
//     } catch (error) {
//       console.error('Error updating employee:', error);
//       setErrors({ general: 'An error occurred while updating the employee' });
//     }
//   };

//   const handleCancel = () => {
//     // Reset the selected employee in the context
//     resetSelectedEmployee();

//     // Reset the form and errors
//     setEmployeeName('');
//     setPassword('');
//     setGender('');
//     setEmail('');
//     setPhoneNumber('');
//     setCountry('');
//     setErrors({});
//   };

//   return (
//     <div>
//       <h2>Update Employee</h2>
//       {errors.general && <p className="error">{errors.general}</p>}
//       <form onSubmit={handleUpdateEmployee}>
//         <div>
//           <label>Name:</label>
//           <input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//         </div>
//         <div>
//           <label>Gender:</label>
//           <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
//         </div>
//         <div>
//           <label>Email:</label>
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//         </div>
//         <div>
//           <label>Phone Number:</label>
//           <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
//         </div>
//         <div>
//           <label>Country:</label>
//           <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
//         </div>
//         <div>
//           <button type="submit">Update</button>
//           <button type="button" onClick={handleCancel}>Cancel</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateEmployee;

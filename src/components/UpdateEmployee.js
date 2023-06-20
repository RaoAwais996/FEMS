import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateEmploye.css';

const UpdateEmployee = ({ onUpdateEmployee }) => {
  const { employeeId } = useParams();

  const [employee, setEmployee] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employeeDoc = await db.collection('employees').doc(employeeId).get();
        if (employeeDoc.exists) {
          const employeeData = employeeDoc.data();
          setEmployee(employeeData);
          setFirstName(employeeData.firstName);
          setLastName(employeeData.lastName);
          setEmail(employeeData.email);
          setPassword(employeeData.password);
          setRole(employeeData.role);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      const updatedEmployee = {
        ...employee,
        firstName,
        lastName,
        email,
        password,
        role,
      };

      await db
        .collection('employees')
        .doc(employeeId)
        .update(updatedEmployee)
        .then(() => {
          console.log('Employee updated successfully!');
          alert('Employee updated successfully!');
          onUpdateEmployee();
        })
        .catch((error) => {
          console.error('Error updating employee:', error);
        });
    } else {
      setErrors(validationErrors);
    }
    navigate('/home/manageemployees');
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <form className="update-employee-form" onSubmit={handleSubmit}>
      <h2>Update Employee</h2>

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
          type="text"
          name="email"
          value={email}
          onChange={handleInputChange}
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

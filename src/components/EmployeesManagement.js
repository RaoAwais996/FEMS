import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import UpdateEmployee from './UpdateEmployee';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './EmployeesManagement.css';


const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await db.collection('employees').get();
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (e, employeeId) => {
    e.preventDefault();
    console.log('Deleting employee with ID:', employeeId);
    try {
      await db.collection('employees').doc(employeeId).delete();
      console.log('Employee deleted successfully');
      alert('Employee deleted successfully');
      setSelectedEmployee(null); // Reset selected employee after deletion
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
    // write code to re render the employees list
    const snapshot = await db.collection('employees').get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEmployees(data);

  };

  const handleUpdate = (e, employeeId) => {
    e.preventDefault();

    const selected = employees.find((employee) => employee.id === employeeId);
    console.log('Selected employee:', selected);
    setSelectedEmployee(selected);

    navigate(`/home/manageemployees/update`);


  };

  return (
    <div>
      <br />
      <h2>Manage Employee</h2>
      <br />
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Password</th>
            <th scope="col">Gender</th>
            <th scope="col">Email</th>
            <th scope="col">Phone Number</th>
            <th scope="col">Country</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee.id}>
              <th scope="row">{index + 1}</th>
              <td>{employee.name}</td>
              <td>{employee.password}</td>
              <td>{employee.gender}</td>
              <td>{employee.email}</td>
              <td>{employee.phoneNumber}</td>
              <td>{employee.country}</td>
              <td>
                <button onClick={(e) => handleDelete(e, employee.id)}>Delete</button>
                
                
                <Link to={`/home/manageemployees/update/${employee.id}`}>
                <button>Update</button>
                </Link>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEmployee !== null && selectedEmployee !== undefined && (
        <UpdateEmployee
          employee={selectedEmployee}
          onUpdateEmployee= {() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};


export default EmployeeManagement;
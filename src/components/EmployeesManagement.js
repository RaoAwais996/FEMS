import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import UpdateEmployee from './UpdateEmployee';
import { useNavigate, Link } from 'react-router-dom';
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

      // Fetch updated employees data
      const snapshot = await db.collection('employees').get();
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(data);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleUpdate = (e, employeeId) => {
    e.preventDefault();

    const selected = employees.find((employee) => employee.id === employeeId);
    console.log('Selected employee:', selected);
    setSelectedEmployee(selected);

    navigate(`/home/manageemployees/update/${employeeId}`);
  };


  const handleAddEmployee = () => {
    navigate('/home/addemployee'); 
  };

  const handleGoBack = () => {
    navigate('/home', { state: { userType: 'hr' } });
  };

  return (
      <div style={{display:'flex',width:'100%',justifyContent:'center',alignItems:'center'}}>
        <div style={{width:'95%'}}>
          <br />
          <br />
          {/* <button className="add" onClick={handleGoBack}>Back</button>  */}
          <h2 >Manage Employees</h2>
          <br />
          <div className="button-container">
            <button className="add" onClick={handleAddEmployee}>Add Employee</button>
          </div>
          <br />
          <table className="calendar-table">
            <thead className="thead-dark" >
            <tr>
              <th scope="col">#</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th scope="col">Password</th>
              <th scope="col">Role</th>
              <th scope="col">Actions</th>
            </tr>
            </thead>
            <tbody>
            {employees.map((employee, index) => (
                <tr key={employee.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.password}</td>
                  <td>{employee.role}</td>
                  <td>
                    <button className="delete" onClick={(e) => handleDelete(e, employee.id)}>Delete</button>

                    <button className="update" onClick={(e) => handleUpdate(e, employee.id)}>Update</button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>

          {selectedEmployee && (
              <UpdateEmployee employee={selectedEmployee} onUpdateEmployee={() => setSelectedEmployee(null)} />
          )}
        </div>
      </div>

  );
};

export default EmployeeManagement;

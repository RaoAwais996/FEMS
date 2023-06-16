import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './CalendarTable.css';
import AddEmployeeForm from './AddEmployeeForm';
import EmployeesTable from './EmployeesManagement';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import CustomDropdown from './CustomDropdown';

const CalendarTable = ({ userType,useremail }) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showManageEmployees, setShowManageEmployees] = useState(false);
  const [employeeName, setEmployeeName] = useState('');

  const navigate = useNavigate(); 


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesSnapshot = await db.collection('employees').get();
        const fetchedEmployees = [];
        
        employeesSnapshot.forEach((doc) => {
          const employeeData = doc.data();
          fetchedEmployees.push({
            id: doc.id,
            name: employeeData.name,
            email: employeeData.email,
            fields: employeeData.fields || {}
          });
        });

        setEmployees(fetchedEmployees);

        if (userType === 'employee') {
          const employee = fetchedEmployees.find((employee) => employee.email === useremail);
          if (employee) {
            console.log('Employee name:', employee.name);
            setEmployeeName(employee.name);
          }
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, [userType, useremail]);

  const renderCalendarBody = () => {
  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.clone().startOf('month');
  // const firstDayOfWeek = firstDayOfMonth.weekday();
  const today = moment();
  const calendarRows = [];

  const handleCellChange = (employeeIndex, date, value) => {
    const updatedEmployees = [...employees];
    const employee = updatedEmployees[employeeIndex];
  
    // Only allow editing if the user is an employee and the email matches
    if (userType === 'employee' && employee.email === useremail) {
      employee.fields[date.format('YYYY-MM-DD')] = value;
      setEmployees(updatedEmployees);
  
      const employeeId = employee.id;
      db.collection('employees')
        .doc(employeeId)
        .set(
          {
            fields: {
              [date.format('YYYY-MM-DD')]: value,
            },
          },
          { merge: true }
        )
        .then(() => {
          alert('Field value updated successfully.');
        })
        .catch((error) => {
          alert('Error updating field value in Firebase:', error);
        });
    } else {
      alert('Access denied: Only the employee can edit their column');
    }
  };
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = firstDayOfMonth.clone().add(day - 1, 'day');
    const weekNumber = date.week();
    const isWeekend = date.day() === 0 || date.day() === 6;

    calendarRows.push(
      <tr key={day}>
        <td>{date.format('MMMM')}</td>
        <td>{weekNumber}</td>
        <td>{date.format('DD MMMM YYYY')}</td>
        <td>{date.format('dddd')}</td>
        {employees.map((employee, index) => {
        const field = employee.fields[date.format('YYYY-MM-DD')] || '-';
        const color = getColorForField(field);
        const isUneditable = userType === 'employee' && employee.email !== useremail;

        return (
          <td
            key={index}
            className={isUneditable ? 'non-editable' : ''}
            style={{
              backgroundColor: color,
            }}
          >
            {isUneditable ? (
              <span>{field}</span>
            ) : (
              <CustomDropdown
                options={[
                  'Day off',
                  'Work day',
                  'Work travel',
                  'Vacation',
                  'Special event',
                  'Sick Leave',
                ]}
                value={field}
                backgroundColor={color}
                onChange={(value) => handleCellChange(index, date, value)}
              />
            )}
          </td>
        );
      })}
    </tr>);
  };
  

  return (
    <table className="calendar-table">
      <thead>
        <tr>
          <th>Month</th>
          <th>Week</th>
          <th>Date</th>
          <th>Day</th>
          {employees.map((employee) => (
            <th key={employee.id}>{employee.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>{calendarRows}</tbody>
    </table>
  );
};

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, 'month'));
  };

  const handleAddEmployee = () => {
    navigate('/home/addemployee'); 
    setShowAddEmployeeForm(true);
  };

  const handleEmployeeAdded = (name) => {
    const newEmployee = { name, fields: {} };
    setEmployees([...employees, newEmployee]);
    setShowAddEmployeeForm(false);
  };

  const handleFieldChange = (e, index, date) => {
    const { value } = e.target;
    const updatedEmployees = [...employees];
    updatedEmployees[index].fields[date.format('YYYY-MM-DD')] = value;
    setEmployees(updatedEmployees);

    const employeeId = updatedEmployees[index].id;
    db.collection('employees')
      .doc(employeeId)
      .set(
        {
          fields: {
            [date.format('YYYY-MM-DD')]: value,
          },
        },
        { merge: true }
      )
      .then(() => {
        console.log('Field value updated successfully in Firebase');
      })
      .catch((error) => {
        console.error('Error updating field value in Firebase:', error);
      });
  };

  const getColorForField = (field) => {
    switch (field) {
      case 'Work travel':
        return 'teal';
      case 'Vacation':
        return 'orange';
      case 'Special event':
        return 'red';
      case 'Sick Leave':
        return 'purple';
      default:
        return '';
    }
  };

  const handleManageEmployees = () => {
    setShowAddEmployeeForm(false);
    setShowManageEmployees(true);
    navigate('/home/manageemployees');
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&#8249;</button>
        <h2>{currentDate.format('MMMM YYYY')}</h2>
        <button onClick={handleNextMonth}>&#8250;</button>

        {userType === 'hr' && (
          <>
            <button onClick={handleAddEmployee}>Add Employee</button>
            <button onClick={handleManageEmployees}>Manage Employees</button>
          </>
        )}
      </div>
      {showAddEmployeeForm ? (
        <AddEmployeeForm onAddEmployee={handleEmployeeAdded} />
      ) : showManageEmployees ? (
        <EmployeesTable />
      ) : (
        renderCalendarBody()
      )}
    </div>
  );
};


export default CalendarTable;

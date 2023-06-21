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

  console.log('User type:', userType);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesSnapshot = await db.collection('employees').get();
        const fetchedEmployees = [];
        
        employeesSnapshot.forEach((doc) => {
          const employeeData = doc.data();
          fetchedEmployees.push({
            id: doc.id,
            name: employeeData.firstName + ' ' + employeeData.lastName,
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
    const selectedEmployee = updatedEmployees[employeeIndex];
  
    // Only allow editing if the user is an employee and the email matches
    if (userType === 'hr') {
      let updatedCount = 0; // Variable to track the number of updated employees
  
      // If the value is 'Day off', update the field for all employees for that date
      if (value === 'Day off'&& userType === 'hr') {
        updatedEmployees.forEach((employee) => {
          if (!employee.fields) {
            employee.fields = {};
          }
          if (employee.fields[date.format('YYYY-MM-DD')] !== value) {
            employee.fields[date.format('YYYY-MM-DD')] = value;
            updatedCount++;
          }
        });
      } else {
        // Set the value for the selected employee's field
        if (!selectedEmployee.fields) {
          selectedEmployee.fields = {};
        }
        selectedEmployee.fields[date.format('YYYY-MM-DD')] = value;
        updatedCount++;
  
        // Update the Firestore database only for the selected employee
        const employeeId = selectedEmployee.id;
        db.collection('employees')
          .doc(employeeId)
          .set(
            {
              fields: {
                [date.format('YYYY-MM-DD')]: selectedEmployee.fields[date.format('YYYY-MM-DD')],
              },
            },
            { merge: true }
          )
          .catch((error) => {
            alert('Error updating field value in Firebase:', error);
          });
      }
  
      setEmployees(updatedEmployees);
  
      if (updatedCount > 0) {
        alert(`Field value updated for ${updatedCount} employee(s) successfully.`);
      }
    }


    if (userType === 'employee' && selectedEmployee.email === useremail) {

      const fieldExists = selectedEmployee.fields && selectedEmployee.fields[date.format('YYYY-MM-DD')];

      if (fieldExists) {
        alert('You have already updated this field. You cannot change your selection.');
        return;
      }
      selectedEmployee.fields[date.format('YYYY-MM-DD')] = value;
      setEmployees(updatedEmployees);
  
      const employeeId = selectedEmployee.id;
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
    }


    
    else {
      // alert('Access denied: Only the employee can edit their column');
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
                    '       -',
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
      </tr>
    );
  }

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

  const getColorForField = (field) => {
    switch (field) {
      case 'Work travel':
        return '#6197e8';
      case 'Vacation':
        return '#e87a61';
      case 'Special event':
        return 'lightgreen';
        case 'Sick Leave':
          return '#c230d9';
        case 'Work day':
          return 'white';
      default:
        return 'lightgrey';
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

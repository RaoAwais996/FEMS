import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './CalendarTable.css';
import AddEmployeeForm from './AddEmployeeForm';
import EmployeesTable from './EmployeesManagement';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';

const CalendarTable = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showManageEmployees, setShowManageEmployees] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Fetch employees from the database
    const fetchEmployees = async () => {
      try {
        const employeesSnapshot = await db.collection('employees').get();
        const fetchedEmployees = employeesSnapshot.docs.map((doc) => {
          const employeeData = doc.data();
          return { id: doc.id, name: employeeData.name, fields: {} };
        });
        setEmployees(fetchedEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const renderCalendarBody = () => {
    const daysInMonth = currentDate.daysInMonth();
    const firstDayOfMonth = currentDate.clone().startOf('month');
    const firstDayOfWeek = firstDayOfMonth.weekday();
    const today = moment();
    const calendarRows = [];
  
    for (let day = 1; day <= daysInMonth; day++) {
      const date = firstDayOfMonth.clone().add(day - 1, 'day');
      const weekNumber = date.week();
      const isWeekend = date.day() === 0 || date.day() === 6;
  
      const employeeFields = employees.map((employee) => {
        if (isWeekend) {
          return 'Day-off';
        }
        return employee.fields[date.format('YYYY-MM-DD')] || '-';
      });
  
      calendarRows.push(
        <tr key={day}>
          <td>{date.format('MMMM')}</td>
          <td>{weekNumber}</td>
          <td>{date.format('DD MMMM YYYY')}</td>
          <td>{date.format('dddd')}</td>
          {employeeFields.map((field, index) => {
            const color = getColorForField(field);
            const isUneditable = isWeekend ;
            return (
              <td
                key={index}
                className={isUneditable ? 'non-editable' : ''}
                style={{
                  backgroundColor: isUneditable ? 'lightgray' : color,
                }}
              >
                {isUneditable ? (
                  'Day-off'
                ) : (
                  <select
                    value={field}
                    onChange={(e) => handleFieldChange(e, index, date)}
                  >
                    <option value="Work day">Work day</option>
                    <option value="Work travel">Work travel</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Special event">Special event</option>
                    <option value="Sick Leave">Sick Leave</option>
                  </select>
                )}
              </td>
            );
          })}
        </tr>
      );
    }
  
    // Render the calendar table
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
    navigate('/home/addemployee'); // Navigate to '/home/addemployee
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

        {showAddEmployeeForm ? null : (
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

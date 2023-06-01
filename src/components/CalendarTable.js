import React, { useState } from 'react';
import moment from 'moment';
import './CalendarTable.css';
import AddEmployeeForm from './AddEmployeeForm';
import EmployeesTable from './EmployeesManagement'
import { useNavigate } from 'react-router-dom';


const CalendarTable = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showManageEmployees, setShowManageEmployees] = useState(false);
  const navigate = useNavigate(); // Hook for navigation



  const renderCalendarBody = () => {
    const daysInMonth = currentDate.daysInMonth();
    const firstDayOfMonth = currentDate.clone().startOf('month');
    const firstDayOfWeek = firstDayOfMonth.weekday();
    const today = moment();
    const calendarRows = [];
  
    for (let day = 1; day <= daysInMonth; day++) {
      const date = firstDayOfMonth.clone().add(day - 1, 'day');
      const weekNumber = date.week() ;
      const isEditable = date.isSameOrBefore(today);
      const isWeekend = date.day() === 0 || date.day() === 6; 
  
      const employeeFields = employees.map((employee) => {
        if (isWeekend) {
          return "Day-off";
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
            const isUneditable = isWeekend || !isEditable; 
            return (
              <td
                key={index}
                className={isUneditable ? 'non-editable' : ''}
                style={{
                  backgroundColor: isUneditable ? 'lightgray' : color,
                }}
              >
                {isEditable && !isUneditable ? (
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
                ) : (
                  field
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
              <th key={employee.name}>{employee.name}</th>
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
        return 'lightyellow';
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
    navigate('/home/manageemployees'); // Navigate to '/home/addemployee'

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







//Represents weeks in year

// import React, { useState, useEffect } from 'react';
// import moment from 'moment';

// const CalendarTable = () => {
//   const [currentDate, setCurrentDate] = useState(moment());
  
//   useEffect(() => {
//     setCurrentDate(moment());
//   }, []);

//   const goToPreviousMonth = () => {
//     setCurrentDate(currentDate.clone().subtract(1, 'month'));
//   };

//   const goToNextMonth = () => {
//     setCurrentDate(currentDate.clone().add(1, 'month'));
//   };

//   const renderCalendarHeader = () => {
//     const currentMonth = currentDate.format('MMMM YYYY');

//     return (
//       <div className="calendar-header">
//         <button onClick={goToPreviousMonth}>&lt;</button>
//         <h2>{currentMonth}</h2>
//         <button onClick={goToNextMonth}>&gt;</button>
//       </div>
//     );
//   };

// //   const renderCalendarBody = () => {
// //     const daysInMonth = currentDate.daysInMonth();
// //     const firstDayOfMonth = currentDate.clone().startOf('month');
// //     const firstDayOfWeek = firstDayOfMonth.weekday();

// //     const calendarDays = [];

// //     // Fill in the days of the previous month
// //     for (let i = 0; i < firstDayOfWeek; i++) {
// //       calendarDays.push('');
// //     }

// //     // Fill in the days of the current month
// //     for (let day = 1; day <= daysInMonth; day++) {
// //       calendarDays.push(day);
// //     }

// //     // Render the calendar table
// //     return (
// //       <table className="calendar-table">
// //         <thead>
// //           <tr>
// //             <th>Sun</th>
// //             <th>Mon</th>
// //             <th>Tue</th>
// //             <th>Wed</th>
// //             <th>Thu</th>
// //             <th>Fri</th>
// //             <th>Sat</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {chunkArray(calendarDays, 7).map((week, index) => (
// //             <tr key={index}>
// //               {week.map((day, dayIndex) => (
// //                 <td key={dayIndex}>{day}</td>
// //               ))}
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     );
// //   };


// const renderCalendarBody = () => {
//     const daysInMonth = currentDate.daysInMonth();
//     const firstDayOfMonth = currentDate.clone().startOf('month');
//     const firstDayOfWeek = firstDayOfMonth.weekday();
  
//     const calendarRows = [];
  
//     // Fill in the days of the current month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = firstDayOfMonth.clone().add(day - 1, 'day');
//       const weekNumber = date.week();
  
//       calendarRows.push(
//         <tr key={day}>
//           <td>{date.format('MMMM')}</td>
//           <td>{weekNumber}</td>
//           <td>{date.format('DD MMMM YYYY')}</td>
//           <td>{date.format('dddd')}</td>
//         </tr>
//       );
//     }
  
//     // Render the calendar table
//     return (
//       <table className="calendar-table">
//         <thead>
//           <tr>
//             <th>Month</th>
//             <th>Week</th>
//             <th>Date</th>
//             <th>Day</th>
//           </tr>
//         </thead>
//         <tbody>
//           {calendarRows}
//         </tbody>
//       </table>
//     );
//   };
  
//   const chunkArray = (array, size) => {
//     const chunkedArray = [];
//     let index = 0;

//     while (index < array.length) {
//       chunkedArray.push(array.slice(index, index + size));
//       index += size;
//     }

//     return chunkedArray;
//   };

//   return (
//     <div className="calendar">
//       {renderCalendarHeader()}
//       {renderCalendarBody()}
//     </div>
//   );
// };

// export default CalendarTable;

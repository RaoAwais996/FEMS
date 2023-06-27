import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './CalendarTable.css';
import AddEmployeeForm from './AddEmployeeForm';
import EmployeesTable from './EmployeesManagement';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import CustomDropdown from './CustomDropdown';
import { useRef } from 'react';

const CalendarTable = ({ userType,useremail }) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showManageEmployees, setShowManageEmployees] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const tableHeadRef = useRef(null);


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

  useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const threshold = 100;
  
        setIsHeaderSticky(scrollTop > threshold);
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    useEffect(() => {
      const tableHeadElement = tableHeadRef.current;
      const tableHeadCells = tableHeadElement.querySelectorAll('th');
  
      const handleResize = () => {
        tableHeadCells.forEach((cell, index) => {
          const originalCell = document.querySelector(`.calendar-table thead th:nth-child(${index + 1})`);
          cell.style.width = originalCell.offsetWidth + 'px';
        });
      };
  
      handleResize();
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  

const handleCellChange = (employeeIndex, date, value) => {
  const updatedEmployees = [...employees];
  const selectedEmployee = updatedEmployees[employeeIndex];

  // Only allow editing if the user is an HR and the email matches
  if (userType === 'hr') {
    let updatedCount = 0; // Variable to track the number of updated employees

    if (value === 'Ditë e lirë' && userType === 'hr') {
      updatedEmployees.forEach((employee) => {
        if (!employee.fields) {
          employee.fields = {};
        }

        // Set "Day off" for weekends
        if (date.isoWeekday() === 6 || date.isoWeekday() === 7) {
          employee.fields[date.format('YYYY-MM-DD')] = 'Ditë e lirë' ;
        } else if (employee.fields[date.format('YYYY-MM-DD')] !== value) {
          employee.fields[date.format('YYYY-MM-DD')] = value;
        }

        updatedCount++;
      });

      setEmployees(updatedEmployees);

      if (updatedCount > 0) {
        // alert(`Field value updated for ${updatedCount} employee(s) successfully.`);
      }

      // Update the Firestore database for all employees
      const batch = db.batch();
      updatedEmployees.forEach((employee) => {
        const employeeId = employee.id;
        const employeeRef = db.collection('employees').doc(employeeId);
        batch.set(
          employeeRef,
          {
            fields: {
              [date.format('YYYY-MM-DD')]: employee.fields[date.format('YYYY-MM-DD')],
            },
          },
          { merge: true }
        );
      });

      batch
        .commit()
        .then(() => {
          alert('Field values updated in Firebase successfully.');
        })
        .catch((error) => {
          alert('Error updating field value in Firebase:', error);
        });
    } else {
      // Set the value for the selected employee's field
      if (!selectedEmployee.fields) {
        selectedEmployee.fields = {};
      }

      // Set "Day off" for weekends
      if (date.isoWeekday() === 6 || date.isoWeekday() === 7) {
        selectedEmployee.fields[date.format('YYYY-MM-DD')] = 'Ditë e lirë' ;
      } else {
        selectedEmployee.fields[date.format('YYYY-MM-DD')] = value;
      }

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
  } else if (userType === 'employee' && selectedEmployee.email === useremail) {
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
  } else {
    // alert('Access denied: Only the employee can edit their column');
  }
};


const renderCalendarBody = () => {
  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.clone().startOf('month');
  const today = moment();
  const calendarRows = [];
  const daysAlbanian = ['Hëne', 'Marte', 'Mërkure', 'Ejte', 'Premte', 'Shtune', 'Diele'];
  const monthsAlbanian = {
    January: 'Janar',
    February: 'Shkurt',
    March: 'Mars',
    April: 'Prill',
    May: 'Maj',
    June: 'Qershor',
    July: 'Korrik',
    August: 'Gusht',
    September: 'Shtator',
    October: 'Tetor',
    November: 'Nëntor',
    December: 'Dhjetor'
  };

  for (let day = 1; day <= daysInMonth; day++) {
    const date = firstDayOfMonth.clone();
    const weekNumber = date.week();
    const isWeekend = date.isoWeekday() === 6 || date.isoWeekday() === 7; // Check if the date is Saturday or Sunday

    if (isWeekend) {
      // Set "Day off" for weekends
      employees.forEach((employee) => {
        if (!employee.fields) {
          employee.fields = {};
        }
        employee.fields[date.format('YYYY-MM-DD')] = 'Ditë e lirë' ;
      });
    }
    calendarRows.push(
      <tr key={day}>
 <td>{monthsAlbanian[date.format('MMMM')]}</td>
         <td>{weekNumber}</td>
         <td>{date.format('DD') + ' ' + monthsAlbanian[date.format('MMMM')] + ' ' + date.format('YYYY')}</td>
        <td>{daysAlbanian[date.isoWeekday() - 1]}</td>
                {employees.map((employee, index) => {
          const field = employee.fields[date.format('YYYY-MM-DD')] || '-';
          const color = getColorForField(field);
          const isUneditable = userType === 'employee' && employee.email !== useremail;

          // Set "Day off" for weekends if the field is not already set
          if (isWeekend && !field) {
            employee.fields[date.format('YYYY-MM-DD')] = 'Ditë e lirë' ;
          }

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
                    'Ditë e lirë' ,
                    'Prezent në punë',
                    'Udhëtim Zyrëtar',
                    'Pushim Vjetor',
                    'Event Special',
                    'Pushim Mjekësor',
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

    // Move to the next day
    firstDayOfMonth.add(1, 'day');
  }

  return (
    <table className="calendar-table">
    <thead className={`calendar-header ${isHeaderSticky ? 'sticky' : ''}`} ref={tableHeadRef}>
      <tr>
        <th >Muaji</th>
        <th >Java</th>
        <th >Data</th>
        <th >Dita</th>
        {employees.map((employee) => (
          <th key={employee.id} className="qwee">
            {employee.name}
          </th>
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
      case 'Udhëtim Zyrëtar':
        return '#6197e8';
      case 'Pushim Vjetor':
        return '#e87a61';
      case 'Event Special':
        return 'lightgreen';
        case 'Pushim Mjekësor':
          return '#c230d9';
        case 'Prezent në punë':
          return 'white';
          case 'Ditë e lirë' :
            return 'lightgrey';
      default:
        return 'white';
    }
  };

  const handleManageEmployees = () => {
    setShowAddEmployeeForm(false);
    setShowManageEmployees(true);
    navigate('/home/manageemployees');
  };

  const monthsAlbania = {
    January: 'Janar',
    February: 'Shkurt',
    March: 'Mars',
    April: 'Prill',
    May: 'Maj',
    June: 'Qershor',
    July: 'Korrik',
    August: 'Gusht',
    September: 'Shtator',
    October: 'Tetor',
    November: 'Nëntor',
    December: 'Dhjetor'
  };

  const date = currentDate.clone();


  return (
    <div className="calendar-container">
      <div className="calendar-uperline">
        <button onClick={handlePrevMonth}>&#8249;</button>
        <h2>{monthsAlbania[date.format('MMMM')] +' '+currentDate.format('YYYY')}</h2>
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

import React, { createContext, useState } from 'react';

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const updateEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

  const resetSelectedEmployee = () => {
    setSelectedEmployee(null);
  };

  return (
    <EmployeeContext.Provider value={{ selectedEmployee, updateEmployee, resetSelectedEmployee }}>
      {children}
    </EmployeeContext.Provider>
    
  );
};

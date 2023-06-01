export const setEmployees = (employees) => {
    return {
      type: 'SET_EMPLOYEES',
      payload: employees,
    };
  };
  
  export const selectEmployee = (employee) => {
    return {
      type: 'SELECT_EMPLOYEE',
      payload: employee,
    };
  };
  
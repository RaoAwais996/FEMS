const initialState = {
    employees: [],
    selectedEmployee: null,
  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_EMPLOYEES':
        return {
          ...state,
          employees: action.payload,
        };
      case 'SELECT_EMPLOYEE':
        return {
          ...state,
          selectedEmployee: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default rootReducer;
  
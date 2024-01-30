const initialState = {
    expenses: [],
    income: [],
  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_EXPENSE':
        return { ...state, expenses: [...state.expenses, action.payload] };
      case 'DELETE_EXPENSE':
        return { ...state, expenses: state.expenses.filter((_, index) => index !== action.payload) };
      case 'ADD_INCOME':
        return { ...state, income: [...state.income, action.payload] };
      case 'DELETE_INCOME':
        return { ...state, income: state.income.filter((_, index) => index !== action.payload) };
      default:
        return state;
    }
  };
  
  export default rootReducer;
  
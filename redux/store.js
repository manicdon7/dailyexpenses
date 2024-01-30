// store.js
import { createStore } from 'redux';

const initialState = {
  expenses: [],
  income: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case 'ADD_INCOME':
      return {
        ...state,
        income: [...state.income, action.payload],
      };
    default:
      return state;
  }
};

const store = createStore(rootReducer);

export default store;

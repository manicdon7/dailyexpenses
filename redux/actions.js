// actions.js

import AsyncStorage from '@react-native-async-storage/async-storage';

export const addExpense = (expense) => {
  return async (dispatch) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });

    try {
      const expensesString = await AsyncStorage.getItem('expenses');
      let expenses = JSON.parse(expensesString) || [];
      expenses.push(expense);
      await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (error) {
      console.error('Error storing expense:', error);
    }
  };
};

export const deleteExpense = (index) => {
  return async (dispatch) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: index });

    try {
      const expensesString = await AsyncStorage.getItem('expenses');
      let expenses = JSON.parse(expensesString) || [];
      expenses.splice(index, 1);
      await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };
};

export const addIncome = (income) => {
  return async (dispatch) => {
    dispatch({ type: 'ADD_INCOME', payload: income });

    try {
      const incomeString = await AsyncStorage.getItem('income');
      let incomeData = JSON.parse(incomeString) || [];
      incomeData.push(income);
      await AsyncStorage.setItem('income', JSON.stringify(incomeData));
    } catch (error) {
      console.error('Error storing income:', error);
    }
  };
};

export const deleteIncome = (index) => {
  return async (dispatch) => {
    dispatch({ type: 'DELETE_INCOME', payload: index });

    try {
      const incomeString = await AsyncStorage.getItem('income');
      let incomeData = JSON.parse(incomeString) || [];
      incomeData.splice(index, 1);
      await AsyncStorage.setItem('income', JSON.stringify(incomeData));
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };
};

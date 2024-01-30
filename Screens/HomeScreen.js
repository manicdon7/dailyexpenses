import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { styled } from 'nativewind';
import { withExpoSnack } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

const HomeScreen = () => {
  const [expense, setExpense] = useState('');
  const [income, setIncome] = useState('');
  const [expensesList, setExpensesList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);

  const handleAddExpense = () => {
    const expenseValue = parseFloat(expense);
    if (!isNaN(expenseValue) && Number.isInteger(expenseValue)) {
      setExpensesList([...expensesList, expenseValue.toString()]);
      setExpense('');
    } else {
      Alert.alert('Error', 'Please enter a valid integer expense amount.');
    }
  };

  const handleAddIncome = () => {
    const incomeValue = parseFloat(income);
    if (!isNaN(incomeValue) && Number.isInteger(incomeValue)) {
      setIncomeList([...incomeList, incomeValue.toString()]);
      setIncome('');
    } else {
      Alert.alert('Error', 'Please enter a valid integer income amount.');
    }
  };

  const handleDeleteExpense = (index) => {
    const updatedExpensesList = [...expensesList];
    updatedExpensesList.splice(index, 1);
    setExpensesList(updatedExpensesList);
  };

  const handleDeleteIncome = (index) => {
    const updatedIncomeList = [...incomeList];
    updatedIncomeList.splice(index, 1);
    setIncomeList(updatedIncomeList);
  };

  const calculateBalance = () => {
    const totalIncome = incomeList.reduce((acc, item) => acc + parseFloat(item), 0);
    const totalExpenses = expensesList.reduce((acc, item) => acc + parseFloat(item), 0);
    const balance = totalIncome - totalExpenses;

    let color = 'text-black';

    if (balance < 0) {
      color = 'text-red-500';
    } else if (balance > 0) {
      color = 'text-green-500';
    } else {
      color = 'text-blue-500';
    }

    return { balance, color };
  };



  return (
    <ScrollView>
      <StyledView className='bg-blue-200 h-screen p-8'>
        <StyledText className='text-center font-semibold py-8 text-3xl'>
          DailyExpenses
        </StyledText>

        <StyledView>
          <StyledText className='px-4 py-2 text-xl'>Add Expenses</StyledText>
        </StyledView>
        <StyledTextInput
          className='bg-red-100 px-4 py-2 mx-4 rounded-xl'
          placeholder='Enter Expenses'
          value={expense}
          onChangeText={(text) => setExpense(text.replace(/[^0-9]/g, ''))}
          keyboardType='numeric'
        />
        <StyledView className='mx-10 mt-4'>
          <TouchableOpacity className="rounded-xl"
            style={{
              backgroundColor: '#3498db',
              padding: 10,
              borderRadius: 5,
              marginTop: 10,
            }}
            onPress={handleAddExpense}
          >
            <StyledText style={{ color: 'white' }}>Add Expense</StyledText>
          </TouchableOpacity>
        </StyledView>

        <StyledView>
          <StyledText className='px-4 py-2 text-xl'>Expenses List</StyledText>
        </StyledView>
        {expensesList.map((expenseItem, index) => (
          <StyledView key={index} className='flex-row items-center justify-between px-4 py-2 mx-4 bg-white rounded-md my-2'>
            <StyledText>{expenseItem}</StyledText>
            <TouchableOpacity onPress={() => handleDeleteExpense(index)}>
              <StyledText style={{ color: 'red' }}>Delete</StyledText>
            </TouchableOpacity>
          </StyledView>
        ))}

        <StyledView>
          <StyledText className='px-4 py-2 text-xl'>Add Income</StyledText>
        </StyledView>
        <StyledTextInput
          className='bg-green-100 px-4 py-2 mx-4 rounded-xl'
          placeholder='Enter Income'
          value={income}
          onChangeText={(text) => setIncome(text.replace(/[^0-9]/g, ''))}
          keyboardType='numeric'
        />
        <StyledView className='mx-10 pt-4'>
          <TouchableOpacity
            style={{
              backgroundColor: '#27ae60',
              padding: 10,
              borderRadius: 5,
              marginTop: 10,
            }}
            onPress={handleAddIncome}
          >
            <StyledText style={{ color: 'white' }}>Add Income</StyledText>
          </TouchableOpacity>
        </StyledView>

        <StyledView>
          <StyledText className='px-4 py-2 text-xl'>Income List</StyledText>
        </StyledView>
        {incomeList.map((incomeItem, index) => (
          <StyledView key={index} className='flex-row items-center justify-between px-4 py-2 mx-4 bg-white rounded-md my-2'>
            <StyledText>{incomeItem}</StyledText>
            <TouchableOpacity onPress={() => handleDeleteIncome(index)}>
              <StyledText style={{ color: 'red' }}>Delete</StyledText>
            </TouchableOpacity>
          </StyledView>
        ))}

        <StyledView>
          <StyledText className='px-4 py-2 text-xl'>Balance</StyledText>
        </StyledView>
        <StyledView className={`bg-white rounded-md my-2 p-4 ${calculateBalance().color}`}>
          <StyledText className='text-2xl text-center font-bold'>
            Balance: {calculateBalance().balance.toFixed(2)}
          </StyledText>
        </StyledView>
      </StyledView>
    </ScrollView>
  );
};

export default withExpoSnack(HomeScreen);

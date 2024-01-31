// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';
import { styled } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withExpoSnack } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

const HomeScreen = () => {
  const [expense, setExpense] = useState('');
  const [income, setIncome] = useState('');
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [previousDayBalance, setPreviousDayBalance] = useState(0);
  const [expensesList, setExpensesList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expensesSummary, setExpensesSummary] = useState(null);
  const [note, setNote] = useState('');
  const [expenseNote, setExpenseNote] = useState('');
  const [incomeNote, setIncomeNote] = useState('');


  const STORAGE_KEY = '@DailyExpenses:data';
  const MONTH_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;

  // Function to load data from AsyncStorage
  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data !== null) {
        const parsedData = JSON.parse(data);
        const { timestamp, expensesList: storedExpenses, incomeList: storedIncome } = parsedData;
        if (Date.now() - timestamp <= MONTH_IN_MILLISECONDS) {
          setExpensesList(storedExpenses || []);
          setIncomeList(storedIncome || []);
        } else {
          clearData();
        }
      }
    } catch (error) {
      console.error('Error loading data from AsyncStorage:', error);
    }
  };

  // Function to save data to AsyncStorage
  const saveData = async () => {
    try {
      const dataToSave = JSON.stringify({
        timestamp: Date.now(),
        expensesList,
        incomeList,
      });
      await AsyncStorage.setItem(STORAGE_KEY, dataToSave);
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  // Function to clear data from AsyncStorage
  const clearData = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setExpensesList([]);
      setIncomeList([]);
    } catch (error) {
      console.error('Error clearing data from AsyncStorage:', error);
    }
  };

  // Use useEffect to load data when the component mounts
  useEffect(() => {
    loadData();
  }, []);

  // Use useEffect to save data whenever expensesList or incomeList changes
  useEffect(() => {
    saveData();
  }, [expensesList, incomeList]);


  const handleShowCalendar = () => {
    setCalendarVisible(true);
  };

  const handleAddExpense = () => {
    const expenseValue = parseFloat(expense);
    if (!isNaN(expenseValue) && Number.isInteger(expenseValue)) {
      setExpensesList([...expensesList, { date: selectedDate, amount: expenseValue, note: expenseNote }]);
      setExpense('');
      setExpenseNote(''); // Clear note after adding
    } else {
      Alert.alert('Error', 'Please enter a valid integer expense amount.');
    }
  };


  const handleAddIncome = () => {
    const incomeValue = parseFloat(income);
    if (!isNaN(incomeValue) && Number.isInteger(incomeValue)) {
      setIncomeList([...incomeList, { date: selectedDate, amount: incomeValue, note: incomeNote }]);
      setIncome('');
      setIncomeNote(''); // Clear note after adding
    } else {
      Alert.alert('Error', 'Please enter a valid integer income amount.');
    }
  };

  const handleDeleteExpense = (index) => {
    const updatedExpenses = [...expensesList];
    updatedExpenses.splice(index, 1);
    setExpensesList(updatedExpenses);
  };

  const handleDeleteIncome = (index) => {
    const updatedIncome = [...incomeList];
    updatedIncome.splice(index, 1);
    setIncomeList(updatedIncome);
  };

  const calculateBalance = () => {
    const totalIncome = incomeList.reduce((acc, item) => acc + parseFloat(item.amount), 0);
    const totalExpenses = expensesList.reduce((acc, item) => acc + parseFloat(item.amount), 0);
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


  const handleCalendarDayPress = (day) => {
    setPreviousDayBalance(calculateBalance().balance);
    setCalendarVisible(false);
    setSelectedDate(day.dateString); // Update selected date

    // Update expenses summary when a date is selected
    updateExpensesSummary(day.dateString);
  };

  const updateExpensesSummary = (selectedDate) => {
    // Filter expenses for the selected month
    const selectedMonthExpenses = expensesList.filter((expense) =>
      expense.date.startsWith(selectedDate.slice(0, 7))
    );

    // Calculate total expenses for the selected month
    const totalExpenses = selectedMonthExpenses.reduce(
      (acc, item) => acc + parseFloat(item.amount),
      0
    );

    setExpensesSummary({
      selectedMonth: selectedDate.slice(0, 7),
      totalExpenses: totalExpenses.toFixed(2),
      expensesList: selectedMonthExpenses,
    });
  };

  return (
    <ScrollView>
      <StyledView className="bg-blue-300 h-full p-8">
        <StyledView className='grid grid-cols-2'>
          <TouchableOpacity
            onPress={handleShowCalendar}
            style={{
              backgroundColor: '#7C3A9F',
              padding: 10,
              borderRadius: 5,
              marginTop: 10,
              alignSelf: 'center',
            }}
          >

            <StyledText style={{ color: 'white' }}>Show Date</StyledText>
          </TouchableOpacity>
          <StyledView className="m-4">
            <StyledText className="text-lg bg-orange-100 px-5 py-1 rounded-xl">{`Selected Date: ${selectedDate}`}</StyledText>
          </StyledView>
        </StyledView>
        <StyledText className="text-center font-semibold pb-5 pt-4 text-3xl">
          DailyExpenses
        </StyledText>

        <Modal isVisible={isCalendarVisible}>
          <Calendar onDayPress={handleCalendarDayPress} />
        </Modal>

        <StyledView>
          <StyledText className="px-4 py-2 text-xl">Add Income</StyledText>
        </StyledView>
        <StyledTextInput
          className="bg-green-100 px-4 py-2 mx-4 rounded-xl"
          placeholder="Enter Income"
          value={income}
          onChangeText={(text) => setIncome(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
        />
        <StyledView className='pt-2'>
          <StyledTextInput
            className="bg-green-100 px-4 py-2 mx-4 rounded-xl"
            placeholder="Enter Note (Optional)"
            value={incomeNote}
            onChangeText={(text) => setIncomeNote(text)}
          />
        </StyledView>
        <StyledView className="mx-10 pt-4">
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
          <StyledText className="px-4 py-2 text-xl">Income List</StyledText>
        </StyledView>
        {incomeList.map((incomeItem, index) => (
          <StyledView key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-2 mx-4 bg-white rounded-md my-2">
            <StyledView className="flex-1">
              <StyledText className="mb-2 sm:mb-0">{`${incomeItem.date}: ${incomeItem.amount}`}</StyledText>
              <StyledView className="bg-yellow-100 px-4 py-2 rounded-md">
                <StyledText className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {`Note: ${incomeItem.note || '-'}`}
                </StyledText>
              </StyledView>
            </StyledView>
            <TouchableOpacity onPress={() => handleDeleteIncome(index)}>
              <StyledText className="text-red-500">Delete</StyledText>
            </TouchableOpacity>
          </StyledView>
        ))}


        <StyledView>
          <StyledText className="px-4 py-2 text-xl">Add Expenses</StyledText>
        </StyledView>
        <StyledTextInput
          className="bg-red-100 px-4 py-2 mx-4 rounded-xl"
          placeholder="Enter Expenses"
          value={expense}
          onChangeText={(text) => setExpense(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
        />
        <StyledView className='pt-2'>
          <StyledTextInput
            className="bg-red-100 px-4 py-2 mx-4 rounded-xl"
            placeholder="Enter Note (Optional)"
            value={expenseNote}
            onChangeText={(text) => setExpenseNote(text)}
          />
        </StyledView>
        <StyledView className="mx-10 mt-4">
          <TouchableOpacity
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
          <StyledText className="px-4 py-2 text-xl">Expenses List</StyledText>
        </StyledView>
        {expensesList.map((expenseItem, index) => (
          <StyledView key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-2 mx-4 bg-white rounded-md my-2">
            <StyledView className="flex-1">
              <StyledText className="mb-2 sm:mb-0">{`${expenseItem.date}: ${expenseItem.amount}`}</StyledText>
              <StyledView className="bg-red-100 px-4 py-2 rounded-md">
                <StyledText className="whitespace-normal break-words">
                  {`Note: ${expenseItem.note || '-'}`}
                </StyledText>
              </StyledView>
            </StyledView>
            <TouchableOpacity onPress={() => handleDeleteExpense(index)}>
              <StyledText className="text-red-500">Delete</StyledText>
            </TouchableOpacity>
          </StyledView>
        ))}
        <StyledView>
          <StyledText className="px-4 py-2 text-xl">Balance</StyledText>
        </StyledView>
        <StyledView className={`bg-white rounded-md my-2 p-4 ${calculateBalance().color}`}>
          <StyledText className="text-2xl text-center font-bold">
            {`Balance: ${calculateBalance().balance.toFixed(2)}`}
          </StyledText>
          {previousDayBalance !== 0 && (
            <StyledText className="text-base text-center">
              {`Previous Day Balance: ${previousDayBalance.toFixed(2)}`}
            </StyledText>
          )}
        </StyledView>
        <StyledView>
        </StyledView>
        {expensesSummary && (
          <StyledView className="bg-white rounded-md my-2 p-4">
            <StyledText className="text-xl font-bold">
              {`Expenses Summary for ${expensesSummary.selectedMonth}`}
            </StyledText>
            <StyledText>{`Total Expenses: ${expensesSummary.totalExpenses}`}</StyledText>

            <StyledView className="mt-4">
              <StyledText className="text-xl font-bold">Expenses List</StyledText>
              {expensesSummary.expensesList.map((expenseItem, index) => (
                <StyledView
                  key={index}
                  className="flex-row items-center justify-between px-4 py-2 mx-4 bg-white rounded-md my-2"
                >
                  <StyledText>{`${expenseItem.date}: ${expenseItem.amount}`}</StyledText>
                  <StyledText>{`Note: ${expenseItem.note || '-'}`}</StyledText>
                  <TouchableOpacity onPress={() => handleDeleteExpense(index)}>
                    <StyledText style={{ color: 'red' }}>Delete</StyledText>
                  </TouchableOpacity>
                </StyledView>
              ))}
            </StyledView>
          </StyledView>
        )}
      </StyledView>
    </ScrollView>
  );
};

export default withExpoSnack(HomeScreen);

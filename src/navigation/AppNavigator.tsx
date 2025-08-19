import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import TransactionsScreen from '../screens/Transactions/TransactionsScreen';
import NewTransactionScreen from '../screens/NewTransaction/NewTransactionScreen';

export type RootStackParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  NewTransaction: {
    transaction?: {
      id: string;
      type: 'Depósito' | 'Saque' | 'Transferência';
      amount: number;
      date: string;
      month: string;
    };
  } | undefined;
  Investments: undefined;
  Services: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Dashboard"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
        <Stack.Screen name="NewTransaction" component={NewTransactionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
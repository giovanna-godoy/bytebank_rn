import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TransactionsProvider } from './src/contexts/TransactionsContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TransactionsProvider>
        <AppNavigator />
      </TransactionsProvider>
    </GestureHandlerRootView>
  );
}
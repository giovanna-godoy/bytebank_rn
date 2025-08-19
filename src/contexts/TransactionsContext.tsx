import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Transaction {
  id: string;
  type: 'Depósito' | 'Saque' | 'Transferência';
  amount: number;
  date: string;
  month: string;
  receipt?: string;
}

interface TransactionsContextData {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
}

const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'Depósito', amount: 150, date: '18/11/2022', month: 'Novembro' },
    { id: '2', type: 'Depósito', amount: 100, date: '21/11/2022', month: 'Novembro' },
    { id: '3', type: 'Depósito', amount: 200, date: '01/11/2022', month: 'Novembro' },
    { id: '4', type: 'Saque', amount: -80, date: '15/10/2022', month: 'Outubro' },
    { id: '5', type: 'Transferência', amount: -250, date: '10/10/2022', month: 'Outubro' },
  ]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id 
          ? { ...updatedTransaction, id }
          : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  return (
    <TransactionsContext.Provider value={{
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
    }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};
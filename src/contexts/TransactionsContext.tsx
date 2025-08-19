import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, orderBy, limit, startAfter, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';

export interface Transaction {
  id: string;
  type: 'Depósito' | 'Saque' | 'Transferência';
  amount: number;
  date: string;
  month: string;
  receipt?: string;
  userId?: string;
  createdAt?: any;
}

interface TransactionsContextData {
  transactions: Transaction[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  loadMoreTransactions: () => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);

const TRANSACTIONS_PER_PAGE = 10;

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      setHasMore(true);
      setLastDoc(null);
      return;
    }

    loadInitialTransactions();
  }, [user]);

  const loadInitialTransactions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(TRANSACTIONS_PER_PAGE)
      );

      const snapshot = await getDocs(q);
      const transactionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      
      setTransactions(transactionsData);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === TRANSACTIONS_PER_PAGE);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTransactions = async () => {
    if (!user || !lastDoc || !hasMore || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(TRANSACTIONS_PER_PAGE)
      );

      const snapshot = await getDocs(q);
      const newTransactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      
      setTransactions(prev => [...prev, ...newTransactions]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === TRANSACTIONS_PER_PAGE);
    } catch (error) {
      console.error('Erro ao carregar mais transações:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;
    
    const cleanTransaction = Object.fromEntries(
      Object.entries(transaction).filter(([_, value]) => value !== undefined)
    );
    
    await addDoc(collection(db, 'transactions'), {
      ...cleanTransaction,
      userId: user.uid,
      createdAt: new Date(),
    });
  };

  const updateTransaction = async (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    const cleanTransaction = Object.fromEntries(
      Object.entries(updatedTransaction).filter(([_, value]) => value !== undefined)
    );
    
    await updateDoc(doc(db, 'transactions', id), cleanTransaction);
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  };

  return (
    <TransactionsContext.Provider value={{
      transactions,
      loading,
      loadingMore,
      hasMore,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      loadMoreTransactions,
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
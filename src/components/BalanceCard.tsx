import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionsContext';
import { colors } from '../constants/colors';

export default function BalanceCard() {
  const { userProfile } = useAuth();
  const { transactions } = useTransactions();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  
  const currentBalance = transactions.reduce((sum, transaction) => {
    return sum + transaction.amount;
  }, 0);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCurrentDate = () => {
    const now = new Date();
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const dayName = days[now.getDay()];
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${dayName}, ${day}/${month}/${year}`;
  };

  return (
    <View style={styles.balanceCard}>
      <Text style={styles.greeting}>
        Olá, {userProfile?.firstName ? `${userProfile.firstName}!` : 'Usuário!'} :)
      </Text>
      <Text style={styles.date}>{getCurrentDate()}</Text>
      
      <View style={styles.balanceSection}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Saldo</Text>
          <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
            <Ionicons 
              name={isBalanceVisible ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color={colors.white} 
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.accountType}>Conta Corrente</Text>
        <Text style={styles.balanceAmount}>
          {isBalanceVisible ? formatCurrency(currentBalance) : "R$ ••••••"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: colors.primary,
    margin: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 20,
  },
  balanceSection: {
    marginTop: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: colors.white,
    marginRight: 8,
  },
  accountType: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
});
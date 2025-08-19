import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTransactions } from '../contexts/TransactionsContext';
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter';
import { colors } from '../constants/colors';

const InvestmentCard = React.memo(() => {
  const { transactions } = useTransactions();
  
  const investmentData = useMemo(() => {
    const totalDeposits = transactions
      .filter(t => t.type === 'Depósito')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalWithdrawals = Math.abs(transactions
      .filter(t => t.type === 'Saque' || t.type === 'Transferência')
      .reduce((sum, t) => sum + t.amount, 0));
    
    const availableBalance = totalDeposits - totalWithdrawals;
    const rendaFixa = Math.round(availableBalance * 0.7);
    const rendaVariavel = Math.round(availableBalance * 0.3);
    const totalInvestments = rendaFixa + rendaVariavel;
    
    return { rendaFixa, rendaVariavel, totalInvestments };
  }, [transactions]);
  
  const { formatCurrency } = useCurrencyFormatter();

  return (
    <View style={styles.investmentCard}>
      <Text style={styles.sectionTitle}>Investimentos</Text>
      <Text style={styles.investmentTotal}>
        Total: {formatCurrency(investmentData.totalInvestments)}
      </Text>
      
      <View style={styles.investmentItems}>
        <View style={styles.investmentItem}>
          <Text style={styles.investmentType}>Renda Fixa</Text>
          <Text style={styles.investmentValue}>{formatCurrency(investmentData.rendaFixa)}</Text>
        </View>
        <View style={styles.investmentItem}>
          <Text style={styles.investmentType}>Renda Variável</Text>
          <Text style={styles.investmentValue}>{formatCurrency(investmentData.rendaVariavel)}</Text>
        </View>
      </View>
    </View>
  );
});

export default InvestmentCard;

const styles = StyleSheet.create({
  investmentCard: {
    backgroundColor: colors.gray.medium,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray.dark,
    marginBottom: 12,
  },
  investmentTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  investmentItems: {
    gap: 12,
  },
  investmentItem: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
  },
  investmentType: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 4,
  },
  investmentValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
});
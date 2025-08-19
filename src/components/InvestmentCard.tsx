import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function InvestmentCard() {
  return (
    <View style={styles.investmentCard}>
      <Text style={styles.sectionTitle}>Investimentos</Text>
      <Text style={styles.investmentTotal}>Total: R$ 50.000,00</Text>
      
      <View style={styles.investmentItems}>
        <View style={styles.investmentItem}>
          <Text style={styles.investmentType}>Renda Fixa</Text>
          <Text style={styles.investmentValue}>R$ 36.000,00</Text>
        </View>
        <View style={styles.investmentItem}>
          <Text style={styles.investmentType}>Renda variável</Text>
          <Text style={styles.investmentValue}>R$ 14.000,00</Text>
        </View>
      </View>
    </View>
  );
}

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
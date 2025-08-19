import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants/colors';
import { useTransactions } from '../contexts/TransactionsContext';

const StatsCard = React.memo(() => {
  const { transactions } = useTransactions();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const startAnimation = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, rotateAnim]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const transactionStats = useMemo(() => {
    const stats = {
      'Depósito': 0,
      'Saque': 0,
      'Transferência': 0
    };
    
    transactions.forEach(transaction => {
      stats[transaction.type] += Math.abs(transaction.amount);
    });
    
    const total = Object.values(stats).reduce((sum, value) => sum + value, 0);
    
    const categories = [
      { key: 'deposito', label: 'Depósitos', value: stats['Depósito'], color: colors.chart.blue },
      { key: 'saque', label: 'Saques', value: stats['Saque'], color: colors.chart.red },
      { key: 'transferencia', label: 'Transferências', value: stats['Transferência'], color: colors.chart.orange }
    ].filter(category => category.value > 0);
    
    return { categories, total };
  }, [transactions]);

  const getChartStyle = () => {
    const { categories } = transactionStats;
    if (categories.length === 0) return {};
    
    const baseStyle = {
      borderColor: categories[0]?.color || colors.gray.medium,
      borderRightColor: '',
      borderBottomColor: '',
    };
    
    if (categories.length >= 2) {
      baseStyle.borderRightColor = categories[1].color;
    }
    if (categories.length >= 3) {
      baseStyle.borderBottomColor = categories[2].color;
    }
    
    return baseStyle;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <View style={styles.statsCard}>
      <Text style={styles.sectionTitle}>Estatísticas</Text>
      
      <View style={styles.chartContainer}>
        <Animated.View style={[
          styles.donutChart,
          getChartStyle(),
          {
            transform: [
              { scale: scaleAnim },
              { rotate: spin }
            ]
          }
        ]}>
          <View style={styles.chartCenter}>
          </View>
        </Animated.View>
        <View style={styles.legend}>
          {transactionStats.categories.length > 0 ? (
            transactionStats.categories.map((category) => (
              <View key={category.key} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: category.color }]} />
                <View style={styles.legendContent}>
                  <Text style={styles.legendText}>{category.label}</Text>
                  <Text style={styles.legendValue}>{formatCurrency(category.value)}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Nenhuma transação encontrada</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
});

export default StatsCard;

const styles = StyleSheet.create({
  statsCard: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 12,
  },
  chartContainer: {
    alignItems: 'center',
  },
  donutChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartCenter: {
    position: 'absolute',
  },
  chartCenterText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
  legend: {
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendValue: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    fontSize: 14,
    color: colors.white,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noDataText: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.7,
  },
});
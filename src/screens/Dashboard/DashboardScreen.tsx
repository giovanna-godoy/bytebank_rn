import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu" size={24} color="#FFFFFF" />
        <Ionicons name="person-circle-outline" size={32} color="#FFFFFF" />
      </View>

      {/* Saldo Card */}
      <Animated.View style={[
        styles.balanceCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>
        <Text style={styles.greeting}>Olá, Joana! :)</Text>
        <Text style={styles.date}>Quinta-feira, 08/09/2022</Text>
        
        <View style={styles.balanceSection}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Saldo</Text>
            <Ionicons name="eye-outline" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.accountType}>Conta Corrente</Text>
          <Text style={styles.balanceAmount}>R$ 2.500,00</Text>
        </View>
      </Animated.View>

      {/* Investimentos */}
      <Animated.View style={[
        styles.investmentCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>
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
      </Animated.View>

      {/* Estatísticas */}
      <Animated.View style={[
        styles.statsCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        
        <View style={styles.chartContainer}>
          <View style={styles.donutChart}>
            <View style={styles.chartCenter}>
              <Text style={styles.chartCenterText}>Portfolio</Text>
            </View>
          </View>
          
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.legendText}>Fundos de investimento</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#8B5CF6' }]} />
              <Text style={styles.legendText}>Tesouro Direto</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.legendText}>Previdência Privada</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#F97316' }]} />
              <Text style={styles.legendText}>Bolsa de Valores</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  balanceCard: {
    backgroundColor: '#0F766E',
    margin: 20,
    marginTop: -10,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#A7F3D0',
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
    color: '#FFFFFF',
    marginRight: 8,
  },
  accountType: {
    fontSize: 14,
    color: '#A7F3D0',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  investmentCard: {
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
  },
  investmentTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F766E',
    marginBottom: 16,
  },
  investmentItems: {
    gap: 12,
  },
  investmentItem: {
    backgroundColor: '#0F766E',
    padding: 16,
    borderRadius: 12,
  },
  investmentType: {
    fontSize: 14,
    color: '#A7F3D0',
    marginBottom: 4,
  },
  investmentValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsCard: {
    backgroundColor: '#0F766E',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  donutChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 20,
    borderColor: '#3B82F6',
    borderTopColor: '#8B5CF6',
    borderRightColor: '#EF4444',
    borderBottomColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartCenter: {
    position: 'absolute',
  },
  chartCenterText: {
    fontSize: 12,
    color: '#FFFFFF',
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
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});
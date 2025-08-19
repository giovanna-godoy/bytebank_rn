import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants/colors';

interface StatsCardProps {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export default function StatsCard({ fadeAnim, slideAnim }: StatsCardProps) {
  return (
    <Animated.View style={[
      styles.statsCard,
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
    ]}>
      <Text style={styles.sectionTitle}>Estatísticas</Text>
      
      <View style={styles.chartContainer}>
        <View style={styles.donutChart}>
          <View style={styles.chartCenter}>
          </View>
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.chart.blue }]} />
            <Text style={styles.legendText}>Fundos de investimento</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.chart.purple }]} />
            <Text style={styles.legendText}>Tesouro Direto</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.chart.red }]} />
            <Text style={styles.legendText}>Previdência Privada</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.chart.orange }]} />
            <Text style={styles.legendText}>Bolsa de Valores</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

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
    borderColor: colors.chart.blue,
    borderTopColor: colors.chart.purple,
    borderRightColor: colors.chart.red,
    borderBottomColor: colors.chart.orange,
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
});
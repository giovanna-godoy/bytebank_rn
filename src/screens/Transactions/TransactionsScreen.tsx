import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../constants/colors';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTransactions, Transaction } from '../../contexts/TransactionsContext';
import Header from '../../components/Header';
import ProfileMenu from '../../components/ProfileMenu';
import SideMenu from '../../components/SideMenu';
import SwipeableTransaction from '../../components/SwipeableTransaction';

type TransactionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Transactions'>;

export default function TransactionsScreen() {
  const navigation = useNavigation<TransactionsScreenNavigationProp>();
  const { transactions, loading, loadingMore, hasMore, deleteTransaction, loadMoreTransactions } = useTransactions();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('Todos');
  const [selectedType, setSelectedType] = useState<string>('Todos');



  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const monthMatch = selectedMonth === 'Todos' || transaction.month === selectedMonth;
      const typeMatch = selectedType === 'Todos' || transaction.type === selectedType;
      return monthMatch && typeMatch;
    });
  }, [transactions, selectedMonth, selectedType]);

  const handleEditTransaction = useCallback((id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      navigation.navigate('NewTransaction', { transaction });
    }
  }, [transactions, navigation]);

  const handleDeleteTransaction = useCallback(async (id: string) => {
    try {
      await deleteTransaction(id);
    } catch (error) {
      console.error('Erro no handleDeleteTransaction:', error);
    }
  }, [deleteTransaction]);

  const flatListData = useMemo(() => {
    return filteredTransactions.map((transaction, index) => {
      const isFirstInMonth = index === 0 || filteredTransactions[index - 1].month !== transaction.month;
      return { ...transaction, showMonthHeader: isFirstInMonth };
    });
  }, [filteredTransactions]);

  const renderTransaction = useCallback(({ item }: { item: Transaction & { showMonthHeader: boolean } }) => (
    <SwipeableTransaction
      item={item}
      onEdit={handleEditTransaction}
      onDelete={handleDeleteTransaction}
    />
  ), [handleEditTransaction, handleDeleteTransaction]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const handleEndReached = useCallback(() => {
    if (hasMore && !loadingMore) {
      loadMoreTransactions();
    }
  }, [hasMore, loadingMore, loadMoreTransactions]);

  return (
    <View style={styles.container}>
      <Header 
        onMenuPress={() => setShowSideMenu(true)}
        onProfilePress={() => setShowProfileMenu(!showProfileMenu)} 
      />
      
      <SideMenu
        visible={showSideMenu}
        onClose={() => setShowSideMenu(false)}
        onNavigate={(screen) => navigation.navigate(screen as keyof RootStackParamList)}
      />
      
      <ProfileMenu 
        visible={showProfileMenu}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Listagem de Transações</Text>
        
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Mês:</Text>
            <View style={styles.filterButtons}>
              {['Todos', 'Novembro', 'Outubro'].map((month) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.filterButton,
                    selectedMonth === month && styles.filterButtonActive
                  ]}
                  onPress={() => setSelectedMonth(month)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    selectedMonth === month && styles.filterButtonTextActive
                  ]}>
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Tipo:</Text>
            <View style={styles.filterButtons}>
              {['Todos', 'Depósito', 'Saque', 'Transferência'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterButton,
                    selectedType === type && styles.filterButtonActive
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    selectedType === type && styles.filterButtonTextActive
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        <FlatList
          data={flatListData}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => navigation.navigate('NewTransaction')}
      >
        <Ionicons name="add" size={24} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray.light,
  },
  content: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray.dark,
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.gray.medium,
    borderWidth: 1,
    borderColor: colors.gray.medium,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: colors.gray.dark,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  list: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray.dark,
    marginBottom: 20,
  },
  loadingFooter: {
    padding: 20,
    alignItems: 'center',
  },

  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
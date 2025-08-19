import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../constants/colors';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Header from '../../components/Header';
import ProfileMenu from '../../components/ProfileMenu';
import SideMenu from '../../components/SideMenu';

interface Transaction {
  id: string;
  type: 'Depósito' | 'Saque' | 'Transferência';
  amount: number;
  date: string;
  month: string;
}

type TransactionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Transactions'>;

export default function TransactionsScreen() {
  const navigation = useNavigation<TransactionsScreenNavigationProp>();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'Depósito', amount: 150, date: '18/11/2022', month: 'Novembro' },
    { id: '2', type: 'Depósito', amount: 100, date: '21/11/2022', month: 'Novembro' },
    { id: '3', type: 'Depósito', amount: 200, date: '01/11/2022', month: 'Novembro' },
    { id: '4', type: 'Saque', amount: -80, date: '15/10/2022', month: 'Outubro' },
    { id: '5', type: 'Transferência', amount: -250, date: '10/10/2022', month: 'Outubro' },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('Todos');
  const [selectedType, setSelectedType] = useState<string>('Todos');

  const generateMoreTransactions = useCallback(() => {
    const types: Transaction['type'][] = ['Depósito', 'Saque', 'Transferência'];
    const months = ['Setembro', 'Agosto', 'Julho', 'Junho', 'Maio'];
    const newTransactions: Transaction[] = [];
    
    for (let i = 0; i < 10; i++) {
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomAmount = randomType === 'Depósito' 
        ? Math.floor(Math.random() * 500) + 50
        : -(Math.floor(Math.random() * 300) + 20);
      const randomMonth = months[Math.floor(Math.random() * months.length)];
      const randomDay = Math.floor(Math.random() * 28) + 1;
      
      newTransactions.push({
        id: `${transactions.length + i + 1}`,
        type: randomType,
        amount: randomAmount,
        date: `${randomDay.toString().padStart(2, '0')}/10/2022`,
        month: randomMonth,
      });
    }
    
    return newTransactions;
  }, [transactions.length]);

  const loadMoreTransactions = useCallback(() => {
    if (loading) return;
    
    setLoading(true);
    setTimeout(() => {
      const newTransactions = generateMoreTransactions();
      setTransactions(prev => [...prev, ...newTransactions]);
      setLoading(false);
    }, 1000);
  }, [loading, generateMoreTransactions]);

  const filteredTransactions = transactions.filter(transaction => {
    const monthMatch = selectedMonth === 'Todos' || transaction.month === selectedMonth;
    const typeMatch = selectedType === 'Todos' || transaction.type === selectedType;
    return monthMatch && typeMatch;
  });

  const flatListData = filteredTransactions.map((transaction, index) => {
    const isFirstInMonth = index === 0 || filteredTransactions[index - 1].month !== transaction.month;
    return { ...transaction, showMonthHeader: isFirstInMonth };
  });

  const renderTransaction = ({ item }: { item: Transaction & { showMonthHeader: boolean } }) => (
    <View>
      {item.showMonthHeader && (
        <Text style={styles.monthTitle}>{item.month}</Text>
      )}
      <View style={styles.transactionItem}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionType}>{item.type}</Text>
          <Text style={[
            styles.transactionAmount,
            { color: item.amount > 0 ? '#10B981' : colors.gray.dark }
          ]}>
            R$ {Math.abs(item.amount)}
          </Text>
        </View>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

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
        onLogout={() => {
          setShowProfileMenu(false);
          console.log('Logout');
        }}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Extrato</Text>
        
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
          onEndReached={loadMoreTransactions}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      </View>
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
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 12,
  },
  transactionItem: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray.dark,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 14,
    color: colors.gray.dark,
    opacity: 0.7,
  },
});
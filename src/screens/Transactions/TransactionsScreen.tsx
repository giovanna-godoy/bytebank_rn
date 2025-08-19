import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
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

  const flatListData = transactions.map((transaction, index) => {
    const isFirstInMonth = index === 0 || transactions[index - 1].month !== transaction.month;
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
      
      <FlatList
        style={styles.content}
        data={flatListData}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        onEndReached={loadMoreTransactions}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={<Text style={styles.title}>Extrato</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray.light,
  },
  content: {
    paddingTop: 120,
    paddingHorizontal: 20,
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
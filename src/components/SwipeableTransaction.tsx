import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

interface Transaction {
  id: string;
  type: 'Depósito' | 'Saque' | 'Transferência';
  amount: number;
  date: string;
  month: string;
}

interface SwipeableTransactionProps {
  item: Transaction & { showMonthHeader: boolean };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SwipeableTransaction = React.memo(({ item, onEdit, onDelete }: SwipeableTransactionProps) => {
  const translateX = new Animated.Value(0);
  const [isSwipeOpen, setIsSwipeOpen] = React.useState(false);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { 
      useNativeDriver: true,
      listener: (event: any) => {
        const { translationX } = event.nativeEvent;
        if (translationX > 0) {
          translateX.setValue(0);
        } else if (translationX < -120) {
          translateX.setValue(-120);
        }
      }
    }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;
      
      if (translationX < -60) {
        Animated.timing(translateX, {
          toValue: -120,
          duration: 200,
          useNativeDriver: true,
        }).start();
        setIsSwipeOpen(true);
      } else {
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
        setIsSwipeOpen(false);
      }
    }
  };

  return (
    <View>
      {item.showMonthHeader && (
        <Text style={styles.monthTitle}>{item.month}</Text>
      )}
      <View style={styles.container}>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(item.id)}
          >
            <Ionicons name="pencil" size={20} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(item.id)}
          >
            <Ionicons name="trash" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
        
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          activeOffsetX={[-10, 10]}
        >
          <Animated.View 
            style={[styles.transactionItem, { transform: [{ translateX }] }]}
          >
            <View style={styles.transactionContent}>
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
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
});

export default SwipeableTransaction;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 8,
  },
  actionsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    width: 120,
    borderRadius: 8,
    overflow: 'hidden',
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  transactionItem: {
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionContent: {
    padding: 16,
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
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 12,
  },
});
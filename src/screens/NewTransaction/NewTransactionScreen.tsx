import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { colors } from '../../constants/colors';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTransactions } from '../../contexts/TransactionsContext';

type NewTransactionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NewTransaction'>;
type NewTransactionScreenRouteProp = RouteProp<RootStackParamList, 'NewTransaction'>;

export default function NewTransactionScreen() {
  const navigation = useNavigation<NewTransactionScreenNavigationProp>();
  const route = useRoute<NewTransactionScreenRouteProp>();
  const { addTransaction, updateTransaction } = useTransactions();
  const { transaction } = route.params || {};
  
  const [selectedType, setSelectedType] = useState<'Depósito' | 'Saque' | 'Transferência'>(transaction?.type || 'Depósito');
  const [amount, setAmount] = useState(transaction ? Math.abs(transaction.amount).toString() : '');
  const [description, setDescription] = useState(transaction?.type || '');
  const [receipt, setReceipt] = useState<string | undefined>(transaction?.receipt);
  const [errors, setErrors] = useState<{amount?: string; description?: string}>({});

  const validateAmount = (value: string): string | undefined => {
    if (!value.trim()) return 'Valor é obrigatório';
    const numValue = parseFloat(value.replace(',', '.'));
    if (isNaN(numValue)) return 'Valor deve ser um número válido';
    if (numValue <= 0) return 'Valor deve ser maior que zero';
    if (numValue > 100000) return 'Valor não pode exceder R$ 100.000';
    return undefined;
  };

  const validateDescription = (value: string): string | undefined => {
    if (!value.trim()) return 'Descrição é obrigatória';
    if (value.length < 3) return 'Descrição deve ter pelo menos 3 caracteres';
    if (value.length > 100) return 'Descrição não pode exceder 100 caracteres';
    return undefined;
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    const error = validateAmount(value);
    setErrors(prev => ({ ...prev, amount: error }));
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    const error = validateDescription(value);
    setErrors(prev => ({ ...prev, description: error }));
  };

  const handleSave = async () => {
    const amountError = validateAmount(amount);
    const descriptionError = validateDescription(description);
    
    setErrors({ amount: amountError, description: descriptionError });
    
    if (!amountError && !descriptionError) {
      const numAmount = parseFloat(amount.replace(',', '.'));
      const finalAmount = selectedType === 'Depósito' ? numAmount : -numAmount;
      
      const transactionData = {
        type: selectedType,
        amount: finalAmount,
        date: new Date().toLocaleDateString('pt-BR'),
        month: new Date().toLocaleDateString('pt-BR', { month: 'long' }),
        receipt,
      };
      
      try {
        if (transaction) {
          await updateTransaction(transaction.id, transactionData);
        } else {
          await addTransaction(transactionData);
        }
        navigation.goBack();
      } catch (error) {
        console.error('Erro ao salvar transação:', error);
      }
    }
  };

  const isFormValid = amount.trim() !== '' && description.trim() !== '' && !errors.amount && !errors.description;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setReceipt(result.assets[0].uri);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setReceipt(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar o documento');
    }
  };

  const showUploadOptions = () => {
    Alert.alert(
      'Adicionar Recibo',
      'Escolha uma opção:',
      [
        { text: 'Galeria', onPress: pickImage },
        { text: 'Documentos', onPress: pickDocument },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{transaction ? 'Editar Transação' : 'Nova Transação'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Transação</Text>
          <View style={styles.typeButtons}>
            {(['Depósito', 'Saque', 'Transferência'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  selectedType === type && styles.typeButtonActive
                ]}
                onPress={() => setSelectedType(type)}
              >
                <Text style={[
                  styles.typeButtonText,
                  selectedType === type && styles.typeButtonTextActive
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valor</Text>
          <TextInput
            style={[styles.input, errors.amount && styles.inputError]}
            placeholder="R$ 0,00"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
          />
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <TextInput
            style={[styles.input, errors.description && styles.inputError]}
            placeholder="Digite uma descrição"
            value={description}
            onChangeText={handleDescriptionChange}
            multiline
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recibo (Opcional)</Text>
          {receipt ? (
            <View style={styles.receiptContainer}>
              <Image source={{ uri: receipt }} style={styles.receiptImage} />
              <TouchableOpacity 
                style={styles.removeReceiptButton}
                onPress={() => setReceipt(undefined)}
              >
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={showUploadOptions}>
              <Ionicons name="camera" size={24} color={colors.primary} />
              <Text style={styles.uploadButtonText}>Adicionar Recibo</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={!isFormValid}
        >
          <Text style={[styles.saveButtonText, !isFormValid && styles.saveButtonTextDisabled]}>
            {transaction ? 'Atualizar Transação' : 'Salvar Transação'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray.dark,
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.gray.medium,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    color: colors.gray.dark,
  },
  typeButtonTextActive: {
    color: colors.white,
  },
  input: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.gray.medium,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  saveButtonDisabled: {
    backgroundColor: colors.gray.medium,
  },
  saveButtonTextDisabled: {
    color: colors.gray.dark,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  receiptContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: colors.gray.light,
  },
  removeReceiptButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
});
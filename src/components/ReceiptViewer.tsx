import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

interface ReceiptViewerProps {
  receiptUrl: string;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

export default function ReceiptViewer({ receiptUrl, onRemove, showRemoveButton = false }: ReceiptViewerProps) {
  const isImage = receiptUrl.includes('.jpg') || receiptUrl.includes('.jpeg') || receiptUrl.includes('.png');
  const isPDF = receiptUrl.includes('.pdf');

  const handleOpenReceipt = () => {
    Linking.openURL(receiptUrl);
  };

  return (
    <View style={styles.container}>
      {isImage ? (
        <Image source={{ uri: receiptUrl }} style={styles.image} />
      ) : (
        <TouchableOpacity style={styles.pdfContainer} onPress={handleOpenReceipt}>
          <Ionicons name="document-text" size={40} color={colors.primary} />
          <Text style={styles.pdfText}>Abrir PDF</Text>
        </TouchableOpacity>
      )}
      
      {showRemoveButton && onRemove && (
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <Ionicons name="close-circle" size={24} color="#EF4444" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.gray.light,
  },
  pdfContainer: {
    width: '100%',
    height: 200,
    backgroundColor: colors.gray.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray.medium,
    borderRadius: 8,
  },
  pdfText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
});
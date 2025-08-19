import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../config/firebase';

export const uploadReceipt = async (uri: string, userId: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const filename = `receipts/${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const storageRef = ref(storage, filename);
    
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Erro ao fazer upload do recibo:', error);
    throw error;
  }
};

export const deleteReceipt = async (receiptUrl: string): Promise<void> => {
  try {
    const storageRef = ref(storage, receiptUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Erro ao deletar recibo:', error);
    throw error;
  }
};
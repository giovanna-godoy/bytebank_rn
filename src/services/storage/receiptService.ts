import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../config/firebase';

export const uploadReceipt = async (uri: string, userId: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  
  const filename = `receipts/${userId}/${Date.now()}.jpg`;
  const storageRef = ref(storage, filename);
  
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
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
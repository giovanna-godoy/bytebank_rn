import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

interface ProfileMenuProps {
  visible: boolean;
  onLogout: () => void;
}

export default function ProfileMenu({ visible, onLogout }: ProfileMenuProps) {
  if (!visible) return null;

  return (
    <View style={styles.profileMenu}>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.white} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  profileMenu: {
    position: 'absolute',
    top: 90,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 8,
    zIndex: 1001,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    color: colors.white,
    fontSize: 16,
    marginLeft: 8,
  },
});
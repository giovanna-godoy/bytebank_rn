import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

interface HeaderProps {
  onMenuPress: () => void;
  onProfilePress: () => void;
}

export default function Header({ onMenuPress, onProfilePress }: HeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name="menu" size={24} color={colors.white} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onProfilePress}>
        <Ionicons name="person-circle-outline" size={32} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    zIndex: 1000,
  },
});
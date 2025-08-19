import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { colors } from '../../constants/colors';
import Header from '../../components/Header';
import ProfileMenu from '../../components/ProfileMenu';
import SideMenu from '../../components/SideMenu';
import BalanceCard from '../../components/BalanceCard';
import InvestmentCard from '../../components/InvestmentCard';
import StatsCard from '../../components/StatsCard';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Header 
        onMenuPress={() => setShowSideMenu(true)}
        onProfilePress={() => setShowProfileMenu(!showProfileMenu)} 
      />
      
      <SideMenu
        visible={showSideMenu}
        onClose={() => setShowSideMenu(false)}
        onNavigate={(screen) => console.log('Navigate to:', screen)}
      />
      
      <ProfileMenu 
        visible={showProfileMenu}
        onLogout={() => {
          setShowProfileMenu(false);
          console.log('Logout');
        }}
      />
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BalanceCard fadeAnim={fadeAnim} slideAnim={slideAnim} />
        <InvestmentCard fadeAnim={fadeAnim} slideAnim={slideAnim} />
        <StatsCard fadeAnim={fadeAnim} slideAnim={slideAnim} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray.light,
  },
  scrollContent: {
    paddingTop: 90,
  },
});
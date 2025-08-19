import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../constants/colors';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Header from '../../components/Header';
import ProfileMenu from '../../components/ProfileMenu';
import SideMenu from '../../components/SideMenu';
import BalanceCard from '../../components/BalanceCard';
import InvestmentCard from '../../components/InvestmentCard';
import StatsCard from '../../components/StatsCard';

const { width } = Dimensions.get('window');

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  
  const balanceAnim = useRef(new Animated.Value(0)).current;
  const investmentAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  
  const balanceSlide = useRef(new Animated.Value(50)).current;
  const investmentSlide = useRef(new Animated.Value(50)).current;
  const statsSlide = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(balanceAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(balanceSlide, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(investmentAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(investmentSlide, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(statsAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(statsSlide, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
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
        onNavigate={(screen) => navigation.navigate(screen as keyof RootStackParamList)}
      />
      
      <ProfileMenu 
        visible={showProfileMenu}
        onLogout={() => {
          setShowProfileMenu(false);
          console.log('Logout');
        }}
      />
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{
          opacity: balanceAnim,
          transform: [{ translateY: balanceSlide }]
        }}>
          <BalanceCard />
        </Animated.View>
        
        <Animated.View style={{
          opacity: investmentAnim,
          transform: [{ translateY: investmentSlide }]
        }}>
          <InvestmentCard />
        </Animated.View>
        
        <Animated.View style={{
          opacity: statsAnim,
          transform: [{ translateY: statsSlide }]
        }}>
          <StatsCard />
        </Animated.View>
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
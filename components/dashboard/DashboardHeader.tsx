import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Colors from '@/constants/Colors';

export function DashboardHeader() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  // Format date: "Monday, May 1"
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
  
  return (
    <View style={[styles.container, isLargeScreen && styles.containerLarge]}>
      <View>
        <Text style={styles.welcome}>Welcome to Flee Composer</Text>
        <Text style={styles.date}>{today}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  containerLarge: {
    paddingHorizontal: 80,
  },
  welcome: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.gray[900],
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[500],
  },
});
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { RecentBookings } from '@/components/dashboard/RecentBookings';
import { useStore } from '@/store';
import Colors from '@/constants/Colors';
import { Bus, Route, MapPin, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const router = useRouter();
  
  const { vans, routes, bookings } = useStore();
  
  const availableVans = vans.filter(van => van.status === 'available').length;
  const totalVans = vans.length;
  const activeRoutes = routes.length;
  const totalBookings = bookings.length;
  const availableSeats = vans.reduce((total, van) => {
    if (van.status === 'available') {
      return total + (van.capacity - van.occupiedSeats);
    }
    return total;
  }, 0);

  return (
    <ScrollView style={styles.container}>
      <DashboardHeader />
      
      <View style={[styles.statsContainer, isLargeScreen && styles.statsContainerLarge]}>
        <StatusCard 
          title="Vans"
          value={`${availableVans}/${totalVans}`}
          subtitle="Available"
          icon={<Bus size={24} color={Colors.primary[500]} />}
          onPress={() => router.push('/vans')}
        />
        <StatusCard 
          title="Routes"
          value={`${activeRoutes}`}
          subtitle="Active Routes"
          icon={<Route size={24} color={Colors.secondary[500]} />}
          onPress={() => router.push('/routes')}
        />
        <StatusCard 
          title="Seats"
          value={`${availableSeats}`}
          subtitle="Available Seats"
          icon={<MapPin size={24} color={Colors.accent[500]} />}
          onPress={() => router.push('/seats')}
        />
      </View>

      <View style={[styles.section, isLargeScreen && styles.sectionLarge]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/seats')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ArrowRight size={16} color={Colors.primary[500]} />
          </TouchableOpacity>
        </View>
        <RecentBookings />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  statsContainer: {
    padding: 16,
    flexDirection: 'column',
    gap: 12,
  },
  statsContainerLarge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 80,
    paddingVertical: 24,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionLarge: {
    marginHorizontal: 80,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.gray[900],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[500],
  },
});
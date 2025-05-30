import { View, Text, StyleSheet, FlatList } from 'react-native';
import Colors from '@/constants/Colors';
import { useStore } from '@/store';
import { formatDate } from '@/utils/formatDate';
import { BookingStatus } from '@/components/seats/BookingStatus';

export function RecentBookings() {
  const { bookings, vans } = useStore();
  
  // Sort by booking date, newest first
  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
  ).slice(0, 5); // Get only the 5 most recent
  
  // Helper to get van name from booking
  const getVanName = (vanId: string) => {
    const van = vans.find(v => v.id === vanId);
    return van ? van.name : 'Unknown Van';
  };
  
  if (sortedBookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No recent bookings</Text>
      </View>
    );
  }
  
  return (
    <FlatList
      data={sortedBookings}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.bookingItem}>
          <View style={styles.bookingInfo}>
            <Text style={styles.passengerName}>{item.passengerName}</Text>
            <Text style={styles.bookingDetails}>
              Seat #{item.seatNumber} • {getVanName(item.vanId)}
            </Text>
            <Text style={styles.bookingDate}>{formatDate(item.bookingDate)}</Text>
          </View>
          <BookingStatus status={item.status} />
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[500],
  },
  bookingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  passengerName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.gray[900],
    marginBottom: 2,
  },
  bookingDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 2,
  },
  bookingDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[400],
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray[200],
  },
});
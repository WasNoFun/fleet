import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Van } from '@/types';
import Colors from '@/constants/Colors';
import { Bus, MapPin } from 'lucide-react-native';

interface VanCardProps {
  van: Van;
  onPress: () => void;
  style?: ViewStyle;
}

export function VanCard({ van, onPress, style }: VanCardProps) {
  const availableSeats = van.capacity - van.occupiedSeats;
  
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Bus size={16} color={Colors.primary[500]} />
          <Text style={styles.vanName}>{van.name}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          van.status === 'available' ? styles.statusAvailable : styles.statusUnavailable
        ]}>
          <Text style={[
            styles.statusText,
            van.status === 'available' ? styles.statusTextAvailable : styles.statusTextUnavailable
          ]}>
            {van.status === 'available' ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.licensePlate}>
        License: {van.licensePlate}
      </Text>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Capacity</Text>
          <Text style={styles.detailValue}>{van.capacity} seats</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Available</Text>
          <Text style={[
            styles.detailValue, 
            availableSeats === 0 && styles.noSeatsAvailable
          ]}>
            {availableSeats} seats
          </Text>
        </View>
      </View>
      
      {van.route && (
        <View style={styles.routeContainer}>
          <MapPin size={14} color={Colors.gray[500]} />
          <Text style={styles.routeText}>
            {van.route.startLocation} → {van.route.endLocation}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vanName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.gray[900],
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusAvailable: {
    backgroundColor: Colors.success[100],
  },
  statusUnavailable: {
    backgroundColor: Colors.error[100],
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  statusTextAvailable: {
    color: Colors.success[700],
  },
  statusTextUnavailable: {
    color: Colors.error[700],
  },
  licensePlate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 16,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    padding: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[500],
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[900],
  },
  noSeatsAvailable: {
    color: Colors.error[600],
  },
  divider: {
    width: 1,
    backgroundColor: Colors.gray[300],
    marginHorizontal: 12,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    gap: 6,
  },
  routeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.gray[600],
    flex: 1,
  },
});
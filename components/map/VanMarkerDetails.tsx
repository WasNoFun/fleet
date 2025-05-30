import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { Van } from '@/types';
import { X, Bus, Route, Users } from 'lucide-react-native';
import { formatTime } from '@/utils/formatDate';

interface VanMarkerDetailsProps {
  van: Van;
  onClose: () => void;
  style?: any;
}

export function VanMarkerDetails({ van, onClose, style }: VanMarkerDetailsProps) {
  const availableSeats = van.capacity - van.occupiedSeats;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Bus size={20} color={Colors.primary[500]} />
          <Text style={styles.title}>{van.name}</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={20} color={Colors.gray[500]} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>License Plate</Text>
          <Text style={styles.value}>{van.licensePlate}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Status</Text>
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

        <View style={styles.infoRow}>
          <View style={styles.iconLabel}>
            <Users size={16} color={Colors.gray[500]} />
            <Text style={styles.label}>Capacity</Text>
          </View>
          <Text style={styles.value}>
            {availableSeats} available of {van.capacity} seats
          </Text>
        </View>

        {van.route && (
          <>
            <View style={styles.divider} />
            <View style={styles.routeInfo}>
              <View style={styles.iconLabel}>
                <Route size={16} color={Colors.gray[500]} />
                <Text style={styles.label}>Current Route</Text>
              </View>
              <Text style={styles.routeName}>{van.route.name}</Text>
              <View style={styles.routeDetails}>
                <View style={styles.locationDot} />
                <Text style={styles.locationText}>{van.route.startLocation}</Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routeDetails}>
                <View style={styles.locationDot} />
                <Text style={styles.locationText}>{van.route.endLocation}</Text>
              </View>
              <Text style={styles.estimatedTime}>
                Estimated time: {formatTime(van.route.estimatedTime)}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    ...Platform.select({
      web: {
        maxWidth: 400,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.gray[900],
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[500],
  },
  value: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
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
  divider: {
    height: 1,
    backgroundColor: Colors.gray[200],
    marginVertical: 16,
  },
  routeInfo: {
    gap: 12,
  },
  routeName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.gray[900],
    marginTop: 4,
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary[500],
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: Colors.primary[300],
    marginLeft: 3,
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[700],
  },
  estimatedTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[500],
    marginTop: 4,
  },
});
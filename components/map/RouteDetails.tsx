import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Route } from '@/types';
import Colors from '@/constants/Colors';
import { X, Clock, MapPin } from 'lucide-react-native';
import { formatTime } from '@/utils/formatDate';

interface RouteDetailsProps {
  route: Route;
  onClose: () => void;
  style?: any;
}

export function RouteDetails({ route, onClose, style }: RouteDetailsProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{route.name}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={20} color={Colors.gray[500]} />
        </TouchableOpacity>
      </View>

      <View style={styles.timeContainer}>
        <Clock size={16} color={Colors.primary[500]} />
        <Text style={styles.timeText}>
          Estimated time: {formatTime(route.estimatedTime)}
        </Text>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationItem}>
          <View style={styles.locationDot} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Start</Text>
            <Text style={styles.locationText}>{route.startLocation}</Text>
          </View>
        </View>

        <View style={styles.locationLine} />

        <View style={styles.locationItem}>
          <View style={[styles.locationDot, styles.locationDotEnd]} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Destination</Text>
            <Text style={styles.locationText}>{route.endLocation}</Text>
          </View>
        </View>
      </View>

      <View style={styles.coordinatesContainer}>
        <View style={styles.coordinateItem}>
          <MapPin size={14} color={Colors.gray[500]} />
          <Text style={styles.coordinateText}>
            {route.startCoordinates.latitude.toFixed(4)}, {route.startCoordinates.longitude.toFixed(4)}
          </Text>
        </View>
        <View style={styles.coordinateItem}>
          <MapPin size={14} color={Colors.gray[500]} />
          <Text style={styles.coordinateText}>
            {route.endCoordinates.latitude.toFixed(4)}, {route.endCoordinates.longitude.toFixed(4)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.gray[900],
  },
  closeButton: {
    padding: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    backgroundColor: Colors.primary[50],
    padding: 8,
    borderRadius: 8,
  },
  timeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[700],
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary[500],
    marginTop: 4,
  },
  locationDotEnd: {
    backgroundColor: Colors.secondary[500],
  },
  locationLine: {
    width: 2,
    height: 24,
    backgroundColor: Colors.gray[300],
    marginLeft: 5,
    marginVertical: 4,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[500],
    marginBottom: 2,
  },
  locationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[900],
  },
  coordinatesContainer: {
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  coordinateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coordinateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[600],
  },
});
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Route } from '@/types';
import Colors from '@/constants/Colors';
import { formatTime } from '@/utils/formatDate';
import { ArrowRight, Clock } from 'lucide-react-native';

interface RouteCardProps {
  route: Route;
  onPress: () => void;
}

export function RouteCard({ route, onPress }: RouteCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.locationContainer}>
        <View style={styles.locationDot} />
        <View style={styles.locationLine} />
        <View style={styles.locationDot} />
      </View>
      
      <View style={styles.routeInfo}>
        <View>
          <Text style={styles.routeName}>{route.name}</Text>
          <View style={styles.timeContainer}>
            <Clock size={14} color={Colors.gray[500]} />
            <Text style={styles.timeText}>{formatTime(route.estimatedTime)}</Text>
          </View>
        </View>
        
        <View style={styles.locations}>
          <Text style={styles.locationText}>{route.startLocation}</Text>
          <View style={styles.arrowContainer}>
            <ArrowRight size={14} color={Colors.gray[400]} />
          </View>
          <Text style={styles.locationText}>{route.endLocation}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary[500],
  },
  locationLine: {
    width: 2,
    height: 30,
    backgroundColor: Colors.primary[300],
    marginVertical: 4,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.gray[900],
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  timeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.gray[500],
  },
  locations: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[700],
    flex: 1,
    flexShrink: 1,
  },
  arrowContainer: {
    width: 20,
    alignItems: 'center',
  },
});
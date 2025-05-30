import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { useStore } from '@/store';
import { MapView } from '@/components/map/MapView';
import { RouteDetails } from '@/components/map/RouteDetails';
import { VanMarkerDetails } from '@/components/map/VanMarkerDetails';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FilterButton } from '@/components/ui/FilterButton';
import { MapPin, Route } from 'lucide-react-native';

export default function MapScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const { vans, routes } = useStore();
  const [selectedVan, setSelectedVan] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [mapView, setMapView] = useState('vans'); // 'vans' or 'routes'

  const availableVans = vans.filter(van => van.status === 'available');

  const handleVanSelect = (van) => {
    setSelectedVan(van);
    setSelectedRoute(null);
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setSelectedVan(null);
  };

  const handleCloseDetails = () => {
    setSelectedVan(null);
    setSelectedRoute(null);
  };

  return (
    <View style={styles.container}>
      <SectionHeader title="Live Map" />
      
      <View style={[styles.actionBar, isLargeScreen && styles.actionBarLarge]}>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewButton,
              mapView === 'vans' && styles.viewButtonActive
            ]}
            onPress={() => setMapView('vans')}
          >
            <MapPin size={16} color={mapView === 'vans' ? Colors.white : Colors.gray[700]} />
            <Text style={[
              styles.viewButtonText,
              mapView === 'vans' && styles.viewButtonTextActive
            ]}>Vans</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.viewButton,
              mapView === 'routes' && styles.viewButtonActive
            ]}
            onPress={() => setMapView('routes')}
          >
            <Route size={16} color={mapView === 'routes' ? Colors.white : Colors.gray[700]} />
            <Text style={[
              styles.viewButtonText,
              mapView === 'routes' && styles.viewButtonTextActive
            ]}>Routes</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapView 
          vans={mapView === 'vans' ? availableVans : []}
          routes={mapView === 'routes' ? routes : []}
          onVanPress={handleVanSelect}
          onRoutePress={handleRouteSelect}
          selectedVanId={selectedVan?.id}
          selectedRouteId={selectedRoute?.id}
        />
        
        {selectedVan && (
          <VanMarkerDetails 
            van={selectedVan} 
            onClose={handleCloseDetails}
            style={isLargeScreen && styles.detailsContainerLarge}
          />
        )}
        
        {selectedRoute && (
          <RouteDetails 
            route={selectedRoute} 
            onClose={handleCloseDetails}
            style={isLargeScreen && styles.detailsContainerLarge}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  actionBar: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  actionBarLarge: {
    paddingHorizontal: 80,
  },
  viewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    padding: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  viewButtonActive: {
    backgroundColor: Colors.primary[500],
  },
  viewButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[700],
  },
  viewButtonTextActive: {
    color: Colors.white,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  detailsContainerLarge: {
    maxWidth: 400,
    right: 80,
  }
});
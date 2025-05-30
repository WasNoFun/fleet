import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { useStore } from '@/store';
import { SeatBookingModal } from '@/components/seats/SeatBookingModal';
import { VanSeatMap } from '@/components/seats/VanSeatMap';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FilterButton } from '@/components/ui/FilterButton';

export default function SeatsScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const { vans, bookings } = useStore();
  const [selectedVan, setSelectedVan] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [vanFilter, setVanFilter] = useState('all');
  
  const availableVans = vans.filter(van => van.status === 'available');
  
  const filteredVans = vanFilter === 'all' 
    ? availableVans 
    : availableVans.filter(van => van.id === vanFilter);

  const handleVanSelect = (van) => {
    setSelectedVan(van);
  };

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeat(seatNumber);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <SectionHeader title="Seat Allocation" />
      
      <View style={[styles.actionBar, isLargeScreen && styles.actionBarLarge]}>
        <View style={styles.searchContainer}>
          <SearchBar 
            placeholder="Search passengers..." 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vanFilters}
        >
          <FilterButton 
            title="All Vans" 
            isActive={vanFilter === 'all'} 
            onPress={() => setVanFilter('all')}
          />
          {availableVans.map(van => (
            <FilterButton 
              key={van.id}
              title={van.name} 
              isActive={vanFilter === van.id} 
              onPress={() => setVanFilter(van.id)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          isLargeScreen && styles.contentContainerLarge
        ]}
      >
        {filteredVans.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No available vans</Text>
            <Text style={styles.emptyStateSubtext}>
              There are currently no available vans for seat allocation
            </Text>
          </View>
        ) : (
          filteredVans.map(van => (
            <View key={van.id} style={styles.vanContainer}>
              <Text style={styles.vanTitle}>{van.name}</Text>
              <Text style={styles.vanRoute}>
                {van.route ? `${van.route.startLocation} → ${van.route.endLocation}` : 'No route assigned'}
              </Text>
              <Text style={styles.seatsAvailable}>
                {van.capacity - van.occupiedSeats} seats available of {van.capacity}
              </Text>
              
              <VanSeatMap 
                van={van}
                onSeatSelect={handleSeatSelect}
              />
            </View>
          ))
        )}
      </ScrollView>

      <SeatBookingModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        van={selectedVan}
        seatNumber={selectedSeat}
      />
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
  searchContainer: {
    marginBottom: 12,
  },
  vanFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 24,
  },
  contentContainerLarge: {
    paddingHorizontal: 80,
  },
  vanContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  vanTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.gray[900],
    marginBottom: 4,
  },
  vanRoute: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 8,
  },
  seatsAvailable: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[500],
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.gray[700],
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[500],
    textAlign: 'center',
  },
});
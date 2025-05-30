import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Plus, MoreHorizontal } from 'lucide-react-native';
import { useStore } from '@/store';
import Colors from '@/constants/Colors';
import { VanCard } from '@/components/vans/VanCard';
import { VanModal } from '@/components/vans/VanModal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterButton } from '@/components/ui/FilterButton';

export default function VansScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const { vans } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVan, setEditingVan] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredVans = vans
    .filter(van => van.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 van.id.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(van => statusFilter === 'all' ? true : van.status === statusFilter);

  const handleAddVan = () => {
    setEditingVan(null);
    setModalVisible(true);
  };

  const handleEditVan = (van) => {
    setEditingVan(van);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <SectionHeader title="Van Management" />
      
      <View style={[styles.actionBar, isLargeScreen && styles.actionBarLarge]}>
        <View style={styles.searchContainer}>
          <SearchBar 
            placeholder="Search vans..." 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.filtersContainer}>
          <FilterButton 
            title="All" 
            isActive={statusFilter === 'all'} 
            onPress={() => setStatusFilter('all')} 
          />
          <FilterButton 
            title="Available" 
            isActive={statusFilter === 'available'} 
            onPress={() => setStatusFilter('available')} 
          />
          <FilterButton 
            title="Unavailable" 
            isActive={statusFilter === 'unavailable'} 
            onPress={() => setStatusFilter('unavailable')} 
          />
          
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAddVan}
          >
            <Plus size={20} color={Colors.white} />
            <Text style={styles.addButtonText}>Add Van</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.listContainer}
        contentContainerStyle={[
          styles.listContentContainer,
          isLargeScreen && styles.gridContainer
        ]}
      >
        {filteredVans.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No vans found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery || statusFilter !== 'all' 
                ? "Try adjusting your filters" 
                : "Add a van to get started"}
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton} 
              onPress={handleAddVan}
            >
              <Plus size={16} color={Colors.white} />
              <Text style={styles.emptyStateButtonText}>Add Van</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredVans.map(van => (
            <VanCard 
              key={van.id}
              van={van} 
              onPress={() => handleEditVan(van)} 
              style={isLargeScreen && styles.gridItem}
            />
          ))
        )}
      </ScrollView>

      <VanModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        van={editingVan}
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
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 'auto',
    gap: 4,
  },
  addButtonText: {
    color: Colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
  },
  listContentContainer: {
    padding: 16,
    gap: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 80,
  },
  gridItem: {
    width: 'calc(33.33% - 16px)',
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
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  emptyStateButtonText: {
    color: Colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});
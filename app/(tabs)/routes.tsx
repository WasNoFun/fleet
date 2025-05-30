import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useStore } from '@/store';
import Colors from '@/constants/Colors';
import { RouteCard } from '@/components/routes/RouteCard';
import { RouteModal } from '@/components/routes/RouteModal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SearchBar } from '@/components/ui/SearchBar';

export default function RoutesScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const { routes } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoutes = routes.filter(route => 
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    route.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) || 
    route.endLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRoute = () => {
    setEditingRoute(null);
    setModalVisible(true);
  };

  const handleEditRoute = (route) => {
    setEditingRoute(route);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <SectionHeader title="Route Management" />
      
      <View style={[styles.actionBar, isLargeScreen && styles.actionBarLarge]}>
        <View style={styles.searchContainer}>
          <SearchBar 
            placeholder="Search routes..." 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAddRoute}
          >
            <Plus size={20} color={Colors.white} />
            <Text style={styles.addButtonText}>Add Route</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.listContainer}
        contentContainerStyle={[
          styles.listContentContainer,
          isLargeScreen && styles.listContentContainerLarge
        ]}
      >
        {filteredRoutes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No routes found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? "Try adjusting your search" : "Add a route to get started"}
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton} 
              onPress={handleAddRoute}
            >
              <Plus size={16} color={Colors.white} />
              <Text style={styles.emptyStateButtonText}>Add Route</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredRoutes.map(route => (
            <RouteCard 
              key={route.id}
              route={route} 
              onPress={() => handleEditRoute(route)} 
            />
          ))
        )}
      </ScrollView>

      <RouteModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        route={editingRoute}
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
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
  listContentContainerLarge: {
    paddingHorizontal: 80,
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
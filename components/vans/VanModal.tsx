import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import Colors from '@/constants/Colors';
import { useStore } from '@/store';
import { Van } from '@/types';
import { X, Save, Trash } from 'lucide-react-native';

interface VanModalProps {
  visible: boolean;
  onClose: () => void;
  van: Van | null;
}

export function VanModal({ visible, onClose, van }: VanModalProps) {
  const { addVan, updateVan, deleteVan, routes } = useStore();
  
  const [name, setName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState<'available' | 'unavailable'>('available');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  
  // Reset form when modal opens or van changes
  useEffect(() => {
    if (van) {
      setName(van.name);
      setLicensePlate(van.licensePlate);
      setCapacity(van.capacity.toString());
      setStatus(van.status);
      setSelectedRouteId(van.route?.id || null);
    } else {
      // Default values for new van
      setName('');
      setLicensePlate('');
      setCapacity('8');
      setStatus('available');
      setSelectedRouteId(null);
    }
  }, [van, visible]);
  
  const handleSave = () => {
    const vanData = {
      name,
      licensePlate,
      capacity: parseInt(capacity) || 0,
      occupiedSeats: van?.occupiedSeats || 0,
      status,
      coordinates: van?.coordinates || { latitude: 37.7749, longitude: -122.4194 },
      route: selectedRouteId ? routes.find(r => r.id === selectedRouteId) || null : null,
    };
    
    if (van) {
      updateVan(van.id, vanData);
    } else {
      addVan(vanData);
    }
    
    onClose();
  };
  
  const handleDelete = () => {
    if (van) {
      deleteVan(van.id);
    }
    onClose();
  };
  
  const isFormValid = name && licensePlate && capacity && parseInt(capacity) > 0;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {van ? 'Edit Van' : 'Add New Van'}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={onClose}
              >
                <X size={20} color={Colors.gray[500]} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Van Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter van name"
                  placeholderTextColor={Colors.gray[400]}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>License Plate</Text>
                <TextInput
                  style={styles.input}
                  value={licensePlate}
                  onChangeText={setLicensePlate}
                  placeholder="e.g. ABC-1234"
                  placeholderTextColor={Colors.gray[400]}
                  autoCapitalize="characters"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Seat Capacity</Text>
                <TextInput
                  style={styles.input}
                  value={capacity}
                  onChangeText={setCapacity}
                  keyboardType="number-pad"
                  placeholder="Enter seat capacity"
                  placeholderTextColor={Colors.gray[400]}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Status</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity 
                    style={[
                      styles.radioOption,
                      status === 'available' && styles.radioOptionSelected
                    ]}
                    onPress={() => setStatus('available')}
                  >
                    <View style={[
                      styles.radioButton,
                      status === 'available' && styles.radioButtonSelected
                    ]}>
                      {status === 'available' && <View style={styles.radioButtonInner} />}
                    </View>
                    <Text style={styles.radioLabel}>Available</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.radioOption,
                      status === 'unavailable' && styles.radioOptionSelected
                    ]}
                    onPress={() => setStatus('unavailable')}
                  >
                    <View style={[
                      styles.radioButton,
                      status === 'unavailable' && styles.radioButtonSelected
                    ]}>
                      {status === 'unavailable' && <View style={styles.radioButtonInner} />}
                    </View>
                    <Text style={styles.radioLabel}>Unavailable</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Assigned Route</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.routeSelector}
                  contentContainerStyle={styles.routeSelectorContent}
                >
                  <TouchableOpacity 
                    style={[
                      styles.routeOption,
                      selectedRouteId === null && styles.routeOptionSelected
                    ]}
                    onPress={() => setSelectedRouteId(null)}
                  >
                    <Text style={[
                      styles.routeOptionText,
                      selectedRouteId === null && styles.routeOptionTextSelected
                    ]}>
                      None
                    </Text>
                  </TouchableOpacity>
                  
                  {routes.map(route => (
                    <TouchableOpacity 
                      key={route.id}
                      style={[
                        styles.routeOption,
                        selectedRouteId === route.id && styles.routeOptionSelected
                      ]}
                      onPress={() => setSelectedRouteId(route.id)}
                    >
                      <Text style={[
                        styles.routeOptionText,
                        selectedRouteId === route.id && styles.routeOptionTextSelected
                      ]}>
                        {route.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>
            
            <View style={styles.buttonContainer}>
              {van && (
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={handleDelete}
                >
                  <Trash size={20} color={Colors.white} />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[
                  styles.saveButton,
                  !isFormValid && styles.saveButtonDisabled
                ]}
                onPress={handleSave}
                disabled={!isFormValid}
              >
                <Save size={20} color={Colors.white} />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    width: Platform.OS === 'web' ? '90%' : '85%',
    maxWidth: 500,
    maxHeight: '90%',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.gray[900],
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 20,
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[700],
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: Colors.gray[900],
    backgroundColor: Colors.white,
    fontFamily: 'Inter-Regular',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOptionSelected: {},
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.primary[500],
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary[500],
  },
  radioLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[700],
  },
  routeSelector: {
    maxHeight: 44,
  },
  routeSelectorContent: {
    paddingVertical: 4,
    gap: 8,
  },
  routeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.white,
  },
  routeOptionSelected: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  routeOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[700],
  },
  routeOptionTextSelected: {
    color: Colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    gap: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.gray[300],
  },
  saveButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error[500],
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
});
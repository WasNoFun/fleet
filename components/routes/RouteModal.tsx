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
import { Route } from '@/types';
import { X, Save, Trash, Clock } from 'lucide-react-native';

interface RouteModalProps {
  visible: boolean;
  onClose: () => void;
  route: Route | null;
}

export function RouteModal({ visible, onClose, route }: RouteModalProps) {
  const { addRoute, updateRoute, deleteRoute } = useStore();
  
  const [name, setName] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  
  // Reset form when modal opens or route changes
  useEffect(() => {
    if (route) {
      setName(route.name);
      setStartLocation(route.startLocation);
      setEndLocation(route.endLocation);
      setEstimatedTime(route.estimatedTime.toString());
    } else {
      // Default values for new route
      setName('');
      setStartLocation('');
      setEndLocation('');
      setEstimatedTime('30');
    }
  }, [route, visible]);
  
  const handleSave = () => {
    // Sample coordinates - in a real app, these would come from a map component
    const routeData = {
      name,
      startLocation,
      endLocation,
      estimatedTime: parseInt(estimatedTime) || 0,
      startCoordinates: route?.startCoordinates || { latitude: 37.7749, longitude: -122.4194 },
      endCoordinates: route?.endCoordinates || { latitude: 37.7749, longitude: -122.4294 },
    };
    
    if (route) {
      updateRoute(route.id, routeData);
    } else {
      addRoute(routeData);
    }
    
    onClose();
  };
  
  const handleDelete = () => {
    if (route) {
      deleteRoute(route.id);
    }
    onClose();
  };
  
  const isFormValid = name && startLocation && endLocation && estimatedTime && parseInt(estimatedTime) > 0;

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
                {route ? 'Edit Route' : 'Add New Route'}
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
                <Text style={styles.label}>Route Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter route name"
                  placeholderTextColor={Colors.gray[400]}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Start Location</Text>
                <TextInput
                  style={styles.input}
                  value={startLocation}
                  onChangeText={setStartLocation}
                  placeholder="Enter starting point"
                  placeholderTextColor={Colors.gray[400]}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>End Location</Text>
                <TextInput
                  style={styles.input}
                  value={endLocation}
                  onChangeText={setEndLocation}
                  placeholder="Enter destination"
                  placeholderTextColor={Colors.gray[400]}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Estimated Travel Time (minutes)</Text>
                <View style={styles.timeInput}>
                  <Clock size={16} color={Colors.gray[500]} style={styles.timeIcon} />
                  <TextInput
                    style={styles.timeTextInput}
                    value={estimatedTime}
                    onChangeText={setEstimatedTime}
                    keyboardType="number-pad"
                    placeholder="30"
                    placeholderTextColor={Colors.gray[400]}
                  />
                  <Text style={styles.timeUnit}>min</Text>
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.buttonContainer}>
              {route && (
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
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
  },
  timeIcon: {
    marginRight: 8,
  },
  timeTextInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.gray[900],
    fontFamily: 'Inter-Regular',
    paddingVertical: Platform.OS === 'ios' ? 0 : 10,
  },
  timeUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[500],
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
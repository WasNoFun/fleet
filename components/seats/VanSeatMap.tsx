import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { Van } from '@/types';
import { useStore } from '@/store';

interface VanSeatMapProps {
  van: Van;
  onSeatSelect: (seatNumber: number) => void;
}

export function VanSeatMap({ van, onSeatSelect }: VanSeatMapProps) {
  const { bookings } = useStore();
  
  // Find bookings for this van
  const vanBookings = bookings.filter(booking => booking.vanId === van.id);
  
  // Generate seats array based on van capacity
  const seats = Array.from({ length: van.capacity }, (_, index) => {
    const seatNumber = index + 1;
    const booking = vanBookings.find(b => b.seatNumber === seatNumber);
    return {
      number: seatNumber,
      isOccupied: !!booking,
      booking
    };
  });
  
  // Calculate rows and columns (for display)
  const seatsPerRow = 4; // 2 seats on each side of aisle
  const rows = Math.ceil(seats.length / seatsPerRow);
  
  // Organize seats into rows
  const seatRows = Array.from({ length: rows }, (_, rowIndex) => {
    const rowSeats = seats.slice(rowIndex * seatsPerRow, (rowIndex + 1) * seatsPerRow);
    // Ensure 4 seats per row with empty seats as needed
    while (rowSeats.length < seatsPerRow) {
      rowSeats.push(null);
    }
    return rowSeats;
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.driverSection}>
        <View style={styles.steeringWheel} />
        <Text style={styles.driverText}>Driver</Text>
      </View>
      
      <View style={styles.seatsContainer}>
        {seatRows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((seat, seatIndex) => {
              // Center aisle (after the 2nd seat)
              const isAisle = seatIndex === 1;
              
              if (!seat) {
                return isAisle ? (
                  <View key={`empty-aisle-${seatIndex}`} style={styles.aisle} />
                ) : (
                  <View key={`empty-${seatIndex}`} style={styles.emptySeat} />
                );
              }
              
              return (
                <React.Fragment key={`seat-${seat.number}`}>
                  <TouchableOpacity
                    style={[
                      styles.seat,
                      seat.isOccupied ? styles.occupiedSeat : styles.availableSeat
                    ]}
                    onPress={() => onSeatSelect(seat.number)}
                    disabled={seat.isOccupied}
                  >
                    <Text style={[
                      styles.seatNumber,
                      seat.isOccupied ? styles.occupiedSeatNumber : styles.availableSeatNumber
                    ]}>
                      {seat.number}
                    </Text>
                  </TouchableOpacity>
                  
                  {isAisle && <View style={styles.aisle} />}
                </React.Fragment>
              );
            })}
          </View>
        ))}
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, styles.availableSeat]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, styles.occupiedSeat]} />
          <Text style={styles.legendText}>Occupied</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    padding: 16,
  },
  driverSection: {
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    paddingBottom: 12,
  },
  steeringWheel: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: Colors.gray[400],
    marginBottom: 4,
  },
  driverText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.gray[500],
  },
  seatsContainer: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  seat: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  availableSeat: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary[300],
  },
  occupiedSeat: {
    backgroundColor: Colors.gray[300],
    borderWidth: 1,
    borderColor: Colors.gray[400],
  },
  emptySeat: {
    width: 36,
    height: 36,
    margin: 4,
    opacity: 0,
  },
  aisle: {
    width: 16,
  },
  seatNumber: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  availableSeatNumber: {
    color: Colors.primary[700],
  },
  occupiedSeatNumber: {
    color: Colors.gray[600],
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendIcon: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[600],
  },
});
import { Tabs } from 'expo-router';
import { Platform, useWindowDimensions } from 'react-native';
import { Bus, Route, MapPin, Map } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary[500],
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingTop: Platform.OS === 'ios' ? 0 : 4,
          backgroundColor: Colors.white,
          borderTopColor: Colors.gray[200],
          paddingHorizontal: isLargeScreen ? 80 : 0,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.white,
          shadowColor: 'transparent',
          borderBottomWidth: 1,
          borderBottomColor: Colors.gray[200],
          height: Platform.OS === 'ios' ? 110 : 80,
        },
        headerTitleStyle: {
          fontFamily: 'Inter-Bold',
          fontSize: 18,
          color: Colors.gray[900],
        },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Bus size={size} color={color} />,
          headerTitle: 'Flee Composer',
        }}
      />
      <Tabs.Screen
        name="vans"
        options={{
          title: 'Vans',
          tabBarIcon: ({ color, size }) => <Bus size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="routes"
        options={{
          title: 'Routes',
          tabBarIcon: ({ color, size }) => <Route size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="seats"
        options={{
          title: 'Seats',
          tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
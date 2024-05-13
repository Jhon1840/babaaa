import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useAuth } from '@clerk/clerk-expo';

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2e4cba',
        tabBarLabelStyle: {
          fontFamily: 'mon-sb',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Datos',
          headerTitle: 'Datos',
          tabBarIcon: ({ size, color }) => <FontAwesome name="eye" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          tabBarLabel: 'GPS',
          headerTitle: 'Ubicacion',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="locate" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="threed"
        options={{
          tabBarLabel: '3d',
          headerTitle: 'Movimientos',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="move-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarLabel: 'Notificaciones',
          headerTitle: 'Notificaciones',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="notifications-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',

          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
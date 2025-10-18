import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useColorScheme } from 'react-native';

// Import your screen components
import DashboardScreen from '../screens/DashboardScreen';
import FoodHistoryScreen from '../screens/FoodHistoryScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Define the tab navigator type
export type BottomTabParamList = {
    Home: undefined;
    Dashboard: undefined;
    History: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

interface BottomTabsProps {
    // Add any props you might need
}

export default function BottomTabs({ }: BottomTabsProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Theme colors
    const colors = {
        light: {
            primary: '#4ECDC4',
            background: '#FFFFFF',
            text: '#1a1a1a',
            inactive: '#666666',
            border: '#E5E5E5',
        },
        dark: {
            primary: '#4ECDC4',
            background: '#1a1a1a',
            text: '#FFFFFF',
            inactive: '#999999',
            border: '#333333',
        },
    };

    const theme = isDark ? colors.dark : colors.light;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.inactive,
                tabBarStyle: {
                    backgroundColor: theme.background,
                    borderTopColor: theme.border,
                    borderTopWidth: 1,
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: 2,
                },
                tabBarIconStyle: {
                    marginTop: 2,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size || 24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="analytics" size={size || 24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="History"
                component={FoodHistoryScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="time" size={size || 24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size || 24} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

// Export the type for use in other components
export type { BottomTabParamList };

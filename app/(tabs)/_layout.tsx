import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].primary,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].icon,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopColor: Colors[colorScheme ?? 'light'].primary,
          borderTopWidth: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name="camera.fill" color={focused ? Colors[colorScheme ?? 'light'].primary : Colors[colorScheme ?? 'light'].icon} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name="clock.fill" color={focused ? Colors[colorScheme ?? 'light'].primary : Colors[colorScheme ?? 'light'].icon} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Coach',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name="chatbubble.fill" color={focused ? Colors[colorScheme ?? 'light'].primary : Colors[colorScheme ?? 'light'].icon} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name="person.fill" color={focused ? Colors[colorScheme ?? 'light'].primary : Colors[colorScheme ?? 'light'].icon} />,
        }}
      />
    </Tabs>
  );
}

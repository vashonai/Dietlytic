import { Stack } from 'expo-router';
import React from 'react';

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="MyHealthScreen" />
      <Stack.Screen name="GoalPlanScreen" />
      <Stack.Screen name="FoodHistoryScreen" />
      <Stack.Screen name="DashboardScreen" />
      <Stack.Screen name="ProfileScreen" />
    </Stack>
  );
}

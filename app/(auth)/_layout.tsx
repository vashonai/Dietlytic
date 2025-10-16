import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="WelcomeScreen" />
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="RegistrationScreen" />
    </Stack>
  );
}

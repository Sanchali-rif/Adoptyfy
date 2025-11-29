import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="pet-details" />
      <Stack.Screen name="adoption-form" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
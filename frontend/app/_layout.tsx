// app/_layout.tsx
import { Stack } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { useTheme } from "../src/hooks/useTheme";


function RootLayoutInner() {
  const { colors } = useTheme();
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.bg,
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  const initialRoute = session ? "(tabs)" : "(auth)";

  return (
    <Stack
      initialRouteName={initialRoute}
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <RootLayoutInner />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

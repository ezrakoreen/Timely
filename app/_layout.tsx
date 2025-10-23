// app/_layout.tsx
import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";

export default function RootLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      {/* (tabs) is the initial route */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* You can add modal or stack routes later:
          <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
      */}
    </Stack>
  );
}

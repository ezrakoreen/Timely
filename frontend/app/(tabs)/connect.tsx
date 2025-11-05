import Button from "@/components/Button";
import Screen from "@/components/Screen";
import { useTheme } from "@/hooks/useTheme";
import { Alert, Text, View } from "react-native";

export default function ConnectScreen() {
  const { colors, spacing, typography } = useTheme();

  return (
    <Screen>
      <Text style={{ fontSize: typography.h1, fontWeight: "700", color: colors.text }}>Connect Calendar</Text>
      <View style={{ height: spacing.md }} />
      <Text style={{ color: colors.subtext, marginBottom: spacing.lg }}>
        Sign in with Google to let Timely read your upcoming events.
      </Text>

      <Button
        title="Sign in with Google"
        onPress={() => Alert.alert("Not wired yet", "We’ll add Google OAuth on Day 4–6.")}
      />
    </Screen>
  );
}

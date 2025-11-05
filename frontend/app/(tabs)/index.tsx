import Card from "@/components/Card";
import Screen from "@/components/Screen";
import { useTheme } from "@/hooks/useTheme";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const { colors, typography, spacing } = useTheme();

  return (
    <Screen>
      <Text
        style={{
          fontSize: typography.title,
          fontWeight: "700",
          color: colors.text,
          marginBottom: spacing.md,
        }}
      >
        Timely
      </Text>

      <Card>
        <Text style={{ fontWeight: "600", color: colors.text }}>
          Next event
        </Text>
        <View style={{ height: 6 }} />
        <Text style={{ color: colors.subtext }}>
          Connect your calendar to see your next event and when to leave.
        </Text>
      </Card>
    </Screen>
  );
}

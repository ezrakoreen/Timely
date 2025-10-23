import Card from "@/components/Card";
import Screen from "@/components/Screen";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { Switch, Text, View } from "react-native";

export default function SettingsScreen() {
  const { colors, spacing, typography } = useTheme();
  const [notif, setNotif] = useState(true);
  const [walkOnly, setWalkOnly] = useState(true);

  return (
    <Screen>
      <Text
        style={{
          fontSize: typography.h1,
          fontWeight: "700",
          color: colors.text,
          marginBottom: spacing.md,
        }}
      >
        Settings
      </Text>

      <Card>
        <Row>
          <Text style={{ color: colors.text, fontWeight: "600" }}>
            Notifications
          </Text>
          <Switch value={notif} onValueChange={setNotif} />
        </Row>
        <Spacer />
        <Text style={{ color: colors.subtext }}>
          Enable “time to leave” push alerts.
        </Text>
      </Card>

      <Card>
        <Row>
          <Text style={{ color: colors.text, fontWeight: "600" }}>
            Walking-only routing
          </Text>
          <Switch value={walkOnly} onValueChange={setWalkOnly} />
        </Row>
        <Spacer />
        <Text style={{ color: colors.subtext }}>
          Use pedestrian ETAs by default on campus.
        </Text>
      </Card>
    </Screen>
  );
}

function Spacer() {
  return <View style={{ height: 8 }} />;
}
function Row({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {children}
    </View>
  );
}

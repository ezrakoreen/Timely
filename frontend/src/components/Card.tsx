import { useTheme } from "@/src/hooks/useTheme";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export default function Card({ children }: PropsWithChildren) {
  const { colors, radii } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: radii.lg,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    marginBottom: 12,
  },
});

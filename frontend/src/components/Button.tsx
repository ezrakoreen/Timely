import { useTheme } from "@/src/hooks/useTheme";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "ghost";
  disabled?: boolean;
};

export default function Button({ title, onPress, variant = "primary", disabled = false }: Props) {
  const { colors, radii, spacing } = useTheme();
  const isGhost = variant === "ghost";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: isGhost ? "transparent" : colors.tint,
          borderRadius: radii.md,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          opacity: pressed ? 0.8 : 1,
          borderWidth: isGhost ? 1 : 0,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.text, { color: isGhost ? colors.text : "#FFFFFF" }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignSelf: "flex-start" },
  text: { fontWeight: "600", fontSize: 16 },
});

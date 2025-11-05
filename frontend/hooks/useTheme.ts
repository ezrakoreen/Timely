import {
  darkColors,
  lightColors,
  radii,
  spacing,
  typography,
} from "@/constants/theme";
import { useColorScheme } from "react-native";

export function useTheme() {
  const scheme = useColorScheme(); // "light" | "dark" | null
  const colors = scheme === "dark" ? darkColors : lightColors;
  return { scheme, colors, spacing, radii, typography };
}

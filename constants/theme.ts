export const spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 } as const;
export const radii = { sm: 8, md: 12, lg: 16, xl: 24 } as const;

export const lightColors = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  text: "#111827",
  subtext: "#6B7280",
  tint: "#2563EB",
  border: "#E5E7EB",
};

export const darkColors = {
  bg: "#0B1220",
  card: "#111827",
  text: "#F9FAFB",
  subtext: "#9CA3AF",
  tint: "#60A5FA",
  border: "#1F2937",
};

export type Colors = typeof lightColors;

export const typography = {
  title: 28,
  h1: 24,
  body: 16,
  small: 13,
};

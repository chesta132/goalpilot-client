import Color from "color";

export const generateAccentColors = (baseColor: string) => {
  if (!baseColor) baseColor = "#66b2ff";
  try {
    const color = Color(baseColor);

    const softColor = color.lighten(0.2).saturate(0.1).hex();
    const strongColor = color.darken(0.2).saturate(0.2).hex();

    return {
      accent: baseColor,
      accentSoft: softColor,
      accentStrong: strongColor,
    };
  } catch (e) {
    console.error("Error generating accent colors:", e);
    return {
      accent: baseColor,
      accentSoft: baseColor,
      accentStrong: baseColor,
    };
  }
};

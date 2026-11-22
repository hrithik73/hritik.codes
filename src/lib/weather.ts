// Shared by /api/weather (server) and the footer meadow (client).

export type Condition =
  | "clear"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "storm"
  | "snow";

export type Weather = {
  condition: Condition;
  summary: string;
  temp: number;
  windy: boolean;
  hot: boolean;
  isDay: boolean;
  place: string;
};

// Feels-like °C and km/h at which the meadow starts reacting.
export const HOT_AT = 32;
export const WINDY_AT = 25;
export const GUSTY_AT = 45;

// WMO weather interpretation codes, as returned by Open-Meteo.
export function fromWmo(code: number): {
  condition: Condition;
  summary: string;
} {
  if (code === 0) return { condition: "clear", summary: "clear" };
  if (code === 1) return { condition: "clear", summary: "mostly clear" };
  if (code === 2) return { condition: "cloudy", summary: "partly cloudy" };
  if (code === 3) return { condition: "cloudy", summary: "overcast" };
  if (code === 45 || code === 48) return { condition: "fog", summary: "foggy" };
  if (code >= 51 && code <= 57)
    return { condition: "drizzle", summary: "drizzle" };
  if (code === 61 || code === 80)
    return { condition: "rain", summary: "light rain" };
  if (code === 65 || code === 82)
    return { condition: "rain", summary: "heavy rain" };
  if ((code >= 61 && code <= 67) || code === 81)
    return { condition: "rain", summary: "rain" };
  if (code >= 71 && code <= 77) return { condition: "snow", summary: "snow" };
  if (code === 85 || code === 86)
    return { condition: "snow", summary: "snow showers" };
  if (code >= 95) return { condition: "storm", summary: "thunderstorm" };
  return { condition: "cloudy", summary: "cloudy" };
}

const conditions: Condition[] = [
  "clear",
  "cloudy",
  "fog",
  "drizzle",
  "rain",
  "storm",
  "snow",
];

/**
 * `?weather=snow`, `?weather=rain,windy`, `?weather=hot` to preview a state
 * without waiting for the sky to cooperate.
 */
export function parseWeatherOverride(value: string | null): Weather | null {
  if (!value) return null;
  const parts = value.toLowerCase().split(",");
  const condition = conditions.find((c) => parts.includes(c)) ?? "clear";
  const hot = parts.includes("hot");
  const windy = parts.includes("windy") || condition === "storm";
  return {
    condition,
    summary: hot ? "hot" : windy && condition === "clear" ? "windy" : condition,
    temp: hot ? 41 : condition === "snow" ? -2 : 18,
    windy,
    hot,
    isDay: !parts.includes("night"),
    place: "preview land",
  };
}

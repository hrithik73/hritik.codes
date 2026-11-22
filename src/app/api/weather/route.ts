import { NextResponse } from "next/server";
import { home } from "~/config/site";
import {
  fromWmo,
  GUSTY_AT,
  HOT_AT,
  type Weather,
  WINDY_AT,
} from "~/lib/weather";

type OpenMeteo = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    is_day: 0 | 1;
  };
};

const url = new URL("https://api.open-meteo.com/v1/forecast");
url.searchParams.set("latitude", String(home.latitude));
url.searchParams.set("longitude", String(home.longitude));
url.searchParams.set("timezone", "auto");
url.searchParams.set(
  "current",
  "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m,is_day",
);

export async function GET() {
  try {
    const res = await fetch(url, {
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`open-meteo ${res.status}`);
    const { current } = (await res.json()) as OpenMeteo;

    const { condition, summary } = fromWmo(current.weather_code);
    const windy =
      current.wind_speed_10m >= WINDY_AT || current.wind_gusts_10m >= GUSTY_AT;

    const weather: Weather = {
      condition,
      summary: windy && condition === "clear" ? "windy" : summary,
      temp: Math.round(current.temperature_2m),
      windy,
      hot: current.apparent_temperature >= HOT_AT,
      isDay: current.is_day === 1,
      place: home.city,
    };

    // Same sky for every visitor, so let the CDN hold it.
    return NextResponse.json(weather, {
      headers: {
        "Cache-Control":
          "public, max-age=300, s-maxage=900, stale-while-revalidate=3600",
      },
    });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}

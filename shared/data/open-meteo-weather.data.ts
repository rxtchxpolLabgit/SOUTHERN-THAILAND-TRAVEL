import type { WeatherReport } from './weather.data';

export interface WeatherLocation {
  id: string;
  name: string;
  province: string;
  latitude: number;
  longitude: number;
}

type JsonRecord = Record<string, unknown>;

const conditions: Readonly<Record<number, string>> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
  56: 'Freezing drizzle', 57: 'Freezing drizzle', 61: 'Slight rain', 63: 'Rain', 65: 'Heavy rain',
  66: 'Freezing rain', 67: 'Freezing rain', 71: 'Slight snow', 73: 'Snow', 75: 'Heavy snow',
  77: 'Snow grains', 80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy rain showers',
  85: 'Snow showers', 86: 'Heavy snow showers', 95: 'Thunderstorm',
  96: 'Thunderstorm with hail', 99: 'Thunderstorm with hail',
};

function record(value: unknown): JsonRecord | null {
  return typeof value === 'object' && value !== null ? value as JsonRecord : null;
}

function number(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function numberAt(value: unknown, index: number): number | null {
  return Array.isArray(value) ? number(value[index]) : null;
}

function nearestTimeIndex(times: unknown, referenceTime: unknown): number {
  if (!Array.isArray(times) || times.length === 0 || typeof referenceTime !== 'string') return -1;
  const reference = Date.parse(referenceTime);
  if (!Number.isFinite(reference)) return 0;
  return times.reduce((nearest, time, index) => {
    if (typeof time !== 'string') return nearest;
    const distance = Math.abs(Date.parse(time) - reference);
    return Number.isFinite(distance) && distance < nearest.distance ? { index, distance } : nearest;
  }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
}

function condition(code: number): string {
  return conditions[code] ?? 'Unknown conditions';
}

function boatTravelWarning(rainProbability: number | null, windSpeed: number, waveHeight: number | null): boolean | null {
  if (rainProbability === null || waveHeight === null) return null;
  return rainProbability >= 60 || windSpeed >= 30 || waveHeight >= 1.5;
}

function activityAdvice(rainProbability: number | null, windSpeed: number, waveHeight: number | null, warning: boolean | null): string {
  if (warning === true) return 'Consider indoor activities and check local marine advisories before any boat trip.';
  if (rainProbability === null) return 'Check the latest local forecast before choosing outdoor activities.';
  if (rainProbability >= 35) return 'Keep a flexible plan and consider indoor activities if rain develops.';
  if (waveHeight !== null && waveHeight < 1 && windSpeed < 20) {
    return 'Conditions look favorable for outdoor activities; follow local operator guidance.';
  }
  return 'Outdoor activities may be suitable; check local conditions before setting out.';
}

export function resolveWeatherLocation(
  destinationId: string,
  places: readonly WeatherLocation[],
): WeatherLocation | null {
  const destination = places.find((place) => place.id === destinationId);
  if (destination) return destination;

  if (!destinationId.startsWith('province-')) return null;
  const provinceSlug = destinationId.slice('province-'.length);
  const provincePlace = places.find((place) => place.province.toLowerCase().replaceAll(' ', '-') === provinceSlug);
  return provincePlace ? { ...provincePlace, id: destinationId, name: provincePlace.province } : null;
}

export function mapOpenMeteoWeather(
  location: WeatherLocation,
  forecastPayload: unknown,
  marinePayload: unknown,
): WeatherReport {
  const forecast = record(forecastPayload);
  const current = record(forecast?.['current']);
  const hourly = record(forecast?.['hourly']);
  const daily = record(forecast?.['daily']);
  const times = daily?.['time'];
  const codes = daily?.['weather_code'];
  if (!current || !Array.isArray(times) || !Array.isArray(codes) || times.length !== codes.length) {
    throw new Error('Open-Meteo returned an incomplete forecast response');
  }

  const temperature = number(current['temperature_2m']);
  const humidity = number(current['relative_humidity_2m']);
  const windSpeed = number(current['wind_speed_10m']);
  const weatherCode = number(current['weather_code']);
  if (temperature === null || humidity === null || windSpeed === null || weatherCode === null) {
    throw new Error('Open-Meteo returned invalid current weather values');
  }

  const rainIndex = nearestTimeIndex(hourly?.['time'], current['time']);
  const rainProbability = rainIndex < 0 ? null : numberAt(hourly?.['precipitation_probability'], rainIndex);
  const forecastDays = times.map((date, index) => {
    const code = number(codes[index]);
    if (typeof date !== 'string' || code === null) throw new Error('Open-Meteo returned an invalid daily forecast');
    return {
      date,
      condition: condition(code),
      weatherCode: code,
      temperatureMax: numberAt(daily?.['temperature_2m_max'], index),
      temperatureMin: numberAt(daily?.['temperature_2m_min'], index),
      rainProbability: numberAt(daily?.['precipitation_probability_max'], index),
    };
  });

  const marine = record(marinePayload);
  const marineCurrent = record(marine?.['current']);
  const waveHeight = number(marineCurrent?.['wave_height']);
  const wavePeriod = number(marineCurrent?.['wave_period']);
  const warning = boatTravelWarning(rainProbability, windSpeed, waveHeight);

  return {
    destination: location.name,
    destinationId: location.id,
    province: location.province,
    current: {
      temperature,
      humidity,
      windSpeed,
      windGusts: number(current['wind_gusts_10m']),
      rainProbability,
      condition: condition(weatherCode),
      weatherCode,
      isDay: current['is_day'] === 1,
    },
    forecast: forecastDays,
    seaConditions: {
      waveHeight,
      wavePeriod,
      boatTravelWarning: warning,
      marineDataAvailable: waveHeight !== null,
    },
    activityAdvice: activityAdvice(rainProbability, windSpeed, waveHeight, warning),
    updatedAt: new Date().toISOString(),
    source: {
      name: 'Open-Meteo',
      url: 'https://open-meteo.com/',
      marineUrl: 'https://open-meteo.com/en/docs/marine-weather-api',
    },
  };
}

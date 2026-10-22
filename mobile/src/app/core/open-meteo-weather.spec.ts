import { mapOpenMeteoWeather } from '../../../../shared/data/open-meteo-weather.data';

const location = {
  id: 'songkhla-old-town',
  name: 'Songkhla Old Town',
  province: 'Songkhla',
  latitude: 7.2,
  longitude: 100.59,
};

const forecast = {
  current: {
    time: '2026-10-22T19:00',
    temperature_2m: 28.6,
    relative_humidity_2m: 78,
    is_day: 1,
    weather_code: 2,
    wind_speed_10m: 14.3,
    wind_gusts_10m: 24.1,
  },
  hourly: {
    time: ['2026-10-22T19:00', '2026-10-22T20:00'],
    precipitation_probability: [15, 25],
  },
  daily: {
    time: ['2026-10-22', '2026-10-23'],
    weather_code: [2, 61],
    temperature_2m_max: [31, 30],
    temperature_2m_min: [26, 25],
    precipitation_probability_max: [20, 80],
  },
};

describe('Open-Meteo weather mapping', () => {
  it('maps live forecast and marine values into the shared report shape', () => {
    const report = mapOpenMeteoWeather(location, forecast, {
      current: { wave_height: 0.7, wave_period: 5.2 },
    });

    expect(report.destination).toBe('Songkhla Old Town');
    expect(report.current).toMatchObject({ temperature: 28.6, humidity: 78, rainProbability: 15, condition: 'Partly cloudy' });
    expect(report.forecast).toHaveLength(2);
    expect(report.forecast[1]).toMatchObject({ condition: 'Slight rain', temperatureMax: 30, rainProbability: 80 });
    expect(report.seaConditions).toMatchObject({ waveHeight: 0.7, wavePeriod: 5.2, marineDataAvailable: true });
  });

  it('keeps the weather report available when marine data is missing', () => {
    const report = mapOpenMeteoWeather(location, forecast, null);

    expect(report.current.temperature).toBe(28.6);
    expect(report.seaConditions).toMatchObject({ waveHeight: null, marineDataAvailable: false });
  });
});

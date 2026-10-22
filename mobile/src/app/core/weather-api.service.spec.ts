import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { WeatherApiService } from './weather-api.service';

describe('WeatherApiService', () => {
  let service: WeatherApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(WeatherApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('falls back to Open-Meteo when the configured backend is unavailable', async () => {
    const result = firstValueFrom(service.getWeather('phi-phi'));
    http.expectOne((request) => request.url === `${environment.apiUrl}/api/weather`)
      .flush({}, { status: 503, statusText: 'Service Unavailable' });

    const forecastRequest = http.expectOne((request) => request.url === 'https://api.open-meteo.com/v1/forecast');
    expect(forecastRequest.request.params.get('latitude')).toBe('7.7403');
    const marineRequest = http.expectOne((request) => request.url === 'https://marine-api.open-meteo.com/v1/marine');
    forecastRequest.flush({
      current: {
        time: '2026-10-22T19:00', temperature_2m: 28, relative_humidity_2m: 76, is_day: 1,
        weather_code: 1, wind_speed_10m: 12, wind_gusts_10m: 18,
      },
      hourly: { time: ['2026-10-22T19:00'], precipitation_probability: [10] },
      daily: {
        time: ['2026-10-22'], weather_code: [1], temperature_2m_max: [30],
        temperature_2m_min: [26], precipitation_probability_max: [10],
      },
    });
    marineRequest.flush({ current: { wave_height: 0.4, wave_period: 4.5 } });

    await expect(result).resolves.toMatchObject({
      destinationId: 'phi-phi', current: { temperature: 28 },
      seaConditions: { waveHeight: 0.4, marineDataAvailable: true },
    });
  });
});

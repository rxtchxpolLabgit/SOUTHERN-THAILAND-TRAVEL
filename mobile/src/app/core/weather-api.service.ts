import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, throwError } from 'rxjs';
import { mapOpenMeteoWeather, resolveWeatherLocation } from '../../../../shared/data/open-meteo-weather.data';
import { destinations } from '../../../../shared/data/places.data';
import { isWeatherReport, WeatherReport } from '../../../../shared/data/weather.data';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WeatherApiService {
  private readonly http = inject(HttpClient);

  getWeather(destinationId: string): Observable<WeatherReport> {
    if (!environment.apiUrl) return this.getOpenMeteoWeather(destinationId);

    return this.http.get<unknown>(`${environment.apiUrl}/api/weather`, { params: { destination: destinationId } }).pipe(
      map((value) => {
        if (!isWeatherReport(value)) {
          throw new Error('Weather API returned an invalid response');
        }
        return value;
      }),
      catchError(() => this.getOpenMeteoWeather(destinationId)),
    );
  }

  private getOpenMeteoWeather(destinationId: string): Observable<WeatherReport> {
    const location = resolveWeatherLocation(destinationId, destinations);
    if (!location) return throwError(() => new Error(`Unknown weather destination: ${destinationId}`));

    const coordinates = { latitude: location.latitude, longitude: location.longitude };
    return forkJoin({
      forecast: this.http.get<unknown>('https://api.open-meteo.com/v1/forecast', {
        params: {
          ...coordinates,
          current: 'temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m,wind_gusts_10m',
          hourly: 'precipitation_probability',
          daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
          forecast_days: 5,
          timezone: 'auto',
          wind_speed_unit: 'kmh',
        },
      }),
      marine: this.http.get<unknown>('https://marine-api.open-meteo.com/v1/marine', {
        params: { ...coordinates, current: 'wave_height,wave_period,wave_direction', timezone: 'auto' },
      }).pipe(catchError(() => of(null))),
    }).pipe(map(({ forecast, marine }) => mapOpenMeteoWeather(location, forecast, marine)));
  }
}

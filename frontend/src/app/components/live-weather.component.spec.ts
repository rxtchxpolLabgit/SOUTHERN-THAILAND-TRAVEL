import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveWeatherComponent } from './live-weather.component';
import { WeatherReport } from '../../../../shared/data/weather.data';
import { environment } from '../../environments/environment';

const weatherReport: WeatherReport = {
  destination: 'Phi Phi Islands',
  destinationId: 'phi-phi',
  province: 'Krabi',
  current: {
    temperature: 27,
    humidity: 80,
    windSpeed: 10,
    windGusts: 15,
    rainProbability: 65,
    condition: 'Overcast',
    weatherCode: 3,
    isDay: true,
  },
  forecast: [],
  seaConditions: {
    waveHeight: 1.6,
    wavePeriod: 5,
    boatTravelWarning: true,
    marineDataAvailable: true,
  },
  activityAdvice: 'Check local conditions.',
  updatedAt: '2026-10-08T13:00:00.000Z',
  source: {
    name: 'Open-Meteo',
    url: 'https://open-meteo.com/',
    marineUrl: 'https://open-meteo.com/en/docs/marine-weather-api',
  },
};

describe('LiveWeatherComponent', () => {
  let fixture: ComponentFixture<LiveWeatherComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveWeatherComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LiveWeatherComponent);
    fixture.componentRef.setInput('destinationId', 'phi-phi');
  });

  afterEach(() => http.verify());

  it('shows the provider conditions, warning, and forecast information', () => {
    fixture.detectChanges();
    http.expectOne(`${environment.apiUrl}/api/weather?destination=phi-phi`).flush(weatherReport);
    fixture.detectChanges();

    const content = fixture.nativeElement as HTMLElement;
    expect(content.textContent).toContain('27°C');
    expect(content.textContent).toContain('Humidity');
    expect(content.textContent).toContain('⚠️ Sea conditions may affect boat travel');
    expect(content.querySelector('a[href="https://open-meteo.com/"]')).toBeTruthy();
  });

  it('falls back to Open-Meteo when the backend is unavailable and retries', () => {
    fixture.detectChanges();
    http.expectOne(`${environment.apiUrl}/api/weather?destination=phi-phi`)
      .flush({}, { status: 502, statusText: 'Bad Gateway' });
    http.expectOne((request) => request.url === 'https://marine-api.open-meteo.com/v1/marine').flush({});
    http.expectOne((request) => request.url === 'https://api.open-meteo.com/v1/forecast')
      .flush({}, { status: 502, statusText: 'Bad Gateway' });
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Weather information unavailable');

    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
    fixture.detectChanges();
    http.expectOne(`${environment.apiUrl}/api/weather?destination=phi-phi`).flush(weatherReport);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('27°C');
  });

  it('rejects a successful response that does not match the weather contract', () => {
    fixture.detectChanges();
    http.expectOne(`${environment.apiUrl}/api/weather?destination=phi-phi`).flush({
      destination: 'Phi Phi Islands',
      temperature: 29,
    });
    http.expectOne((request) => request.url === 'https://marine-api.open-meteo.com/v1/marine').flush({});
    http.expectOne((request) => request.url === 'https://api.open-meteo.com/v1/forecast')
      .flush({}, { status: 502, statusText: 'Bad Gateway' });
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Weather information unavailable');
  });
});

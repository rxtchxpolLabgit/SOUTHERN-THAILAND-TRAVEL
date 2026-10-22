import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, switchMap, tap } from 'rxjs';
import { WeatherReport } from '../../../../shared/data/weather.data';
import { destinations } from '../../../../shared/data/places.data';
import { WeatherApiService } from '../core/weather-api.service';
import { placeName, provinceName as localizedProvinceName } from '../../../../shared/data/localization.data';

@Component({
  selector: 'app-live-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: '../../../../shared/components/live-weather.component.html',
  styleUrl: '../../../../shared/components/live-weather.component.scss',
})
export class LiveWeatherComponent implements OnChanges {
  @Input({ required: true }) destinationId = '';
  @Input() compact = false;
  @Input() provinceOptions: readonly string[] = [];
  @Input() language: 'en' | 'th' = 'en';

  protected text(english: string, thai: string): string {
    return this.language === 'th' ? thai : english;
  }

  protected provinceName(province: string): string {
    return localizedProvinceName(province, this.language);
  }

  protected destinationName(name: string): string {
    return placeName(name, this.language);
  }

  protected conditionName(condition: string): string {
    if (this.language !== 'th') return condition;
    const translations: Record<string, string> = {
      'Clear sky': 'ท้องฟ้าแจ่มใส', 'Mainly clear': 'ท้องฟ้าโปร่งเป็นส่วนใหญ่', 'Partly cloudy': 'มีเมฆบางส่วน',
      'Overcast': 'มีเมฆมาก', 'Fog': 'มีหมอก', 'Depositing rime fog': 'มีหมอกและน้ำค้างแข็ง',
      'Drizzle': 'ฝนละออง', 'Freezing drizzle': 'ฝนละอองเยือกแข็ง', 'Rain': 'ฝนตก', 'Freezing rain': 'ฝนเยือกแข็ง',
      'Snow fall': 'หิมะตก', 'Snow grains': 'เกล็ดหิมะ', 'Rain showers': 'ฝนตกเป็นช่วง', 'Snow showers': 'หิมะตกเป็นช่วง',
      'Thunderstorm': 'พายุฝนฟ้าคะนอง', 'Thunderstorm with hail': 'พายุฝนฟ้าคะนองและลูกเห็บ',
    };
    return translations[condition] ?? condition;
  }

  protected readonly report = signal<WeatherReport | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly selectedProvince = signal('');
  private readonly activeDestinationId = signal('');

  private readonly weatherApi = inject(WeatherApiService);
  private readonly requests = new Subject<string>();

  constructor() {
    this.requests.pipe(
      switchMap((id) => {
        this.loading.set(true);
        this.error.set(false);
        return this.weatherApi.getWeather(id).pipe(
          tap((report) => {
            this.report.set(report);
            this.loading.set(false);
          }),
          catchError((error: unknown) => {
            console.error(`Unable to load weather for ${id}:`, error);
            this.report.set(null);
            this.error.set(true);
            this.loading.set(false);
            return EMPTY;
          }),
        );
      }),
      takeUntilDestroyed(),
    ).subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['destinationId'] && this.destinationId) {
      const province = destinations.find((place) => place.id === this.destinationId)?.province;
      const fallbackProvince = this.destinationId.slice('province-'.length).replaceAll('-', ' ');
      const matchedProvince = this.provinceOptions.find(
        (option) => option.toLowerCase() === (province ?? fallbackProvince).toLowerCase(),
      );
      this.selectedProvince.set(matchedProvince ?? province ?? fallbackProvince);
      this.activeDestinationId.set(this.destinationId);
      this.requests.next(this.destinationId);
    }
  }

  protected selectProvince(event: Event): void {
    const province = (event.target as HTMLSelectElement).value;
    const destinationId = `province-${province.toLowerCase().replaceAll(' ', '-')}`;
    this.selectedProvince.set(province);
    this.activeDestinationId.set(destinationId);
    this.requests.next(destinationId);
  }

  protected retry(): void {
    if (this.activeDestinationId()) {
      this.requests.next(this.activeDestinationId());
    }
  }
}

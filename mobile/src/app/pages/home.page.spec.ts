import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { WeatherApiService } from '../core/weather-api.service';
import { RecommendationsApiService } from '../core/recommendations-api.service';
import { FavoritesService } from '../core/favorites.service';
import { HomePage } from './home.page';

describe('HomePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        { provide: FavoritesService, useValue: { favorites: signal([]), isFavorite: () => false, toggleFavorite: () => undefined } },
        { provide: WeatherApiService, useValue: { getWeather: () => of(null) } },
        { provide: RecommendationsApiService, useValue: { getRecommendations: () => of([]) } },
      ],
    }).compileComponents();
  });

  it('scrolls to the province list when Explore Now is tapped', async () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    await fixture.whenStable();

    const provinces = fixture.nativeElement.querySelector('#provinces') as HTMLElement;
    const scrollIntoView = vi.fn();
    Object.defineProperty(provinces, 'scrollIntoView', { value: scrollIntoView });

    (fixture.nativeElement.querySelector('.primary-btn') as HTMLButtonElement).click();

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    fixture.destroy();
  });
});

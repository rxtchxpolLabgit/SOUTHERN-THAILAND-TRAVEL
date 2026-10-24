import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { WeatherApiService } from './core/weather-api.service';
import { RecommendationsApiService } from './core/recommendations-api.service';
import { BoatRoutesApiService } from './core/boat-routes-api.service';
import { of } from 'rxjs';
import { destinations, provinceProfiles } from '../../../shared/data/places.data';
import { signal } from '@angular/core';
import { AuthService } from './core/auth.service';
import { andamanVideos } from '../../../shared/data/videos.data';
import { southernProvinces } from '../../../shared/data/provinces.data';

describe('App', () => {
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: class {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
      },
    });
  });

  beforeEach(async () => {
    localStorage.removeItem('andaman-smart-travel:favorites:v1');
    localStorage.removeItem('andaman-smart-travel:trip-plan:v1');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { session: signal(null), login: () => of(null), register: () => of(null), logout: () => undefined, restoreSession: () => undefined } },
        { provide: WeatherApiService, useValue: { getWeather: () => of(null) } },
        {
          provide: RecommendationsApiService,
          useValue: {
            getRecommendations: () =>
              of(
                destinations.map((place) => ({
                  id: place.id,
                  matchScore: place.match,
                  matchedInterests: [],
                  reason: 'A highly rated place',
                  image: 'https://example.com/invalid-image-overwrite.jpg',
                })),
              ),
          },
        },
        { provide: BoatRoutesApiService, useValue: { getRoutes: () => of([]) } },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#hero-title')?.textContent).toContain('Explore');
    expect(compiled.querySelector('#recommendations-title')?.textContent).toContain('Recommended');
    expect(compiled.querySelectorAll('.destination-card').length).toBe(destinations.length);
    expect(compiled.querySelectorAll('.province-card').length).toBe(provinceProfiles.length);
    for (const province of provinceProfiles) {
      expect(compiled.querySelector('#provinces')?.textContent).toContain(province.province);
      expect(compiled.querySelector('#provinces')?.textContent).toContain(
        String(destinations.filter((place) => place.province === province.province).length),
      );
    }
    expect(compiled.querySelectorAll('.experience-card').length).toBe(andamanVideos.length);
    expect(compiled.querySelectorAll('.video-source').length).toBe(andamanVideos.length);
    expect(compiled.querySelector('.video-dialog iframe')).toBeNull();
  });

  it('provides a toggleable navigation menu for narrow screens', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector<HTMLButtonElement>('.mobile-menu-toggle');
    const navigation = compiled.querySelector<HTMLElement>('#main-navigation');

    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    expect(navigation?.querySelectorAll('a').length).toBe(6);
    toggle?.click();
    fixture.detectChanges();
    expect(toggle?.getAttribute('aria-expanded')).toBe('true');
    expect(navigation?.classList.contains('is-open')).toBe(true);

    navigation?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle);

    toggle?.click();
    fixture.detectChanges();
    navigation?.querySelector<HTMLAnchorElement>('a[href="#favorites"]')?.click();
    fixture.detectChanges();
    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    expect(navigation?.classList.contains('is-open')).toBe(false);
  });

  it('scrolls to the selected section when a navigation link is tapped', async () => {
    history.replaceState(null, '', '/');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const mapSection = compiled.querySelector<HTMLElement>('#map')!;
    const scrollIntoView = vi.fn();
    Object.defineProperty(mapSection, 'scrollIntoView', { configurable: true, value: scrollIntoView });
    compiled.querySelector<HTMLAnchorElement>('#main-navigation a[href="#map"]')?.click();

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(window.location.hash).toBe('#map');
    fixture.destroy();
  });

  it('switches the travel discovery interface between English and Thai', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const languageToggle = compiled.querySelector<HTMLButtonElement>('.language-toggle');

    expect(languageToggle?.textContent?.trim()).toBe('TH');
    languageToggle?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('#recommendations-title')?.textContent).toContain('แนะนำ');
    expect(compiled.querySelector('.province-filter')?.textContent).toContain('ทุกจังหวัด');
    expect(compiled.querySelector('#main-navigation')?.textContent).toContain('ทุกจังหวัด');
    expect(compiled.querySelector('#main-navigation')?.textContent).toContain('กิจกรรมท้องถิ่น');
    expect(compiled.querySelector('#weather-title')?.textContent).toContain('สภาพอากาศ');
    expect(compiled.querySelector('#favorites-title')?.textContent).toContain('สถานที่');
    expect(compiled.querySelector('.trip-planner')?.textContent).toContain('วางแผน');

    languageToggle?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('#main-navigation')?.textContent).toContain('All cities');
    expect(compiled.querySelector('#weather-title')?.textContent).toContain('Weather');
  });

  it('starts with one travel interest selected so users can distinguish active chips', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const selectedChips = (fixture.nativeElement as HTMLElement).querySelectorAll('.interest-chip.is-selected');
    expect(selectedChips).toHaveLength(1);
    expect(selectedChips[0]?.textContent?.trim()).toBe('Beach');
  });

  it('anchors the Plan My Trip action to the editable itinerary controls', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const planner = compiled.querySelector<HTMLElement>('#trip-planner');

    expect(planner?.querySelector('#trip-plan-heading')).not.toBeNull();
    expect(planner?.querySelector('.trip-controls select')).not.toBeNull();
  });

  it('saves and removes destinations in the saved places collection', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('#favorites-title')?.textContent).toContain('Saved');
    expect(compiled.querySelector('.favorites-empty')).not.toBeNull();

    const saveButton = compiled.querySelector<HTMLButtonElement>('.save-button');
    expect(saveButton).not.toBeNull();
    saveButton?.click();
    fixture.detectChanges();

    expect(localStorage.getItem('andaman-smart-travel:favorites:v1')).toContain('phi-phi');
    expect(compiled.querySelector('#favorites .destination-card h3')?.textContent).toContain('Phi Phi');

    compiled.querySelector<HTMLButtonElement>('#favorites .save-button')?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('#favorites .favorites-empty')).not.toBeNull();
  });

  it('builds a day-by-day itinerary from the trip planner controls', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const destinationSelect = compiled.querySelector<HTMLSelectElement>('.trip-add select');

    expect(destinationSelect).not.toBeNull();
    if (!destinationSelect) {
      return;
    }
    destinationSelect.value = 'phi-phi';
    destinationSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(compiled.querySelector('.trip-stop__place strong')?.textContent).toContain('Phi Phi');
    const visitDay = compiled.querySelector<HTMLSelectElement>('.trip-stop__day select');
    expect(visitDay).not.toBeNull();
    if (!visitDay) {
      return;
    }
    visitDay.value = '3';
    visitDay.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const durationSelect = compiled.querySelector<HTMLSelectElement>('.trip-controls select');
    expect(durationSelect).not.toBeNull();
    if (!durationSelect) {
      return;
    }
    durationSelect.value = '2';
    durationSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(JSON.parse(localStorage.getItem('andaman-smart-travel:trip-plan:v1') ?? '{}')).toEqual({
      startDate: '',
      durationDays: 2,
      stops: [{ destinationId: 'phi-phi', day: 2 }],
    });
  });

  it('provides attribution and a local province fallback for every destination image', () => {
    for (const place of destinations) {
      expect(['Wikimedia Commons', 'Thailand Tourism Directory', 'Travel publication']).toContain(place.image.source);
      expect(place.image.sourceUrl).toMatch(/^https:\/\//);
      expect(place.image.photographer.length).toBeGreaterThan(0);
      expect(place.image.license.length).toBeGreaterThan(0);
      expect(place.image.licenseUrl).toMatch(/^https?:\/\//);
      expect(place.image.fallbackUrl).toContain(`/image-fallbacks/${place.province.toLowerCase().replaceAll(' ', '-')}.svg`);
      expect(place.gallery.length === 0 || place.gallery.length > 1).toBe(true);
      for (const image of place.gallery) {
        expect(image.sourceUrl).toContain('commons.wikimedia.org/wiki/File:');
        expect(image.photographer.length).toBeGreaterThan(0);
        expect(image.licenseUrl).toContain('creativecommons.org/licenses/');
      }
    }
  });

  it('lists selectable destination entries with coordinates for all fourteen provinces', () => {
    for (const profile of provinceProfiles) {
      const places = destinations.filter((place) => place.province === profile.province);
      expect(places.length).toBeGreaterThanOrEqual(4);
      expect(Number.isFinite(profile.latitude)).toBe(true);
      expect(Number.isFinite(profile.longitude)).toBe(true);
      for (const place of places) {
        expect(Number.isFinite(place.latitude)).toBe(true);
        expect(Number.isFinite(place.longitude)).toBe(true);
      }
    }
  });

  it('provides an available YouTube video and source for each Andaman province', () => {
    expect(andamanVideos.map((video) => video.province).sort()).toEqual([...southernProvinces].sort());
    for (const video of andamanVideos) {
      expect(video.youtubeId).toMatch(/^[A-Za-z0-9_-]{11}$/);
      expect(video.sourceUrl).toBe(`https://www.youtube.com/watch?v=${video.youtubeId}`);
      expect(video.thumbnail).toContain(`/vi/${video.youtubeId}/`);
      expect(video.channel.length).toBeGreaterThan(0);
      expect(video.fallbackUrl).toContain('/assets/image-fallbacks/');
    }
  });
});

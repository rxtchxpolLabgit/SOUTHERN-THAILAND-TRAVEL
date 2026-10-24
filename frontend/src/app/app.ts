import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { catchError, filter, map, of, Subject, switchMap } from 'rxjs';
import {
  andamanHeroImage,
  applyImageFallback,
  responsiveImageSrcset,
  tripPlannerImage,
  type AndamanProvince,
} from '../../../shared/data/images.data';
import { boatRoutes as localBoatRoutes, destinations, provinceProfiles, seasons } from '../../../shared/data/places.data';
import { southernProvinces } from '../../../shared/data/provinces.data';
import { andamanVideos, AndamanVideo, youtubeEmbedUrl } from '../../../shared/data/videos.data';
import { getLocalRecommendations, type RecommendationMatch } from '../../../shared/data/recommendations.data';
import { InteractiveMapPage } from './pages/interactive-map.page';
import { LiveWeatherComponent } from './components/live-weather.component';
import { RecommendationsApiService } from './core/recommendations-api.service';
import { FavoritesService } from './core/favorites.service';
import { TripPlanService } from './core/trip-plan.service';
import { localDateString, MAX_TRIP_DAYS } from '../../../shared/data/trip-plan.data';
import { BoatRoutesApiService } from './core/boat-routes-api.service';
import { AuthService } from './core/auth.service';
import type { BoatRoute } from '../../../shared/data/boat-routes.data';
import { LanguageService } from './core/language.service';
import { placeName as localizedPlaceName, placeDescription as localizedPlaceDescription, provinceName as localizedProvinceName, provinceDescription as localizedProvinceDescription, placeCategory as localizedPlaceCategory } from '../../../shared/data/localization.data';

type RecommendedPlace = (typeof destinations)[number] & RecommendationMatch;
type RecommendationResult = { matches: RecommendationMatch[]; offline: boolean };
type BoatRoutesResult = { routes: BoatRoute[] } | { error: true };

const fallbackBoatRoutes: BoatRoute[] = localBoatRoutes.map((route, index) => ({
  id: `local-${index + 1}`,
  destinationId: destinations.find((place) => place.name === route.destination)?.id ?? route.destination.toLowerCase().replaceAll(' ', '-'),
  departure: route.departure,
  destination: route.destination,
  departureTime: route.departureTime,
  estimatedDuration: route.duration,
  transportType: route.type,
  price: route.price,
  operator: route.operator,
}));

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [InteractiveMapPage, LiveWeatherComponent, RouterLink, RouterOutlet],
})
export class App {
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly recommendationsApi = inject(RecommendationsApiService);
  protected readonly favoritesService = inject(FavoritesService);
  protected readonly tripPlanService = inject(TripPlanService);
  private readonly boatRoutesApi = inject(BoatRoutesApiService);
  protected readonly authService = inject(AuthService);
  private readonly languageService = inject(LanguageService);
  private readonly boatRouteRequests = new Subject<void>();
  private readonly recommendationRequests = new Subject<readonly string[]>();
  protected readonly isHome = signal(!this.router.url.startsWith('/places/') && !this.router.url.startsWith('/events') && !this.router.url.startsWith('/admin/'));
  protected readonly provinces = southernProvinces;
  protected readonly language = this.languageService.language;
  protected readonly selectedProvince = signal('All');
  protected readonly searchQuery = signal('');
  protected readonly savedPlaces = this.favoritesService.favorites;
  protected readonly recommendationInterestOptions = seasons;
  protected readonly selectedRecommendationInterests = signal<string[]>(['Beach']);
  protected readonly recommendationMatches = signal<RecommendationMatch[]>([]);
  protected readonly recommendationsLoading = signal(false);
  protected readonly recommendationsError = signal(false);
  protected readonly recommendationsOffline = signal(false);
  protected readonly boatRoutes = signal<BoatRoute[]>([]);
  protected readonly boatRoutesLoading = signal(false);
  protected readonly boatRoutesError = signal(false);
  protected readonly boatRouteSearch = signal('');
  protected readonly tripDays = Array.from({ length: MAX_TRIP_DAYS }, (_, index) => index + 1);
  protected readonly loginMessage = signal('');
  protected readonly authMode = signal<'login' | 'register'>('login');
  protected readonly authBusy = signal(false);
  protected readonly authError = signal('');
  protected readonly mobileMenuOpen = signal(false);
  protected readonly responsiveImageSrcset = responsiveImageSrcset;
  protected readonly destinations = destinations;
  protected readonly videos = andamanVideos;
  protected readonly activeVideo = signal<AndamanVideo | null>(null);
  protected readonly provinceCards = provinceProfiles.map((profile) => ({
    ...profile,
    placeCount: destinations.filter((place) => place.province === profile.province).length,
  }));
  protected readonly selectedProvinceProfile = computed(
    () => provinceProfiles.find((profile) => profile.province === this.selectedProvince()) ?? null,
  );
  protected readonly weatherDestinationId = computed(() => {
    const province = this.selectedProvince();
    return province === 'All' ? 'phi-phi' : `province-${province.toLowerCase().replaceAll(' ', '-')}`;
  });
  protected readonly selectedProvincePlaces = computed(
    () => this.destinations.filter((place) => place.province === this.selectedProvince()),
  );
  protected readonly heroImage = andamanHeroImage;
  protected readonly tripImage = tripPlannerImage;

  protected text(english: string, thai: string): string {
    return this.language() === 'th' ? thai : english;
  }

  protected toggleLanguage(): void {
    this.languageService.toggle();
  }

  protected provinceName(province: string): string {
    return localizedProvinceName(province, this.language());
  }

  protected provinceDescription(province: string, englishDescription: string): string {
    return localizedProvinceDescription(province, englishDescription, this.language());
  }

  protected placeDescription(name: string, englishDescription: string): string {
    return localizedPlaceDescription(name, englishDescription, this.language());
  }

  protected recommendationReason(reason: string): string {
    if (this.language() !== 'th') return reason;
    return reason.split(' · ').map((part) => {
      if (part.startsWith('Matches your interests: ')) {
        return `ตรงกับความสนใจของคุณ: ${part.slice('Matches your interests: '.length).split(', ').map((interest) => this.interestName(interest)).join(', ')}`;
      }
      if (part === 'Similar to a place you saved') return 'คล้ายสถานที่ที่คุณบันทึกไว้';
      const match = /^A highly rated place in (.+)$/.exec(part);
      return match ? `สถานที่ที่ได้รับคะแนนดีใน${this.provinceName(match[1])}` : part;
    }).join(' · ');
  }

  protected placeCategory(category: string): string {
    return localizedPlaceCategory(category, this.language());
  }

  protected placeName(name: string): string {
    return localizedPlaceName(name, this.language());
  }

  protected interestName(interest: string): string {
    if (this.language() !== 'th') return interest;
    return ({ Beach: 'ชายหาด', Diving: 'ดำน้ำ', Photography: 'ถ่ายภาพ', 'Island Hopping': 'เที่ยวเกาะ', Nature: 'ธรรมชาติ', Adventure: 'ผจญภัย', Relax: 'พักผ่อน', Food: 'อาหาร', Sunset: 'ชมพระอาทิตย์ตก' } as Record<string, string>)[interest] ?? interest;
  }

  protected setProvinceFilter(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedProvince.set(value);
  }

  constructor() {
    if (typeof document !== 'undefined') document.documentElement.lang = this.language();
    this.authService.restoreSession();
    this.recommendationRequests
      .pipe(
        switchMap((interests) =>
          this.recommendationsApi.getRecommendations(interests, this.savedPlaces()).pipe(
            map((matches): RecommendationResult => ({ matches, offline: false })),
            catchError(() => of({
              matches: getLocalRecommendations(this.destinations, interests, this.savedPlaces()),
              offline: true,
            })),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((result) => {
        this.recommendationsLoading.set(false);
        this.recommendationsError.set(false);
        this.recommendationsOffline.set(result.offline);
        this.recommendationMatches.set(result.matches);
      });

    this.boatRouteRequests
      .pipe(
        switchMap(() =>
          this.boatRoutesApi.getRoutes().pipe(
            map((routes): BoatRoutesResult => ({ routes })),
            catchError(() => of({ error: true } as const)),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((result) => {
        this.boatRoutesLoading.set(false);
        this.boatRoutesError.set(false);
        this.boatRoutes.set('routes' in result ? result.routes : fallbackBoatRoutes);
      });

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        const isHome = !event.urlAfterRedirects.startsWith('/places/') && !event.urlAfterRedirects.startsWith('/events') && !event.urlAfterRedirects.startsWith('/admin/');
        this.isHome.set(isHome);
        const fragment = new URL(event.urlAfterRedirects, window.location.origin).hash.slice(1);
        if (isHome && fragment) this.scrollToSectionAfterRender(fragment);
      });

    const initialFragment = window.location.hash.slice(1);
    if (initialFragment) this.scrollToSectionAfterRender(initialFragment);

    this.refreshRecommendations();
    this.refreshBoatRoutes();
  }

  protected refreshBoatRoutes(): void {
    this.boatRoutesLoading.set(true);
    this.boatRoutesError.set(false);
    this.boatRouteRequests.next();
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  protected navigateToSection(event: MouseEvent, sectionId: string): void {
    event.preventDefault();
    history.replaceState(null, '', `${location.pathname}${location.search}#${sectionId}`);
    this.scrollToSection(sectionId);
  }

  private scrollToSectionAfterRender(sectionId: string): void {
    requestAnimationFrame(() => requestAnimationFrame(() => this.scrollToSection(sectionId)));
  }

  private scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected closeMobileMenuOnEscape(event: Event): void {
    this.closeMobileMenu();
    const menuToggle = (event.currentTarget as HTMLElement).previousElementSibling;
    if (menuToggle instanceof HTMLButtonElement) {
      menuToggle.focus();
    }
  }

  protected updateBoatRouteSearch(event: Event): void {
    this.boatRouteSearch.set((event.target as HTMLInputElement).value);
  }

  protected boatRouteSearchUrl(route: BoatRoute): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${route.departure} ferry pier ${route.destination}`)}`;
  }

  protected isRecommendationInterestSelected(interest: string): boolean {
    return this.selectedRecommendationInterests().includes(interest);
  }

  protected toggleRecommendationInterest(interest: string): void {
    const selected = this.selectedRecommendationInterests();
    if (selected.includes(interest) && selected.length === 1) {
      return;
    }
    this.selectedRecommendationInterests.set(
      selected.includes(interest)
        ? selected.filter((item) => item !== interest)
        : [...selected, interest],
    );
    this.refreshRecommendations();
  }

  protected refreshRecommendations(): void {
    this.recommendationsLoading.set(true);
    this.recommendationsError.set(false);
    this.recommendationRequests.next(this.selectedRecommendationInterests());
  }

  protected readonly visibleDestinations = computed((): RecommendedPlace[] => {
    const province = this.selectedProvince();
    const query = this.searchQuery().trim().toLowerCase();
    const matches = province === 'All'
      ? this.recommendationMatches()
      : getLocalRecommendations(this.destinations, this.selectedRecommendationInterests(), this.savedPlaces())
          .filter((match) => this.destinations.find((place) => place.id === match.id)?.province === province);
    return matches
      .map((match) => {
        const place = this.destinations.find((destination) => destination.id === match.id);
        return place
          ? {
              ...place,
              matchScore: match.matchScore,
              matchedInterests: match.matchedInterests,
              reason: match.reason,
            }
          : null;
      })
      .filter((place): place is RecommendedPlace => place !== null)
      .filter((place) => {
        const provinceMatches = province === 'All' || place.province === province;
        const queryMatches =
          !query ||
          `${place.name} ${place.province} ${place.category}`.toLowerCase().includes(query);
        return provinceMatches && queryMatches;
      });
  });

  protected readonly savedDestinations = computed(() =>
    this.destinations.filter((place) => this.savedPlaces().includes(place.id)),
  );
  protected readonly plannedStops = computed(() =>
    this.tripPlanService.plan().stops.flatMap((stop) => {
      const place = this.destinations.find((destination) => destination.id === stop.destinationId);
      return place ? [{ ...stop, place }] : [];
    }),
  );
  protected readonly availableTripDestinations = computed(() => {
    const plannedIds = new Set(this.tripPlanService.plan().stops.map((stop) => stop.destinationId));
    return this.destinations.filter((place) => !plannedIds.has(place.id));
  });
  protected readonly visibleBoatRoutes = computed(() => {
    const query = this.boatRouteSearch().trim().toLowerCase();
    return this.boatRoutes().filter((route) =>
      !query || `${route.departure} ${route.destination} ${route.transportType} ${route.operator}`.toLowerCase().includes(query),
    );
  });

  protected selectProvince(province: AndamanProvince): void {
    this.selectedProvince.update((current) => (current === province ? 'All' : province));
    if (this.selectedProvince() === province) {
      requestAnimationFrame(() => document.getElementById('province-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }

  protected provinceMapUrl(profile: (typeof provinceProfiles)[number]): SafeResourceUrl {
    const { latitude, longitude } = profile;
    const bounds = `${longitude - 0.18}%2C${latitude - 0.12}%2C${longitude + 0.18}%2C${latitude + 0.12}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.openstreetmap.org/export/embed.html?bbox=${bounds}&layer=mapnik&marker=${latitude}%2C${longitude}`,
    );
  }

  protected provinceVideo(profile: (typeof provinceProfiles)[number]): AndamanVideo | undefined {
    return this.videos.find((video) => video.province === profile.province);
  }

  // VIDEO SEARCH FALLBACK: จังหวัดที่ไม่มีรายการใน shared/data/videos.data.ts จะค้นหาคลิปใน YouTube อัตโนมัติ
  protected provinceVideoSearchUrl(profile: (typeof provinceProfiles)[number]): string {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${profile.province} Thailand travel`)}`;
  }

  protected provinceVideoEmbedUrl(profile: (typeof provinceProfiles)[number]): SafeResourceUrl | null {
    const video = this.provinceVideo(profile);
    return video ? this.sanitizer.bypassSecurityTrustResourceUrl(youtubeEmbedUrl(video)) : null;
  }

  protected updateSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected toggleSaved(id: string): void {
    this.favoritesService.toggleFavorite(id);
    this.refreshRecommendations();
  }

  protected isSaved(id: string): boolean {
    return this.savedPlaces().includes(id);
  }

  protected startTrip(): void {
    this.scrollToSection('trip-planner');
  }

  protected addTripStop(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select.value) {
      this.tripPlanService.addStop(select.value);
      select.value = '';
    }
  }

  protected updateTripStartDate(event: Event): void {
    this.tripPlanService.updatePlan({ startDate: (event.target as HTMLInputElement).value });
  }

  protected updateTripDuration(event: Event): void {
    this.tripPlanService.updatePlan({ durationDays: Number((event.target as HTMLSelectElement).value) });
  }

  protected assignTripStopDay(event: Event, destinationId: string): void {
    this.tripPlanService.assignStopToDay(destinationId, Number((event.target as HTMLSelectElement).value));
  }

  protected todayDate(): string {
    return localDateString();
  }

  protected mapUrl(destination: (typeof destinations)[number]): string {
    return `https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`;
  }

  protected openAuthDialog(dialog: HTMLDialogElement): void {
    this.authError.set('');
    dialog.showModal();
    dialog.querySelector<HTMLInputElement>('input[type="email"]')?.focus();
  }

  protected submitAuth(event: SubmitEvent, dialog: HTMLDialogElement): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const values = new FormData(form);
    const email = String(values.get('email') ?? '');
    const password = String(values.get('password') ?? '');
    this.authBusy.set(true);
    this.authError.set('');
    const request = this.authMode() === 'register'
      ? this.authService.register(email, password)
      : this.authService.login(email, password);
    request.subscribe({
      next: () => { this.authBusy.set(false); form.reset(); dialog.close(); },
      error: (error: { error?: { message?: string } }) => {
        this.authBusy.set(false);
        this.authError.set(error.error?.message ?? 'Could not reach the sign-in service. Please try again.');
      },
    });
  }

  protected handleImageError(event: Event, fallbackUrl: string): void {
    applyImageFallback(event, fallbackUrl);
  }

  protected openVideo(video: AndamanVideo, dialog: HTMLDialogElement): void {
    this.activeVideo.set(video);
    dialog.showModal();
    dialog.querySelector<HTMLButtonElement>('.video-dialog__close')?.focus();
  }

  protected closeVideo(dialog: HTMLDialogElement): void {
    if (dialog.open) {
      dialog.close();
    }
    this.activeVideo.set(null);
  }

  protected closeVideoOnBackdrop(event: MouseEvent, dialog: HTMLDialogElement): void {
    if (event.target === dialog) {
      this.closeVideo(dialog);
    }
  }

  protected closeVideoOnEscape(event: KeyboardEvent, dialog: HTMLDialogElement): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeVideo(dialog);
    }
  }

  protected clearActiveVideo(): void {
    this.activeVideo.set(null);
  }

  protected videoEmbedUrl(video: AndamanVideo): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(youtubeEmbedUrl(video));
  }
}


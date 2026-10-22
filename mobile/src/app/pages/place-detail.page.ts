import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, filter, map, merge, of, Subject, switchMap } from 'rxjs';
import { applyImageFallback, responsiveImageSrcset } from '../../../../shared/data/images.data';
import { AndamanPlace, destinations } from '../../../../shared/data/places.data';
import type { BoatRoute } from '../../../../shared/data/boat-routes.data';
import { FavoritesService } from '../core/favorites.service';
import { LiveWeatherComponent } from '../components/live-weather.component';
import { BoatRoutesApiService } from '../core/boat-routes-api.service';
import { TripPlanService } from '../core/trip-plan.service';
import { LanguageService } from '../core/language.service';
import { placeCategory, placeDescription, placeName, provinceName } from '../../../../shared/data/localization.data';

type BoatRoutesResult = { routes: BoatRoute[] } | { error: true };

@Component({
  selector: 'app-place-detail-content',
  standalone: true,
  imports: [CommonModule, LiveWeatherComponent, RouterLink],
  templateUrl: '../../../../shared/components/place-detail.component.html',
  styleUrl: '../../../../shared/components/place-detail.component.scss',
})
export class PlaceDetailPage {
  protected readonly responsiveImageSrcset = responsiveImageSrcset;
  private readonly route = inject(ActivatedRoute);
  private readonly boatRoutesApi = inject(BoatRoutesApiService);
  private readonly retryBoatRouteRequests = new Subject<string>();
  protected readonly favoritesService = inject(FavoritesService);
  protected readonly tripPlanService = inject(TripPlanService);
  private readonly languageService = inject(LanguageService);
  protected readonly language = this.languageService.language;
  protected readonly tripAdded = signal(false);
  private touchStartX = 0;
  private readonly placeId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: this.route.snapshot.paramMap.get('id') },
  );

  protected readonly place = computed(
    () => destinations.find((destination) => destination.id === this.placeId()) ?? null,
  );
  protected readonly gallery = computed(() => {
    const place = this.place();
    return place ? [place.image, ...place.gallery] : [];
  });
  protected readonly selectedImageIndex = signal(0);
  protected readonly nearbyPlaces = computed(() => {
    const place = this.place();
    return place
      ? destinations.filter((destination) => destination.province === place.province && destination.id !== place.id).slice(0, 3)
      : [];
  });
  protected readonly availableBoatRoutes = signal<BoatRoute[]>([]);
  protected readonly boatRoutesLoading = signal(false);
  protected readonly boatRoutesError = signal(false);
  protected readonly homeLink: string = this.route.snapshot.data['homeLink'];

  protected text(english: string, thai: string): string {
    return this.language() === 'th' ? thai : english;
  }

  protected localizedName(name: string): string {
    return placeName(name, this.language());
  }

  protected localizedProvince(name: string): string {
    return provinceName(name, this.language());
  }

  protected localizedCategory(name: string): string {
    return placeCategory(name, this.language());
  }

  protected localizedDescription(name: string, description: string): string {
    return placeDescription(name, description, this.language());
  }

  protected localizedActivity(activity: string): string {
    if (this.language() !== 'th') return activity;
    return ({
      Beach: 'ชายหาด', Diving: 'ดำน้ำ', Photography: 'ถ่ายภาพ', 'Island Hopping': 'เที่ยวเกาะ',
      Nature: 'ธรรมชาติ', Adventure: 'ผจญภัย', Relax: 'พักผ่อน', Food: 'อาหาร', Sunset: 'ชมพระอาทิตย์ตก',
      Culture: 'วัฒนธรรม', Architecture: 'สถาปัตยกรรม', Swimming: 'ว่ายน้ำ', Sunrise: 'ชมพระอาทิตย์ขึ้น',
      Snorkeling: 'ดำน้ำตื้น', Hiking: 'เดินป่า', Viewpoint: 'ชมวิว', 'Boat Tour': 'ล่องเรือ',
      Community: 'ชุมชน', History: 'ประวัติศาสตร์', Wellness: 'สุขภาพ', Wildlife: 'สัตว์ป่า', Walking: 'เดินเที่ยว',
      Kayaking: 'พายเรือคายัก', 'Road Trip': 'เดินทางโดยรถ',
    } as Record<string, string>)[activity] ?? activity;
  }

  protected addToTrip(id: string): void {
    this.tripPlanService.addStop(id);
    this.tripAdded.set(true);
  }

  constructor() {
    merge(
      this.route.paramMap.pipe(map((params) => params.get('id'))),
      this.retryBoatRouteRequests,
    )
      .pipe(
        filter((id): id is string => id !== null),
        switchMap((id) => {
          this.boatRoutesLoading.set(true);
          this.boatRoutesError.set(false);
          return this.boatRoutesApi.getRoutes(id).pipe(
            map((routes): BoatRoutesResult => ({ routes })),
            catchError(() => of({ error: true } as const)),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((result) => {
        this.boatRoutesLoading.set(false);
        this.boatRoutesError.set('error' in result);
        this.availableBoatRoutes.set('routes' in result ? result.routes : []);
      });
  }

  protected mapUrl(place: AndamanPlace): string {
    return `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
  }

  protected directionsUrl(place: AndamanPlace): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
  }

  protected boatDirectionsUrl(route: BoatRoute): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${route.departure} ferry pier ${route.destination}`)}`;
  }

  protected toggleFavorite(id: string): void {
    this.favoritesService.toggleFavorite(id);
  }

  protected retryBoatRoutes(): void {
    const id = this.place()?.id;
    if (id) {
      this.retryBoatRouteRequests.next(id);
    }
  }

  protected handleImageError(event: Event, fallbackUrl: string): void {
    applyImageFallback(event, fallbackUrl);
  }

  protected openLightbox(index: number, dialog: HTMLDialogElement): void {
    this.selectedImageIndex.set(index);
    dialog.showModal();
  }

  protected closeLightbox(dialog: HTMLDialogElement): void {
    if (dialog.open) {
      dialog.close();
    }
  }

  protected changeImage(direction: -1 | 1): void {
    const count = this.gallery().length;
    if (count > 0) {
      this.selectedImageIndex.update((index) => (index + direction + count) % count);
    }
  }

  protected handleGalleryKeydown(event: KeyboardEvent, dialog: HTMLDialogElement): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.changeImage(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.changeImage(1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.closeLightbox(dialog);
    }
  }

  protected beginGallerySwipe(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0]?.clientX ?? 0;
  }

  protected finishGallerySwipe(event: TouchEvent): void {
    const endX = event.changedTouches[0]?.clientX ?? this.touchStartX;
    const distance = endX - this.touchStartX;
    if (Math.abs(distance) > 48) {
      this.changeImage(distance < 0 ? 1 : -1);
    }
  }

  protected clearGallerySelection(): void {
    this.selectedImageIndex.set(0);
  }
}

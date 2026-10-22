import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, map, of, Subject, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline, location, search, star } from 'ionicons/icons';
import {
  AndamanProvince,
  andamanHeroImage,
  responsiveImageSrcset,
} from '../../../../shared/data/images.data';
import { provinceProfiles } from '../../../../shared/data/places.data';
import { southernProvinces } from '../../../../shared/data/provinces.data';
import { getLocalRecommendations, type RecommendationMatch } from '../../../../shared/data/recommendations.data';
import { andamanVideos, AndamanVideo, youtubeEmbedUrl } from '../../../../shared/data/videos.data';
import { FavoritesService } from '../core/favorites.service';
import { RecommendationsApiService } from '../core/recommendations-api.service';
import { LiveWeatherComponent } from '../components/live-weather.component';
import { applyImageFallback, destinations, seasons } from '../data/mock-data';

type RecommendedPlace = (typeof destinations)[number] & RecommendationMatch;
type RecommendationResult = { matches: RecommendationMatch[]; offline: boolean };

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSearchbar,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonModal,
    LiveWeatherComponent,
    RouterLink,
  ],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  protected readonly responsiveImageSrcset = responsiveImageSrcset;
  private readonly sanitizer = inject(DomSanitizer);
  private readonly recommendationsApi = inject(RecommendationsApiService);
  private readonly recommendationRequests = new Subject<readonly string[]>();
  protected readonly favoritesService = inject(FavoritesService);
  protected readonly destinations = destinations;
  protected readonly provinceCards = provinceProfiles.map((profile) => ({
    ...profile,
    placeCount: destinations.filter((place) => place.province === profile.province).length,
  }));
  protected readonly interests = seasons;
  protected readonly provinces = southernProvinces;
  protected readonly selectedRecommendationInterests = signal<string[]>(['Beach', 'Diving']);
  protected readonly recommendationMatches = signal<RecommendationMatch[]>([]);
  protected readonly recommendationsLoading = signal(false);
  protected readonly recommendationsError = signal(false);
  protected readonly recommendationsOffline = signal(false);
  protected readonly heroImage = andamanHeroImage;
  protected readonly videos = andamanVideos;
  protected readonly activeVideo = signal<AndamanVideo | null>(null);
  protected readonly selectedProvince = signal<AndamanProvince | 'All'>('All');
  protected readonly visibleDestinations = computed((): RecommendedPlace[] => {
    const province = this.selectedProvince();
    const matches = province === 'All'
      ? this.recommendationMatches()
      : getLocalRecommendations(this.destinations, this.selectedRecommendationInterests(), this.favoritesService.favorites());
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
      .filter((place) => province === 'All' || place.province === province);
  });

  constructor() {
    addIcons({ search, location, star, heart, heartOutline });
    this.recommendationRequests
      .pipe(
        switchMap((selectedInterests) =>
          this.recommendationsApi
            .getRecommendations(selectedInterests, this.favoritesService.favorites())
            .pipe(
              map((matches): RecommendationResult => ({ matches, offline: false })),
              catchError(() => of({
                matches: getLocalRecommendations(this.destinations, selectedInterests, this.favoritesService.favorites()),
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
    this.refreshRecommendations();
  }

  protected toggleFavorite(id: string): void {
    this.favoritesService.toggleFavorite(id);
    this.refreshRecommendations();
  }

  protected isInterestSelected(interest: string): boolean {
    return this.selectedRecommendationInterests().includes(interest);
  }

  protected toggleInterest(interest: string): void {
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

  protected exploreDestinations(): void {
    document.getElementById('provinces')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected selectProvince(province: AndamanProvince): void {
    this.selectedProvince.update((selected) => selected === province ? 'All' : province);
    document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' });
  }

  protected showAllProvinces(): void {
    this.selectedProvince.set('All');
  }

  protected openVideo(video: AndamanVideo): void {
    this.activeVideo.set(video);
  }

  protected closeVideo(): void {
    this.activeVideo.set(null);
  }

  protected videoEmbedUrl(video: AndamanVideo): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(youtubeEmbedUrl(video));
  }

  protected handleImageError(event: Event, fallbackUrl: string): void {
    applyImageFallback(event, fallbackUrl);
  }
}

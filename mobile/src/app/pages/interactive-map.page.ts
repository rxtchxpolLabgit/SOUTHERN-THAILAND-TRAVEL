import { AfterViewInit, Component, computed, ElementRef, inject, OnDestroy, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import * as L from 'leaflet';
import { applyImageFallback } from '../../../../shared/data/images.data';
import { distanceKilometers } from '../../../../shared/data/geo.utils';
import { destinations, type AndamanPlace } from '../../../../shared/data/places.data';
import { LiveWeatherComponent } from '../components/live-weather.component';
import { LanguageService } from '../core/language.service';
import { placeCategory, placeName, provinceName } from '../../../../shared/data/localization.data';

@Component({
  selector: 'app-interactive-map',
  standalone: true,
  imports: [CommonModule, LiveWeatherComponent, RouterLink],
  templateUrl: '../../../../shared/components/interactive-map.component.html',
  styleUrl: '../../../../shared/components/interactive-map.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class InteractiveMapPage implements AfterViewInit, OnDestroy {
  private readonly languageService = inject(LanguageService);
  protected readonly language = this.languageService.language;
  @ViewChild('mapCanvas', { static: true }) private mapCanvas!: ElementRef<HTMLDivElement>;

  protected readonly destinations = destinations;
  protected readonly selectedPlaceId = signal('phi-phi');
  protected readonly selectedPlace = computed(
    () => destinations.find((place) => place.id === this.selectedPlaceId()) ?? destinations[0],
  );
  protected readonly mapError = signal('');

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

  private map?: L.Map;
  private resizeObserver?: ResizeObserver;
  private readonly markers = new Map<string, L.Marker>();
  private readonly phiPhi = destinations.find((place) => place.id === 'phi-phi') ?? destinations[0];
  private readonly invalidateMapSize = (): void => {
    this.map?.invalidateSize();
  };

  ngAfterViewInit(): void {
    this.map = L.map(this.mapCanvas.nativeElement, {
      scrollWheelZoom: false,
      zoomControl: true,
      keyboard: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    })
      .on('tileerror', () => this.mapError.set('Map tiles could not be loaded. Check your internet connection and try again.'))
      .addTo(this.map);

    for (const place of destinations) {
      const marker = L.marker([place.latitude, place.longitude], {
        title: place.name,
        alt: `Map marker for ${place.name}`,
        keyboard: true,
        icon: this.markerIcon(place.id === this.selectedPlaceId()),
      }).addTo(this.map);
      marker.on('click', () => this.selectPlace(place.id));
      this.markers.set(place.id, marker);
    }

    this.resetMap();
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(this.invalidateMapSize);
      this.resizeObserver.observe(this.mapCanvas.nativeElement);
    } else {
      window.addEventListener('resize', this.invalidateMapSize);
    }
    requestAnimationFrame(() => this.map?.invalidateSize());
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    window.removeEventListener('resize', this.invalidateMapSize);
    this.map?.remove();
  }

  protected selectPlace(id: string): void {
    if (!destinations.some((place) => place.id === id)) {
      this.mapError.set('That destination is not available on the map.');
      return;
    }

    this.selectedPlaceId.set(id);
    for (const [markerId, marker] of this.markers) {
      marker.setIcon(this.markerIcon(markerId === id));
    }
  }

  protected resetMap(): void {
    if (this.map) {
      this.map.fitBounds(
        destinations.map((place) => [place.latitude, place.longitude] as L.LatLngTuple),
        { padding: [24, 24], maxZoom: 8 },
      );
    }
  }

  protected distanceFromPhiPhi(place: AndamanPlace): string {
    const distance = distanceKilometers(this.phiPhi, place);
    return `${distance < 0.5 ? 0 : distance < 1 ? '<1' : Math.round(distance)} km`;
  }

  protected directionsUrl(place: AndamanPlace): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
  }

  protected handleImageError(event: Event, fallbackUrl: string): void {
    applyImageFallback(event, fallbackUrl);
  }

  private markerIcon(selected: boolean): L.DivIcon {
    return L.divIcon({
      className: selected ? 'andaman-map-marker-selected' : 'andaman-map-marker',
      html: '<span aria-hidden="true"></span>',
      iconSize: [34, 38],
      iconAnchor: [17, 36],
    });
  }
}

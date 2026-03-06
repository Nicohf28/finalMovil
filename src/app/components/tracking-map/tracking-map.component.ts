import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import type { Map, Marker } from 'leaflet';

@Component({
  selector: 'app-tracking-map',
  templateUrl: './tracking-map.component.html',
  styleUrls: ['./tracking-map.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class TrackingMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;
  @Input() orderId = '';

  map: Map | null = null;
  marker: Marker | null = null;
  watchId: number | null = null;
  error = '';
  loading = true;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.initMap();
  }

  private async initMap() {
    const container = this.mapContainer?.nativeElement;
    if (!container) {
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }
    try {
      const L = await import('leaflet');
      this.map = L.map(container).setView([4.6097, -74.0817], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(this.map);

      const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      L.Marker.prototype.options.icon = defaultIcon;

      const position = await this.getCurrentPosition();
      if (position) {
        this.map.setView([position.lat, position.lng], 15);
        this.marker = L.marker([position.lat, position.lng]).addTo(this.map);
      }
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => this.updatePosition(pos, L),
        (err) => {
          this.error = 'No se pudo obtener la ubicación';
          this.cdr.detectChanges();
        },
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    } catch (e) {
      this.error = 'No se pudo cargar el mapa';
      this.cdr.detectChanges();
    }
    this.loading = false;
    this.cdr.detectChanges();
  }

  private getCurrentPosition(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  private updatePosition(pos: GeolocationPosition, L: typeof import('leaflet')) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else if (this.map) {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
    if (this.map) this.map.setView([lat, lng], this.map.getZoom());
    this.error = '';
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    if (this.watchId != null) navigator.geolocation.clearWatch(this.watchId);
    this.marker = null;
    this.map?.remove();
    this.map = null;
  }
}

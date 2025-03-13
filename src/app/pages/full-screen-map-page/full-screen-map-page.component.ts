import { DecimalPipe, JsonPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { environment } from '@environments/environment';
import {
  FullscreenControl,
  Map,
  NavigationControl,
  ScaleControl,
} from 'mapbox-gl';

@Component({
  selector: 'app-full-screen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './full-screen-map-page.component.html',
  styleUrl: './full-screen-map-page.component.css',
})
export class FullScreenMapPageComponent implements AfterViewInit {
  zoom = signal(12);
  coordinates = signal({ lng: -64.1971129, lat: -31.4136803 });

  divElement = viewChild<ElementRef>('map');

  map = signal<Map | null>(null);

  zoomEffect = effect(() => {
    if (!this.map()) return;
    this.map()?.setZoom(this.zoom());
  });

  async ngAfterViewInit(): Promise<void> {
    if (!this.divElement()?.nativeElement) return;
    const element = this.divElement()!.nativeElement;
    const { lng, lat } = this.coordinates();
    const map = new Map({
      accessToken: environment.mapBoxApiKey,
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: this.zoom(),
    });
    this.mapListeners(map);
  }

  mapListeners(map: Map) {
    // After zoom effect
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });
    map.on('moveend', (event) => {
      const center = map.getCenter();
      this.coordinates.set(center);
    });
    map.addControl(new FullscreenControl());
    map.addControl(new NavigationControl());
    map.addControl(new ScaleControl());
    this.map.set(map);
  }
}

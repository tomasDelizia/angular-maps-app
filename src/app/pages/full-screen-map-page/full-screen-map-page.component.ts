import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { environment } from '@environments/environment';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = environment.mapBoxApiKey;
@Component({
  selector: 'app-full-screen-map-page',
  imports: [DecimalPipe],
  templateUrl: './full-screen-map-page.component.html',
  styleUrl: './full-screen-map-page.component.css',
})
export class FullScreenMapPageComponent implements AfterViewInit {
  zoom = signal(14);

  divElement = viewChild<ElementRef>('map');

  map = signal<mapboxgl.Map | null>(null);

  zoomEffect = effect(() => {
    if (!this.map()) return;
    this.map()?.setZoom(this.zoom());
  });

  async ngAfterViewInit(): Promise<void> {
    if (!this.divElement()?.nativeElement) return;
    const element = this.divElement()!.nativeElement;
    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40],
      zoom: this.zoom(),
    });
    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    // After zoom effect
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });
    this.map.set(map);
  }
}

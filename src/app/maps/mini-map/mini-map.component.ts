import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { environment } from '@environments/environment';

import mapboxgl, { Map as MapboxMap, Marker as MapboxMarker } from 'mapbox-gl';
import { getRandomHexColor } from 'src/app/utils/hex-color-generator';

mapboxgl.accessToken = environment.mapBoxApiKey;

const delay = () => new Promise((resolve) => setTimeout(resolve, 80));

@Component({
  selector: 'mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
})
export class MiniMapComponent implements AfterViewInit {
  lngLat = input.required<{ lng: number; lat: number }>();
  zoom = input(12);

  divElement = viewChild<ElementRef>('map');

  map = signal<MapboxMap | null>(null);

  async ngAfterViewInit(): Promise<void> {
    if (!this.divElement()?.nativeElement) return;
    await delay();
    const element = this.divElement()!.nativeElement;
    const { lng, lat } = this.lngLat();
    const map = new MapboxMap({
      container: element,
      interactive: false,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: this.zoom(),
    });
    this.map.set(map);
    new MapboxMarker({
      draggable: false,
      color: getRandomHexColor(),
    })
      .setLngLat(this.lngLat())
      .addTo(this.map()!);
  }
}

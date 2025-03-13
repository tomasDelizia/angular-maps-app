import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { environment } from '@environments/environment';
import mapboxgl, {
  Map as MapboxMap,
  Marker as MapboxMarker,
  LngLatLike,
  MapMouseEvent,
} from 'mapbox-gl';
import { v4 as uuidv4 } from 'uuid';
import { getRandomHexColor } from 'src/app/utils/hex-color-generator';
import { JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapBoxApiKey;

interface Marker {
  id: string;
  mapboxMarker: MapboxMarker;
}

const delay = () => new Promise((resolve) => setTimeout(resolve, 80));

@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');

  map = signal<MapboxMap | null>(null);

  markers = signal<Marker[]>([]);

  async ngAfterViewInit(): Promise<void> {
    if (!this.divElement()?.nativeElement) return;
    await delay();
    const element = this.divElement()!.nativeElement;
    const map = new MapboxMap({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-64.1971129, -31.4136803],
      zoom: 12,
    });
    this.mapListeners(map);
  }

  mapListeners(map: MapboxMap) {
    map.on('click', (event) => {
      this.mapClick(event);
    });
    this.map.set(map);
  }

  private mapClick(event: MapMouseEvent) {
    if (!this.map()) return;
    const mapboxMarker = new MapboxMarker({
      draggable: false,
      color: getRandomHexColor(),
    })
      .setLngLat(event.lngLat)
      .addTo(this.map()!);

    const newMarker: Marker = {
      id: uuidv4(),
      mapboxMarker,
    };
    this.markers.set([newMarker, ...this.markers()]);
    console.log(this.markers());
  }

  flyToMarker(lngLat: LngLatLike) {
    if (!this.map()) return;
    this.map()?.flyTo({
      center: lngLat,
    });
  }

  deleteMarker(marker: Marker) {
    if (!this.map()) return;
    marker.mapboxMarker.remove();
    this.markers.set(this.markers().filter((m) => m.id !== marker.id));
  }
}

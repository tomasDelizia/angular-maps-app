import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { environment } from '@environments/environment';
import mapboxgl from 'mapbox-gl';
import { v4 as uuidv4 } from 'uuid';
import { getRandomHexColor } from 'src/app/utils/hex-color-generator';

mapboxgl.accessToken = environment.mapBoxApiKey;

interface Marker {
  id: string;
  mapboxMarker: mapboxgl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');

  map = signal<mapboxgl.Map | null>(null);

  markers = signal<Marker[]>([]);

  async ngAfterViewInit(): Promise<void> {
    if (!this.divElement()?.nativeElement) return;
    const element = this.divElement()!.nativeElement;
    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-64.1971129, -31.4136803],
      zoom: 12,
    });
    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.on('click', (event) => {
      this.mapClick(event);
    });
    this.map.set(map);
  }

  private mapClick(event: mapboxgl.MapMouseEvent) {
    if (!this.map()) return;
    const mapboxMarker = new mapboxgl.Marker({
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
}

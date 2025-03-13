import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { environment } from '@environments/environment';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = environment.mapBoxApiKey;
@Component({
  selector: 'app-markers-page',
  imports: [],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit {
  zoom = signal(12);
  coordinates = signal({ lng: -64.1971129, lat: -31.4136803 });

  divElement = viewChild<ElementRef>('map');

  map = signal<mapboxgl.Map | null>(null);

  async ngAfterViewInit(): Promise<void> {
    if (!this.divElement()?.nativeElement) return;
    const element = this.divElement()!.nativeElement;
    const { lng, lat } = this.coordinates();
    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: this.zoom(),
    });

    const marker = new mapboxgl.Marker({
      draggable: false,
      color: 'red',
    })
      .setLngLat(this.coordinates())
      .addTo(map);
    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    // After zoom effect
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });
    map.on('moveend', (event) => {
      const center = map.getCenter();
      this.coordinates.set(center);
    });
    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.ScaleControl());
    this.map.set(map);
  }
}

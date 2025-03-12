import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';
import { environment } from '@environments/environment';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = environment.mapBoxApiKey;
@Component({
  selector: 'app-full-screen-map-page',
  imports: [],
  templateUrl: './full-screen-map-page.component.html',
  styleUrl: './full-screen-map-page.component.css',
})
export class FullScreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');

  async ngAfterViewInit(): Promise<void> {
    if (!this.divElement()?.nativeElement) return;
    const element = this.divElement()!.nativeElement;
    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40],
      zoom: 9,
    });
  }
}

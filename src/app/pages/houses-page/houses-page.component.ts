import { Component, signal } from '@angular/core';
import { houses } from 'src/app/data/houses.data';
import { MiniMapComponent } from 'src/app/maps/mini-map/mini-map.component';

@Component({
  selector: 'app-houses-page',
  imports: [MiniMapComponent],
  templateUrl: './houses-page.component.html',
})
export class HousesPageComponent {
  houses = signal(houses);
}

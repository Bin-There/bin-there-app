import { Component } from '@angular/core';
import {GeolocationService} from "@ng-web-apis/geolocation";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bin-there-app';
  constructor(private readonly geolocation$: GeolocationService) {
    geolocation$.subscribe(position => console.log(position));
  }
}

import { Component } from '@angular/core';
import {GeolocationService} from "@ng-web-apis/geolocation";
import {AuthService} from "./shared/services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bin-there-app';
  constructor(private readonly geolocation$: GeolocationService, public authService: AuthService) {
    geolocation$.subscribe(position => console.log(position));
  }
}

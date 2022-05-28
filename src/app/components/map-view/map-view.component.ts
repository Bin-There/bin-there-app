import {Component, OnInit, ViewChild,} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MapInfoWindow, MapMarker, GoogleMap} from '@angular/google-maps';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AppConfig} from 'src/environments/app-config.environment';
import {GeolocationService} from '@ng-web-apis/geolocation';
import {Marker, Position, StorageService} from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  @ViewChild(GoogleMap, {static: false}) myMap: GoogleMap | undefined
  apiLoaded: Observable<boolean>;

  markerOptions: google.maps.MarkerOptions = {draggable: true};

  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    center: {lat: 46.770161693428626, lng: 23.58938212082915},
    mapId: "7373314d7db03f50",
    maxZoom: 30,
    minZoom: 8
  }

  markerPositions: google.maps.LatLngLiteral[] = [];

  constructor(httpClient: HttpClient, private readonly geolocation: GeolocationService, private readonly _storageService: StorageService) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=' + AppConfig.maps.mapKey, 'callback')
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );

    geolocation.subscribe(coordinates => {
      this.myMap?.panTo(new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude));
    });
  }

  click(event: google.maps.MapMouseEvent) {
    if (event?.latLng != null) {
      this.markerPositions.push(event.latLng.toJSON());
      this._storageService.AddMarker(new Marker(new Position(event.latLng.lat(), event.latLng.lng()), new Date(Date.now())));

      console.log("Marker added in map view. Markers count:" + this._storageService.Markers.length);
    }
  }

  ngOnInit(): void {

  }
}

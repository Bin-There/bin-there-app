import {Component, OnInit, ViewChild,} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MapInfoWindow, MapMarker, GoogleMap} from '@angular/google-maps';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AppConfig} from 'src/environments/app-config.environment';
import {GeolocationService} from '@ng-web-apis/geolocation';
import {Position, StorageService} from 'src/app/shared/services/storage.service';
import {TrashDialogComponent, TrashDialogResult} from "../trash-dialog/trash-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthService} from "../../shared/services/auth.service";
import {Marker} from "./marker";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  @ViewChild(GoogleMap, {static: false}) myMap: GoogleMap | undefined
  apiLoaded: Observable<boolean>;
  isLogged: boolean = false;

  markerOptions: google.maps.MarkerOptions = {draggable: true};

  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    center: {lat: 46.770161693428626, lng: 23.58938212082915},
    mapId: "7373314d7db03f50",

    maxZoom: 30,
    minZoom: 8
  }

  existingMarkers: Marker[] = [];
  newMarker: Marker | null = null;

  constructor(httpClient: HttpClient,
              private readonly geolocation: GeolocationService,
              private dialog: MatDialog,
              private readonly _storageService: StorageService,
              public readonly _authService: AuthService) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=' + AppConfig.maps.mapKey, 'callback')
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );

    geolocation.subscribe(coordinates => {
      this.myMap?.panTo(new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude));
    });
    _storageService.ObservableTrashes.subscribe(trashes => {
      let existingMarkers: Marker[] = [];
      trashes.map(value => {
        existingMarkers.push({
          position: value.location ? value.location : {lat: 46.770161693428626, lng: 23.58938212082915},
          options: {draggable: false, icon:"/assets/bin_mix_01.svg"}
        })
      })
      this.existingMarkers = existingMarkers;
    })
    this.isLogged = this._authService.isLoggedIn;
  }

  click(event: google.maps.MapMouseEvent) {
    if (event?.latLng != null) {
      this.newMarker = {
        position: event.latLng.toJSON(),
        options: {draggable: true},
      };
    }
  }

  ngOnInit(): void {
  }

  newTrash(): void {
    const dialogRef = this.dialog.open(TrashDialogComponent, {
      width: '270px',
      data: {
        trash: {
          location: this.newMarker?.position,
          userId: this._authService.userData.uid,
          date: new Date(),
          status: 'pending'
        },
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TrashDialogResult|undefined) => {
        if (!result) {
          return;
        }
        this.newMarker = null;
        this._storageService.AddTrash(result.trash);
      });
  }
}

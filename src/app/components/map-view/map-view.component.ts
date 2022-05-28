import {Component, OnInit, ViewChild,} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GoogleMap, MapDirectionsService} from '@angular/google-maps';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {GeolocationService} from '@ng-web-apis/geolocation';
import {StorageService} from 'src/app/shared/services/storage.service';
import {TrashDialogComponent, TrashDialogResult} from "../trash-dialog/trash-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../shared/services/auth.service";
import {Marker} from "./marker";
import {ActivatedRoute, Router} from "@angular/router";
import {TrashResources} from "../trash/TrashResources";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  @ViewChild(GoogleMap, {static: false}) myMap: GoogleMap | undefined
  mapScrolled: boolean = false;
  apiLoaded: Observable<boolean>|null = null;
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
  public directionsResults$: Observable<google.maps.DirectionsResult|undefined> | null = null;
  resources: TrashResources = new TrashResources();
  constructor(httpClient: HttpClient,
              private readonly geolocation: GeolocationService,
              private dialog: MatDialog,
              private readonly _storageService: StorageService,
              public readonly _authService: AuthService,
              private mapDirectionsService: MapDirectionsService,
              private route: ActivatedRoute) {
    if (!this.apiLoaded) {
      this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=' + environment.maps.mapKey+"&sensor=false", 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
    }

    geolocation.subscribe(coordinates => {
      if (!this.mapScrolled) {
        this.myMap?.panTo(new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude));
      }
      this.mapScrolled = true;
    });
    _storageService.ObservableTrashes.subscribe(trashes => {
      let existingMarkers: Marker[] = [];
      trashes.map(value => {
        existingMarkers.push({
          position: value.location ? value.location : {lat: 46.770161693428626, lng: 23.58938212082915},
          options: {draggable: false, icon: this.resources.getImageForType(value)}
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
  ngOnInit() {

  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(res => {
      let routeMarkers: any[] = JSON.parse(decodeURIComponent(res.selection));
      if (routeMarkers.length) {
        let waypoints: any[] = [];
        routeMarkers.map((value: any, index) => {
          if (value.location) {
            let loc = value!.location
            waypoints.push({
              location: {lat: parseFloat(loc.lat), lng: parseFloat(loc.lng)},
              stopover: false,
            })
          }
        })
        if (waypoints.length > 1) {
          let origin: any = waypoints.pop()!.location;
          let destination: any = waypoints.pop()!.location;

          let request: any = {
            optimizeWaypoints: true,
            destination: destination,
            origin: origin,
            waypoints: waypoints,
            travelMode: 'DRIVING',
            unitSystem: 1.0,
          };

          this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));
        }
      }
    });
  }

  newTrash(): void {
    const dialogRef = this.dialog.open(TrashDialogComponent, {
      data: {
        trash: {
          location: this.newMarker?.position,
          userId: this._authService.userData.uid,
          date: new Date(),
          status: 'pending',
          entityType: 'bin',
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

import {Component, OnInit, ViewChild,} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MapInfoWindow, MapMarker, GoogleMap, MapDirectionsService} from '@angular/google-maps';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {GeolocationService} from '@ng-web-apis/geolocation';
import {Position, StorageService} from 'src/app/shared/services/storage.service';
import {TrashDialogComponent, TrashDialogResult} from "../trash-dialog/trash-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AngularFirestore} from "@angular/fire/compat/firestore";
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
      this.myMap?.panTo(new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude));
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
    this.route.queryParams.subscribe(res => {
      const routeMarkers: any[] = JSON.parse(res.selection);
      if (routeMarkers.length) {
        let waypoints: google.maps.DirectionsWaypoint[] = [];
        routeMarkers.map((value: any) => {
          if (value.location) {
            waypoints.push({
              location: value!.location,
              stopover: false,
            })
          }
        })
        if (waypoints.length > 1) {
          let origin: any = waypoints.pop()!.location;
          let destination: any = waypoints.pop()!.location;


          let request: google.maps.DirectionsRequest = {
            optimizeWaypoints: true,
            destination: destination,
            origin: origin,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
          };
          console.log(request);
          this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => {console.log(response); return response.result}));
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

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

export class Position {
  constructor(public Latitude: number, public Longitude: number) {
    
  }
}

export class Marker {
      constructor(public Position: Position, public Date: Date) {
        
      }
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _subject: BehaviorSubject<Marker[]>;
  ObservableMarkers: Observable<Marker[]>;

  Markers: Marker[];

  constructor(private store: AngularFirestore) {

    this._subject = new BehaviorSubject<Marker[]>([]);
    this.Markers = JSON.parse(localStorage.getItem('markers') as string) ?? [];
    this.ObservableMarkers =  this._subject//this.getObservable(this.store.collection('markers')) as Observable<Marker[]>;
  }

  getObservable(collection: AngularFirestoreCollection<Marker>) : BehaviorSubject<Marker[]> {
    collection.valueChanges({ idField: 'id' }).subscribe((val: Marker[]) => {
      this._subject.next(val);
    });
    return this._subject;
  };

  AddMarker(marker: Marker){

    this.Markers.push(marker);

    this._subject.next(this._subject.value.concat(marker));

    localStorage.setItem('markers', JSON.stringify(this.Markers));

    console.log("Marker added to storage: " + marker)
  }
}

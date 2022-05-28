import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import {Trash} from "../../components/trash/trash";

export class Position {
  constructor(public Latitude: number, public Longitude: number) {

  }
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _subject: BehaviorSubject<Trash[]>;
  ObservableTrashes: Observable<Trash[]>;

  constructor(private store: AngularFirestore) {

    this._subject = new BehaviorSubject<Trash[]>([]);
    this.ObservableTrashes =  this.getObservable(this.store.collection('trash')) as Observable<Trash[]>;
  }

  getObservable(collection: AngularFirestoreCollection<Trash>) : BehaviorSubject<Trash[]> {
    collection.valueChanges({ idField: 'id' }).subscribe((val: Trash[]) => {
      this._subject.next(val);
    });
    return this._subject;
  };

  AddTrash(trash: Trash){

    this._subject.next(this._subject.value.concat(trash));

    this.store.collection('trash').add(trash);

    console.log("Trash added to DB: " + trash)
  }
}

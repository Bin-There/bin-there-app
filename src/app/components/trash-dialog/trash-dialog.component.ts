import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Trash} from "../trash/trash";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize, Observable} from "rxjs";

@Component({
  selector: 'app-trash-dialog',
  templateUrl: './trash-dialog.component.html',
  styleUrls: ['./trash-dialog.component.scss']
})
export class TrashDialogComponent implements OnInit {
  public sizes = [
    {value: "small", viewValue: "Small"},
    {value: "medium", viewValue: "Medium"},
    {value: "big", viewValue: "Big"},
  ]
  public types = [
    {value: "paper", viewValue: "Paper"},
    {value: "metal", viewValue: "Metal"},
    {value: "plastic", viewValue: "Plastic"},
    {value: "glass", viewValue: "Glass"},
    {value: "composable", viewValue: "Composable waste"},
    {value: "debris", viewValue: "Debris"},
    {value: "oil", viewValue: "Used oil"},
    {value: "electronic_waste", viewValue: "electronic waste"},
  ];
  private trashPhotoDownloadURL: Observable<string> | null = null;
  ngOnInit(): void {
  }

  private backupTrash: Partial<Trash> = { ...this.data.trash };

  constructor(
    public dialogRef: MatDialogRef<TrashDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TrashDialogData,
    private storage: AngularFireStorage
  ) {}

  cancel(): void {
    this.data.trash = {}
    this.dialogRef.close(this.data);
  }

  onFileSelected(event: Event) {
    var n = Date.now();
    const file = (event.target as HTMLInputElement).files?.[0];
    const filePath = `trash/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`trash/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.trashPhotoDownloadURL = fileRef.getDownloadURL();
          this.trashPhotoDownloadURL.subscribe(url => {
            if (url) {
              this.data.trash.photoURL = url;
            }
          });
        })
      )
      .subscribe(url => {
      });
  }

}

export interface TrashDialogData {
  trash: Partial<Trash>;
  enableDelete: boolean;
}

export interface TrashDialogResult {
  trash: Trash;
  delete?: boolean;
}

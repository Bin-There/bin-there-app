import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Position, StorageService } from 'src/app/shared/services/storage.service';
import {Trash} from "../trash/trash";
import {Observable} from "rxjs";

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent implements AfterViewInit {
  displayedColumns: string[] = ['latitude', 'longitude' , 'date'];
  dataSource: MatTableDataSource<Trash> = new MatTableDataSource<Trash>([]);

  constructor(private _liveAnnouncer: LiveAnnouncer, private _storageService: StorageService) {
    _storageService.ObservableTrashes.subscribe(trashes => {
      this.dataSource = new MatTableDataSource<Trash>(trashes);
    })
    this.sort = new MatSort();
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: any) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

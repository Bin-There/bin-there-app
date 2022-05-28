import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Marker, Position, StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent implements AfterViewInit {
  displayedColumns: string[] = ['latitude', 'longitude' , 'date'];
  dataSource: MatTableDataSource<Marker> = new MatTableDataSource([new Marker(new Position(0,0), new Date(564897))]);

  constructor(private _liveAnnouncer: LiveAnnouncer, private _storageService: StorageService) {
    _storageService.ObservableMarkers.subscribe(this.updateMarkers)
    this.sort = new MatSort();
    this.dataSource = new MatTableDataSource(this._storageService.Markers);
    this.dataSource.sort = this.sort;
  }

  updateMarkers(markers: Marker[]){
    this.dataSource = new MatTableDataSource(markers);
    this.dataSource.sort = this.sort;
    console.log("markers were updated in table with " + markers);
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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

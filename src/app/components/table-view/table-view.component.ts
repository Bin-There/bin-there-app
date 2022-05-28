import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { StorageService } from 'src/app/shared/services/storage.service';
import {Trash} from "../trash/trash";

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent implements AfterViewInit {
  displayedColumns: string[] = ['photo', 'type' , 'size', 'date'];
  dataSource: MatTableDataSource<Trash> = new MatTableDataSource<Trash>([]);

  constructor(private _liveAnnouncer: LiveAnnouncer, private _storageService: StorageService) {
    _storageService.ObservableTrashes.subscribe(trashes => {
      this.dataSource = new MatTableDataSource<Trash>(trashes);
      this.dataSource.sort = this.sort;
    })
    this.sort = new MatSort();
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
  }

  // /** Announce the change in sort state for assistive technology. */
  // announceSortChange(sortState: any) {
  //   // This example uses English messages. If your application supports
  //   // multiple language, you would internationalize these strings.
  //   // Furthermore, you can customize the message to add additional
  //   // details about the values being sorted.
  //   if (sortState.direction) {
  //     this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  //   } else {
  //     this._liveAnnouncer.announce('Sorting cleared');
  //   }
  // }

  getImageForType(type: string) : string {
    switch (type){
      case 'plastic' :
        return '../../../assets/bin_plastic_01.svg';
      case 'paper' :
        return '../../../assets/bin_paper_01.svg';
      case 'metal' :
        return '../../../assets/bin_metal_lnl_01.svg';
      case 'compostable' :
        return '../../../assets/bin_bio_01.svg';
    }

    return '../../../assets/bin_mix_01.svg';
  }
}

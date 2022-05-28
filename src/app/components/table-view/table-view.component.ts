import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
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
      this.dataSource.data = trashes;
      this.dataSource.sort = this.sort;
    })
    this.sort = new MatSort();
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
  }

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

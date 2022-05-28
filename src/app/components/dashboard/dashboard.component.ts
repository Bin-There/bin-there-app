import {Component, OnInit, ViewChild} from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import {MatTableDataSource} from "@angular/material/table";
import {Trash} from "../trash/trash";
import {StorageService} from "../../shared/services/storage.service";
import {MatSort} from "@angular/material/sort";
import {TrashResources} from "../trash/TrashResources";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['type' , 'size', 'date'];
  dataSource: MatTableDataSource<Trash> = new MatTableDataSource<Trash>([]);
  resources: TrashResources = new TrashResources();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(public authService: AuthService, private _storageService: StorageService) {
    _storageService.ObservableTrashes.subscribe(trashes => {
      this.dataSource.data = trashes.filter(x => x.userId === authService.userData.uid);
      this.dataSource.sort = this.sort;
    })
    this.sort = new MatSort();
  }

  ngOnInit(): void {}
}

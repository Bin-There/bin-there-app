import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { StorageService } from 'src/app/shared/services/storage.service';
import {Trash} from "../trash/trash";
import {SelectionModel} from "@angular/cdk/collections";
import {Params, Router} from "@angular/router";
import {TrashResources} from "../trash/TrashResources";

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent implements AfterViewInit {
  displayedColumns: string[] = ['select','entityType','entityStatus', 'type' , 'size', 'date'];
  dataSource: MatTableDataSource<Trash> = new MatTableDataSource<Trash>([]);
  selection:SelectionModel<Trash> = new SelectionModel<Trash>(true, []);
  resources:TrashResources = new TrashResources();

  public collectibleTypes = [
    {value: "all", viewValue: "All"},
    {value: "paper", viewValue: "Paper"},
    {value: "metal", viewValue: "Metal"},
    {value: "plastic", viewValue: "Plastic"},
    {value: "glass", viewValue: "Glass"},
    {value: "composable", viewValue: "Compostable waste"},
    {value: "debris", viewValue: "Debris"},
    {value: "oil", viewValue: "Used oil"},
    {value: "electronic_waste", viewValue: "Electronic waste"},
  ];

  public wasteType:string;

  private workingSet: Trash[] = [];

  constructor(private _liveAnnouncer: LiveAnnouncer, private _storageService: StorageService, private router: Router) {
    _storageService.ObservableTrashes.subscribe(trashes => {
      this.workingSet = trashes;
      this.updateData();
    })
    this.sort = new MatSort();
    this.selection = new SelectionModel<Trash>(true, []);
    this.wasteType = this.collectibleTypes[0].value;
  }

  updateData(){
    this.dataSource.data = this.wasteType === "all" ? this.workingSet : this.workingSet.filter(x => x.type === this.wasteType);
    this.dataSource.sort = this.sort;
  }

  onWasteFilterChanged(argument:any){
    this.updateData();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Trash): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
  }

  createRoute():void{
    console.log(this.selection.selected);
    const queryParams: Params = { selection: encodeURIComponent(JSON.stringify(this.selection.selected)) };

    this.router.navigate(
      ["/map"],
      {
        queryParams: queryParams,
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }


}

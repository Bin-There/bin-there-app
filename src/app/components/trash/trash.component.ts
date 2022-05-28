import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Trash } from './trash';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css']
})
export class TrashComponent implements OnInit {
  @Input() trash: Trash | null = null;
  @Output() edit = new EventEmitter<Trash>();

  constructor() { }

  ngOnInit(): void {
  }

}

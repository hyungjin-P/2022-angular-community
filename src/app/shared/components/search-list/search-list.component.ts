import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss'],
})
export class SearchListComponent implements OnInit {
  @Input()
  list: any[];
  @Input()
  visible: boolean;

  @Output() getSelect = new EventEmitter();
  @Output() selectedOption: any;

  @ViewChild('lists') lists: any;
  selectedOptions: any;

  constructor() {}

  ngOnInit(): void {}

  onNgModelChange(event) {
    this.visible = false;
    this.selectedOption = event;
    this.getSelect.emit();
  }
}

import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss'],
})
export class SearchListComponent implements OnInit {
  @Input()
  list: any[];

  @ViewChild('lists') lists: any;

  constructor() {}

  ngOnInit(): void {}
}

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FeedTag } from '@schemas/feed-tag';
import { PublicService } from '@services/public.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  text: string;
  tagList: FeedTag[];

  constructor(private location: Location, private publicService: PublicService) {}

  ngOnInit() {}

  getTagList() {
    this.publicService.getTagList(this.text).subscribe((data) => {
      this.tagList = data;
      console.log(this.tagList);
    });
  }

  back() {
    this.location.back();
  }
}

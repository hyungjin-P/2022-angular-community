import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FeedTag } from '@schemas/feed-tag';
import { PublicService } from '@services/public.service';
import { MagazineTag } from '@schemas/magazine-tag';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  text: string;
  feedTagList: FeedTag[];
  magazineTagList: MagazineTag[];

  constructor(private location: Location, private publicService: PublicService) {}

  ngOnInit() {}

  getTagList() {
    if (this.text !== '') {
      this.publicService.getFeedTagList(this.text).subscribe((data) => {
        this.feedTagList = data;
      });
      this.publicService.getMagazineTagList(this.text).subscribe((data) => {
        this.magazineTagList = data;
      });
    }
  }

  back() {
    this.location.back();
  }
}

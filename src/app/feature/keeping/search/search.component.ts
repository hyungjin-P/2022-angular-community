import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FeedTag } from '@schemas/feed-tag';
import { PublicService } from '@services/public.service';
import { MagazineTag } from '@schemas/magazine-tag';
import { Tag } from '@schemas/tag';
import { TagService } from '@services/tag.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  text: string;
  feedTagList: FeedTag[];
  magazineTagList: MagazineTag[];

  /*tagList: Tag[];*/
  selectLanguage: any;

  constructor(private location: Location, private publicService: PublicService /*private tagService: TagService*/) {}

  ngOnInit() {}

  getTagList() {
    if (this.text !== '') {
      /*this.tagService.getTagList(this.text).subscribe((data) => {
        this.tagList = data;
      });*/

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

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
  tagList: Tag[];
  selectLanguage: any;

  constructor(private location: Location, private tagService: TagService) {}

  ngOnInit() {}

  getTagList() {
    if (this.text !== '') {
      this.tagService.getTagList(this.text).subscribe((data) => {
        this.tagList = data;
      });
    }
  }

  back() {
    this.location.back();
  }
}

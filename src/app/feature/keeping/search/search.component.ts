import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { FeedTag } from '@schemas/feed-tag';
import { PublicService } from '@services/public.service';
import { MagazineTag } from '@schemas/magazine-tag';
import { SearchListComponent } from '@shared/components/search-list/search-list.component';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchComponent implements OnInit {
  text: string;
  feedTagList: FeedTag[];
  magazineTagList: MagazineTag[];

  /*tagList: Tag[];*/
  selectLanguage: any;
  searchListVisible: boolean = false;

  @ViewChild('searchList') searchList: SearchListComponent;

  constructor(private location: Location, private publicService: PublicService /*private tagService: TagService*/) {}

  ngOnInit() {}

  getTagList() {
    if (this.text !== '') {
      /*this.tagService.getTagList(this.text).subscribe((data) => {
        this.tagList = data;
      });*/

      this.publicService.getFeedTagList(this.text).subscribe((data) => {
        this.feedTagList = data;
        this.searchList.visible = this.feedTagList.length !== 0;
      });
      this.publicService.getMagazineTagList(this.text).subscribe((data) => {
        this.magazineTagList = data;
      });
    } else {
      this.searchList.visible = false;
    }
  }

  back() {
    this.location.back();
  }

  optionChange() {
    this.text = this.searchList.selectedOption[0].name;
  }
}

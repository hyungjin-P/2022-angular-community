import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {User} from "@schemas/user";
import {StorageService} from "@services/storage.service";
import {FeedService} from "@services/feed.service";
import {Feed} from "@schemas/feed";

@Component({
  selector: 'app-mypage-feed',
  templateUrl: './mypage-feed.component.html',
  styleUrls: ['./mypage-feed.component.scss']
})
export class MypageFeedComponent implements OnInit, AfterViewInit {

  user: User;
  feedList: any[] = [];
  emptyCount: number = 0;
  otherCount: number = 0;
  totalCount: number = 0;
  limit: number = 12; // 출력 개수

  constructor(
    private router: Router,
    private storageService: StorageService,
    private feedService: FeedService,
  ) {
    this.pushEmptyFeed(this.limit);
  }

  ngOnInit(): void {
    this.user = this.storageService.getUser();
  }

  ngAfterViewInit(): void {
    this.findMyPageFeedList(this.user.id, this.limit);
  }

  /**
   * 마이페이지 내 피드 메인 조회
   * @param userId
   * @param limit
   */
  findMyPageFeedList(userId, limit): void {
    if (this.user) {
      this.feedService
        .findMyPageFeedMain(userId, limit)
        .subscribe((data) => {
          this.feedList = data?.feedList;
          if (this.feedList.length < limit) {
            let def = limit - this.feedList.length;

            for (let i = 0; i < def; i++) {
              this.feedList.push({});
            }
          }
          this.otherCount = data?.otherCount;
          this.totalCount = data?.totalCount;

          if (this.totalCount === 0) {
            this.feedList = [];
          }
        });
    }
  }

  goRouter(path: string): void {
     this.router.navigateByUrl(path).then();
  }

  comparisonBackgroundImage(feed: Feed): any {
    return feed?.picture ? {'background-image': 'url(' + feed?.picture + ')'} : {};
  }

  comparisonUserPicture(user: User): any {
    return user?.picture ? {'background-image': 'url(' + user?.picture[0]?.url + ')'} : {};
  }

  pushEmptyFeed(limit: number): void {
    for (let i = 0; i < limit; i++) {
      this.feedList.push({});
    }
  }

}

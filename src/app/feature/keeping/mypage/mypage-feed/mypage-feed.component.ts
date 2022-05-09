import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@schemas/user';
import { StorageService } from '@services/storage.service';
import { FeedService } from '@services/feed.service';
import { Feed } from '@schemas/feed';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-mypage-feed',
  templateUrl: './mypage-feed.component.html',
  styleUrls: ['./mypage-feed.component.scss'],
})
export class MypageFeedComponent implements OnInit, AfterViewInit {
  user: User;

  feedList: any[] = [];

  emptyCount: number = 0;
  otherCount: number = 0;
  totalCount: number = 0;

  limit: number = 12; // 메인 출력 개수

  otherUserId: string;

  isFeed = true;
  viewType = 'desktop';

  constructor(
    private router: Router,
    private storageService: StorageService,
    private feedService: FeedService,
    private userService: UserService,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.user = this.storageService.getUser();

    // 라우팅 구분
    this.activateRoute.params.subscribe((params) => {
      console.log('routing event : ', params);

      if (params?.userId) {
        this.otherUserId = params.userId;
        this.userService.getUser(this.otherUserId).subscribe((user) => {
          this.user = user;
          this.findMyPageFeedList(this.user.id, this.limit);
        });
      } else {
        this.user = this.storageService.getUser();
        this.userService.getUser(this.user.id).subscribe((user) => {
          this.user = user;
          this.findMyPageFeedList(this.user.id, this.limit);
        });
      }
    });
  }

  ngAfterViewInit(): void {}

  /**
   * 마이페이지 내 피드 메인 조회
   * @param userId
   * @param limit
   */
  findMyPageFeedList(userId, limit): void {
    if (this.user) {
      this.feedService.findMyPageFeedMain(userId, limit).subscribe((data) => {
        this.feedList = data?.feedList;
        this.otherCount = data?.otherCount;
        this.totalCount = data?.totalCount;

        if (this.totalCount === 0) {
          this.feedList = [];
        }
      });
    }
  }

  goFeedDetail(): void {
    const path = this.otherUserId ? `/mypage/feed-detail/${this.otherUserId}` : '/mypage/feed-detail';

    this.router.navigateByUrl(path).then();
  }

  goRouter(path: string): void {
    this.router.navigateByUrl(path).then();
  }

  comparisonBackgroundImage(feed: Feed): any {
    return feed?.picture ? { 'background-image': 'url(' + feed?.picture + ')' } : {};
  }

  comparisonUserPicture(user: User): any {
    return user?.picture ? { 'background-image': 'url(' + user?.picture[0]?.url + ')' } : {};
  }

  pushEmptyFeed(limit: number): void {
    for (let i = 0; i < limit; i++) {
      this.feedList.push({});
    }
  }
}

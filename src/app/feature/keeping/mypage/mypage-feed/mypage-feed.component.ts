import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {GlobalService} from "@services/global.service";
import {User} from "@schemas/user";
import {StorageService} from "@services/storage.service";
import {FeedService} from "@services/feed.service";

@Component({
  selector: 'app-mypage-feed',
  templateUrl: './mypage-feed.component.html',
  styleUrls: ['./mypage-feed.component.scss']
})
export class MypageFeedComponent implements OnInit, AfterViewInit {

  feeds: any[] = [
    {text: ''},
  ];

  user: User;

  feedList: any[] = [];
  otherCount: number = 0;
  limit: number = 16;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private feedService: FeedService,
  ) {
  }

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    console.log('this user : ', this.user);
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
          console.log('find feed : ', data);
          this.feedList = data?.feedList;
          this.otherCount = data?.otherCount;
        });
    }
  }

  goRouter(path: string): void {
    this.router.navigateByUrl(path).then();
  }

}

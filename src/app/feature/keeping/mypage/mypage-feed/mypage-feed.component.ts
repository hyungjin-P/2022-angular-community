import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@schemas/user';
import { StorageService } from '@services/storage.service';
import { FeedService } from '@services/feed.service';
import { Feed } from '@schemas/feed';
import { FeedDetailModalComponent } from '@shared/components/feed-detail-modal/feed-detail-modal.component';

@Component({
  selector: 'app-mypage-feed',
  templateUrl: './mypage-feed.component.html',
  styleUrls: ['./mypage-feed.component.scss'],
})
export class MypageFeedComponent implements OnInit, AfterViewInit {
  user: User;
  ownerUser: User;

  feedList: any[] = [];

  /* 피드 상세 모달 */
  @ViewChild('feedDetailModal') feedDetailModal: FeedDetailModalComponent;
  selectFeedId: string;

  emptyCount: number = 0;
  otherCount: number = 0;
  totalCount: number = 0;

  limit: number = 12; // 메인 출력 개수

  isOtherUser: boolean = false;

  isFeed = true;
  viewType = 'desktop';

  constructor(private router: Router, private storageService: StorageService, private feedService: FeedService) {}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.changeOwner();
  }

  ngAfterViewInit(): void {}

  /* 상위 마이페이지에서 마이페이지 주인이 변경되면 이 컴포넌트의 오너도 변경 */
  public changeOwner() {
    if (this.user !== this.ownerUser) this.isOtherUser = true;
    if (this.ownerUser) {
      this.findMyPageFeedList(this.ownerUser.id, this.limit);
    }
  }

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

  goRouter(path: string): void {
    this.router.navigateByUrl(path).then();
  }

  /** background image */
  comparisonBackgroundImage(feed: Feed): any {
    return feed?.picture ? { 'background-image': 'url(' + feed?.picture + ')' } : {};
  }

  /** user profile image */
  comparisonUserPicture(user: User): any {
    return user?.picture ? { 'background-image': 'url(' + user?.picture[0]?.url + ')' } : {};
  }

  /* feed-detail modal */
  feedDetailModalShow(selectedFeedId: string) {
    this.selectFeedId = selectedFeedId;
    this.feedDetailButtonCheck();
    this.feedDetailModal.onModalShow(selectedFeedId);
  }

  feedDetailModalPrev() {
    const nowFeedIndex = this.feedList.findIndex((feed) => feed.id === this.selectFeedId);

    let prevFeedId: string = null;

    if (nowFeedIndex > 0) {
      prevFeedId = this.feedList[nowFeedIndex - 1].id;
      this.selectFeedId = prevFeedId;
      this.feedDetailButtonCheck();
      this.feedDetailModal.onChangeData(prevFeedId);
    }
  }

  feedDetailModalNext() {
    const nowFeedIndex = this.feedList.findIndex((feed) => feed.id === this.selectFeedId);
    let nextFeedId: string = null;

    if (this.feedList.length - 1 > nowFeedIndex) {
      nextFeedId = this.feedList[nowFeedIndex + 1].id;
      this.selectFeedId = nextFeedId;
      this.feedDetailButtonCheck();
      this.feedDetailModal.onChangeData(nextFeedId);
    }

    // 남은 게시물이 5개 이하 이하일 때 미리 페이지를 불러서 리스트에 추가함.
    if (this.feedList.length - nowFeedIndex < 5) {
      // this.findNextPage();
    }
  }

  feedDetailButtonCheck() {
    const nowFeedIndex = this.feedList.findIndex((feed) => feed.id === this.selectFeedId);

    this.feedDetailModal.prevDisable = false;
    this.feedDetailModal.nextDisable = false;

    if (nowFeedIndex === 0) {
      this.feedDetailModal.prevDisable = true;
    } else if (nowFeedIndex === this.feedList.length - 1) {
      this.feedDetailModal.nextDisable = true;
    }
  }
}

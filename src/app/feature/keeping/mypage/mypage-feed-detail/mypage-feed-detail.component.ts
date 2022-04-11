import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {StorageService} from "@services/storage.service";
import {FeedService} from "@services/feed.service";
import {User} from "@schemas/user";
import {Feed} from "@schemas/feed";
import {FollowService} from "@services/follow.service";


@Component({
  selector: 'app-mypage-feed-detail',
  templateUrl: './mypage-feed-detail.component.html',
  styleUrls: ['./mypage-feed-detail.component.scss']
})
export class MypageFeedDetailComponent implements OnInit, AfterViewInit {

  feedModifyMessage: any = {
    text: '피드 수정',
    subText: '정말 수정 하시겠어요?',
    confirmBtnText: '수정',
    cancelBtnText: '취소'
  }

  feedDeleteMessage: any = {
    text: '피드 삭제',
    subText: '정말 삭제 하시겠어요?',
    confirmBtnText: '삭제',
    cancelBtnText: '취소'
  }

  feedModifyModalVisible: boolean = false;
  feedDeleteModalVisible: boolean = false;

  user: User;
  feedList: any[] = [];

  /** pagination */
  page: number = 1;
  pageCount: number = 6;

  emptyCount: number = 0;
  otherCount: number = 0;
  totalCount: number = 0;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private feedService: FeedService,
    private followService: FollowService,
  ) {
    this.pushEmptyFeed(1);
  }

  ngOnInit(): void {
    this.user = this.storageService.getUser();
  }

  ngAfterViewInit(): void {
    this.findMyPageFeedList(this.user.id, this.pageCount);
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

          console.log('--- feed/detail feedList : ', this.feedList[0]);
        });
    }
  }

  onPopoverToggle(feed: Feed): boolean {
    feed.onCheckPopover = !feed.onCheckPopover;
    return feed.onCheckPopover;
  }

  onClosePopover(feed: Feed): void {
    feed.onCheckPopover = false;
  }

  errLog(event: any): void {
    console.log('errLog : ', event);
  }

  feedDeleteAccess(): void {
    this.feedModifyModalVisible = false;
  }

  modalCancel(): void {
    this.feedModifyModalVisible = false;
    this.feedDeleteModalVisible = false;
  }

  visibleFeedModifyModal() {
    this.feedModifyModalVisible = true;
  }

  visibleFeedDeleteModal() {
    this.feedDeleteModalVisible = true;
  }

  pushEmptyFeed(limit: number): void {
    for (let i = 0; i < limit; i++) {
      this.feedList.push({});
    }
  }

  comparisonUserPicture(user: User): any {
    return user?.picture ? {'background-image': 'url(' + user?.picture[0].url + ')'} : {};
  }

  /**
   * 북마크 추가/삭제
   * @param feed
   */
  toggleFeedBookmark(feed: Feed): void {
    if (this.user) {
      if (feed) {
        if (feed.isBookmark) {
          this.deleteBookmark(feed, this.user?.id);
        } else {
          this.addBookmark(feed, this.user?.id);
        }
      }
    }
  }

  /**
   * 북마크 추가
   * @param feed
   * @param userId
   */
  addBookmark(feed: Feed, userId: string): void {
    if (this.user) {
      this.feedService.addFeedBookmark({ feedId: feed?.id, userId }).subscribe(
        (data) => {
          feed.isBookmark = true;
          console.log('add bookmark data : ', data);
        },
        (error) => {
          console.log('bookmark add failed : ', error);
        }
      );
    }
  }

  /**
   * 북마크 삭제
   * @param feed
   * @param userId
   */
  deleteBookmark(feed: Feed, userId: string): void {
    if (this.user) {
      this.feedService.deleteFeedBookmark({ feedId: feed?.id, userId }).subscribe(
        (data) => {
          feed.isBookmark = false;
        },
        (error) => {
          console.log('bookmark cancel failed : ', error);
        }
      );
    }
  }

  toggleFeedLike(feed: Feed): void {
    if (this.user) {
      if (feed) {
        if (feed.isLike) {
          this.deleteFeedLike(feed, this.user?.id);
        } else {
          this.addFeedLike(feed, this.user?.id);
        }
      }
    }
  }

  addFeedLike(feed: Feed, userId: string): void {
    this.feedService
      .createFeedLike({
        feedId: feed.id,
        userId
      })
      .subscribe((data) => {
          feed.isLike = true;
          feed.likeCount += 1;
        }, (e) => {

        }
      );
  }

  deleteFeedLike(feed: Feed, userId: string): void {
    this.feedService
      .deleteFeedLike({
        feedId: feed.id,
        userId,
      })
      .subscribe(
        (v) => {
          feed.isLike = false;
          feed.likeCount -= 1;
        },
        (e) => {}
      );
  }

  refreshFeed(feed: Feed): void {

  }

}

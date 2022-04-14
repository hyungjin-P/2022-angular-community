import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {StorageService} from "@services/storage.service";
import {FeedService} from "@services/feed.service";
import {User} from "@schemas/user";
import {Feed} from "@schemas/feed";
import {FollowService} from "@services/follow.service";
import {DateUtils} from "../../../../core/utils/date.utils";
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-mypage-feed-detail',
  templateUrl: './mypage-feed-detail.component.html',
  styleUrls: ['./mypage-feed-detail.component.scss']
})
export class MypageFeedDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  feedDeleteMessage: any = {
    text: '피드 삭제',
    subText: '정말 삭제 하시겠어요?',
    confirmBtnText: '삭제',
    cancelBtnText: '취소'
  };

  deleteModalMessage: any = {
    en: {
      text: 'Delete Feed',
      subText: '정말 삭제 하시겠어요?',
      confirmBtnText: 'Delete',
      cancelBtnText: 'Cancel',
    },
    ko: {
      text: '피드 삭제',
      subText: '정말 삭제 하시겠어요?',
      confirmBtnText: '삭제',
      cancelBtnText: '취소',
    }
  };

  feedModifyModalVisible: boolean = false;
  feedDeleteModalVisible: boolean = false;

  user: User;
  feedList: any[] = [];

  /** pagination */
  page: number = 1;
  limit: number = 2;

  selectedFeed: any = {};

  @Input() nowScroll: any;

  checkFeedDetail = true;

  pageLink: any = {};

  pageMeta: any = {};

  constructor(
    private router: Router,
    private storageService: StorageService,
    private feedService: FeedService,
    private followService: FollowService,
    private dateUtils: DateUtils,
  ) {
    this.pushEmptyFeed(1);
  }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.user = this.storageService.getUser();
  }

  getMomdata(data: any): void {
    console.log('get Mom : ', data);
  }

  ngAfterViewInit(): void {
    this.findMyPageFeedList(this.user.id, this.page, this.limit);
  }

  findNextPage(): void {
    if (this.pageLink?.next) {
      this.page = this.page + 1;
      this.findMyPageFeedList(this.user.id, this.page, this.limit);
    }
  }

  /**
   * 마이페이지 내 피드 메인 조회
   * @param userId
   * @param page
   * @param limit
   */
  findMyPageFeedList(userId, page, limit): void {
    if (this.user) {
      this.feedService
        .findMyPageFeedDetail(userId, page, limit)
        .subscribe((data) => {
          this.pageMeta = data?.meta;
          this.pageLink = data?.links;

          if (this.page > 1) {
            this.feedList = [ ...this.feedList, ...data?.items ];
          } else {
            this.feedList = data?.items;
          }

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
    this.selectedFeed = {};

    console.log('modal cancel ', this.selectedFeed);
  }

  visibleFeedDeleteModal(feed: Feed) {
    this.feedDeleteModalVisible = true;
    this.selectedFeed = feed;
  }

  pushEmptyFeed(limit: number): void {
    for (let i = 0; i < limit; i++) {
      this.feedList.push({});
    }
  }

  comparisonUserPicture(user: User): any {
    return user?.picture ? {'background-image': 'url(' + user?.picture[0]?.url + ')'} : {};
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
      this.feedService
        .addFeedBookmark({feedId: feed?.id, userId})
        .subscribe((data) => {
            feed.isBookmark = true;
          },
          (error) => {
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
      this.feedService
        .deleteFeedBookmark({feedId: feed?.id, userId})
        .subscribe((data) => {
            feed.isBookmark = false;
          },
          (error) => {
          }
        );
    }
  }

  /**
   * 피드 좋아요 추가/삭제
   * @param feed
   */
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
        (e) => {
        }
      );
  }

  moveModifyFeed(feed: Feed): void {
    this.router.navigateByUrl(`/write/${feed.id}`).then();
  }

  refreshFeed(feed: Feed): void {
  }

  getTimeText(feed: Feed): string {
    return this.translateDateTime(this.translateTimeStamp(feed.createdAt));
  }

  translateTimeStamp(date: string): number {
    return this.dateUtils.getTimeStamp(date);
  }

  translateDateTime(timeStamp: number): string {
    return this.dateUtils.transTimeType(timeStamp);
  }

  deleteRealFeed(): void {
    if (this.selectedFeed) {
      this.feedService
        .deleteRealFeed(this.selectedFeed.id)
        .subscribe((data) => {
          this.modalCancel();
          console.log('data : ', data);
        });
    }
  }

}

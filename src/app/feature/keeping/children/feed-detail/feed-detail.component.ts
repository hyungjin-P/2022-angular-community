import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';

import { FeedService } from '@services/feed.service';
import { PublicService } from '@services/public.service';
import { TextService } from '@services/text.service';

import { Feed } from '@schemas/feed';
import { User } from '@schemas/user';
import { DateUtils } from '../../../../core/utils/date.utils';
import { FeedLike } from '@schemas/feed-like';
import { FollowService } from '@services/follow.service';
import { FeedCommentModalComponent } from '@shared/components/feed-comment-modal/feed-comment-modal.component';
import { OtherUserUtil } from '../../../../core/utils/other-user.util';
import { FeedLikeUserModalComponent } from '@shared/components/feed-like-user-modal/feed-like-user-modal.component';

@Component({
  selector: 'feed-detail',
  templateUrl: './feed-detail.component.html',
  styleUrls: ['./feed-detail.component.scss'],
})
export class FeedDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  variables: any;
  user: User;
  pageDate: string;

  carouselIndex: any;

  selectedFeedId: string;
  selectedFeed: Feed;

  feedList: Array<Feed>;

  subscription: Subscription;

  @ViewChild('scrollEl') scrollEl: ElementRef;

  refresh: boolean;

  moreBoxVisible: boolean;

  @ViewChild('content') content: ElementRef;

  contentViewVisible: boolean;
  contentTextLimit: number;

  selectedLanguage: string;

  feedDelete: Feed;

  onKeyEvent: boolean;

  beginTime: any;

  page: number = 1;
  limit: number = 15;
  pageMeta: any = {};
  pageLink: any = {};

  isLoginModalVisible = false;
  isConfirmModalVisible = false;

  confirmModalData: any = {};
  confirmModalStatus: string;

  /* 댓글 컴포넌트 */
  @ViewChild('commentModal') commentModal: FeedCommentModalComponent;
  /* 좋아요 컴포넌트 */
  @ViewChild('likeModal') likeModal: FeedLikeUserModalComponent;

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private globalService: GlobalService,
    private storageService: StorageService,
    private feedService: FeedService,
    private followService: FollowService,
    private publicService: PublicService,
    private textService: TextService,
    private dateUtils: DateUtils,
    public otherUserUtil: OtherUserUtil
  ) {}

  ngOnInit() {
    this.variables = this.globalService.variables;
    this.user = this.storageService.getUser();
    // UTC기준 최초 페이지 접속 시점
    this.pageDate = new Date().toISOString();

    this.carouselIndex = 1;

    this.subscription = this.activatedRoute.params.subscribe(
      (v) => {
        this.selectedFeedId = v['feed_id'];
        this.init();
      },
      (e) => {}
    );

    this.selectedLanguage = localStorage.getItem('language');
    this.contentViewVisible = true;

    this.onKeyEvent = false;

    this.beginTime = '';
  }

  ngAfterViewInit(): void {
    document.addEventListener('keyup', (e) => {
      if (e.code !== 'Escape') return;
    });

    let timer = null;
    this.scrollEl.nativeElement.addEventListener('scroll', (event) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const scrollHeight = this.scrollEl.nativeElement.scrollHeight;
        const scrollTop = this.scrollEl.nativeElement.scrollTop;
        const per = (scrollTop / scrollHeight) * 100;
        const def = scrollHeight - scrollTop;

        if (def < 1000) {
          this.findNextItemPage();
        }

        if (50 < per) {
          console.log('calc : ', per);
        }
      }, 100);
    });
  }

  // toPos(obs$) {
  //   const SUPPORT_TOUCH = 'ontouchstart' in window;
  //   return obs$.pipe(map((v: any) => (SUPPORT_TOUCH ? v.changedTouches[0].pageX : v.pageX)));
  // }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  init() {
    if (this.user) {
      this.getFeed();
    } else {
      this.getPublicFeed();
    }
    this.getFeedListUnderDate();
  }

  goBack() {
    this.router.navigateByUrl('/feed').then();
  }

  getFeed() {
    this.feedService.getFeed(this.selectedFeedId, this.user?.id).subscribe(
      (feed: Feed) => {
        this.selectedFeed = feed[0];

        if (!this.selectedFeed) {
          this.router.navigateByUrl('/feed');
        } else {
          this.beginTime = this.dateUtils.transTimeType(this.dateUtils.getTimeStamp(this.selectedFeed.uploadedAt));
          this.checkContentLimit(innerWidth);
        }
      },
      (e) => {
        this.router.navigateByUrl('/feed');
      }
    );
  }

  getPublicFeed() {
    this.publicService.getFeed(this.selectedFeedId).subscribe(
      (feed: Feed) => {
        this.selectedFeed = feed[0];

        if (!this.selectedFeed) {
          this.router.navigateByUrl('/feed').then();
        } else {
          this.beginTime = this.dateUtils.transTimeType(this.dateUtils.getTimeStamp(this.selectedFeed.uploadedAt));
          this.checkContentLimit(innerWidth);
        }
      },
      (e) => {}
    );
  }

  findNextItemPage() {
    if (this.pageLink?.next) {
      this.page = this.page + 1;
      this.getFeedListUnderDate();
    }
  }

  getFeedListUnderDate() {
    this.publicService.getFeedListUnderDate(this.page, this.limit, this.selectedFeedId).subscribe(
      (feedList: any) => {
        this.pageMeta = feedList.meta;
        this.pageLink = feedList.links;

        if (this.page > 1) {
          this.feedList = [...this.feedList, ...feedList?.items];
        } else {
          this.feedList = feedList.items;
        }
      },
      (e) => {}
    );
  }

  toggleFeedLike(feed: Feed) {
    if (this.storageService.getUser()) {
      if (feed.isLike) {
        this.feedService
          .deleteFeedLike({
            feedId: feed.id,
            userId: this.user?.id,
          })
          .subscribe(
            (v) => {
              feed.isLike = false;
              feed.likeCount -= 1;

              feed.likeUsers.forEach((user, index) => {
                if (user.user.id == this.user.id) {
                  feed.likeUsers.splice(index, 1);
                }
              });
            },
            (e) => {}
          );
      } else {
        this.feedService
          .createFeedLike({
            feedId: feed.id,
            userId: this.user?.id,
          })
          .subscribe(
            (v) => {
              feed.isLike = true;
              feed.likeCount += 1;

              const feedLike = new FeedLike(feed.id, this.user.id, this.user, '');
              if (feed.likeUsers) {
                feed.likeUsers.push(feedLike);
              } else {
                feed.likeUsers = new Array<FeedLike>(feedLike);
              }
            },
            (e) => {}
          );
      }
    } else {
      this.showLoginModal();
    }
  }

  goFeedDetail(feed: Feed) {
    this.refresh = true;
    this.router.navigateByUrl(`/feed/${feed.id}`).then(() => {
      location.reload();
    });
  }

  openMoreBox(event) {
    event.stopPropagation();

    if (this.moreBoxVisible) {
      this.closeMoreBox();
    } else {
      this.moreBoxVisible = true;
    }
  }

  closeMoreBox() {
    this.moreBoxVisible = false;
  }

  modifyFeed(feed: Feed) {
    this.router.navigateByUrl(`/write/${feed.id}`).then();
  }

  deleteFeed(feed: Feed) {
    this.feedService.deleteFeed(feed.id).subscribe(
      (v) => {
        this.router.navigateByUrl('/feed').then();
        this.feedDelete = undefined;
      },
      (e) => {}
    );
  }

  intervalCall(interval) {
    return (fn) => {
      if (this.onKeyEvent) {
        return; // 마지막 호출 후 제한된 경과시간이 지나지 않은 경우 리턴
      }
      this.onKeyEvent = true;
      fn();
      setTimeout(() => {
        this.onKeyEvent = false;
      }, interval);
    };
  }

  moreContentView() {
    this.contentViewVisible = true;
  }

  toggleFollow() {
    if (this.user) {
      if (this.selectedFeed.writer.isFollow) {
        this.removeFollow(this.user.id, this.selectedFeed.writer);
      } else {
        this.addFollow(this.user.id, this.selectedFeed.writer);
      }
    } else {
      this.showLoginModal();
    }
  }

  addFollow(fromUser: string, toUser: User) {
    if (this.user) {
      this.followService.addFollow(fromUser, toUser.id).subscribe(
        (v) => {
          toUser.isFollow = true;
          let message = this.textService.getText('follow:001');
          this.globalService.showToast(message);
        },
        (error) => {
          console.log('add follow failed : ', error);
        }
      );
    } else {
      this.showLoginModal();
    }
  }

  removeFollow(fromUser: string, toUser: User) {
    if (this.user) {
      this.followService.removeFollow(fromUser, toUser.id).subscribe(
        () => {
          toUser.isFollow = false;
          let message = this.textService.getText('follow:002');
          this.globalService.showToast(message);
        },
        (error) => {
          console.log('remove follow failed : ', error);
        }
      );
    } else {
      this.showLoginModal();
    }
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
    } else {
      this.showLoginModal();
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
          let message = this.textService.getText('scrap:001');
          this.globalService.showToast(message);
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
          let message = this.textService.getText('scrap:002');
          this.globalService.showToast(message);
        },
        (error) => {
          console.log('bookmark cancel failed : ', error);
        }
      );
    }
  }

  checkContentLimit(screenWidth: number) {
    const contentLength = this.selectedFeed.content.length;
    if (screenWidth > 992) {
      screenWidth = 600;
    }

    if (screenWidth / 13 + contentLength / 11 < contentLength) {
      this.contentViewVisible = false;
    } else {
      this.contentViewVisible = true;
    }
  }

  onResize(event: any) {
    this.checkContentLimit(event.target.innerWidth);
  }

  showLoginModal() {
    this.isLoginModalVisible = true;
  }

  loginModalConfirm() {
    this.isLoginModalVisible = false;
    this.router.navigateByUrl('/auth/login');
  }

  loginModalCancel() {
    this.isLoginModalVisible = false;
  }

  loginModalAnother() {
    this.isLoginModalVisible = false;
    this.router.navigateByUrl('/auth/registration');
  }

  showDeleteFeedConfirmModal(feed: Feed) {
    this.confirmModalStatus = 'feed';
    this.feedDelete = feed;
    if (this.selectedLanguage === 'ko') {
      this.confirmModalData = {
        isIcon: false,
        text: '피드 삭제',
        subText: `정말 삭제 하시겠어요?`,
        cancelBtnText: '아니요', // 선택
        confirmBtnText: '삭제', // 선택
      };
    } else {
      this.confirmModalData = {
        isIcon: false,
        text: 'Delete feed',
        subText: `Are you sure?`,
        cancelBtnText: 'No', // 선택
        confirmBtnText: 'Delete', // 선택
      };
    }
    this.isConfirmModalVisible = true;
  }

  confirmModalConfirm() {
    this.isConfirmModalVisible = false;
    if (this.confirmModalStatus === 'feed' && this.feedDelete) {
      this.deleteFeed(this.feedDelete);
    }
  }

  confirmModalCancel() {
    this.isConfirmModalVisible = false;
    this.feedDelete = undefined;
  }

  /**
   * 피드 댓글 컴포넌트
   * @param feed
   */
  commentModalShow(feed: Feed): void {
    this.commentModal.onModalShow(feed);
  }

  likeModalShow(feed: Feed): void {
    this.likeModal.onLikeUserModalShow(feed);
  }

  /** 다른 유저 마이페이지 이동 시 로직 */
  moveOtherUserMyPage(user: User, targetUserId): void {
    if (!this.user) {
      this.showLoginModal();
      return;
    } else {
      if (user?.id !== targetUserId) {
        this.otherUserUtil.moveOtherUserMyPage(targetUserId);
        return;
      } else {
        this.otherUserUtil.moveMyPage();
        return;
      }
    }
  }
}

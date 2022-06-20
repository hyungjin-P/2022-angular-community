import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Feed } from '@schemas/feed';
import { User } from '@schemas/user';
import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';
import { FeedService } from '@services/feed.service';
import { FollowService } from '@services/follow.service';
import { PublicService } from '@services/public.service';
import { TextService } from '@services/text.service';
import { DateUtils } from '../../../core/utils/date.utils';
import { OtherUserUtil } from '../../../core/utils/other-user.util';
import { Router } from '@angular/router';
import { FeedLike } from '@schemas/feed-like';
import { FeedCommentModalComponent } from '@shared/components/feed-comment-modal/feed-comment-modal.component';
import { FeedLikeUserModalComponent } from '@shared/components/feed-like-user-modal/feed-like-user-modal.component';
import { FeedSliderComponent } from '@shared/components/feed-slider/feed-slider.component';

declare const $;

@Component({
  selector: 'app-feed-detail-modal',
  templateUrl: './feed-detail-modal.component.html',
  styleUrls: ['./feed-detail-modal.component.scss'],
})
export class FeedDetailModalComponent implements OnInit {
  nowFeedId: string;
  feed: Feed;
  @Output() modalShow = new EventEmitter();
  @Output() prev = new EventEmitter();
  @Output() next = new EventEmitter();

  prevDisable = false;
  nextDisable = false;

  variables: any;
  user: User;
  pageDate: string;
  selectedLanguage: string;

  beginTime: any;
  moreBoxVisible: boolean;
  contentViewVisible: boolean;

  isLoginModalVisible = false;

  feedDelete: Feed;

  /* 댓글 컴포넌트 */
  @ViewChild('commentModal') commentModal: FeedCommentModalComponent;
  /* 좋아요 컴포넌트 */
  @ViewChild('likeModal') likeModal: FeedLikeUserModalComponent;
  /* 스위퍼 */
  @ViewChild('swiper') swiper: FeedSliderComponent;

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private storageService: StorageService,
    private feedService: FeedService,
    private followService: FollowService,
    private publicService: PublicService,
    private textService: TextService,
    private dateUtils: DateUtils,
    public otherUserUtil: OtherUserUtil
  ) {}

  ngOnInit(): void {
    this.variables = this.globalService.variables;
    this.user = this.storageService.getUser();
  }

  onModalShow(nowFeedId: string) {
    /* 모달 최초 설정 */
    this.moreBoxVisible = false;
    this.contentViewVisible = true;
    this.selectedLanguage = localStorage.getItem('language');
    // 슬라이드 초기화
    if (this.swiper.activeNumber > 1) {
      this.swiper.swiper.swiperRef.slideTo(0);
    }

    if (!this.pageDate) {
      // UTC기준 최초 페이지 접속 시점
      this.pageDate = new Date().toISOString();
    }

    this.nowFeedId = nowFeedId;

    if (this.user) {
      this.getFeed();
    } else {
      this.getPublicFeed();
    }

    $('#bs-feed-detail-modal').modal('show');
  }

  /* 이전 피드 게시글 부르기 */
  getPrevFeed() {
    this.closeMoreBox();
    this.prev.emit({});
    // 슬라이드 초기화
    if (this.swiper.activeNumber > 1) {
      this.swiper.swiper.swiperRef.slideTo(0);
    }
  }
  /* 다음 피드 게시글 부르기 */
  getNextFeed() {
    this.closeMoreBox();
    this.next.emit({});
    // 슬라이드 초기화
    if (this.swiper.activeNumber > 1) {
      this.swiper.swiper.swiperRef.slideTo(0);
    }
  }

  onChangeData(feedId) {
    this.moreBoxVisible = false;
    this.contentViewVisible = true;
    this.nowFeedId = feedId;

    if (this.user) {
      this.getFeed();
    } else {
      this.getPublicFeed();
    }
  }

  onCloseModal() {
    this.closeMoreBox();
    this.closeConfirmModal();
    $('#bs-feed-detail-modal').modal('hide');
  }

  /* 피드 불러오기 */
  getFeed() {
    this.feedService.getFeed(this.nowFeedId, this.user?.id).subscribe(
      (feed: Feed) => {
        this.feed = feed[0];

        if (!this.feed) {
          this.onCloseModal();
          this.router.navigateByUrl('/feed');
        } else {
          this.beginTime = this.dateUtils.transTimeType(this.dateUtils.getTimeStamp(this.feed.uploadedAt));
          this.checkContentLimit(innerWidth);
        }
      },
      (e) => {
        this.onCloseModal();
        this.router.navigateByUrl('/feed');
      }
    );
  }

  getPublicFeed() {
    this.publicService.getFeed(this.nowFeedId).subscribe(
      (feed: Feed) => {
        this.feed = feed[0];

        if (!this.feed) {
          this.onCloseModal();
          this.router.navigateByUrl('/feed').then();
        } else {
          this.beginTime = this.dateUtils.transTimeType(this.dateUtils.getTimeStamp(this.feed.uploadedAt));
          this.checkContentLimit(innerWidth);
        }
      },
      (e) => {
        this.onCloseModal();
        this.router.navigateByUrl('/feed');
      }
    );
  }

  checkContentLimit(screenWidth: number) {
    const contentLength = this.feed.content.length;
    if (screenWidth > 992) {
      screenWidth = 600;
    }

    if (screenWidth / 13 + contentLength / 11 < contentLength) {
      this.contentViewVisible = false;
    } else {
      this.contentViewVisible = true;
    }
  }

  moreContentView() {
    this.contentViewVisible = true;
  }

  /* 게시물 주인일 시, 삭제 수정에 따른 오픈 박스 생성 */
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
    this.onCloseModal();
    this.router.navigateByUrl(`/write/${feed.id}`).then();
  }

  deleteFeed(feed: Feed) {
    this.feedService.deleteFeed(feed.id).subscribe(
      (v) => {
        this.onCloseModal();
        this.router.navigateByUrl('/feed').then(() => {
          window.location.reload();
        });
        this.feedDelete = undefined;
      },
      (e) => {}
    );
  }

  /* 팔로우 동작 로직 */
  toggleFollow() {
    if (this.user) {
      if (this.feed.writer.isFollow) {
        this.removeFollow(this.user.id, this.feed.writer);
      } else {
        this.addFollow(this.user.id, this.feed.writer);
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

  toggleFeedLike(feed: Feed) {
    if (this.user) {
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

  /* 로그인 모달창 동작 */
  showLoginModal() {
    this.isLoginModalVisible = true;
  }

  loginModalConfirm() {
    this.onCloseModal();
    this.isLoginModalVisible = false;
    this.router.navigateByUrl('/auth/login');
  }

  loginModalCancel() {
    this.isLoginModalVisible = false;
  }

  loginModalAnother() {
    this.onCloseModal();
    this.isLoginModalVisible = false;
    this.router.navigateByUrl('/auth/registration');
  }

  /* 피드 삭제 모 */
  onConfirmModalShow(feed: Feed): void {
    this.feedDelete = feed;
    $('#feed-detail-confirm-modal').modal('show');
  }

  onConfirmModalConfirm(): void {
    if (this.feedDelete) {
      this.deleteFeed(this.feedDelete);
    }
  }

  closeConfirmModal(): void {
    $('#feed-detail-confirm-modal').modal('hide');
  }

  commentModalShow(feed: Feed): void {
    this.commentModal.feedDetailModal = this;
    this.commentModal.onModalShow(feed);
  }

  likeModalShow(feed: Feed): void {
    this.likeModal.feedDetailModal = this;
    this.likeModal.onLikeUserModalShow(feed);
  }

  /** 다른 유저 마이페이지 이동 시 로직 */
  moveOtherUserMyPage(user: User, targetUserId): void {
    if (!this.user) {
      this.showLoginModal();
      return;
    } else {
      this.onCloseModal();
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

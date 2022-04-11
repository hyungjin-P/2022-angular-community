import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  animationFrameScheduler,
  defer,
  fromEvent,
  Observable,
  interval,
  concat,
  of,
  scheduled,
  queueScheduler,
  asapScheduler,
  asyncScheduler,
  Subscription,
} from 'rxjs';
import {
  map,
  switchMap,
  takeUntil,
  take,
  startWith,
  tap,
  withLatestFrom,
  share,
  scan,
  takeWhile,
  mergeAll,
} from 'rxjs/operators';
import * as moment from 'moment-timezone';

import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';

import { FeedService } from '@services/feed.service';
import { PublicService } from '@services/public.service';
import { TextService } from '@services/text.service';

import { Feed } from '@schemas/feed';
import { FeedComment } from '@schemas/feed-comment';
import { User } from '@schemas/user';
import { DateUtils } from '../../../../core/utils/date.utils';
import { FeedLike } from '@schemas/feed-like';
import { FollowService } from '@services/follow.service';

@Component({
  selector: 'feed-detail',
  templateUrl: './feed-detail.component.html',
  styleUrls: ['./feed-detail.component.scss'],
})
export class FeedDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  variables: any;
  user: User;

  carouselIndex: any;

  selectedFeedId: string;
  selectedFeed: Feed;
  feedList: Array<Feed>;

  subscription: Subscription;

  @ViewChild('scroll') scroll: ElementRef;

  refresh: boolean;

  moreBoxVisible: boolean;

  @ViewChild('content') content: ElementRef;
  contentViewVisible: boolean;
  contentTextLimit: number;

  selectedLanguage: string;
  commentViewVisible: boolean;

  @ViewChild('feedCommentAddBtn') feedCommentAddBtnEl: ElementRef;
  @ViewChild('feedCommentInput') feedCommentInputEl: ElementRef;
  feedCommentInputObj: any;
  feedCommentInputStatus: string;
  feedCommentList: Array<FeedComment>;

  feedDelete: Feed;
  feedSubComment: FeedComment;
  feedModifyComment: FeedComment;
  feedDeleteComment: FeedComment;

  feedSubCommentListViewObj: any;
  feedSubCommentListObj: any;

  likedViewVisible: boolean;

  likeUserList: Array<FeedLike>;

  onKeyEvent: boolean;

  beginTime: any;

  page: number = 1;
  limit: number = 20;

  likePage: number = 1;
  likeLimit: number = 15;

  commentPage: number = 1;
  commentLimit: number = 15;

  subCommentNumber: number = 0;

  subCommentPages: Array<number>;
  subCommentLimits: Array<number>;

  comment_info: string;
  commentInfoVisible: boolean;

  isLoginModalVisible = false;
  isConfirmModalVisible = false;

  confirmModalData = {};
  confirmModalStatus: string;

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
    private dateUtils: DateUtils
  ) {}

  ngOnInit() {
    this.variables = this.globalService.variables;
    this.user = this.storageService.getUser();

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
    this.commentViewVisible = false;
    this.feedCommentInputObj = '';
    this.feedCommentInputStatus = '';
    this.feedCommentList = [];
    this.feedSubComment = undefined;
    this.feedSubCommentListViewObj = {};
    this.feedSubCommentListObj = {};
    this.likedViewVisible = false;

    this.likeUserList = [];

    this.onKeyEvent = false;

    this.beginTime = '';

    this.commentInfoVisible = false;
  }

  ngAfterViewInit(): void {
    document.addEventListener('keyup', (e) => {
      if (e.code !== 'Escape') return;

      if (this.commentViewVisible) {
        this.hideCommentView();
      } else if (this.likedViewVisible) {
        this.hideLikedView();
      }
    });
  }

  toPos(obs$) {
    const SUPPORT_TOUCH = 'ontouchstart' in window;
    return obs$.pipe(map((v: any) => (SUPPORT_TOUCH ? v.changedTouches[0].pageX : v.pageX)));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  init() {
    if (this.user) {
      this.getFeed();
      this.getFeedList();
    } else {
      this.getPublicFeed();
      this.getPublicFeedList();
    }
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
          this.beginTime = this.dateUtils.transTimeType(this.dateUtils.getTimeStamp(this.selectedFeed.createdAt));
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
          this.router.navigateByUrl('/feed');
        } else {
          this.beginTime = this.dateUtils.transTimeType(this.dateUtils.getTimeStamp(this.selectedFeed.createdAt));
          this.checkContentLimit(innerWidth);
        }
      },
      (e) => {}
    );
  }

  getFeedList() {
    this.feedService.getFeedList(this.page, this.limit, this.user?.id).subscribe(
      (feedList: any) => {
        this.feedList = feedList.items;
      },
      (e) => {}
    );
  }
  getPublicFeedCommentList() {
    this.publicService.getFeedCommentList(this.commentPage, this.commentLimit, this.selectedFeed.id).subscribe(
      (feedCommentList: Array<FeedComment>) => {
        for (let i = 0; i < feedCommentList.length; i++) {
          feedCommentList[i].begin_timestamp = this.dateUtils.getTimeStamp(feedCommentList[i].createdAt);
          feedCommentList[i].begin_time_text = this.dateUtils.transTimeType(feedCommentList[i].begin_timestamp);

          if (feedCommentList[i].sub_comment_count !== 0) {
            // 댓글 더보기 기본 동작으로 변경 22.02.11
            this.feedSubCommentListViewObj[feedCommentList[i].id] = true;
            feedCommentList[i].page = 1;
            feedCommentList[i].limit = 15;

            this.getPublicFeedSubCommentList(1, 15, feedCommentList[i].id);
          }
        }
        this.feedCommentList = feedCommentList;
      },
      (e) => {}
    );
  }

  getPublicFeedSubCommentList(page: number, limit: number, feedCommentId: string) {
    this.publicService.getFeedSubCommentList(page, limit, feedCommentId).subscribe(
      (feedCommentList: Array<FeedComment>) => {
        this.feedSubCommentListObj[feedCommentId] = feedCommentList;

        this.feedSubCommentListObj[feedCommentId].forEach((feedSubComment) => {
          feedSubComment.begin_timestamp = this.dateUtils.getTimeStamp(feedSubComment.createdAt);
          feedSubComment.begin_time_text = this.dateUtils.transTimeType(feedSubComment.begin_timestamp);
        });
        // this.feedSubCommentListObj[feedCommentId].nativeElement.style = 'margin-top: 12px';
      },
      (e) => {}
    );
  }

  getFeedCommentList() {
    this.feedService
      .getFeedCommentList(this.commentPage, this.commentLimit, this.selectedFeed.id, this.user?.id)
      .subscribe(
        (feedCommentList: Array<FeedComment>) => {
          for (let i = 0; i < feedCommentList.length; i++) {
            feedCommentList[i].begin_timestamp = this.dateUtils.getTimeStamp(feedCommentList[i].createdAt);
            feedCommentList[i].begin_time_text = this.dateUtils.transTimeType(feedCommentList[i].begin_timestamp);

            if (feedCommentList[i].sub_comment_count !== 0) {
              // 댓글 더보기 기본 동작으로 변경 22.02.11
              this.feedSubCommentListViewObj[feedCommentList[i].id] = true;
              feedCommentList[i].page = 1;
              feedCommentList[i].limit = 15;

              this.getFeedSubCommentList(1, 15, feedCommentList[i].id);
            }
          }
          this.feedCommentList = feedCommentList;
        },
        (e) => {}
      );
  }

  getFeedSubCommentList(page: number, limit: number, feedCommentId: string) {
    this.feedService.getFeedSubCommentList(page, limit, feedCommentId, this.user?.id).subscribe(
      (feedCommentList: Array<FeedComment>) => {
        this.feedSubCommentListObj[feedCommentId] = feedCommentList;

        this.feedSubCommentListObj[feedCommentId].forEach((feedSubComment) => {
          feedSubComment.begin_timestamp = this.dateUtils.getTimeStamp(feedSubComment.createdAt);
          feedSubComment.begin_time_text = this.dateUtils.transTimeType(feedSubComment.begin_timestamp);
        });
        // this.feedSubCommentListObj[feedCommentId].nativeElement.style = 'margin-top: 12px';
      },
      (e) => {}
    );
  }

  getPublicFeedList() {
    this.publicService.getFeedList(this.page, this.limit).subscribe(
      (feedList: any) => {
        this.feedList = feedList.items;
      },
      (e) => {}
    );
  }

  getFeedLikeList() {
    this.feedService.getFeedLikeList(this.likePage, this.likeLimit, this.selectedFeed.id, this.user?.id).subscribe(
      (likeUserList: any) => {
        this.likeUserList = likeUserList.items;
      },
      (e) => {}
    );
  }

  getPublicFeedLikeList() {
    this.publicService.getFeedLikeList(this.likePage, this.likeLimit, this.selectedFeed.id).subscribe(
      (likeUserList: any) => {
        this.likeUserList = likeUserList.items;
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

              this.selectedFeed.likeUsers.forEach((user, index) => {
                if (user.user.id == this.user.id) {
                  this.selectedFeed.likeUsers.splice(index, 1);
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

              let addLike = new FeedLike(this.selectedFeed.id, this.user.id, this.user, new Date().toString());

              let newLikeUsers = [addLike].concat(this.selectedFeed.likeUsers);
              this.selectedFeed.likeUsers = newLikeUsers;
            },
            (e) => {}
          );
      }
    } else {
      this.showLoginModal();
    }
  }

  // 하단 피드 목록 좋아요
  feedLike(feed: Feed) {
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
              feed.likeUsers = feed.likeUsers.filter((feedLike) => feedLike.userId !== this.user.id);
              feed.likeCount -= 1;
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
              const feedLike = new FeedLike(feed.id, this.user.id, this.user, '');
              feed.likeUsers.push(feedLike);
              feed.likeCount += 1;
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
    this.router.navigateByUrl(`/feed/${feed.id}`);
    try {
      this.scroll.nativeElement.scrollTop = 0;
    } catch (err) {}
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
    this.router.navigateByUrl(`/write/${feed.id}`);
  }

  deleteFeed(feed: Feed) {
    this.feedService.deleteFeed(feed.id).subscribe(
      (v) => {
        this.router.navigateByUrl('/feed');
        this.feedDelete = undefined;
      },
      (e) => {}
    );
  }

  showCommentView() {
    if (this.storageService.getUser()) {
      this.getFeedCommentList();
    } else {
      this.getPublicFeedCommentList();
    }
    this.commentViewVisible = true;
  }

  hideCommentView() {
    this.clearCommentInput();
    this.commentViewVisible = false;
  }

  clearCommentInput() {
    this.feedCommentInputObj = '';
    this.feedCommentInputEl.nativeElement.style = 'height: 40px';
  }

  onClickCommentInput() {
    if (!this.user) {
      this.showLoginModal();
    }
  }

  autosizeCommentInput(event) {
    event.target.style.height = '0px';
    event.target.style.height = event.target.scrollHeight + 'px';
  }

  confirmComment() {
    if (!this.feedCommentInputObj) {
      return;
    }
    if (!this.user) {
      this.showLoginModal();
    }

    if (this.feedCommentInputStatus === 'sub') {
      this.createSubComment(this.feedSubComment);
    } else if (this.feedCommentInputStatus === 'modify') {
      this.modifyComment(this.feedModifyComment);
    } else {
      this.createParentComment();
    }
  }

  createSubComment(parentFeedComment: FeedComment) {
    if (!this.feedCommentInputObj) {
      return;
    }

    this.feedService
      .createFeedComment({
        feedId: this.selectedFeed.id,
        userId: this.user?.id,
        parentId: this.feedSubComment.parentId,
        text: this.feedCommentInputObj,
      })
      .subscribe(
        (feedComment: FeedComment) => {
          if (this.comment_info) {
            this.feedService
              .addFeedCommentMention({
                feedCommentId: feedComment.id,
                mentionUserId: parentFeedComment.writer.id,
              })
              .subscribe(() => {
                this.hideCommentInput();
                this.selectedFeed.commentCount++;
                parentFeedComment.sub_comment_count++;
                this.getFeedCommentList();
              });
          }
        },
        (e) => {}
      );
  }

  modifyComment(modifyComment: FeedComment) {
    if (!this.feedCommentInputObj || this.feedCommentInputObj === modifyComment.text) {
      return;
    }

    this.feedService.modifyFeedComment(modifyComment.id, this.feedCommentInputObj).subscribe(
      (feedComment: FeedComment) => {
        this.feedModifyComment.text = feedComment.text;
        this.hideCommentInput();
      },
      (e) => {}
    );
  }

  createParentComment() {
    this.feedService
      .createFeedComment({ feedId: this.selectedFeed.id, userId: this.user.id, text: this.feedCommentInputObj })
      .subscribe(
        (feedComment: FeedComment) => {
          this.clearCommentInput();
          this.getFeedCommentList();
        },
        (e) => {}
      );
  }

  showSubCommentInput(feedComment: FeedComment, parentComment?: FeedComment) {
    // this.feedSubCommentInputValueObj[feedCommentId] = '@' + this.feedSubCommentListObj[feedCommentId].writer
    if (!this.user) {
      this.showLoginModal();
      return;
    }

    this.feedCommentInputStatus = 'sub';
    this.feedSubComment = feedComment;
    if (parentComment) {
      this.feedSubComment.parentId = parentComment.id;
    } else {
      this.feedSubComment.parentId = feedComment.id;
    }

    if (this.selectedLanguage === 'ko') {
      if (feedComment.writer.nickname) {
        this.comment_info = feedComment.writer.nickname + '님에게 답글 남기는 중';
      } else {
        this.comment_info = feedComment.writer.email.split('@')[0] + '님에게 답글 남기는 중';
      }
    } else {
      if (feedComment.writer.nickname) {
        this.comment_info = 'Reply to ' + feedComment.writer.nickname;
      } else {
        this.comment_info = 'Reply to ' + feedComment.writer.email.split('@')[0];
      }
    }

    this.commentInfoVisible = true;
    this.feedCommentInputEl.nativeElement.focus();
  }

  hideCommentInput() {
    if (this.feedCommentInputStatus === 'sub' || this.feedCommentInputStatus === 'modify') {
      this.feedCommentInputStatus = '';
      this.commentInfoVisible = false;
      this.feedSubComment = undefined;
      this.feedModifyComment = undefined;
    }
    this.clearCommentInput();
  }

  showSubCommentList(feedCommentNumber: number, feedCommentId: string) {
    if (this.feedSubCommentListViewObj[feedCommentId]) {
      this.hideSubCommentList(feedCommentId);
    } else {
      this.feedSubCommentListViewObj[feedCommentId] = true;
      if (this.user) {
        this.getFeedSubCommentList(
          this.feedCommentList[feedCommentNumber].page,
          this.feedCommentList[feedCommentNumber].limit,
          feedCommentId
        );
      } else {
        this.getPublicFeedSubCommentList(
          this.feedCommentList[feedCommentNumber].page,
          this.feedCommentList[feedCommentNumber].limit,
          feedCommentId
        );
      }
    }
  }

  hideSubCommentList(feedCommentId: string) {
    this.feedSubCommentListViewObj[feedCommentId] = false;
    this.feedSubCommentListObj[feedCommentId] = [];
  }

  showModifyCommentInput(feedComment: FeedComment) {
    this.feedCommentInputStatus = 'modify';
    if (this.selectedLanguage === 'ko') {
      this.comment_info = '댓글을 수정하는 중';
    } else {
      this.comment_info = 'modify comment';
    }
    this.feedModifyComment = feedComment;
    this.feedCommentInputObj = feedComment.text;
    this.commentInfoVisible = true;
    this.feedCommentInputEl.nativeElement.focus();
  }

  deleteComment(feedComment: FeedComment) {
    this.feedService.deleteFeedComment(feedComment.id).subscribe(
      (v) => {
        this.selectedFeed.commentCount--;
        // if (feedComment.parent_id) {
        //   parentFeedComment.sub_comment_count--;
        // }
        feedComment.deletedAt = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        this.feedDeleteComment = undefined;
      },
      (e) => {}
    );
  }

  feedCommentLike(feedComment: FeedComment) {
    if (this.storageService.getUser()) {
      if (feedComment.isLike) {
        this.feedService.deleteFeedCommentLike(feedComment.id, this.user?.id).subscribe(
          (v) => {
            feedComment.isLike = false;
            feedComment.likeCount = v;
          },
          (e) => {}
        );
      } else {
        this.feedService.createFeedCommentLike(feedComment.id, this.user?.id).subscribe(
          (v) => {
            feedComment.isLike = true;
            feedComment.likeCount = v;
          },
          (e) => {}
        );
      }
    } else {
      this.showLoginModal();
    }
  }

  showLikedView() {
    if (this.storageService.getUser()) {
      this.getFeedLikeList();
    } else {
      this.getPublicFeedLikeList();
    }
    this.likedViewVisible = true;
  }

  hideLikedView() {
    this.likedViewVisible = false;
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

  prevCarouselIndex() {
    this.carouselIndex -= 1;
    if (this.carouselIndex < 1) this.carouselIndex = this.selectedFeed.pictures.length;
  }

  nextCarouselIndex() {
    this.carouselIndex += 1;
    if (this.carouselIndex > this.selectedFeed.pictures.length) this.carouselIndex = 1;
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

  showDeleteCommentConfirmModal(feedComment: FeedComment) {
    this.confirmModalStatus = 'comment';
    this.feedDeleteComment = feedComment;
    if (this.selectedLanguage === 'ko') {
      this.confirmModalData = {
        isIcon: false,
        text: '댓글 삭제',
        subText: `정말 삭제 하시겠어요?`,
        cancelBtnText: '아니요', // 선택
        confirmBtnText: '삭제', // 선택
      };
    } else {
      this.confirmModalData = {
        isIcon: false,
        text: 'Delete comment',
        subText: `Are you sure?`,
        cancelBtnText: 'No', // 선택
        confirmBtnText: 'Delete', // 선택
      };
    }
    this.isConfirmModalVisible = true;
  }
  confirmModalConfirm() {
    this.isConfirmModalVisible = false;
    if (this.confirmModalStatus === 'comment' && this.feedDeleteComment) {
      this.deleteComment(this.feedDeleteComment);
    } else if (this.confirmModalStatus === 'feed' && this.feedDelete) {
      this.deleteFeed(this.feedDelete);
    }
  }
  confirmModalCancel() {
    this.isConfirmModalVisible = false;
    this.feedDeleteComment = undefined;
    this.feedDelete = undefined;
  }
}

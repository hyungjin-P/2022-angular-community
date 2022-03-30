import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '@schemas/user';
import { Feed } from '@schemas/feed';
import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';
import { FeedService } from '@services/feed.service';
import { Router } from '@angular/router';
import { FollowService } from '@services/follow.service';
import { TextService } from '@services/text.service';
import { FeedLike } from '@schemas/feed-like';
import { FeedComment } from '@schemas/feed-comment';
import { DateUtils } from '../../../../core/utils/date.utils';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-feed-follow',
  templateUrl: './feed-follow.component.html',
  styleUrls: ['./feed-follow.component.scss'],
})
export class FeedFollowComponent implements OnInit {
  variables: any;
  user: User;
  selectedLanguage: string;

  feedList: Feed[];
  selectedFeed: Feed;

  likedViewVisible: boolean;
  likeUserList: Array<FeedLike>;

  commentViewVisible: boolean;
  @ViewChild('feedCommentAddBtn') feedCommentAddBtnEl: ElementRef;
  @ViewChild('feedCommentInput') feedCommentInputEl: ElementRef;
  feedCommentInputObj: any;
  feedCommentInputStatus: string;
  feedCommentList: Array<FeedComment>;

  feedSubComment: FeedComment;

  feedSubCommentListViewObj: any;
  feedSubCommentListObj: any;

  comment_mention_info: string;
  mentionInfoVisible: boolean;

  page: number = 1;
  limit: number = 20;

  likePage: number = 1;
  likeLimit: number = 15;

  commentPage: number = 1;
  commentLimit: number = 15;

  tabMenu: any[] = [
    {
      tabName: 'all',
      languageCode: 'common.nav.feed-tab.all',
      link: '/feed',
      description: '피드 전체',
      sort: 0,
    },
    {
      tabName: 'follow',
      languageCode: 'common.nav.feed-tab.following',
      link: '/feed/follow',
      description: '피드 팔로우',
      sort: 1,
    },
  ];
  nowTab: '';

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private storageService: StorageService,
    private feedService: FeedService,
    private followService: FollowService,
    private textService: TextService,
    private dateUtils: DateUtils
  ) {}

  ngOnInit(): void {
    this.variables = this.globalService.variables;
    this.user = this.storageService.getUser();
    this.selectedLanguage = localStorage.getItem('language');
    this.nowTab = this.tabMenu[1].tabName;

    this.commentViewVisible = false;
    this.feedCommentInputObj = '';
    this.feedCommentInputStatus = '';
    this.feedCommentList = [];
    this.feedSubComment = undefined;
    this.feedSubCommentListViewObj = {};
    this.feedSubCommentListObj = {};
    this.likedViewVisible = false;
    this.likeUserList = [];
    this.mentionInfoVisible = false;

    this.getFeedFollowList();
  }

  private getFeedFollowList() {
    this.feedService.getFeedFollowList(this.page, this.limit, this.user.id).subscribe((feedList) => {
      this.feedList = feedList.items;

      for (let feed of this.feedList) {
        feed.begin_timestamp = this.dateUtils.getTimeStamp(feed.createdAt);
        feed.begin_time_text = this.dateUtils.transTimeType(feed.begin_timestamp);
        feed.writer.isFollow = true;
        feed.contentViewVisible = true;
        feed.carouselIndex = 1;
      }
      console.log(this.feedList);
    });
  }

  toggleFollow(feed: Feed) {
    if (this.user) {
      if (feed.writer.isFollow) {
        this.removeFollow(this.user.id, feed.writer);
      } else {
        this.addFollow(this.user.id, feed.writer);
      }
    } else {
      this.router.navigateByUrl('/auth/login');
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
      this.router.navigateByUrl('/auth/login');
    }
  }

  removeFollow(fromUser: string, toUser: User) {
    if (this.user) {
      this.followService.removeFollow(fromUser, toUser.id).subscribe(
        () => {
          toUser.isFollow = false;
          let message = this.textService.getText('follow:002');
          this.globalService.showToast(message);
          this.getFeedFollowList();
        },
        (error) => {
          console.log('remove follow failed : ', error);
        }
      );
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }

  feedLike(feed: Feed) {
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
  }

  /**
   * 북마크 추가/삭제
   * @param feed
   */
  toggleFeedBookmark(feed: Feed): void {
    if (feed) {
      if (feed.isBookmark) {
        this.deleteBookmark(feed, this.user?.id);
      } else {
        this.addBookmark(feed, this.user?.id);
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
      this.feedService.deleteFeedBookmark({ feedId: feed.id, userId }).subscribe(
        (data) => {
          feed.isBookmark = false;
        },
        (error) => {
          console.log('bookmark cancel failed : ', error);
        }
      );
    }
  }

  showLikedView(feed: Feed) {
    this.getFeedLikeList(feed);
  }

  getFeedLikeList(feed: Feed) {
    this.feedService.getFeedLikeList(this.likePage, this.likeLimit, feed.id, this.user.id).subscribe(
      (likeUserList: any) => {
        this.selectedFeed = feed;
        this.likeUserList = likeUserList.items;
      },
      (e) => {}
    );
  }

  showCommentView(feed: Feed) {
    this.getFeedCommentList(feed);
    this.commentViewVisible = true;
  }

  hideCommentView() {
    this.clearCommentInput();
    this.commentViewVisible = false;
  }

  clearCommentInput() {
    this.feedCommentInputObj = '';
  }

  getFeedCommentList(feed: Feed) {
    this.feedService.getFeedCommentList(this.commentPage, this.commentLimit, feed.id, this.user?.id).subscribe(
      (feedCommentList: Array<FeedComment>) => {
        this.selectedFeed = feed;
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
        console.log(feedCommentList);
      },
      (e) => {}
    );
  }

  getFeedSubCommentList(page: number, limit: number, feedCommentId: string) {
    this.feedService.getFeedSubCommentList(page, limit, feedCommentId, this.user?.id).subscribe(
      (feedCommentList: Array<FeedComment>) => {
        this.feedSubCommentListObj[feedCommentId] = feedCommentList;
        // this.feedSubCommentListObj[feedCommentId].nativeElement.style = 'margin-top: 12px';
      },
      (e) => {}
    );
  }

  moreContentView(feed: Feed) {
    feed.contentViewVisible = true;
  }

  createComment() {
    if (!this.feedCommentInputObj) {
      return;
    }
    if (!this.user) {
      this.router.navigateByUrl('/auth/login');
    }

    if (this.feedCommentInputStatus === 'sub') {
      this.createSubComment(this.feedSubComment);
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
          if (this.comment_mention_info) {
            this.feedService
              .addFeedCommentMention({
                feedCommentId: feedComment.id,
                mentionUserId: parentFeedComment.writer.id,
              })
              .subscribe(() => {
                this.hideSubCommentInput();
                this.selectedFeed.commentCount++;
                parentFeedComment.sub_comment_count++;
                this.getFeedCommentList(this.selectedFeed);
              });
          }
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
          this.getFeedCommentList(this.selectedFeed);
        },
        (e) => {}
      );
  }

  showSubCommentInput(feedComment: FeedComment, parentComment?: FeedComment) {
    // this.feedSubCommentInputValueObj[feedCommentId] = '@' + this.feedSubCommentListObj[feedCommentId].writer
    this.feedCommentInputStatus = 'sub';
    this.feedSubComment = feedComment;
    if (parentComment) {
      this.feedSubComment.parentId = parentComment.id;
    } else {
      this.feedSubComment.parentId = feedComment.id;
    }

    if (feedComment.writer.nickname) {
      this.comment_mention_info = feedComment.writer.nickname + '님에게 답글 남기는 중';
    } else {
      this.comment_mention_info = feedComment.writer.email.split('@')[0] + '님에게 답글 남기는 중';
    }
    this.mentionInfoVisible = true;
    this.feedCommentInputEl.nativeElement.focus();
  }

  hideSubCommentInput() {
    if (this.feedCommentInputStatus === 'sub') {
      this.feedCommentInputStatus = '';
      this.mentionInfoVisible = false;
      this.feedSubComment = undefined;
      this.feedCommentInputObj = '';
    }
  }

  showSubCommentList(feedCommentNumber: number, feedCommentId: string) {
    if (this.feedSubCommentListViewObj[feedCommentId]) {
      this.hideSubCommentList(feedCommentId);
    } else {
      this.feedSubCommentListViewObj[feedCommentId] = true;
      this.getFeedSubCommentList(
        this.feedCommentList[feedCommentNumber].page,
        this.feedCommentList[feedCommentNumber].limit,
        feedCommentId
      );
    }
  }

  hideSubCommentList(feedCommentId: string) {
    this.feedSubCommentListViewObj[feedCommentId] = false;
    this.feedSubCommentListObj[feedCommentId] = [];
  }

  deleteComment(feedComment: FeedComment, parentFeedComment: FeedComment) {
    this.feedService.deleteFeedComment(feedComment.id).subscribe(
      (v) => {
        this.selectedFeed.commentCount--;
        // if (feedComment.parent_id) {
        //   parentFeedComment.sub_comment_count--;
        // }
        feedComment.deletedAt = moment().utc().format('YYYY-MM-DD HH:mm:ss');
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
      this.router.navigateByUrl('/auth/login');
    }
  }

  hideLikedView() {
    this.likedViewVisible = false;
  }

  nextCarouselIndex(feed: Feed) {
    feed.carouselIndex += 1;
    if (feed.carouselIndex > feed.pictures.length) feed.carouselIndex = 1;
  }
  prevCarouselIndex(feed: Feed) {
    feed.carouselIndex -= 1;
    if (feed.carouselIndex < 1) feed.carouselIndex = feed.pictures.length;
  }

  moveTab(link: string) {
    this.router.navigateByUrl(link);
  }
}

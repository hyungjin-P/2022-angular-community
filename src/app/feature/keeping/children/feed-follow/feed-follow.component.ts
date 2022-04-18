import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '@schemas/user';
import { Feed } from '@schemas/feed';
import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';
import { FeedService } from '@services/feed.service';
import { ActivatedRoute, Router } from '@angular/router';
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
export class FeedFollowComponent implements OnInit, AfterViewInit {
  variables: any;
  user: User;
  selectedLanguage: string;

  @ViewChild('scrollEl') scrollEl: ElementRef;
  feedList: Feed[];
  selectedFeed: Feed;

  likedViewVisible: boolean;
  @ViewChild('likeScrollEl') likeScrollEl: ElementRef;
  likeUserList: Array<FeedLike>;

  commentViewVisible: boolean;
  @ViewChild('commentScrollEl') commentScrollEl: ElementRef;

  @ViewChild('feedCommentAddBtn') feedCommentAddBtnEl: ElementRef;
  @ViewChild('feedCommentInput') feedCommentInputEl: ElementRef;
  feedCommentInputObj: any;
  feedCommentInputStatus: string;
  feedCommentList: Array<FeedComment>;

  feedSubComment: FeedComment;
  feedModifyComment: FeedComment;
  feedDeleteComment: FeedComment;

  feedSubCommentListViewObj: any;
  feedSubCommentListObj: any;

  comment_info: string;
  commentInfoVisible: boolean;

  page: number = 1;
  limit: number = 5;
  pageMeta: any = {};
  pageLink: any = {};

  likePage: number = 1;
  likeLimit: number = 15;
  likePageMeta: any = {};
  likePageLink: any = {};

  commentPage: number = 1;
  commentLimit: number = 15;
  commentPageMeta: any = {};
  commentPageLink: any = {};

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

  isConfirmModalVisible = false;

  confirmModalData = {};
  confirmModalStatus: string;

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private storageService: StorageService,
    private feedService: FeedService,
    private followService: FollowService,
    private textService: TextService,
    private dateUtils: DateUtils,
    private activateRoute: ActivatedRoute
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
    this.commentInfoVisible = false;

    this.getFeedFollowList();

    console.log(this.activateRoute);
  }

  ngAfterViewInit(): void {
    let timer = null;
    this.scrollEl.nativeElement.addEventListener('scroll', (event) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const scrollHeight = this.scrollEl.nativeElement.scrollHeight;
        const scrollTop = this.scrollEl.nativeElement.scrollTop;
        const per = (scrollTop / scrollHeight) * 100;
        const def = scrollHeight - scrollTop;

        if (def < 1000) {
          this.findNextPage();
        }

        if (50 < per) {
          console.log('calc : ', per);
        }
      }, 100);
    });

    this.commentScrollEl.nativeElement.addEventListener('scroll', (event) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const scrollHeight = this.commentScrollEl.nativeElement.scrollHeight;
        const scrollTop = this.commentScrollEl.nativeElement.scrollTop;
        const per = (scrollTop / scrollHeight) * 100;
        const def = scrollHeight - scrollTop;

        if (def < 700) {
          this.findNextCommentPage();
        }

        if (50 < per) {
          console.log('calc comment : ', per);
        }
      }, 100);
    });

    this.likeScrollEl.nativeElement.addEventListener('scroll', (event) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const scrollHeight = this.likeScrollEl.nativeElement.scrollHeight;
        const scrollTop = this.likeScrollEl.nativeElement.scrollTop;
        const per = (scrollTop / scrollHeight) * 100;
        const def = scrollHeight - scrollTop;

        if (def < 700) {
          this.findNextLikePage();
        }

        if (50 < per) {
          console.log('calc comment : ', per);
        }
      }, 100);
    });
  }

  findNextPage() {
    if (this.pageLink?.next) {
      this.page = this.page + 1;
      this.getFeedFollowList();
    }
  }

  private getFeedFollowList() {
    this.feedService.getFeedFollowList(this.page, this.limit, this.user.id).subscribe((feedList) => {
      this.pageMeta = feedList.meta;
      this.pageLink = feedList.links;

      if (this.page > 1) {
        this.feedList = [...this.feedList, ...feedList?.items];
      } else {
        this.feedList = feedList.items;
      }

      for (let feed of this.feedList) {
        feed.begin_timestamp = this.dateUtils.getTimeStamp(feed.createdAt);
        feed.begin_time_text = this.dateUtils.transTimeType(feed.begin_timestamp);
        feed.writer.isFollow = true;
        feed.contentViewVisible = true;
      }
    });
  }

  toggleFollow(feed: Feed) {
    if (feed.writer.isFollow) {
      this.removeFollow(this.user.id, feed.writer);
    } else {
      this.addFollow(this.user.id, feed.writer);
    }
  }

  addFollow(fromUser: string, toUser: User) {
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
  }

  removeFollow(fromUser: string, toUser: User) {
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
    this.likePage = 1;
    this.getFeedLikeList(feed);
    this.likedViewVisible = true;
  }

  findNextLikePage() {
    if (this.likePageLink?.next) {
      this.likePage = this.likePage + 1;
      this.getFeedLikeList(this.selectedFeed);
    }
  }

  getFeedLikeList(feed: Feed) {
    this.feedService.getFeedLikeList(this.likePage, this.likeLimit, feed.id, this.user.id).subscribe(
      (likeUserList: any) => {
        this.selectedFeed = feed;
        this.likePageMeta = likeUserList.meta;
        this.likePageLink = likeUserList.links;

        if (this.likePage > 1) {
          this.likeUserList = [...this.likeUserList, ...likeUserList?.items];
        } else {
          this.likeUserList = likeUserList.items;
        }
      },
      (e) => {}
    );
  }

  showCommentView(feed: Feed) {
    this.commentPage = 1;
    this.getFeedCommentList(feed);
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

  findNextCommentPage() {
    if (this.commentPageLink?.next) {
      this.commentPage = this.commentPage + 1;
      this.getFeedCommentList(this.selectedFeed);
    }
  }

  getFeedCommentList(feed: Feed) {
    this.feedService.getFeedCommentList(this.commentPage, this.commentLimit, feed.id, this.user?.id).subscribe(
      (feedCommentList: any) => {
        this.selectedFeed = feed;

        this.commentPageMeta = feedCommentList.meta;
        this.commentPageLink = feedCommentList.links;

        if (this.commentPage > 1) {
          this.feedCommentList = [...this.feedCommentList, ...feedCommentList?.items];
        } else {
          this.feedCommentList = feedCommentList.items;
        }

        this.feedCommentList.forEach((feedComment) => {
          feedComment.begin_timestamp = this.dateUtils.getTimeStamp(feedComment.createdAt);
          feedComment.begin_time_text = this.dateUtils.transTimeType(feedComment.begin_timestamp);

          if (feedComment.sub_comment_count !== 0) {
            // 댓글 더보기 기본 동작으로 변경 22.02.11
            this.feedSubCommentListViewObj[feedComment.id] = true;
            feedComment.page = 1;
            feedComment.limit = 15;

            this.getFeedSubCommentList(feedComment.page, feedComment.limit, feedComment.id);
          }
        });
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

  moreContentView(feed: Feed) {
    feed.contentViewVisible = true;
  }

  autosizeCommentInput(event) {
    event.target.style.height = '0px';
    event.target.style.height = event.target.scrollHeight + 'px';
  }

  confirmComment() {
    if (!this.feedCommentInputObj) {
      return;
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
                this.getFeedCommentList(this.selectedFeed);
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
  }

  hideLikedView() {
    this.likedViewVisible = false;
  }

  moveTab(link: string) {
    this.router.navigateByUrl(link);
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
    }
  }
  confirmModalCancel() {
    this.isConfirmModalVisible = false;
    this.feedDeleteComment = undefined;
  }
}

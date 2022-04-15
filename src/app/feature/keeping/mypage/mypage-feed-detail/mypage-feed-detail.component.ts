import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {StorageService} from "@services/storage.service";
import {FeedService} from "@services/feed.service";
import {User} from "@schemas/user";
import {Feed} from "@schemas/feed";
import {FollowService} from "@services/follow.service";
import {DateUtils} from "../../../../core/utils/date.utils";
import { HostListener } from '@angular/core';
import {FeedComment} from "@schemas/feed-comment";
import {PublicService} from "@services/public.service";
import * as moment from "moment-timezone";

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

  /** feed pagination */
  feedPage: number = 1;
  feedLimit: number = 3;

  selectedFeed: any = {};

  @Input() nowScroll: any;

  isFeedDetail = true;

  feedPageLink: any = {};
  feedPageMeta: any = {};

  /** comment pagination */
  commentPage: number = 1;
  commentLimit: number = 15;

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

  comment_info: string;
  commentInfoVisible: boolean;

  selectedLanguage: string;

  variables: any;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private feedService: FeedService,
    private followService: FollowService,
    private dateUtils: DateUtils,
    private publicService: PublicService,
  ) {
    this.pushEmptyFeed(1);
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.user = this.storageService.getUser();

    this.selectedLanguage = localStorage.getItem('language');
  }

  ngAfterViewInit(): void {
    this.findMyPageFeedList(this.user.id, this.feedPage, this.feedLimit);
  }

  findNextPage(): void {
    if (this.feedPageLink?.next) {
      this.feedPage = this.feedPage + 1;
      this.findMyPageFeedList(this.user.id, this.feedPage, this.feedLimit);
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
          this.feedPageMeta = data?.meta;
          this.feedPageLink = data?.links;

          if (this.feedPage > 1) {
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

  /** 코멘트 */
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

  getFeedCommentList(feed: Feed) {

    console.log('getFeedCommentList feed : ', feed.id);
    console.log('getFeedCommentList feed : ', feed.content);
    console.log('this.user?.id  :  ', this.user?.id);

    this.feedService
      .getFeedCommentList(this.commentPage, this.commentLimit, feed.id, this.user?.id)
      .subscribe(
        (feedCommentList: FeedComment[]) => {

          feedCommentList.forEach((feedComment) => {

            console.log('feedComment  >>>>>  ', feedComment);

            feedComment.begin_timestamp = this.dateUtils.getTimeStamp(feedComment.createdAt);
            feedComment.begin_time_text = this.dateUtils.transTimeType(feedComment.begin_timestamp);

            console.log('feedComment.sub_comment_count : ', feedComment.sub_comment_count);

            // if (feedComment.sub_comment_count !== 0) {
            //   this.feedSubCommentListViewObj[feedComment.id] = true;
            //   feedComment.page = 1;
            //   feedComment.limit = 15;
            //
            //   this.getFeedSubCommentList(1, 15, feedComment.id);
            // }


          });

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

  showCommentView(feed: Feed) {
    console.log('showCommentView : ');
    this.selectedFeed = feed;

    if (this.user) {
      this.getFeedCommentList(feed);
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
      // this.showLoginModal();
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
      // this.showLoginModal();
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

                // this.getFeedCommentList();

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

          // this.getFeedCommentList();

        },
        (e) => {}
      );
  }

  showSubCommentInput(feedComment: FeedComment, parentComment?: FeedComment) {
    // this.feedSubCommentInputValueObj[feedCommentId] = '@' + this.feedSubCommentListObj[feedCommentId].writer
    if (!this.user) {
      // this.showLoginModal();
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
      // this.showLoginModal();
    }
  }


}

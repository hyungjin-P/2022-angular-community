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
import { FeedCommentModalComponent } from '@shared/components/feed-comment-modal/feed-comment-modal.component';
import { OtherUserUtil } from '../../../../core/utils/other-user.util';
import { FeedLikeUserModalComponent } from '@shared/components/feed-like-user-modal/feed-like-user-modal.component';

@Component({
  selector: 'app-feed-follow',
  templateUrl: './feed-follow.component.html',
  styleUrls: ['./feed-follow.component.scss'],
})
export class FeedFollowComponent implements OnInit, AfterViewInit {
  variables: any;
  user: User;
  selectedLanguage: string;
  pageDate: any;

  @ViewChild('scrollEl') scrollEl: ElementRef;
  feedList: Feed[];
  selectedFeed: Feed;

  page: number = 1;
  limit: number = 5;
  pageMeta: any = {};
  pageLink: any = {};

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

  /* 댓글 컴포넌트 */
  @ViewChild('commentModal') commentModal: FeedCommentModalComponent;
  /* 좋아요 컴포넌트 */
  @ViewChild('likeModal') likeModal: FeedLikeUserModalComponent;

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private storageService: StorageService,
    private feedService: FeedService,
    private followService: FollowService,
    private textService: TextService,
    private dateUtils: DateUtils,
    private activateRoute: ActivatedRoute,
    public otherUserUtil: OtherUserUtil
  ) {}

  ngOnInit(): void {
    this.variables = this.globalService.variables;
    this.user = this.storageService.getUser();
    this.selectedLanguage = localStorage.getItem('language');

    // UTC기준 최초 페이지 접속 시점
    this.pageDate = new Date().toISOString();

    this.nowTab = this.tabMenu[1].tabName;
    this.getFeedFollowList();

    // console.log(this.activateRoute);
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
  }

  findNextPage() {
    if (this.pageLink?.next) {
      this.page = this.page + 1;
      this.getFeedFollowList();
    }
  }

  private getFeedFollowList() {
    this.feedService.getFeedFollowList(this.page, this.limit, this.user.id, this.pageDate).subscribe(
      (feedList) => {
        this.pageMeta = feedList.meta;
        this.pageLink = feedList.links;

        if (this.page > 1) {
          this.feedList = [...this.feedList, ...feedList?.items];
        } else {
          this.feedList = feedList.items;
        }

        for (let feed of this.feedList) {
          feed.begin_timestamp = this.dateUtils.getTimeStamp(feed.uploadedAt);
          feed.begin_time_text = this.dateUtils.transTimeType(feed.begin_timestamp);
          feed.writer.isFollow = true;
          feed.contentViewVisible = true;
        }
      },
      (e) => {
        console.error('get feed follow failed : ', e);
        this.feedList = [];
      }
    );
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
      this.feedService.deleteFeedBookmark({ feedId: feed.id, userId }).subscribe(
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

  moreContentView(feed: Feed) {
    feed.contentViewVisible = true;
  }

  moveTab(link: string) {
    this.router.navigateByUrl(link);
  }

  confirmModalConfirm() {
    this.isConfirmModalVisible = false;
  }
  confirmModalCancel() {
    this.isConfirmModalVisible = false;
  }

  /**
   * 피드 댓글 컴포넌트
   * @param feed
   */
  commentModalShow(feed: Feed): void {
    this.commentModal.onModalShow(feed);
  }

  /**
   * 피드 좋아요 컴포넌트
   * @param feed
   */
  likeModalShow(feed: Feed) {
    this.likeModal.onLikeUserModalShow(feed);
  }

  /** 다른 유저 마이페이지 이동 시 로직 */
  moveOtherUserMyPage(user: User, targetUserId): void {
    if (user?.id !== targetUserId) {
      this.otherUserUtil.moveOtherUserMyPage(targetUserId);
      return;
    } else {
      this.otherUserUtil.moveMyPage();
      return;
    }
  }
}

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';

import { FeedService } from '@services/feed.service';
import { PublicService } from '@services/public.service';
import { TextService } from '@services/text.service';

import { Feed } from '@schemas/feed';
import { User } from '@schemas/user';
import { OtherUserUtil } from '../../../../core/utils/other-user.util';

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit, AfterViewInit {
  variables: any;
  user: User;
  feedList: Feed[];

  pageLink: any = {};
  pageMeta: any = {};
  page: number = 1;
  limit: number = 10;
  @ViewChild('scrollEl') scrollEl: ElementRef;

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

  /** 로그인 모달 */
  isLoginModalVisible = false;

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private storageService: StorageService,
    private feedService: FeedService,
    private publicService: PublicService,
    private textService: TextService,
    public otherUserUtil: OtherUserUtil
  ) {}

  ngOnInit() {
    this.variables = this.globalService.variables;
    this.user = this.storageService.getUser();
    this.nowTab = this.tabMenu[0].tabName;

    if (this.user) {
      this.getFeedList();
    } else {
      this.getPublicFeedList();
    }
  }

  ngAfterViewInit() {
    let timer = null;
    this.scrollEl.nativeElement.addEventListener('scroll', () => {
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
        }
      }, 100);
    });
  }

  findNextPage() {
    if (this.pageLink?.next) {
      this.page = this.page + 1;
      if (this.user) {
        this.getFeedList();
      } else {
        this.getPublicFeedList();
      }
    }
  }

  getFeedList() {
    this.feedService.getFeedList(this.page, this.limit, this.user?.id).subscribe(
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

  /** 피드 수정 완료 */
  getPublicFeedList() {
    this.publicService.getFeedList(this.page, this.limit).subscribe(
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

  /** 피드 좋아요 수정 완료 */
  feedLike(feed: Feed): void {
    if (this.user?.id) {
      if (feed.isLike) {
        this.feedService
          .deleteFeedLike({
            feedId: feed.id,
            userId: this.user?.id,
          })
          .subscribe(
            (count) => {
              feed.isLike = false;
              feed.likeCount = count;
            },
            (e) => {
              console.log('cancel like feed error : ', e);
            }
          );
      } else {
        this.feedService
          .createFeedLike({
            feedId: feed.id,
            userId: this.user?.id,
          })
          .subscribe(
            (count) => {
              feed.isLike = true;
              feed.likeCount = count;
            },
            (e) => {
              console.log('like feed error : ', e);
            }
          );
      }
    } else {
      this.loginModalShow();
    }
  }

  moveFeedDetail(feed: Feed) {
    console.log('is bookmark : ', feed.isBookmark);
    this.router.navigateByUrl(`/feed/${feed.id}`).then();
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
        (error) => {}
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
        () => {}
      );
    }
  }

  moveTab(link: string) {
    if (this.user) {
      // this.router.navigateByUrl(link+ `/${this.user.id}?tabType=follow`).then();
      this.router.navigateByUrl('/follow').then();
    } else {
      if (link === '/feed/follow') {
        this.loginModalShow();
      } else {
        this.router.navigateByUrl(link).then();
      }
    }
  }

  /** 로그인 모달 */
  loginModalShow() {
    this.isLoginModalVisible = true;
  }

  /** 로그인 모달 */
  loginModalConfirm() {
    this.isLoginModalVisible = false;
    this.router.navigateByUrl('/auth/login').then();
  }

  /** 로그인 모달 */
  loginModalCancel() {
    this.isLoginModalVisible = false;
  }

  /** 로그인 모달 */
  loginModalAnother() {
    this.isLoginModalVisible = false;
    this.router.navigateByUrl('/auth/registration').then();
  }

  /** 다른 유저 마이페이지 이동 시 로직 */
  moveOtherUserMyPage(user: User, targetUserId): void {
    if (!this.user) {
      this.loginModalShow();
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';

import { FeedService } from '@services/feed.service';
import { PublicService } from '@services/public.service';
import { TextService } from '@services/text.service';

import { Feed } from '@schemas/feed';
import { User } from '@schemas/user';

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  variables: any;
  user: User;
  feedList: Feed[];
  page: number = 1;
  limit: number = 20;

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

  isLoginModalVisible = false;

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private storageService: StorageService,
    private feedService: FeedService,
    private publicService: PublicService,
    private textService: TextService
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

  getFeedList() {
    this.feedService.getFeedList(this.page, this.limit, this.user?.id).subscribe(
      (feedList: any) => {
        this.feedList = feedList.items;
      },
      (e) => {
        console.log('public feed list find failed', e);
      }
    );
  }

  /** 피드 수정 완료 */
  getPublicFeedList() {
    this.publicService.getFeedList(this.page, this.limit).subscribe(
      (feedList: any) => {
        this.feedList = feedList.items;
      },
      (e) => {
        console.log('public feed list find failed', e);
      }
    );
  }

  /** 피드 좋아요 수정 중 */
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
      this.showLoginModal();
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

  moveTab(link: string) {
    if (this.user) {
      // this.router.navigateByUrl(link+ `/${this.user.id}?tabType=follow`).then();
      this.router.navigateByUrl('/follow').then();
    } else {
      if (link === '/feed/follow') {
        this.showLoginModal();
      } else {
        this.router.navigateByUrl(link).then();
      }
    }
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
}

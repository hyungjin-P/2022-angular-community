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
import { FeedDetailModalComponent } from '@shared/components/feed-detail-modal/feed-detail-modal.component';

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

  pageDate: any;

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

  /* 피드 상세 모달 */
  @ViewChild('feedDetailModal') feedDetailModal: FeedDetailModalComponent;
  selectFeedId: string;

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private storageService: StorageService,
    private feedService: FeedService,
    private publicService: PublicService,
    private textService: TextService,
    public otherUserUtil: OtherUserUtil
  ) {
  }

  ngOnInit() {
    this.variables = this.globalService.variables;
    this.user = this.storageService.getUser();
    this.nowTab = this.tabMenu[0].tabName;

    // UTC기준 최초 페이지 접속 시점
    this.pageDate = new Date().toISOString();

    if (this.user) {
      this.getFeedList();
    } else {
      this.getPublicFeedList();
    }
  }

  ngAfterViewInit() {
    // 스크롤로 자동 리스트 추가 (자동 스크롤)
    let timer = null;
    this.scrollEl.nativeElement.addEventListener('scroll', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const scrollHeight = this.scrollEl.nativeElement.scrollHeight;
        const scrollTop = this.scrollEl.nativeElement.scrollTop;
        const per = (scrollTop / scrollHeight) * 100;
        const def = scrollHeight - scrollTop;

        if (def < 1200) {
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

  /** 피드 수정 완료 */
  getFeedList() {
    this.feedService.getFeedList(this.page, this.limit, this.user?.id, this.pageDate).subscribe(
      (feedList: any) => {
        this.pageMeta = feedList.meta;
        this.pageLink = feedList.links;

        if (this.page > 1) {
          this.feedList = [...this.feedList, ...feedList?.items];
        } else {
          this.feedList = feedList.items;
        }
      },
      () => {
      }
    );
  }

  getPublicFeedList() {
    this.publicService.getFeedList(this.page, this.limit, this.pageDate).subscribe(
      (feedList: any) => {
        this.pageMeta = feedList.meta;
        this.pageLink = feedList.links;

        if (this.page > 1) {
          this.feedList = [...this.feedList, ...feedList?.items];
        } else {
          this.feedList = feedList.items;
        }
      },
      (e) => {
      }
    );
  }

  // 피드 내 탭 메뉴 이동
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

  /* 피드 상세 모달창 동작 */
  feedDetailModalShow(selectedFeedId: string) {
    this.selectFeedId = selectedFeedId;
    this.feedDetailButtonCheck();
    this.feedDetailModal.onModalShow(selectedFeedId);
  }

  feedDetailModalPrev() {
    const nowFeedIndex = this.feedList.findIndex((feed) => feed.id === this.selectFeedId);

    let prevFeedId: string = null;

    if (nowFeedIndex > 0) {
      prevFeedId = this.feedList[nowFeedIndex - 1].id;
      this.selectFeedId = prevFeedId;
      this.feedDetailButtonCheck();
      this.feedDetailModal.onChangeData(prevFeedId);
    }
  }

  feedDetailModalNext() {
    const nowFeedIndex = this.feedList.findIndex((feed) => feed.id === this.selectFeedId);
    let nextFeedId: string = null;

    if (this.feedList.length - 1 > nowFeedIndex) {
      nextFeedId = this.feedList[nowFeedIndex + 1].id;
      this.selectFeedId = nextFeedId;
      this.feedDetailButtonCheck();
      this.feedDetailModal.onChangeData(nextFeedId);
    }

    // 남은 게시물이 5개 이하 이하일 때 미리 페이지를 불러서 리스트에 추가함.
    if (this.feedList.length - nowFeedIndex < 5) {
      this.findNextPage();
    }
  }

  feedDetailButtonCheck() {
    const nowFeedIndex = this.feedList.findIndex((feed) => feed.id === this.selectFeedId);

    this.feedDetailModal.prevDisable = false;
    this.feedDetailModal.nextDisable = false;

    if (nowFeedIndex === 0) {
      this.feedDetailModal.prevDisable = true;
    } else if (nowFeedIndex === this.feedList.length - 1) {
      this.feedDetailModal.nextDisable = true;
    }
  }
}

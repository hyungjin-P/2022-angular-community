import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';

import { User } from '@schemas/user';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  url: string;
  isDrawerMenu: boolean;

  variables: any;
  globalUser: any;
  user: User;
  userBoxVisible: boolean;

  tabData: any = {
    feed: [
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
    ],
    magazine: [
      {
        tabName: 'news',
        languageCode: 'common.nav.magazine-tab.news',
        link: '/magazine?tabType=news',
        description: '매거진 뉴스',
        sort: 0,
      },
      {
        tabName: 'release-news',
        languageCode: 'common.nav.magazine-tab.release-news',
        link: '/magazine?tabType=release-news',
        description: '발매소식',
        sort: 1,
      },
    ],
  };

  tabMenu: any[] = [];
  nowTab: '';

  isLoginModalVisible = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.url = this.router.url;
    this.isDrawerMenu = this.url.indexOf('/settings') !== -1 || this.url.indexOf('/mypage') !== -1;
    this.variables = this.globalService.variables;
    this.globalUser = this.globalService.user;
    this.user = this.storageService.getUser();

    this.userBoxVisible = false;
    this.changeTab(this.route.snapshot.routeConfig.path);
  }

  openNav() {
    this.variables.isNavOpen = !this.variables.isNavOpen;
  }

  openDrawer() {
    this.variables.isDrawerOpen = true;
  }

  moveTab(link: string): void {
    if (this.user) {
      this.router.navigateByUrl(link).then(() => {
        this.changeTab(this.route.snapshot.routeConfig.path);
      });
    } else {
      if (link === '/feed/follow') {
        this.showLoginModal();
      } else {
        this.router.navigateByUrl(link).then(() => {
          this.changeTab(this.route.snapshot.routeConfig.path);
        });
      }
    }
  }

  changeTab(routingPath): void {
    if (routingPath === 'feed' || routingPath === 'feed/:feed_id' || routingPath === 'feed/follow') {
      if (routingPath === 'feed/:feed_id') {
        routingPath = 'feed';
      }

      // 찬우님 이거 고쳐주세요.
      // feed랑 feed-follow가 하는 일이 아예 달라서 분리하는게 좋을 것 같은데
      // queryParams로 route에서 어떻게 분리하는지 모르겠어서 일단 이렇게 작업 해놨어요.

      if (routingPath === 'feed/follow') {
        this.tabMenu = this.tabData.feed;
        this.nowTab = this.tabMenu[1].tabName;
      } else {
        this.tabMenu = this.tabData[routingPath];
        if (!this.route.snapshot.queryParams.tabType) {
          this.nowTab = this.tabMenu[0].tabName;
        } else {
          this.nowTab = this.tabMenu.filter(
            (tab) => tab.tabName === this.route.snapshot.queryParams.tabType
          )[0].tabName;
        }
      }
    }
  }

  openUserBox(event) {
    event.stopPropagation();

    if (this.userBoxVisible) {
      this.closeUserBox();
    } else {
      this.userBoxVisible = true;
    }
  }

  closeUserBox() {
    this.userBoxVisible = false;
  }

  async logout() {
    await this.storageService.removeUser();
    this.router.navigateByUrl('/').then();
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

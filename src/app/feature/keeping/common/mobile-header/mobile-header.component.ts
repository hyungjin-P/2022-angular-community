import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss'],
})
export class MobileHeaderComponent implements OnInit {
  @Input() text: string;
  @Output() goBack = new EventEmitter<any>();

  /* 스크랩 페이지 전용 탭 */
  tabData: any = [
    {
      tabName: 'feed',
      languageCode: 'common.service-name.feed',
      link: '/scrap/feed',
      description: '피드 스크랩',
    },
    {
      tabName: 'magazine',
      languageCode: 'common.service-name.magazine',
      link: '/scrap/magazine',
      description: '매거진 스크랩',
    },
  ];

  tabMenu: any[] = [];
  nowTab: '';

  constructor(private router: Router) {
    if (this.router.routerState.snapshot.url.indexOf('scrap') > 0) {
      router.events.subscribe((event: NavigationStart) => {
        // 새로고침 제어
        if (event.navigationTrigger === 'popstate') {
          const tabName = event.url.split('/')[2];
          this.nowTab = this.tabMenu.filter((tab) => tab.tabName === tabName)[0].tabName;
        }
      });
    }
  }

  ngOnInit(): void {
    this.changeTab();
  }

  _goBack() {
    this.goBack.emit({});
  }

  moveTab(link: string): void {
    this.router.navigateByUrl(link).then(() => {
      this.changeTab();
    });
  }

  changeTab(): void {
    if (this.router.routerState.snapshot.url.indexOf('scrap') > 0) {
      this.tabMenu = this.tabData;
      const tabName = this.router.routerState.snapshot.url.split('/')[2];
      this.nowTab = this.tabMenu.filter((tab) => tab.tabName === tabName)[0].tabName;
    }
  }

  getBoxShadow() {
    if (this.tabMenu.length > 0) return 0;
    else return '0px 3px 5px rgb(235 235 235 / 50%)';
  }
}

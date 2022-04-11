import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';
import { User } from '@schemas/user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-scrap',
  templateUrl: './scrap.component.html',
  styleUrls: ['./scrap.component.scss'],
})
export class ScrapComponent implements OnInit {
  url: string;

  variables: any;
  globalUser: any;
  user: User;
  userBoxVisible: boolean;

  tabMenu: any = [
    {
      tabName: 'feed',
      languageCode: 'keeping.scrap.nav.feed-tab',
      link: '/scrap/feed',
      description: '피드 스크랩',
    },
    {
      tabName: 'magazine',
      languageCode: 'keeping.scrap.nav.magazine-tab',
      link: '/scrap/magazine',
      description: '매거진 스크랩',
    },
  ];

  nowTab: '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private storageService: StorageService,
    private location: Location
  ) {}

  ngOnInit() {
    this.url = this.router.url;
    this.variables = this.globalService.variables;
    this.globalUser = this.globalService.user;
    this.user = this.storageService.getUser();

    this.userBoxVisible = false;
    this.changeTab();
  }

  openNav() {
    this.variables.isNavOpen = !this.variables.isNavOpen;
  }

  moveTab(link: string): void {
    this.router.navigateByUrl(link).then(() => {
      this.changeTab();
    });
  }

  changeTab(): void {
    const tabName = this.router.routerState.snapshot.url.split('/')[2];
    this.nowTab = this.tabMenu.filter((tab) => tab.tabName === tabName)[0].tabName;
  }

  goBack() {
    this.location.back();
  }
}

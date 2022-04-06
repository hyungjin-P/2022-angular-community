import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';
import { PublicService } from '@services/public.service';
import { MagazineService } from '@services/magazine.service';
import { User } from '@schemas/user';
import { Magazine } from '@schemas/magazine';

@Component({
  selector: 'magazine',
  templateUrl: './magazine.component.html',
  styleUrls: ['./magazine.component.scss'],
})
export class MagazineComponent implements OnInit {
  language: string;
  variables: any;
  user: User;
  category: string = 'all';
  topMagazineList: Magazine[];
  magazineList: Magazine[];
  page: number = 1;
  limit: number = 20;

  tabMenu: any = [
    {
      tabName: 'all',
      languageCode: 'common.nav.magazine-tab.all',
      link: '/magazine?tabType=all',
      description: '전체',
      sort: 0,
    },
    {
      tabName: 'news',
      languageCode: 'common.nav.magazine-tab.magazine_category_news',
      link: '/magazine?tabType=news',
      description: '매거진 뉴스',
      sort: 0,
    },
    {
      tabName: 'release',
      languageCode: 'common.nav.magazine-tab.magazine_category_release',
      link: '/magazine?tabType=release',
      description: '발매 소식',
      sort: 0,
    },
    {
      tabName: 'writer',
      languageCode: 'common.nav.magazine-tab.magazine_category_artist',
      link: '/magazine?tabType=writer',
      description: '작가, 작품 인터뷰',
      sort: 0,
    },
  ];

  // tabMenu: any[] = [];
  nowTab = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private magazineService: MagazineService,
    private storageService: StorageService,
    private publicService: PublicService
  ) {}

  ngOnInit() {
    this.variables = this.globalService.variables;
    this.user = this.storageService.getUser();
    this.language = localStorage.getItem('language');
    this.getMagazineList();
    this.changeTab();

    if (this.user) {
      this.getMagazineList();
    } else {
      this.getPublicMagazineList();
    }
  }

  changeBody(magazineList: Magazine[]) {
    if (this.language === 'ko') {
      magazineList.forEach((v) => {
        v.body = v.ko;
      });
    } else {
      magazineList.forEach((v) => {
        v.body = v.en;
      });
    }
  }

  getMagazineList() {
    this.magazineService.getMagazineList(this.page, this.limit, this.category, this.user?.id).subscribe(
      (magazineList: any) => {
        if (this.topMagazineList === undefined) {
          this.topMagazineList = magazineList.items;
          this.changeBody(this.topMagazineList);
        }
        this.magazineList = magazineList.items;
        this.changeBody(this.magazineList);
      },
      (e) => {
        console.log('magazine list find failed', e);
      }
    );
  }

  getPublicMagazineList() {
    this.publicService.getMagazineList(this.page, this.limit, this.category).subscribe(
      (magazineList: any) => {
        if (this.topMagazineList === undefined) {
          this.topMagazineList = magazineList.items;
          this.changeBody(this.topMagazineList);
        }
        this.magazineList = magazineList.items;
        this.changeBody(this.magazineList);
      },
      (e) => {
        console.log('magazine list find failed', e);
      }
    );
  }

  moveTab(link: string): void {
    this.router.navigateByUrl(link).then(() => {
      this.changeTab();
    });
  }

  changeTab(): void {
    if (!this.route.snapshot.queryParams.tabType) {
      this.nowTab = this.tabMenu[0].tabName;
    } else {
      this.nowTab = this.tabMenu.filter((tab) => tab.tabName === this.route.snapshot.queryParams.tabType)[0].tabName;
      if (this.nowTab === 'all') {
        this.category = 'all';
      } else {
        this.category = 'magazine_category_' + this.nowTab;
      }
      this.getMagazineList();
    }
  }
}

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class MagazineComponent implements OnInit, AfterViewInit {
  language: string;
  variables: any;
  user: User;

  category: string = 'all';
  topMagazineList: Magazine[];
  magazineList: Magazine[];

  pageLink: any = {};
  pageMeta: any = {};
  page: number = 1;
  limit: number = 20;

  @ViewChild('scrollEl') scrollEl: ElementRef;

  isLoginModalVisible = false;

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
      tabName: 'artist',
      languageCode: 'common.nav.magazine-tab.magazine_category_artist',
      link: '/magazine?tabType=artist',
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

    this.nowTab = this.route.snapshot.queryParams.tabType;
    this.getTopMagazineList();
  }

  ngAfterViewInit() {
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

  private findNextPage() {
    if (this.pageLink?.next) {
      this.page = this.page + 1;
      if (this.user) {
        this.getMagazineList();
      } else {
        this.getPublicMagazineList();
      }
    }
  }

  changeBody(magazineList: Magazine[]) {
    if (this.language === 'ko') {
      magazineList.forEach((v) => {
        v.body = v.ko;

        if (v.tags.length > 0) {
          let tagsStr = '';
          v.tags.forEach((tag) => {
            tagsStr += '#' + tag.nameKo + ' ';
          });
          v.tagsStr = tagsStr;
        }
      });
    } else {
      magazineList.forEach((v) => {
        v.body = v.en;

        if (v.tags.length > 0) {
          let tagsStr = '';
          v.tags.forEach((tag) => {
            tagsStr += '#' + tag.nameEn + ' ';
          });
          v.tagsStr = tagsStr;
        }
      });
    }
  }

  getTopMagazineList() {
    if (this.user) {
      this.magazineService.getMagazineList(1, 5, 'all', this.user?.id).subscribe((magazineList) => {
        this.topMagazineList = magazineList.items;
        this.changeBody(this.topMagazineList);
        if (this.nowTab !== undefined) {
          this.changeTab();
        } else {
          this.moveTab('/magazine?tabType=all');
        }
      });
    } else {
      this.publicService.getMagazineList(1, 5, 'all').subscribe((magazineList) => {
        this.topMagazineList = magazineList.items;
        this.changeBody(this.topMagazineList);
        if (this.nowTab !== undefined) {
          this.changeTab();
        } else {
          this.moveTab('/magazine?tabType=all');
        }
      });
    }
  }

  getMagazineList() {
    this.magazineService.getMagazineList(this.page, this.limit, this.category, this.user?.id).subscribe(
      (magazineList: any) => {
        this.pageMeta = magazineList?.meta;
        this.pageLink = magazineList?.links;

        if (this.page > 1) {
          this.magazineList = [...this.magazineList, ...magazineList?.items];
        } else {
          this.magazineList = magazineList.items.filter(
            (magazine) => !this.topMagazineList.some((topMagazine) => magazine.id === topMagazine.id)
          );
        }
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
        this.pageMeta = magazineList?.meta;
        this.pageLink = magazineList?.links;

        if (this.page > 1) {
          this.magazineList = [...this.magazineList, ...magazineList?.items];
        } else {
          this.magazineList = magazineList.items.filter(
            (magazine) => !this.topMagazineList.some((topMagazine) => magazine.id === topMagazine.id)
          );
        }

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
    this.page = 1;
    if (!this.route.snapshot.queryParams.tabType) {
      this.nowTab = this.tabMenu[0].tabName;
    } else {
      this.nowTab = this.tabMenu.filter((tab) => tab.tabName === this.route.snapshot.queryParams.tabType)[0].tabName;
      if (this.nowTab === 'all') {
        this.category = 'all';
      } else {
        this.category = 'magazine_category_' + this.nowTab;
      }
      if (this.user) {
        this.getMagazineList();
      } else {
        this.getPublicMagazineList();
      }
    }
  }

  moveLink(magazine: Magazine) {
    //조회수 증가
    this.createMagazineView(magazine);
    //링크 이동
    window.location.href = magazine.body.body;
  }

  createMagazineView(magazine: Magazine) {
    let userId = '';
    if (!this.user) {
      userId = localStorage.getItem('undefinedUser');
    } else {
      userId = this.user.id;
    }

    this.magazineService.createView(magazine.id, userId).subscribe((v) => {});
  }

  toggleBookmark(magazine: Magazine) {
    if (!this.user) {
      this.showLoginModal();
    } else {
      if (magazine.isBookmark) {
        this.deleteBookmark(magazine);
      } else {
        this.createBookmark(magazine);
      }
    }
  }

  createBookmark(magazine: Magazine) {
    this.magazineService.createBookmark(magazine.id, this.user.id).subscribe(
      (data) => {
        magazine.isBookmark = true;
      },
      (error) => {
        console.error('bookmark add failed: ', error);
      }
    );
  }

  deleteBookmark(magazine: Magazine) {
    this.magazineService.deleteBookmark(magazine.id, this.user.id).subscribe(
      (data) => {
        magazine.isBookmark = false;
      },
      (error) => {
        console.error('bookmark cancel failed: ', error);
      }
    );
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

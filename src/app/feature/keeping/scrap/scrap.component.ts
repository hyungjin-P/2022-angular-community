import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';
import { User } from '@schemas/user';
import { ScrapFeedComponent } from './scrap-feed/scrap-feed.component';
import { ScrapMagazineComponent } from './scrap-magazine/scrap-magazine.component';

@Component({
  selector: 'app-scrap',
  templateUrl: './scrap.component.html',
  styleUrls: ['./scrap.component.scss'],
})
export class ScrapComponent implements OnInit, AfterViewInit, OnDestroy {
  url: string;

  variables: any;
  globalUser: any;
  user: User;
  userBoxVisible: boolean;

  selectLanguage;

  viewType = 'desktop';

  @ViewChild('scrollEl') scrollEl: ElementRef;

  scrapFeed: ScrapFeedComponent;
  scrapMagazine: ScrapMagazineComponent;

  subscription: any;

  nowTab = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private storageService: StorageService
  ) {
    this.viewType = window.outerWidth > 991 ? 'desktop' : 'mobile';
    let timer = null;
    window.addEventListener('resize', (data) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.viewType = window.outerWidth > 991 ? 'desktop' : 'mobile';
      }, 200);
    });

    // 페이지 이동 제어
    this.subscription = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (val.url === '/scrap/feed') {
          this.nowTab = 'feed';
        } else if (val.url === '/scrap/magazine') {
          this.nowTab = 'magazine';
        } else {
          this.nowTab = 'feed';
        }
      }
    });
  }

  ngOnInit() {
    this.url = this.router.url;
    this.variables = this.globalService.variables;
    this.globalUser = this.globalService.user;
    this.user = this.storageService.getUser();
    this.selectLanguage = localStorage.getItem('language');

    this.userBoxVisible = false;
  }

  ngAfterViewInit(): void {
    if (this.viewType === 'mobile') {
      // 스크롤로 자동 리스트 추가 (자동 스크롤)
      let timer = null;
      this.scrollEl.nativeElement.addEventListener('scroll', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const scrollHeight = this.scrollEl.nativeElement.scrollHeight;
          const scrollTop = this.scrollEl.nativeElement.scrollTop;
          const per = (scrollTop / scrollHeight) * 100;
          const def = scrollHeight - scrollTop;

          if (def < 800) {
            if (this.nowTab === 'feed' && this.scrapFeed) {
              this.scrapFeed.findNextPage();
            } else if (this.nowTab === 'magazine' && this.scrapMagazine) {
              this.scrapMagazine.findNextPage();
            }
          }
        }, 100);
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openNav() {
    this.variables.isNavOpen = !this.variables.isNavOpen;
  }

  goBack(): void {
    // this.router.navigateByUrl('/feed');
    window.history.back();
  }

  /* router-outlet active 시, 아래 자식 컴포넌트 가져오기 */
  onActivate(componentRef: any) {
    if (componentRef.isScrapFeed) {
      this.scrapFeed = componentRef;
    } else if (componentRef.isScrapMagazine) {
      this.scrapMagazine = componentRef;
    }
  }
}

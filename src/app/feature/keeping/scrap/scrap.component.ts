import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';
import { User } from '@schemas/user';
import { Location } from '@angular/common';
import { Navigation } from 'swiper';
import { ScrapFeedComponent } from './scrap-feed/scrap-feed.component';
import { ScrapMagazineComponent } from './scrap-magazine/scrap-magazine.component';
// import {window} from "rxjs/operators";

@Component({
  selector: 'app-scrap',
  templateUrl: './scrap.component.html',
  styleUrls: ['./scrap.component.scss'],
})
export class ScrapComponent implements OnInit, AfterViewInit {
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
    /*this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        // console.log(val);
        if (val.url === '/scrap/feed') {
          console.log('feed');
        } else if (val.url === '/scrap/magazine') {
          console.log('magazine');
        } else {
          console.log('unknown');
        }
      }
    });*/
    if (this.viewType === 'mobile') {
      let timer = null;
      this.scrollEl.nativeElement.addEventListener('scroll', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const scrollHeight = this.scrollEl.nativeElement.scrollHeight;
          const scrollTop = this.scrollEl.nativeElement.scrollTop;
          const per = (scrollTop / scrollHeight) * 100;
          const def = scrollHeight - scrollTop;

          if (def < 1000) {
            // 현재 location 불러와서 피드 매거진 추가 검색 이벤트 진행
            // this.mypageFeedDetail.findNextPage();
          }
        }, 100);
      });
    }
  }

  openNav() {
    this.variables.isNavOpen = !this.variables.isNavOpen;
  }

  goBack(): void {
    // this.router.navigateByUrl('/feed');
    window.history.back();
  }
}

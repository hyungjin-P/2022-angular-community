import {AfterViewInit, Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';

import { User } from '@schemas/user';
import {Subscription} from "rxjs";
import {ActivatedRouteSnapshot, NavigationStart, ResolveEnd, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {filter} from "rxjs/operators";

declare const $;

export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  variables: any;
  modal: any;
  toast: any;

  user: User;

  subscription: Subscription;

  constructor(
    private translate: TranslateService,
    private globalService: GlobalService,
    private storageService: StorageService,
    private router: Router,
    private title: Title,

  ) {
    this.subscription = router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
           browserRefresh = !router.navigated;
        }
      });
  }

  ngOnInit(): void {
    this.variables = this.globalService.variables;
    this.modal = this.globalService.modal;
    this.toast = this.globalService.toast;

    if (window.hasOwnProperty('ontouchstart')) {
      this.variables.isTouchScreen = true;
    }

    this.user = this.storageService.getUser();

    if (this.user && this.globalService.variables.isLogin === false) {
      this.storageService.setUser(this.user);
    }

    if (!this.user) {
      let undefinedUserCode = localStorage.getItem('undefinedUser');
      if (!undefinedUserCode) {
        undefinedUserCode = 'undefinedUser-' + Math.floor(Math.random() * 1000000001);
        localStorage.setItem('undefinedUser', undefinedUserCode);
      }
    }

    this.translate.setDefaultLang('ko');
    let language = localStorage.getItem('language');
    if (language) {
      this.translate.use(language);
    } else {
      language = navigator.language || 'ko';
      if (language.indexOf('-') != -1) {
        language = language.split('-')[0];
      }
      localStorage.setItem('language', language);
      this.translate.use(language);
    }

    this.setUpTitleListener();
  }

  ngAfterViewInit(): void {
    // bootstrap modal
    $('.modal').on('shown.bs.modal', function()  {
      const urlReplace = '#' + $(this).attr('id');
      history.pushState(null, null, urlReplace);
    });

    $(window).on('popstate', function() {
      $('.modal').modal('hide');
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  hideModal(): void {
    this.globalService.hideModal();
  }

  hideToast(): void {
    this.globalService.hideToast();
  }

  private setUpTitleListener() {
    this.router.events
      .pipe(filter(e => e instanceof ResolveEnd))
      .subscribe((e: ResolveEnd) => {
        const {data} = getDeepestChildSnapshot(e.state.root);
        if (data?.title) {
          this.title.setTitle(data.title);
        }
      });
  }
}

function getDeepestChildSnapshot(snapshot: ActivatedRouteSnapshot) {
  let deepestChild = snapshot.firstChild;

  while (deepestChild?.firstChild) {
    deepestChild = deepestChild.firstChild
  }

  return deepestChild || snapshot;
}

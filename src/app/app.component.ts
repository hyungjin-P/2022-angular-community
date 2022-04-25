import {AfterViewInit, Component, HostListener, Inject, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';

import { User } from '@schemas/user';

declare const $;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  variables: any;
  modal: any;
  toast: any;

  user: User;

  constructor(
    private translate: TranslateService,
    private globalService: GlobalService,
    private storageService: StorageService,
  ) {
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
  }

  ngAfterViewInit(): void {
    // bootstrap modal
    $(".modal").on("shown.bs.modal", function()  {
      const urlReplace = "#" + $(this).attr('id');
      history.pushState(null, null, urlReplace);
    });

    $(window).on('popstate', function() {
      $(".modal").modal('hide');
    });
  }

  hideModal() {
    this.globalService.hideModal();
  }

  hideToast() {
    this.globalService.hideToast();
  }
}

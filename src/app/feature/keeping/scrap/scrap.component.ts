import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';
import { User } from '@schemas/user';
import { Location } from '@angular/common';
import { Navigation } from 'swiper';
// import {window} from "rxjs/operators";

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

  selectLanguage;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.url = this.router.url;
    this.variables = this.globalService.variables;
    this.globalUser = this.globalService.user;
    this.user = this.storageService.getUser();
    this.selectLanguage = localStorage.getItem('language');

    this.userBoxVisible = false;
  }

  openNav() {
    this.variables.isNavOpen = !this.variables.isNavOpen;
  }

  goBack(): void {
    // this.router.navigateByUrl('/feed');
    window.history.back();
  }
}

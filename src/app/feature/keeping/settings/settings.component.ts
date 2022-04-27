import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';
import { TextService } from '@services/text.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  variables: any;

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private storageService: StorageService,
    private textService: TextService
  ) {
    this.variables = this.globalService.variables;
  }

  ngOnInit() {
    this.closeDrawer();
  }

  closeDrawer() {
    this.variables.isDrawerOpen = false;
  }

  async logout() {
    await this.storageService.removeUser();
    this.router.navigateByUrl('/').then(() => {
      let message = this.textService.getText('auth:logout:001');
      this.globalService.showToast(message);
    });
  }
}

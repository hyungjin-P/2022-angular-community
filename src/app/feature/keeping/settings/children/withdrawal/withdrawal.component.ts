import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';

import { UserService } from '@services/user.service';

import { User } from '@schemas/user';

@Component({
  selector: 'withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.scss'],
})
export class WithdrawalComponent implements OnInit {
  user: User;
  selectedLanguage: string;

  userWithdrawalReasonList: Array<any>;
  userWithdrawalReasonObj: any;
  directInputText: string;

  currentStep: string;
  required: boolean;

  constructor(
    private router: Router,
    private location: Location,
    private globalService: GlobalService,
    private storageService: StorageService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = this.storageService.getUser();
    this.selectedLanguage = localStorage.getItem('language');

    this.userWithdrawalReasonObj = {};
    this.directInputText = '';

    this.currentStep = '1';
  }

  goBack() {
    this.location.back();
  }

  checkRequired() {
    this.required = !this.required;
  }

  next() {
    if (!this.required) {
      return;
    }

    this.currentStep = '2';
  }

  previous() {
    this.currentStep = '1';
  }

  checkWithdrawalReason(reason: any) {
    if (this.userWithdrawalReasonObj.hasOwnProperty(reason.id)) {
      this.userWithdrawalReasonObj[reason.id] = !this.userWithdrawalReasonObj[reason.id];
    } else {
      this.userWithdrawalReasonObj[reason.id] = true;
    }
  }

  deleteUser() {
    let keys = Object.keys(this.userWithdrawalReasonObj);
    let reasons = [];
    keys.forEach((key) => {
      if (this.userWithdrawalReasonObj[key]) {
        let reason = {
          code_item_id: key,
          text: '',
        };

        if (key == 'user_withdrawal_reason_000') {
          reason['text'] = this.directInputText;
        }

        reasons.push(reason);
      }
    });
  }
}

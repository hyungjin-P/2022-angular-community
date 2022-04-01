import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  isAlertModalVisible = false;
  alertModalData = {
    isIcon: true,
    //iconPath : 'path'
    text: '메인 타이틀을 입력해 주세요',
    subText: `서브 텍스트를 입력해 주세요.
        서브 텍스트를 입력해 주세요.`,
    confirmBtnText: '확인', // 선택
  };

  isConfirmModalVisible = false;
  confirmModalData = {
    isIcon: true,
    //iconPath : 'path'
    text: '메인 타이틀을 입력해 주세요',
    subText: `서브 텍스트를 입력해 주세요.
        서브 텍스트를 입력해 주세요.`,
    cancelBtnText: '취소', // 선택
    confirmBtnText: '확인', // 선택
  };

  isLoginModalVisible = false;

  constructor() {}

  ngOnInit() {}

  showAlertModal() {
    this.isAlertModalVisible = true;
  }

  alertModalOk(): void {
    this.isAlertModalVisible = false;
  }

  alertModalCancel(): void {
    this.isAlertModalVisible = false;
  }

  showConfirmModal() {
    this.isConfirmModalVisible = true;
  }

  confirmModalOk(): void {
    this.isConfirmModalVisible = false;
  }

  confirmModalCancel(): void {
    this.isConfirmModalVisible = false;
  }

  showLoginModal() {
    this.isLoginModalVisible = true;
  }
  loginModalConfirm() {
    this.isLoginModalVisible = false;
  }
  loginModalCancel() {
    this.isLoginModalVisible = false;
  }
  loginModalAnother() {
    this.isLoginModalVisible = false;
  }
}

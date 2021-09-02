import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
    isVisible = false
    visibleData = {
        text: '문구를 입력해주세요.',
        subText: `서브 텍스트 문구를 입력해주세요.
        서브 텍스트 문구를 입력해주세요.`,
        cancelButtonText: '취소', // 선택
        confirmButtonText: '확인', // 선택
    }

    isVisible2 = false
    visibleData2 = {
        text: '문구를 입력해주세요.',
        subText: `서브 텍스트 문구를 입력해주세요.
        서브 텍스트 문구를 입력해주세요.`,
        cancelButtonText: '취소', // 선택
        confirmButtonText: '확인', // 선택
    }

    constructor() {}

    ngOnInit() {}

    showModal() {
        this.isVisible = true
    }

    handleOk(): void {
        console.log('Button ok clicked!')
        this.isVisible = false
    }

    handleCancel(): void {
        console.log('Button cancel clicked!')
        this.isVisible = false
    }

    showModal2() {
        this.isVisible2 = true
    }

    handleOk2(): void {
        console.log('Button ok clicked!')
        this.isVisible2 = false
    }

    handleCancel2(): void {
        console.log('Button cancel clicked!')
        this.isVisible2 = false
    }
}

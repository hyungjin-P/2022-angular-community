import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
    toastVisible = false
    toastText = '초대가 거절되었습니다.'

    constructor() {}

    ngOnInit() {}

    showToast() {
        this.toastVisible = true
    }

    hideToast() {
        this.toastVisible = false
    }
}

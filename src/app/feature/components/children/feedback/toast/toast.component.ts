import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
    isToastVisible = false
    toastText = '텍스트를 입력하세요.'

    constructor() {}

    ngOnInit() {}

    showToast() {
        this.isToastVisible = true
    }

    hideToast() {
        this.isToastVisible = false
    }
}

import { Component, OnInit } from '@angular/core'

import { GlobalService } from '@services/global.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    variables: any
    modal: any
    toast: any

    constructor(private globalService: GlobalService) {
        this.variables = this.globalService.variables
        this.modal = this.globalService.modal
        this.toast = this.globalService.toast
    }

    ngOnInit(): void {
        if (window.hasOwnProperty('ontouchstart')) {
            this.variables.isTouchScreen = true
        }
    }

    hideModal() {
        this.globalService.hideModal()
    }

    hideToast() {
        this.globalService.hideToast()
    }
}

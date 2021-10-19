import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

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

    constructor(private translate: TranslateService, private globalService: GlobalService) {
        this.variables = this.globalService.variables
        this.modal = this.globalService.modal
        this.toast = this.globalService.toast
    }

    ngOnInit(): void {
        this.translate.setDefaultLang('ko')
        let language = localStorage.getItem('language')
        if (language) {
            this.translate.use(language)
        } else {
            language = navigator.language || 'ko'
            localStorage.setItem('language', language)
            this.translate.use(language)
        }

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

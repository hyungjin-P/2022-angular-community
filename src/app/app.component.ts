import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    variables: any
    modal: any
    toast: any

    user: User

    constructor(
        private translate: TranslateService,
        private globalService: GlobalService,
        private storageService: StorageService
    ) {}

    ngOnInit(): void {
        this.variables = this.globalService.variables
        this.modal = this.globalService.modal
        this.toast = this.globalService.toast

        if (window.hasOwnProperty('ontouchstart')) {
            this.variables.isTouchScreen = true
        }

        this.user = this.storageService.getUser()
        if (this.user && this.globalService.variables.isLogin == false) {
            this.storageService.setUser(this.user)
        }

        this.translate.setDefaultLang('ko')
        let language = localStorage.getItem('language')
        if (language) {
            this.translate.use(language)
        } else {
            language = navigator.language || 'ko'
            if (language.indexOf('-') != -1) {
                language = language.split('-')[0]
            }
            localStorage.setItem('language', language)
            this.translate.use(language)
        }
    }

    hideModal() {
        this.globalService.hideModal()
    }

    hideToast() {
        this.globalService.hideToast()
    }
}
